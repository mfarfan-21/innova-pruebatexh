"""
FastAPI Server - Main Entry Point
API con Supabase Auth + Chatbot + OCR - Arquitectura Hexagonal
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from infrastructure.adapters.inbound.api.routes.auth import router as auth_router
from infrastructure.adapters.inbound.api.routes.chatbot import router as chatbot_router
from infrastructure.adapters.inbound.api.routes.conversation import router as conversation_router
from infrastructure.adapters.inbound.api.routes.ocr import router as ocr_router

app = FastAPI(
    title="Innova API",
    description="API con Supabase Auth + Chatbot + OCR",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(chatbot_router)
app.include_router(conversation_router)
app.include_router(ocr_router)


@app.get("/")
async def root():
    return {"status": "ok", "message": "Innova API", "version": "1.0.0"}


@app.get("/health")
async def health():
    return {"status": "healthy", "service": "innova-api"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
