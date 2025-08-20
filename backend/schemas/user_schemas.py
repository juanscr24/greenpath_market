# Importamos BaseModel de Pydantic para validar datos
from pydantic import BaseModel, EmailStr
from typing import Optional

# Esquema para crear un nuevo usuario (lo que recibe la API)
class UserCreate(BaseModel):
    """Esquema para validar los datos al crear un usuario"""
    name: str  # Nombre del usuario
    surname: str  # Apellido del usuario
    url: Optional[str] = None  # URL personal (opcional)
    age: int  # Edad del usuario
    email: EmailStr  # Email válido
    password: str  # Contraseña en texto plano (se encriptará después)

# Esquema para la respuesta de usuario (lo que devuelve la API)
class UserResponse(BaseModel):
    """Esquema para formatear la respuesta de usuario"""
    id: int
    name: str
    surname: str
    url: Optional[str] = None
    age: int
    email: str
    
    # Configuración para que Pydantic trabaje con objetos SQLAlchemy
    class Config:
        from_attributes = True  # Permite usar objetos SQLAlchemy directamente

# Esquema para actualizar un usuario
class UserUpdate(BaseModel):
    """Esquema para validar datos al actualizar un usuario"""
    name: Optional[str] = None
    surname: Optional[str] = None
    url: Optional[str] = None
    age: Optional[int] = None
    email: Optional[EmailStr] = None
