from sqlalchemy import Column, Integer, String, ForeignKey, Date, DateTime, Text, DECIMAL, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from db.database import Base

class Product(Base):
    __tablename__ = "products"
    
    id_product = Column(Integer, primary_key=True, autoincrement=True)
    id_shop = Column(Integer, ForeignKey('shops.id_shop', ondelete='SET NULL'))
    name_product = Column(String(100), nullable=False)
    product_description = Column(Text)
    price = Column(DECIMAL(10, 2), nullable=False)
    stock = Column(Integer, default=0)
    product_star_rate = Column(Float, default=0)
    id_category = Column(Integer, ForeignKey('categories.id_category', ondelete='SET NULL'))
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    # Relaciones
    shop = relationship("Shop", back_populates="products")
    category = relationship("Category", back_populates="products")
    order_details = relationship("OrderDetail", back_populates="product")
    images = relationship("ProductImage", back_populates="product", cascade="all, delete-orphan")  # Relación con ProductImage