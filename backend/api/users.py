from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.database import get_db  # Importamos la función para obtener la sesión de la DB
from schemas.user_schemas import UserCreate, UserUpdate, UserResponse
from crud.user_crud import create_user, get_user_by_id, get_users, update_user, delete_user

router = APIRouter(
        prefix="/users",
        tags=["Users"],
        responses={404: {"message": "No encontrado"}}
)


# Endpoint para crear un usuario
@router.post("/", response_model=UserResponse)
def create_new_user(user: UserCreate, db: Session = Depends(get_db)):
    try:
        return create_user(db=db, user=user)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
# Endpoint para obtener un usuario por su ID
@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    db_user = get_user_by_id(db, user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return db_user

# Endpoint para obtener todos los usuarios con paginación
@router.get("/", response_model=list[UserResponse])
def get_all_users(skip: int = 0, limit: int = 100, db = Depends(get_db)):
    return get_users(db, skip=skip, limit=limit)

# Endpoint para actualizar un usuario
@router.put("/{user_id}", response_model=UserResponse)
def update_existing_user(user_id: int, user_data: UserUpdate, db: Session = Depends(get_db)):
    db_user = update_user(db, user_id, user_data)
    if db_user is None:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return db_user

# Endpoint para eliminar un usuario

@router.delete("/{user_id}", response_model=dict)
def delete_existing_user(user_id: int, db: Session = Depends(get_db)):
    success = delete_user(db, user_id)
    if not success:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return {"message": "Usuario eliminado correctamente"}