from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime, date

class ProductCreate(BaseModel):
    id_shop: int = Field(..., description="ID de la tienda a la que pertenece el producto")
    name_product: str = Field(..., max_length=100, description="Nombre del producto")
    product_description: Optional[str] = Field(None, description="Descripción del producto")
    price: float = Field(..., gt=0, description="Precio del producto")
    stock: int = Field(..., ge=0, description="Cantidad en stock")
    product_star_rate: float = Field(..., ge=0, le=5, description="Calificación del producto")
    id_category: int = Field(..., description="Categoría del producto")
    
    
    class Config:
        from_attributes = True
        
class ProductResponse(BaseModel):
    id_product: int
    id_shop: Optional[int] = None
    name_product: str
    product_description: Optional[str]
    price: float
    stock: int
    product_star_rate: float
    id_category: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True



class ProductUpdate(BaseModel):
    name_product: Optional[str] = Field(None, max_length=100, description="Nombre del producto")
    product_description: Optional[str] = Field(None, description="Descripción del producto")
    price: Optional[float] = Field(None, gt=0, description="Precio del producto")
    stock: Optional[int] = Field(None, ge=0, description="Cantidad en stock")
    product_star_rate: Optional[float] = Field(None, ge=0, le=5, description="Calificación del producto")
    id_category: Optional[int] = Field(None, description="Categoría del producto")

    class Config:
        from_attributes = True

class ProductWithDetailsResponse(BaseModel):
    id_product: int
    name_product: str
    product_description: Optional[str]
    price: float
    stock: int
    product_star_rate: float
    category_name: str
    shop_name: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True



