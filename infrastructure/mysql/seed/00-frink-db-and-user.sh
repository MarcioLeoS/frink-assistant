#!/bin/bash
# Script para crear la base de datos y usuario de Frink App
# Usa variables de entorno del docker-compose

mysql -uroot -p"${MYSQL_ROOT_PASSWORD}" <<-EOSQL
  -- Crear base propia de la app
  CREATE DATABASE IF NOT EXISTS ${FRINK_DB} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

  -- Crear usuario y permisos
  CREATE USER IF NOT EXISTS '${FRINK_DB_USER}'@'%' IDENTIFIED BY '${FRINK_DB_PASSWORD}';
  GRANT ALL PRIVILEGES ON ${FRINK_DB}.* TO '${FRINK_DB_USER}'@'%';
  GRANT SHOW DATABASES ON *.* TO '${FRINK_DB_USER}'@'%';
  FLUSH PRIVILEGES;
EOSQL

echo "✅ Base de datos ${FRINK_DB} y usuario ${FRINK_DB_USER} creados exitosamente"

# Crear tablas iniciales de Laravel se hará con migrations desde el contenedor web
