from fastapi.security import HTTPBearer,HTTPAuthorizationCredentials
from jwt import decode
from fastapi import Depends,HTTPException,status
from app.config import settings
from app.core.redis_client import redis
from pprint import pprint

http_bearer = HTTPBearer()

async def verify_jwt(jwt_auth:HTTPAuthorizationCredentials = Depends(http_bearer)):
    jwt_scheme,jwt = jwt_auth.scheme,jwt_auth.credentials
    invalid_crenditals_exception = HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail='Invalid access token'
    )

    if jwt_scheme == 'Bearer':
        try:
            user_payload = decode(jwt,settings.secret_key,settings.algorithm)
            user_id = user_payload['user_id']

            update_user_time = await redis.get(f'u_user_{user_id}')
            if update_user_time and int(update_user_time) > int(user_payload['exp']) - 600:
                raise invalid_crenditals_exception
            return user_payload
        except:
            pass
    
    raise invalid_crenditals_exception


async def is_user_verified(user_payload:dict = Depends(verify_jwt)):
    if not user_payload.get('is_verified',False):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,detail='User not verified')
    return True

async def get_jwt(jwt_auth:HTTPAuthorizationCredentials = Depends(http_bearer)):
    return jwt_auth.credentials