# Configurar Gmail para envío de correos en Laravel

## Paso 1: Crear Contraseña de Aplicación en Gmail

1. Ve a tu cuenta de Google: https://myaccount.google.com/
2. En el menú izquierdo → **Seguridad**
3. Activa **Verificación en 2 pasos** (si no la tienes)
4. Busca **Contraseñas de aplicaciones**
5. Genera una nueva contraseña:
   - Aplicación: Correo
   - Dispositivo: Otro (escribe "Laravel")
6. Copia la contraseña de 16 dígitos que te muestra

## Paso 2: Configurar .env en Laravel

Edita el archivo `.env` en la raíz del backend:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=tu_correo@gmail.com
MAIL_PASSWORD=xxxx xxxx xxxx xxxx   # La contraseña de aplicación (16 dígitos)
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=tu_correo@gmail.com
MAIL_FROM_NAME="Yeli's Cake"
```

## Paso 3: Limpiar caché

```powershell
php artisan config:clear
php artisan config:cache
```

## Paso 4: Probar

Desde la app:
- Login → "¿Olvidaste tu contraseña?"
- Ingresa tu correo → Enviar enlace
- Revisa tu Gmail en 1-2 minutos
- Verás el código de 6 dígitos

**Nota**: Si Gmail sigue sin funcionar, usa Mailtrap para desarrollo.
