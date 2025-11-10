"""Authentication API routes"""
from fastapi import APIRouter, HTTPException, Header
from typing import Optional
from application.use_cases.login_user import LoginUserUseCase
from application.services.auth_service import AuthService
from infrastructure.adapters.outbound.database.supabase_client import get_supabase_client
from infrastructure.adapters.outbound.database.supabase_auth_repository import SupabaseAuthRepository
from presentation.dto.auth_dto import LoginRequest, LoginResponse, LogoutRequest, MessageResponse, UserDTO


router = APIRouter(prefix="/auth", tags=["Authentication"])


def get_auth_service() -> AuthService:
    """Create authentication service instance"""
    supabase_client = get_supabase_client()
    auth_repository = SupabaseAuthRepository(supabase_client)
    return AuthService(auth_repository)


@router.post("/login", response_model=LoginResponse)
async def login(credentials: LoginRequest):
    """User login endpoint"""
    try:
        auth_service = get_auth_service()
        login_use_case = LoginUserUseCase(auth_service)
        
        user, access_token = await login_use_case.execute(
            credentials.email,
            credentials.password
        )
        
        return LoginResponse(
            user=UserDTO(
                id=user.id,
                email=user.email,
                created_at=user.created_at,
                last_sign_in_at=user.last_sign_in_at
            ),
            access_token=access_token
        )
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")


@router.post("/logout", response_model=MessageResponse)
async def logout(authorization: Optional[str] = Header(None)):
    """User logout endpoint"""
    try:
        if not authorization or not authorization.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Token not provided")
        
        access_token = authorization.replace("Bearer ", "")
        auth_service = get_auth_service()
        
        success = await auth_service.logout(access_token)
        
        if success:
            return MessageResponse(message="Logout successful")
        else:
            raise HTTPException(status_code=500, detail="Logout failed")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/me", response_model=UserDTO)
async def get_current_user(authorization: Optional[str] = Header(None)):
    """Get current authenticated user"""
    try:
        if not authorization or not authorization.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Token not provided")
        
        access_token = authorization.replace("Bearer ", "")
        auth_service = get_auth_service()
        
        user = await auth_service.get_current_user(access_token)
        
        if not user:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        return UserDTO(
            id=user.id,
            email=user.email,
            created_at=user.created_at,
            last_sign_in_at=user.last_sign_in_at
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
