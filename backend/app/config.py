from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    ENV: str = "dev"

    secret_key: str | None = None
    DATABASE_URL: str | None = None
    algorithm: str = "HS256"

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


