"""
Test del Chatbot Service
"""
import sys
from pathlib import Path

# Agregar el directorio src al path
sys.path.insert(0, str(Path(__file__).parent / "src"))

from application.services.chatbot_service import ChatbotService


def test_chatbot():
    chatbot = ChatbotService()
    
    print("=== TEST CHATBOT POÉTICO ===\n")
    
    # Pruebas en español
    print("📝 ESPAÑOL:\n")
    
    print("Usuario: hola")
    print(f"Bot: {chatbot.get_response('hola', 'es')}\n")
    
    print("Usuario: dame algo de machado")
    print(f"Bot: {chatbot.get_response('dame algo de machado', 'es')}\n")
    
    print("Usuario: cuéntame sobre lorca")
    print(f"Bot: {chatbot.get_response('cuéntame sobre lorca', 'es')}\n")
    
    print("Usuario: algo de humor")
    print(f"Bot: {chatbot.get_response('algo de humor', 'es')}\n")
    
    print("Usuario: un haiku")
    print(f"Bot: {chatbot.get_response('un haiku', 'es')}\n")
    
    print("Usuario: un poema")
    print(f"Bot: {chatbot.get_response('un poema', 'es')}\n")
    
    # Prueba de respuesta default
    print("Usuario: ¿cuánto cuesta?")
    print(f"Bot: {chatbot.get_response('¿cuánto cuesta?', 'es')}\n")
    
    print("\n" + "="*50 + "\n")
    
    # Pruebas en inglés
    print("📝 ENGLISH:\n")
    
    print("User: hello")
    print(f"Bot: {chatbot.get_response('hello', 'en')}\n")
    
    print("User: tell me some poetry")
    print(f"Bot: {chatbot.get_response('tell me some poetry', 'en')}\n")
    
    print("User: something funny")
    print(f"Bot: {chatbot.get_response('something funny', 'en')}\n")
    
    print("\n" + "="*50 + "\n")
    
    # Pruebas en catalán
    print("📝 CATALÀ:\n")
    
    print("Usuari: hola")
    print(f"Bot: {chatbot.get_response('hola', 'ca')}\n")
    
    print("Usuari: explica'm sobre llull")
    print(f"Bot: {chatbot.get_response('explica sobre llull', 'ca')}\n")
    
    print("Usuari: alguna cosa de humor")
    print(f"Bot: {chatbot.get_response('alguna cosa de humor', 'ca')}\n")


if __name__ == "__main__":
    test_chatbot()
