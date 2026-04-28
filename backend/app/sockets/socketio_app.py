from socketio import AsyncServer
from .namespaces import ChatNameSpace
from socketio import AsyncRedisManager


redis_manager = AsyncRedisManager('redis://127.0.0.1:6379/0')

sio = AsyncServer(async_mode='asgi',cors_allowed_origins="*",client_manager=redis_manager)

sio.register_namespace(ChatNameSpace('/chat'))