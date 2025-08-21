# Importaciones necesarias
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from db.database import get_db
from schemas.user_schemas import UserLogin, UserResponse
from crud.user_crud import get_user_by_email, verify_password

# Inicializamos el router para login
router = APIRouter(
    prefix="/login",
    tags=["Login"],
    responses={404: {"message": "No encontrado"}}
)

# Ruta POST para login
@router.post("/", response_model=dict)
async def login_user(user_login: UserLogin, db: Session = Depends(get_db)):
    """
    Autenticar usuario y generar token de acceso
    """
    try:
        # Buscar usuario por email
        user = get_user_by_email(db, email=user_login.email)
        if not user:
            raise HTTPException(
                status_code=401,
                detail="Email o contraseña incorrectos"
            )
        
        # Verificar contraseña
        if not verify_password(user_login.password, user.password_hash):
            raise HTTPException(
                status_code=401,
                detail="Email o contraseña incorrectos"
            )
        
        # Por ahora devolvemos un mensaje simple
        # Aquí se implementaría la generación de JWT
        return {
            "message": "Login exitoso",
            "user_id": user.id,
            "user_name": user.name,
            "email": user.email
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error interno del servidor: {str(e)}"
        )

# Ruta GET para verificar estado de login
@router.get("/status")
async def login_status():
    """Verificar estado de autenticación"""
    return {"status": "Login service available"}

@router.get("/test")
async def test_login():
    """Endpoint de prueba para verificar que el router funciona"""
    return {"message": "Login router funcionando correctamente"}