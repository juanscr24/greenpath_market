# Required imports
from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from datetime import timedelta

from db.database import get_db
from schemas.user_schemas import UserLogin, UserResponse, Token
from crud.user_crud import get_user_by_email, verify_password
from middleware.auth import create_access_token, SECRET_KEY, ACCESS_TOKEN_EXPIRE_MINUTES

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
    Autenticar usuario y generar token de acceso
    """
    try:
        # Search user by email
        user = get_user_by_email(db, email=user_login.email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email o contraseña incorrectos"
            )
        
        # Verify password
        if not verify_password(user_login.password, user.user_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email o contraseña incorrectos"
            )
        
        # Create access token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.email, "user_id": user.id_user},
            expires_delta=access_token_expires
        )

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user_id": user.id_user,
            "user_name": user.full_name,
            "email": user.email,
            "role_id": user.id_rol,
            "message": "Login exitoso"
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error interno del servidor: {str(e)}"
        )

# GET route to verify login status
@router.get("/status")
async def login_status():
    return {"status": "Login service available"}

@router.get("/test")
async def test_login():
    return {"message": "Login router funcionando correctamente"}