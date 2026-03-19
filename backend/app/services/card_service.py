from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.schemes.card import CardCreate, CardResponse, CardListResponse, CardUpdate
from app.repositories.card_repository import CardRepository
from app.repositories.user_repository import UserRepository
from app.repositories.board_repository import BoardRepository
from app.repositories.column_repository import ColumnRepository

class CardService:
    def __init__(self, db: Session):
        self.repository = CardRepository(db)
        self.user_repository = UserRepository(db)
        self.board_repository = BoardRepository(db)
        self.column_repository = ColumnRepository(db)

    def check_user_exists(self, user_id: int):
        user = self.user_repository.get_user_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User with ID {user_id} not found."
            )
    
    def create_card(self, card_data: CardCreate, column_id: int, user_id: int) -> CardResponse:
        self.check_user_exists(user_id)
        
        column = self.column_repository.get_column_by_id(column_id)
        if not column:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Column with ID {column_id} not found. Cannot create card."
            )

        board = self.board_repository.get_board_by_id(column.board_id, user_id)
        if not board:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Board with ID {column.board_id} not found. Cannot create card."
            )
        card = self.repository.create_card(card_data, column_id)
        return CardResponse.model_validate(card)
    
    def get_card_by_id(self, card_id: int, user_id: int) -> CardResponse:
        self.check_user_exists(user_id)

        card = self.repository.get_card_by_id(card_id)
        if not card:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Card with ID {card_id} not found. Cannot get card."
            )
        
        column = self.column_repository.get_column_by_id(card.column_id)
        if not column:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Column with ID {card.column_id} not found. Cannot get card."
            )
        
        board = self.board_repository.get_board_by_id(column.board_id, user_id)
        if not board:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Board with ID {column.board_id} not found. Cannot get card."
            )
        return CardResponse.model_validate(card)
    
    def get_all_cards(self, column_id: int, user_id: int) -> CardListResponse:
        self.check_user_exists(user_id)

        column = self.column_repository.get_column_by_id(column_id)
        if not column:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Column with ID {column_id} not found. Cannot get cards."
            )

        board = self.board_repository.get_board_by_id(column.board_id, user_id)
        if not board:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Board with ID {column.board_id} not found. Cannot get cards."
            )

        cards = self.repository.get_all_cards(column_id)

        list_cards = []
        for card in cards:
            list_cards.append(CardResponse.model_validate(card))
        return CardListResponse(cards=list_cards)
    
    def update_card(self, user_id: int, card_id: int, card_data: CardUpdate) -> CardResponse:
        self.get_card_by_id(card_id, user_id)
        if card_data.column_id is not None:
            target_column = self.column_repository.get_column_by_id(card_data.column_id)
            if not target_column:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Column with ID {card_data.column_id} not found."
                )
            board = self.board_repository.get_board_by_id(target_column.board_id, user_id)
            if not board:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Cannot move card to a board you don't own."
                )
        card = self.repository.update_card(card_id, card_data)
        return CardResponse.model_validate(card)
    
    def delete_card(self, user_id: int, card_id: int) -> CardResponse:
        self.get_card_by_id(card_id, user_id)
        card = self.repository.delete_card(card_id)
        return CardResponse.model_validate(card)