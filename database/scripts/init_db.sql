--create the table of database
CREATE DATABASE greenPath;

USE greenPath;

--create the table of roles
CREATE TABLE roles (
    id_rol INT AUTO_INCREMENT PRIMARY KEY,
    rol_name VARCHAR(10) UNIQUE NOT NULL
);

--create the table of documents
CREATE TABLE document (
    id_document_type INT AUTO_INCREMENT PRIMARY KEY,
    document_type VARCHAR(50) UNIQUE NOT NULL
);

--create the table of the categories
CREATE TABLE categories (
    id_category INT AUTO_INCREMENT PRIMARY KEY,
    name_category VARCHAR(40) UNIQUE NOT NULL
);

--create the table of the users
CREATE TABLE users (
    id_user INT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(30) UNIQUE NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE,
    user_password VARCHAR(20) NOT NULL,
    document_number VARCHAR(20) NOT NULL,
    id_rol INT,
    id_document_type INT,
    FOREIGN KEY (id_Rol) REFERENCES roles(id_Rol) ON DELETE SET NULL,
    FOREIGN KEY (id_document_type) REFERENCES document(id_document_type) ON DELETE SET NULL
);

--create the table of products
CREATE TABLE products (
    id_product INT AUTO_INCREMENT PRIMARY KEY,
    id_user INT,
    name_product VARCHAR(30) NOT NULL,
    product_description VARCHAR(160),
    price DECIMAL(10, 2) NOT NULL,
    stocks INT NOT NULL,
    product_star_rate FLOAT,
    id_category INT,
    FOREIGN KEY (id_category) REFERENCES categories(id_category) ON DELETE SET NULL,
    FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE CASCADE
);

--create the table of the order status
CREATE TABLE order_Status (
    id_order_status INT AUTO_INCREMENT PRIMARY KEY,
    name_order_status VARCHAR(30) UNIQUE
);

--create the table of the payment options
CREATE TABLE payment_Options (
    id_option INT AUTO_INCREMENT PRIMARY KEY,
    payment_option_name VARCHAR(20) UNIQUE
);

--create the table of the shipping status
CREATE TABLE shipping_Status (
    id_shipping_status INT AUTO_INCREMENT PRIMARY KEY,
    status_name VARCHAR(20) UNIQUE
);

--create the table of the order of the user
CREATE TABLE user_order (
    id_order INT AUTO_INCREMENT PRIMARY KEY,
    order_date DATETIME NOT NULL,
    id_user INT,
    id_product INT,
    id_order_status INT,
    id_order_detail INT,
    id_payment INT,
    id_shipments INT,
    FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE CASCADE,
    FOREIGN KEY (id_product) REFERENCES products(id_product) ON DELETE SET NULL,
    FOREIGN KEY (id_order_status) REFERENCES order_status(id_order_status) ON DELETE CASCADE,
    FOREIGN KEY (id_order_detail) REFERENCES order_details(id_detail) ON DELETE SET NULL,
    FOREIGN KEY (id_payment) REFERENCES payments(id_payment) ON DELETE SET NULL,
    FOREIGN KEY (id_shipments) REFERENCES shipments(id_shipments) ON DELETE SET NULL
);

--create the table of the order details
CREATE TABLE order_details (
    id_detail INT PRIMARY KEY AUTO_INCREMENT,
    id_order INT,
    id_Product INT,
    amount INT,
    unit_price DECIMAL(10, 2),
    FOREIGN KEY (id_order) REFERENCES user_order(id_order) ON DELETE CASCADE,
    FOREIGN KEY (id_product) REFERENCES products(id_product) ON DELETE SET NULL
);

--create the table of the payments
CREATE TABLE payments (
    id_payment INT AUTO_INCREMENT PRIMARY KEY,
    id_order INT,
    id_payment_option INT,
    payment_amount DECIMAL(10, 2) NOT NULL,
    payment_date DATETIME NOT NULL,
    FOREIGN KEY (id_order) REFERENCES user_order(id_order) ON DELETE CASCADE,
    FOREIGN KEY (id_payment_option) REFERENCES payment_Options(id_Option) ON DELETE CASCADE
);

--create the table of the shipments
CREATE TABLE shipments (
    id_shipments INT AUTO_INCREMENT PRIMARY KEY,
    id_order INT,
    user_address VARCHAR(255),
    transporter VARCHAR(40),
    id_shipping_status INT,
    FOREIGN KEY (id_order) REFERENCES user_order(id_order) ON DELETE CASCADE,
    FOREIGN KEY (id_shipping_status) REFERENCES shipping_status(id_shipping_status) ON DELETE SET NULL
);
