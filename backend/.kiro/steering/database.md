# Database Context — UrbanFix Backend

> Contexto persistente para Kiro. Extraído de `database.pdf` (modelo
> de datos formal) y contrastado con el boceto de `schema.prisma`
> incluido en `dayli.pdf` (Semana 1). Motor: PostgreSQL + Prisma ORM.

## 1. Enums

### `UserRole`

| Valor      |
|------------|
| `CLIENTE`  |
| `TECNICO`  |
| `ADMIN`    |

### `ServiceStatus`

| Valor          |
|----------------|
| `PENDIENTE`    |
| `ACEPTADA`     |
| `EN_PROGRESO`  |
| `COMPLETADA`   |
| `RECHAZADA`    |
| `CANCELADA`    |

> ⚠️ Ver Observaciones: los estados `EN_PROGRESO`, `COMPLETADA` y
> `CANCELADA` existen en el enum pero **no tienen un endpoint
> documentado** que realice la transición hacia ellos (ver
> `api.md` y `business-rules.md`).

## 2. Entidad: `User`

| Campo       | Tipo       | Restricciones          | Descripción                  |
|-------------|------------|------------------------|-------------------------------|
| `id`        | `Int`      | PK, autoincrement       | Identificador del usuario     |
| `email`     | `String`   | `UNIQUE`, `NOT NULL`    | Correo electrónico            |
| `password`  | `String`   | `NOT NULL`              | Contraseña **encriptada** (bcrypt) |
| `name`      | `String`   | `NOT NULL`              | Nombre del usuario             |
| `role`      | `UserRole` | `NOT NULL`              | Rol del usuario                |
| `phone`     | `String`   | `NULL` (opcional)       | Teléfono                       |
| `createdAt` | `DateTime` | `DEFAULT now()`         | Fecha de creación               |

### Relaciones de `User`

- Un `CLIENTE` puede crear **muchas** solicitudes
  (`ServiceRequest[]`, relación `"ClienteSolicitudes"`).
- Un `TECNICO` puede tener **muchos** trabajos asignados
  (`ServiceRequest[]`, relación `"TecnicoTrabajo"`).
- No se documenta una restricción a nivel de base de datos que impida
  que un usuario con rol `CLIENTE` sea asignado como `tecnicoId` de una
  solicitud (o viceversa); esa validación, si se requiere, debe
  aplicarse en la capa de servicio (ver `business-rules.md`,
  Observaciones).

## 3. Entidad: `ServiceRequest`

| Campo         | Tipo             | Restricciones                          | Descripción                                  |
|---------------|------------------|-----------------------------------------|------------------------------------------------|
| `id`          | `Int`            | PK, autoincrement                       | Identificador de la solicitud                  |
| `title`       | `String`         | `NOT NULL`                              | Título del servicio                            |
| `description` | `String`         | `NOT NULL`                              | Descripción del problema                       |
| `category`    | `String`         | `NOT NULL`                              | Categoría del servicio                         |
| `status`      | `ServiceStatus`  | `DEFAULT PENDIENTE`                     | Estado de la solicitud                         |
| `address`     | `String`         | `NOT NULL`                              | Dirección donde se realizará el trabajo        |
| `createdAt`   | `DateTime`       | `DEFAULT now()`                         | Fecha de creación                              |
| `updatedAt`   | `DateTime`       | `@updatedAt`                            | Última modificación                            |
| `clienteId`   | `Int`            | FK → `User(id)`, `NOT NULL`             | Cliente que creó la solicitud                  |
| `tecnicoId`   | `Int`            | FK → `User(id)`, `NULL`                 | Técnico asignado (opcional)                    |

> Nota: `category` está tipado como `String` libre en la
> documentación; **no se documenta un enum cerrado de categorías**
> (ej. electricidad, plomería, gas, informática son solo ejemplos
> mencionados en el contexto de negocio, no una lista cerrada de
> valores validados). No inventar un enum de categorías sin
> confirmación del equipo.

### Relaciones de `ServiceRequest`

- Cada solicitud pertenece a **un** cliente (`cliente: User`,
  relación `"ClienteSolicitudes"`, FK `clienteId`).
- Una solicitud puede tener **cero o un** técnico asignado
  (`tecnico: User?`, relación `"TecnicoTrabajo"`, FK `tecnicoId`
  nullable).

