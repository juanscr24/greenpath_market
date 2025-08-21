# Importamos FastAPI (framework para crear APIs)
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# Importamos los routers desde la carpeta api
from api import login, register
from db.database import Base, engine

# Crear las tablas en la base de datos
Base.metadata.create_all(bind=engine)

# Creamos la instancia principal de FastAPI
app = FastAPI(
    title="GreenPath Market API",
    description="API para marketplace de productos sostenibles",
    version="1.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especifica los dominios permitidos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- ROUTERS ---
# Incluimos todos los routers de la carpeta api
app.include_router(register.router)  # Ya tiene el prefix="/register" en el router
app.include_router(login.router)     # Ya tiene el prefix="/login" en el router

# --- RUTAS PRINCIPALES ---
@app.get("/")
async def root():
    return {"message": "GreenPath API - Backend con MySQL", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "database": "MySQL"}