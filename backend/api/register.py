# Importamos las dependencias necesarias para trabajar con la base de datos
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from db.database import get_db  # Función para obtener sesión de BD
from schemas.user_schemas import UserCreate, UserResponse  # Esquemas de validación
from crud.user_crud import create_user, get_user_by_email  # Operaciones CRUD

# Inicializamos el router para usuarios
router = APIRouter(
    prefix="/register",
    tags=["Register"],
    responses={404: {"message": "No encontrado"}}
)

# Ruta POST para registrar un nuevo usuario
@router.post("/", response_model=UserResponse, status_code=201)
async def register_user(user: UserCreate, db: Session = Depends(get_db)):
    """
    Registrar un nuevo usuario en el sistema
    """
    try:
        # Verificamos si el email ya existe en la base de datos
        db_user = get_user_by_email(db, email=user.email)
        if db_user:
            # Si el email ya existe, devolvemos un error 409 (conflicto)
            raise HTTPException(
                status_code=409, 
                detail=f"El email {user.email} ya está registrado"
            )
        
        # Creamos el nuevo usuario en la base de datos
        new_user = create_user(db=db, user=user)
        
        # Retornamos el usuario creado (automáticamente convertido a UserResponse)
        return new_user
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error interno del servidor: {str(e)}"
        )

@router.get("/test")
async def test_register():
    """Endpoint de prueba para verificar que el router funciona"""
    return {"message": "Register router funcionando correctamente"}