# API Context — UrbanFix Backend

> Contexto persistente para Kiro. Extraído de los fragmentos de
> código y comentarios de `dayli.pdf` (guía de implementación
> semanal). Los endpoints reflejan **exactamente** lo mostrado en la
> documentación; donde el código no especifica un detalle (ruta base,
> validaciones adicionales, endpoint faltante), se indica
> explícitamente como "no documentado".

## 1. Convenciones generales

- Prefijo de API implícito: los comentarios de código usan rutas como
  `// GET /api/users/me`, lo que sugiere un prefijo `/api`, pero el
  archivo de arranque (`src/index.js`) mostrado en la documentación
  **no muestra explícitamente** `app.use('/api', router)`. Se asume
  `/api` como prefijo base por convención observada en los
  comentarios, pero debe confirmarse antes de asumirlo como definitivo.
- Formato de respuesta: JSON.
- Autenticación: header `Authorization: Bearer <token>` (JWT).
- Mensajes de error: en español, formato `{ "error": "mensaje" }`.
- Los `select` de Prisma en las respuestas **nunca** incluyen el
  campo `password`.

## 2. Endpoint: Health Check

| Campo   | Valor                        |
|---------|-------------------------------|
| Método  | `GET`                          |
| Ruta    | `/health`                      |
| Permisos| Público                        |
| Response| `{ "status": "ok", "timestamp": <Date> }` |

## 3. Autenticación (`/auth`)

### `POST /auth/register`

| Campo         | Detalle |
|---------------|---------|
| Objetivo      | Registrar un nuevo usuario (`CLIENTE`, `TECNICO` o `ADMIN`). |
| Permisos      | Público |
| Request body  | `{ email, password, name, role, phone? }` |
| Validaciones  | Todos los campos `email`, `password`, `name`, `role` son requeridos (`400` si falta alguno). `password` debe tener al menos 8 caracteres (`400`). `email` no debe estar registrado previamente (`409`). |
| Response 201  | `{ user: { id, email, name, role }, token }` |
| Errores       | `400` campos faltantes / password corta. `409` email duplicado. `500` error interno. |
| Notas         | El `token` es un JWT firmado con `process.env.JWT_SECRET`, payload `{ userId, role }`, expiración `7d`. Password se hashea con `bcrypt.hash(password, 12)`. |

### `POST /auth/login` — **no documentado explícitamente**

> ⚠️ La documentación no incluye el código del controlador de login,
> aunque el flujo de negocio (`product.md`) sí lo requiere para los 3
> roles ("Login → ingresar credenciales, autenticación"). Kiro deberá
> **diseñar este endpoint siguiendo el mismo patrón** que
> `register` (comparar `password` con `bcrypt.compare`, emitir JWT con
> el mismo payload/expiración), pero **no debe implementarse como
> "documentado"** sin dejar constancia de que es una inferencia, no
> una transcripción literal de la fuente.

## 4. Perfil de usuario (`/users`)

Ruta base no confirmada explícitamente (ver nota de prefijo en
sección 1); se documenta bajo comentarios `// GET /api/users/me`.

### `GET /users/me`

| Campo     | Detalle |
|-----------|---------|
| Objetivo  | Obtener el perfil del usuario autenticado. |
| Permisos  | Requiere `authenticate` (cualquier rol autenticado). |
| Response  | `{ id, email, name, role, phone, createdAt }` |

### `PATCH /users/me`

| Campo     | Detalle |
|-----------|---------|
| Objetivo  | Actualizar `name` y/o `phone` del usuario autenticado. |
| Permisos  | Requiere `authenticate`. |
| Request   | `{ name?, phone? }` |
| Response  | `{ id, email, name, role, phone }` |
| Notas     | No se documentan validaciones adicionales sobre estos campos (ej. formato de teléfono). |

## 5. Solicitudes de servicio (`/solicitudes`)

### `POST /solicitudes` (crear)

