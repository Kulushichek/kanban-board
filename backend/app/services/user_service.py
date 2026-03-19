from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.repositories.user_repository import UserRepository
from app.schemes.user import UserCreate, UserResponse
from app.core.security import hash_password
from app.schemes.user import UserPasswordUpdate
from app.core.security import verify_password

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

    def update_password(self, user_id: int, password_data: UserPasswordUpdate) -> UserResponse:
        user = self.repository.get_user_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User with ID {user_id} not found"
            )

        # Проверяем, совпадает ли старый пароль
        if not verify_password(password_data.old_password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid old password"
            )

        # Не совпадает ли новый пароль со старым
        if password_data.old_password == password_data.new_password:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="New password must be different from the old one"
            )

        new_hashed_password = hash_password(password_data.new_password)

        updated_user = self.repository.update_user_password(user_id, new_hashed_password)
        
        if not updated_user:
            raise HTTPException(status_code=404, detail="User not found during update")

        return UserResponse.model_validate(updated_user)

