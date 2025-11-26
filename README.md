# Frink Assistant - Docker Stack

Stack completo con MySQL, n8n, Laravel 12 y phpMyAdmin con seguridad integrada.

## 🚀 Inicio Rápido

```bash
# 1. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus contraseñas

# 2. Levantar servicios
docker-compose up -d

# 3. Acceder
# Laravel Web: http://localhost:8000
# n8n: http://localhost:5678
# phpMyAdmin: http://localhost:8080
```

## 🔐 Acceso a phpMyAdmin

### Primera capa (Nginx):
- **Usuario:** `admin`
- **Password:** `frink123` (CAMBIAR - ver `nginx/.htpasswd`)

### Segunda capa (MySQL):
- **Servidor 1 - n8n_db:** usuario `n8n_user` / pass en `.env`
- **Servidor 2 - frink_assistant_db:** usuario `frink_user` / pass en `.env`
- **Servidor 3 - Root:** usuario `root` / pass en `.env`

## 🔑 Cambiar contraseña de Nginx

1. Ir a: https://hostingcanada.org/htpasswd-generator/
2. Generar hash con tu usuario/password
3. Copiar resultado a `nginx/.htpasswd`
4. Reiniciar: `docker-compose restart nginx-pma`

## � Seguridad Incluida

✅ Doble autenticación (Nginx + MySQL)
✅ Rate limiting (10 req/min)
✅ Backups automáticos diarios (carpeta `backups/`)
✅ Auto-updates con Watchtower
✅ Headers de seguridad (XSS, Clickjacking)
✅ MySQL no expuesto públicamente
✅ Logs de acceso

## 📦 Servicios

| Servicio | Puerto | Descripción |
|----------|--------|-------------|
| MySQL | Interno | Base de datos (no expuesto) |
| Laravel Web | 8000 | Aplicación principal (Apache + PHP 8.3) |
| n8n | 5678 | Automatización y workflows |
| phpMyAdmin | 8080 | Admin BD (con nginx auth) |
| Nginx | - | Proxy + autenticación |
| Watchtower | - | Auto-updates |
| Backup | - | Backup diario 2am |

## 🗂️ Estructura del Proyecto

```
frink-assistant/
├── docker-compose.yml       # Orquestación completa
├── .env                      # Variables de entorno (NO commitear)
├── .env.example              # Plantilla de configuración
│
├── infrastructure/           # Configuración de infraestructura
│   ├── mysql/seed/          # Scripts de inicialización de BD
│   ├── nginx/               # Config de proxy para phpMyAdmin
│   ├── phpmyadmin/          # Config de phpMyAdmin
│   └── backups/             # Backups automáticos de MySQL
│
├── web/                      # Laravel 12 Application
│   ├── app/                 # Lógica de negocio
│   ├── database/migrations/ # Migraciones de BD
│   ├── routes/              # Rutas de la app
│   └── ...
│
└── n8n/workflows/           # Workflows exportados de n8n
```

## 🛠️ Comandos Útiles

### Docker
```bash
# Ver logs de todos los servicios
docker-compose logs -f

# Ver logs solo de Laravel
docker-compose logs -f web

# Detener todo
docker-compose down

# Reiniciar desde cero (BORRA DATOS)
docker-compose down -v
docker-compose up -d

# Reconstruir imagen de Laravel
docker-compose build web
docker-compose up -d web
```

### Laravel (dentro del contenedor)
```bash
# Ejecutar migraciones
docker exec -it frink_web php artisan migrate

# Crear nueva migración
docker exec -it frink_web php artisan make:migration create_example_table

# Rollback de migraciones
docker exec -it frink_web php artisan migrate:rollback

# Ver rutas
docker exec -it frink_web php artisan route:list

# Limpiar caché
docker exec -it frink_web php artisan optimize:clear

# Acceder al bash del contenedor
docker exec -it frink_web bash
```

### MySQL Backups
```bash
# Ver backups
ls infrastructure/backups/

# Backup manual
docker exec mysql_frink mysqldump -uroot -p[PASSWORD] --all-databases | gzip > infrastructure/backups/backup-manual.sql.gz

# Restaurar backup
gunzip < infrastructure/backups/backup.sql.gz | docker exec -i mysql_frink mysql -uroot -p[PASSWORD]
```

## ⚠️ Para Producción

1. **Cambiar TODAS las contraseñas** (`.env` y `infrastructure/nginx/.htpasswd`)
2. **Generar APP_KEY de Laravel:** `docker exec -it frink_web php artisan key:generate`
3. **Configurar `.env` de Laravel** en modo producción (`APP_ENV=production`, `APP_DEBUG=false`)
4. **Cloudflare:** Modo SSL "Full (Strict)"
5. **Firewall:** Bloquear acceso directo a phpMyAdmin excepto tu IP
6. **Probar backups:** Restaurar un backup de prueba
7. **Monitoreo:** Configurar alertas de logs
8. **Variables sensibles:** Asegurar que MercadoPago keys estén en `.env` y no en repo

## 🔧 Desarrollo

### Primera vez
```bash
# 1. Configurar entorno
cp .env.example .env
# Editar .env con contraseñas seguras

# 2. Levantar stack
docker-compose up -d

# 3. Esperar a que MySQL esté listo (healthcheck)
docker-compose logs -f mysql

# 4. Las migraciones se ejecutan automáticamente
# Pero puedes ejecutarlas manualmente si es necesario:
docker exec -it frink_web php artisan migrate

# 5. Acceder a la app
# http://localhost:8000
```

### Base de datos
- **n8n_db**: Gestionada automáticamente por n8n
- **frink_assistant_db**: Gestionada por Laravel migrations (ver `web/database/migrations/`)

Las migraciones de Laravel se ejecutan automáticamente al iniciar el contenedor `web` gracias al entrypoint del Dockerfile.

### Workflows de n8n
Los workflows en `n8n/workflows/` se montan automáticamente en n8n. Para importarlos:

1. Acceder a n8n: http://localhost:5678
2. Ir a **Workflows** → **Import from File**
3. Seleccionar el archivo desde `/home/node/.n8n/workflows/frink-assistant-workflow.json`
4. Activar el workflow

Alternativamente, copiar workflows exportados a `n8n/workflows/` y reiniciar n8n.
