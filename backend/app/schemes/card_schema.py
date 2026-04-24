from pydantic import Field, BaseModel
from typing import Optional
from datetime import date

class CardBase(BaseModel):
    title: str = Field(..., min_length=3, max_length=15)
    deadline: Optional[date] = Field(None, description="Task deadline")
    description: Optional[str] = Field(None, max_length=200, description="Task description")

class CardUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=3, max_length=15)
    deadline: Optional[date] = Field(None, description="Task deadline")
    description: Optional[str] = Field(None, max_length=200, description="Task description")

    column_id: Optional[int] = Field(None, description="Column ID")

class CardMove(BaseModel):
    column_id: int = Field(..., description="New Column ID")
    position: int = Field(..., description="New card position")

class CardCreate(CardBase):
    pass

class CardImageResponse(BaseModel):
    id: int
    file_path: str

    class Config:
        from_attributes = True

class CardResponse(CardBase):
    id: int = Field(..., description="Unique card ID")
    column_id: int = Field(..., description="Column ID")
    position: int = Field(0, description="Position of the card in the column")
    images: list[CardImageResponse] = []

    class Config:
        from_attributes = True

class CardListResponse(BaseModel):
    cards: list[CardResponse] = []