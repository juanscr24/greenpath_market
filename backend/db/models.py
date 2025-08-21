# Importamos las herramientas necesarias de SQLAlchemy para definir modelos
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from db.database import Base  # Importamos la clase Base desde database.py

# Definimos el modelo User que representa la tabla 'users' en la base de datos
class User(Base):
    __tablename__ = "users"  # Nombre de la tabla en la base de datos
    
    # Definimos las columnas de la tabla
    id = Column(Integer, primary_key=True, index=True)  # ID único, clave primaria
    name = Column(String(100), nullable=False)  # Nombre del usuario, no puede ser nulo
    surname = Column(String(100), nullable=False)  # Apellido del usuario, no puede ser nulo
    url = Column(String(255), nullable=True)  # URL personal, puede estar vacía
    age = Column(Integer, nullable=False)  # Edad del usuario, no puede ser nula
    email = Column(String(255), unique=True, index=True, nullable=False)  # Email único para cada usuario
    password_hash = Column(String(255), nullable=False)  # Contraseña encriptada
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def __repr__(self):
        """Representación en string del objeto User para debugging"""
        return f"<User(id={self.id}, name={self.name}, email={self.email})>"