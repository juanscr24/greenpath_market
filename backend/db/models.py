# We import the necessary tools from SQLAlchemy to define models
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from db.database import Base 

# We define the User model that represents the 'users' table in the databases
class User(Base):
    __tablename__ = "users"  
    
   # We define the table columns
    id = Column(Integer, primary_key=True, index=True)  
    name = Column(String(100), nullable=False)  
    surname = Column(String(100), nullable=False)  
    url = Column(String(255), nullable=True)  
    age = Column(Integer, nullable=False)  
    email = Column(String(255), unique=True, index=True, nullable=False)  
    password_hash = Column(String(255), nullable=False)  
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def __repr__(self):
        """String representation of the User object for debugging"""
        return f"<User(id={self.id}, name={self.name}, email={self.email})>"