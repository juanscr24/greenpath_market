from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from typing import Optional
from models import Product
from schemas.product_schemas import ProductCreate, ProductUpdate, ProductResponse

# ------------------------------
# Crear un nuevo producto en la base de datos
def create_product(db: Session, product: ProductCreate):
    # Crear el nuevo producto en la base de datos
    db_product = Product(
        name_product=product.name_product,
        product_description=product.product_description,
        price=product.price,
        stock=product.stock,
        product_star_rate=product.product_star_rate,
        id_category=product.id_category
    )
    
    # Agregar el producto a la sesión
    db.add(db_product)
    db.commit()  # Confirmar la transacción
    db.refresh(db_product)  # Refrescar para obtener los valores generados (como created_at)

    return db_product  # Devolver el producto recién creado
 # Retornar la respuesta formateada

# ------------------------------
# Obtener un producto por su ID
# ------------------------------
def get_product_by_id(db: Session, product_id: int) -> ProductResponse | None:
    try:
        db_product = db.query(Product).filter(Product.id_product == product_id).first()
        
        if db_product is None:
            print(f"Producto con ID {product_id} no encontrado.")
            return None

        return ProductResponse.from_orm(db_product)

    except SQLAlchemyError as e:
        print(f"Error obteniendo el producto con ID {product_id}: {e}")
        return None

# ------------------------------
# Obtener múltiples productos con paginación
# ------------------------------
def get_products(db: Session, skip: int = 0, limit: int = 100) -> list[ProductResponse]:
    try:
        db_products = db.query(Product).offset(skip).limit(limit).all()
        
        # Convertir la lista de productos a respuestas formateadas
        return [ProductResponse.from_orm(product) for product in db_products]

    except SQLAlchemyError as e:
        print(f"Error obteniendo los productos: {e}")
        return []


# Actualizar un producto existente

def update_product(db: Session, product_id: int, product_data: ProductUpdate) -> ProductResponse | None:
    try:
        db_product = db.query(Product).filter(Product.id_product == product_id).first()

        if not db_product:
            print(f"Producto con ID {product_id} no encontrado.")
            return None

        # Actualizar solo los campos proporcionados (exclude_unset=True)
        for key, value in product_data.dict(exclude_unset=True).items():
            setattr(db_product, key, value)

        db.commit()  # Guardar cambios en la base de datos
        db.refresh(db_product)  # Refrescar objeto para obtener los datos más recientes

        return ProductResponse.from_orm(db_product)

    except SQLAlchemyError as e:
        db.rollback()  # Revertir los cambios si algo falla
        print(f"Error actualizando el producto con ID {product_id}: {e}")
        return None

# Eliminar un producto

def delete_product(db: Session, product_id: int) -> bool:
    try:
        db_product = db.query(Product).filter(Product.id_product == product_id).first()

        if not db_product:
            print(f"Producto con ID {product_id} no encontrado.")
            return False

        db.delete(db_product)  # Eliminar producto
        db.commit()  # Confirmar eliminación

        return True

    except SQLAlchemyError as e:
        db.rollback()  # Revertir cambios si algo sale mal
        print(f"Error eliminando el producto con ID {product_id}: {e}")
        return False


# Buscar productos por palabra clave

def get_products_by_keyword(db: Session, keyword: str, category: Optional[int] = None, min_price: Optional[float] = None, max_price: Optional[float] = None) -> list[ProductResponse]:
    try:
        # Construir la consulta base con filtro de palabra clave
        query = db.query(Product).filter(
            (Product.name_product.ilike(f"%{keyword}%")) | 
            (Product.product_description.ilike(f"%{keyword}%"))
        )
        
        # Aplicar filtros adicionales si se proporcionan
        if category is not None:
            query = query.filter(Product.id_category == category)
        
        if min_price is not None:
            query = query.filter(Product.price >= min_price)
        
        if max_price is not None:
            query = query.filter(Product.price <= max_price)
        
        # Ejecutar la consulta y obtener los productos
        db_products = query.all()
        
        # Convertir la lista de productos a respuestas formateadas
        return [ProductResponse.from_orm(product) for product in db_products]

    except SQLAlchemyError as e:
        print(f"Error buscando productos con palabra clave '{keyword}': {e}")
        return []
