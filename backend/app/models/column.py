from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from .database import Base

class Column(Base):
    __tablename__ = "columns"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    board_id = Column(Integer, ForeignKey("boards.id"), nullable=False)
 
    board = relationship("Board", back_populates="columns")
    cards = relationship("Card", back_populates="column")