# We import BaseModel from Pydantic to validate data
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from fastapi import UploadFile

class ShopCreate(BaseModel):
    id_user: int = Field(..., description="Id del dueño de la tienda")
    shop_name: str = Field(..., min_length=2, max_length=100, description="Nombre de la tienda")
    description: str = Field(..., description="Descripción de la tienda")
    shop_address: Optional[str] = Field(None, min_length=2, max_length=255, description="Dirección de la tienda")
    logo_url: Optional[str] = Field(None, max_length=255, description="URL del logo de la tienda")
    is_active: bool = Field(True, description="Indica si la tienda está activa")

    class Config:
        from_attributes = True

class ShopCreateWithImage(BaseModel):
    id_user: int = Field(..., description="Id del dueño de la tienda")
    shop_name: str = Field(..., min_length=2, max_length=100, description="Nombre de la tienda")
    description: str = Field(..., description="Descripción de la tienda")
    shop_address: Optional[str] = Field(None, min_length=2, max_length=255, description="Dirección de la tienda")
    is_active: bool = Field(True, description="Indica si la tienda está activa")
    logo: UploadFile = Field(..., description="Archivo de imagen del logo de la tienda")

    class Config:
        from_attributes = True

class ShopUpdate(BaseModel):
    shop_name: Optional[str] = Field(None, min_length=2, max_length=100, description="Nombre de la tienda")
    description: Optional[str] = Field(None, description="Descripción de la tienda")
    shop_address: Optional[str] = Field(None, min_length=2, max_length=255, description="Dirección de la tienda")
    logo_url: Optional[str] = Field(None, max_length=255, description="URL del logo de la tienda")
    is_active: Optional[bool] = Field(None, description="Indica si la tienda está activa")
    
    class Config:
        from_attributes = True

class ShopResponse(BaseModel):
    id_shop: int
    id_user: int
    shop_name: str
    description: Optional[str]
    shop_address: Optional[str]
    logo_url: Optional[str]
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
