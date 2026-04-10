from sqlalchemy import Column, Integer, String, ForeignKey, Date
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import date

class Card(Base):
    __tablename__ = "cards"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    deadline = Column(Date, nullable=True)
    description = Column(String, nullable=True)
    column_id = Column(Integer, ForeignKey("columns.id"), nullable=False)

    position = Column(Integer, default=0)

    column = relationship("Column", back_populates="cards")
    images = relationship("CardImage", back_populates="card", cascade="all, delete-orphan", lazy="joined")