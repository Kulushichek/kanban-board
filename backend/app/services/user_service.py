from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.repositories.user_repository import UserRepository
from app.schemes.user import UserCreate, UserResponse
from app.core.security import hash_password

class UserService:
    def __init__(self, db: Session):
        self.repository = UserRepository(db)
    
    def create_user(self, user_data: UserCreate) -> UserResponse:
        existing_user = self.repository.get_user_by_email(user_data.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"User with email {user_data.email} already exists."
            )

        hashed_password = hash_password(user_data.password)

        user = self.repository.create_user(user_data, hashed_password)
        return UserResponse.model_validate(user)
    
    def get_user_by_email(self, user_email: str) -> UserResponse:
        user = self.repository.get_user_by_email(user_email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User with email {user_email} not found"
            )
        return UserResponse.model_validate(user)

