from fastapi import FastAPI
from app.routes.auth import router as auth_router
from app.routes.api import router as api_router
from fastapi.middleware.cors import CORSMiddleware
from app.sockets.socketio_app import sio
import socketio

app = FastAPI()

app.include_router(auth_router)
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins = ['http://localhost:5173','http://127.0.0.1:5173',],
    allow_credentials = True,
    allow_methods = ['*'],
    allow_headers = ['*'],
)

sio_asgi = socketio.ASGIApp(sio,app)


# app.mount('/ws',sio_asgi,name='socketio-app')