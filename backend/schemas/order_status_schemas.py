from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime, date


class OrderStatusCreate(BaseModel):
    name_order_status: str = Field(..., max_length=30, description="Nombre del estado del pedido")
    
    class Config:
        # Ensures compatibility with SQLAlchemy models (ORM support)
        from_attributes = True
        

class OrderStatusResponse(BaseModel):
    id_order_status: int
    name_order_status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True