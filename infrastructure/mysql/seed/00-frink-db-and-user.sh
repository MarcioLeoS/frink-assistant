#!/bin/bash
set -e

echo "Inicializando base de datos Frink Assistant..."

mysql -uroot -p"${MYSQL_ROOT_PASSWORD}" <<EOSQL
CREATE DATABASE IF NOT EXISTS ${FRINK_DB} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '${FRINK_DB_USER}'@'%' IDENTIFIED BY '${FRINK_DB_PASSWORD}';
GRANT ALL PRIVILEGES ON ${FRINK_DB}.* TO '${FRINK_DB_USER}'@'%';
GRANT SHOW DATABASES ON *.* TO '${FRINK_DB_USER}'@'%';
FLUSH PRIVILEGES;
EOSQL

echo "✅ Usuario ${FRINK_DB_USER} creado con permisos en ${FRINK_DB}"
