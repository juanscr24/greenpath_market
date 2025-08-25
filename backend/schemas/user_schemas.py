# We import BaseModel from Pydantic to validate data
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime, date

# Schema to create a new user (what the API receives)
class UserCreate(BaseModel):
    full_name: str = Field(..., min_length=1, max_length=100, description="Nombre completo del usuario")
    birthdate: date = Field(..., description="Fecha de nacimiento del usuario (formato: YYYY-MM-DD)")
    email: EmailStr = Field(..., description="Email válido")
    phone: str = Field(..., min_length=2, max_length=100, description="Teléfono del usuario")
    id_document_type: int = Field(..., description="Tipo de documento del usuario (ID o Cédula)")
    document_number: str = Field(..., description="Número de documento")
    user_password: str = Field(..., min_length=6, description="Contraseña (mínimo 6 caracteres)")
    id_rol: int = Field(..., description="Rol del usuario (1: cliente, 2: vendedor, 3: administrador)")
    user_address: str= Field(min_length=4, description="Direccion del usuario")

    class Config:
        # Ensures compatibility with SQLAlchemy models (ORM support)
        from_attributes = True

# Login schema
class UserLogin(BaseModel):
    email: EmailStr = Field(..., description="Email del usuario")
    password: str = Field(..., description="Contraseña del usuario")

    class Config:
        # Ensures compatibility with SQLAlchemy models (ORM support)
        from_attributes = True

# Schema for the user response (what the API returns)
class UserResponse(BaseModel):
    """Schema for formatting user response"""
    id_user: int
    full_name: str
    birthdate: date
    email: str
    phone: str
    id_document_type: int
    document_number: str
    user_password: str
    id_rol: int
    user_address: str
    created_at: datetime
    updated_at: datetime
    # Configuring Pydantic to work with SQLAlchemy objects
    class Config:
        from_attributes = True

# Esquema para actualizar un usuario
class UserUpdate(BaseModel):
    """Schema for validating data when updating a user"""
    full_name: Optional[str] = Field(None, min_length=2, max_length=100)
    birthdate: Optional[date] = None
    phone: Optional[str] = Field(None, min_length=2, max_length=100)
    id_document_type: Optional[int] = None
    document_number: Optional[str] = None
    email: Optional[EmailStr] = None
    user_password: Optional[str] = Field(None, min_length=6)
    id_rol: Optional[int] = None
    user_address: Optional[str]=None

    class Config:
        from_attributes = True
