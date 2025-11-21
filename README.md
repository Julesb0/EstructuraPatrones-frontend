# HotCash - Plataforma de Emprendedores

Una plataforma completa para emprendedores con autenticación, perfiles, planes de negocio y asistente de IA inteligente.

## 🚀 Características

- ✅ **Autenticación completa** (email/password + social login)
- ✅ **Perfiles de emprendedores** con información detallada
- ✅ **Planes de negocio** con análisis financiero
- ✅ **Chatbot inteligente** con IA para consultas legales, financieras y de marketing
- ✅ **reCAPTCHA** para seguridad
- ✅ **Diseño moderno** y responsive

## 🛠️ Tecnologías

### Frontend
- React 18 + TypeScript
- Vite
- Tailwind CSS
- Supabase Client
- React Router DOM

### Backend
- Spring Boot 3
- Java 17
- Maven
- Supabase (PostgreSQL)
- JWT Authentication

## 📦 Instalación

### Frontend
```bash
cd nuevo-frontend
npm install
npm run dev
```

### Backend
```bash
cd nuevo-backend
mvn clean install
mvn spring-boot:run
```

## 🔧 Variables de Entorno

### Frontend (.env)
```bash
VITE_SUPABASE_URL=tu-url-supabase
VITE_SUPABASE_ANON_KEY=tu-anon-key
VITE_API_URL=tu-backend-url
```

### Backend (.env)
```bash
SUPABASE_URL=tu-url-supabase
SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
SUPABASE_DB_URL=jdbc:postgresql://db.tu-proyecto.supabase.co:5432/postgres
SUPABASE_USER=postgres
SUPABASE_PASSWORD=tu-contraseña
JWT_SECRET=tu-jwt-secret
CORS_ORIGINS=tu-frontend-url
```

## 🎯 Módulos Principales

### 1. Autenticación
- Registro e inicio de sesión
- Login social (Google, GitHub)
- reCAPTCHA integrado
- JWT tokens

### 2. Perfiles
- Información personal del emprendedor
- Datos de empresa
- Avatar y biografía
- Redes sociales

### 3. Planes de Negocio
- Creación de planes de negocio
- Análisis financiero
- Proyecciones
- Gestión de documentos

### 4. Chatbot (Asistente HotCash)
- **Patrones de diseño implementados**:
  - Strategy: Diferentes estrategias para Legal, Finanzas, Marketing
  - Adapter/Bridge: Integración con APIs de IA
  - Decorator: Logging de mensajes
  - Facade: Interfaz simplificada para el chatbot
- Categorías: Legal, Finanzas, Marketing, Otros
- Historial de conversaciones
- Filtros por categoría

## 🚀 Deploy

### Frontend (Vercel)
1. Conecta tu repo de GitHub
2. Configura las variables de entorno
3. Deploy automático

### Backend (Railway)
1. Conecta tu repo de GitHub
2. Configura las variables de entorno
3. Railway detecta automáticamente Maven
4. Deploy con un click

## 📋 Estructura del Proyecto

```
HotCash/
├── nuevo-frontend/          # React + TypeScript
│   ├── src/
│   │   ├── pages/          # Páginas principales
│   │   ├── components/     # Componentes reutilizables
│   │   ├── hooks/         # Custom hooks
│   │   ├── services/      # APIs y servicios
│   │   └── utils/         # Utilidades
│   └── public/
├── nuevo-backend/           # Spring Boot
│   ├── src/main/java/
│   │   ├── controller/    # REST controllers
│   │   ├── service/       # Lógica de negocio
│   │   ├── repository/    # Acceso a datos
│   │   ├── entity/        # Modelos de datos
│   │   └── chatbot/       # Módulo del chatbot
│   └── supabase/          # Migraciones SQL
└── README.md
```

## 🤖 Chatbot - Patrones de Diseño

El chatbot implementa los siguientes patrones de diseño:

### Strategy Pattern
- `AnswerStrategy` interface
- Implementaciones: `LegalAnswerStrategy`, `FinanceAnswerStrategy`, `MarketingAnswerStrategy`, `DefaultAnswerStrategy`
- `AnswerStrategyFactory` para selección dinámica

### Adapter/Bridge Pattern
- `NlpClient` interface
- `ExternalApiNlpClient` para integración con OpenAI
- Fallback a respuestas locales si no hay API key

### Decorator Pattern
- `LoggingNlpClient` para logging de mensajes
- Envuelve cualquier implementación de `NlpClient`

### Facade Pattern
- `ChatbotFacade` que integra toda la funcionalidad
- Interfaz simplificada para el controlador

## 📞 Soporte

Para problemas o preguntas, abre un issue en el repositorio.

## 📄 Licencia

Este proyecto está bajo la licencia MIT.