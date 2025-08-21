# We import the dependencies necessary to work with the database
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from db.database import get_db  
from schemas.user_schemas import UserCreate, UserResponse 
from crud.user_crud import create_user, get_user_by_email 

# We initialize the router for users
router = APIRouter(
    prefix="/register",
    tags=["Register"],
    responses={404: {"message": "No encontrado"}}
)

# POST route to register a new user
@router.post("/", response_model=UserResponse, status_code=201)
async def register_user(user: UserCreate, db: Session = Depends(get_db)):
    try:
       # We check if the email already exists in the database
        db_user = get_user_by_email(db, email=user.email)
        if db_user:
            # If the email already exists, we return a 409 error (conflict)
            raise HTTPException(
                status_code=409, 
                detail=f"El email {user.email} ya está registrado"
            )
        
        # We create the new user in the database
        new_user = create_user(db=db, user=user)
        
        return new_user
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error interno del servidor: {str(e)}"
        )

