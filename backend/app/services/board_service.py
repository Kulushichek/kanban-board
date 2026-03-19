from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.schemes.board import BoardCreate, BoardResponse, BoardListResponse, BoardUpdate
from app.repositories.board_repository import BoardRepository

class BoardService:
    def __init__(self, db: Session):
        self.repository = BoardRepository(db)
    
    def create_board(self, board_data: BoardCreate, user_id: int) -> BoardResponse:
        board = self.repository.create_board(board_data, user_id)
        return BoardResponse.model_validate(board)
    
    def get_all_boards(self, user_id: int) -> BoardListResponse:
        boards = self.repository.get_all_boards(user_id)
        return BoardListResponse.model_validate(boards=boards)
    
    def get_board_by_id(self, board_id: int, user_id: int) -> BoardResponse:
        board = self.repository.get_board_by_id(board_id, user_id)
        if not board:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Board with ID {board_id} not found"
            )
        return BoardResponse.model_validate(board)
    
    def update_board(self, board_id: int, user_id: int, board_data: BoardUpdate) -> BoardResponse:
        board = self.repository.update_board(board_id, user_id, board_data)
        if not board:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Board with ID {board_id} not found"
            )
        return BoardResponse.model_validate(board)
    
    def delete_board(self, board_id: int, user_id: int) -> BoardResponse:
        board = self.repository.delete_board(board_id, user_id)
        if not board:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Board with ID {board_id} not found"
            )
        return BoardResponse.model_validate(board)