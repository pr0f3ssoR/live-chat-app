from sqlalchemy import select,and_,or_,update,text,exists
from app.database.models.chat import Conversation,Message
from app.database.core import SessionLocal
from sqlalchemy.ext.asyncio import AsyncSession
from pprint import pprint


async def save_message(conv_id,sender_id,receiver_id,message,db:AsyncSession = None):
    should_close_db = False

    if not db:
        should_close_db = True
        db = SessionLocal()

    
    try:
        message_obj = Message(sender_id=sender_id,content=message,conversation_id=conv_id)

        db.add_all([message_obj])

        await db.flush()

        stmt = update(Conversation).values(last_message_id = message_obj.id).where(Conversation.id == conv_id)

        await db.execute(stmt)
        await db.commit()
    finally:
        if should_close_db:
            await db.close()