from pydantic import BaseModel, Field
from app.schemas.column import ColumnResponse

class BoardBase(BaseModel):
    title: str = Field(..., min_length=5, max_length=50, description="Board title")

class BoardCreate(BoardBase):
    pass

class BoardResponse(BoardBase):
    id: int = Field(..., description="Unique board ID")
    user_id: int = Field(..., description="User ID")

    class Config:
        from_attributes = True

class BoardDetailResponse(BoardResponse):
    columns: list[ColumnResponse] = []


class BoardListResponse(BaseModel):
    boards: list[BoardResponse] = []