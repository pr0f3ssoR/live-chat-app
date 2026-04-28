import socketio
from pprint import pprint
from jwt import decode as decode_jwt
from app.config import settings
import uuid
from app.database.core import SessionLocal
from sqlalchemy import select,or_,and_
from app.database.models.chat import Conversation
from sqlalchemy.ext.asyncio import AsyncSession
from app.services.chat import save_message
import json
from app.core.redis_client import redis


class ChatNameSpace(socketio.AsyncNamespace):
    async def on_connect(self, sid, environ,auth):
        try:
            if not auth or "token" not in auth:
                print("No token provided")
                pprint(auth)
                return False

            token = auth["token"]

            user_payload = decode_jwt(
                token,
                settings.secret_key,
                settings.algorithm
            )

            await self.enter_room(sid, user_payload['user_id'])

            print(f'Connected sid: {sid}')
            await redis.set(f'user_{sid}',user_payload['user_id'])

            return True

        except Exception as e:
            print("Auth error:", e) 
            return False

    async def on_disconnect(self,sid):
        await redis.delete(f'user_{sid}')
        print(f'Disconnected sid: {sid}')


    async def on_create_conv_session(self,sid,data):
        if not data or 'conv_id' not in data:
            return False
        
        conv_id = int(data['conv_id'])
        user_id = await redis.get(f'user_{sid}')
        user_id = int(user_id)
        stmt = select(Conversation).where(
        and_(
            Conversation.id == conv_id,
            or_(
                Conversation.participent_a_id == user_id,
                Conversation.participent_b_id == user_id
            )
        )
    )
        async with SessionLocal() as db:
            db:AsyncSession

            result = await db.execute(stmt)
            conv = result.scalar_one_or_none()

            if conv:
                self_user_id = user_id
                other_user_id = conv.participent_a_id if self_user_id == conv.participent_b_id else conv.participent_b_id
                temp_conv_id = str(uuid.uuid4())

                await redis.set(f'conv_{temp_conv_id}',json.dumps([conv_id,self_user_id,other_user_id]),ex=60)

                await self.enter_room(sid,conv_id)
                return {'code':'success','temp_conv_id':temp_conv_id}
            return {'code':'fail','detail':'conversation does not exist'}
        
        
    async def on_send_message(self,sid,data):
        temp_conv_id = data.get('temp_conv_id',None) if data else None

        if temp_conv_id:
            json_conv = await redis.get(f'conv_{temp_conv_id}')
            if json_conv:
                conv_id,user1,user2 = json.loads(json_conv)
                conv_id,user1,user2 = int(conv_id),int(user1),int(user2)

                self_user_id = await redis.get(f'user_{sid}')

                self_user_id = int(self_user_id)

                if conv_id and self_user_id in (user1,user2):
                    mesage_content = data.get('message','')

                    message = {
                        'sender_id':self_user_id,
                        'receiver_id':user2 if self_user_id == user1 else user1,
                        'message':mesage_content
                    }

                    await save_message(conv_id,**message)

                    message['conv_id'] = conv_id

                    await self.emit(f'conv_message_{conv_id}',message,room=conv_id)
                    await self.emit('chat_message',data=message,room=user1)
                    await self.emit('chat_message',message,room=user2)

                    return {'code':'success'}

                
        
        return {'code':'fail'}

                


        
        

