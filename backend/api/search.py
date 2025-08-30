    # We import the dependencies necessary to work with the database
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List, Optional
from db.database import get_db  
from schemas.product_schemas import ProductWithDetailsResponse
from crud.product_crud import get_products_by_keyword

# We initialize the router for search
router = APIRouter(
    prefix="/search",
    tags=["Search"],
    responses={404: {"message": "No encontrado"},
            200: {"message": "Búsqueda exitosa"}}
)

# GET route to search for products
@router.get("/", response_model=List[ProductWithDetailsResponse])
async def search_products(keyword: str, category: Optional[int] = None, min_price: Optional[float] = None, max_price: Optional[float] = None, db: Session = Depends(get_db)):
    products = get_products_by_keyword(db, keyword=keyword, category=category, min_price=min_price, max_price=max_price)
    if products:
        return products
    raise HTTPException(status_code=404, detail="No se encontraron productos")

