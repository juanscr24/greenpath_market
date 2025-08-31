# MySQL Database Configuration
import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# MySQL configuration
MYSQL_USER = os.getenv("MYSQL_USER")
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD")
MYSQL_HOST = os.getenv("MYSQL_HOST")
MYSQL_PORT = os.getenv("MYSQL_PORT")
MYSQL_DATABASE = os.getenv("MYSQL_DATABASE")

# MySQL connection URL
SQLALCHEMY_DATABASE_URL = f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DATABASE}"


DATABASE_CONFIG = {
    "pool_pre_ping": True,  
    "pool_recycle": 3600,  
    "pool_size": 5,          # Maximum number of connections in the pool
    "max_overflow": 2,       # Maximum number of connections that can be created beyond pool_size
    "pool_timeout": 30,      # Timeout for getting a connection from the pool (seconds)
    "echo": False           
}
