# GreenPath Market - Database

This directory contains the database schema, scripts, and documentation for the GreenPath Market platform.

## Overview

The database is designed using MySQL and follows a relational model to support the e-commerce functionality of GreenPath Market. It manages users, shops, products, orders, payments, and shipping information.

## Database Schema

The main database is named `green_path` and consists of the following tables:

### Core Tables

#### Users Management
- **roles**: User role definitions (user, admin)
- **documents_types**: Document types for user identification (C.C, T.I, C.E, PA)
- **users**: User accounts with personal information, authentication, and role assignment

#### Product Management
- **categories**: Product categories (e.g., food)
- **shops**: Producer shops with user association
- **products**: Product listings with pricing, stock, and ratings

#### Order Management
- **order_status**: Order status tracking (pending, processing, shipped, delivered, cancelled)
- **user_orders**: Customer orders
- **order_details**: Individual items within orders

#### Payment & Shipping
- **payment_options**: Available payment methods (daviPlata, nequi, bancolombia, efectivo)
- **payments**: Payment records linked to orders
- **shipping_states**: Shipping status (delayed, delivered, in process)
- **shipments**: Shipping information for orders

#### Additional Features
- **user_review**: Customer reviews for products

## Entity-Relationship Diagram

![Entity-Relationship Diagram](Diagrama%20entidad%20relacion.png)

## Table Descriptions

### roles
- `id_rol` (Primary Key)
- `role_name` (Unique)
- `created_at`, `updated_at` (Timestamps)

### documents_types
- `id_document_type` (Primary Key)
- `document_type`, `document_abbreviation` (Unique)
- `created_at`, `updated_at` (Timestamps)

### users
- `id_user` (Primary Key)
- `full_name`, `birthdate`, `email` (Unique), `phone` (Unique)
- `id_document_type`, `document_number`, `user_password`
- `id_rol`, `user_address`
- `created_at`, `updated_at` (Timestamps)
- Foreign Keys: `id_rol` → roles, `id_document_type` → documents_types

### categories
- `id_category` (Primary Key)
- `name_category` (Unique)
- `created_at`, `updated_at` (Timestamps)

### shops
- `id_shop` (Primary Key)
- `id_user`, `shop_name` (Unique), `description`, `shop_address`, `logo_url`
- `is_active` (Boolean)
- `created_at`, `updated_at` (Timestamps)
- Foreign Key: `id_user` → users

### products
- `id_product` (Primary Key)
- `id_shop`, `image_url`, `name_product`, `product_description`
- `price`, `stock`, `product_star_rate`, `id_category`
- `created_at`, `updated_at` (Timestamps)
- Foreign Keys: `id_shop` → shops, `id_category` → categories

### order_status
- `id_order_status` (Primary Key)
- `name_order_status` (Unique)
- `created_at`, `updated_at` (Timestamps)

### payment_options
- `id_option` (Primary Key)
- `payment_option_name` (Unique)
- `created_at`, `updated_at` (Timestamps)

### shipping_states
- `id_shipping_status` (Primary Key)
- `status_name` (Unique)
- `created_at`, `updated_at` (Timestamps)

### user_orders
- `id_order` (Primary Key)
- `order_date`, `id_user`, `id_order_status`
- `created_at`, `updated_at` (Timestamps)
- Foreign Keys: `id_user` → users, `id_order_status` → order_status

### order_details
- `id_detail` (Primary Key)
- `id_order`, `id_product`, `amount`, `unit_price`
- `created_at`, `updated_at` (Timestamps)
- Foreign Keys: `id_order` → user_orders, `id_product` → products

### payments
- `id_payment` (Primary Key)
- `id_order`, `id_payment_option`, `payment_amount`, `payment_date`
- `created_at`, `updated_at` (Timestamps)
- Foreign Keys: `id_order` → user_orders, `id_payment_option` → payment_options

### shipments
- `id_shipments` (Primary Key)
- `id_order`, `user_address`, `transporter`, `id_shipping_status`
- `created_at`, `updated_at` (Timestamps)
- Foreign Keys: `id_order` → user_orders, `id_shipping_status` → shipping_states

### user_review
- `id_review` (Primary Key)
- `id_user`, `id_product`, `review`
- Foreign Keys: `id_user` → users, `id_product` → products

## Setup Instructions

### Prerequisites
- MySQL 8.0+ installed
- Database user with creation privileges

### Database Initialization

1. **Create Database**:
   ```sql
   CREATE DATABASE green_path;
   ```

2. **Run Schema Script**:
   Execute the `scripts/init_db.sql` file to create all tables and initial data:
   ```bash
   mysql -u your_username -p green_path < scripts/init_db.sql
   ```

3. **Alternative MySQL Setup**:
   For a basic setup, you can use `scripts/init_mysql.sql`:
   ```bash
   mysql -u root -p < scripts/init_mysql.sql
   ```

### Seed Data

To populate the database with sample data, execute:
```bash
mysql -u your_username -p green_path < scripts/seed_data.sql
```

## Configuration

Update your backend configuration to connect to the database:

```python
# In backend/config/config.py
DATABASE_URL = "mysql://username:password@localhost/green_path"
```

## Notes

- The database uses UTF-8 encoding for international character support
- Timestamps are automatically managed with `CURRENT_TIMESTAMP`
- Foreign key constraints ensure data integrity
- Indexes are created on frequently queried columns for performance

## Maintenance

- Regularly backup the database
- Monitor query performance and add indexes as needed
- Update schema scripts when making changes to the database structure

- [General Documentation](../README.md)
- [Frontend Documentation](frontend/README.md)
- [Backend Documentation](backend/README.md)
