from sqlalchemy import Column, Integer, String, ForeignKey, Date, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from db.database import Base

class PaymentOption(Base):
    __tablename__ = "payment_options"

    id_option = Column(Integer, primary_key=True, index=True)
    payment_option_name = Column(String(20), unique=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    payments = relationship("Payment", back_populates="payment_option")
