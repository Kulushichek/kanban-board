from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.schemes.card import CardCreate, CardResponse, CardListResponse, CardUpdate
from app.repositories.card_repository import CardRepository

class CardService:
    def __init__(self, db: Session):
        self.repository = CardRepository(db)
    
    def create_card(self, card_data: CardCreate, column_id: int) -> CardResponse:
        card = self.repository.create_card(card_data, column_id)
        return CardResponse.model_validate(card)
    
    def get_all_cards(self, column_id: int) -> CardListResponse:
        cards = self.repository.get_all_cards(column_id)
        return CardListResponse.model_validate(cards)
    
    def update_card(self, card_id: int, card_data: CardUpdate) -> CardResponse:
        card = self.repository.update_card(card_id, card_data)
        if not card:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Card with ID {card_id} not found"
            )
        return CardResponse.model_validate(card)
    
    def delete_card(self, card_id: int) -> CardResponse:
        card = self.repository.delete_card(card_id)
        if not card:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Card with ID {card_id} not found"
            )
        return CardResponse.model_validate(card)