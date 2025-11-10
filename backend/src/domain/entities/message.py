"""
Message Entity
Entidad de dominio para mensajes
"""
from datetime import datetime
from typing import Literal


class Message:
    def __init__(
        self,
        id: str,
        conversation_id: str,
        role: Literal["user", "assistant"],
        content: str,
        created_at: datetime,
    ):
        self.id = id
        self.conversation_id = conversation_id
        self.role = role
        self.content = content
        self.created_at = created_at
