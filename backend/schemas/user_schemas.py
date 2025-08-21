# Importamos BaseModel de Pydantic para validar datos
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

# Esquema para crear un nuevo usuario (lo que recibe la API)
class UserCreate(BaseModel):
    """Esquema para validar los datos al crear un usuario"""
    name: str = Field(..., min_length=2, max_length=100, description="Nombre del usuario")
    surname: str = Field(..., min_length=2, max_length=100, description="Apellido del usuario")
    url: Optional[str] = Field(None, max_length=255, description="URL personal (opcional)")
    age: int = Field(..., ge=13, le=120, description="Edad del usuario")
    email: EmailStr = Field(..., description="Email válido")
    password: str = Field(..., min_length=6, description="Contraseña (mínimo 6 caracteres)")

# Esquema para login
class UserLogin(BaseModel):
    """Esquema para validar los datos de login"""
    email: EmailStr = Field(..., description="Email del usuario")
    password: str = Field(..., description="Contraseña del usuario")

# Esquema para la respuesta de usuario (lo que devuelve la API)
class UserResponse(BaseModel):
    """Esquema para formatear la respuesta de usuario"""
    id: int
    name: str
    surname: str
    url: Optional[str] = None
    age: int
    email: str
    created_at: datetime
    
    # Configuración para que Pydantic trabaje con objetos SQLAlchemy
    class Config:
        from_attributes = True  # Permite usar objetos SQLAlchemy directamente

# Esquema para actualizar un usuario
class UserUpdate(BaseModel):
    """Esquema para validar datos al actualizar un usuario"""
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    surname: Optional[str] = Field(None, min_length=2, max_length=100)
    url: Optional[str] = Field(None, max_length=255)
    age: Optional[int] = Field(None, ge=13, le=120)
    email: Optional[EmailStr] = None