from sqlalchemy import Column, Integer, String, ForeignKey, Date, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from db.database import Base

class ProductImage(Base):
    __tablename__ = "product_images"

    id_image = Column(Integer, primary_key=True, index=True)
    id_product = Column(Integer, ForeignKey('products.id_product'))
    image_url = Column(String(255))
    alt_text = Column(String(100))
    created_at = Column(DateTime, default=func.now())

    product = relationship("Product", back_populates="images")