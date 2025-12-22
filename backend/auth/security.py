import hashlib
import secrets
import base64
from datetime import datetime, timedelta
from typing import Optional
import re
import jwt
from fastapi import HTTPException, status, Security, Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from backend.database import get_session
from sqlmodel import Session
from backend.models import User
from backend.services.user_service import UserService

load_dotenv()

# JWT settings
SECRET_KEY = os.getenv("BETTER_AUTH_SECRET") or os.getenv("JWT_SECRET_KEY", "4f9c2d8a7e6b1c0f9a3e5b7d8c6a2e1f9b4d7a0c3e8f6b2d1a9c5e7b8a4")
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", "10080"))  # 7 days

# HTTP Bearer security scheme
security = HTTPBearer()

class TokenData(BaseModel):
    email: Optional[str] = None
    user_id: Optional[int] = None

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against a hashed password using PBKDF2."""
    try:
        # Extract salt and hash from stored password
        parts = hashed_password.split('$')
        if len(parts) != 2:
            return False
        salt = base64.b64decode(parts[0])
        stored_hash = parts[1]
        
        # Hash the plain password with the same salt
        key = hashlib.pbkdf2_hmac('sha256', plain_password.encode('utf-8'), salt, 100000)
        new_hash = base64.b64encode(key).decode('utf-8')
        
        return secrets.compare_digest(new_hash, stored_hash)
    except Exception:
        return False

def get_password_hash(password: str) -> str:
    """Hash a password using PBKDF2 with SHA256."""
    # Generate a random salt
    salt = secrets.token_bytes(32)
    
    # Hash the password with PBKDF2
    key = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 100000)
    
    # Store salt and hash together (salt$hash format)
    salt_b64 = base64.b64encode(salt).decode('utf-8')
    hash_b64 = base64.b64encode(key).decode('utf-8')
    
    return f"{salt_b64}${hash_b64}"

def validate_password_strength(password: str) -> tuple[bool, str]:
    """
    Validate password strength: minimum 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character.

    Returns:
        tuple[bool, str]: (is_valid, error_message)
    """
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"

    if not re.search(r"[A-Z]", password):
        return False, "Password must contain at least one uppercase letter"

    if not re.search(r"[a-z]", password):
        return False, "Password must contain at least one lowercase letter"

    if not re.search(r"\d", password):
        return False, "Password must contain at least one number"

    if not re.search(r"[!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>\/?]", password):
        return False, "Password must contain at least one special character"

    return True, ""

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token with expiration."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str) -> Optional[TokenData]:
    """Verify a JWT token and return the token data if valid."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("email")
        user_id: int = payload.get("user_id") or payload.get("sub")  # Better Auth uses 'sub' for user ID

        if email is None and user_id is None:
            return None

        # Convert user_id to int if it's a string
        if isinstance(user_id, str):
            user_id = int(user_id)
        elif isinstance(user_id, float):
            user_id = int(user_id)

        token_data = TokenData(email=email, user_id=user_id)
        return token_data
    except jwt.InvalidTokenError:
        return None


def verify_bearer_token(credentials: HTTPAuthorizationCredentials = Security(security)) -> TokenData:
    """
    Verify JWT token from Authorization header and return token data.
    Use this as a dependency in route handlers.
    Raises HTTPException if token is invalid or expired.
    """
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        email: str = payload.get("email")
        user_id: int = payload.get("user_id") or payload.get("sub")  # Better Auth uses 'sub' for user ID

        if email is None or user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token: missing user information",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Convert user_id to int if it's a string
        if isinstance(user_id, str):
            user_id = int(user_id)
        elif isinstance(user_id, float):
            user_id = int(user_id)

        return TokenData(email=email, user_id=user_id)
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


def get_current_user_id(token_data: TokenData = Security(verify_bearer_token)) -> int:
    """
    Extract user ID from verified JWT token.
    Use this as a dependency in route handlers to get the authenticated user's ID.
    """
    return token_data.user_id


def get_current_user(token_data: TokenData = Security(verify_bearer_token), session: Session = Depends(get_session)) -> User:
    """
    Get the current authenticated user object from the JWT token.
    Use this as a dependency in route handlers to get the full user object.
    Raises HTTPException if user is not found.
    """
    user = UserService.get_user_by_id(token_data.user_id, session)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user