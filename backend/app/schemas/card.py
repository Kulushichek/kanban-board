from pydantic import Field, BaseModel
from typing import Optional
from datetime import date

class CardBase(BaseModel):
    title: str = Field(..., min_length=3, max_length=15)
    deadline: Optional[date] = Field(None, description="Task deadline")
    description: Optional[str] = Field(None, min_length=3, max_length=200, description="Task description")

class CardUpdate(BaseModel):
    id: int = Field(..., description="Unique card ID")
    title: Optional[str] = Field(None, min_length=3, max_length=15)
    deadline: Optional[date] = Field(None, description="Task deadline")
    description: Optional[str] = Field(None, min_length=3, max_length=200, description="Task description")

class CardCreate(CardBase):
    pass

class CardResponse(CardBase):
    id: int = Field(..., description="Unique card ID")
    column_id: int = Field(..., description="Column ID")

    class Config:
        from_attributes = True

class CardListResponse(BaseModel):
    cards: list[CardResponse] = []