# We import FastAPI (framework for creating APIs)
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# We import the routers from the api folder
from api import login, register, products, payments, search, users
from db.database import Base, engine
# Create the tables in the database
Base.metadata.create_all(bind=engine)

from models import (
    Role,
    DocumentType,
    Category,
    User,
    Shop,
    Product,
    OrderStatus,
    PaymentOption,
    ShippingState,
    UserOrder,
    OrderDetail,
    Payment,
    Shipment,
    ProductImage
)
# We create the main FastAPI instance
app = FastAPI(
    title="GreenPath Market API",
    description="API para marketplace de productos sostenibles",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# We include all the routers in the api folder
app.include_router(register.router) 
app.include_router(login.router)
app.include_router(products.router) 
app.include_router(payments.router)
app.include_router(search.router)
app.include_router(users.router)


# --- MAIN ROUTES ---
@app.get("/")
async def root():
    return {"message": "GreenPath API - Backend con MySQL", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "database": "MySQL"}
