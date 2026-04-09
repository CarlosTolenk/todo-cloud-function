# AtomChat Backend

Backend para una aplicacion de gestion de tareas construido con Node.js, Express, TypeScript, Firebase Cloud Functions y Firestore.

## Resumen

Este servicio expone una API HTTP para:

- buscar usuarios por email
- crear usuarios
- listar tareas por usuario
- crear tareas
- actualizar tareas
- eliminar tareas

La solucion esta organizada con una arquitectura limpia y pragmatica, con separacion por modulos, validacion explicita de entradas, logging estructurado y despliegue automatizado sobre Firebase.

## Stack

- Node.js 22
- Express
- TypeScript estricto
- Firebase Functions v2
- Firestore
- Zod
- Vitest

## Caracteristicas

- API REST con respuestas JSON consistentes
- validacion de payloads y params con schemas explicitos
- Firestore encapsulado detras de repositorios
- logging estructurado con `requestId`
- CI para validar lint, build y test en pull requests
- CD para desplegar automaticamente en `main`
- reglas e indices de Firestore versionados en el repo

## Arquitectura

```text
src/
  app/
  config/
  shared/
  modules/
    users/
      domain/
      application/
      infrastructure/
      presentation/
    tasks/
      domain/
      application/
      infrastructure/
      presentation/
tests/
```

### Criterios de diseño

- `domain`: contratos y modelos
- `application`: casos de uso
- `infrastructure`: acceso a Firestore
- `presentation`: controllers, rutas y schemas

La composicion de dependencias se centraliza en `src/app/app-container.ts`, lo que mantiene el bootstrap limpio sin introducir una libreria externa de IoC.

## Contrato de respuesta

Respuesta exitosa:

```json
{
  "success": true,
  "data": {}
}
```

Respuesta con error:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data"
  }
}
```

## API

### `GET /health`

Healthcheck del servicio.

### `GET /users/by-email/:email`

Busca un usuario por email.

### `POST /users`

```json
{
  "email": "user@example.com"
}
```

### `GET /tasks?userId=...`

Obtiene las tareas de un usuario.

### `POST /tasks`

```json
{
  "userId": "user-id",
  "title": "Task title",
  "description": "Task description"
}
```

### `PATCH /tasks/:id`

```json
{
  "title": "Updated title",
  "description": "Updated description",
  "completed": true
}
```

### `DELETE /tasks/:id`

Elimina una tarea existente.

## Validacion y errores

La entrada HTTP se valida en la capa `presentation` con Zod antes de llegar a la logica de negocio.  
Los errores de negocio y los errores inesperados se normalizan a un contrato comun para facilitar consumo desde frontend y observabilidad.

## Logging y observabilidad

El backend usa logging estructurado en JSON, pensado para Firebase Functions y Cloud Logging.

Se registra:

- inicio de request
- fin de request
- `requestId`
- metodo y path
- status code
- duracion en ms
- errores de validacion
- errores de negocio controlados
- errores no controlados

La verbosidad se controla con `LOG_LEVEL`.

## Variables de entorno

Archivo base:

```bash
.env.example
```

Variables principales:

```env
NODE_ENV=development
PORT=3000
CORS_ORIGIN=*
LOG_LEVEL=info
```

Para produccion en Firebase Functions, se recomienda usar:

```bash
.env.<projectId>
```

Ejemplo:

```env
NODE_ENV=production
CORS_ORIGIN=https://tu-frontend.com
LOG_LEVEL=info
```

En produccion no es necesario definir `FIREBASE_SERVICE_ACCOUNT_KEY` dentro de Firebase Functions, ya que el Admin SDK usa las credenciales gestionadas del entorno.

## Desarrollo local

1. Instalar dependencias:

```bash
npm install
```

2. Crear archivo de entorno:

```bash
cp .env.example .env
```

3. Ejecutar en modo desarrollo:

```bash
npm run dev
```

4. Ejecutar emuladores de Functions y Firestore:

```bash
npm run serve
```

## Calidad

Validaciones locales:

```bash
npm run lint
npm run build
npm test
```

La suite cubre casos de uso, controladores, repositorios, middlewares HTTP, logging y validaciones.

## Firestore

El proyecto incluye configuracion versionada para Firestore:

- reglas: [firestore.rules](/Users/carlostolentino/Projects/AtomChat/backend/firestore.rules)
- indices: [firestore.indexes.json](/Users/carlostolentino/Projects/AtomChat/backend/firestore.indexes.json)

La base esta pensada para ser accedida a traves del backend. Por eso las reglas bloquean acceso directo de clientes y el acceso operativo lo realiza el Admin SDK desde Cloud Functions.

## Despliegue

### Requisitos

- proyecto Firebase creado
- Firestore habilitado
- plan Blaze activo
- alias configurado con Firebase CLI

### Comandos

Deploy completo:

```bash
npm run deploy
```

Deploy por recurso:

```bash
npm run deploy:firestore
npm run deploy:functions
```

### Checklist

1. Confirmar `CORS_ORIGIN` para el frontend real.
2. Ejecutar `npm run lint`.
3. Ejecutar `npm run build`.
4. Ejecutar `npm test`.
5. Desplegar Firestore.
6. Desplegar Functions.
7. Probar `GET /health`.
8. Validar CRUD real de usuarios y tareas.
9. Revisar logs en Cloud Logging.

## CI/CD

### CI

Workflow: [.github/workflows/ci.yml](/Users/carlostolentino/Projects/AtomChat/backend/.github/workflows/ci.yml)

Se ejecuta en cada `pull_request` y valida:

- `npm ci`
- `npm run lint`
- `npm run build`
- `npm test`

### CD

Workflow: [.github/workflows/deploy.yml](/Users/carlostolentino/Projects/AtomChat/backend/.github/workflows/deploy.yml)

Se ejecuta al hacer `push` a `main` y:

- instala dependencias
- valida lint
- compila
- ejecuta tests
- genera el archivo de entorno del proyecto
- despliega Firestore y Cloud Functions

### Secrets de GitHub requeridos

- `FIREBASE_SERVICE_ACCOUNT`
- `CORS_ORIGIN`
- `LOG_LEVEL`

### Recomendacion operativa

Protege `main` y exige el check `CI / Lint, Build and Test` antes de permitir merge.