| Campo     | Detalle |
|-----------|---------|
| Objetivo  | Crear una nueva solicitud de servicio. |
| Permisos  | Solo rol `CLIENTE`. |
| Request   | `{ title, description, category, address }` |
| Validaciones | Todos los campos son requeridos (`400` si falta alguno). |
| Response 201 | Solicitud creada, con `status: PENDIENTE`, `clienteId` tomado de `req.user.userId`, incluye `cliente: { name, phone }`. |
| Errores   | `400` campos faltantes. |

### `GET /solicitudes/mias` (getMias)

| Campo     | Detalle |
|-----------|---------|
| Objetivo  | Listar las solicitudes creadas por el cliente autenticado. |
| Permisos  | Solo rol `CLIENTE` (implícito por filtro `clienteId: req.user.userId`). |
| Response  | Lista de solicitudes propias, incluye `tecnico: { name, phone }`, ordenadas por `createdAt desc`. |

### `GET /solicitudes/disponibles` (getDisponibles)

| Campo     | Detalle |
|-----------|---------|
| Objetivo  | Listar solicitudes disponibles para ser tomadas por un técnico. |
| Permisos  | Rol `TECNICO`. |
| Filtro    | `status: 'PENDIENTE'` **y** `tecnicoId: null`. |
| Response  | Lista de solicitudes, incluye `cliente: { name }`, ordenadas por `createdAt desc`. |

### `GET /solicitudes/:id` (detalle) — **no documentado explícitamente**

> ⚠️ El flujo de negocio menciona "Ver detalles de la solicitud" para
> el `CLIENTE` (`product.md`), pero no hay código de referencia para
> un `GET /solicitudes/:id`. Kiro debe diseñarlo siguiendo el patrón
> de autorización por ownership (el cliente solo puede ver sus
> propias solicitudes; el técnico asignado también podría verla).

### `PATCH /solicitudes/:id/aceptar`

| Campo     | Detalle |
|-----------|---------|
| Objetivo  | El técnico acepta una solicitud pendiente. |
| Permisos  | Solo rol `TECNICO`. |
| Validaciones | `404` si la solicitud no existe. `400` si `status !== 'PENDIENTE'` ("Esta solicitud ya no está disponible"). `400` si `tecnicoId !== null` ("Esta solicitud ya fue tomada por otro técnico"). |
| Efecto    | `status → 'ACEPTADA'`, `tecnicoId → req.user.userId`. |
| Response  | Solicitud actualizada, incluye `cliente: { name, phone, email }` y `tecnico: { name, phone }`. |

### `PATCH /solicitudes/:id/rechazar`

| Campo     | Detalle |
|-----------|---------|
| Objetivo  | El técnico rechaza una solicitud que tiene asignada. |
| Permisos  | Solo rol `TECNICO`, y únicamente si `solicitud.tecnicoId === req.user.userId` (si no, `403` "No podés rechazar esta solicitud"). |
| Request   | `{ motivo }` (recibido en el body; **no se documenta que se persista** en ningún campo del modelo `ServiceRequest` — ver Observaciones). |
| Efecto    | `status → 'RECHAZADA'`, `tecnicoId → null`. |
| Errores   | `403` si la solicitud no existe o no pertenece al técnico autenticado (el código documentado no distingue "no existe" de "no te pertenece" — ambos casos devuelven `403`). |

### `GET /solicitudes/mis-trabajos` — **no documentado explícitamente**

> ⚠️ El flujo de negocio del `TECNICO` incluye "Ver mis trabajos:
> trabajos activos, trabajos completados" (`product.md`), pero no hay
> código de referencia para este endpoint. Kiro debe diseñarlo
> filtrando por `tecnicoId: req.user.userId`, siguiendo el patrón de
> `getMias`.

## 6. Administración (`/admin`)

Todas las rutas bajo `/admin` aplican `authenticate` +
`authorize('ADMIN')` a nivel de router.

