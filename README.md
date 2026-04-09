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

## Deploy

Una vez configurado Firebase en el proyecto:

```bash
firebase deploy --only functions
```

## Tests incluidos

Se incluyeron pruebas minimas pero solidas sobre:

- creacion de usuario
- busqueda por email
- rechazo de usuarios duplicados
- flujo completo de tareas
- validaciones de entrada

Las pruebas usan repositorios en memoria para verificar contratos HTTP y comportamiento de negocio sin depender del emulador de Firestore.
