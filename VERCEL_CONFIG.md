# 🚀 Configuración de Vercel para Producción

## 📋 Variables de entorno necesarias en Vercel:

Ve a Vercel → Tu proyecto → Settings → Environment Variables

### 🔑 Credenciales de Supabase:
```
VITE_SUPABASE_URL=https://jmumjdejdhncycnxgkom.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptdW1qZGVqZGhuY3ljbnhna29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2NDY0NzksImV4cCI6MjA3OTIyMjQ3OX0.Co1vLYDB8zFNT420HBc8Deqb7i9kzuznfRuIiYBwa14
```

### 🔗 Backend API (IMPORTANTE!):
```
# Cuando tengas la URL de Railway, reemplaza aquí:
VITE_API_URL=https://tu-backend-url.up.railway.app

# Por ahora, para desarrollo local:
VITE_API_URL=http://localhost:8080
```

### 🔒 reCAPTCHA:
```
VITE_RECAPTCHA_SITE_KEY=6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI
```

### 🌐 Configuración general:
```
VITE_PORT=3000
```

## 🎯 Para el futuro - URLs de redirección en Supabase:

Cuando configures Google Login en Supabase, agrega estas URLs:

### Development:
- `http://localhost:3000/auth/callback`
- `http://localhost:3000`

### Production (tu URL actual):
- `https://estructura-patrones-frontend-ljgk.vercel.app/auth/callback`
- `https://estructura-patrones-frontend-ljgk.vercel.app`

## 📱 Paso a paso en Vercel:

1. Ve a [vercel.com](https://vercel.com)
2. Inicia sesión
3. Selecciona tu proyecto "HotCash"
4. Ve a "Settings" (configuración)
5. Busca "Environment Variables"
6. Agrega cada variable con su valor
7. Guarda los cambios
8. Vercel automáticamente hará redeploy

## ⚡ Verificación:

Después de configurar, puedes verificar que las variables estén cargadas:

1. Ve a tu app: `https://estructura-patrones-frontend-ljgk.vercel.app/test-auth`
2. Abre la consola del navegador (F12)
3. Los logs mostrarán las variables cargadas (sin valores sensibles)

## 🔄 Cuando tengas la URL del backend:

1. Actualiza `VITE_API_URL` con la URL real de Railway
2. Vercel automáticamente redeployará
3. Prueba el login/registro nuevamente