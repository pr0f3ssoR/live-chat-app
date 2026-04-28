from sqlalchemy.ext.asyncio import create_async_engine,AsyncSession
from sqlalchemy.orm import DeclarativeBase,sessionmaker
from app.config import settings


class Base(DeclarativeBase):
    pass

# engine = create_async_engine('sqlite+aiosqlite:///my_db.db')
engine = create_async_engine(settings.DATABASE_URL)


SessionLocal = sessionmaker(bind=engine,class_=AsyncSession,expire_on_commit=False)


async def get_db():
    async with SessionLocal() as async_db:
        yield async_db