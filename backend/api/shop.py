from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from db.database import get_db
from schemas.shop_schemas import ShopCreate, ShopUpdate, ShopResponse
from crud.shop_crud import create_shop, get_shop_by_id, get_shops, update_shop, delete_shop

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

@router.delete("/{shop_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_shop(shop_id: int, db: Session = Depends(get_db)):
    success = delete_shop(db, shop_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Tienda con ID {shop_id} no encontrada"
        )
    return None
