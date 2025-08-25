from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime, date

class ShippingStateCreate(BaseModel):
    status_name: str = Field(..., max_length=20, description="Nombre del estado de envío")

    class Config:
        # Ensures compatibility with SQLAlchemy models (ORM support)
        orm_mode = True
    
class ShippingStateResponse(BaseModel):
    id_shipping_status: int
    status_name: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True