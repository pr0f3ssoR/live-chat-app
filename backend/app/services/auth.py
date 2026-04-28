from sqlalchemy.ext.asyncio import AsyncSession
from app.database.models.auth import User
from sqlalchemy import select
from app.schemas.auth import LoginModel,RegisterModel
from pwdlib import PasswordHash
from fastapi import HTTPException,status
from sqlalchemy.exc import IntegrityError
from jwt import encode
from app.config import settings
from datetime import datetime,UTC,timedelta
from typing import Tuple
import secrets
import string
from app.core.redis_client import redis


password_hash = PasswordHash.recommended()


def sign_jwt(payload:dict):
    payload['exp'] = datetime.now(UTC) + timedelta(minutes=10)

    access_token = encode(payload,settings.secret_key,settings.algorithm)

    payload['exp'] = datetime.now(UTC) + timedelta(days=7)

    refresh_token = encode(payload,settings.secret_key,settings.algorithm)

    return access_token,refresh_token

class UserService:

    @staticmethod
    async def authenticate_user(login_model:LoginModel,db:AsyncSession,get_tokens:bool = True)-> Tuple[User,str]:
        stmt = select(User).where(User.email == login_model.email)

        result = await db.execute(stmt)

        user = result.scalar_one_or_none()

        if user:
            if password_hash.verify(login_model.password,user.password):
                access_token,refresh_token = sign_jwt({'user_id':user.id,'is_verified':user.is_verifed}) if get_tokens else (None,None)
                return user,access_token,refresh_token
        
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail='Incorrect username or password'
        )

    @staticmethod
    async def create_user(register_model:RegisterModel,db:AsyncSession) -> Tuple[User,str]:
        hashed_password = password_hash.hash(register_model.password)

        user = User(
            name=register_model.first_name,password=hashed_password,**register_model.model_dump(exclude=['password','confirm_password','first_name'])
        )

        db.add(user)
        try:

            await db.commit()
            await db.refresh(user)
            access_token,refresh_token = sign_jwt({'user_id':user.id,'is_verified':user.is_verifed})
            return user,access_token,refresh_token
        
        except IntegrityError as e:
            await db.rollback()

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e.orig)
            )
        


def generate_otp(length:int=6):
    digits = string.digits

    otp = ''.join(secrets.choice(digits) for _ in range(length))

    return otp


async def block_user(user_id):
    await redis.set(f'bu_{user_id}','1',ex=timedelta(minutes=10).seconds)