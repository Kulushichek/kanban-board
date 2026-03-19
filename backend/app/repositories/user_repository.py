from sqlalchemy.orm import Session
from typing import Optional
from app.schemes.user import UserCreate
from app.models.user import User

class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_user(self, user_data: UserCreate, hashed_password: str) -> User:
        db_user = User(
            email = user_data.email,
            hashed_password = hashed_password
        )
        self.db.add(db_user)
        self.db.commit() # Генерация sql запроса INSERT
        self.db.refresh(db_user) # Генерация sql запроса SELECT
        return db_user

    def get_user_by_email(self, email:str) -> Optional[User]:
        return self.db.query(User).filter(User.email == email).first()

    def get_user_by_id(self, user_id: int) -> Optional[User]:
        return self.db.query(User).filter(User.id == user_id).first()