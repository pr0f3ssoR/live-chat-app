from pydantic import BaseModel
from typing import Optional


class LastMessage(BaseModel):
    content:str
    sender_id:str

class ConversationOut(BaseModel):
    participent_a_id:int
    participent_b_id:int
    last_message:Optional[LastMessage] = None

class UsersOut(BaseModel):
    id:int
    name:str
    username:str