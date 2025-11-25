# Frink Assistant Lite - Docker Stack

Stack completo con MySQL, n8n y phpMyAdmin con seguridad integrada.

## � Inicio Rápido

```bash
# 1. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus contraseñas

# 2. Levantar servicios
docker-compose up -d

# 3. Acceder
# n8n: http://localhost:5678
# phpMyAdmin: http://localhost:8080
```

## 🔐 Acceso a phpMyAdmin

### Primera capa (Nginx):
- **Usuario:** `admin`
- **Password:** `frink123` (CAMBIAR - ver `nginx/.htpasswd`)

### Segunda capa (MySQL):
- **Servidor 1 - n8n_db:** usuario `n8n_user` / pass en `.env`
- **Servidor 2 - frink_app:** usuario `frink_user` / pass en `.env`
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
| n8n | 5678 | Automatización |
| phpMyAdmin | 8080 | Admin BD (con nginx auth) |
| Nginx | - | Proxy + autenticación |
| Watchtower | - | Auto-updates |
| Backup | - | Backup diario 2am |

## 🛠️ Comandos Útiles

```bash
# Ver logs
docker-compose logs -f

# Detener todo
docker-compose down

# Reiniciar desde cero (BORRA DATOS)
docker-compose down -v
docker-compose up -d

# Ver backups
ls backups/

# Backup manual
docker exec mysql_frink mysqldump -uroot -p[PASSWORD] --all-databases | gzip > backup-manual.sql.gz

# Restaurar backup
gunzip < backup.sql.gz | docker exec -i mysql_frink mysql -uroot -p[PASSWORD]
```

## ⚠️ Para Producción

1. **Cambiar TODAS las contraseñas** (`.env` y `nginx/.htpasswd`)
2. **Cloudflare:** Modo SSL "Full (Strict)"
3. **Firewall:** Bloquear acceso directo a phpMyAdmin excepto tu IP
4. **Probar backups:** Restaurar un backup de prueba
5. **Monitoreo:** Configurar alertas de logs
