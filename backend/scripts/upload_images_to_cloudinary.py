#!/usr/bin/env python3
"""
Script para migrar imágenes locales a Cloudinary
Sube todas las imágenes de backend/assets/imgs/ al CDN de Cloudinary
"""

import os
import sys
from pathlib import Path
import cloudinary
import cloudinary.uploader
from dotenv import load_dotenv

# Agregar el directorio raíz al path para imports
BASE_DIR = Path(__file__).parent.parent
sys.path.insert(0, str(BASE_DIR))

# Cargar variables de entorno
env_path = BASE_DIR / '.env'
load_dotenv(env_path)

# Configurar Cloudinary
cloudinary.config(
    cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
    api_key=os.getenv('CLOUDINARY_API_KEY'),
    api_secret=os.getenv('CLOUDINARY_API_SECRET'),
    secure=True
)

def upload_images():
    """
    Sube todas las imágenes de assets/imgs/ a Cloudinary
    """
    images_dir = BASE_DIR / 'assets' / 'imgs'
    
    if not images_dir.exists():
        print(f"❌ Error: Directorio {images_dir} no encontrado")
        return
    
    # Obtener lista de imágenes
    image_files = sorted([f for f in images_dir.iterdir() if f.suffix.lower() == '.jpg'])
    total_images = len(image_files)
    
    print(f"📦 Encontradas {total_images} imágenes para subir a Cloudinary")
    print(f"☁️  Cloud Name: {os.getenv('CLOUDINARY_CLOUD_NAME')}")
    print("-" * 60)
    
    uploaded = 0
    failed = 0
    skipped = 0
    
    for idx, image_path in enumerate(image_files, 1):
        image_name = image_path.name
        
        try:
            # Subir imagen a Cloudinary
            # public_id es el nombre sin extensión para mantener consistencia
            public_id = f"innova-plates/{image_path.stem}"
            
            print(f"[{idx}/{total_images}] Subiendo {image_name}...", end=" ")
            
            result = cloudinary.uploader.upload(
                str(image_path),
                public_id=public_id,
                folder="innova-plates",
                resource_type="image",
                overwrite=False,  # No sobrescribir si ya existe
                invalidate=True,  # Invalidar CDN cache
            )
            
            uploaded += 1
            print(f"✅ OK - URL: {result['secure_url']}")
            
        except cloudinary.exceptions.Error as e:
            # Si ya existe, contar como skipped
            if "already exists" in str(e).lower():
                skipped += 1
                print(f"⏭️  Ya existe")
            else:
                failed += 1
                print(f"❌ Error: {e}")
        except Exception as e:
            failed += 1
            print(f"❌ Error inesperado: {e}")
    
    # Resumen
    print("\n" + "=" * 60)
    print("📊 RESUMEN DE MIGRACIÓN")
    print("=" * 60)
    print(f"✅ Subidas exitosas:  {uploaded}")
    print(f"⏭️  Ya existían:       {skipped}")
    print(f"❌ Fallidas:          {failed}")
    print(f"📦 Total procesadas:  {total_images}")
    
    if failed == 0:
        print("\n🎉 ¡Migración completada exitosamente!")
        print(f"🌐 Las imágenes están disponibles en Cloudinary CDN")
        print(f"📁 Carpeta: innova-plates/")
    else:
        print(f"\n⚠️  Migración completada con {failed} errores")
    
    return uploaded, failed, skipped


def verify_config():
    """
    Verifica que las credenciales de Cloudinary estén configuradas
    """
    required_vars = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET']
    missing = [var for var in required_vars if not os.getenv(var)]
    
    if missing:
        print("❌ Error: Faltan variables de entorno:")
        for var in missing:
            print(f"   - {var}")
        print("\nAsegúrate de configurar el archivo backend/.env")
        return False
    
    return True


if __name__ == '__main__':
    print("=" * 60)
    print("🚀 MIGRACIÓN DE IMÁGENES A CLOUDINARY")
    print("=" * 60)
    print()
    
    if not verify_config():
        sys.exit(1)
    
    try:
        upload_images()
    except KeyboardInterrupt:
        print("\n\n⚠️  Migración interrumpida por el usuario")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Error crítico: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
