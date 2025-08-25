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
    "echo": False           
}
