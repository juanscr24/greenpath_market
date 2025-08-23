from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from db.database import Base

class Role(Base):
    __tablename__ = "roles"

    id_rol = Column(Integer, primary_key=True, index=True)
    role_name = Column(String(10), unique=True, index=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    users = relationship("User", back_populates="role")
