"""
Conversation Service
Servicio para gestionar conversaciones y mensajes con Supabase
"""
from infrastructure.adapters.outbound.database.supabase_client import get_supabase_client
from datetime import datetime
import uuid


class ConversationService:
    def __init__(self):
        self.supabase = get_supabase_client()

    async def get_conversations(self, user_id: str):
        """Obtiene todas las conversaciones de un usuario"""
        response = self.supabase.table("conversations").select("*").eq("user_id", user_id).order("updated_at", desc=True).execute()
        return response.data

    async def create_conversation(self, user_id: str, title: str):
        """Crea una nueva conversación"""
        new_conv = {
            "id": str(uuid.uuid4()),
            "user_id": user_id,
            "title": title,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat(),
        }
        response = self.supabase.table("conversations").insert(new_conv).execute()
        return response.data[0]

    async def get_messages(self, conversation_id: str):
        """Obtiene todos los mensajes de una conversación"""
        response = self.supabase.table("messages").select("*").eq("conversation_id", conversation_id).order("created_at", desc=False).execute()
        return response.data

    async def save_message(self, conversation_id: str, role: str, content: str):
        """Guarda un mensaje en una conversación"""
        new_msg = {
            "id": str(uuid.uuid4()),
            "conversation_id": conversation_id,
            "role": role,
            "content": content,
            "created_at": datetime.utcnow().isoformat(),
        }
        response = self.supabase.table("messages").insert(new_msg).execute()
        
        # Actualizar updated_at de la conversación
        self.supabase.table("conversations").update({"updated_at": datetime.utcnow().isoformat()}).eq("id", conversation_id).execute()
        
        return response.data[0]
