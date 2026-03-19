from pydantic import BaseModel, Field, EmailStr

# Базовая схема
class UserBase(BaseModel):
    email: EmailStr = Field(..., description="User email")

# Схема для создания (POST запрос)
class UserCreate(UserBase):
    password: str = Field(..., min_length=8, max_length=72, description="User password")

# Схема для ответа (GET запрос или ответ после создания)
class UserResponse(UserBase):
    id: int = Field(..., description="Unique user ID")

    # Преобразование объектов из БД в ответы API
    class Config:
        from_attributes = True

