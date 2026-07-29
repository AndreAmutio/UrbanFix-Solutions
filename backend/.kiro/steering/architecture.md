# Architecture Context — UrbanFix Backend

> Contexto persistente para Kiro. Combina (a) la estructura de código
> observada literalmente en la documentación técnica (`dayli.pdf`) y
> (b) la convención de arquitectura limpia definida por el equipo para
> este proyecto. Ambas fuentes se distinguen explícitamente abajo.

## 1. Stack tecnológico (fijo, no modificar)

| Categoría        | Tecnología                                   |
|-------------------|-----------------------------------------------|
| Runtime           | Node.js                                       |
| Framework HTTP    | Express.js                                    |
| ORM               | Prisma                                        |
| Base de datos     | PostgreSQL                                    |
| Autenticación     | JWT (`jsonwebtoken`)                          |
| Hashing           | `bcryptjs`                                    |
| Config            | `dotenv`                                      |
| CORS              | `cors`                                        |
| Dev tooling       | `nodemon` (solo desarrollo)                   |
| Deployment        | Railway                                       |
| Frontend (futuro) | React + Vite (fuera del alcance del backend)  |

No se debe introducir un stack distinto salvo solicitud explícita del
equipo.

## 2. Estructura de proyecto observada en la documentación (`dayli.pdf`)

La documentación técnica (guía de implementación semanal) muestra
código ubicado bajo `src/` con esta organización literal:

```
backend/
├── src/
│   ├── index.js                  # punto de entrada, monta middlewares y router principal
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   └── solicitud.controller.js
│   ├── middleware/
│   │   └── auth.middleware.js    # authenticate + authorize(...roles)
│   └── routes/
│       ├── index.js              # router principal, monta /auth, /solicitudes, /admin
│       ├── auth.routes.js
│       ├── solicitud.routes.js
│       └── admin.routes.js
├── prisma/
│   ├── schema.prisma
│   └── seed.js
├── .env.example
└── package.json
```

> La documentación **no muestra explícitamente** carpetas `services/`,
> `validators/`, `errors/`, `utils/` ni `config/`. Los ejemplos de
> código colocan la lógica de negocio directamente en los
> controladores (ej. `auth.controller.js`, `solicitud.controller.js`).

## 3. Convención de arquitectura objetivo (definida por el equipo)

Para mantener el proyecto alineado con buenas prácticas de backend
profesional, el equipo estableció la siguiente separación de
responsabilidades, **extendiendo** (no contradiciendo) la estructura
observada en la documentación:

```
backend/
├── src/
│   ├── routes/        # definición de endpoints, sin lógica de negocio
│   ├── controllers/   # reciben req/res, delegan a services, arman response
│   ├── services/       # lógica de negocio (reglas, validaciones de dominio)
|   ├── repositories/   # acceso a Prisma y base de datos
│   ├── middleware/     # authenticate, authorize, error handler global
│   ├── validators/     # validación de payloads de entrada
│   ├── errors/         # clases de error personalizadas (AppError, etc.)
│   ├── utils/          # helpers genéricos (ej. formateo de respuestas)
│   ├── config/         # configuración (env, cors, etc.)
│   └── index.js
├── prisma/
│   ├── schema.prisma
│   └── seed.js
```

### Responsabilidades de cada capa

- **Routes**
  Definen los endpoints y aplican middlewares.

- **Controllers**
  Reciben la petición HTTP, validan los datos mínimos, llaman al service y construyen la respuesta HTTP.

- **Services**
  Contienen toda la lógica de negocio. No conocen Express ni Prisma directamente. Orquestan el flujo de la aplicación utilizando uno o varios repositories.

- **Repositories**
  Encapsulan el acceso a la base de datos mediante Prisma. Son responsables únicamente de consultar, crear, actualizar o eliminar información. No deben contener reglas de negocio.

- **Validators**
  Validan los datos de entrada.

- **Middleware**
  Autenticación, autorización y middleware globales.

- **Errors**
  Errores personalizados y manejo centralizado de excepciones.

