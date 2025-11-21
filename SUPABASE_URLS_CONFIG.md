# 🔄 Configuración de Supabase - URLs de Redirección

## 📋 URLs a configurar en Supabase:

Ve a Supabase → Tu proyecto → Authentication → URL Configuration

### 🔗 Agrega estas URLs:

#### Para tu dominio actual:
```
https://estructura-patrones-frontend-ljgk.vercel.app/auth/callback
https://estructura-patrones-frontend-ljgk.vercel.app
```

#### Para desarrollo local:
```
http://localhost:3000/auth/callback
http://localhost:3000
```

## 🎯 Paso a paso:

1. Ve a [supabase.com](https://supabase.com)
2. Inicia sesión
3. Selecciona tu proyecto
4. Ve a "Authentication" (en el menú lateral)
5. Click en "URL Configuration"
6. En "Site URL" agrega: `https://estructura-patrones-frontend-ljgk.vercel.app`
7. En "Redirect URLs" agrega las URLs de arriba
8. Guarda los cambios

## 📱 Para Google Login:

Si usas Google Login, también necesitas:

1. Ve a "Authentication" → "Providers"
2. Busca "Google" y actívalo
3. En "Authorized redirect URIs" agrega:
   - `https://estructura-patrones-frontend-ljgk.vercel.app/auth/callback`

## ⚡ Verificación:

Después de configurar, puedes probar:
1. Ve a: `https://estructura-patrones-frontend-ljgk.vercel.app/login`
2. Click en "Continuar con Google"
3. Debería redirigirte correctamente