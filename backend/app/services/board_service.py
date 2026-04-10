from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.schemes.board_schema import BoardCreate, BoardResponse, BoardListResponse, BoardUpdate
from app.repositories.board_repository import BoardRepository
from app.repositories.user_repository import UserRepository

class BoardService:
    def __init__(self, db: Session):
        self.repository = BoardRepository(db)
        self.user_repository = UserRepository(db)
    
    def check_user_exists(self, user_id: int):
        user = self.user_repository.get_user_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User with ID {user_id} not found."
            )

    def create_board(self, board_data: BoardCreate, user_id: int) -> BoardResponse:
        self.check_user_exists(user_id)

        board = self.repository.create_board(board_data, user_id)
        return BoardResponse.model_validate(board)
    
    def get_all_boards(self, user_id: int) -> BoardListResponse:
        self.check_user_exists(user_id)

        boards = self.repository.get_all_boards(user_id)
        list_boards = []
        for board in boards:
            list_boards.append(BoardResponse.model_validate(board))
        return BoardListResponse(boards=list_boards)
    
    def get_board_by_id(self, board_id: int, user_id: int) -> BoardResponse:
        self.check_user_exists(user_id)
        
        board = self.repository.get_board_by_id(board_id, user_id)
        if not board:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Board with ID {board_id} not found"
            )
        return BoardResponse.model_validate(board)
    
    def update_board(self, board_id: int, user_id: int, board_data: BoardUpdate) -> BoardResponse:
        self.check_user_exists(user_id)

        board = self.repository.update_board(board_id, user_id, board_data)
        if board is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Board with ID {board_id} not found"
            )
        return BoardResponse.model_validate(board)
    
    def delete_board(self, board_id: int, user_id: int) -> BoardResponse:
        self.check_user_exists(user_id)
        
        board = self.repository.delete_board(board_id, user_id)
        if not board:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Board with ID {board_id} not found"
            )
        return BoardResponse.model_validate(board)