### `GET /admin/usuarios`

| Campo     | Detalle |
|-----------|---------|
| Objetivo  | Listar todos los usuarios del sistema. |
| Permisos  | Solo `ADMIN`. |
| Response  | Lista con `{ id, name, email, role, createdAt }` (sin `password`), ordenada por `createdAt desc`. |

### `GET /admin/solicitudes`

| Campo     | Detalle |
|-----------|---------|
| Objetivo  | Listar todas las solicitudes del sistema, con filtro opcional. |
| Permisos  | Solo `ADMIN`. |
| Query param | `status` (opcional) — filtra por estado exacto. |
| Response  | Lista de solicitudes, incluye `cliente: { name, email }` y `tecnico: { name, email }`, ordenadas por `createdAt desc`. |

### `PATCH /admin/solicitudes/:id/estado`

| Campo     | Detalle |
|-----------|---------|
| Objetivo  | Cambiar manualmente el estado de una solicitud (moderación). |
| Permisos  | Solo `ADMIN`. |
| Request   | `{ status }` |
| Validaciones documentadas | **Ninguna** — el código mostrado actualiza directamente sin verificar que `status` sea un valor válido del enum `ServiceStatus` ni que la transición sea coherente (ej. no impide pasar de `PENDIENTE` a `COMPLETADA` directamente). |
| Response  | Solicitud actualizada. |

> ⚠️ Ver Observaciones: este endpoint contradice parcialmente el
> punto de `product.md` que marca "Moderar → Aprobar/Rechazar
> solicitudes" como fuera del MVP (❌).

## 7. Resumen de códigos HTTP usados en la documentación

| Código | Uso documentado |
|--------|-------------------|
| `200`  | Operación exitosa (GET, PATCH sin creación) |
| `201`  | Recurso creado (`register`, crear solicitud) |
| `400`  | Validación fallida / datos faltantes / regla de negocio no cumplida |
| `401`  | Token no proporcionado o inválido/expirado |
| `403`  | Rol no autorizado, u ownership no cumplido |
| `404`  | Recurso no encontrado (solicitud inexistente) |
| `409`  | Conflicto — email ya registrado |
| `500`  | Error interno no controlado |

## 8. Observaciones

1. **Login no documentado**: no existe código de referencia para
   `POST /auth/login` pese a ser parte del flujo de negocio para los
   3 roles. Debe diseñarse por inferencia, dejando constancia de
   ello.
2. **Endpoints de detalle y "mis trabajos" faltantes**: `GET
   /solicitudes/:id` y el listado de trabajos del técnico
   ("trabajos activos/completados") están descritos a nivel de
   producto pero no tienen código de referencia.
3. **`motivo` de rechazo no persistido**: el body de `rechazar`
   recibe `motivo`, pero el modelo `ServiceRequest` no tiene un campo
   para almacenarlo. Confirmar con el equipo si debe agregarse una
   columna o si el dato se descarta intencionalmente.
4. **Falta de validación de transición de estado en
   `PATCH /admin/solicitudes/:id/estado`**: cualquier string llegaría
   a la base de datos si no coincide con el enum de Prisma (Prisma
   rechazaría valores fuera del enum a nivel de tipo, pero no hay
   validación de **transición lógica** entre estados, ej. no impedir
   saltar de `PENDIENTE` a `COMPLETADA`).
5. **Inconsistencia entre `product.md` (Moderar = ❌) y este archivo**:
   el análisis de funcionalidades marca "aprobar/rechazar
   solicitudes" como fuera de alcance, pero `dayli.pdf` sí documenta
   un endpoint de cambio de estado administrado. Se prioriza el
   código de implementación como fuente para `api.md`, pero se marca
   la contradicción para que el equipo decida si ese endpoint debe
   mantenerse en el MVP o posponerse.
6. **Prefijo `/api` no confirmado** a nivel de `src/index.js` — se
   infiere de los comentarios de código.
