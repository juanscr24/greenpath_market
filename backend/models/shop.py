from sqlalchemy import Column, Integer, String, ForeignKey, Text, Boolean, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from db.database import Base

class Shop(Base):
    __tablename__ = "shops"

    id_shop = Column(Integer, primary_key=True, index=True)
    id_user = Column(Integer, ForeignKey('users.id_user'))
    shop_name = Column(String(100), unique=True)
    description = Column(Text)
    shop_address = Column(String(255))
    logo_url = Column(String(255))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="shops")
    products = relationship("Product", back_populates="shop")