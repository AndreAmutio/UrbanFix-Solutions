# Business Rules Context — UrbanFix Backend

> Contexto persistente para Kiro. Reglas de negocio extraídas
> literalmente del código de referencia y las descripciones de
> `dayli.pdf`, `database.pdf` y
> `Análisis_de_funcionalidades_con_la_base_de_datos_actual.pdf`.

## 1. Reglas de autenticación y cuentas

1. El registro requiere `email`, `password`, `name`, `role` (`phone`
   es opcional). Si falta alguno: `400 - "Todos los campos son
   requeridos"`.
2. La contraseña debe tener **mínimo 8 caracteres**; si no, `400 -
   "La contraseña debe tener al menos 8 caracteres"`.
3. El `email` es único a nivel de base de datos (`@unique`). Si ya
   existe: `409 - "El email ya está registrado"`.
4. La contraseña se almacena hasheada con `bcrypt`, **12 salt
   rounds**. Nunca se devuelve en ninguna respuesta de la API.
5. Al registrarse exitosamente, se emite un JWT con payload
   `{ userId, role }`, firmado con `process.env.JWT_SECRET`,
   expiración `7d`.
6. Confirmación de email **no está incluida** en el MVP (marcado ❌
   en el análisis de funcionalidades).
7. Confirmación de identidad para técnicos **no está incluida** en el
   MVP (❌).

## 2. Reglas de autenticación en requests (middleware)

1. Toda ruta protegida requiere header `Authorization: Bearer
   <token>`. Si falta o no tiene el formato correcto: `401 - "Token
   no proporcionado"`.
2. Si el JWT no es válido o expiró: `401 - "Token inválido o
   expirado"`.
3. Si el JWT es válido, se adjunta `req.user = { userId, role }` para
   uso en controladores/servicios.
4. La autorización por rol se aplica con un middleware
   `authorize(...roles)`: si `req.user.role` no está en la lista
   permitida, `403 - "No tenés permiso para acceder a este recurso"`.

## 3. Reglas sobre solicitudes de servicio (`ServiceRequest`)

1. Solo un usuario con rol `CLIENTE` puede **crear** una solicitud.
2. Al crear, son obligatorios: `title`, `description`, `category`,
   `address`. Si falta alguno: `400 - "Todos los campos son
   requeridos"`.
3. Toda solicitud nueva se crea con `status = PENDIENTE` y
   `clienteId` igual al `userId` del token (no se acepta un
   `clienteId` distinto enviado por el cliente).
4. Un `CLIENTE` solo puede ver **sus propias** solicitudes
   (`GET /solicitudes/mias` filtra por `clienteId`).
5. Un `TECNICO` solo puede ver como "disponibles" las solicitudes con
   `status = PENDIENTE` **y** `tecnicoId = null`.
6. **Aceptar una solicitud** (`TECNICO`):
   - La solicitud debe existir (`404` si no).
   - Debe estar en estado `PENDIENTE` (`400 -
     "Esta solicitud ya no está disponible"` si no lo está).
   - No debe tener técnico asignado (`400 - "Esta solicitud ya fue
     tomada por otro técnico"` si `tecnicoId !== null`).
   - Al aceptar: `status → ACEPTADA`, `tecnicoId → userId` del
     técnico autenticado.
7. **Rechazar una solicitud** (`TECNICO`):
   - Solo puede rechazarla el técnico que la tiene asignada
     (`tecnicoId === req.user.userId`); si no, `403 - "No podés
     rechazar esta solicitud"`.
   - Al rechazar: `status → RECHAZADA`, `tecnicoId → null`.
   - El body puede incluir `motivo`, pero **no hay un campo en el
     modelo de datos para persistirlo** (ver Observaciones).
8. Un técnico puede tener **múltiples** trabajos asignados en
   simultáneo (no se documenta un límite de trabajos activos por
   técnico — la relación `trabajosAsignados: ServiceRequest[]` es de
   cardinalidad 1-a-muchos sin restricción adicional).
9. Notificar al cliente cuando el técnico acepta/rechaza **no está
   incluido** en el MVP (❌, requeriría notificaciones, fuera de
   alcance).

## 4. Reglas de administración / moderación

1. Todas las rutas `/admin/*` requieren rol `ADMIN`
   (`authenticate` + `authorize('ADMIN')` aplicado a nivel de router).
2. `GET /admin/usuarios` lista todos los usuarios sin exponer
   `password`.
3. `GET /admin/solicitudes` admite filtro opcional por `status` vía
   query string.
4. `PATCH /admin/solicitudes/:id/estado` permite a un `ADMIN` cambiar
   el `status` de cualquier solicitud **sin validaciones de
   transición documentadas** (ver Observaciones — riesgo de diseño).
5. Bloquear usuarios, resolver disputas y generar reportes están
   marcados como **fuera del MVP** (❌) en el análisis de
   funcionalidades, aun cuando el cambio de estado (parcialmente
   relacionado con "aprobar/rechazar") sí tiene código de referencia.

