from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.schemes.column_schema import ColumnCreate, ColumnResponse, ColumnListResponse, ColumnUpdate
from app.repositories.column_repository import ColumnRepository
from app.repositories.board_repository import BoardRepository
from app.repositories.user_repository import UserRepository

class ColumnService:
    def __init__(self, db: Session):
        self.repository = ColumnRepository(db)
        self.board_repository = BoardRepository(db)
        self.user_repository = UserRepository(db)

    def check_user_exists(self, user_id: int):
        user = self.user_repository.get_user_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User with ID {user_id} not found."
            )
    
    def create_column(self, column_data: ColumnCreate, board_id: int, user_id: int) -> ColumnResponse:
        self.check_user_exists(user_id)

        board = self.board_repository.get_board_by_id(board_id, user_id)
        if not board:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Board with ID {board_id} not found. Cannot create column."
            )
        column = self.repository.create_column(column_data, board_id)
        return ColumnResponse.model_validate(column)
    
    def get_all_columns(self, board_id: int, user_id: int) -> ColumnListResponse:
        self.check_user_exists(user_id)

        board = self.board_repository.get_board_by_id(board_id, user_id)
        if not board:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Board with ID {board_id} not found. Cannot get columns."
            )
        columns = self.repository.get_all_columns(board_id)
        list_columns = []
        for column in columns:
            list_columns.append(ColumnResponse.model_validate(column))
        return ColumnListResponse(columns=list_columns)
    
    def get_column_by_id(self, column_id: int, user_id: int) -> ColumnResponse:
        self.check_user_exists(user_id)

        column = self.repository.get_column_by_id(column_id)
        if not column:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Column with ID {column_id} not found. Cannot get column."
            )
        board = self.board_repository.get_board_by_id(column.board_id, user_id)
        if not board:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Board with ID {column.board_id} not found. Cannot get column."
            )
        return ColumnResponse.model_validate(column)
    
    def update_column(self, column_id: int, column_data: ColumnUpdate, user_id: int) -> ColumnResponse:
        self.check_user_exists(user_id)

        self.get_column_by_id(column_id, user_id)

        column = self.repository.update_column(column_id, column_data)
        return ColumnResponse.model_validate(column)
    
    def delete_column(self, column_id: int, user_id: int) -> ColumnResponse:
        self.check_user_exists(user_id)
        self.get_column_by_id(column_id, user_id)

        column = self.repository.delete_column(column_id)
        return ColumnResponse.model_validate(column)