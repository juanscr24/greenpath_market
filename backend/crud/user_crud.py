from sqlalchemy.orm import Session
from models.user import User  
from sqlalchemy.exc import SQLAlchemyError
from schemas.user_schemas import UserCreate , UserResponse, UserUpdate
from passlib.context import CryptContext  

# Password encryption context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    """Encriptar contraseña"""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verificar contraseña"""
    return pwd_context.verify(plain_password, hashed_password)

def create_user(db: Session, user: UserCreate):
    """Crear usuario SIN validar foreign keys"""
    hashed_password = get_password_hash(user.user_password)
    
    db_user = User(
        full_name=user.full_name,
        birthdate=user.birthdate,
        email=user.email,
        phone=user.phone,
        id_document_type=user.id_document_type,
        document_number=user.document_number,
        user_password=hashed_password,
        id_rol=user.id_rol,
        user_address=user.user_address
    )
    
    db.add(db_user)
    db.commit()  
    db.refresh(db_user)  
    
    return db_user

def get_user_by_email(db: Session, email: str):
    """Buscar usuario por email"""
    return db.query(User).filter(User.email == email).first()

def get_user_by_id(db: Session, user_id: int):
    """Buscar usuario por ID"""
    return db.query(User).filter(User.id_user == user_id).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    """Obtener lista de usuarios"""
    return db.query(User).offset(skip).limit(limit).all()

def update_user(db: Session, user_id: int, user_data: UserUpdate):
    """Actualizar usuario"""
    try:
        db_user = db.query(User).filter(User.id_user == user_id).first()
        
        if not db_user:
            print(f"Usuario con ID {user_id} no encontrado.")
            return None
        
        #Actualizar los campos del usuario con los datos proporcionados
        for key, value in user_data.dict(exclude_unset=True).items():
            setattr(db_user, key, value)
            
        db.commit()  # Guardar cambios en la base de datos
        db.refresh(db_user)  # Refrescar objeto para obtener los datos más recientes
        
        return UserResponse.from_orm(db_user)
    
    except SQLAlchemyError as e:
        db.rollback()  # Revertir los cambios si algo falla
        print(f"Error actualizando el usuario con ID {user_id}: {e}")
        return None
    
def delete_user(db: Session, user_id: int) -> bool:
    """Eliminar usuario"""
    try:
        db_user = db.query(User).filter(User.id_user == user_id).first()
        
        if not db_user:
            print(f"Usuario con ID {user_id} no encontrado.")
            return False
        
        db.delete(db_user)
        db.commit()
        return True
    
    except SQLAlchemyError as e:
        db.rollback()
        print(f"Error eliminando el usuario con ID {user_id}: {e}")
        return False