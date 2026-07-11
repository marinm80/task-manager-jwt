# Task Manager API — Gestor de Tareas con Autenticación JWT

Sistema fullstack de gestión de tareas con autenticación segura mediante JSON Web Tokens.
Incluye roles de usuario, CRUD completo de tareas, filtros, paginación, exportación a CSV y recuperación de contraseña.

> **Stack:** PostgreSQL · Express.js · React · Node.js (PERN)

---

## Índice

- [Descripción del proyecto](#descripción-del-proyecto)
- [Arquitectura](#arquitectura)
- [Tecnologías](#tecnologías)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Requisitos previos](#requisitos-previos)
- [Instalación (desarrollo local)](#instalación-desarrollo-local)
- [Instalación con Docker](#instalación-con-docker)
- [Variables de entorno](#variables-de-entorno)
- [Base de datos](#base-de-datos)
- [Endpoints de la API](#endpoints-de-la-api)
- [Roles y permisos](#roles-y-permisos)
- [Scripts disponibles](#scripts-disponibles)
- [Tests](#tests)
- [Deploy con Docker y Nginx Proxy Manager](#deploy-con-docker-y-nginx-proxy-manager)

---

## Descripción del proyecto

Aplicación de gestión de tareas que permite a los usuarios registrarse, iniciar sesión y
administrar sus tareas personales. Los administradores tienen acceso a un panel de control
con visibilidad sobre todos los usuarios y sus tareas.

**Funcionalidades principales:**
- Registro e inicio de sesión con JWT (access token + refresh token)
- CRUD completo de tareas con validación en backend (Zod)
- Filtros por estado, prioridad y fechas
- Búsqueda por texto en título y descripción
- Paginación de resultados
- Exportación de tareas a CSV
- Recuperación de contraseña (directa o por token)
- Panel de administración (solo rol admin)
- Persistencia de sesión con refresh tokens (7 días)

---

## Arquitectura

```
Cliente (React + Vite)
        │
        │  HTTP / REST (Axios)
        ▼
Backend (Express.js + Node.js)
        │
        │  Prisma ORM
        ▼
Base de datos (PostgreSQL)
```

**Flujo de autenticación:**
1. El cliente envía credenciales a `POST /api/auth/login`
2. El servidor valida y devuelve `accessToken` (15 min) + `refreshToken` (7 días)
3. El accessToken se almacena en memoria (Redux). El refreshToken en cookie HTTP-Only
4. Axios intercepta cada request y adjunta el accessToken en el header `Authorization: Bearer`
5. Si el accessToken expira, el interceptor llama a `POST /api/auth/refresh` automáticamente

---

## Tecnologías

### Backend
| Paquete | Versión | Uso |
|---|---|---|
| express | ^4.21 | Servidor HTTP y routing |
| @prisma/client | ^5.22 | ORM para PostgreSQL |
| prisma | ^5.22 | CLI de migraciones |
| jsonwebtoken | ^9.x | Generación y verificación de JWT |
| bcrypt | ^5.x | Hash de contraseñas |
| zod | ^3.x | Validación de datos en runtime |
| helmet | ^7.x | Headers de seguridad HTTP |
| cors | ^2.x | Control de CORS |
| cookie-parser | ^1.x | Lectura de cookies HTTP |
| express-rate-limit | ^7.x | Protección contra fuerza bruta |
| dotenv | ^16.x | Variables de entorno |
| nodemailer | ^6.x | Envío de emails (recuperación de contraseña) |

### Frontend
| Paquete | Versión | Uso |
|---|---|---|
| react | ^18.x | Librería de UI |
| vite | ^8.x | Bundler y servidor de desarrollo |
| @reduxjs/toolkit | ^2.x | Gestión de estado global |
| react-redux | ^9.x | Integración Redux con React |
| react-router-dom | ^6.x | Enrutamiento client-side |
| axios | ^1.x | Cliente HTTP con interceptores |
| react-hook-form | ^7.x | Manejo de formularios |
| zod | ^3.x | Validación de formularios (mismos schemas que backend) |
| @hookform/resolvers | ^3.x | Integración Zod con React Hook Form |
| tailwindcss | ^3.x | Estilos utilitarios |

### DevDependencies (backend)
| Paquete | Uso |
|---|---|
| jest | Framework de testing |
| supertest | Testing de endpoints HTTP |
| nodemon | Hot-reload en desarrollo |

---

## Estructura del proyecto

```
task-manager-jwt/
├── docker-compose.yml             # Orquestación de contenedores
├── .env                           # Variables de entorno para Docker
│
├── backend/
│   ├── Dockerfile                 # Imagen Node 20 Alpine (producción)
│   ├── entrypoint.sh              # Corre migraciones y arranca el servidor
│   ├── server.js                  # Punto de entrada del servidor
│   ├── .env.example
│   ├── package.json
│   ├── prisma/
│   │   ├── schema.prisma          # Modelos User y Task
│   │   └── migrations/            # Historial de migraciones
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js              # Configuración conexión Prisma
│   │   ├── controllers/
│   │   │   ├── authController.js  # register, login, refresh, logout, forgotPassword, resetPassword
│   │   │   ├── taskController.js  # CRUD de tareas + exportCSV
│   │   │   └── adminController.js # getUsers, getUserTasks, updateRole
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js  # Verificación JWT
│   │   │   ├── roleMiddleware.js  # Control de roles (admin/user)
│   │   │   └── errorHandler.js   # Manejo centralizado de errores
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── taskRoutes.js
│   │   │   └── adminRoutes.js
│   │   ├── schemas/
│   │   │   ├── authSchemas.js     # Zod: register, login, forgotPassword, resetPassword
│   │   │   └── taskSchemas.js     # Zod: createTask, updateTask
│   │   └── utils/
│   │       ├── jwt.js             # generateAccessToken, generateRefreshToken
│   │       └── csvExporter.js     # Generación de CSV
│   └── tests/
│       ├── auth.test.js
│       └── tasks.test.js
│
└── frontend/
    ├── Dockerfile                  # Build multietapa (Node → Nginx Alpine)
    ├── nginx.conf                  # Config Nginx para SPA y caché de assets
    ├── src/
    │   ├── app/
    │   │   └── store.js           # Redux store
    │   ├── features/
    │   │   ├── auth/
    │   │   │   └── authSlice.js   # Estado y thunks de autenticación
    │   │   └── tasks/
    │   │       └── tasksSlice.js  # Estado y thunks de tareas
    │   ├── components/
    │   │   ├── TaskCard.jsx
    │   │   ├── TaskForm.jsx
    │   │   └── PrivateRoute.jsx
    │   ├── pages/
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── DashboardPage.jsx
    │   │   ├── AdminPage.jsx
    │   │   ├── ForgotPasswordPage.jsx
    │   │   └── ResetPasswordPage.jsx
    │   ├── services/
    │   │   ├── authService.js     # Llamadas API de auth
    │   │   └── taskService.js     # Llamadas API de tareas
    │   └── utils/
    │       └── axiosConfig.js     # Instancia Axios con interceptores
    ├── .env.example
    └── package.json
```

---

## Requisitos previos

- [Node.js](https://nodejs.org/) v20 o superior
- [Docker](https://www.docker.com/) y Docker Compose (para despliegue en contenedores)
- [PostgreSQL](https://www.postgresql.org/) v14 o superior (solo para desarrollo local sin Docker)
- npm v9 o superior

---

## Instalación (desarrollo local)

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/task-manager-jwt.git
cd task-manager-jwt
```

### 2. Configurar el backend

```bash
cd backend
npm install
cp .env.example .env
# Editar .env con tus datos de PostgreSQL y secretos JWT
```

### 3. Configurar la base de datos

```bash
# Crear la base de datos en PostgreSQL primero:
# psql -U postgres -c "CREATE DATABASE taskmanagerdb;"

# Correr las migraciones con Prisma:
npx prisma migrate dev

# (Opcional) Cargar datos de prueba:
npx prisma db seed
```

### 4. Iniciar el backend

```bash
npm run dev
# Servidor corriendo en http://localhost:3000
```

### 5. Configurar el frontend (en otra terminal)

```bash
cd ../frontend
npm install
cp .env.example .env
# Editar VITE_API_URL si el backend no corre en localhost:3000
npm run dev
# Frontend corriendo en http://localhost:5173
```

---

## Instalación con Docker

El proyecto incluye un `docker-compose.yml` que levanta tres contenedores: base de datos, backend y frontend.

### 1. Crear el archivo de variables de entorno

```bash
cp .env.example .env
# Editar .env con los valores reales
```

### 2. Levantar todos los servicios

```bash
docker compose up -d --build
```

Esto levanta:
- **task-db** — PostgreSQL 16, datos persistidos en volumen `postgres_data`
- **task-backend** — API Express, espera a que la BD esté sana antes de arrancar
- **task-frontend** — Build de React servido por Nginx en el contenedor

### 3. Ver los logs

```bash
docker compose logs -f task-backend
```

### 4. Parar los servicios

```bash
docker compose down
# Para borrar también los datos de la BD:
docker compose down -v
```

---

## Variables de entorno

### Raíz del proyecto — `.env` (para Docker Compose)

```env
# PostgreSQL
POSTGRES_DB=taskmanagerdb
POSTGRES_USER=postgres
POSTGRES_PASSWORD=tu_password_seguro

# JWT — strings largos y aleatorios (64+ caracteres)
JWT_SECRET=string_muy_largo_y_aleatorio_para_access_tokens
JWT_REFRESH_SECRET=otro_string_completamente_distinto_para_refresh
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CORS — URL exacta del frontend
CLIENT_URL=https://tu-dominio.com

# URL del backend (para el build del frontend)
VITE_API_URL=https://tu-dominio.com/api

# Email (para recuperación de contraseña con token)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu@gmail.com
EMAIL_PASS=tu_app_password_de_gmail
```

### Backend — `backend/.env.example` (desarrollo local)

```env
DATABASE_URL="postgresql://USUARIO:PASSWORD@localhost:5432/taskmanagerdb"
JWT_SECRET="cambia_esto_por_un_string_largo_y_aleatorio"
JWT_REFRESH_SECRET="otro_string_largo_diferente_al_anterior"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
PORT=3000
NODE_ENV=development
CLIENT_URL="http://localhost:5173"
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="tu@gmail.com"
EMAIL_PASS="tu_app_password_de_gmail"
```

### Frontend — `frontend/.env.example`

```env
VITE_API_URL="http://localhost:3000/api"
```

> **Importante:** Nunca subas tu archivo `.env` real al repositorio.
> El `.gitignore` ya incluye `.env` por defecto en proyectos Node.

---

## Base de datos

### Modelos (Prisma Schema)

```prisma
model User {
  id               Int       @id @default(autoincrement())
  email            String    @unique
  password         String
  name             String
  role             Role      @default(USER)
  refreshToken     String?
  resetToken       String?       // Token para recuperación de contraseña por email
  resetTokenExpiry DateTime?     // Expiración del reset token
  createdAt        DateTime  @default(now())
  tasks            Task[]
}

model Task {
  id          Int        @id @default(autoincrement())
  title       String
  description String?
  status      TaskStatus @default(PENDING)
  priority    Priority   @default(MEDIUM)
  dueDate     DateTime?
  userId      Int
  user        User       @relation(fields: [userId], references: [id])
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}

enum Role        { USER ADMIN }
enum TaskStatus  { PENDING IN_PROGRESS COMPLETED }
enum Priority    { LOW MEDIUM HIGH }
```

### Diagrama de relaciones

```
User (1) ──────── (N) Task
  id                    id
  email                 title
  password              status
  role                  priority
  refreshToken          dueDate
  resetToken            userId (FK)
  resetTokenExpiry
```

---

## Endpoints de la API

### Health check

```
GET    /health                Verifica que el servidor está corriendo
```

### Autenticación

```
POST   /api/auth/register          Registrar nuevo usuario
POST   /api/auth/login             Iniciar sesión → devuelve accessToken + refreshToken (cookie)
POST   /api/auth/refresh           Obtener nuevo accessToken usando el refreshToken
POST   /api/auth/logout            Invalidar refreshToken
POST   /api/auth/forgot-password   Cambiar contraseña directamente (email + nueva contraseña)
POST   /api/auth/reset-password    Restablecer contraseña con token de email
```

### Tareas (requieren accessToken en header `Authorization: Bearer <token>`)

```
GET    /api/tasks             Listar tareas del usuario autenticado
                              Query params: ?status=PENDING&priority=HIGH&page=1&limit=10&search=texto

POST   /api/tasks             Crear nueva tarea
PUT    /api/tasks/:id         Actualizar tarea (solo el dueño)
DELETE /api/tasks/:id         Eliminar tarea (solo el dueño)
GET    /api/tasks/export      Descargar todas las tareas como CSV
```

### Admin (requieren rol ADMIN)

```
GET    /api/admin/users                 Listar todos los usuarios
GET    /api/admin/users/:id/tasks       Ver tareas de un usuario específico
PATCH  /api/admin/users/:id/role        Cambiar rol de un usuario
```

### Ejemplo de request y response

**POST /api/auth/login**
```json
// Request body
{ "email": "usuario@ejemplo.com", "password": "MiPassword123" }

// Response 200
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": 1, "name": "Euclides", "email": "usuario@ejemplo.com", "role": "USER" }
}
// El refreshToken llega como cookie HTTP-Only
```

**POST /api/auth/forgot-password**
```json
// Request body
{ "email": "usuario@ejemplo.com", "password": "NuevaPassword123" }

// Response 200
{ "message": "Password updated. You can now log in." }
```

**POST /api/tasks**
```json
// Request body
{
  "title": "Implementar autenticación JWT",
  "description": "Crear endpoints de registro y login",
  "status": "IN_PROGRESS",
  "priority": "HIGH",
  "dueDate": "2026-06-01"
}

// Response 201
{
  "id": 42,
  "title": "Implementar autenticación JWT",
  "status": "IN_PROGRESS",
  "priority": "HIGH",
  "dueDate": "2026-06-01T00:00:00.000Z",
  "userId": 1,
  "createdAt": "2026-05-18T10:30:00.000Z"
}
```

---

## Roles y permisos

| Acción | USER | ADMIN |
|---|---|---|
| Crear/editar/eliminar sus propias tareas | ✅ | ✅ |
| Ver tareas de otros usuarios | ❌ | ✅ |
| Exportar sus tareas a CSV | ✅ | ✅ |
| Ver lista de todos los usuarios | ❌ | ✅ |
| Cambiar rol de usuario | ❌ | ✅ |

---

## Scripts disponibles

### Backend

```bash
npm run dev       # Servidor con hot-reload (nodemon)
npm start         # Servidor en producción
npm test          # Ejecutar tests con Jest
npm run lint      # Revisar estilo de código con ESLint

npx prisma studio           # Abrir interfaz visual de la BD
npx prisma migrate dev      # Crear y aplicar nueva migración
npx prisma migrate reset    # Borrar y recrear la BD (solo desarrollo)
npx prisma db seed          # Insertar datos de prueba
```

### Frontend

```bash
npm run dev       # Servidor de desarrollo (Vite)
npm run build     # Build de producción en /dist
npm run preview   # Preview del build de producción
```

---

## Tests

Los tests están en `backend/tests/` y usan Jest + Supertest.

```bash
cd backend
npm test

# Output esperado:
# PASS tests/auth.test.js
#   ✓ POST /auth/register - registro exitoso (120ms)
#   ✓ POST /auth/register - email duplicado devuelve 409 (45ms)
#   ✓ POST /auth/login - credenciales correctas devuelve token (89ms)
#   ✓ POST /auth/login - password incorrecto devuelve 401 (72ms)
#
# PASS tests/tasks.test.js
#   ✓ GET /tasks - sin token devuelve 401 (30ms)
#   ✓ POST /tasks - crea tarea correctamente (95ms)
#   ✓ DELETE /tasks/:id - usuario no puede eliminar tarea ajena (40ms)
```

---

## Deploy con Docker y Nginx Proxy Manager

El despliegue en producción usa Docker Compose con tres contenedores y una red externa gestionada por Nginx Proxy Manager.

### Arquitectura de red

```
Internet
    │
Nginx Proxy Manager (red: coolify)
    ├── task-frontend  (puerto 80 interno)
    └── task-backend   (puerto 3000 interno)
             │
         task_internal_net (red privada)
             │
         task-db (PostgreSQL, no expuesto)
```

### Pasos de deploy

**1. Crear la red externa** (solo la primera vez)

```bash
docker network create coolify
```

**2. Copiar y editar variables de entorno**

```bash
cp .env.example .env
# Configurar con valores de producción (secretos, dominio, DB password)
```

**3. Construir e iniciar los contenedores**

```bash
docker compose up -d --build
```

**4. Configurar Nginx Proxy Manager**

Crear dos entradas de Proxy Host:
- `api.tu-dominio.com` → `task-backend:3000`
- `tu-dominio.com` → `task-frontend:80`

O configurar un único dominio con rutas:
- `/api/` → `task-backend:3000`
- `/` → `task-frontend:80`

**5. Habilitar SSL en Nginx Proxy Manager**

En cada Proxy Host, activar "Request a new SSL Certificate" con Let's Encrypt.

### Notas importantes en producción

- `NODE_ENV=production` ya está forzado en el `docker-compose.yml` → activa `secure: true` en la cookie del refresh token (requiere HTTPS)
- El backend corre `prisma migrate deploy` automáticamente al arrancar (via `entrypoint.sh`)
- Los datos de PostgreSQL persisten en el volumen `postgres_data`
- Para actualizar: `docker compose pull && docker compose up -d --build`

---

## Notas para la IA (contexto del codebase)

- El backend sigue el patrón MVC: `routes → controllers → (Prisma) → DB`
- La validación ocurre en dos capas: Zod en middleware antes del controller, y constraints de Prisma en la BD
- Los schemas de Zod están en `src/schemas/` y se reutilizan entre frontend y backend (misma lógica)
- El manejo de errores está centralizado en `middleware/errorHandler.js` — todos los controllers usan `next(error)` en lugar de responder directamente con errores
- Los tokens JWT se generan en `utils/jwt.js`. El accessToken va en el header, el refreshToken en cookie HTTP-Only con `secure: true` en producción
- Redux usa el patrón `createAsyncThunk` para todas las llamadas API. Los estados de carga y error están en cada slice
- El archivo `axiosConfig.js` contiene los interceptores de Axios: uno adjunta el token, otro maneja el refresh automático cuando el servidor devuelve 401
- `app.set('trust proxy', 1)` está configurado en `server.js` para que rate-limit funcione correctamente detrás de Nginx

---

## Autor

**Euclides Marín** — [@tu-usuario-github](https://github.com/tu-usuario)
