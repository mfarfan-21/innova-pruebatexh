"""
Puerto (Interface) del repositorio de matrículas.
Define el contrato para obtener datos de OCR sin conocer la implementación.
"""

from abc import ABC, abstractmethod
from typing import Optional, List
from domain.entities.plate import Plate


class PlateRepository(ABC):
    """
    Interface del repositorio de matrículas.
    Las implementaciones concretas irán en infrastructure/adapters/outbound/
    """

    @abstractmethod
    def get_plate_by_image_name(self, image_name: str) -> Optional[Plate]:
        """
        Obtiene la información de la matrícula a partir del nombre de la imagen.
        
        Args:
            image_name: Nombre del archivo de imagen (ej: "MD7193_lane1_97.jpg")
        
        Returns:
            Plate si se encuentra, None si no existe
        
        Raises:
            ValueError: Si el formato de datos es inválido
        """
        pass

    @abstractmethod
    def get_all_plates(self) -> List[Plate]:
        """
        Obtiene todas las matrículas disponibles en el sistema.
        
        Returns:
            Lista de objetos Plate
        """
        pass

    @abstractmethod
    def plate_exists(self, image_name: str) -> bool:
        """
        Verifica si existe una matrícula para la imagen dada.
        
        Args:
            image_name: Nombre del archivo de imagen
        
        Returns:
            True si existe, False en caso contrario
        """
        pass
