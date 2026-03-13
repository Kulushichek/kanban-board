from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.schemes.column import ColumnCreate, ColumnResponse, ColumnListResponse, ColumnUpdate
from app.repositories.column_repository import ColumnRepository

class ColumnService:
    def __init__(self, db: Session):
        self.repository = ColumnRepository(db)
    
    def create_column(self, column_data: ColumnCreate, board_id: int) -> ColumnResponse:
        column = self.repository.create_column(column_data, board_id)
        return ColumnResponse.model_validate(column)
    
    def get_all_columns(self, board_id: int) -> ColumnListResponse:
        columns = self.repository.get_all_columns(board_id)
        return ColumnListResponse.model_validate(columns)
    
    def get_column_by_id(self, column_id: int) -> ColumnResponse:
        column = self.repository.get_column_by_id(column_id)
        if not column:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Column with ID {column_id} not found"
            )
        return ColumnResponse.model_validate(column)
    
    def update_column(self, column_id: int, column_data: ColumnUpdate) -> ColumnResponse:
        column = self.repository.update_column(column_id, column_data)
        if not column:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Column with ID {column_id} not found"
            )
        return ColumnResponse.model_validate(column)
    
    def delete_column(self, column_id: int) -> ColumnResponse:
        column = self.repository.delete_column(column_id)
        if not column:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Column with ID {column_id} not found"
            )
        return ColumnResponse.model_validate(column)