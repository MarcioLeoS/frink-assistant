-- Crear base propia de la app (las tablas se crean con Laravel migrations)
CREATE DATABASE IF NOT EXISTS frink_assistant_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Crear usuario y permisos
-- NOTA: La contraseña debe coincidir con FRINK_DB_PASSWORD en .env
CREATE USER IF NOT EXISTS 'frink_user'@'%' IDENTIFIED BY 'frinkpass_dev_2024';
GRANT ALL PRIVILEGES ON frink_assistant_db.* TO 'frink_user'@'%';
FLUSH PRIVILEGES;

-- Las tablas se crean automáticamente con Laravel migrations
-- Ejecutar: docker exec -it frink_web php artisan migrate
