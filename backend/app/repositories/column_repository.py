from sqlalchemy.orm import Session
from typing import Optional, List
from app.models.column import Column
from app.schemes.column import ColumnCreate
from app.schemes.column import ColumnUpdate

class ColumnRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_column(self, column_data: ColumnCreate, board_id: int) -> Column:
        db_column = Column(**column_data.model_dump(), board_id = board_id)
        self.db.add(db_column)
        self.db.commit()
        self.db.refresh(db_column)
        return db_column

    def get_all_columns(self, board_id: int) -> List[Column]:
        return self.db.query(Column).filter(Column.board_id == board_id).all()

    def get_column_by_id(self, column_id: int) -> Optional[Column]:
        return self.db.query(Column).filter(Column.id == column_id).first()

    def update_column(self, column_id: int, column_data: ColumnUpdate) -> Optional[Column]:
        db_column = self.get_column_by_id(column_id)
        if not db_column:
            return None
        update_data = column_data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_column, key, value) 
        self.db.commit()
        self.db.refresh(db_column)
        return db_column

    def delete_column(self, column_id: int) -> Optional[Column]:
        db_column = self.get_column_by_id(column_id)
        if not db_column:
            return None
        self.db.delete(db_column)
        self.db.commit()
        return db_column