## 4. Boceto de `schema.prisma` (referencia literal de la documentación)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum UserRole {
  CLIENTE
  TECNICO
  ADMIN
}

enum ServiceStatus {
  PENDIENTE
  ACEPTADA
  EN_PROGRESO
  COMPLETADA
  RECHAZADA
  CANCELADA
}

model User {
  id                Int              @id @default(autoincrement())
  email             String           @unique
  password          String
  name              String
  role              UserRole
  phone             String?
  createdAt         DateTime         @default(now())
  solicitudes       ServiceRequest[] @relation("ClienteSolicitudes")
  trabajosAsignados ServiceRequest[] @relation("TecnicoTrabajo")
}

model ServiceRequest {
  id          Int           @id @default(autoincrement())
  title       String
  description String
  category    String
  status      ServiceStatus @default(PENDIENTE)
  address     String
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
  clienteId   Int
  cliente     User          @relation("ClienteSolicitudes", fields: [clienteId], references: [id])
  tecnicoId   Int?
  tecnico     User?         @relation("TecnicoTrabajo", fields: [tecnicoId], references: [id])
}
```

> Este schema está marcado en la documentación como un **boceto de
> Semana 1**, a "refinar" en Semana 3. No hay una versión posterior
> del schema en la documentación — este es el único modelo de datos
> disponible y debe tratarse como la fuente de verdad actual.

## 5. Índices

No se documentan índices explícitos más allá de la restricción
`UNIQUE` sobre `User.email` (que Prisma/PostgreSQL indexan
automáticamente) y las claves foráneas (`clienteId`, `tecnicoId`), que
también suelen indexarse por defecto según el motor. **No se
documentan índices adicionales** (ej. sobre `status` o `category`)
— si se requieren por performance, deben proponerse como mejora y
justificarse antes de implementarse.

## 6. Variables de entorno relacionadas a base de datos

| Variable       | Descripción                                                        |
|----------------|----------------------------------------------------------------------|
| `DATABASE_URL` | Cadena de conexión a PostgreSQL. En Railway se autocompleta al agregar el plugin de PostgreSQL. Local: `postgresql://postgres:secret@localhost:5432/urbanfix_dev` (valor de ejemplo, no real). |

## 7. Seed de datos de prueba (documentado)

El script `prisma/seed.js` crea 3 usuarios de prueba mediante
`prisma.user.createMany` con `skipDuplicates: true`:

| email                  | rol       | password (plano, solo seed) | phone         |
|------------------------|-----------|-------------------------------|----------------|
| `admin@urbanfix.com`   | `ADMIN`   | `password123`                 | —              |
| `cliente@test.com`     | `CLIENTE` | `password123`                 | `1112345678`   |
| `tecnico@test.com`     | `TECNICO` | `password123`                 | `1187654321`   |

La contraseña se hashea con `bcrypt.hash(password, 12)` antes de
insertarse. Comando: `npm run seed` → `node prisma/seed.js`.

## 8. Observaciones

1. **Estados sin transición documentada**: el enum `ServiceStatus`
   incluye `EN_PROGRESO`, `COMPLETADA` y `CANCELADA`, pero ningún
   endpoint documentado en `dayli.pdf` transiciona una solicitud hacia
   esos estados (solo se documentan las transiciones `PENDIENTE →
   ACEPTADA` y `ACEPTADA/PENDIENTE → RECHAZADA`, más el cambio manual
   y sin validación de estado vía `PATCH /admin/solicitudes/:id/estado`).
   Kiro no debe inventar dichos endpoints sin validación previa del
   equipo; deben marcarse como pendientes de definición.
2. **Rechazo no libera la solicitud al pool de disponibles**: al
   rechazar, `status` pasa a `RECHAZADA` (no vuelve a `PENDIENTE`), y
   `getDisponibles` solo filtra por `status: PENDIENTE`. Esto implica
   que, tal como está documentado, **una solicitud rechazada no puede
   ser tomada por otro técnico** en el flujo actual. Se marca como
   riesgo de diseño en `business-rules.md`, no se corrige aquí sin
   aprobación.
3. **Categoría sin enum**: `category` es `String` libre; no hay lista
   cerrada de categorías documentada.
4. No se documenta versión mínima de PostgreSQL ni configuración de
   pooling de conexiones (ej. PgBouncer) — dato no disponible.
