from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime, date

class PaymentOptionCreate(BaseModel):
    payment_option_name: str = Field(..., max_length=20, description="Nombre de la opción de pago")

    class Config:
        # Ensures compatibility with SQLAlchemy models (ORM support)
        orm_mode = True
        
class PaymentOptionResponse(BaseModel):
    id_option: int
    payment_option_name: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
        