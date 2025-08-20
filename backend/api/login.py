# Importaciones necesarias
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from db.database import get_db

# Inicializamos el router para login
router = APIRouter(
    prefix="/login",
    tags=["Login"],
    responses={404: {"message": "No encontrado"}}
)

# Ruta POST para login (placeholder)
@router.post("/")
async def login_user():
    """Endpoint de login - implementar según necesidades"""
    return {"message": "Login endpoint - implementar autenticación"}

# Ruta GET para verificar estado de login
@router.get("/status")
async def login_status():
    """Verificar estado de autenticación"""
    return {"status": "Login service available"}
