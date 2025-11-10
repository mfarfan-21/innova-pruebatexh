"""
Domain Entity: User
Representa un usuario en el sistema
"""
from dataclasses import dataclass
from typing import Optional
from datetime import datetime


@dataclass
class User:
    """Entidad de Usuario - Capa de Dominio"""
    id: str
    email: str
    created_at: datetime
    last_sign_in_at: Optional[datetime] = None
    
    def __post_init__(self):
        """Validaciones de dominio"""
        if not self.email or '@' not in self.email:
            raise ValueError("Email inválido")
        
        if not self.id:
            raise ValueError("ID de usuario requerido")
