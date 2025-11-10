"""
DTOs (Data Transfer Objects) para autenticación
"""
from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class LoginRequest(BaseModel):
    """DTO para solicitud de login"""
    email: str
    password: str


class LoginResponse(BaseModel):
    """DTO para respuesta de login"""
    user: 'UserDTO'
    access_token: str
    token_type: str = "bearer"


class UserDTO(BaseModel):
    """DTO para usuario"""
    id: str
    email: str
    created_at: datetime
    last_sign_in_at: Optional[datetime] = None


class LogoutRequest(BaseModel):
    """DTO para logout"""
    access_token: str


class MessageResponse(BaseModel):
    """DTO para mensajes generales"""
    message: str
