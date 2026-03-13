from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from database import get_db
from app.services.column_service import ColumnService
from app.schemes.column import ColumnCreate, ColumnResponse, ColumnListResponse, ColumnUpdate

router = APIRouter(
    prefix="/api/columns",
    tags=["Columns"]
)

@router.post("/create", response_model=ColumnResponse, status_code=status.HTTP_201_CREATED)
def create_column(column_data: ColumnCreate, db: Session = Depends(get_db)):
    column_service = ColumnService(db)
    return column_service.create_column(column_data)

@router.get("/all", response_model=ColumnListResponse, status_code=status.HTTP_200_OK)
def get_all_columns(db: Session = Depends(get_db)):
    column_service = ColumnService(db)
    return column_service.get_all_columns()

@router.put("/{column_id}", response_model=ColumnResponse, status_code=status.HTTP_200_OK)
def update_column(column_id: int, column_data: ColumnUpdate, db: Session = Depends(get_db)):
    column_service = ColumnService(db)
    return column_service.update_column(column_id, column_data)

@router.delete("/{column_id}", response_model=ColumnResponse, status_code=status.HTTP_200_OK)
def delete_column(column_id: int, db: Session = Depends(get_db)):
    column_service = ColumnService(db)
    return column_service.delete_column(column_id)
