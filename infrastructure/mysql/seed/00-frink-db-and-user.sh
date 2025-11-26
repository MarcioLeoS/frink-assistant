#!/bin/bash
set -e

echo "Inicializando base de datos Frink Assistant..."

mysql -uroot -p"${MYSQL_ROOT_PASSWORD}" -e "CREATE DATABASE IF NOT EXISTS ${FRINK_DB} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -uroot -p"${MYSQL_ROOT_PASSWORD}" -e "CREATE USER IF NOT EXISTS '${FRINK_DB_USER}'@'%' IDENTIFIED BY '${FRINK_DB_PASSWORD}';"
mysql -uroot -p"${MYSQL_ROOT_PASSWORD}" -e "GRANT ALL PRIVILEGES ON ${FRINK_DB}.* TO '${FRINK_DB_USER}'@'%';"
mysql -uroot -p"${MYSQL_ROOT_PASSWORD}" -e "GRANT SHOW DATABASES ON *.* TO '${FRINK_DB_USER}'@'%';"
mysql -uroot -p"${MYSQL_ROOT_PASSWORD}" -e "FLUSH PRIVILEGES;"

echo "✅ Usuario ${FRINK_DB_USER} creado con permisos en ${FRINK_DB}"
