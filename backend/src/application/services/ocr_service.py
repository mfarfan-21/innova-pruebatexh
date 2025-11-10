"""
Servicio de OCR de matrículas
Lógica de negocio para reconocimiento de matrículas
"""
from typing import Optional
from domain.entities.plate import Plate
from domain.repositories.plate_repository import PlateRepository


class OCRService:
    """Servicio de aplicación para OCR de matrículas"""

    def __init__(self, plate_repository: PlateRepository):
        self.plate_repository = plate_repository

    def recognize_plate(self, image_name: str) -> Optional[Plate]:
        """Reconoce la matrícula en una imagen"""
        plate = self.plate_repository.get_plate_by_image_name(image_name)
        
        if plate is None:
            return None
        
        if not plate.is_valid():
            invalid_chars = [c.char for c in plate.characters if not c.is_valid()]
            raise ValueError(
                f"Matrícula con caracteres inválidos: {invalid_chars}. "
                f"Solo se permiten alfanuméricos mayúsculas."
            )
        
        return plate

    def get_plate_number_only(self, image_name: str) -> Optional[str]:
        """Retorna solo el número de matrícula"""
        plate = self.recognize_plate(image_name)
        return plate.plate_number if plate else None

    def image_exists(self, image_name: str) -> bool:
        """Verifica si existe información OCR para una imagen"""
        return self.plate_repository.plate_exists(image_name)

    def get_all_plates(self):
        """Retorna todas las matrículas disponibles"""
        return self.plate_repository.get_all_plates()
