"""
DTOs (Data Transfer Objects) para el módulo de OCR.
Define los formatos de request/response de la API.
"""

from pydantic import BaseModel, Field
from typing import List, Optional


class CharacterDTO(BaseModel):
    """DTO para un carácter individual de la matrícula"""
    char: str = Field(..., description="Carácter detectado")
    left: float = Field(..., description="Posición horizontal normalizada (0.0-1.0)")
    top: float = Field(..., description="Posición vertical normalizada (0.0-1.0)")
    width: float = Field(..., description="Ancho normalizado")
    height: float = Field(..., description="Alto normalizado")


class PlateCoordinatesDTO(BaseModel):
    """DTO para las coordenadas de la matrícula en la imagen"""
    top_left: tuple[int, int]
    top_right: tuple[int, int]
    bottom_right: tuple[int, int]
    bottom_left: tuple[int, int]


class OCRRequest(BaseModel):
    """Request para reconocimiento OCR"""
    image_name: str = Field(..., description="Nombre del archivo de imagen", example="MD7193_lane1_97_20221102_145250.jpg")


class OCRResponseSimple(BaseModel):
    """Respuesta simple con solo la matrícula"""
    plate_number: str = Field(..., description="Matrícula detectada", example="MD7193J")
    image_name: str = Field(..., description="Nombre de la imagen")


class OCRResponseDetailed(BaseModel):
    """Respuesta detallada con todos los metadatos"""
    plate_number: str = Field(..., description="Matrícula detectada ordenada")
    image_name: str = Field(..., description="Nombre de la imagen")
    num_characters: int = Field(..., description="Número de caracteres")
    num_plates_in_image: int = Field(..., description="Número de matrículas en la imagen")
    characters: List[CharacterDTO] = Field(..., description="Lista de caracteres con posiciones")
    coordinates: PlateCoordinatesDTO = Field(..., description="Coordenadas de la matrícula")
    is_valid: bool = Field(..., description="Indica si todos los caracteres son válidos")


class OCRErrorResponse(BaseModel):
    """Respuesta de error"""
    error: str = Field(..., description="Mensaje de error")
    detail: Optional[str] = Field(None, description="Detalles adicionales del error")
