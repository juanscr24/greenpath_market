from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from db.database import Base
from sqlalchemy.orm import relationship

class DocumentType(Base):
    __tablename__ = "documents_types"

    id_document_type = Column(Integer, primary_key=True, index=True)
    document_type = Column(String(50), unique=True)
    document_abbreviation = Column(String(10), unique=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    
     # Relación con User (agregada correctamente con back_populates)
    users = relationship("User", back_populates="document_type")  # Esta es la relación que te falta