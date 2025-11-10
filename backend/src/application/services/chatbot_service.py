"""
Chatbot Service - Simple
Servicio minimalista de chatbot con respuestas predefinidas
"""
import json
from pathlib import Path


class ChatbotService:
    def __init__(self):
        # Cargar respuestas desde archivos JSON separados
        responses_dir = Path(__file__).parent.parent.parent / "domain" / "responses"
        self.responses = {}
        
        # Cargar cada idioma
        for lang_file in ["es.json", "en.json", "ca.json"]:
            lang_code = lang_file.split('.')[0]
            lang_path = responses_dir / lang_file
            with open(lang_path, 'r', encoding='utf-8') as f:
                self.responses[lang_code] = json.load(f)
    
    def get_response(self, message: str, language: str = "es") -> str:
        """
        Obtiene respuesta basada en el mensaje y el idioma
        """
        message_lower = message.lower().strip()
        
        # Obtener respuestas del idioma seleccionado
        lang_responses = self.responses.get(language, self.responses["es"])
        
        # Buscar palabra clave en el mensaje
        for keyword, response in lang_responses.items():
            if keyword != "default" and keyword in message_lower:
                return response
        
        # Respuesta por defecto si no encuentra coincidencia
        return lang_responses.get("default", "¿Podrías reformular tu pregunta?")
