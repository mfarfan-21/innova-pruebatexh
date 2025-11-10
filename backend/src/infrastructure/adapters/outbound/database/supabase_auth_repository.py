"""
Supabase Auth Repository Implementation
Implementa AuthRepository usando Supabase (Adapter)
"""
from typing import Optional
from datetime import datetime
from supabase import Client
from domain.entities.user import User
from domain.repositories.auth_repository import AuthRepository


class SupabaseAuthRepository(AuthRepository):
    """Implementación del repositorio de autenticación con Supabase"""
    
    def __init__(self, supabase_client: Client):
        self.client = supabase_client
    
    async def login(self, email: str, password: str) -> tuple[User, str]:
        """
        Autentica usuario con Supabase
        Solo permite login de usuarios ya creados en Supabase
        """
        try:
            # Autenticar con Supabase
            response = self.client.auth.sign_in_with_password({
                "email": email,
                "password": password
            })
            
            if not response.user:
                raise ValueError("Credenciales inválidas")
            
            # Convertir a entidad de dominio
            user = User(
                id=response.user.id,
                email=response.user.email,
                created_at=datetime.fromisoformat(response.user.created_at.replace('Z', '+00:00')),
                last_sign_in_at=datetime.fromisoformat(response.user.last_sign_in_at.replace('Z', '+00:00')) if response.user.last_sign_in_at else None
            )
            
            access_token = response.session.access_token
            
            return user, access_token
            
        except Exception as e:
            raise ValueError(f"Error en login: {str(e)}")
    
    async def logout(self, access_token: str) -> bool:
        """Cierra sesión del usuario"""
        try:
            self.client.auth.sign_out()
            return True
        except Exception:
            return False
    
    async def get_user_by_token(self, access_token: str) -> Optional[User]:
        """Obtiene usuario por token"""
        try:
            response = self.client.auth.get_user(access_token)
            
            if not response.user:
                return None
            
            return User(
                id=response.user.id,
                email=response.user.email,
                created_at=datetime.fromisoformat(response.user.created_at.replace('Z', '+00:00')),
                last_sign_in_at=datetime.fromisoformat(response.user.last_sign_in_at.replace('Z', '+00:00')) if response.user.last_sign_in_at else None
            )
        except Exception:
            return None
