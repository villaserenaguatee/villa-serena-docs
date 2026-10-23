# Matriz de Permisos y Control de Acceso

> Reconciliación 22/10/2026: [decisiones posteriores, estado implementado y límites del contrato](reconciliacion-frontend-20261022.md). Los estados «Pendiente» anteriores no certifican implementación; portal web y Android coexisten. No se reintroducen campos retirados del MVP.

Especifica los permisos detallados de lectura, creación, modificación y anulación por rol para cada uno de los módulos del sistema.

---

## Índice

1. [Propósito y leyenda](#1-propósito-y-leyenda)
2. [Decisiones de diseño](#2-decisiones-de-diseño)
3. [Matriz por módulo](#3-matriz-por-módulo)
4. [Notas de la matriz](#4-notas-de-la-matriz)
5. [Actores que no son usuarios](#5-actores-que-no-son-usuarios)
6. [Reglas de visibilidad de datos](#6-reglas-de-visibilidad-de-datos)
7. [Guía de implementación](#7-guía-de-implementación)

---

## 1. Propósito y leyenda

Define **qué acción exacta puede hacer cada rol**. Es la referencia para:

- **Backend y seguridad:** roles en el JWT, `@PreAuthorize` y verificación de a quién pertenece cada registro.
- **Backend:** autorización en cada operación.
- **Frontend web y móvil:** qué menús, pantallas y botones ve cada rol.
- **Quien verifica el flujo:** pruebas de autorización (cada "—" es una petición que debe rechazarse).

| Símbolo | Significado |
|---|---|
| ✅ | Permitido |
| 👤 | Permitido solo sobre sus propios registros |
| 👁 | Solo consulta |
| ⚠️ | Permitido con condición (ver la nota numerada) |
| — | No permitido |

**Columnas:** `PÚBLICO` (sin sesión) · `ADMIN` · `RECEPCION` · `ROOM_SERVICE` · `MYL` (= `MANTENIMIENTO_LIMPIEZA`) · `HUESPED` (app). Lo que está permitido en `PÚBLICO` lo puede hacer cualquier persona en la web pública.

**Condiciones:** la matriz solo muestra las condiciones que limitan el permiso (notas numeradas). Las condiciones de estado completas de cada acción (por ejemplo, que el check-in exige una reserva `CONFIRMADA`) están en el documento 07.

---

## 2. Decisiones de diseño

| # | Decisión | Origen |
|---|---|---|
| P-01 | **Cada rol usa solo sus pantallas.** El Administrador **no** tiene permisos de Recepción, de Room Service ni de piso; solo los suyos y el canal simulado. | R-ROL-08 (documento 02) |
| P-02 | Recepción **consulta** (solo lectura) la incidencia que bloquea una habitación `FUERA_DE_SERVICIO`. | HU-REC-10 |
| P-03 | El huésped **no modifica ni cancela** reservas ni pedidos. Solo cancela sus solicitudes `PENDIENTE`. | HU-HUE-05, HU-HUE-11, HU-HUE-14 |
| P-04 | Los permisos se aplican en el **backend (Spring Security)**; la interfaz solo oculta lo que el usuario no puede hacer. | HU-EMP-01 |

---

## 3. Matriz por módulo

### 3.1 Web pública y reservas

| Acción | PÚBLICO | ADMIN | RECEPCION | ROOM_SERVICE | MYL | HUESPED | HU |
|---|---|---|---|---|---|---|---|
| Ver la información del hotel y el catálogo de habitaciones (tipos activos y ofertas comerciales) | ✅ | — | — | — | — | — | HU-HUE-01, HU-HUE-02 |
| Buscar disponibilidad y ver el precio (por tipo o por oferta comercial) | ✅ | — | ✅ | — | — | — | HU-HUE-03, HU-HUE-04, HU-REC-03 |
| Crear una reserva | ✅ ¹ | — | ✅ | — | — | — | HU-HUE-05, HU-REC-04 |
| Pagar la reserva con Recurrente | ✅ | — | — | — | — | — | HU-HUE-06 |
| Registrar al huésped principal y a los adicionales | — | — | ✅ | — | — | — | HU-REC-01, HU-REC-02 |
| Buscar reservas y ver el detalle (con el historial de estados) | — | — | ✅ | — | — | — | HU-REC-06 |
| Ver mis reservas y el detalle de mi estadía | — | — | — | — | — | 👤 | HU-HUE-09 |
| Cancelar una reserva | — | — | ⚠️ ² | — | — | — | HU-REC-05 |
| Asignar o cambiar la habitación | — | — | ⚠️ ³ | — | — | — | HU-REC-07 |
| Ver el calendario Gantt | — | — | ✅ | — | — | — | HU-REC-08 |
| *Nivel 2:* crear una reserva seleccionando días en el Gantt | — | — | ✅ | — | — | — | HU-REC-09 |
| Check-in | — | — | ✅ | — | — | — | HU-REC-12 |
| Ver el canal de origen | — | — | ✅ | — | — | — | HU-CM-02 |

### 3.2 Cuenta, pagos y factura

| Acción | PÚBLICO | ADMIN | RECEPCION | ROOM_SERVICE | MYL | HUESPED | HU |
|---|---|---|---|---|---|---|---|
| Ver la cuenta (cargos, pagos y saldo) | — | — | ✅ | — | — | 👤 | HU-REC-13, HU-HUE-15 |
| Agregar cargos de servicio | — | — | ⚠️ ⁴ | — | — | — | HU-REC-13 |
| Anular cargos (no el de alojamiento) | — | — | ⚠️ ¹⁴ | — | — | — | HU-REC-13 |
| Pagar el saldo con Recurrente | — | — | — | — | — | 👤 ⁵ | HU-HUE-16 |
| Check-out (incluye el pago único y la emisión de la factura) | — | — | ✅ | — | — | 👤 ⁵ | HU-REC-14, HU-REC-15, HU-HUE-16 |
| Imprimir la factura | — | — | ✅ | — | — | — | HU-REC-16 |
| Ver la factura (PDF) | — | — | ✅ | — | — | 👤 | HU-REC-15, HU-HUE-16 |

### 3.3 Habitaciones y limpieza

| Acción | PÚBLICO | ADMIN | RECEPCION | ROOM_SERVICE | MYL | HUESPED | HU |
|---|---|---|---|---|---|---|---|
| Ver el estado de las habitaciones (con indicadores) | — | — | ✅ | — | — | — | HU-REC-10 |
| Ver la incidencia que bloquea una habitación | — | — | 👁 ⁶ | — | — | — | HU-REC-10 |
| Marcar una habitación como `SUCIA` | — | — | ⚠️ ⁷ | — | — | — | HU-REC-11 |
| Ver las habitaciones pendientes de limpieza | — | — | — | — | ⚠️ ⁸ | — | HU-MYL-01 |
| Iniciar la limpieza | — | — | — | — | ⚠️ ⁸ | — | HU-MYL-02 |
| Interrumpir o terminar la limpieza | — | — | — | — | ⚠️ ⁸ ⁹ | — | HU-MYL-02, HU-MYL-03 |

### 3.4 Room Service

| Acción | PÚBLICO | ADMIN | RECEPCION | ROOM_SERVICE | MYL | HUESPED | HU |
|---|---|---|---|---|---|---|---|
| Ver el menú | — | ✅ | — | ✅ | — | ⚠️ ⁴ | HU-ADM-05, HU-RS-05, HU-HUE-10 |
| Crear un pedido | — | — | — | — | — | 👤 ⁴ | HU-HUE-10 |
| Seguir mis pedidos | — | — | — | — | — | 👤 | HU-HUE-11 |
| Ver la cola y el detalle de los pedidos | — | — | — | ⚠️ ¹⁰ | — | — | HU-RS-01, HU-RS-02 |
| Avanzar el estado de un pedido | — | — | — | ✅ | — | — | HU-RS-03 |
| Cancelar un pedido | — | — | — | ✅ | — | — | HU-RS-04 |
| Marcar un ítem como agotado | — | — | — | ✅ | — | — | HU-RS-05 |
| Reactivar un ítem agotado | — | ✅ | — | — | — | — | HU-ADM-05 |

### 3.5 Solicitudes del huésped

| Acción | PÚBLICO | ADMIN | RECEPCION | ROOM_SERVICE | MYL | HUESPED | HU |
|---|---|---|---|---|---|---|---|
| Crear una solicitud (limpieza o artículos) | — | — | — | — | — | 👤 ⁴ | HU-HUE-12, HU-HUE-13 |
| Ver mis solicitudes | — | — | — | — | — | 👤 | HU-HUE-14 |
| Cancelar una solicitud `PENDIENTE` | — | — | — | — | — | 👤 | HU-HUE-14 |
| Ver y tomar solicitudes | — | — | — | — | ⚠️ ⁸ ¹¹ | — | HU-MYL-04 |
| Marcar una solicitud como atendida | — | — | — | — | ⚠️ ⁸ ⁹ | — | HU-MYL-05 |

### 3.6 Mantenimiento

| Acción | PÚBLICO | ADMIN | RECEPCION | ROOM_SERVICE | MYL | HUESPED | HU |
|---|---|---|---|---|---|---|---|
| Reportar un daño | — | — | ✅ | — | ✅ | — | HU-REC-17, HU-MYL-06 |
| Ver las incidencias activas y tomar una | — | — | — | — | ⚠️ ¹² | — | HU-MYL-07 |
| Resolver una incidencia | — | — | — | — | ⚠️ ¹² ⁹ | — | HU-MYL-08 |
| Consultar todas las incidencias | — | 👁 | — | — | — | — | HU-ADM-10 |

### 3.7 Administración

| Acción | PÚBLICO | ADMIN | RECEPCION | ROOM_SERVICE | MYL | HUESPED | HU |
|---|---|---|---|---|---|---|---|
| Gestionar empleados (crear, editar, desactivar, restablecer contraseña) | — | ✅ | — | — | — | — | HU-ADM-01, HU-ADM-02 |
| Gestionar tipos de habitación y habitaciones físicas (`room_types`, `rooms`) | — | ✅ ¹⁵ | — | — | — | — | HU-ADM-03, HU-ADM-04 |
| Gestionar el menú de Room Service | — | ✅ | — | — | — | — | HU-ADM-05 |
| Gestionar temporadas y el ajuste de fin de semana | — | ✅ | — | — | — | — | HU-ADM-06, HU-ADM-07 |
| Configurar los datos del hotel y fiscales | — | ✅ | — | — | — | — | HU-ADM-08 |
| Ver los indicadores | — | ✅ | — | — | — | — | HU-ADM-09 |
| Usar el canal simulado | — | ✅ | — | — | — | — | HU-CM-03 |
| *Nivel 2:* gestionar amenidades y Wi-Fi | — | ✅ | — | — | — | — | HU-ADM-11 |
| *Nivel 2:* ver amenidades y Wi-Fi | — | — | — | — | — | 👁 ¹³ | HU-HUE-18 |
| *Nivel 2:* definir y asignar turnos | — | ✅ | — | — | — | — | HU-ADM-12 |
| *Nivel 2:* registrar insumos, compras y movimientos manuales | — | ✅ | — | — | — | — | HU-ADM-13 |
| *Nivel 2:* consultar insumos | — | ✅ | — | — | Solo área Mantenimiento o Ambas | — | HU-ADM-13 |
| Registrar repuestos en órdenes en proceso | — | ✅ | — | — | Solo Mantenimiento o Ambas, técnico a cargo | — | ALC-MYL-10; integración HU-ADM-13 |

### 3.8 Acceso, tiempo real y notificaciones

| Acción | PÚBLICO | ADMIN | RECEPCION | ROOM_SERVICE | MYL | HUESPED | HU |
|---|---|---|---|---|---|---|---|
| Iniciar y cerrar sesión con correo y contraseña | — | ✅ | ✅ | ✅ | ✅ | — | HU-EMP-01 |
| Cambiar mi contraseña | — | 👤 | 👤 | 👤 | 👤 | — | HU-EMP-02 |
| Entrar a la app con correo y código | — | — | — | — | — | ✅ | HU-HUE-08 |
| Recibir el aviso de pedido nuevo (tiempo real) | — | — | — | ✅ | — | — | HU-RS-07 |
| Recibir el aviso de solicitud nueva (tiempo real) | — | — | — | — | ⚠️ ⁸ | — | HU-MYL-04 |
| Ver los cambios de las habitaciones en tiempo real | — | — | ✅ | — | ⚠️ ⁸ | — | HU-REC-10, HU-MYL-01 |
| Ver el estado de mi pedido en vivo | — | — | — | — | — | 👤 | HU-HUE-11 |
| Recibir notificaciones push | — | — | — | — | — | 👤 ⁴ | HU-HUE-17 |

---

## 4. Notas de la matriz

| # | Nota |
|---|---|
| ¹ | La reserva web nace `PENDIENTE_PAGO` y se paga al 100 % con Recurrente. |
| ² | Solo reservas `CONFIRMADA` que **no** vengan de un canal externo. |
| ³ | Solo antes del check-in: reservas `PENDIENTE_PAGO` o `CONFIRMADA`. |
| ⁴ | Solo con la reserva `EN_ESTADIA` (y, para los cargos, con la cuenta `ABIERTA`). |
| ⁵ | Solo en su check-out desde la app: reserva `EN_ESTADIA`, desde las 00:00 del día de salida hasta las 12:00. |
| ⁶ | Solo la incidencia de una habitación `FUERA_DE_SERVICIO`, en solo lectura. |
| ⁷ | Solo una habitación `LIBRE` + `LIMPIA`. |
| ⁸ | Solo empleados con área `LIMPIEZA` o `AMBAS`. Un empleado solo de Mantenimiento recibe "Acceso denegado". |
| ⁹ | Solo el empleado a cargo (quien la inició o la tomó). |
| ¹⁰ | Ve el nombre del huésped, el número de habitación y el piso; **no** ve correo, teléfono, documento ni pagos. |
| ¹¹ | Ve el número de habitación y el piso; no ve datos personales del huésped. |
| ¹² | Solo empleados con área `MANTENIMIENTO` o `AMBAS`. Un empleado solo de Limpieza recibe "Acceso denegado". Reportar un daño sí lo puede hacer cualquier área. |
| ¹³ | Cualquier huésped con sesión, sin importar el estado de su reserva. |
| ¹⁴ | Solo con la cuenta `ABIERTA` (HU-REC-13). |
| ¹⁵ | `ADMIN` gestiona tipos (`room_types`, incluidas sus fotos públicas en S3/CloudFront) y habitaciones físicas (`rooms`) en `/api/v1/admin/tipos-habitacion` y `/api/v1/admin/habitaciones`. La administración de ofertas comerciales (`catalog_offers`, `catalog_offer_rooms`, `room_features`) se define en `API #83` y `web #69` (véase [admin-habitaciones-ofertas-tipos.md](../04-guias-y-referencia/admin-habitaciones-ofertas-tipos.md)). |

---

## 5. Actores que no son usuarios

| Actor | Qué puede hacer | Cómo se autentica |
|---|---|---|
| `CANAL` | **Solo crear** reservas por la API (HU-CM-01). No cancela ni consulta reservas | Canal y clave en cada petición; la clave se compara con su hash (canales y claves cargados en los datos iniciales) |
| `RECURRENTE` | Avisar del resultado de los pagos por el webhook (pagado o sesión vencida) | Firma del webhook de Recurrente |
| `SISTEMA` | Los efectos automáticos del documento 07 (sección 11): revisión y conciliación al vencer el plazo (cancelación solo tras vencimiento confirmado sin pago), efectos del check-out, cargo del pedido entregado (HU-RS-06), correo de confirmación (HU-HUE-07), cambios de la habitación por incidencias, correos y notificaciones push | Proceso interno del backend |

---

## 6. Reglas de visibilidad de datos

| # | Regla | HU |
|---|---|---|
| VIS-01 | El huésped solo ve sus propias reservas, cuenta, pedidos, solicitudes y factura. Si pide un registro ajeno, el servidor lo rechaza. | HU-HUE-09, HU-HUE-15 |
| VIS-02 | Room Service solo ve el nombre del huésped, la habitación y el piso; Mantenimiento/Limpieza solo la habitación y el piso. Ninguno ve correo, teléfono, documento ni pagos. | HU-RS-01, HU-RS-02, HU-MYL-04 |
| VIS-03 | La web pública solo expone información del hotel, tipos de habitación activos, ofertas comerciales publicadas (sin notas internas `pendingFeatures`), disponibilidad y precios. La página de retorno de Recurrente solo muestra el estado de la reserva recién consultada. Nunca expone otras reservas ni datos de otros huéspedes. | HU-HUE-01 a HU-HUE-04 |
| VIS-04 | Un empleado `INACTIVO` no puede iniciar sesión ni renovar su sesión. La política anterior permitía conservar el acceso hasta vencer el JWT; es un antecedente histórico. El API inspeccionado comprueba la vigencia del empleado en cada petición. La reconciliación de esta política sigue pendiente en API #78, según RN-PER-014, sin debilitar los controles implementados. | HU-ADM-02, HU-EMP-01 |
| VIS-05 | Las notificaciones push no muestran datos personales ni montos. | HU-HUE-17 |
| VIS-06 | Los secretos (claves de Recurrente, del correo, de firma de los JWT, de los canales) nunca se suben a Git ni llegan a la web o a la app. | AGENTS.md; documento 14 |

---

## 7. Guía de implementación

Orientación para Pablo, Hugo y el backend. El diseño completo está en el documento 14.

### 7.1 Datos del token (JWT)

| Dato | Para qué |
|---|---|
| Identificador del usuario (`sub`) | Saber quién hace la petición y verificar la propiedad (👤) |
| Tipo y rol (empleado con su rol, o `HUESPED`) | Aplicar las columnas de la matriz con `@PreAuthorize` |
| Área (solo `MANTENIMIENTO_LIMPIEZA`) | Notas ⁸ y ¹² |

El estado del empleado se comprueba al iniciar y renovar sesión. La política anterior permitía conservar el acceso hasta vencer el JWT; es un antecedente histórico. El API inspeccionado comprueba la vigencia del empleado en cada petición. La reconciliación de esta política sigue pendiente en API #78, según RN-PER-014, sin debilitar los controles implementados.

### 7.2 Cómo se aplica cada símbolo

| Símbolo | Implementación en Spring |
|---|---|
| ✅ | `@PreAuthorize("hasRole('...')")` en el endpoint o en el servicio |
| 👁 | Solo endpoints de lectura (`GET`) para ese rol |
| 👤 | Rol permitido **y** verificación de propiedad en el servicio. Si el registro no le pertenece, responde **404** para no revelar que existe |
| ⚠️ | Condición en el servicio (área, estado, empleado a cargo) o datos reducidos con un DTO distinto |
| — | Responde **403**. Cada "—" tiene una prueba de rechazo (Spring Security Test) |

**Regla:** cada rol recibe un **DTO** con solo los datos que puede ver (notas ¹⁰ y ¹¹). Nunca se devuelve la entidad completa.

### 7.3 Endpoints públicos (sin sesión)

Información del hotel, tipos de habitación activos, disponibilidad y precio, crear la reserva web, iniciar su pago y la página de estado al volver de Recurrente. El webhook de Recurrente y la API del canal también son públicos, pero se protegen con la firma y con la clave del canal.

### 7.4 Tiempo real (WebSocket)

Solo los **4 eventos** del documento 07 (sección 12). Spring autoriza cada suscripción:

| Canal | Quién se suscribe |
|---|---|
| Pedidos (nuevo y cambio de estado) | `ROOM_SERVICE` |
| Estado de mi pedido | `HUESPED`, solo sus pedidos (cola personal) |
| Solicitudes nuevas | `MYL` con área `LIMPIEZA` o `AMBAS` |
| Cambios de habitación | `RECEPCION` y `MYL` con área `LIMPIEZA` o `AMBAS` |

La web se conecta con un ticket de 60 segundos obtenido a través del BFF. La app se conecta con su propio JWT de huésped, sin pasar por el BFF.

### 7.5 Archivos (R2 en dev / Amazon S3 en producción)

| Contenido | Acceso |
|---|---|
| Fotos del hotel, de los tipos de habitación, del menú y de las amenidades | Lectura pública; escritura solo `ADMIN` |
| PDF de las facturas | `RECEPCION` y el huésped dueño |
| Fotos de las incidencias | Quien la reportó (`RECEPCION` o `MYL`), `MYL` con área `MANTENIMIENTO` o `AMBAS`, y `ADMIN` en solo lectura |

Los archivos privados se entregan con URL firmadas de corta duración que genera el backend después de revisar el permiso.

Almacenamiento definido en la [PR #36 y ADR-007](https://github.com/villaserenaguatee/villa-serena-docs/blob/5dcd7a26ea01a0063375aa18df8fe792e4270301/03-arquitectura/adr/ADR-007-almacenamiento-r2-s3.md), pendiente de integración: `dev` utiliza R2, `prod` S3 y `local` mínimo un adaptador persistente en PostgreSQL, sin MinIO ni nube. Esto no modifica los permisos anteriores ni acredita aprovisionamiento. En R2 el bucket privado no es público; en S3 ambos buckets bloquean acceso público directo y los assets públicos se sirven mediante CloudFront/OAC. Las URLs privadas las firma el backend después de autorizar al usuario, contra el endpoint del proveedor, no el dominio de assets. Los secretos nunca llegan al navegador.
