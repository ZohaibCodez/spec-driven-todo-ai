from fastapi import Request, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
from .security import verify_token, TokenData
from fastapi.security.utils import get_authorization_scheme_param
import re

class JWTBearer(HTTPBearer):
    def __init__(self, auto_error: bool = True):
        super(JWTBearer, self).__init__(auto_error=auto_error)

    async def __call__(self, request: Request) -> Optional[TokenData]:
        credentials: HTTPAuthorizationCredentials = await super(JWTBearer, self).__call__(request)

        if credentials:
            if not credentials.scheme.lower() == "bearer":
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid authentication scheme. Use Bearer token."
                )
            token_data = verify_token(credentials.credentials)
            if token_data is None:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid or expired token."
                )
            return token_data
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="No authorization token provided."
            )

def extract_user_id_from_token(request: Request) -> Optional[int]:
    """Extract user_id from JWT token in the Authorization header."""
    authorization = request.headers.get("Authorization")
    if not authorization:
        return None

    scheme, credentials = get_authorization_scheme_param(authorization)
    if scheme.lower() != "bearer":
        return None

    token_data = verify_token(credentials)
    if token_data:
        return token_data.user_id
    return None

def extract_user_email_from_token(request: Request) -> Optional[str]:
    """Extract email from JWT token in the Authorization header."""
    authorization = request.headers.get("Authorization")
    if not authorization:
        return None

    scheme, credentials = get_authorization_scheme_param(authorization)
    if scheme.lower() != "bearer":
        return None

    token_data = verify_token(credentials)
    if token_data:
        return token_data.email
    return None

def verify_token_on_request(request: Request) -> Optional[TokenData]:
    """
    Verify JWT token on protected endpoints and return token data.
    Returns None if token is invalid or not present.
    """
    authorization = request.headers.get("Authorization")
    if not authorization:
        return None

    scheme, credentials = get_authorization_scheme_param(authorization)
    if scheme.lower() != "bearer":
        return None

    return verify_token(credentials)

def require_valid_token(request: Request) -> TokenData:
    """
    Require a valid JWT token on protected endpoints.
    Raises HTTPException if token is invalid or not present.
    """
    token_data = verify_token_on_request(request)
    if token_data is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token. Please authenticate.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return token_data

def validate_user_owns_resource(request: Request, user_id_in_token: int, user_id_in_resource: int) -> bool:
    """
    Validate that the user_id in the token matches the user_id in the requested resource.
    Returns True if user owns the resource, False otherwise.
    """
    return user_id_in_token == user_id_in_resource