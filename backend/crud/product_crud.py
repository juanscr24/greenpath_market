from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import SQLAlchemyError
from typing import Optional
from models import Product, Shop, Category
from service.cloudinary import upload_image
from fastapi import HTTPException
import io

from schemas.product_schemas import ProductCreate, ProductUpdate, ProductResponse, ProductWithDetailsResponse, ProductCreateWithImage

# ------------------------------
# Crear un nuevo producto en la base de datos
def create_product(db: Session, product: ProductCreate):
    # Crear el nuevo producto en la base de datos
    db_product = Product(
        id_shop=product.id_shop,
        image_url=product.image_url,
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

# ------------------------------
# Crear un nuevo producto con upload de imagen
def create_product_with_image(db: Session, product_data: ProductCreateWithImage, image_file):
    try:
        # Leer el contenido del archivo
        image_content = image_file.file.read()
        
        # Subir imagen a Cloudinary
        image_url = upload_image(image_content)
        
        # Crear el nuevo producto en la base de datos
        db_product = Product(
            id_shop=product_data.id_shop,
            name_product=product_data.name_product,
            product_description=product_data.product_description,
            price=product_data.price,
            stock=product_data.stock,
            product_star_rate=product_data.product_star_rate,
            id_category=product_data.id_category,
            image_url=image_url
        )
        
        # Agregar el producto a la sesión
        db.add(db_product)
        db.commit()  # Confirmar la transacción
        db.refresh(db_product)  # Refrescar para obtener los valores generados

        return db_product  # Devolver el producto recién creado
    
    except HTTPException as e:
        db.rollback()
        raise e
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al crear el producto: {str(e)}")

# ------------------------------
# Obtener un producto por su ID
# ------------------------------
def get_product_by_id(db: Session, product_id: int) -> ProductResponse | None:
    try:
        db_product = db.query(Product).filter(Product.id_product == product_id).first()
        
        if db_product is None:
            print(f"Producto con ID {product_id} no encontrado.")
            return None

        product_data = ProductResponse.from_orm(db_product)
        # Si id_shop es None, establecerlo a 0
        if product_data.id_shop is None:
            product_data.id_shop = 0
        return product_data

    except SQLAlchemyError as e:
        print(f"Error obteniendo el producto con ID {product_id}: {e}")
        return None

# ------------------------------
# Obtener múltiples productos con paginación
# ------------------------------
def get_products(db: Session, skip: int = 0, limit: int = 100) -> list[ProductResponse]:
    try:
        # Query con join para obtener shop_name
        db_results = (
            db.query(
                Product,
                Shop.shop_name.label('shop_name')
            )
            .outerjoin(Shop, Product.id_shop == Shop.id_shop)
            .offset(skip)
            .limit(limit)
            .all()
        )

        # Convertir la lista de productos a respuestas formateadas
        products_response = []
        for product, shop_name in db_results:
            product_data = ProductResponse.from_orm(product)
            product_data.shop_name = shop_name
            # Si id_shop es None, establecerlo a 0
            if product_data.id_shop is None:
                product_data.id_shop = 0
            products_response.append(product_data)

        return products_response

    except SQLAlchemyError as e:
        print(f"Error obteniendo los productos: {e}")
        return []

# ------------------------------
# Obtener productos por tienda
# ------------------------------
def get_products_by_shop(db: Session, shop_id: int, skip: int = 0, limit: int = 100) -> list[ProductResponse]:
    try:
        # Query con join para obtener shop_name
        db_results = (
            db.query(
                Product,
                Shop.shop_name.label('shop_name')
            )
            .join(Shop, Product.id_shop == Shop.id_shop)
            .filter(Product.id_shop == shop_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

        products_response = []
        for product, shop_name in db_results:
            product_data = ProductResponse.from_orm(product)
            product_data.shop_name = shop_name
            if product_data.id_shop is None:
                product_data.id_shop = 0
            products_response.append(product_data)

        return products_response

    except SQLAlchemyError as e:
        print(f"Error obteniendo productos para la tienda {shop_id}: {e}")
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

        updated_product = ProductResponse.from_orm(db_product)
        # Si id_shop es None, establecerlo a 0
        if updated_product.id_shop is None:
            updated_product.id_shop = 0
        return updated_product

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

# ------------------------------
# Obtener productos filtrados por categoría con detalles completos
# ------------------------------
def get_products_by_category(db: Session, category_id: int, skip: int = 0, limit: int = 100) -> list[ProductWithDetailsResponse]:
    try:
        # Query para obtener productos con información de categoría y tienda
        db_products = (
            db.query(
                Product,
                Category.name_category.label('category_name'),
                Shop.shop_name.label('shop_name')
            )
            .join(Category, Product.id_category == Category.id_category)
            .join(Shop, Product.id_shop == Shop.id_shop)
            .filter(Product.id_category == category_id)
            .offset(skip)
            .limit(limit)
            .all()
        )
        
        # Convertir resultados a la respuesta detallada
        products_with_details = []
        for product, category_name, shop_name in db_products:
            products_with_details.append(
                ProductWithDetailsResponse(
                    id_product=product.id_product,
                    name_product=product.name_product,
                    product_description=product.product_description,
                    price=float(product.price),
                    stock=product.stock,
                    product_star_rate=product.product_star_rate,
                    category_name=category_name,
                    shop_name=shop_name,
                    image_url=product.image_url,
                    created_at=product.created_at,
                    updated_at=product.updated_at
                )
            )
        
        return products_with_details

    except SQLAlchemyError as e:
        print(f"Error obteniendo productos por categoría {category_id}: {e}")
        return []





# Buscar productos por palabra clave con detalles completos

def get_products_by_keyword(db: Session, keyword: str, category: Optional[int] = None, min_price: Optional[float] = None, max_price: Optional[float] = None) -> list[ProductWithDetailsResponse]:
    try:
        # Construir la consulta base con joins para obtener información de categoría y tienda
        query = (
            db.query(
                Product,
                Category.name_category.label('category_name'),
                Shop.shop_name.label('shop_name')
            )
            .join(Category, Product.id_category == Category.id_category)
            .join(Shop, Product.id_shop == Shop.id_shop)
            .filter(
                (Product.name_product.ilike(f"%{keyword}%")) | 
                (Product.product_description.ilike(f"%{keyword}%"))
            )
        )
        
        # Aplicar filtros adicionales si se proporcionan
        if category is not None:
            query = query.filter(Product.id_category == category)
        
        if min_price is not None:
            query = query.filter(Product.price >= min_price)
        
        if max_price is not None:
            query = query.filter(Product.price <= max_price)
        
        # Ejecutar la consulta y obtener los productos
        db_results = query.all()

        # Convertir resultados a la respuesta detallada
        products_with_details = []
        for product, category_name, shop_name in db_results:
            products_with_details.append(
                ProductWithDetailsResponse(
                    id_product=product.id_product,
                    name_product=product.name_product,
                    product_description=product.product_description,
                    price=float(product.price),
                    stock=product.stock,
                    product_star_rate=product.product_star_rate,
                    category_name=category_name,
                    shop_name=shop_name,
                    image_url=product.image_url,
                    created_at=product.created_at,
                    updated_at=product.updated_at
                )
            )
        
        return products_with_details


    except SQLAlchemyError as e:
        print(f"Error buscando productos con palabra clave '{keyword}': {e}")
        return []


