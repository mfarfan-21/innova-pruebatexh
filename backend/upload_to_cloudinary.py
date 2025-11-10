#!/usr/bin/env python3
"""
Script para subir imágenes y plates.dat a Cloudinary
Uso: python3 upload_to_cloudinary.py
"""
import os
import sys
from pathlib import Path

try:
    import cloudinary
    import cloudinary.uploader
    from cloudinary.utils import cloudinary_url
except ImportError:
    print("❌ Error: Necesitas instalar cloudinary")
    print("Ejecuta: pip install cloudinary")
    sys.exit(1)

# Configuración de Cloudinary (configura tus credenciales)
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME", "TU_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY", "TU_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET", "TU_API_SECRET")
)

def upload_images():
    """Subir todas las imágenes a Cloudinary"""
    assets_path = Path(__file__).parent / "assets" / "imgs"
    
    if not assets_path.exists():
        print(f"❌ Error: No se encuentra la carpeta {assets_path}")
        return
    
    images = list(assets_path.glob("*.jpg"))
    total = len(images)
    
    print(f"📤 Subiendo {total} imágenes a Cloudinary...")
    print("=" * 50)
    
    uploaded = 0
    failed = 0
    
    for idx, image_path in enumerate(images, 1):
        try:
            # Subir imagen a Cloudinary
            result = cloudinary.uploader.upload(
                str(image_path),
                folder="innova-ocr/imgs",  # Carpeta en Cloudinary
                public_id=image_path.stem,  # Nombre sin extensión
                overwrite=True,
                resource_type="image"
            )
            
            uploaded += 1
            print(f"✅ [{idx}/{total}] {image_path.name} -> {result['secure_url']}")
            
        except Exception as e:
            failed += 1
            print(f"❌ [{idx}/{total}] {image_path.name} - Error: {e}")
    
    print("=" * 50)
    print(f"✅ Subidas: {uploaded}")
    print(f"❌ Fallidas: {failed}")
    print(f"📊 Total: {total}")

def upload_plates_dat():
    """Subir plates.dat como archivo raw"""
    plates_path = Path(__file__).parent / "assets" / "plates.dat"
    
    if not plates_path.exists():
        print(f"❌ Error: No se encuentra {plates_path}")
        return
    
    print("\n📤 Subiendo plates.dat a Cloudinary...")
    
    try:
        result = cloudinary.uploader.upload(
            str(plates_path),
            folder="innova-ocr",
            public_id="plates",
            resource_type="raw",  # Para archivos no-imagen
            overwrite=True
        )
        
        print(f"✅ plates.dat subido exitosamente")
        print(f"🔗 URL: {result['secure_url']}")
        
        # Guardar URL para usar en el backend
        env_path = Path(__file__).parent / ".env"
        with open(env_path, "a") as f:
            f.write(f"\n# Cloudinary URLs\n")
            f.write(f"CLOUDINARY_PLATES_DAT_URL={result['secure_url']}\n")
        
        print(f"✅ URL guardada en {env_path}")
        
    except Exception as e:
        print(f"❌ Error subiendo plates.dat: {e}")

def verify_credentials():
    """Verificar que las credenciales estén configuradas"""
    config = cloudinary.config()
    
    if config.cloud_name == "TU_CLOUD_NAME":
        print("❌ Error: Configura tus credenciales de Cloudinary")
        print("\nOpciones:")
        print("1. Edita este archivo y reemplaza TU_CLOUD_NAME, TU_API_KEY, TU_API_SECRET")
        print("2. O configura variables de entorno:")
        print("   export CLOUDINARY_CLOUD_NAME=tu_cloud_name")
        print("   export CLOUDINARY_API_KEY=tu_api_key")
        print("   export CLOUDINARY_API_SECRET=tu_api_secret")
        return False
    
    print(f"✅ Cloudinary configurado: {config.cloud_name}")
    return True

if __name__ == "__main__":
    print("🚀 Script de subida a Cloudinary - INNOVA OCR")
    print("=" * 50)
    
    if not verify_credentials():
        sys.exit(1)
    
    # Subir imágenes
    upload_images()
    
    # Subir plates.dat
    upload_plates_dat()
    
    print("\n✅ ¡Proceso completado!")
    print("\n📝 Próximos pasos:")
    print("1. Verifica las imágenes en: https://cloudinary.com/console/media_library")
    print("2. El backend ya está configurado para usar Cloudinary")
    print("3. Actualiza el .env con tu CLOUDINARY_CLOUD_NAME")
