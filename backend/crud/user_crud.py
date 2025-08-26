from sqlalchemy.orm import Session
from models.user import User  
from schemas.user_schemas import UserCreate  
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