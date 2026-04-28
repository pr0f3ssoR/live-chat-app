from pydantic import BaseModel,EmailStr,model_validator
from typing import Optional


class LoginModel(BaseModel):
    email:EmailStr
    password:str

class RegisterModel(BaseModel):
    first_name:str
    last_name:Optional[str] = None
    username:str
    email:EmailStr
    password:str
    confirm_password:str

    @model_validator(mode='after')
    def match_password(self):
        if self.password != self.confirm_password:
            raise ValueError('Password Musth Match!')
        return self
