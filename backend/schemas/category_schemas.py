from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime, date

class CategoryCreate(BaseModel):
    name_category: str = Field(..., max_length=40, description="Nombre de la categoría")
    
    class Config:
        # Ensures compatibility with SQLAlchemy models (ORM support)
        orm_mode = True
        
class CategoryResponse(BaseModel):
    id_category: int
    name_category: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True