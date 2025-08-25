from sqlalchemy import Column, Integer, String, ForeignKey, Date, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from db.database import Base

class OrderStatus(Base):
    __tablename__ = "order_status"

    id_order_status = Column(Integer, primary_key=True, index=True)
    name_order_status = Column(String(30), unique=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
