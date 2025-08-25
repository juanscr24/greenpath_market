from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime, date

class DocumentTypeCreate(BaseModel):
    document_type: str = Field(..., max_length=50, description="Tipo de documento")
    document_abbreviation: str = Field(..., max_length=10, description="Abreviatura del documento")
    
    class Config:
        # Ensures compatibility with SQLAlchemy models (ORM support)
        orm_mode = True
        
class DocumentTypeResponse(BaseModel):
    id_document_type: int
    document_type: str
    document_abbreviation: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
