# Configuración de la base de datos MySQL
import os
from dotenv import load_dotenv

# Cargar variables de entorno desde .env
load_dotenv()

# Configuración de MySQL
MYSQL_USER = os.getenv("MYSQL_USER", "root")
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", "Qwe.123*")
MYSQL_HOST = os.getenv("MYSQL_HOST", "localhost")
MYSQL_PORT = os.getenv("MYSQL_PORT", "3306")
MYSQL_DATABASE = os.getenv("MYSQL_DATABASE", "greenpath")

# URL de conexión MySQL
SQLALCHEMY_DATABASE_URL = f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DATABASE}"

# Configuración adicional
DATABASE_CONFIG = {
    "pool_pre_ping": True,  # Verifica conexiones antes de usarlas
    "pool_recycle": 3600,   # Recicla conexiones cada hora
    "echo": False           # No mostrar SQL en consola (True para debugging)
}
