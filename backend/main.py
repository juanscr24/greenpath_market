# Importamos FastAPI (framework para crear APIs)
from fastapi import FastAPI
# Importamos los routers desde la carpeta api
from api import login,register
#, products, users , admin

# Creamos la instancia principal de FastAPI
app = FastAPI()

# --- ROUTERS ---
# Incluimos todos los routers de la carpeta api
app.include_router(register.router, prefix="/register")
app.include_router(login.router, prefix="/login")
# app.include_router(products.router, prefix="/products", tags=["Products"])
# app.include_router(users.router, prefix="/users", tags=["Users"])
# app.include_router(admin.router, prefix="/admin", tags=["Admin"])

# Configuración de archivos estáticos

# --- RUTAS PRINCIPALES ---
@app.get("/")
async def root():
    return {"message": "GreenPath API - Backend con MySQL"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "database": "MySQL"}

