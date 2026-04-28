from sqlalchemy.orm import relationship,Mapped,mapped_column
from sqlalchemy import String,Integer,ForeignKey,func,CheckConstraint,Enum,UniqueConstraint
from app.database.core import Base
from typing import TYPE_CHECKING,List
import enum


if TYPE_CHECKING:
    from .auth import User

class StatusEnum(enum.Enum):
    SENT = 'sent'
    DELIVERED = 'delivered'
    READ = 'read'


class Conversation(Base):
    __tablename__ = 'conversations'

    id:Mapped[int] = mapped_column(Integer,primary_key=True)
    participent_a_id:Mapped[int] = mapped_column(ForeignKey('users.id',ondelete='CASCADE'))
    participent_b_id:Mapped[int] = mapped_column(ForeignKey('users.id',ondelete='CASCADE'))
    participent_a: Mapped['User'] = relationship(foreign_keys=[participent_a_id])
    participent_b: Mapped['User'] = relationship(foreign_keys=[participent_b_id],)
    last_message_id: Mapped[int] = mapped_column(ForeignKey('messages.id'),nullable=True,default=None)
    messages: Mapped[List['Message']] = relationship(back_populates='conversation',foreign_keys='Message.conversation_id')
    last_message:Mapped['Message'] = relationship(foreign_keys=[last_message_id],post_update=True)


    __table_args__ = (
        CheckConstraint('participent_a_id < participent_b_id',name='check_pa_<_pb'),
        UniqueConstraint('participent_a_id','participent_b_id',name='unique_participents')
    )

    def to_dict(self):
        return {
            'id':self.id,
            'participent_a_id': self.participent_a_id,
            'participent_b_id':self.participent_b_id,
            'last_message_id':self.last_message_id
        }


class Message(Base):
    __tablename__ = 'messages'

    id:Mapped[int] = mapped_column(Integer,primary_key=True)
    conversation_id:Mapped[int] = mapped_column(ForeignKey('conversations.id',ondelete='CASCADE'))
    sender_id:Mapped[int] = mapped_column(ForeignKey('users.id',ondelete='CASCADE'))
    content:Mapped[str] = mapped_column(String,nullable=True,default='')
    conversation:Mapped['Conversation'] = relationship(back_populates='messages',foreign_keys=[conversation_id])
    sender:Mapped['User'] = relationship()


    def to_dict(self):
        return {
            'id':self.id,
            'conversation_id':self.conversation_id,
            'sender_id':self.sender_id,
            'content':self.content
        }

