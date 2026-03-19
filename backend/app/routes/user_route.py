from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.user_service import UserService
from app.schemes.user import UserCreate, UserResponse, UserPasswordUpdate

router = APIRouter(
    prefix="/api/users",
    tags=["Users"]
)

@router.get('/{user_email}', response_model=UserResponse, status_code=status.HTTP_200_OK)
def get_user_by_email(user_email: str, db: Session = Depends(get_db)):
    user_service = UserService(db)
    return user_service.get_user_by_email(user_email)

@router.post('/create', response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(user_data: UserCreate, db: Session = Depends(get_db)):
    user_service = UserService(db)
    return user_service.create_user(user_data)

@router.put("/{user_id}/change-password", response_model=UserResponse, status_code=status.HTTP_200_OK)
def change_password(user_id: int, password_data: UserPasswordUpdate, db: Session = Depends(get_db)):
    user_service = UserService(db)
    return user_service.update_password(user_id, password_data)