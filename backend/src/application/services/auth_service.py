"""
Auth Service
Servicio de aplicación para autenticación
"""
from typing import Optional
from domain.repositories.auth_repository import AuthRepository
from domain.entities.user import User


class AuthService:
    """Servicio de autenticación - Capa de Aplicación"""
    
    def __init__(self, auth_repository: AuthRepository):
        self.auth_repository = auth_repository
    
    async def login(self, email: str, password: str) -> tuple[User, str]:
        """Autentica un usuario"""
        return await self.auth_repository.login(email, password)
    
    async def logout(self, access_token: str) -> bool:
        """Cierra sesión"""
        return await self.auth_repository.logout(access_token)
    
    async def get_current_user(self, access_token: str) -> Optional[User]:
        """Obtiene usuario actual por token"""
        return await self.auth_repository.get_user_by_token(access_token)
