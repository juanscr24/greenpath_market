from sqlalchemy import Column, Integer, String, ForeignKey, Text, Boolean, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from db.database import Base


class UserOrder(Base):
    __tablename__ = "user_orders"

    id_order = Column(Integer, primary_key=True, index=True)
    order_date = Column(DateTime)
    id_user = Column(Integer, ForeignKey('users.id_user'))
    id_order_status = Column(Integer, ForeignKey('order_status.id_order_status'))
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="orders")
    order_status = relationship("OrderStatus", back_populates="user_orders")
    order_details = relationship("OrderDetail", back_populates="order")
