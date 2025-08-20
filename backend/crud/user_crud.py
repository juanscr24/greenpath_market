# Importamos las herramientas necesarias
from sqlalchemy.orm import Session
from db.models import User  # Importamos el modelo User
from schemas.user_schemas import UserCreate  # Importamos los esquemas
from passlib.context import CryptContext  # Para encriptar contraseñas

# Configuramos el contexto de encriptación de contraseñas
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

# --- Operaciones CRUD ---
def create_user(db: Session, user: UserCreate):

    # Encriptamos la contraseña antes de guardarla
    hashed_password = get_password_hash(user.password)
    
    # Creamos el objeto User con los datos proporcionados
    db_user = User(
        name=user.name,
        surname=user.surname,
        url=user.url,
        age=user.age,
        email=user.email,
        password_hash=hashed_password
    )
    
    # Agregamos el usuario a la base de datos
    db.add(db_user)
    db.commit()  # Guardamos los cambios
    db.refresh(db_user)  # Actualizamos el objeto con los datos de la BD
    
    return db_user

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()
