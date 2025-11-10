"""
Use Case: Login User
Caso de uso para autenticar usuario
"""
from application.services.auth_service import AuthService
from domain.entities.user import User


class LoginUserUseCase:
    """Caso de uso: Autenticar usuario"""
    
    def __init__(self, auth_service: AuthService):
        self.auth_service = auth_service
    
    async def execute(self, email: str, password: str) -> tuple[User, str]:
        """
        Ejecuta el caso de uso de login
        
        Args:
            email: Email del usuario
            password: Contraseña
            
        Returns:
            tuple: (User, access_token)
            
        Raises:
            ValueError: Si las credenciales son inválidas
        """
        # Validaciones básicas
        if not email or '@' not in email:
            raise ValueError("Email inválido")
        
        if not password or len(password) < 6:
            raise ValueError("Contraseña debe tener al menos 6 caracteres")
        
        # Delegar al servicio de autenticación
        return await self.auth_service.login(email, password)
