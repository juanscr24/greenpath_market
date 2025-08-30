# Import required dependencies for authentication and database operations
from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from datetime import timedelta

from db.database import get_db
from schemas.user_schemas import UserLogin, UserResponse, Token
from crud.user_crud import get_user_by_email, verify_password
from middleware.auth import create_access_token, SECRET_KEY, ACCESS_TOKEN_EXPIRE_MINUTES

# Initialize API router for authentication endpoints
router = APIRouter(
    prefix="/login",
    tags=["Login"],
    responses={404: {"message": "Not found"}}
)

# POST endpoint for user authentication and token generation
@router.post("/", response_model=dict)
async def login_user(user_login: UserLogin, db: Session = Depends(get_db)):
    """
    Authenticate user credentials and generate JWT access token
    """
    try:
        # Search for user by email address
        user = get_user_by_email(db, email=user_login.email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password"
            )
        
        # Verify provided password against stored hash
        if not verify_password(user_login.password, user.user_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password"
            )
        
        # Create JWT access token with user information and expiration
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.email, "user_id": user.id_user},
            expires_delta=access_token_expires
        )

        # Return successful login response with token and user details
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user_id": user.id_user,
            "user_name": user.full_name,
            "email": user.email,
            "role_id": user.id_rol,
            "message": "Login successful"
        }
    
    except HTTPException:
        # Re-raise HTTP exceptions for proper error handling
        raise
    except Exception as e:
        # Handle unexpected internal server errors
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )

# GET endpoint to verify login service status
@router.get("/status")
async def login_status():
    return {"status": "Login service available"}

# GET endpoint for testing login router functionality
@router.get("/test")
async def test_login():
    return {"message": "Login router working correctly"}
