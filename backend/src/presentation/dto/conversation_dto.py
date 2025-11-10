"""
Conversation DTOs
DTOs para conversaciones y mensajes
"""
from pydantic import BaseModel
from datetime import datetime
from typing import Literal


class ConversationCreate(BaseModel):
    user_id: str
    title: str


class ConversationResponse(BaseModel):
    id: str
    user_id: str
    title: str
    created_at: datetime
    updated_at: datetime


class MessageCreate(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class MessageResponse(BaseModel):
    id: str
    conversation_id: str
    role: Literal["user", "assistant"]
    content: str
    created_at: datetime
