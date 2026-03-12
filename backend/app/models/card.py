from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from .database import Base
from datetime import date

class Card(Base):
    __tablename__ = "cards"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    deadline = Column(Date, nullable=True)
    description = Column(String, nullable=True)
    column_id = Column(Integer, ForeignKey("columns.id"), nullable=False)

    column = relationship("Column", back_populates="cards")