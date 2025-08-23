from sqlalchemy import Column, Integer, String, ForeignKey, Float, DECIMAL, Boolean, Text, DateTime, Date
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from db.database import Base  # Asegúrate de que tienes un objeto Base desde tu archivo de configuración de SQLAlchemy.

class Role(Base):
    __tablename__ = "roles"

    id_rol = Column(Integer, primary_key=True, index=True)
    role_name = Column(String(10), unique=True, index=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    users = relationship("User", back_populates="role")

class DocumentType(Base):
    __tablename__ = "documents_types"

    id_document_type = Column(Integer, primary_key=True, index=True)
    document_type = Column(String(50), unique=True)
    document_abbreviation = Column(String(10), unique=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    users = relationship("User", back_populates="document_type")

class Category(Base):
    __tablename__ = "categories"

    id_category = Column(Integer, primary_key=True, index=True)
    name_category = Column(String(40), unique=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    products = relationship("Product", back_populates="category")

class User(Base):
    __tablename__ = "users"

    id_user = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100))
    email = Column(String(50), unique=True)
    phone = Column(String(20), unique=True)
    birthdate = Column(Date, nullable=True)
    id_document_type = Column(Integer, ForeignKey('documents_types.id_document_type'))
    document_number = Column(String(20))
    user_password = Column(String(255))
    id_rol = Column(Integer, ForeignKey('roles.id_rol'))
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    role = relationship("Role", back_populates="users")
    document_type = relationship("DocumentType", back_populates="users")
    shops = relationship("Shop", back_populates="user")

class Shop(Base):
    __tablename__ = "shops"

    id_shop = Column(Integer, primary_key=True, index=True)
    id_user = Column(Integer, ForeignKey('users.id_user'))
    shop_name = Column(String(100), unique=True)
    description = Column(Text)
    address = Column(String(255))
    logo_url = Column(String(255))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="shops")
    products = relationship("Product", back_populates="shop")

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

class OrderStatus(Base):
    __tablename__ = "order_status"

    id_order_status = Column(Integer, primary_key=True, index=True)
    name_order_status = Column(String(30), unique=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

class PaymentOption(Base):
    __tablename__ = "payment_options"

    id_option = Column(Integer, primary_key=True, index=True)
    payment_option_name = Column(String(20), unique=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

class ShippingState(Base):
    __tablename__ = "shipping_states"

    id_shipping_status = Column(Integer, primary_key=True, index=True)
    status_name = Column(String(20), unique=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

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

class Payment(Base):
    __tablename__ = "payments"

    id_payment = Column(Integer, primary_key=True, index=True)
    id_order = Column(Integer, ForeignKey('user_orders.id_order'))
    id_payment_option = Column(Integer, ForeignKey('payment_options.id_option'))
    payment_amount = Column(DECIMAL(10, 2))
    payment_date = Column(DateTime)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    order = relationship("UserOrder", back_populates="payments")
    payment_option = relationship("PaymentOption", back_populates="payments")

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
    shipping_status = relationship("ShippingState", back_populates="shipments")

class ProductImage(Base):
    __tablename__ = "product_images"

    id_image = Column(Integer, primary_key=True, index=True)
    id_product = Column(Integer, ForeignKey('products.id_product'))
    image_url = Column(String(255))
    alt_text = Column(String(100))
    created_at = Column(DateTime, default=func.now())

    product = relationship("Product", back_populates="images")
