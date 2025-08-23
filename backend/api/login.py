# Required imports
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from db.database import get_db
from schemas.user_schemas import UserLogin, UserResponse
from crud.user_crud import get_user_by_email, verify_password

# We initialize the router for login
router = APIRouter(
    prefix="/login",
    tags=["Login"],
    responses={404: {"message": "No encontrado"}}
)

# POST route for login
@router.post("/", response_model=dict)
async def login_user(user_login: UserLogin, db: Session = Depends(get_db)):
    """
    Authenticate user and generate access token
    """
    try:
        # Search user by email
        user = get_user_by_email(db, email=user_login.email)
        if not user:
            raise HTTPException(
                status_code=401,
                detail="Email o contraseña incorrectos"
            )
        
        # Verify password
        if not verify_password(user_login.password, user.user_password):
            raise HTTPException(
                status_code=401,
                detail="Email o contraseña incorrectos"
            )
        

        return {
            "message": "Login exitoso",
            "user_id": user.id_user,
            "user_name": user.full_name,
            "email": user.email
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error interno del servidor: {str(e)}"
        )

# GET route to verify login status
@router.get("/status")
async def login_status():
    return {"status": "Login service available"}

@router.get("/test")
async def test_login():
    return {"message": "Login router funcionando correctamente"}