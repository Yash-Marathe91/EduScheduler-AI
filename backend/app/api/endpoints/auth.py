from fastapi import APIRouter, Depends, HTTPException, status, Request, Response
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.database import get_db
from app.models.domain import Profile
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse
from app.core.security import get_password_hash, verify_password, create_access_token
from app.core.rate_limit import limiter

router = APIRouter()

@router.post("/register", response_model=TokenResponse)
@limiter.limit("5/minute")
async def register(request_data: RegisterRequest, request: Request, response: Response, db: AsyncSession = Depends(get_db)):
    # Check if user exists
    result = await db.execute(select(Profile).filter(Profile.email == request_data.email))
    existing_user = result.scalars().first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Hash password
    hashed_pw = get_password_hash(request_data.password)
    
    # Create new profile
    new_user = Profile(
        email=request_data.email,
        full_name=request_data.full_name,
        role=request_data.role,
        hashed_password=hashed_pw
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    
    # Generate token
    token = create_access_token(data={"sub": str(new_user.id), "role": new_user.role, "email": new_user.email})
    
    # Set HttpOnly Cookie
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=7 * 24 * 60 * 60 # 7 days
    )
    
    return TokenResponse(
        access_token=token,
        role=new_user.role,
        user_id=str(new_user.id)
    )


@router.post("/login", response_model=TokenResponse)
@limiter.limit("5/minute")
async def login(request_data: LoginRequest, request: Request, response: Response, db: AsyncSession = Depends(get_db)):
    # Find user
    result = await db.execute(select(Profile).filter(Profile.email == request_data.email))
    user = result.scalars().first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
        
    # Check role mismatch if role was provided in the request
    if request_data.role and user.role != request_data.role:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Account role mismatch. You are registered as a {user.role}.",
        )
    
    # Verify password (Fallback check if they don't have hashed_password setup yet)
    if not user.hashed_password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account not configured for local login. Use SSO/Supabase.",
        )
        
    if not verify_password(request_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
        
    # Generate robust JWT
    token = create_access_token(data={"sub": str(user.id), "role": user.role, "email": user.email})
    
    # Set HttpOnly Cookie
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=7 * 24 * 60 * 60 # 7 days
    )
    
    return TokenResponse(
        access_token=token,
        role=user.role,
        user_id=str(user.id)
    )

@router.post("/logout")
def logout(response: Response):
    response.delete_cookie(
        key="access_token",
        secure=True,
        httponly=True,
        samesite="lax"
    )
    return {"message": "Logged out successfully"}
