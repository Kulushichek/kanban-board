from pydantic import Field, BaseModel
from app.schemes.card_schema import CardResponse
from typing import Optional

class ColumnBase(BaseModel):
    title: str = Field(..., min_length=3, max_length = 15)

class ColumnCreate(ColumnBase):
    pass

class ColumnUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=3, max_length = 15)

class ColumnResponse(ColumnBase):
    id: int = Field(..., description="Unique column ID")
    board_id: int = Field(..., description="Board ID")
    cards: list[CardResponse] = []

    class Config:
        from_attributes = True

class ColumnListResponse(BaseModel):
    columns: list[ColumnResponse] = []