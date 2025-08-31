from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.database import get_db  # Importamos la función para obtener la sesión de la DB
from schemas.user_schemas import UserCreate, UserUpdate, UserResponse
from crud.user_crud import create_user, get_user_by_id, get_users, update_user, delete_user
from middleware.auth import get_current_user

router = APIRouter(
        prefix="/users",
        tags=["Users"],
        responses={404: {"message": "No encontrado"}}
)


# Endpoint para crear un usuario (público - no requiere autenticación)
@router.post("/", response_model=UserResponse)
def create_new_user(user: UserCreate, db: Session = Depends(get_db)):
    try:
        return create_user(db=db, user=user)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
# Endpoint para obtener un usuario por su ID (protegido)
@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    # Verificar que el usuario solo pueda acceder a su propio perfil
    if current_user.get("user_id") != user_id:
        raise HTTPException(status_code=403, detail="No tienes permiso para acceder a este recurso")
    
    db_user = get_user_by_id(db, user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return db_user

# Endpoint para obtener todos los usuarios con paginación (protegido - solo admin)
@router.get("/", response_model=list[UserResponse])
def get_all_users(skip: int = 0, limit: int = 100, current_user: dict = Depends(get_current_user), db = Depends(get_db)):
    # Aquí puedes agregar lógica para verificar si el usuario es administrador
    # if current_user.get("role_id") != 3:  # 3 = administrador
    #     raise HTTPException(status_code=403, detail="Solo administradores pueden ver todos los usuarios")
    
    return get_users(db, skip=skip, limit=limit)

# Endpoint para actualizar un usuario (protegido)
@router.put("/{user_id}", response_model=UserResponse)
def update_existing_user(user_id: int, user_data: UserUpdate, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    # Verificar que el usuario solo pueda actualizar su propio perfil
    if current_user.get("user_id") != user_id:
        raise HTTPException(status_code=403, detail="No tienes permiso para actualizar este usuario")
    
    db_user = update_user(db, user_id, user_data)
    if db_user is None:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return db_user

# Endpoint para eliminar un usuario (protegido)
@router.delete("/{user_id}", response_model=dict)
def delete_existing_user(user极速加速器: int, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    # Verificar que el usuario solo pueda eliminar su propia cuenta
    if current_user.get("user_id") != user_id:
        raise HTTPException(status_code=403, detail="No tienes permiso para eliminar este usuario")
    
    success = delete_user(db, user_id)
    if not success:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return {"message": "Usuario eliminado correctamente"}

# Endpoint para obtener perfil del usuario autenticado (protegido)
@router.get("/me/profile", response_model=UserResponse)
def get_my_profile(current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    """Obtener el perfil del usuario autenticado usando el user_id del token JWT"""
    user_id = current_user.get("user_id")
    db_user = get_user_by_id(db, user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return db_user
