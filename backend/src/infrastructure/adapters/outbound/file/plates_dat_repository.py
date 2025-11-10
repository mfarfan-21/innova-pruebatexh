"""
Repositorio de matrículas usando archivo plates.dat
Adaptador que lee y parsea el formato específico del archivo
"""
import os
from pathlib import Path
from typing import Optional, List, Dict
from domain.entities.plate import Plate, Character, PlateCoordinates
from domain.repositories.plate_repository import PlateRepository


class PlatesDatRepository(PlateRepository):
    """Repositorio que lee matrículas desde plates.dat"""

    def __init__(self, plates_dat_path: str):
        self.plates_dat_path = Path(plates_dat_path)
        
        if not self.plates_dat_path.exists():
            raise FileNotFoundError(f"No se encontró el archivo: {plates_dat_path}")
        
        self._plates_cache: Optional[Dict[str, Plate]] = None

    def _load_plates_cache(self) -> Dict[str, Plate]:
        """Carga todas las matrículas en memoria (cache)"""
        if self._plates_cache is not None:
            return self._plates_cache

        plates = {}
        
        with open(self.plates_dat_path, 'r', encoding='utf-8') as file:
            for line in file:
                line = line.strip()
                if not line:
                    continue
                
                try:
                    plate = self._parse_line(line)
                    plates[plate.image_name] = plate
                except Exception:
                    # Ignorar líneas con formato inválido
                    continue
        
        self._plates_cache = plates
        return plates

    def _parse_line(self, line: str) -> Plate:
        """
        Parsea una línea del archivo plates.dat
        Formato: <imagen> <num_matriculas> <8_coords> <num_chars> <char> <left> <top> <width> <height> ...
        """
        parts = line.split()
        
        if len(parts) < 11:
            raise ValueError(f"Línea con formato inválido: {line[:50]}...")
        
        image_name = parts[0]
        num_plates = int(parts[1])
        
        # Coordenadas (8 valores: x1,y1, x2,y2, x3,y3, x4,y4)
        coords_raw = [int(parts[i]) for i in range(2, 10)]
        coordinates = PlateCoordinates.from_list(coords_raw)
        
        num_chars = int(parts[10])
        
        # Parsear caracteres (cada uno ocupa 5 valores)
        characters = []
        idx = 11
        
        for _ in range(num_chars):
            if idx + 4 >= len(parts):
                raise ValueError(f"Faltan datos de caracteres en: {image_name}")
            
            char = parts[idx]
            left = float(parts[idx + 1])
            top = float(parts[idx + 2])
            width = float(parts[idx + 3])
            height = float(parts[idx + 4])
            
            characters.append(Character(char=char, left=left, top=top, width=width, height=height))
            idx += 5
        
        # Ordenar por posición horizontal
        characters_sorted = sorted(characters, key=lambda c: c.left)
        plate_number = ''.join(c.char for c in characters_sorted)
        
        return Plate(
            image_name=image_name,
            plate_number=plate_number,
            characters=characters,
            coordinates=coordinates,
            num_plates_in_image=num_plates
        )

    def get_plate_by_image_name(self, image_name: str) -> Optional[Plate]:
        """Obtiene la matrícula para una imagen específica"""
        plates = self._load_plates_cache()
        return plates.get(image_name)

    def get_all_plates(self) -> List[Plate]:
        """Retorna todas las matrículas cargadas"""
        plates = self._load_plates_cache()
        return list(plates.values())

    def plate_exists(self, image_name: str) -> bool:
        """Verifica si existe una matrícula para la imagen"""
        plates = self._load_plates_cache()
        return image_name in plates
