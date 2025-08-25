from sqlalchemy import Column, Integer, String, ForeignKey, Date, DateTime, DECIMAL
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from db.database import Base

class OrderDetail(Base):
    __tablename__ = "order_details"

    id_detail = Column(Integer, primary_key=True, index=True)
    id_order = Column(Integer, ForeignKey('user_orders.id_order'))
    id_product = Column(Integer, ForeignKey('products.id_product'))
    amount = Column(Integer)
    unit_price = Column(DECIMAL(10, 2))
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    order = relationship("UserOrder", back_populates="order_details")
    product = relationship("Product", back_populates="order_details")