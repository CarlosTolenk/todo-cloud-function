# AtomChat Backend

Backend para una prueba tecnica de tareas construido con Node.js, Express, TypeScript, Firebase Cloud Functions y Firestore.

## Objetivo

La solucion prioriza:

- claridad arquitectonica
- simplicidad operativa
- contratos JSON consistentes
- Firestore encapsulado detras de repositorios
- facilidad para explicar decisiones tecnicas en entrevista

## Stack

- Node.js 20
- Express
- TypeScript estricto
- Firebase Functions v2
- Firestore
- Zod para validacion
- Vitest + Supertest para pruebas

## Estructura

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

## Decisiones tecnicas

### 1. Arquitectura limpia, pero pragmatica

Se uso una separacion por modulos y capas:

- `domain`: contratos y entidades
- `application`: casos de uso
- `infrastructure`: implementaciones de Firestore
- `presentation`: controllers, rutas y schemas

No se agregaron factories, buses, mappers complejos ni patrones extra porque no aportaban valor real al reto.

Adicionalmente, la composicion de dependencias vive en un contenedor propio y liviano dentro de `src/app/app-container.ts`. Esto centraliza la construccion de repositorios, casos de uso y controladores sin introducir una libreria de IoC externa, manteniendo el proyecto simple y facil de explicar.

### 2. Firestore desacoplado

Los casos de uso dependen de interfaces de repositorio, no de Firestore directamente. Esto mantiene el dominio simple, facilita testing y permite reemplazar infraestructura sin tocar la logica principal.

### 3. Respuesta JSON consistente

Todas las respuestas siguen este contrato:

```json
{
  "success": true,
  "data": {}
}
```

o en error:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data"
  }
}
```

### 4. Validacion explicita

Los DTOs de entrada se validan con Zod en la capa `presentation`. Eso evita que entren datos invalidos a los casos de uso y mantiene mensajes de error claros.

### 5. Firebase Functions sin estructura duplicada

El repo completo funciona como paquete de Firebase Functions. `src/index.ts` exporta la funcion HTTP y `src/server.ts` permite correr localmente la app Express fuera del emulador.

### 6. Variables de entorno seguras

La aplicacion usa `dotenv` para desarrollo local y permite inicializar Firebase con:

- Application Default Credentials, recomendado en Firebase/GCP
- `FIREBASE_SERVICE_ACCOUNT_KEY`, opcional para entornos externos

No se hardcodean secretos en codigo.

### 7. Logging estructurado

El backend usa un logger propio, simple y tipado, que escribe logs JSON a consola. Esto funciona bien en Firebase Functions porque la plataforma recolecta `stdout` y `stderr` de forma nativa.

Se registran:

- inicio de cada request
- fin de cada request
- duracion en milisegundos
- `requestId` para correlacion
- errores de validacion
- errores de negocio controlados
- errores no controlados

La verbosidad se controla con `LOG_LEVEL`.

## Endpoints

### `GET /users/by-email/:email`

Busca un usuario por email.

### `POST /users`

Body:

```json
{
  "email": "user@example.com"
}
```

### `GET /tasks?userId=...`

Obtiene tareas de un usuario existente.

### `POST /tasks`

Body:

```json
{
  "userId": "user-id",
  "title": "Task title",
  "description": "Task description"
}
```

### `PATCH /tasks/:id`

Body parcial permitido:

```json
{
  "title": "Updated title",
  "description": "Updated description",
  "completed": true
}
```

### `DELETE /tasks/:id`

Elimina una tarea existente.

## Ejecutar localmente

1. Instala dependencias:

```bash
npm install
```

2. Crea variables de entorno:

```bash
cp .env.example .env
```

3. Para desarrollo local con Express:

```bash
npm run dev
```

4. Para compilar:

```bash
npm run build
```

5. Para pruebas:

```bash
npm test
```

6. Para emulador de Firebase Functions:

```bash
npm run serve
```

## Preparacion para produccion

### Recursos que debes crear en Firebase

1. Crear un proyecto Firebase productivo.
2. Activar Firestore en modo nativo.
3. Asegurar que el proyecto tenga plan Blaze para poder desplegar Cloud Functions.
4. Configurar el alias del proyecto con Firebase CLI:

```bash
firebase login
firebase use --add
```

### Configuracion de entorno por proyecto

Firebase Functions soporta archivos `.env` y `.env.<alias o projectId>` para despliegue. Para produccion, crea un archivo como:

```bash
.env.prod
```

o

```bash
.env.<tu-project-id>
```

Con valores como:

```env
NODE_ENV=production
CORS_ORIGIN=https://tu-frontend.com
LOG_LEVEL=info
```

En este backend no necesitas `FIREBASE_SERVICE_ACCOUNT_KEY` en produccion dentro de Firebase Functions, porque el Admin SDK usa Application Default Credentials del entorno gestionado.

### Seguridad de Firestore

El proyecto incluye [firestore.rules](/Users/carlostolentino/Projects/AtomChat/backend/firestore.rules) con acceso denegado a clientes directos. Esto es intencional: la arquitectura expone Firestore solo a traves del backend y el Admin SDK de Firebase bypassa las reglas de Firestore.

### Indices de Firestore

El proyecto incluye [firestore.indexes.json](/Users/carlostolentino/Projects/AtomChat/backend/firestore.indexes.json) con el indice compuesto necesario para consultar tareas por `userId` ordenadas por `createdAt desc`.

## Deploy

Una vez configurado Firebase en el proyecto:

```bash
npm run deploy
```

Tambien puedes desplegar por separado:

```bash
npm run deploy:firestore
npm run deploy:functions
```

### Checklist de despliegue productivo

1. Confirmar que `CORS_ORIGIN` apunte al dominio real del frontend.
2. Ejecutar `npm run lint`.
3. Ejecutar `npm run build`.
4. Ejecutar `npm test`.
5. Desplegar `firestore.rules` e indices.
6. Desplegar Functions.
7. Probar `GET /health`.
8. Probar el flujo real de crear usuario, crear tarea, listar, actualizar y eliminar.
9. Revisar logs en Firebase Console o Google Cloud Logging.

## CI con GitHub Actions

El proyecto incluye un workflow en [.github/workflows/ci.yml](/Users/carlostolentino/Projects/AtomChat/backend/.github/workflows/ci.yml) que se ejecuta en cada `pull_request` y en cada `push` hacia cualquier branch.

El pipeline valida:

- `npm ci`
- `npm run lint`
- `npm run build`
- `npm test`

Para convertir esto en una regla real de merge en GitHub, se debe configurar branch protection y marcar el check `Lint, Build and Test` como obligatorio antes de permitir merge sobre las ramas protegidas, por ejemplo `main`, `develop` o cualquier branch principal que decidas proteger.

## Tests incluidos

Se incluyeron pruebas minimas pero solidas sobre:

- creacion de usuario
- busqueda por email
- rechazo de usuarios duplicados
- flujo completo de tareas
- validaciones de entrada

Las pruebas usan repositorios en memoria para verificar contratos HTTP y comportamiento de negocio sin depender del emulador de Firestore.
