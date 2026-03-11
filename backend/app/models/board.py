from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from .database import Base

class Board(Base):
    __tablename__ = "boards"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"))

    user = relationship("User", back_populates="boards")
    columns = relationship("Column", back_populates="board")