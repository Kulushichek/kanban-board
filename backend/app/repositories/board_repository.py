from sqlalchemy.orm import Session
from typing import Optional, List
from app.models.board import Board
from app.schemes.board import BoardCreate
from app.schemes.board import BoardUpdate

class BoardRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_board(self, board_data: BoardCreate, user_id: int) -> Board:
        db_board = Board(**board_data.model_dump(), user_id = user_id)
        self.db.add(db_board)
        self.db.commit()
        self.db.refresh(db_board)
        return db_board

    def get_board_by_id(self, board_id: int) -> Optional[Board]:
        return self.db.query(Board).filter(Board.id == board_id).first()

    def get_all_boards(self, user_id: int) -> List[Board]:
        return self.db.query(Board).filter(Board.user_id == user_id).all()

    def update_board(self, board_id: int, board_data: BoardUpdate) -> Optional[Board]:
        db_board = self.db.query(Board).filter(Board.id == board_id).first()
        if not db_board:
            return None
        db_board.title = board_data.title
        self.db.commit()
        self.db.refresh(db_board)
        return db_board

    def delete_board(self, board_id: int) -> Optional[Board]:
        db_board = self.db.query(Board).filter(Board.id == board_id).first()
        if not db_board:
            return None
        self.db.delete(db_board)
        self.db.commit()
        return db_board
