CREATE DATABASE greenPath;

USE greenPath;

CREATE TABLE roles (
    id_Rol INT AUTO_INCREMENT PRIMARY KEY,
    rol_Name VARCHAR(10) UNIQUE NOT NULL
);

CREATE TABLE document (
    id_document_type INT AUTO_INCREMENT PRIMARY KEY,
    document_type VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE categories (
    id_Category INT AUTO_INCREMENT PRIMARY KEY,
    name_Category VARCHAR(40) UNIQUE NOT NULL
);

CREATE TABLE users (
    id_user INT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(30) UNIQUE NOT NULL,
    Email VARCHAR(50) UNIQUE NOT NULL,
    Phone VARCHAR(20) UNIQUE,
    user_password VARCHAR(20) NOT NULL,
    document_number VARCHAR(20) NOT NULL,
    id_Rol INT,
    id_document_type INT,
    FOREIGN KEY (id_Rol) REFERENCES roles(id_Rol) ON DELETE SET NULL,
    FOREIGN KEY (id_document_type) REFERENCES document(id_document_type) ON DELETE SET NULL
);

CREATE TABLE products (
    id_Product INT AUTO_INCREMENT PRIMARY KEY,
    id_User INT,
    name_Product VARCHAR(30) NOT NULL,
    product_Description VARCHAR(160),
    price DECIMAL(10, 2) NOT NULL,
    stocks INT NOT NULL,
    product_star_rate FLOAT,
    id_category INT,
    FOREIGN KEY (id_category) REFERENCES categories(id_Category) ON DELETE SET NULL,
    FOREIGN KEY (id_User) REFERENCES users(id_user) ON DELETE CASCADE
);

CREATE TABLE order_Status (
    id_Order_Status INT AUTO_INCREMENT PRIMARY KEY,
    name_Order_Status VARCHAR(30) UNIQUE
);

CREATE TABLE payment_Options (
    id_Option INT AUTO_INCREMENT PRIMARY KEY,
    payment_Option_Name VARCHAR(20) UNIQUE
);

CREATE TABLE shipping_Status (
    id_shipping_status INT AUTO_INCREMENT PRIMARY KEY,
    status_name VARCHAR(20) UNIQUE
);

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
    FOREIGN KEY (id_product) REFERENCES products(id_Product) ON DELETE SET NULL,
    FOREIGN KEY (id_order_status) REFERENCES order_Status(id_Order_Status) ON DELETE CASCADE,
    FOREIGN KEY (id_order_detail) REFERENCES order_details(id_Detail) ON DELETE SET NULL,
    FOREIGN KEY (id_payment) REFERENCES payments(id_payment) ON DELETE SET NULL,
    FOREIGN KEY (id_shipments) REFERENCES shipments(id_shipments) ON DELETE SET NULL
);

CREATE TABLE order_details (
    id_Detail INT PRIMARY KEY AUTO_INCREMENT,
    id_Order INT,
    id_Product INT,
    amount INT,
    unit_price DECIMAL(10, 2),
    FOREIGN KEY (id_Order) REFERENCES user_order(id_order) ON DELETE CASCADE,
    FOREIGN KEY (id_Product) REFERENCES products(id_Product) ON DELETE SET NULL
);

CREATE TABLE payments (
    id_payment INT AUTO_INCREMENT PRIMARY KEY,
    id_order INT,
    id_payment_option INT,
    payment_amount DECIMAL(10, 2) NOT NULL,
    payment_date DATETIME NOT NULL,
    FOREIGN KEY (id_order) REFERENCES user_order(id_order) ON DELETE CASCADE,
    FOREIGN KEY (id_payment_option) REFERENCES payment_Options(id_Option) ON DELETE CASCADE
);

CREATE TABLE shipments (
    id_shipments INT AUTO_INCREMENT PRIMARY KEY,
    id_order INT,
    address VARCHAR(255),
    transporter VARCHAR(40),
    id_shipping_status INT,
    FOREIGN KEY (id_order) REFERENCES user_order(id_order) ON DELETE CASCADE,
    FOREIGN KEY (id_shipping_status) REFERENCES shipping_Status(id_shipping_status) ON DELETE SET NULL
);
