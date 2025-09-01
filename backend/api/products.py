from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form
from sqlalchemy.orm import Session
from db.database import get_db  # Importamos la función para obtener la sesión de la DB
from schemas.product_schemas import ProductCreate, ProductUpdate, ProductResponse, ProductWithDetailsResponse, ProductCreateWithImage
from crud.product_crud import create_product, get_product_by_id, get_products, update_product, delete_product, get_products_by_category, create_product_with_image, get_products_by_shop
from middleware.auth import get_current_user

router = APIRouter(
        prefix="/products",
        tags=["Products"],
        responses={404: {"message": "No encontrado"}}
)

# Endpoint para crear un producto
@router.post("/", response_model=ProductResponse)
def create_new_product(product: ProductCreate, db: Session = Depends(get_db)):
    try:
        return create_product(db=db, product=product)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Endpoint para crear un producto con upload de imagen
@router.post("/upload", response_model=ProductResponse)
async def create_product_with_image_upload(
    id_shop: int = Form(...),
    name_product: str = Form(...),
    product_description: str = Form(None),
    price: float = Form(...),
    stock: int = Form(...),
    product_star_rate: float = Form(...),
    id_category: int = Form(...),
    image: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Crea un nuevo producto subiendo una imagen a Cloudinary.
    """
    try:
        # Validar que el archivo sea una imagen
        if not image.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="El archivo debe ser una imagen")
        
        # Crear objeto con los datos del formulario
        product_data = ProductCreateWithImage(
            id_shop=id_shop,
            name_product=name_product,
            product_description=product_description,
            price=price,
            stock=stock,
            product_star_rate=product_star_rate,
            id_category=id_category,
            image=image
        )
        
        # Crear producto con imagen
        return create_product_with_image(db, product_data, image)
        
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {str(e)}")


# Endpoint para obtener un producto por su ID
@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    db_product = get_product_by_id(db, product_id)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return db_product

# Endpoint para obtener productos filtrados por categoría
@router.get("/category/{category_id}", response_model=list[ProductWithDetailsResponse])
def get_products_by_category_endpoint(category_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    products = get_products_by_category(db, category_id, skip=skip, limit=limit)
    if not products:
        raise HTTPException(status_code=404, detail="No se encontraron productos para esta categoría")
    return products

# Endpoint para obtener productos por tienda
@router.get("/shop/{shop_id}", response_model=list[ProductResponse])
def get_products_by_shop_endpoint(shop_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    products = get_products_by_shop(db, shop_id, skip=skip, limit=limit)
    return products

# Endpoint para obtener todos los productos con paginación (público)
@router.get("/", response_model=list[ProductWithDetailsResponse])
def get_all_products(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_products(db, skip=skip, limit=limit)

# Endpoint para actualizar un producto
@router.put("/{product_id}", response_model=ProductResponse)
def update_existing_product(product_id: int, product_data: ProductUpdate, db: Session = Depends(get_db)):
    db_product = update_product(db, product_id, product_data)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return db_product

# Endpoint para eliminar un producto
@router.delete("/{product_id}", response_model=dict)
def delete_existing_product(product_id: int, db: Session = Depends(get_db)):
    success = delete_product(db, product_id)
    if not success:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return {"message": "Producto eliminado correctamente"}
