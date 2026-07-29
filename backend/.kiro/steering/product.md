# Product Context — UrbanFix Solutions (Backend)

> Contexto persistente para Kiro. Basado únicamente en la documentación
> del proyecto (`dayli.pdf`, `Análisis_de_funcionalidades_con_la_base_de_datos_actual.pdf`,
> `database.pdf`). No se han inventado funcionalidades no documentadas.

## 1. Descripción del negocio

UrbanFix Solutions es una plataforma web que conecta a personas que
necesitan **servicios técnicos a domicilio** (electricidad, plomería,
gas, informática) con **técnicos independientes**.

### Problema que resuelve

- Dificultad para encontrar técnicos confiables.
- Procesos informales de contacto (WhatsApp, boca en boca).
- Falta de seguimiento del estado de los trabajos.

### Referentes de mercado mencionados en la documentación

TaskRabbit, Workana, Thumbtack (mencionados solo como contexto
comparativo, no como fuente de requerimientos funcionales).

## 2. Roles de usuario

La documentación define 3 roles (enum `UserRole` en la base de datos):

| Rol       | Descripción funcional                                             |
|-----------|---------------------------------------------------------------------|
| `CLIENTE` | Usuario que **solicita** un servicio técnico.                      |
| `TECNICO` | Usuario **proveedor/trabajador** que acepta o rechaza solicitudes.  |
| `ADMIN`   | Moderador/administrador con panel de administración básico.        |

## 3. Alcance del MVP (según documentación)

### ✅ Incluido en el MVP

- Registro y login (3 roles).
- Creación de solicitudes de servicio.
- Ver y gestionar solicitudes.
- El técnico puede aceptar/rechazar trabajos.
- Panel de administración básico.
- Plataforma web responsive (frontend, fuera del alcance de este backend).

### ❌ Explícitamente fuera del MVP

- Pagos integrados.
- Sistema de reputación / reseñas.
- App móvil nativa.
- Chat en tiempo real.
- Notificaciones push.
- Geolocalización avanzada.

> Regla de negocio explícita del documento: **mantener el alcance
> definido es una prioridad**. Cualquier feature adicional debe
> registrarse como "mejora futura" y **no implementarse** durante el
> desarrollo del MVP. Ver `business-rules.md` sección "Mejoras
> Futuras" para el detalle agregado durante este análisis.

## 4. Flujos de usuario documentados (nivel funcional)

La documentación (`Análisis_de_funcionalidades...pdf`) detalla, por
cada rol, qué sub-funcionalidades están incluidas (✅) y cuáles no
(❌) dentro del MVP. El detalle completo de reglas por endpoint está
en `business-rules.md`; a nivel de flujo:

### Flujo Cliente (Solicitante)

1. **Registro** → crear cuenta, validar datos (✅). Confirmar email (❌, fuera de MVP).
2. **Login** → ingresar credenciales, autenticación (✅).
3. **Crear solicitud** → llenar formulario (✅). Adjuntar documentos (❌, fuera de MVP).
4. **Ver solicitud** → listar mis solicitudes, ver detalles (✅).
5. **Ver estado** → seguimiento en tiempo real, historial de cambios,
   notificaciones — **todo fuera del MVP** (❌).

### Flujo Técnico (Proveedor/Trabajador)

1. **Registro** → crear cuenta profesional, validar credenciales
   (✅). Confirmar identidad (❌, fuera de MVP).
2. **Login** → ingresar credenciales, autenticación (✅).
3. **Ver solicitudes** → filtrar por categoría, buscar oportunidades,
   listar disponibles (✅).
4. **Aceptar/Rechazar** → revisar detalles, tomar decisión (✅).
   Notificar al cliente (❌, fuera de MVP).
5. **Ver mis trabajos** → trabajos activos, trabajos completados
   (✅). Calificaciones y comentarios (❌, fuera de MVP).

### Flujo Moderador/Administrador

1. **Login** → ingresar credenciales, autenticación (✅).
2. **Ver usuarios** → listar todos, filtrar por rol, buscar usuario
   específico (✅).
3. **Ver solicitudes** → revisar todas, filtrar por estado (✅).
   Analizar contenido (❌, fuera de MVP).
4. **Moderar** → aprobar/rechazar solicitudes, bloquear usuarios,
   resolver disputas, generar reportes — **todo marcado como fuera
   del MVP (❌)**.

> ⚠️ Ver sección **Observaciones** en `business-rules.md`: existe una
> inconsistencia entre este punto 4 (Moderar = ❌ completo) y el
> código de referencia de `dayli.pdf`, que sí implementa un endpoint
> de cambio de estado de solicitud por parte del ADMIN.

## 5. Fuera de alcance de este documento

- Frontend (React + Vite): mencionado en la documentación solo como
  fase posterior, no descrito en detalle funcional.
- Detalles de UI/UX: no documentados.
- Cronograma semanal (Semana 1 a 8): existe en `dayli.pdf` como guía
  de aprendizaje/implementación, no como requerimiento de producto.
  No se traslada a este archivo por no ser información de producto.
