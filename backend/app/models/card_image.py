from app.database import Base
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

class CardImage(Base):
    __tablename__ = "card_images"
    id = Column(Integer, primary_key=True, index=True)
    file_path = Column(String, nullable=False)
    card_id = Column(Integer, ForeignKey("cards.id", ondelete="CASCADE"), nullable=False)

    card = relationship("Card", back_populates="images")