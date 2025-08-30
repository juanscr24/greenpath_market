# GreenPath Market - Backend API

A FastAPI-based backend for GreenPath Market, an e-commerce platform for sustainable products.

## Project Structure

```
backend/
├── api/                 # API endpoints
│   ├── admin.py        # Admin endpoints
│   ├── login.py        # Authentication endpoints
│   ├── payments.py     # Payment processing
│   ├── products.py     # Product management
│   ├── register.py     # User registration
│   ├── search.py       # Search functionality
│   ├── shop.py         # Shop management (new)
│   └── users.py        # User management
├── config/             # Configuration files
│   └── config.py       # App configuration
├── crud/               # Database operations
│   ├── product_crud.py # Product CRUD operations
│   ├── shop_crud.py    # Shop CRUD operations (new)
│   └── user_crud.py    # User CRUD operations
├── db/                 # Database setup
│   └── database.py     # Database connection
├── middleware/         # Custom middleware
│   └── auth.py         # Authentication middleware
├── models/             # SQLAlchemy models
│   ├── category.py     # Product categories
│   ├── document_type.py # Document types
│   ├── order_detail.py # Order details
│   ├── order_status.py # Order statuses
│   ├── payment_option.py # Payment options
│   ├── payment.py      # Payments
│   ├── product_image.py # Product images
│   ├── product.py      # Products
│   ├── role.py         # User roles
│   ├── shipment.py     # Shipments
│   ├── shipping_state.py # Shipping states
│   ├── shop.py         # Shops
│   └── user.py         # Users
├── schemas/            # Pydantic schemas
│   ├── category_schemas.py # Category schemas
│   ├── document_type_schemas.py # Document type schemas
│   ├── order_status_schemas.py # Order status schemas
│   ├── product_schemas.py # Product schemas
│   ├── pyment_option_schemas.py # Payment option schemas
│   ├── role_schemas.py # Role schemas
│   ├── shipping_states_schemas.py # Shipping state schemas
│   ├── shop_schemas.py # Shop schemas (updated)
│   └── user_schemas.py # User schemas
└── main.py             # Main application file
```

## API Endpoints

### Authentication & User Management
- `POST /register` - User registration
- `POST /login` - User login
- `GET /users` - Get all users (Admin)
- `GET /users/{user_id}` - Get user by ID
- `PUT /users/{user_id}` - Update user
- `DELETE /users/{user_id}` - Delete user

### Shop Management
- `GET /shops` - Get all shops (with pagination)
- `GET /shops/{shop_id}` - Get shop by ID
- `POST /shops` - Create new shop
- `PUT /shops/{shop_id}` - Update shop
- `DELETE /shops/{shop_id}` - Delete shop

### Product Management
- `GET /products` - Get all products (with pagination)
- `GET /products/{product_id}` - Get product by ID
- `POST /products` - Create new product
- `PUT /products/{product_id}` - Update product
- `DELETE /products/{product_id}` - Delete product
- `GET /products/search/{keyword}` - Search products
- `GET /products/category/{category_id}` - Get products by category

### Payment Processing
- `GET /payments` - Get all payments
- `GET /payments/{payment_id}` - Get payment by ID
- `POST /payments` - Create payment
- `PUT /payments/{payment_id}` - Update payment

### Search & Discovery
- `GET /search/{keyword}` - Global search across products and shops

## Usage Examples

### User Registration
```bash
curl -X POST "http://localhost:8000/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword123",
    "first_name": "John",
    "last_name": "Doe",
    "phone_number": "+1234567890"
  }'
```

### User Login
```bash
curl -X POST "http://localhost:8000/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword123"
  }'
```

### Create a New Product
```bash
curl -X POST "http://localhost:8000/products" \
  -H "Content-Type: application/json" \
  -d '{
    "id_shop": 1,
    "name_product": "Organic Coffee",
    "product_description": "Premium organic coffee beans",
    "price": 15.99,
    "stock": 50,
    "product_star_rate": 4.8,
    "id_category": 3
  }'
```

### Get All Products
```bash
curl -X GET "http://localhost:8000/products?skip=0&limit=10"
```

### Create a New Shop
```bash
curl -X POST "http://localhost:8000/shops" \
  -H "Content-Type: application/json" \
  -d '{
    "id_user": 1,
    "shop_name": "Eco Store",
    "description": "Sustainable products shop",
    "shop_address": "123 Green Street",
    "logo_url": "https://example.com/logo.png",
    "is_active": true
  }'
```

### Get Shop by ID
```bash
curl -X GET "http://localhost:8000/shops/1"
```

### Update a Shop
```bash
curl -X PUT "http://localhost:8000/shops/1" \
  -H "Content-Type: application/json" \
  -d '{
    "shop_name": "Eco Store Updated",
    "description": "Updated sustainable products shop"
  }'
```

### Delete a Shop
```bash
curl -X DELETE "http://localhost:8000/shops/1"
```

### Create a New User (Admin)
```bash
curl -X POST "http://localhost:8000/users" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "adminpassword123",
    "first_name": "Admin",
    "last_name": "User",
    "phone_number": "+1987654321",
    "id_role": 1
  }'
```

### Create a Payment
```bash
curl -X POST "http://localhost:8000/payments" \
  -H "Content-Type: application/json" \
  -d '{
    "id_order": 1,
    "id_payment_option": 2,
    "amount": 99.99,
    "payment_status": "completed"
  }'
```

### Search Products
```bash
curl -X GET "http://localhost:8000/products/search/organic"
```

### Global Search
```bash
curl -X GET "http://localhost:8000/search/sustainable"
```

## Setup and Installation

1. Create virtual enviroment
```bash
python3 -m venv .venv 
```

2. Run virtual envirooment
```bash
source .venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up database configuration in `.env` file

5. Run the application:
```bash
fastapi dev main.py
```

6. Access API documentation at: `http://localhost:8000/docs`

## Database Models

### Shop Model
- `id_shop` (Primary Key)
- `id_user` (Foreign Key to users)
- `shop_name` (Unique)
- `description`
- `shop_address`
- `logo_url`
- `is_active` (Boolean)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### Product Model
- `id_product` (Primary Key)
- `id_shop` (Foreign Key to shops, can be null)
- `name_product`
- `product_description`
- `price`
- `stock`
- `product_star_rate`
- `id_category` (Foreign Key to categories)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

## Error Handling

The API returns appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

All endpoints include proper error handling and validation using Pydantic schemas.

## Features

- RESTful API design
- SQLAlchemy ORM integration
- Pydantic data validation
- CORS support
- Automatic API documentation (Swagger UI)
- Database migrations support
- Comprehensive error handling
- Pagination support
- Search functionality
