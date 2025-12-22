from fastapi import APIRouter, HTTPException, status, Depends, Request
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from typing import Optional
from sqlmodel import Session, select
from datetime import datetime, timedelta
import logging
from backend.database import get_session
from backend.models import User
from backend.schemas import SignupRequest, SigninRequest, AuthResponse, ErrorResponse, UserResponse
from backend.auth.security import (
    verify_password,
    get_password_hash,
    validate_password_strength,
    create_access_token
)

# Rate limiter
limiter = Limiter(key_func=get_remote_address)

# Router
router = APIRouter(prefix="/auth", tags=["Authentication"])

# Configure logging for authentication events
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@router.post("/signup", response_model=AuthResponse)
@limiter.limit("5/minute")  # Rate limiting: 5 attempts per IP per minute
async def signup(
    request: Request,  # Required for rate limiting
    signup_data: SignupRequest,
    session: Session = Depends(get_session)
):
    """Register a new user with email and password."""

    # Validate password strength
    is_valid, error_msg = validate_password_strength(signup_data.password)
    if not is_valid:
        logger.info(f"Signup failed: {signup_data.email} - {error_msg}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=error_msg
        )

    # Check if email already exists
    existing_user = session.exec(select(User).where(User.email == signup_data.email)).first()
    if existing_user:
        logger.info(f"Signup failed: {signup_data.email} - Email already registered")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Verify password and confirm_password match
    if signup_data.password != signup_data.confirm_password:
        logger.info(f"Signup failed: {signup_data.email} - Passwords do not match")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Passwords do not match"
        )

    # Hash the password
    hashed_password = get_password_hash(signup_data.password)

    # Create new user
    user = User(
        email=signup_data.email,
        password=hashed_password,
        name=signup_data.email.split("@")[0] if not signup_data.name else signup_data.name,  # Use part before @ as default name or provided name
        email_verified=False,
        is_active=True
    )
    session.add(user)
    session.commit()
    session.refresh(user)

    # Create access token
    token_data = {
        "sub": str(user.id),
        "email": user.email,
        "user_id": user.id
    }
    access_token = create_access_token(data=token_data)

    logger.info(f"Signup successful: {user.email}")

    # Convert User model to UserResponse
    user_response = UserResponse(
        id=user.id,
        email=user.email,
        name=user.name,
        created_at=user.created_at,
        updated_at=user.updated_at,
        email_verified=user.email_verified,
        is_active=user.is_active
    )

    return AuthResponse(
        user=user_response,
        access_token=access_token,
        token_type="bearer",
        expires_in=7 * 24 * 60 * 60  # 7 days in seconds
    )


@router.post("/signin", response_model=AuthResponse)
@limiter.limit("5/minute")  # Rate limiting: 5 attempts per IP per minute
async def signin(
    request: Request,  # Required for rate limiting
    signin_data: SigninRequest,
    session: Session = Depends(get_session)
):
    """Authenticate user with email and password."""

    try:
        # Find user by email
        user = session.exec(select(User).where(User.email == signin_data.email)).first()

        if not user or not verify_password(signin_data.password, user.password):
            logger.info(f"Signin failed: {signin_data.email} - Invalid credentials")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )

        if not user.is_active:
            logger.info(f"Signin failed: {signin_data.email} - Account is inactive")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Account is inactive"
            )

        # Create access token
        token_data = {
            "sub": str(user.id),
            "email": user.email,
            "user_id": user.id
        }
        access_token = create_access_token(data=token_data)

        logger.info(f"Signin successful: {user.email}")

        # Convert User model to UserResponse
        user_response = UserResponse(
            id=user.id,
            email=user.email,
            name=user.name,
            created_at=user.created_at,
            updated_at=user.updated_at,
            email_verified=user.email_verified,
            is_active=user.is_active
        )

        return AuthResponse(
            user=user_response,
            access_token=access_token,
            token_type="bearer",
            expires_in=7 * 24 * 60 * 60  # 7 days in seconds
        )
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        logger.error(f"Signin unexpected error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred during signin"
        )


@router.post("/logout")
async def logout():
    """Logout user (client-side operation - tokens are handled on client)."""
    return {"message": "Successfully logged out"}


@router.post("/refresh", response_model=AuthResponse)
async def refresh_token():
    """Refresh access token using refresh token."""
    # For now, we'll return a 501 Not Implemented
    # In a full implementation, this would verify a refresh token and issue a new access token
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Token refresh functionality not yet implemented"
    )