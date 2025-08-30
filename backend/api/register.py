# Import dependencies for database operations and API routing
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from db.database import get_db  
from schemas.user_schemas import UserCreate, UserResponse 
from crud.user_crud import create_user, get_user_by_email 

# Initialize API router for user registration endpoints
router = APIRouter(
    prefix="/register",
    tags=["Register"],
    responses={404: {"message": "Not found"}}
)

# POST endpoint to register a new user in the system
@router.post("/", response_model=UserResponse, status_code=201)
async def register_user(user: UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user with email validation to prevent duplicates
    """
    try:
        # We check if the email already exists in the database
        db_user = get_user_by_email(db, email=user.email)
        if db_user:
            # Return 409 conflict error if email is already registered
            raise HTTPException(
                status_code=409, 
                detail=f"Email {user.email} is already registered"
            )
        
        # Create new user record in the database
        new_user = create_user(db=db, user=user)
        
        return new_user
    
    except HTTPException:
        # Re-raise HTTP exceptions to maintain proper error handling
        raise
    except Exception as e:
        # Handle unexpected internal server errors
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )

