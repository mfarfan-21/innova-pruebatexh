"""OCR API routes for license plate recognition"""
import os
import cloudinary
import cloudinary.api
from typing import Set
from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import RedirectResponse
from pathlib import Path
from dotenv import load_dotenv
from application.services.ocr_service import OCRService
from infrastructure.adapters.outbound.file.plates_dat_repository import PlatesDatRepository
from presentation.dto.ocr_dto import (
    OCRRequest, OCRResponseSimple, OCRResponseDetailed,
    OCRErrorResponse, CharacterDTO, PlateCoordinatesDTO
)

router = APIRouter(prefix="/ocr", tags=["OCR"])

load_dotenv()

BASE_DIR = Path(__file__).parent.parent.parent.parent.parent.parent.parent
PLATES_DAT_PATH = BASE_DIR / "assets" / "plates.dat"

CLOUDINARY_CLOUD_NAME = os.getenv("CLOUDINARY_CLOUD_NAME")
CLOUDINARY_API_KEY = os.getenv("CLOUDINARY_API_KEY")
CLOUDINARY_API_SECRET = os.getenv("CLOUDINARY_API_SECRET")
CLOUDINARY_FOLDER = "innova-plates/innova-plates"

if not all([CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET]):
    print("Warning: Cloudinary credentials not configured")
    CLOUDINARY_CONFIGURED = False
else:
    CLOUDINARY_CONFIGURED = True
    cloudinary.config(
        cloud_name=CLOUDINARY_CLOUD_NAME,
        api_key=CLOUDINARY_API_KEY,
        api_secret=CLOUDINARY_API_SECRET,
        secure=True
    )

CLOUDINARY_BASE_URL = f"https://res.cloudinary.com/{CLOUDINARY_CLOUD_NAME}/image/upload"

plate_repository = PlatesDatRepository(str(PLATES_DAT_PATH))
ocr_service = OCRService(plate_repository)


def get_cloudinary_available_images() -> Set[str]:
    """Query Cloudinary API 
    
    Returns:
        Los archivos (e.g., {'12282863.jpg', '12365363.jpg'})
    """
    if not CLOUDINARY_CONFIGURED:
        return set()
    
    try:
        all_images = set()
        next_cursor = None
        
        while True:
            params = {
                "type": "upload",
                "prefix": CLOUDINARY_FOLDER + "/",
                "max_results": 500,
            }
            
            if next_cursor:
                params["next_cursor"] = next_cursor
            
            response = cloudinary.api.resources(**params)
            
            for resource in response.get('resources', []):
                public_id = resource.get('public_id', '')
                filename = public_id.split('/')[-1] + '.jpg'
                all_images.add(filename)
            
            next_cursor = response.get('next_cursor')
            if not next_cursor:
                break
        
        return all_images
    
    except Exception as e:
        print(f"Error querying Cloudinary API: {e}")
        return set()


@router.post("/recognize", response_model=OCRResponseSimple, responses={404: {"model": OCRErrorResponse}})
async def recognize_plate(request: OCRRequest):
    """Recognize license plate from image name.
    
    Returns plate number only.
    """
    try:
        plate = ocr_service.recognize_plate(request.image_name)
        
        if plate is None:
            raise HTTPException(
                status_code=404,
                detail=f"OCR data not found for: {request.image_name}"
            )
        
        return OCRResponseSimple(
            plate_number=plate.plate_number,
            image_name=plate.image_name
        )
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")


@router.post("/recognize/detailed", response_model=OCRResponseDetailed, responses={404: {"model": OCRErrorResponse}})
async def recognize_plate_detailed(request: OCRRequest):
    """Recognize license plate with full details.
    
    Includes coordinates, individual characters, and metadata.
    """
    try:
        plate = ocr_service.recognize_plate(request.image_name)
        
        if plate is None:
            raise HTTPException(
                status_code=404,
                detail=f"OCR data not found for: {request.image_name}"
            )
        
        characters_dto = [
            CharacterDTO(
                char=c.char,
                left=c.left,
                top=c.top,
                width=c.width,
                height=c.height
            )
            for c in plate.characters
        ]
        
        coordinates_dto = PlateCoordinatesDTO(
            top_left=plate.coordinates.top_left,
            top_right=plate.coordinates.top_right,
            bottom_right=plate.coordinates.bottom_right,
            bottom_left=plate.coordinates.bottom_left
        )
        
        return OCRResponseDetailed(
            plate_number=plate.plate_number,
            image_name=plate.image_name,
            num_characters=plate.num_characters,
            num_plates_in_image=plate.num_plates_in_image,
            characters=characters_dto,
            coordinates=coordinates_dto,
            is_valid=plate.is_valid()
        )
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")


@router.get("/exists/{image_name}", response_model=dict)
async def check_image_exists(image_name: str):
    """Check if OCR data exists for an image."""
    exists = ocr_service.image_exists(image_name)
    return {"image_name": image_name, "exists": exists}


@router.get("/plates", response_model=dict)
async def list_all_plates(limit: int = Query(default=None, ge=1, le=10000)):
    """List all available plates from Cloudinary.
    
    Queries Cloudinary API dynamically to get available images.
    """
    all_plates = ocr_service.get_all_plates()
    cloudinary_images = get_cloudinary_available_images()
    
    available_plates = [
        plate for plate in all_plates 
        if plate.image_name in cloudinary_images
    ]
    
    if limit is not None:
        available_plates = available_plates[:limit]
    
    return {
        "total": len(all_plates),
        "available": len(available_plates),
        "showing": len(available_plates),
        "cloudinary_synced": CLOUDINARY_CONFIGURED,
        "plates": [
            {
                "image_name": p.image_name,
                "plate_number": p.plate_number,
                "num_characters": p.num_characters
            }
            for p in available_plates
        ]
    }


@router.get("/image/{image_name}")
async def get_plate_image(image_name: str):
    """Redirect to plate image in Cloudinary CDN."""
    if not ocr_service.image_exists(image_name):
        raise HTTPException(status_code=404, detail=f"Image not found: {image_name}")
    
    image_stem = Path(image_name).stem
    cloudinary_url = f"{CLOUDINARY_BASE_URL}/innova-plates/innova-plates/{image_stem}.jpg"
    
    return RedirectResponse(url=cloudinary_url, status_code=302)
