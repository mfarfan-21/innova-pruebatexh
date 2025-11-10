"""
Supabase Client - Configuración
Cliente singleton para Supabase
"""
from supabase import create_client, Client
from pydantic_settings import BaseSettings
from functools import lru_cache


class SupabaseSettings(BaseSettings):
    """Configuración de Supabase desde variables de entorno"""
    supabase_url: str
    supabase_key: str
    
    class Config:
        env_file = ".env"
        case_sensitive = False


@lru_cache()
def get_supabase_settings() -> SupabaseSettings:
    """Obtiene configuración (cached)"""
    return SupabaseSettings()


def get_supabase_client() -> Client:
    """
    Crea y retorna cliente de Supabase
    
    Returns:
        Client: Cliente de Supabase configurado
    """
    settings = get_supabase_settings()
    return create_client(settings.supabase_url, settings.supabase_key)
