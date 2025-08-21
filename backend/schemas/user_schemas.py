# We import BaseModel from Pydantic to validate data
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

# Schema to create a new user (what the API receives)
class UserCreate(BaseModel):

    name: str = Field(..., min_length=2, max_length=100, description="Nombre del usuario")
    surname: str = Field(..., min_length=2, max_length=100, description="Apellido del usuario")
    url: Optional[str] = Field(None, max_length=255, description="URL personal (opcional)")
    age: int = Field(..., ge=13, le=120, description="Edad del usuario")
    email: EmailStr = Field(..., description="Email válido")
    password: str = Field(..., min_length=6, description="Contraseña (mínimo 6 caracteres)")

# Login scheme
class UserLogin(BaseModel):
    email: EmailStr = Field(..., description="Email del usuario")
    password: str = Field(..., description="Contraseña del usuario")

# Schema for the user response (what the API returns)
class UserResponse(BaseModel):
    """Schema for formatting user response"""
    id: int
    name: str
    surname: str
    url: Optional[str] = None
    age: int
    email: str
    created_at: datetime
    
    # Configuring Pydantic to work with SQLAlchemy objects
    class Config:
        from_attributes = True 

# Esquema para actualizar un usuario
class UserUpdate(BaseModel):
    """Schema for validating data when updating a user"""
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    surname: Optional[str] = Field(None, min_length=2, max_length=100)
    url: Optional[str] = Field(None, max_length=255)
    age: Optional[int] = Field(None, ge=13, le=120)
    email: Optional[EmailStr] = None