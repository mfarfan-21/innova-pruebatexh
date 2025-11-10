"""
Repository Interface: AuthRepository
Define el contrato para autenticación (Port)
"""
from abc import ABC, abstractmethod
from typing import Optional
from domain.entities.user import User


class AuthRepository(ABC):
    """Interface del repositorio de autenticación - Puerto (Port)"""
    
    @abstractmethod
    async def login(self, email: str, password: str) -> tuple[User, str]:
        """
        Autentica un usuario con email y contraseña
        
        Args:
            email: Email del usuario
            password: Contraseña del usuario
            
        Returns:
            tuple: (User, access_token)
            
        Raises:
            ValueError: Si las credenciales son inválidas
        """
        pass
    
    @abstractmethod
    async def logout(self, access_token: str) -> bool:
        """
        Cierra sesión del usuario
        
        Args:
            access_token: Token de acceso del usuario
            
        Returns:
            bool: True si el logout fue exitoso
        """
        pass
    
    @abstractmethod
    async def get_user_by_token(self, access_token: str) -> Optional[User]:
        """
        Obtiene usuario por su token de acceso
        
        Args:
            access_token: Token de acceso
            
        Returns:
            Optional[User]: Usuario si el token es válido, None en caso contrario
        """
        pass
