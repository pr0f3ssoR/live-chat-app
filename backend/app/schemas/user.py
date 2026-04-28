from pydantic import BaseModel,EmailStr


class UserOut(BaseModel):
    id:int
    name:str
    last_name:str
    username:str
    email:EmailStr