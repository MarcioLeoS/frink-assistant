FROM composer:2 AS vendor
WORKDIR /app
COPY composer.json composer.lock ./
COPY artisan ./
COPY app ./app
COPY bootstrap ./bootstrap
COPY config ./config
COPY database ./database
COPY routes ./routes
RUN composer install --no-dev --prefer-dist --no-progress --no-interaction --optimize-autoloader --ignore-platform-reqs

FROM node:20-alpine AS frontend
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM php:8.3.14-apache

RUN apt-get update && apt-get install -y \
    libpng-dev libjpeg62-turbo-dev libfreetype6-dev libzip-dev unzip git \
 && docker-php-ext-configure gd --with-freetype --with-jpeg \
 && docker-php-ext-install -j"$(nproc)" gd pdo_mysql zip exif \
 && a2enmod rewrite \
 && rm -rf /var/lib/apt/lists/*

ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
RUN sed -ri "s#DocumentRoot /var/www/html#DocumentRoot ${APACHE_DOCUMENT_ROOT}#g" /etc/apache2/sites-available/000-default.conf \
 && sed -ri "s#<Directory /var/www/>#<Directory ${APACHE_DOCUMENT_ROOT}/>#g" /etc/apache2/apache2.conf \
 && sed -ri "s#AllowOverride None#AllowOverride All#g" /etc/apache2/apache2.conf

WORKDIR /var/www/html

COPY --from=vendor /app/vendor ./vendor
COPY --chown=www-data:www-data . .
COPY --from=frontend --chown=www-data:www-data /app/public/build ./public/build

RUN rm -rf bootstrap/cache/*.php

RUN chown -R www-data:www-data /var/www/html \
 && php artisan package:discover --ansi || true
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
