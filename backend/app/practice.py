from app.database.core import SessionLocal
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select,text
from app.database.models.auth import User
from pprint import pprint
import asyncio


async def messages(self_user_id,conv_id,cursor):
    async with SessionLocal() as db:
        db: AsyncSession

        stmt = text(f'''
        select
        m.id as id,
        case
            when m.sender_id=:user_id then 'me' else 'other'
        end as sender,
        m.content as message
        from
            conversations c
        join
            messages m on
        m.conversation_id = c.id
        where
            c.id = :conv_id and (c.participent_a_id = :user_id or c.participent_b_id = :user_id) {'' if cursor == None else 'and m.id < :cursor'}
        order by
            m.id desc
        limit
            20
    ''')

        results = await db.execute(stmt,{'conv_id':conv_id,'user_id':self_user_id,'cursor':cursor})
        rows = results.mappings().all()

        last_id = rows[-1].id if rows else None


        pprint( {
            'messages':rows,
            'page_cursor':last_id
        })


asyncio.run(messages(self_user_id=2,conv_id=1,cursor=1))