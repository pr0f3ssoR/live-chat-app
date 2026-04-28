from sqlalchemy.orm import mapped_column,relationship,Mapped
from sqlalchemy import String,Integer,Boolean,ForeignKey,DateTime,func
from app.database.core import Base
from typing import TYPE_CHECKING,Optional



class User(Base):
    __tablename__ = 'users'

    id:Mapped[int] = mapped_column(Integer,primary_key=True)
    name:Mapped[str] = mapped_column(String,nullable=False)
    last_name:Mapped[Optional[str]] = mapped_column(String,nullable=True,default=None)
    username:Mapped[str] = mapped_column(String,unique=True,nullable=False)
    email:Mapped[str] = mapped_column(String,unique=True,nullable=False)
    password:Mapped[str] = mapped_column(String,nullable=False)
    is_verifed:Mapped[str] = mapped_column(Boolean,default=False,nullable=False)
    created_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True),server_default=func.now())
    updated_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True),server_default=func.now(),onupdate=func.now())


    def to_dict(self):
        return {
            'id':self.id,
            'name':self.name,
            'username':self.username,
            'email':self.email,
            'password':self.password,
            'is_verified':self.is_verifed
        }



