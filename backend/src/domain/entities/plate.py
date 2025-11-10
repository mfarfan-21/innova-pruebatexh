"""
Entidades del dominio para OCR de matrículas
"""
from dataclasses import dataclass
from typing import List


@dataclass
class Character:
    """Carácter individual detectado en la matrícula"""
    char: str
    left: float      # Posición horizontal (0.0 - 1.0)
    top: float       # Posición vertical (0.0 - 1.0)
    width: float
    height: float

    def is_valid(self) -> bool:
        """Valida que sea alfanumérico mayúscula o número"""
        return self.char.isalnum() and (self.char.isupper() or self.char.isdigit())


@dataclass
class PlateCoordinates:
    """Coordenadas de las esquinas de la matrícula"""
    top_left: tuple[int, int]
    top_right: tuple[int, int]
    bottom_right: tuple[int, int]
    bottom_left: tuple[int, int]

    @classmethod
    def from_list(cls, coords: List[int]) -> 'PlateCoordinates':
        """Crea instancia desde lista [x1, y1, x2, y2, x3, y3, x4, y4]"""
        if len(coords) != 8:
            raise ValueError(f"Se esperan 8 coordenadas, se recibieron {len(coords)}")
        
        return cls(
            top_left=(coords[0], coords[1]),
            top_right=(coords[2], coords[3]),
            bottom_right=(coords[4], coords[5]),
            bottom_left=(coords[6], coords[7])
        )


@dataclass
class Plate:
    """Matrícula detectada con todos sus metadatos"""
    image_name: str
    plate_number: str
    characters: List[Character]
    coordinates: PlateCoordinates
    num_plates_in_image: int
    
    def __post_init__(self):
        if not self.plate_number:
            raise ValueError("La matrícula no puede estar vacía")
        if len(self.characters) == 0:
            raise ValueError("Debe haber al menos un carácter")

    def is_valid(self) -> bool:
        """Valida que todos los caracteres sean válidos"""
        return all(char.is_valid() for char in self.characters)
    
    def get_sorted_characters(self) -> str:
        """Retorna caracteres ordenados de izquierda a derecha"""
        sorted_chars = sorted(self.characters, key=lambda c: c.left)
        return ''.join(c.char for c in sorted_chars)
    
    @property
    def num_characters(self) -> int:
        return len(self.characters)
