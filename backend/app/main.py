from fastapi import FastAPI
from app.routes.auth import router as auth_router
from app.routes.api import router as api_router
from fastapi.middleware.cors import CORSMiddleware
from app.sockets.socketio_app import sio
import socketio
from contextlib import asynccontextmanager
from app.core.redis_client import redis
from app.config import settings


@asynccontextmanager
async def life_span(app:FastAPI):
    try:
        pong = await redis.ping()
    except Exception as e:
        raise RuntimeError(f'Redis connectio failed. Make sure redis is installed or provide correct url in .env - {e}')

    yield

    await redis.close()

app = FastAPI(lifespan=life_span)

app.include_router(auth_router)
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins = settings.ALLOWED_ORIGINS,
    allow_credentials = True,
    allow_methods = ['*'],
    allow_headers = ['*'],
)

sio_asgi = socketio.ASGIApp(sio,app)


# app.mount('/ws',sio_asgi,name='socketio-app')