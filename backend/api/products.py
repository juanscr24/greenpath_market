from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.database import get_db  # Importamos la función para obtener la sesión de la DB
from schemas.product_schemas import ProductCreate, ProductUpdate, ProductResponse, ProductWithDetailsResponse
from crud.product_crud import create_product, get_product_by_id, get_products, update_product, delete_product, get_products_by_category

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


# Endpoint para obtener un producto por su ID
@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    db_product = get_product_by_id(db, product_id)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return db_product

# Endpoint para obtener todos los productos con paginación
@router.get("/", response_model=list[ProductResponse])
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
