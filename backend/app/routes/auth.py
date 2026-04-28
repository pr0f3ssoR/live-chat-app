from fastapi import APIRouter,Depends,Response,Cookie,HTTPException,status,Request
from app.schemas.auth import LoginModel,RegisterModel
from app.database.core import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from app.services.auth import UserService,sign_jwt,generate_otp,block_user
from pprint import pprint
from datetime import timedelta,UTC,datetime
from jwt import decode as decode_jwt
from app.config import settings
from app.database.models.auth import User
from sqlalchemy import select,update
from typing import Optional
from app.dependencies import verify_jwt,get_jwt
from app.core.redis_client import redis
from app.core.celery_app import otp_task


router = APIRouter(prefix='/auth')

def to_dict(obj):
    return {
        column.name: getattr(obj, column.name)
        for column in obj.__table__.columns
    }


@router.post('/login')
async def login(response:Response,login_model:LoginModel,db:AsyncSession = Depends(get_db)):
    auth =  await UserService.authenticate_user(login_model,db)
    user,access_token,refresh_token = auth

    response.set_cookie('refresh_token',refresh_token,max_age=int(timedelta(days=7).total_seconds()),secure=False,httponly=True,path='/auth')

    return {
        'user_data':user.to_dict(),
        'token':access_token
    }
    

@router.post('/register')
async def register(response:Response,register_model:RegisterModel,db:AsyncSession = Depends(get_db)):
    register = await UserService.create_user(register_model,db)

    user,access_token,refresh_token = register

    response.set_cookie('refresh_token',refresh_token,max_age=int(timedelta(days=7).total_seconds()),httponly=True,secure=False,path='/auth')

    return {
        'user_data':user.to_dict(),
        'token':access_token
    }


@router.post('/refresh')
async def refresh_token(response:Response,refresh_token:Optional[str]=Cookie(''),db:AsyncSession = Depends(get_db)):
    try:
        user_payload = decode_jwt(refresh_token,settings.secret_key,settings.algorithm)

        stmt = select(User).where(User.id == user_payload['user_id'])
        result = await db.execute(stmt)
        user = result.scalar_one_or_none()

        if user:
            access_token,refresh_token = sign_jwt({'user_id':user.id,'is_verified':user.is_verifed})
            return {
            'access_token':access_token,'refresh_token':refresh_token
            }

        else:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail='User Not Found')
    except:
        response.delete_cookie('refresh_token',secure=False,httponly=True,path='/auth')
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail='invalid refresh token')
    

@router.post('/logout')
async def logout(response:Response,user_payload:dict = Depends(verify_jwt),jwt:str = Depends(get_jwt)):
    response.delete_cookie('refresh_token',secure=False,httponly=True,path='/auth')
    bt_exp = timedelta(minutes=10).seconds
    await redis.set(f'bt_{jwt}','1',bt_exp,nx=True)
    return {'detail':'success'}


@router.post('/verify-user')
async def verify_user(otp:str,user_payload:dict = Depends(verify_jwt),db:AsyncSession = Depends(get_db)):
    user_otp = await redis.get(f'user_otp_{user_payload['user_id']}')

    if user_otp and str(user_otp) == str(otp):
        stmt = update(User).where(User.id==user_payload['user_id']).values(
            is_verifed = True
        )
        await db.execute(stmt)

        await db.commit()

        current_timestamp = str(int(datetime.now(UTC).timestamp()))

        await redis.set(f'u_user_{user_payload['user_id']}',current_timestamp,ex=600)

        await redis.delete(f'user_otp_{user_payload['user_id']}')

        return {'detail':'success'}
    
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail='otp is invalid')


@router.get('/is-verified')
async def is_verified(user_payload:dict = Depends(verify_jwt)):
    message = 'success' if user_payload.get('is_verified',False) else 'fail'

    if message == 'success':
        return {'detail':message}
    
    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,detail='user is not verified')


@router.post('/generate-otp')
async def generate_otp_route(user_payload:dict = Depends(verify_jwt)):

    otp = generate_otp()
    await redis.set(f'user_otp_{user_payload['user_id']}',str(otp),ex=timedelta(minutes=5).seconds)

    otp_task.delay(user_payload['user_id'],otp)

    print(f'Your otp code is: {otp}')

    return {'detail':'success'}



@router.get('/trigger-event/{user_id}')
async def trigger_event(user_id:int, db:AsyncSession = Depends(get_db)):
    stmt = select(User).where(User.id == user_id)

    result = await db.execute(stmt)

    user = result.scalar_one_or_none()

    if user:
        user.is_verifed = False

        db.add(user)
        
        data = to_dict(user)

        await db.commit()

        return data
    
    return {'user':None}