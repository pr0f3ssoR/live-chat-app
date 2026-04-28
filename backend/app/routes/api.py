from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import APIRouter,Depends,Body
from app.database.core import get_db
from app.dependencies import verify_jwt,is_user_verified
from app.database.models import User,Conversation,Message
from sqlalchemy import select,insert,or_,and_,text,not_,delete
from app.schemas.user import UserOut
from fastapi import HTTPException,status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import joinedload,selectinload,join
from typing import List
from app.schemas.chat import ConversationOut,UsersOut
from pprint import pprint

router = APIRouter(prefix='/api',dependencies=[Depends(verify_jwt),Depends(is_user_verified)])

def to_dict(obj):
    return {
        column.name: getattr(obj, column.name)
        for column in obj.__table__.columns
    }

@router.get('/u')
async def get_user(db:AsyncSession = Depends(get_db),user_payload:dict = Depends(verify_jwt))->UserOut:
    stmt = select(User).where(User.id == user_payload['user_id'])

    result = await db.execute(stmt)

    user = result.scalar_one_or_none()

    if user:
        return user
    
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail='User not found'
    )

@router.post('/create-conversation/{user_id}')
async def create_conversation(user_id:int,db:AsyncSession = Depends(get_db),user_payload:dict = Depends(verify_jwt)):
    user1_id = user_payload['user_id']
    user2_id = user_id

    insert_values = {
        'participent_a_id':min(user1_id,user2_id),
        'participent_b_id':max(user1_id,user2_id)
    }

    try:
        stmt = insert(Conversation).values(insert_values).returning(Conversation.id)
        result = await db.execute(stmt)
        conversation_id = result.scalar_one()

        await db.commit()
    except IntegrityError as e:
        await db.rollback()
        error = str(e)
        if 'UNIQUE constraint' in error:

            stmt = select(Conversation.id).where(
                Conversation.participent_a_id == min(user1_id,user2_id),
                Conversation.participent_b_id == max(user1_id,user2_id)

            )
            result = await db.execute(stmt)
            conversation = result.scalar_one_or_none()
            return {'conversation_id':conversation}

        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail=error)

    return {'conversation_id':conversation_id}


@router.post('/send-message/{conversation_id}')
async def send_message(conversation_id:int,message:str = Body(...,embed=True),db:AsyncSession = Depends(get_db),user_payload:dict = Depends(verify_jwt)):
    self_user_id = user_payload['user_id']
    stmt = select(Conversation).where(
        and_(
            Conversation.id == conversation_id,
            or_(
                Conversation.participent_a_id == self_user_id,
                Conversation.participent_b_id == self_user_id
            )
        )
    )

    result = await db.execute(stmt)
    conversation = result.scalar_one_or_none()

    if conversation:
        sender_id = conversation.participent_a_id if self_user_id == conversation.participent_a_id else conversation.participent_b_id
        receiver_id = conversation.participent_b_id if sender_id != conversation.participent_b_id else conversation.participent_a_id

        message = Message(sender_id=sender_id,content=message,conversation=conversation)
        conversation.last_message = message

        db.add_all([conversation,message])

        await db.flush()
        await db.commit()


        return {
            'conversation':conversation.to_dict(),
            'message':message.to_dict(),
        }
    
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail='conversation not found')

@router.get('/chats')
async def get_chats(db:AsyncSession = Depends(get_db),user_payload:dict = Depends(verify_jwt))->List[ConversationOut]:
    user_id = user_payload['user_id']

    stmt = select(Conversation)\
    .where(or_(Conversation.participent_a_id == user_id,Conversation.participent_b_id == user_id))\
    .options(joinedload(
        Conversation.last_message
    ))

    result = await db.execute(stmt)
    conversations = result.scalars()

    return conversations

@router.get('/conversations')
async def get_conversations(db:AsyncSession = Depends(get_db),user_payload:dict = Depends(verify_jwt)):
    self_user_id = user_payload['user_id']

    stmt = text('''
            select
                c.id as conv_id,
            case
                when c.participent_a_id =:user_id then c.participent_b_id else c.participent_a_id
            end as user_id,
            case
                when u_a.id =:user_id then u_b.username else u_a.username
            end as username,
            m.content as last_message
            from
                conversations c
            join
                users u_a on
            u_a.id=c.participent_a_id
            join
                users u_b on
            u_b.id=c.participent_b_id
            join
                messages m on
            m.id=c.last_message_id
            where
                c.participent_a_id=:user_id or c.participent_b_id=:user_id
            order by
                m.id desc

''')
    
    result = await db.execute(stmt,{'user_id':self_user_id})

    rows = result.mappings().all()

    return rows

@router.post('/delete-conv/{conv_id}')
async def delete_conv(conv_id:int,db:AsyncSession = Depends(get_db),user_payload:dict = Depends(verify_jwt)):
    stmt = select(Conversation.id).where(
        and_(
            Conversation.id == conv_id,
            or_(
                Conversation.participent_a_id == user_payload['user_id'],
                Conversation.participent_b_id == user_payload['user_id']
            )
        )
    )

    result = await db.execute(stmt)

    conv_id = result.scalar_one_or_none()

    if conv_id:
        await db.execute(delete(Conversation).where(Conversation.id == conv_id))
        await db.execute(delete(Message).where(Message.conversation_id==conv_id))

        await db.commit()

        return {'detail':'success'}
    
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail='conversation does not exist')




@router.get('/conv-user/{conv_id}')
async def get_dispaly_name(conv_id:int,cursor:str = None,db:AsyncSession = Depends(get_db),user_payload:dict = Depends(verify_jwt)):
    stmt = text('''
        select
            case
                when u1.id != :user_id then u1.id else u2.id
        end as id,
            case
                when u1.id != :user_id then u1.username else u2.username
        end as username
        from
            conversations c
        join
            users u1 on
        u1.id = c.participent_a_id
        join
            users u2 on
        u2.id = c.participent_b_id
        where
            c.id = :conv_id and (c.participent_a_id = :user_id or c.participent_b_id = :user_id)
''')
    
    result = await db.execute(stmt,{'user_id':user_payload['user_id'],'conv_id':conv_id})
    user_data = result.mappings().first()

    return user_data

@router.get('/conversations/{conv_id}')
async def get_conversations(conv_id:int,cursor:str = None,db:AsyncSession = Depends(get_db),user_payload:dict = Depends(verify_jwt)):

    try:
        cursor = int(cursor)
    except:
        cursor = None

    self_user_id = user_payload['user_id']

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


    return {
        'messages':rows,
        'page_cursor':last_id
    }

@router.get('/users/')
async def get_users(query:str,db:AsyncSession = Depends(get_db),user_payload:dict = Depends(verify_jwt)):
    stmt = select(User.id,User.name,User.username).where(
        and_(
            User.username.ilike(f'{query}%'),
            not_(User.id == user_payload['user_id'])
        )
    ).limit(10)

    result = await db.execute(stmt)

    users = result.mappings().all()

    return users