- **Utils**
  Funciones auxiliares reutilizables.

- **Config**
  Configuración de la aplicación.

**Regla de oro para Kiro**

- Los controllers nunca deben acceder directamente a Prisma.
- Los controllers únicamente coordinan la petición y la respuesta HTTP.
- Los services implementan las reglas de negocio.
- Los repositories encapsulan todo el acceso a la base de datos mediante Prisma.
- Si una operación requiere consultar o modificar datos, el service debe hacerlo a través del repository.

> Esta capa adicional (`services`,`repositories`, `validators`, `errors`, `utils`,
> `config`) **no proviene de la documentación funcional del cliente**,
> sino de la convención de ingeniería del equipo para este proyecto.
> Se marca aquí explícitamente para que Kiro no la confunda con un
> requerimiento del documento original.

## 4. Middlewares descritos en la documentación

- **`authenticate`**: valida el header `Authorization: Bearer <token>`,
  verifica el JWT con `process.env.JWT_SECRET`, y adjunta
  `req.user = { userId, role }`. Devuelve `401` si falta el token o es
  inválido/expirado.
- **`authorize(...roles)`**: middleware de orden superior que recibe
  una lista de roles permitidos y devuelve `403` si
  `req.user.role` no está incluido.
- **CORS**: configurado con `origin: process.env.FRONTEND_URL` (con
  fallback a `http://localhost:5173`), métodos
  `GET, POST, PUT, PATCH, DELETE`, headers permitidos
  `Content-Type, Authorization`.

## 5. Convenciones de enrutado

- El router principal (`src/routes/index.js`) monta:
  - `/auth` → `auth.routes.js`
  - `/solicitudes` → `solicitud.routes.js`
  - `/admin` → `admin.routes.js`
- Las rutas de perfil (`/users/me`) aparecen referenciadas en los
  comentarios del código (`// GET /api/users/me`) pero **no se
  documenta explícitamente el archivo de rutas** que las contiene
  (ver Observaciones en `api.md`).
- Las rutas bajo `/admin` aplican `authenticate` + `authorize('ADMIN')`
  a nivel de router (`router.use(...)`), no por endpoint individual.

## 6. Manejo de errores (según documentación)

- Los controladores usan bloques `try/catch` y responden `500` con un
  mensaje genérico en español (`'Error interno del servidor'`) en caso
  de excepción no controlada.
- No se documenta un middleware centralizado de manejo de errores
  (`error-handling middleware` de Express). La convención de equipo
  (capa `errors/`) recomienda centralizarlo, pero esto es una mejora
  de arquitectura, no un requerimiento documentado — debe proponerse
  como mejora antes de implementarse (ver regla de trabajo del
  proyecto).

## 7. Preparación para producción (documentado)

`package.json` scripts esperados:

```json
{
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js",
    "build": "npx prisma generate",
    "seed": "node prisma/seed.js"
  }
}
```

- Debe existir un `.env.example` sin valores reales, documentando las
  variables necesarias (ver `database.md` / variables de entorno).
- Endpoint `GET /health` para verificación de disponibilidad
  (usado también como smoke test post-deploy en Railway).

## 8. Deployment (Railway) — documentado

- Deploy desde GitHub (`Deploy from GitHub`).
- Base de datos PostgreSQL provista como plugin de Railway.
- Variables de entorno en Railway: `DATABASE_URL` (autogenerada),
  `JWT_SECRET` (definida manualmente), `PORT` (gestionada por
  Railway), `NODE_ENV=production`.
- Se recomienda ejecutar el seed en producción para contar con datos
  de prueba.

## 9. Observaciones de arquitectura

1. La documentación no especifica versión de Node.js ni de
   PostgreSQL — dato no disponible, indicarlo explícitamente si se
   requiere en despliegue.
2. No hay mención de tests automatizados (unit/integration) en la
   documentación — no se debe asumir un framework de testing sin
   solicitud explícita.
3. No se documenta rate limiting, logging estructurado, ni
   monitoreo — quedan fuera de alcance salvo que se soliciten.
