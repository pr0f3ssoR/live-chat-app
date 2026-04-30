from socketio import AsyncServer
from .namespaces import ChatNameSpace
from socketio import AsyncRedisManager
from app.config import settings


redis_manager = AsyncRedisManager(f'redis://{settings.REDIS_HOST}:{settings.REDIS_PORT}/{settings.REDIS_DB_INDEX}')

sio = AsyncServer(async_mode='asgi',cors_allowed_origins="*",client_manager=redis_manager)

sio.register_namespace(ChatNameSpace('/chat'))