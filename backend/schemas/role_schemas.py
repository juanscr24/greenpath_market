from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime, date

class RoleCreate(BaseModel):
    role_name: str = Field(..., max_length=10, description="Nombre del rol")
    
    class Config:
        # Ensures compatibility with SQLAlchemy models (ORM support)
        orm_mode = True
        

class RoleResponse(BaseModel):
    id_rol: int
    role_name: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
