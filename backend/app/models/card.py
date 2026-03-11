from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from .database import Base

class Card(Base):
    __tablename__ = "cards"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    column_id = Column(Integer, ForeignKey("columns.id"))

    column = relationship("Column", back_populates="cards")