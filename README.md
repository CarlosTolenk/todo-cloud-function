# AtomChat Backend

Backend de prueba tecnica para una aplicacion de gestion de tareas. La solucion expone una API REST construida con Express, TypeScript estricto, Firebase Functions y Firestore, con foco en claridad arquitectonica, contratos consistentes y facilidad de evaluacion tecnica.

## Objetivo

Este proyecto resuelve el backend de una aplicacion sencilla de usuarios y tareas con un alcance deliberadamente acotado:

- crear usuarios
- buscar usuarios por email
- crear tareas
- listar tareas por usuario
- actualizar tareas
- eliminar tareas

La prioridad no fue agregar complejidad, sino entregar una base mantenible, testeable y defendible en entrevista.

## Principios de la solucion

- TypeScript estricto en toda la base de codigo
- separacion pragmatica por capas: `domain`, `application`, `infrastructure`, `presentation`
- contratos HTTP consistentes para casos exitosos y errores
- validacion explicita de entradas con Zod
- acceso a Firestore encapsulado tras repositorios
- bootstrap simple sin sobreingenieria ni frameworks de IoC
- logging estructurado orientado a entornos serverless

## Stack Tecnico

- Node.js 22
- Express 4
- TypeScript 5
- Firebase Functions v2
- Firestore
- Zod
- Vitest

## Arquitectura

```text
src/
  app/
    app-container.ts
    create-app.ts
  config/
    env.ts
    firebase.ts
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
  shared/
    errors/
    http/
    logging/
    types/
    validation/
  index.ts
  server.ts
tests/
```

### Rol de cada capa

- `domain`: entidades, contratos y errores de negocio
- `application`: casos de uso y orquestacion
- `infrastructure`: implementaciones concretas de persistencia
- `presentation`: rutas, controladores y validacion HTTP
- `shared`: piezas transversales reutilizables

### Decision arquitectonica clave

En lugar de usar una libreria de inyeccion de dependencias, la composicion se centraliza en [`src/app/app-container.ts`](/Users/carlostolentino/Projects/AtomChat/backend/src/app/app-container.ts). Para una prueba tecnica, este enfoque reduce complejidad accidental y mantiene explicita la forma en que se construye la aplicacion.

## Modelo de Dominio

### Usuario

```ts
interface User {
  id: string;
  email: string;
  createdAt: string;
}
```

### Tarea

```ts
interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}
```

## Contrato HTTP

### Respuesta exitosa

```json
{
  "success": true,
  "data": {}
}
```

