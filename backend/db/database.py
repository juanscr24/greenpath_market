# Importaciones necesarias para SQLAlchemy
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from config.config import SQLALCHEMY_DATABASE_URL, DATABASE_CONFIG

# Motor de conexión MySQL
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    **DATABASE_CONFIG
)

# Fábrica de sesiones
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Clase base para modelos
Base = declarative_base()

# Dependencia de base de datos para FastAPI
def get_db():
    """Proporciona una sesión de base de datos"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
