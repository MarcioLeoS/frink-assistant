-- Crear base propia de la app
CREATE DATABASE IF NOT EXISTS frink_app
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Crear usuario y permisos
CREATE USER IF NOT EXISTS 'frink_user'@'%' IDENTIFIED BY 'Qx3uM1s9pL2vA7kZ';
GRANT ALL PRIVILEGES ON frink_app.* TO 'frink_user'@'%';
FLUSH PRIVILEGES;

-- Usar la base y crear tablas
USE frink_app;

SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- ========= Empresas
CREATE TABLE IF NOT EXISTS companies (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  company_key VARCHAR(64) NOT NULL,
  name VARCHAR(200) NOT NULL,
  contact_method VARCHAR(200) NULL,
  website VARCHAR(255) NULL,
  sector VARCHAR(120) NULL,
  location VARCHAR(200) NULL,
  about_text MEDIUMTEXT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_companies_company_key (company_key),
  KEY ix_companies_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========= Productos
CREATE TABLE IF NOT EXISTS products (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  company_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(200) NOT NULL,
  sku VARCHAR(100) NULL,
  description TEXT NULL,
  category VARCHAR(120) NULL,
  price DECIMAL(12,2) NULL,
  currency CHAR(3) NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_products_company
    FOREIGN KEY (company_id) REFERENCES companies(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  UNIQUE KEY uq_products_company_sku (company_id, sku),
  KEY ix_products_company_active (company_id, is_active),
  KEY ix_products_company_category (company_id, category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
