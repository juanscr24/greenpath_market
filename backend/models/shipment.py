from sqlalchemy import Column, Integer, String, ForeignKey, Date, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from db.database import Base

class Shipment(Base):
    __tablename__ = "shipments"

    id_shipments = Column(Integer, primary_key=True, index=True)
    id_order = Column(Integer, ForeignKey('user_orders.id_order'))
    user_address = Column(String(255))
    transporter = Column(String(40))
    id_shipping_status = Column(Integer, ForeignKey('shipping_states.id_shipping_status'))
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    order = relationship("UserOrder", back_populates="shipments")
    shipping_state = relationship("ShippingState", back_populates="shipments")  # Relación con ShippingState