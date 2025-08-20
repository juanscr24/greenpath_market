# Importamos las herramientas necesarias de SQLAlchemy para definir modelos
from sqlalchemy import Column, Integer, String
from db.database import Base  # Importamos la clase Base desde database.py

# Definimos el modelo User que representa la tabla 'users' en la base de datos
class User(Base):
    __tablename__ = "users"  # Nombre de la tabla en la base de datos
    
    # Definimos las columnas de la tabla
    id = Column(Integer, primary_key=True, index=True)  # ID único, clave primaria
    name = Column(String, nullable=False)  # Nombre del usuario, no puede ser nulo
    surname = Column(String, nullable=False)  # Apellido del usuario, no puede ser nulo
    url = Column(String, nullable=True)  # URL personal, puede estar vacía
    age = Column(Integer, nullable=False)  # Edad del usuario, no puede ser nula
    email = Column(String, unique=True, index=True, nullable=False)  # Email único para cada usuario
    password_hash = Column(String, nullable=False)  # Contraseña encriptada
    
    def __repr__(self):
        """Representación en string del objeto User para debugging"""
        return f"<User(id={self.id}, name={self.name}, email={self.email})>"