## 5. Reglas transversales de seguridad y datos

1. Nunca se debe exponer el campo `password` en ninguna respuesta
   (todos los `select`/`include` documentados lo excluyen
   explícitamente).
2. Todos los mensajes de error deben ser claros y estar en español,
   consistente con lo documentado.
3. Todas las rutas deben manejar errores no controlados con
   `try/catch` y responder `500` con mensaje genérico.
4. CORS debe restringirse al origen del frontend
   (`process.env.FRONTEND_URL`, fallback `http://localhost:5173`).

## 6. Funcionalidades explícitamente fuera del MVP (❌ en la documentación)

Agrupadas por tema, tal como constan en
`Análisis_de_funcionalidades_con_la_base_de_datos_actual.pdf`:

- Confirmar email (registro de cliente).
- Adjuntar documentos (crear solicitud).
- Seguimiento en tiempo real, historial de cambios, notificaciones
  (ver estado de solicitud — cliente).
- Confirmar identidad (registro de técnico).
- Notificar al cliente (al aceptar/rechazar).
- Calificaciones y comentarios (trabajos del técnico).
- Analizar contenido (revisión de solicitudes por admin).
- Aprobar/rechazar solicitudes, bloquear usuarios, resolver disputas,
  generar reportes (moderación por admin) — **con la salvedad de la
  inconsistencia señalada en la sección de Observaciones**.

A nivel de negocio, además quedan fuera del MVP (según `dayli.pdf`):
pagos integrados, sistema de reputación/reseñas, app móvil nativa,
chat en tiempo real, notificaciones push, geolocalización avanzada.

## 7. Mejoras futuras identificadas durante este análisis

> Estas mejoras **no deben implementarse** sin aprobación explícita
> del equipo; se documentan únicamente como registro de scope
> creep potencial, siguiendo la política del proyecto ("si se te
> ocurre una feature extra, anótala como mejora futura pero no la
> implementes").

- Endpoint dedicado de `login` con especificación formal (actualmente
  inferido, no documentado).
- Endpoint de detalle de solicitud (`GET /solicitudes/:id`).
- Endpoint de "mis trabajos" para el técnico
  (`GET /solicitudes/mis-trabajos` o similar).
- Persistencia del campo `motivo` en el rechazo de una solicitud.
- Validación de transición de estados en el cambio manual de estado
  por parte del `ADMIN` (evitar saltos de estado inconsistentes).
- Mecanismo para que una solicitud rechazada pueda volver a estar
  disponible para otros técnicos (actualmente queda "atascada" en
  `RECHAZADA`, ver Observaciones).
- Middleware centralizado de manejo de errores (actualmente manejado
  por `try/catch` repetido en cada controlador).
- Enum cerrado de categorías de servicio (actualmente `String` libre).

## 8. Observaciones (inconsistencias detectadas)

1. **Moderación — contradicción entre documentos**: el análisis de
   funcionalidades marca "Aprobar/Rechazar solicitudes" (dentro de
   "Moderar") como ❌ fuera del MVP, pero `dayli.pdf` sí documenta e
   implementa `PATCH /admin/solicitudes/:id/estado`, que permite a un
   `ADMIN` cambiar el estado de una solicitud — funcionalmente
   equivalente a una forma de moderación. **Se necesita definición
   del equipo** sobre si este endpoint se mantiene en el MVP o se
   pospone, antes de que Kiro continúe extendiéndolo.
2. **Solicitud rechazada no vuelve al pool de disponibles**: dado que
   `getDisponibles` filtra por `status: PENDIENTE`, y `rechazar` deja
   la solicitud en `status: RECHAZADA` (no la regresa a
   `PENDIENTE`), el flujo documentado no permite que otro técnico
   tome una solicitud ya rechazada por alguien más. Esto puede ser
   intencional (la solicitud rechazada requiere revisión manual del
   `ADMIN`) o un defecto de diseño — no documentado explícitamente
   cuál de las dos. Se marca como riesgo, no se corrige sin
   aprobación.
3. **Estados sin flujo definido**: `EN_PROGRESO` y `COMPLETADA`
   existen en el enum `ServiceStatus` pero ningún endpoint
   documentado transiciona una solicitud a esos valores. Solo el
   `ADMIN`, vía `PATCH /admin/solicitudes/:id/estado`, podría
   asignarlos manualmente (sin validación). No se documenta si el
   `TECNICO` debería tener un endpoint propio para marcar
   "en progreso" o "completado" — dato no disponible en la
   documentación.
4. **Rol y ownership de `ServiceRequest`**: no se documenta una
   validación que impida asignar un usuario con rol `CLIENTE` como
   `tecnicoId`, o viceversa. Debe considerarse como regla de
   integridad a nivel de servicio si el equipo lo requiere.
5. **`motivo` de rechazo**: se recibe en el request pero no existe
   campo en el modelo de datos para persistirlo — confirmar con el
   equipo antes de descartarlo o agregar la columna correspondiente.
