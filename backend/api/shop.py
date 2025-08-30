from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile, Form
from sqlalchemy.orm import Session
from typing import List

from db.database import get_db
from schemas.shop_schemas import ShopCreate, ShopUpdate, ShopResponse, ShopCreateWithImage
from crud.shop_crud import create_shop, get_shop_by_id, get_shops, update_shop, delete_shop, create_shop_with_image

router = APIRouter(
    prefix="/shops",
    tags=["shops"],
    responses={404: {"description": "Not found"}},
)

@router.post("/", response_model=ShopResponse, status_code=status.HTTP_201_CREATED)
def create_new_shop(shop: ShopCreate, db: Session = Depends(get_db)):
    db_shop = create_shop(db, shop)
    if db_shop is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No se pudo crear la tienda"
        )
    return db_shop

@router.post("/upload", response_model=ShopResponse, status_code=status.HTTP_201_CREATED)
async def create_shop_with_image_upload(
    id_user: int = Form(...),
    shop_name: str = Form(...),
    description: str = Form(...),
    shop_address: str = Form(None),
    is_active: bool = Form(True),
    logo: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Crea una nueva tienda subiendo el logo a Cloudinary.
    """
    try:
        # Validar que el archivo sea una imagen
        if not logo.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="El archivo debe ser una imagen")

        # Crear objeto con los datos del formulario
        shop_data = ShopCreateWithImage(
            id_user=id_user,
            shop_name=shop_name,
            description=description,
            shop_address=shop_address,
            is_active=is_active,
            logo=logo
        )

        # Crear tienda con imagen
        db_shop = create_shop_with_image(db, shop_data, logo)
        if db_shop is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No se pudo crear la tienda con imagen"
            )
        return db_shop

    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {str(e)}")

@router.get("/{shop_id}", response_model=ShopResponse)
def read_shop(shop_id: int, db: Session = Depends(get_db)):
    db_shop = get_shop_by_id(db, shop_id)
    if db_shop is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Tienda con ID {shop_id} no encontrada"
        )
    return db_shop

@router.get("/", response_model=List[ShopResponse])
def read_shops(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    shops = get_shops(db, skip=skip, limit=limit)
    return shops

@router.put("/{shop_id}", response_model=ShopResponse)
def update_existing_shop(shop_id: int, shop: ShopUpdate, db: Session = Depends(get_db)):
    db_shop = update_shop(db, shop_id, shop)
    if db_shop is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Tienda con ID {shop_id} no encontrada"
        )
    return db_shop

@router.put("/upload/{shop_id}", response_model=ShopResponse)
async def update_shop_with_image_upload(
    shop_id: int,
    id_user: int = Form(...),
    shop_name: str = Form(...),
    description: str = Form(...),
    shop_address: str = Form(None),
    is_active: bool = Form(True),
    logo: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    """
    Actualiza una tienda existente, opcionalmente subiendo un nuevo logo a Cloudinary.
    """
    try:
        # Verificar que la tienda existe y pertenece al usuario
        existing_shop = get_shop_by_id(db, shop_id)
        if existing_shop is None:
            raise HTTPException(status_code=404, detail="Tienda no encontrada")

        # Si se proporciona un logo, validarlo y subirlo
        logo_url = existing_shop.logo_url  # Mantener el logo actual por defecto
        if logo:
            if not logo.content_type.startswith('image/'):
                raise HTTPException(status_code=400, detail="El archivo debe ser una imagen")

            # Subir nueva imagen a Cloudinary
            from service.cloudinary import upload_image
            logo_url = upload_image(logo.file.read(), folder="greenpath/shops")

        # Crear objeto con los datos actualizados
        shop_data = ShopUpdate(
            id_user=id_user,
            shop_name=shop_name,
            description=description,
            shop_address=shop_address,
            logo_url=logo_url,
            is_active=is_active
        )

        # Actualizar tienda
        db_shop = update_shop(db, shop_id, shop_data)
        if db_shop is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No se pudo actualizar la tienda"
            )
        return db_shop

    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {str(e)}")

@router.delete("/{shop_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_shop(shop_id: int, db: Session = Depends(get_db)):
    success = delete_shop(db, shop_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Tienda con ID {shop_id} no encontrada"
        )
    return None
