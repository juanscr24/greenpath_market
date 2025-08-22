-- Create database
CREATE DATABASE green_path;
USE green_path;

-- Table: roles
CREATE TABLE roles (
    id_rol INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(10) UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO roles(role_name) VALUES ("client"), ("seller"), ("admin");

-- Table: documents_types
CREATE TABLE documents_types (
    id_document_type INT AUTO_INCREMENT PRIMARY KEY,
    document_type VARCHAR(50) UNIQUE NOT NULL,
    document_abbreviation VARCHAR(10) UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table: users
CREATE TABLE users (
    id_user INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    id_document_type INT,
    document_number VARCHAR(20) NOT NULL,
    user_password VARCHAR(255) NOT NULL, 
    id_rol INT,
    user_address VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_rol) REFERENCES roles(id_rol) ON DELETE SET NULL,
    FOREIGN KEY (id_document_type) REFERENCES documents_types(id_document_type) ON DELETE SET NULL
);

INSERT INTO documents_types(document_type, document_abbreviation)
VALUES ("national id", "C.C"), ("identity card", "T.I"), ("foreign id", "C.E"), ("passport", "PA");

-- Table: categories
CREATE TABLE categories (
    id_category INT AUTO_INCREMENT PRIMARY KEY,
    name_category VARCHAR(40) UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO categories(name_category) VALUES ("food");

-- Table: shops
CREATE TABLE shops (
    id_shop INT AUTO_INCREMENT PRIMARY KEY,
    id_user INT NOT NULL, 
    shop_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    shop_address VARCHAR(255),
    logo_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE CASCADE
);

-- Table: products
CREATE TABLE products (
    id_product INT AUTO_INCREMENT PRIMARY KEY,
    id_shop INT, 
    name_product VARCHAR(100) NOT NULL,
    product_description TEXT,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
    product_star_rate FLOAT DEFAULT 0 CHECK (product_star_rate >= 0 AND product_star_rate <= 5),
    id_category INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_shop) REFERENCES shops(id_shop) ON DELETE SET NULL,
    FOREIGN KEY (id_category) REFERENCES categories(id_category) ON DELETE SET NULL
);

-- Table: order_status
CREATE TABLE order_status (
    id_order_status INT AUTO_INCREMENT PRIMARY KEY,
    name_order_status VARCHAR(30) UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO order_status(name_order_status)
VALUES ("pending"), ("processing"), ("shipped"), ("delivered"), ("cancelled");

-- Table: payment_options
CREATE TABLE payment_options (
    id_option INT AUTO_INCREMENT PRIMARY KEY,
    payment_option_name VARCHAR(20) UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO payment_options(payment_option_name)
VALUES ("daviPlata"), ("nequi"), ("bancolombia"), ("efectivo");

-- Table: shipping_states
CREATE TABLE shipping_states (
    id_shipping_status INT AUTO_INCREMENT PRIMARY KEY,
    status_name VARCHAR(20) UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO shipping_states(status_name)
VALUES ("delayed"), ("delivered"), ("in process");

-- Table: user_orders
CREATE TABLE user_orders (
    id_order INT AUTO_INCREMENT PRIMARY KEY,
    order_date DATETIME NOT NULL,
    id_user INT,
    id_order_status INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE CASCADE,
    FOREIGN KEY (id_order_status) REFERENCES order_status(id_order_status) ON DELETE CASCADE
);

-- Table: order_details
CREATE TABLE order_details (
    id_detail INT AUTO_INCREMENT PRIMARY KEY,
    id_order INT,
    id_product INT,
    amount INT NOT NULL CHECK (amount > 0),
    unit_price DECIMAL(10, 2) NOT NULL CHECK (unit_price >= 0),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_order) REFERENCES user_orders(id_order) ON DELETE CASCADE,
    FOREIGN KEY (id_product) REFERENCES products(id_product) ON DELETE SET NULL
);

-- Table: payments
CREATE TABLE payments (
    id_payment INT AUTO_INCREMENT PRIMARY KEY,
    id_order INT,
    id_payment_option INT,
    payment_amount DECIMAL(10, 2) NOT NULL CHECK (payment_amount >= 0),
    payment_date DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_order) REFERENCES user_orders(id_order) ON DELETE CASCADE,
    FOREIGN KEY (id_payment_option) REFERENCES payment_options(id_option) ON DELETE CASCADE
);

-- Table: shipments
CREATE TABLE shipments (
    id_shipments INT AUTO_INCREMENT PRIMARY KEY,
    id_order INT,
    user_address VARCHAR(255),
    transporter VARCHAR(40),
    id_shipping_status INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_order) REFERENCES user_orders(id_order) ON DELETE CASCADE,
    FOREIGN KEY (user_address) REFERENCES users(user_address),
    FOREIGN KEY (id_shipping_status) REFERENCES shipping_states(id_shipping_status) ON DELETE SET NULL
);

-- Optional: product_images
CREATE TABLE product_images (
    id_image INT AUTO_INCREMENT PRIMARY KEY,
    id_product INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    alt_text VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_product) REFERENCES products(id_product) ON DELETE CASCADE
);