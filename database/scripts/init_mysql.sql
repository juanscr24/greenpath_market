-- Script para inicializar la base de datos MySQL
-- Ejecutar como root o con permisos de administrador

-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS greenpath
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Usar la base de datos
USE greenpath;

-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    surname VARCHAR(100) NOT NULL,
    url VARCHAR(255),
    age INT NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_name (name)
);

-- Mostrar las tablas creadas
SHOW TABLES;

-- Mostrar estructura de la tabla users
DESCRIBE users;
