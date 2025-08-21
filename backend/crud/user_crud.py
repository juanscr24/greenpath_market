# We import the necessary tools
from sqlalchemy.orm import Session
from db.models import User  
from schemas.user_schemas import UserCreate  
from passlib.context import CryptContext  

# We configure the password encryption context+6
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    """Encriptar contraseña"""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verificar contraseña"""
    return pwd_context.verify(plain_password, hashed_password)

# --- CRUD Operations ---
def create_user(db: Session, user: UserCreate):

# We encrypt the password before saving it
    hashed_password = get_password_hash(user.password)
    
    # We create the User object with the provided data
    db_user = User(
        name=user.name,
        surname=user.surname,
        url=user.url,
        age=user.age,
        email=user.email,
        password_hash=hashed_password
    )
    
    # We add the user to the database
    db.add(db_user)
    db.commit()  
    db.refresh(db_user)  
    
    return db_user

def get_user_by_email(db: Session, email: str):
    """
    Search user by email
    """
    return db.query(User).filter(User.email == email).first()

def get_user_by_id(db: Session, user_id: int):
    """
    Search user by ID
    """
    return db.query(User).filter(User.id == user_id).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    """
    Get list of users with pagination
    """
    return db.query(User).offset(skip).limit(limit).all()