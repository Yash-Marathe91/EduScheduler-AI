from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.domain import Profile
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse
from app.core.security import get_password_hash, verify_password, create_access_token

router = APIRouter()

@router.post("/register", response_model=TokenResponse)
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    # Check if user exists
    existing_user = db.query(Profile).filter(Profile.email == request.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Hash password
    hashed_pw = get_password_hash(request.password)
    
    # Create new profile
    new_user = Profile(
        email=request.email,
        full_name=request.full_name,
        role=request.role,
        hashed_password=hashed_pw
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Generate token
    token = create_access_token(data={"sub": str(new_user.id), "role": new_user.role, "email": new_user.email})
    
    return TokenResponse(
        access_token=token,
        role=new_user.role,
        user_id=str(new_user.id)
    )


@router.post("/login", response_model=TokenResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    # Find user
    user = db.query(Profile).filter(Profile.email == request.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    
    # Verify password (Fallback check if they don't have hashed_password setup yet)
    if not user.hashed_password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account not configured for local login. Use SSO/Supabase.",
        )
        
    if not verify_password(request.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
        
    # Generate robust JWT
    token = create_access_token(data={"sub": str(user.id), "role": user.role, "email": user.email})
    
    return TokenResponse(
        access_token=token,
        role=user.role,
        user_id=str(user.id)
    )
