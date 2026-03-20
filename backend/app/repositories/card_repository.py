from sqlalchemy.orm import Session
from typing import Optional, List
from app.models.card import Card
from app.schemes.card import CardCreate
from app.schemes.card import CardUpdate
from app.models.card_image import CardImage

class CardRepository:
    def __init__(self, db: Session):
        self.db = db
    
    def create_card(self, card_data: CardCreate, column_id: int) -> Card:
        db_card = Card(**card_data.model_dump(), column_id = column_id)
        self.db.add(db_card)
        self.db.commit()
        self.db.refresh(db_card)
        return db_card

    def get_card_by_id(self, card_id: int) -> Optional[Card]:
        return self.db.query(Card).filter(Card.id == card_id).first()
    
    def get_all_cards(self, column_id: int) -> List[Card]:
        return self.db.query(Card).filter(Card.column_id == column_id).all()
    
    def update_card(self, card_id: int, card_data: CardUpdate) -> Optional[Card]:
        db_card = self.db.query(Card).filter(Card.id == card_id).first()
        if not db_card:
            return None
        update_data = card_data.model_dump(exclude_unset=True) # Исключить неустановленное
        # Проходимся циклом по этому словарю и обновляем только нужные поля
        for key, value in update_data.items():
            setattr(db_card, key, value) 
            # setattr(db_card, "title", "Новое имя") делает то же самое, 
            # что и db_card.title = "Новое имя", но автоматически
        self.db.commit()
        self.db.refresh(db_card)
        return db_card
    
    def delete_card(self, card_id: int) -> Optional[Card]:
        db_card = self.db.query(Card).filter(Card.id == card_id).first()
        if not db_card:
            return None
        self.db.delete(db_card)
        self.db.commit()
        return db_card

    def add_image(self, card_id: int, file_path: str) -> CardImage:
        db_image = CardImage(card_id=card_id, file_path=file_path)
        self.db.add(db_image)
        self.db.commit()
        self.db.refresh(db_image)
        return db_image

    def get_image_by_id(self, image_id: int) -> Optional[CardImage]:
        return self.db.query(CardImage).filter(CardImage.id == image_id).first()

    def delete_image(self, image_id: int) -> Optional[CardImage]:
        db_image = self.get_image_by_id(image_id)
        if not db_image:
            return None
        self.db.delete(db_image)
        self.db.commit()
        return db_image
    