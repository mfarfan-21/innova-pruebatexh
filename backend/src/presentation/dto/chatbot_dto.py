"""
DTOs para Chatbot
"""
from pydantic import BaseModel


class ChatRequest(BaseModel):
    message: str
    language: str = "es"  # es, en, fr


class ChatResponse(BaseModel):
    response: str
    language: str
