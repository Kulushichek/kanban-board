from fastapi import APIRouter, Depends, status, UploadFile, File
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.card_service import CardService
from app.schemes.card import CardCreate, CardResponse, CardListResponse, CardUpdate, CardImageResponse, CardMove

router = APIRouter(
    prefix="/api/cards",
    tags=["Cards"]
)

@router.post("/create/{user_id}/{column_id}", response_model=CardResponse, status_code=status.HTTP_201_CREATED)
def create_card(user_id: int, card_data: CardCreate, column_id: int, db: Session = Depends(get_db)):
    card_service = CardService(db)
    return card_service.create_card(card_data, column_id, user_id)

@router.get("/all/{user_id}/{column_id}", response_model=CardListResponse, status_code=status.HTTP_200_OK)
def get_all_cards(user_id: int, column_id: int, db: Session = Depends(get_db)):
    card_service = CardService(db)
    return card_service.get_all_cards(column_id, user_id)

@router.put("/{user_id}/{card_id}", response_model=CardResponse, status_code=status.HTTP_200_OK)
def update_card(user_id: int, card_id: int, card_data: CardUpdate, db: Session = Depends(get_db)):
    card_service = CardService(db)
    return card_service.update_card(user_id, card_id, card_data)

@router.put("/{user_id}/{card_id}/move", response_model=CardResponse, status_code=status.HTTP_200_OK)
def move_card(user_id: int, card_id: int, move_data: CardMove, db: Session = Depends(get_db)):
    card_service = CardService(db)
    return card_service.move_card(user_id, card_id, move_data)

@router.delete("/{user_id}/{card_id}", response_model=CardResponse, status_code=status.HTTP_200_OK)
def delete_card(user_id: int, card_id: int, db: Session = Depends(get_db)):
    card_service = CardService(db)
    return card_service.delete_card(user_id, card_id)

@router.post("/{user_id}/{card_id}/images", response_model=CardImageResponse, status_code=status.HTTP_201_CREATED)
def add_image(user_id: int, card_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    card_service = CardService(db)
    return card_service.add_image(user_id, card_id, file)

@router.get("/{user_id}/{card_id}/images", response_model=list[CardImageResponse], status_code=status.HTTP_200_OK)
def get_images(user_id: int, card_id: int, db: Session = Depends(get_db)):
    card_service = CardService(db)
    return card_service.get_all_images(user_id, card_id)

@router.delete("/{user_id}/{card_id}/images/{image_id}", response_model=CardImageResponse, status_code=status.HTTP_200_OK)
def delete_image(user_id: int, card_id: int, image_id: int, db: Session = Depends(get_db)):
    card_service = CardService(db)
    return card_service.delete_image(user_id, card_id, image_id)

