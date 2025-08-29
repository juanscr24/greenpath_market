from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from typing import Optional
from models.shop import Shop
from schemas.shop_schemas import ShopCreate, ShopUpdate, ShopResponse

def create_shop(db: Session, shop: ShopCreate) -> Shop:
    db_shop = Shop(
        id_user=shop.id_user,
        shop_name=shop.shop_name,
        description=shop.description,
        shop_address=shop.shop_address,
        logo_url=shop.logo_url,
        is_active=shop.is_active
    )
    try:
        db.add(db_shop)
        db.commit()
        db.refresh(db_shop)
        return db_shop
    except SQLAlchemyError as e:
        db.rollback()
        print(f"Error creando la tienda: {e}")
        return None

def get_shop_by_id(db: Session, shop_id: int) -> Optional[ShopResponse]:
    try:
        db_shop = db.query(Shop).filter(Shop.id_shop == shop_id).first()
        if db_shop is None:
            print(f"Tienda con ID {shop_id} no encontrada.")
            return None
        return ShopResponse.from_orm(db_shop)
    except SQLAlchemyError as e:
        print(f"Error obteniendo la tienda con ID {shop_id}: {e}")
        return None

def get_shops(db: Session, skip: int = 0, limit: int = 100) -> list[ShopResponse]:
    try:
        db_shops = db.query(Shop).offset(skip).limit(limit).all()
        return [ShopResponse.from_orm(shop) for shop in db_shops]
    except SQLAlchemyError as e:
        print(f"Error obteniendo las tiendas: {e}")
        return []

def update_shop(db: Session, shop_id: int, shop_data: ShopUpdate) -> Optional[ShopResponse]:
    try:
        db_shop = db.query(Shop).filter(Shop.id_shop == shop_id).first()
        if not db_shop:
            print(f"Tienda con ID {shop_id} no encontrada.")
            return None
        for key, value in shop_data.dict(exclude_unset=True).items():
            setattr(db_shop, key, value)
        db.commit()
        db.refresh(db_shop)
        return ShopResponse.from_orm(db_shop)
    except SQLAlchemyError as e:
        db.rollback()
        print(f"Error actualizando la tienda con ID {shop_id}: {e}")
        return None

def delete_shop(db: Session, shop_id: int) -> bool:
    try:
        db_shop = db.query(Shop).filter(Shop.id_shop == shop_id).first()
        if not db_shop:
            print(f"Tienda con ID {shop_id} no encontrada.")
            return False
        db.delete(db_shop)
        db.commit()
        return True
    except SQLAlchemyError as e:
        db.rollback()
        print(f"Error eliminando la tienda con ID {shop_id}: {e}")
        return False
