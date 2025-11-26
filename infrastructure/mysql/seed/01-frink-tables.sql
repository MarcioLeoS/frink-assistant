USE frink_assistant_db;

SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- =========================================
-- COMPANIES
-- =========================================
CREATE TABLE IF NOT EXISTS companies (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  company_key   VARCHAR(64)  NOT NULL,
  name          VARCHAR(200) NOT NULL,
  contact_method VARCHAR(200) NULL,
  website       VARCHAR(255) NULL,
  sector        VARCHAR(120) NULL,
  location      VARCHAR(200) NULL,
  about_text    MEDIUMTEXT NULL,
  is_active     TINYINT(1) NOT NULL DEFAULT 1,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_companies_company_key (company_key),
  KEY ix_companies_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================
-- CATEGORIES (para productos)
-- =========================================
CREATE TABLE IF NOT EXISTS categories (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  company_id BIGINT UNSIGNED NULL COMMENT 'Opcional: categoría específica por empresa; NULL = global',
  slug       VARCHAR(100) NOT NULL,
  name       VARCHAR(255) NOT NULL,
  parent_id  BIGINT UNSIGNED DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_categories_company_slug (company_id, slug),
  KEY idx_categories_parent_id (parent_id),
  KEY idx_categories_company (company_id),
  CONSTRAINT fk_categories_parent
    FOREIGN KEY (parent_id) REFERENCES categories(id),
  CONSTRAINT fk_categories_company
    FOREIGN KEY (company_id) REFERENCES companies(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================
-- CUSTOMERS
-- =========================================
CREATE TABLE IF NOT EXISTS customers (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  company_id BIGINT UNSIGNED NOT NULL,
  name        VARCHAR(255) NOT NULL,
  email       VARCHAR(255) DEFAULT NULL,
  phone_e164  VARCHAR(20)  DEFAULT NULL COMMENT 'Phone in E.164 format, e.g. +5493411234567',
  whatsapp_opt_in TINYINT(1) NOT NULL DEFAULT 1,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_customers_company (company_id),
  UNIQUE KEY uq_customers_company_email (company_id, email),
  UNIQUE KEY uq_customers_company_phone (company_id, phone_e164),
  CONSTRAINT fk_customers_company
    FOREIGN KEY (company_id) REFERENCES companies(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================
-- PRODUCTS
-- =========================================
CREATE TABLE IF NOT EXISTS products (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  company_id BIGINT UNSIGNED NOT NULL,
  name        VARCHAR(200) NOT NULL,
  sku         VARCHAR(100) NULL,
  description TEXT NULL,
  category    VARCHAR(120) NULL COMMENT 'Legacy plain-text category (optional)',
  category_id BIGINT UNSIGNED DEFAULT NULL COMMENT 'FK to categories',
  price       DECIMAL(12,2) NULL,
  currency    CHAR(3) NULL,
  is_active   TINYINT(1) NOT NULL DEFAULT 1,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_products_company
    FOREIGN KEY (company_id) REFERENCES companies(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT fk_products_category
    FOREIGN KEY (category_id) REFERENCES categories(id)
    ON UPDATE CASCADE
    ON DELETE SET NULL,
  UNIQUE KEY uq_products_company_sku (company_id, sku),
  KEY ix_products_company_active (company_id, is_active),
  KEY ix_products_company_category (company_id, category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================
-- ORDERS
-- =========================================
CREATE TABLE IF NOT EXISTS orders (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  company_id BIGINT UNSIGNED NOT NULL,
  customer_id BIGINT UNSIGNED DEFAULT NULL,
  order_id    VARCHAR(50)  NOT NULL COMMENT 'Public order identifier shown to customer',
  customer_name  VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone_e164 VARCHAR(20) DEFAULT NULL,
  status ENUM('pending','processing','shipped','delivered','cancelled')
         NOT NULL DEFAULT 'pending',
  source_channel ENUM('web','whatsapp','phone','email','other')
         NOT NULL DEFAULT 'web',
  eta DATETIME DEFAULT NULL,
  notes TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_orders_company_order_id (company_id, order_id),
  KEY idx_orders_company_customer (company_id, customer_id),
  KEY idx_orders_phone (customer_phone_e164),
  CONSTRAINT fk_orders_company
    FOREIGN KEY (company_id) REFERENCES companies(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_orders_customer
    FOREIGN KEY (customer_id) REFERENCES customers(id)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================
-- SUPPORT TICKETS
-- =========================================
CREATE TABLE IF NOT EXISTS support_tickets (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  company_id BIGINT UNSIGNED NOT NULL,
  ticket_id  VARCHAR(50) NOT NULL,
  customer_id BIGINT UNSIGNED DEFAULT NULL,
  user_email VARCHAR(255) NOT NULL,
  user_phone_e164 VARCHAR(20) DEFAULT NULL,
  product    VARCHAR(255) NOT NULL,
  issue      TEXT NOT NULL,
  status ENUM('open','in_progress','resolved','closed')
         NOT NULL DEFAULT 'open',
  ticket_type ENUM('order_issue','product_issue','general_question','technical_support','other')
         NOT NULL DEFAULT 'other',
  order_id_ref VARCHAR(50) DEFAULT NULL COMMENT 'Optional reference to orders.order_id',
  detail     TEXT NULL COMMENT 'Short cleaned-up summary of the issue',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_support_tickets_ticket_id (ticket_id),
  KEY idx_support_tickets_company (company_id),
  KEY idx_support_tickets_email (user_email),
  KEY idx_support_tickets_phone (user_phone_e164),
  KEY idx_support_tickets_status (status),
  KEY idx_support_tickets_order_ref (company_id, order_id_ref),
  CONSTRAINT fk_support_tickets_company
    FOREIGN KEY (company_id) REFERENCES companies(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_support_tickets_customer
    FOREIGN KEY (customer_id) REFERENCES customers(id)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
