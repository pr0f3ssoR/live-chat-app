from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    ENV: str = "dev"

    secret_key: str | None = None
    DATABASE_URL: str | None = None
    algorithm: str = "HS256"
    REDIS_HOST:str = 'localhost'
    REDIS_PORT: str = '6379'
    REDIS_DB_INDEX: str = '0'
    ALLOWED_ORIGINS: List[str] = ['http://localhost:5173','http://127.0.0.1:5173',]

    class Config:
        env_file = ".env"
        extra = 'ignore'


settings = Settings()

if settings.ENV == "dev":
    settings.secret_key = settings.secret_key or "dev-secret"
    settings.DATABASE_URL = settings.DATABASE_URL or "sqlite+aiosqlite:///my_db.db"
else:
    if not settings.secret_key or not settings.DATABASE_URL:
        raise ValueError("Missing required environment variables")


