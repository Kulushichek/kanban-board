from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.repositories.user_repository import UserRepository
from app.schemes.user import UserCreate, UserResponse

class UserService:
    def __init__(self, db: Session):
        self.repository = UserRepository(db)
    
    def create_user(self, user_data: UserCreate) -> UserResponse:
        user = self.repository.create_user(user_data)
        return UserResponse.model_validate(user)
    
    def get_user_by_email(self, user_email: str) -> UserResponse:
        user = self.repository.get_user_by_email(user_email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User with email {user_email} not found"
            )
        return UserResponse.model_validate(user)

