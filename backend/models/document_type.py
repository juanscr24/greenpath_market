from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from db.database import Base

class DocumentType(Base):
    __tablename__ = "documents_types"

    id_document_type = Column(Integer, primary_key=True, index=True)
    document_type = Column(String(50), unique=True)
    document_abbreviation = Column(String(10), unique=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    # Establishing the relationship with User
    users = relationship("User", back_populates="document_type")
