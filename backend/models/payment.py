from sqlalchemy import Column, Integer, String, ForeignKey, Date, DateTime, DECIMAL
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from db.database import Base

class Payment(Base):
    __tablename__ = "payments"

    id_payment = Column(Integer, primary_key=True, index=True)
    id_order = Column(Integer, ForeignKey('user_orders.id_order'))
    id_payment_option = Column(Integer, ForeignKey('payment_options.id_option'))
    payment_amount = Column(DECIMAL(10, 2))
    payment_date = Column(DateTime)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    user_order = relationship("UserOrder", back_populates="payments")
    order = relationship("UserOrder", back_populates="payments")
    payment_option = relationship("PaymentOption", back_populates="payments")
