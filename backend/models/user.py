from sqlalchemy import Column, Integer, String, ForeignKey, Date, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from db.database import Base

class User(Base):
    __tablename__ = "users"

    id_user = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100))
    birthdate = Column(Date, nullable=True)
    email = Column(String(50), unique=True)
    phone = Column(String(20), unique=True)
    id_document_type = Column(Integer, ForeignKey('documents_types.id_document_type'))
    document_number = Column(String(20))
    user_password = Column(String(255))
    id_rol = Column(Integer, ForeignKey('roles.id_rol'))
    user_address = Column(String(255))
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    role = relationship("Role", back_populates="users")
    document_type = relationship("DocumentType", back_populates="users")
    shops = relationship("Shop", back_populates="user")