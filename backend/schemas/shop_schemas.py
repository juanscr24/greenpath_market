# We import BaseModel from Pydantic to validate data
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime, date

class ProductCreate(BaseModel):
    id_shop: int = Field(..., description = "Id de la tienda")
    id_user: int = Field(..., description = "Id del dueño de la tienda")
    shop_name: str = Field(..., min_length=2 ,max_length=100, description = "Nombre de la tienda")
    description: str = Field(..., description="Descripción de la tienda")
    shop_address: Optional[str] = Field(None, min_length = 2 , max_length = 50, description= "Dirrecion de la tienda")
    logo_url: Optional[str] = Field(None, max_length=255, description="URL del logo de la tienda")
    is_active: bool = Field(True, description="Indica si la tienda está activa")
    
    class Config:
        # Ensures compatibility with SQLAlchemy models (ORM support)
        from_attributes = True
        

class ShopResponse(BaseModel):
    id_shop: int
    shop_name: str
    description: Optional[str]
    shop_address: Optional[str]
    logo_url: Optional[str]
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
