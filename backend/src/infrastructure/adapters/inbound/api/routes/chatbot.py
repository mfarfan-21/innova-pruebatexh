"""Chatbot API routes"""
from fastapi import APIRouter
from application.services.chatbot_service import ChatbotService
from presentation.dto.chatbot_dto import ChatRequest, ChatResponse

router = APIRouter(prefix="/chatbot", tags=["chatbot"])

chatbot_service = ChatbotService()


@router.post("/message", response_model=ChatResponse)
async def send_message(request: ChatRequest):
    """Send message to chatbot and receive response"""
    response = chatbot_service.get_response(request.message, request.language)
    
    return ChatResponse(
        response=response,
        language=request.language
    )
