from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.column_service import ColumnService
from app.schemes.column_schema import ColumnCreate, ColumnResponse, ColumnListResponse, ColumnUpdate

router = APIRouter(
    prefix="/api/columns",
    tags=["Columns"]
)

@router.post("/create/{user_id}/{board_id}", response_model=ColumnResponse, status_code=status.HTTP_201_CREATED)
def create_column(user_id: int, board_id: int, column_data: ColumnCreate, db: Session = Depends(get_db)):
    column_service = ColumnService(db)
    return column_service.create_column(column_data, board_id, user_id)

@router.get("/all/{user_id}/{board_id}", response_model=ColumnListResponse, status_code=status.HTTP_200_OK)
def get_all_columns(user_id: int, board_id: int, db: Session = Depends(get_db)):
    column_service = ColumnService(db)
    return column_service.get_all_columns(board_id, user_id)

@router.put("/{user_id}/{column_id}", response_model=ColumnResponse, status_code=status.HTTP_200_OK)
def update_column(user_id: int, column_id: int, column_data: ColumnUpdate, db: Session = Depends(get_db)):
    column_service = ColumnService(db)
    return column_service.update_column(column_id, column_data, user_id)

@router.delete("/{user_id}/{column_id}", response_model=ColumnResponse, status_code=status.HTTP_200_OK)
def delete_column(user_id: int, column_id: int, db: Session = Depends(get_db)):
    column_service = ColumnService(db)
    return column_service.delete_column(column_id, user_id)
