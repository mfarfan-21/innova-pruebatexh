"""
Conversation Entity
Entidad de dominio para conversaciones
"""
from datetime import datetime
from typing import Optional


class Conversation:
    def __init__(
        self,
        id: str,
        user_id: str,
        title: str,
        created_at: datetime,
        updated_at: datetime,
    ):
        self.id = id
        self.user_id = user_id
        self.title = title
        self.created_at = created_at
        self.updated_at = updated_at
