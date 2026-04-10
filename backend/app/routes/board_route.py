from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.board_service import BoardService
from app.schemes.board_schema import BoardCreate, BoardResponse, BoardListResponse, BoardUpdate

router = APIRouter(
    prefix="/api/boards",
    tags=["Boards"]
)

@router.post("/create/{user_id}", response_model=BoardResponse, status_code=status.HTTP_201_CREATED)
def create_board(user_id: int, board_data: BoardCreate, db: Session = Depends(get_db)):
    board_service = BoardService(db)
    return board_service.create_board(board_data, user_id)

@router.get("/all/{user_id}", response_model=BoardListResponse, status_code=status.HTTP_200_OK)
def get_all_boards(user_id: int, db: Session = Depends(get_db)):
    board_service = BoardService(db)
    return board_service.get_all_boards(user_id)

@router.get("/{user_id}/{board_id}", response_model=BoardResponse, status_code=status.HTTP_200_OK)
def get_board_by_id(user_id: int, board_id: int, db: Session = Depends(get_db)):
    board_service = BoardService(db)
    return board_service.get_board_by_id(board_id, user_id)

@router.put("/{user_id}/{board_id}", response_model=BoardResponse, status_code=status.HTTP_200_OK)
def update_board(user_id: int, board_id: int, board_data: BoardUpdate, db: Session = Depends(get_db)):
    board_service = BoardService(db)
    return board_service.update_board(board_id, user_id, board_data)

@router.delete("/{user_id}/{board_id}", response_model=BoardResponse, status_code=status.HTTP_200_OK)
def delete_board(user_id: int, board_id: int, db: Session = Depends(get_db)):
    board_service = BoardService(db)
    return board_service.delete_board(board_id, user_id)