### Respuesta de error

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": {}
  }
}
```

Este contrato se mantiene uniforme en todos los endpoints para simplificar el consumo desde frontend.

## API

### `GET /health`

Health check del servicio.

Respuesta:

```json
{
  "success": true,
  "data": {
    "status": "ok"
  }
}
```

### `GET /users/by-email/:email`

Busca un usuario por email.

Ejemplo:

```http
GET /users/by-email/jane@example.com
```

### `POST /users`

Crea un usuario.

Body:

```json
{
  "email": "jane@example.com"
}
```

Posibles errores:

- `400 VALIDATION_ERROR`
- `409 USER_ALREADY_EXISTS`

### `GET /tasks?userId=:userId`

Lista las tareas de un usuario.

Ejemplo:

```http
GET /tasks?userId=user_123
```

### `POST /tasks`

Crea una tarea.

Body:

```json
{
  "userId": "user_123",
  "title": "Preparar demo",
  "description": "Dejar lista la presentacion tecnica"
}
```

Restricciones:

- `title`: 1 a 120 caracteres
- `description`: 1 a 500 caracteres

### `PATCH /tasks/:id`

Actualiza una tarea existente.

Body:

```json
{
  "title": "Preparar demo final",
  "description": "Agregar casos de error y decisiones tecnicas",
  "completed": true
}
```

Regla:

- debe llegar al menos un campo para actualizar

Posibles errores:

- `400 VALIDATION_ERROR`
- `404 TASK_NOT_FOUND`

### `DELETE /tasks/:id`

Elimina una tarea y retorna el `id` eliminado.

Respuesta:

```json
{
  "success": true,
  "data": {
    "id": "task_123"
  }
}
```

## Validacion y Manejo de Errores

La validacion de entrada se realiza en la capa `presentation` con Zod antes de ejecutar casos de uso. Los errores de dominio se modelan como excepciones tipadas y se traducen a respuestas HTTP consistentes desde el middleware global.

Casos contemplados:

- request invalido
- recurso no encontrado
- conflictos de negocio
- rutas inexistentes
- errores inesperados

Esto evita mezclar reglas de negocio con decisiones HTTP y hace la API mas predecible.

## Logging y Observabilidad

El servicio genera logs estructurados en JSON, utiles tanto en desarrollo como en Firebase / Cloud Logging.

Se registran:

- inicio y fin de request
- `requestId`
- metodo HTTP y path
- status code
- duracion
- errores de validacion
- errores controlados
- errores no controlados

La verbosidad se controla con `LOG_LEVEL`.

## Ejecucion Local

### Requisitos

- Node.js 22
- npm
- Firebase CLI si se desea usar emuladores o despliegue

### 1. Instalar dependencias

```bash
npm install
```

### 2. Crear archivo `.env`

Ejemplo minimo:

```env
NODE_ENV=development
PORT=3000
CORS_ORIGIN=*
LOG_LEVEL=info
```

Si se necesita inicializar Firebase Admin con una cuenta de servicio fuera del entorno gestionado, se puede definir:

```env
FIREBASE_SERVICE_ACCOUNT_KEY={"project_id":"...","client_email":"...","private_key":"..."}
```

### 3. Levantar servidor local

```bash
npm run dev
```

La API queda disponible en:

```text
http://localhost:3000
```

### 4. Ejecutar emuladores de Firebase

```bash
npm run serve
```

Este flujo compila primero el proyecto y luego inicia emuladores de Functions y Firestore.

## Scripts Disponibles

```bash
npm run dev
npm run build
npm run lint
npm run test
npm run test:watch
npm run serve
npm run deploy
```

## Testing y Calidad

La suite de pruebas cubre:

- casos de uso
- controladores HTTP
- validaciones de schemas
- repositorios
- middlewares compartidos
- logging
- composicion de la aplicacion

Validacion recomendada antes de presentar o desplegar:

```bash
npm run lint
npm run build
npm run test
```

## Firestore

La configuracion de Firestore esta versionada en el repositorio:

- reglas: [firestore.rules](/Users/carlostolentino/Projects/AtomChat/backend/firestore.rules)
- indices: [firestore.indexes.json](/Users/carlostolentino/Projects/AtomChat/backend/firestore.indexes.json)

La intencion de esta solucion es que los clientes consuman el backend y no Firestore directamente. Por eso el acceso de datos vive detras de la API y de los repositorios.

## Despliegue

La entrada para Firebase Functions es [`src/index.ts`](/Users/carlostolentino/Projects/AtomChat/backend/src/index.ts), donde se expone la funcion HTTP `api`.

Comandos principales:

```bash
npm run deploy
npm run deploy:functions
npm run deploy:firestore
```

En entornos de Firebase Functions no es necesario definir `FIREBASE_SERVICE_ACCOUNT_KEY` si se usan las credenciales administradas por la plataforma.

## Decisiones Tecnicas y Tradeoffs

- Se uso Express sobre un framework mas grande para mantener bajo el costo cognitivo.
- Se separaron modulos por feature (`users`, `tasks`) para facilitar escalabilidad sin romper cohesion.
- Se encapsulo Firestore con interfaces para poder testear la logica de negocio sin depender de la base real.
- Se eligio Zod para validar borde de entrada y producir errores consistentes con poco codigo.
- No se agrego autenticacion porque no forma parte del alcance actual del reto.
- No se introdujo paginacion porque el caso de uso actual no la exige; seria una extension natural si creciera el volumen.

## Posibles Mejoras Futuras

- autenticacion y autorizacion
- paginacion y filtros de tareas
- documentacion OpenAPI / Swagger
- CI/CD visible en el repositorio
- metricas y tracing
- separacion de entornos mas detallada

## Estado del Proyecto

La solucion actual esta lista para evaluacion tecnica como backend base de una app de tareas:

- arquitectura simple y explicable
- contratos claros
- errores controlados
- pruebas automatizadas
- despliegue compatible con Firebase
