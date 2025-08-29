import os
from dotenv import load_dotenv
import cloudinary
import cloudinary.uploader
from fastapi import HTTPException

# Cargar variables de entorno
load_dotenv()

# Configurar Cloudinary
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

def upload_image(file_content: bytes, folder: str = "greenpath/products") -> str:
    """
    Sube una imagen a Cloudinary y devuelve la URL segura
    
    """
    try:
        # Subir imagen a Cloudinary
        upload_result = cloudinary.uploader.upload(
            file_content,
            folder=folder,
            resource_type="image"
        )
        
        # Devolver URL segura
        return upload_result.get('secure_url')
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al subir la imagen a Cloudinary: {str(e)}"
        )
