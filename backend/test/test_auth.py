# Pruebas unitarias de login/registro

from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
import cloudinary
import cloudinary.uploader

app = FastAPI()

# 🔹 Configuración de Cloudinary
cloudinary.config(
    cloud_name="dd7vy0y6n",  ## estas son las apis
    api_key="696564843216284",
    api_secret="5HXe4gQ4A-vqtJikPlcUD-l3Ecg"
)

# 🔹 Ruta para subir imagen guia
@app.post("/upload/")
async def upload_image(file: UploadFile = File(...)):
    try:
        # Subir a Cloudinary
        upload_result = cloudinary.uploader.upload(file.file)
        
        # URL segura que devuelve Cloudinary
        image_url = upload_result["secure_url"]

        # 👉 Aquí es donde guardas la URL en tu base de datos
        # por ejemplo en una tabla productos con su nombre, etc.
        # db.insert({"nombre": "Producto X", "imagen_url": image_url})

        return JSONResponse(content={"url": image_url})

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)


# 🔹 Ruta para consultar (ejemplo)
@app.get("/producto/{id}")
async def get_producto(id: int):
    # Supongamos que consultas en tu base de datos
    # producto = db.get_by_id(id)
    producto = {
        "id": id,
        "nombre": "Camiseta Negra",
        "imagen_url": "https://res.cloudinary.com/tucloud/image/upload/v12345/imagen.png"
    }
    return producto

### Cómo lo pones en Python

### En tu backend con FastAPI quedaría así:

## import cloudinary
## import cloudinary.uploader

cloudinary.config(
    cloud_name="TU_CLOUD_NAME", # ej: dddxyz123
    api_key="TU_API_KEY", # ej: 123456789012345
    api_secret="TU_API_SECRET" # ej: a1b2c3d4e5f6g7h8
)