# --- 1) Composer deps ---
FROM composer:2 AS vendor
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --prefer-dist --no-progress --no-interaction --optimize-autoloader
COPY . .
RUN composer install --no-dev --prefer-dist --no-progress --no-interaction --optimize-autoloader

# --- 2) Vite build (Node) ---
FROM node:20-alpine AS frontend
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# --- 3) Runtime: Apache + PHP 8.3 ---
FROM php:8.3-apache

# Extensiones + Apache
RUN apt-get update && apt-get install -y \
    libpng-dev libjpeg62-turbo-dev libfreetype6-dev libzip-dev unzip git \
 && docker-php-ext-configure gd --with-freetype --with-jpeg \
 && docker-php-ext-install -j"$(nproc)" gd pdo_mysql zip exif \
 && a2enmod rewrite \
 && rm -rf /var/lib/apt/lists/*

# DocumentRoot -> /public
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
RUN sed -ri "s#DocumentRoot /var/www/html#DocumentRoot ${APACHE_DOCUMENT_ROOT}#g" /etc/apache2/sites-available/000-default.conf \
 && sed -ri "s#<Directory /var/www/>#<Directory ${APACHE_DOCUMENT_ROOT}/>#g" /etc/apache2/apache2.conf \
 && sed -ri "s#AllowOverride None#AllowOverride All#g" /etc/apache2/apache2.conf

WORKDIR /var/www/html

# Copiamos código de la app
COPY . .

# Copiamos vendor y los assets de Vite (solo /build para no pisar otros archivos de public)
COPY --from=vendor   /app/vendor           ./vendor
COPY --from=frontend /app/public/build     ./public/build

# Copiamos el .env del repo dentro de la imagen
# (asegurate de tener frink-assistant-web/.env presente al build)
COPY .env ./.env

# Permisos y descubrir paquetes
RUN chown -R www-data:www-data /var/www/html \
 && php artisan package:discover --ansi || true

# -------- EntryPoint: espera MySQL + migra + storage:link --------
RUN printf '%s\n' '#!/usr/bin/env bash' \
'set -e' \
'cd /var/www/html' \
'echo "[entrypoint] Esperando MySQL en ${DB_HOST}:${DB_PORT:-3306}..."' \
'php -r '"'"'$h=getenv("DB_HOST")?: "mysql";$P=getenv("DB_PORT")?: "3306";$d=getenv("DB_DATABASE")?: "frink_assistant";$u=getenv("DB_USERNAME")?: "frink_user";$p=getenv("DB_PASSWORD")?: "";for($i=0;$i<60;$i++){try{new PDO("mysql:host=$h;port=$P;dbname=$d",$u,$p,[PDO::ATTR_TIMEOUT=>2]);echo "MySQL OK\n";exit(0);}catch(Exception $e){echo "MySQL no disponible, reintento...\n";sleep(2);}}echo "Timeout esperando MySQL\n";exit(1);'"'" \
'php artisan optimize:clear || true' \
'php artisan session:table || true' \
'php artisan migrate --force || true' \
'php artisan storage:link || true' \
'echo "[entrypoint] Listo. Arrancando Apache..."' \
'exec apache2-foreground' > /entrypoint.sh \
 && chmod +x /entrypoint.sh

EXPOSE 80
ENTRYPOINT ["/entrypoint.sh"]
