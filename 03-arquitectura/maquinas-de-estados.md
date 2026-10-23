# Máquinas de Estados y Transiciones

Este documento define el ciclo de vida, códigos de estado válidos y transiciones permitidas para cada una de las entidades del sistema (Reservas, Habitaciones, Cuentas, Pedidos, Solicitudes e Incidencias).

---

## Índice

1. [Propósito y cómo leer este documento](#1-propósito-y-cómo-leer-este-documento)
2. [Decisiones de diseño](#2-decisiones-de-diseño)
3. [Reserva](#3-reserva)
4. [Habitación](#4-habitación)
5. [Cuenta, cargos, pagos y factura](#5-cuenta-cargos-pagos-y-factura)
6. [Pedido de Room Service](#6-pedido-de-room-service)
7. [Solicitud del huésped](#7-solicitud-del-huésped)
8. [Incidencia de mantenimiento](#8-incidencia-de-mantenimiento)
9. [Estados simples](#9-estados-simples)
10. [Reglas generales](#10-reglas-generales)
11. [Efectos automáticos entre módulos](#11-efectos-automáticos-entre-módulos)
12. [Tiempo real, notificaciones push y correos](#12-tiempo-real-notificaciones-push-y-correos)

---

## 1. Propósito y cómo leer este documento

Define **los estados** de cada elemento del sistema, **qué cambios de estado están permitidos**, **quién** los hace, **con qué condición** y **qué efectos** producen. Todo sale de los criterios de las historias de usuario; este documento no agrega reglas.

- Cada tabla de transiciones es una **lista cerrada**: todo cambio que no aparece está **prohibido**.
- El **código** (ej. `EN_ESTADIA`) es el valor que se guarda en la base de datos y se usa igual en backend, web, app y pruebas.
- La **etiqueta** (ej. "En estadía") es el texto que ve el usuario; es la que usan las historias.
- La columna **HU** indica la historia de donde sale cada transición.

**Actores:**

| Actor | Quién es |
|---|---|
| `CLIENTE` | Persona que reserva en la web pública, sin sesión |
| `HUESPED` | Huésped principal con sesión en el portal web (`/portal`) o en la app Android (correo + código OTP de 6 dígitos) |
| `RECEPCION` | Recepcionista |
| `ROOM_SERVICE` | Personal de Room Service |
| `MYL` | Mantenimiento/Limpieza; se indica el área cuando importa (`LIMPIEZA`, `MANTENIMIENTO` o `AMBAS`) |
| `ADMIN` | Administrador. **Solo usa sus pantallas** y el canal simulado; no aparece en las transiciones de Recepción ni de piso |
| `SISTEMA` | El backend, por un proceso automático o como efecto de otra transición |
| `RECURRENTE` | Webhook firmado por Svix de la pasarela activa Recurrente (en el esquema se conserva `STRIPE` como método histórico de compatibilidad) |
| `CANAL` | Canal externo (Booking o Expedia) a través de la API; en la demostración, el canal simulado |

**Uso por frente:**

| Frente | Uso |
|---|---|
| Backend y datos | Tipos enumerados, restricciones y tabla de historial de estados |
| Backend | Validación de transiciones y efectos automáticos |
| Frontend web y móvil | Qué botones mostrar en cada estado y qué etiqueta usar |
| Quien verifica el flujo | Cada fila es una prueba de un cambio permitido; cada cambio no listado, una prueba de rechazo |

---

## 2. Decisiones de diseño

| # | Decisión | Origen |
|---|---|---|
| E-01 | La **cuenta se crea junto con la reserva**, no en el check-in | HU-HUE-05, HU-REC-04, HU-CM-01 |
| E-02 | La habitación tiene **dos dimensiones**: ocupación y condición | HU-REC-10 |
| E-03 | **No existe `NO_SHOW`.** El huésped que no llega se cancela con motivo "No se presentó", sin reembolso | V-01 |
| E-04 | **Las reservas no se modifican.** Solo se asigna o cambia la habitación antes del check-in | D-15, D-17 |
| E-05 | La limpieza de una habitación ocupada es **solo a pedido** del huésped y **no cambia** la condición de la habitación | HU-HUE-12, HU-MYL-01 |
| E-06 | **Mantenimiento de 3 estados**: el técnico **toma** la incidencia; el Administrador solo consulta | D-19 |
| E-07 | **Factura de un solo estado** (`EMITIDA`): sin anulación ni copias | D-18 |
| E-08 | **Tiempo real solo para 4 eventos** (sección 12) | D-21 |
| E-09 | Los cambios de estado de reservas, habitaciones, pedidos, solicitudes e incidencias quedan en un **historial** | ALC-TRA-03 |

---

## 3. Reserva

### 3.1 Estados

| Código | Etiqueta | Ocupa disponibilidad | Final |
|---|---|---|---|
| `PENDIENTE_PAGO` | Pendiente de pago | ✅ | — |
| `CONFIRMADA` | Confirmada | ✅ | — |
| `EN_ESTADIA` | En estadía | ✅ | — |
| `FINALIZADA` | Finalizada | — | ✅ |
| `CANCELADA` | Cancelada | — | ✅ |

**Disponibilidad:** una reserva `PENDIENTE_PAGO`, `CONFIRMADA` o `EN_ESTADIA` ocupa un cupo de su tipo en cada noche de su estadía, tenga o no habitación asignada (HU-HUE-03, HU-REC-03).

### 3.2 Diagrama

```
 CLIENTE (web)                       RECEPCION / CANAL
      │                                     │
      ▼                                     ▼
┌────────────────┐  pago aprobado    ┌────────────┐  check-in   ┌────────────┐  check-out  ┌────────────┐
│ PENDIENTE_PAGO │ ────────────────► │ CONFIRMADA │ ──────────► │ EN_ESTADIA │ ──────────► │ FINALIZADA │
└────────────────┘                   └────────────┘             └────────────┘             └────────────┘
      │ vencimiento sin pago                │ cancelación (solo Recepción;
      ▼                                     │ no las de canal)
┌────────────────┐                          │
│   CANCELADA    │ ◄────────────────────────┘
└────────────────┘
```

### 3.3 Transiciones

| # | De → A | Quién | Condición | Efectos | HU |
|---|---|---|---|---|---|
| R1 | (nueva) → `PENDIENTE_PAGO` | `CLIENTE` | Datos válidos (nacionalidad opcional; país emisor condicional al enviar pasaporte; hora estimada opcional `HH:mm`), encabezados `Idempotency-Key`, `X-Booking-Draft` y `X-Booking-Email-Verification` vigente (20 min), y disponibilidad revalidada al crear (`/api/v1/publico/reservas` o `/api/v1/publico/ofertas/{codigo}/reservas`) | Código único `VS-...`; canal `DIRECTO_WEB`; precio congelado; cuenta `ABIERTA` con el cargo por alojamiento (K1, G1). Ante respuesta incierta se recupera con `GET /api/v1/publico/reservas/intento` | HU-HUE-05 |
| R2 | (nueva) → `CONFIRMADA` | `RECEPCION` | Huésped con correo; hay disponibilidad (se revalida al guardar) | Código único; canal `RECEPCION`; precio fijo; cuenta `ABIERTA` con el cargo por alojamiento; correo de confirmación. **No se cobra por adelantado** | HU-REC-04 |
| R3 | (nueva) → `CONFIRMADA` | `CANAL` | Clave válida; datos válidos; hay disponibilidad; el identificador externo no existe en ese canal | Código propio; canal `BOOKING` o `EXPEDIA` e identificador externo; cuenta `ABIERTA` con cargo por alojamiento = monto del canal y pago `APROBADO` con método `CANAL` (P5); correo de confirmación | HU-CM-01 |
| R4 | `PENDIENTE_PAGO` → `CONFIRMADA` | `RECURRENTE` o `SISTEMA` | Webhook de Recurrente firmado con Svix (`svix-id`, `svix-timestamp`, `svix-signature`) con pago aprobado, o conciliación del `SISTEMA` (`ConsultaProcesoPago` / `VencimientoReservasJob`) antes de cancelar | Pago `APROBADO` (P2); correo de confirmación. Los parámetros de retorno al navegador no confirman por sí solos la reserva | HU-HUE-06, HU-HUE-07 |
| R5 | `PENDIENTE_PAGO` → `CANCELADA` | `SISTEMA` | `VencimientoReservasJob` comprueba a los 30 minutos que el intento no tiene pago aprobado ni conciliación pendiente en Recurrente | Cuenta `CERRADA` (K2); cupo y habitación asignada liberados; pago `FALLIDO` (P3) | HU-HUE-06 |
| R6 | `CONFIRMADA` → `EN_ESTADIA` | `RECEPCION` (check-in) | Hoy está entre la fecha de entrada y el día anterior a la salida; habitación asignada; habitación `LIBRE` + `LIMPIA` | Habitación `OCUPADA` (O1); se habilitan en portal/app room service y solicitudes (ver la cuenta no depende del estado) | HU-REC-12 |
| R7 | `CONFIRMADA` → `CANCELADA` | `RECEPCION` | Motivo obligatorio; la reserva **no** viene de un canal externo; las 48 horas antes de las 15:00 del día de llegada se evalúan cuando Recepción ejecuta la cancelación. Si corresponde reembolso en `RECURRENTE`, la pasarela debe aceptarlo; un pago histórico `STRIPE` devuelve `PAGO_LEGADO_REQUIERE_CONCILIACION` y no se reembolsa por el proveedor nuevo | Cuenta `CERRADA` tal como está (K2); cupo y habitación asignada liberados; si faltan 48 h o más y el pago `RECURRENTE` fue reembolsado → pago `REEMBOLSADO` (P6). **No se envía correo** | HU-REC-05 |
| R8 | `EN_ESTADIA` → `FINALIZADA` | `RECEPCION` (check-out) o `HUESPED` (check-out en portal/app) | Saldo exactamente 0 (después del pago único); sin pedidos `EN_CAMINO`; NIT válido o "CF". En portal/app, además: desde las 00:00 del día de salida hasta las 12:00, y el huésped acepta que sus pedidos `NUEVO` o `EN_PREPARACION` se cancelen sin cargo | Ver **efectos del check-out** (sección 11). El cierre de la estadía se completa en una sola operación: si falla, no se aplican sus cambios. En Recepción tampoco se registra el pago de esa operación; un pago en línea aprobado previamente se conserva (sección 11) | HU-REC-14, HU-HUE-16 |

**Notas:**

- **Huésped que no llega:** Recepción lo cancela con R7 y el motivo "No se presentó". Como faltan menos de 48 horas, no hay reembolso (HU-REC-05).
- **Reservas de canal:** no se cancelan desde el sistema, ni siquiera si el huésped no llega; quedan `CONFIRMADA` (limitación aceptada, HU-REC-05 y HU-CM-02).
- **Salida tarde:** no hay ningún cambio automático. Recepción hace el check-out cuando el huésped baje, sin cargo extra (HU-REC-14).

### 3.4 Acciones que no cambian el estado

| Acción | Estados permitidos | Quién | Condición | HU |
|---|---|---|---|---|
| Asignar o cambiar la habitación | `PENDIENTE_PAGO`, `CONFIRMADA` | `RECEPCION` | Mismo tipo reservado; no `FUERA_DE_SERVICIO`; sin traslape (se revalida al guardar). No necesita estar `LIMPIA` | HU-REC-07 |
| Registrar huéspedes adicionales | `CONFIRMADA`, `EN_ESTADIA` | `RECEPCION` | Principal + adicionales ≤ número de huéspedes de la reserva | HU-REC-02 |

**Prohibido:** cambiar fechas, tipo o número de huéspedes (se cancela y se crea otra reserva), y cambiar la habitación con la reserva `EN_ESTADIA`.

---

## 4. Habitación

La habitación tiene **dos dimensiones independientes**. Además tiene el campo `ACTIVO` / `INACTIVO` del catálogo (sección 9).

### 4.1 Ocupación

| Código | Etiqueta |
|---|---|
| `LIBRE` | Libre |
| `OCUPADA` | Ocupada |

| # | De → A | Quién | Condición | HU |
|---|---|---|---|---|
| O1 | `LIBRE` → `OCUPADA` | `SISTEMA` | Al hacer check-in (R6) | HU-REC-12 |
| O2 | `OCUPADA` → `LIBRE` | `SISTEMA` | Al hacer check-out (R8) | HU-REC-14, HU-HUE-16 |

**La ocupación nunca se cambia a mano** (HU-REC-11).

### 4.2 Condición

| Código | Etiqueta |
|---|---|
| `LIMPIA` | Limpia |
| `SUCIA` | Sucia |
| `EN_LIMPIEZA` | En limpieza |
| `FUERA_DE_SERVICIO` | Fuera de servicio |

Una habitación **nueva** se crea `LIBRE` + `LIMPIA` (HU-ADM-04).

```
LIMPIA            ──► SUCIA              Recepción la marca (C2)
SUCIA             ──► EN_LIMPIEZA        Limpieza empieza (C3)
EN_LIMPIEZA       ──► LIMPIA             Limpieza termina (C4)
EN_LIMPIEZA       ──► SUCIA              Limpieza se interrumpe (C5)
cualquiera        ──► SUCIA              check-out sin incidencia que impida el uso (C1)
cualquiera        ──► FUERA_DE_SERVICIO  incidencia que impide el uso: al reportarla con la
                                         habitación LIBRE (C6) o en el check-out (C7)
FUERA_DE_SERVICIO ──► SUCIA              se resuelve la última incidencia que impedía el uso (C8)
```

| # | De → A | Quién | Condición | Efectos | HU |
|---|---|---|---|---|---|
| C1 | cualquier condición → `SUCIA` | `SISTEMA` | Check-out (R8) y la habitación **no** tiene una incidencia sin resolver que impida su uso | Aparece en pendientes de limpieza | HU-REC-14, HU-HUE-16 |
| C2 | `LIMPIA` → `SUCIA` | `RECEPCION` | Habitación `LIBRE` + `LIMPIA` | Aparece en pendientes de limpieza | HU-REC-11 |
| C3 | `SUCIA` → `EN_LIMPIEZA` | `MYL` (área `LIMPIEZA` o `AMBAS`) | Nadie más la inició | Queda a nombre del empleado | HU-MYL-02 |
| C4 | `EN_LIMPIEZA` → `LIMPIA` | `MYL` (el empleado a cargo) | — | Sale de pendientes; si tiene llegada hoy, ya se puede hacer el check-in | HU-MYL-03 |
| C5 | `EN_LIMPIEZA` → `SUCIA` | `MYL` (el empleado a cargo) | Limpieza interrumpida | Vuelve a pendientes, libre para cualquier compañero | HU-MYL-02 |
| C6 | `LIMPIA` / `SUCIA` / `EN_LIMPIEZA` → `FUERA_DE_SERVICIO` | `SISTEMA` | Se reporta una incidencia que **impide el uso** (I1) y la habitación está `LIBRE` | Deja de contar en la disponibilidad | HU-REC-17, HU-MYL-06 |
| C7 | cualquier condición → `FUERA_DE_SERVICIO` | `SISTEMA` | Check-out (R8) de una habitación con una incidencia sin resolver que impide su uso | Deja de contar en la disponibilidad | HU-REC-14, HU-HUE-16 |
| C8 | `FUERA_DE_SERVICIO` → `SUCIA` | `SISTEMA` | Se resuelve una incidencia (I3) y la habitación **no** tiene otra sin resolver que impida su uso | Aparece en pendientes de limpieza | HU-MYL-08 |

**Prohibido:**

- `RECEPCION` no marca una habitación como `LIMPIA` (solo Limpieza, C4).
- Nadie pone una habitación en `FUERA_DE_SERVICIO` a mano: siempre es por una incidencia (HU-REC-11).
- Si la incidencia que impide el uso se reporta con la habitación `OCUPADA`, la condición **no cambia**: se muestra el indicador "Incidencia pendiente" y se repara con el huésped alojado (HU-REC-17, HU-MYL-06).
- La solicitud de limpieza de un huésped alojado **no cambia** la condición (HU-HUE-12, HU-MYL-04).

### 4.3 Indicadores que ve Recepción

No son estados; se calculan (HU-REC-10).

| Indicador | Cuándo se muestra |
|---|---|
| "Llega hoy" | La habitación tiene asignada una reserva `CONFIRMADA` con entrada hoy |
| "Sale hoy" | Su reserva `EN_ESTADIA` sale hoy |
| "Incidencia pendiente" | Está `OCUPADA` y tiene una incidencia sin resolver que impide su uso |

---

## 5. Cuenta, cargos, pagos y factura

### 5.1 Cuenta

| Código | Etiqueta | Final |
|---|---|---|
| `ABIERTA` | Abierta | — |
| `CERRADA` | Cerrada | ✅ |

| # | De → A | Quién | Condición | HU |
|---|---|---|---|---|
| K1 | (nueva) → `ABIERTA` | `SISTEMA` | Al crear la reserva (R1, R2, R3), con el cargo por alojamiento | HU-HUE-05, HU-REC-04, HU-CM-01 |
| K2 | `ABIERTA` → `CERRADA` | `SISTEMA` | La reserva pasa a `FINALIZADA` o `CANCELADA` | HU-REC-05, HU-REC-14, HU-HUE-06 |

- Hay **una sola cuenta por reserva**.
- **Saldo** = suma de los cargos `VIGENTE` − suma de los pagos `APROBADO` (HU-HUE-15, HU-REC-13).
- Con la cuenta `CERRADA` no se agregan ni se anulan cargos (HU-REC-13).

### 5.2 Cargo

| Código | Etiqueta |
|---|---|
| `VIGENTE` | Vigente |
| `ANULADO` | Anulado |

**Tipos de cargo** (atributo, no estado): alojamiento, room service y servicio (restaurante, lavandería, estacionamiento u otro).

| # | De → A | Quién | Condición | HU |
|---|---|---|---|---|
| G1 | (nuevo) → `VIGENTE` | `SISTEMA` | **Alojamiento:** al crear la reserva (K1). **Room service:** cuando el pedido pasa a `ENTREGADO` (S4), uno solo por pedido | HU-HUE-05, HU-RS-06 |
| G2 | (nuevo) → `VIGENTE` | `RECEPCION` | **Servicio:** reserva `EN_ESTADIA` y cuenta `ABIERTA`; cantidad y precio unitario mayores que cero | HU-REC-13 |
| G3 | `VIGENTE` → `ANULADO` | `RECEPCION` | Motivo obligatorio; cuenta `ABIERTA`; **el cargo por alojamiento no se anula** | HU-REC-13 |

Los cargos **nunca se borran**: el anulado queda visible y deja de sumar al saldo.

### 5.3 Pago

| Código | Etiqueta | Final |
|---|---|---|
| `PENDIENTE` | Pendiente | — |
| `APROBADO` | Aprobado | — |
| `FALLIDO` | Fallido | ✅ |
| `REEMBOLSADO` | Reembolsado | ✅ |

**Métodos de pago** (atributo, no estado): `RECURRENTE` (pasarela activa en GTQ para web, portal y app), `STRIPE` (compatibilidad histórica en el esquema), `CANAL`, `EFECTIVO`, `TARJETA` u `OTRO` (Recepción).

| # | De → A | Quién | Condición | HU |
|---|---|---|---|---|
| P1 | (nuevo) → `PENDIENTE` | `CLIENTE` (pago de la reserva) o `HUESPED` (pago del saldo en portal/app) | Se solicita o recupera el checkout alojado de Recurrente (`urlPago`, `expiraEn`, `estadoCheckout`, `accionPago` ∈ `INICIAR`/`CONTINUAR`/`ESPERAR`/`REINTENTAR`/`NINGUNA`) | HU-HUE-06, HU-HUE-16 |
| P2 | `PENDIENTE` → `APROBADO` | `RECURRENTE` o `SISTEMA` | Webhook de pago aprobado firmado por Svix o conciliación por el backend (`PagoOnlineService`). Si el mismo evento llega dos veces, es idempotente | HU-HUE-06, HU-HUE-16 |
| P3 | `PENDIENTE` → `FALLIDO` | `RECURRENTE` o `SISTEMA` | El checkout venció sin pago aprobado ni conciliación pendiente (al cancelar la reserva tras `VencimientoReservasJob`, R5). Un intento rechazado o un fallo de red del navegador **no** marca el pago como `FALLIDO` ni autoriza cobros duplicados | HU-HUE-06 |
| P4 | (nuevo) → `APROBADO` | `RECEPCION` | En el check-out (R8): **un solo pago por el saldo total**, con método y referencia opcional. Si el saldo ya es 0, no se registra pago | HU-REC-14 |
| P5 | (nuevo) → `APROBADO` | `SISTEMA` | Reserva de canal (R3): pago por el monto del canal, método `CANAL` | HU-CM-01 |
| P6 | `APROBADO` → `REEMBOLSADO` | `SISTEMA` | Cancelación (R7) ejecutada por Recepción con 48 h o más antes de las 15:00 del día de llegada y pago con método `RECURRENTE`. Reembolso **total**; si la pasarela lo rechaza o el pago es legado (`STRIPE` → `PAGO_LEGADO_REQUIERE_CONCILIACION`), no se marca `REEMBOLSADO` automáticamente | HU-REC-05 |

**No existen** abonos, pagos parciales ni reembolsos parciales (D-14, D-16).

**Limitación aceptada (pago del saldo en portal/app):** el check-out exige saldo exactamente 0 después de confirmar el pago en el backend (`PagoOnlineService`). Un retorno de navegador no confirma el pago por sí solo (HU-HUE-16).

### 5.4 Factura

| Código | Etiqueta | Final |
|---|---|---|
| `EMITIDA` | Emitida | ✅ |

| # | De → A | Quién | Condición | HU |
|---|---|---|---|---|
| F1 | (nueva) → `EMITIDA` | `SISTEMA`, dentro del check-out (R8) hecho por `RECEPCION` o por el `HUESPED` | Saldo de la cuenta en 0; la cuenta no tiene otra factura. Número = siguiente correlativo de la serie fija, en la misma operación | HU-REC-15, HU-HUE-16 |

- Una factura emitida **no se modifica ni se anula**. No existe el estado `ANULADA` (D-18).
- Imprimir no cambia el estado y todas las impresiones son iguales, sin marca "COPIA" (HU-REC-16).

---

## 6. Pedido de Room Service

| Código | Etiqueta | Final |
|---|---|---|
| `NUEVO` | Nuevo | — |
| `EN_PREPARACION` | En preparación | — |
| `EN_CAMINO` | En camino | — |
| `ENTREGADO` | Entregado | ✅ |
| `CANCELADO` | Cancelado | ✅ |

```
NUEVO ──► EN_PREPARACION ──► EN_CAMINO ──► ENTREGADO
  │             │                │
  └─────────────┴────────────────┴──► CANCELADO (Room Service, con motivo)
  │             │
  └─────────────┴──► CANCELADO (sistema, al hacer el check-out)
```

| # | De → A | Quién | Condición | Efectos | HU |
|---|---|---|---|---|---|
| S1 | (nuevo) → `NUEVO` | `HUESPED` (app) | Reserva `EN_ESTADIA`; todos los ítems `DISPONIBLE` | Precios congelados; aparece al instante en Room Service (evento 1) | HU-HUE-10 |
| S2 | `NUEVO` → `EN_PREPARACION` | `ROOM_SERVICE` | — | El huésped lo ve sin recargar (evento 2) | HU-RS-03 |
| S3 | `EN_PREPARACION` → `EN_CAMINO` | `ROOM_SERVICE` | — | Igual que S2. Mientras esté `EN_CAMINO`, no se permite el check-out | HU-RS-03 |
| S4 | `EN_CAMINO` → `ENTREGADO` | `ROOM_SERVICE` | — | Un solo cargo `VIGENTE` en la cuenta (G1); notificación push "pedido entregado" | HU-RS-03, HU-RS-06 |
| S5 | `NUEVO` / `EN_PREPARACION` / `EN_CAMINO` → `CANCELADO` | `ROOM_SERVICE` | Motivo obligatorio | Sin cargo; el huésped ve el motivo | HU-RS-04 |
| S6 | `NUEVO` / `EN_PREPARACION` → `CANCELADO` | `SISTEMA` | Check-out de la reserva (R8) | Sin cargo; motivo fijo "Estadía finalizada" | HU-REC-14, HU-HUE-16 |

- El estado avanza **en orden**, sin saltos ni retrocesos (HU-RS-03).
- El huésped **no** cancela ni modifica pedidos (HU-HUE-11).

---

## 7. Solicitud del huésped

Aplica a las solicitudes de **limpieza** y de **artículos** (tipo: `LIMPIEZA` o `ARTICULOS`).

| Código | Etiqueta | Final |
|---|---|---|
| `PENDIENTE` | Pendiente | — |
| `EN_PROCESO` | En proceso | — |
| `ATENDIDA` | Atendida | ✅ |
| `CANCELADA` | Cancelada | ✅ |

```
PENDIENTE ──► EN_PROCESO ──► ATENDIDA
   │               │
   │ huésped       │
   ▼               ▼
CANCELADA ◄── sistema, al hacer el check-out (desde PENDIENTE o EN_PROCESO)
```

| # | De → A | Quién | Condición | Efectos | HU |
|---|---|---|---|---|---|
| Q1 | (nueva) → `PENDIENTE` | `HUESPED` (app) | Reserva `EN_ESTADIA`. Limpieza: no hay otra `PENDIENTE` o `EN_PROCESO` para la misma habitación. Artículos: cantidad ≤ máximo de cada artículo | Aparece al instante en Limpieza (evento 3). No cambia la condición de la habitación ni descuenta inventario | HU-HUE-12, HU-HUE-13 |
| Q2 | `PENDIENTE` → `EN_PROCESO` | `MYL` (área `LIMPIEZA` o `AMBAS`) | Nadie más la tomó | Queda a nombre del empleado | HU-MYL-04 |
| Q3 | `EN_PROCESO` → `ATENDIDA` | `MYL` (el empleado a cargo) | — | Notificación push "solicitud atendida" | HU-MYL-05 |
| Q4 | `PENDIENTE` → `CANCELADA` | `HUESPED` (app) | — | — | HU-HUE-14 |
| Q5 | `PENDIENTE` / `EN_PROCESO` → `CANCELADA` | `SISTEMA` | Check-out de la reserva (R8) | — | HU-REC-14, HU-HUE-16 |

Recepción **no** crea ni cancela solicitudes (descartado en el Alcance, ALC-REC-11).

---

## 8. Incidencia de mantenimiento

| Código | Etiqueta | Final |
|---|---|---|
| `REPORTADA` | Reportada | — |
| `EN_PROCESO` | En proceso | — |
| `RESUELTA` | Resuelta | ✅ |

```
REPORTADA ──► EN_PROCESO ──► RESUELTA
            (el técnico     (con la descripción
             la toma)        de la solución)
```

| # | De → A | Quién | Condición | Efectos | HU |
|---|---|---|---|---|---|
| I1 | (nueva) → `REPORTADA` | `RECEPCION` o `MYL` (cualquier área) | Habitación y descripción obligatorias; se indica si **impide el uso**; foto opcional | Si impide el uso: habitación `LIBRE` → `FUERA_DE_SERVICIO` (C6); habitación `OCUPADA` → indicador "Incidencia pendiente" | HU-REC-17, HU-MYL-06 |
| I2 | `REPORTADA` → `EN_PROCESO` | `MYL` (área `MANTENIMIENTO` o `AMBAS`) | Nadie más la tomó | Queda a nombre del técnico | HU-MYL-07 |
| I3 | `EN_PROCESO` → `RESUELTA` | `MYL` (el técnico a cargo) | Descripción de la solución obligatoria | Si la habitación está `FUERA_DE_SERVICIO` y no tiene otra incidencia que impida su uso → `SUCIA` (C8). Si está `OCUPADA` y no tiene otra → se quita "Incidencia pendiente" | HU-MYL-08 |

- **No hay** asignación, reasignación, devolución, cierre ni cancelación (D-19).
- El Administrador **solo consulta** las incidencias (HU-ADM-10).

---

## 9. Estados simples

| Elemento | Códigos | Cambios permitidos | Quién | HU |
|---|---|---|---|---|
| Ítem del menú (disponibilidad) | `DISPONIBLE`, `AGOTADO` | `DISPONIBLE → AGOTADO` · `AGOTADO → DISPONIBLE` | Agotar: `ROOM_SERVICE`. Reactivar: **solo** `ADMIN` | HU-RS-05, HU-ADM-05 |
| Empleado | `ACTIVO`, `INACTIVO` | `ACTIVO ↔ INACTIVO` | `ADMIN` (no a sí mismo). Se crea `ACTIVO` con contraseña temporal mostrada una sola vez y cambio obligatorio (`/panel/cambiar-contrasena`). Un empleado `INACTIVO` no puede iniciar sesión; en el backend (`EmpleadoVigente.java`) se valida estado/rol/área y revocación en cada petición (la diferencia respecto al texto histórico de RN-PER-014 se sigue en [API #78](https://github.com/villaserenaguatee/villa-serena-api/issues/78)) | HU-ADM-01, HU-ADM-02, HU-EMP-01 |
| Tipo de habitación | `ACTIVO`, `INACTIVO` | `ACTIVO ↔ INACTIVO` | `ADMIN`. Un tipo inactivo devuelve `bookable=false` en la consulta de ofertas públicas y conserva las reservas existentes | HU-ADM-03 |
| Habitación (catálogo) | `ACTIVO`, `INACTIVO` | `ACTIVO ↔ INACTIVO` | `ADMIN`. Solo se desactiva si no está `OCUPADA` y no tiene reservas activas asignadas. La inactiva no cuenta en la disponibilidad | HU-ADM-04 |
| Ítem del menú (catálogo) | `ACTIVO`, `INACTIVO` | `ACTIVO ↔ INACTIVO` | `ADMIN`. El inactivo deja de aparecer en el menú | HU-ADM-05 |
| Amenidad (Nivel 2) | `ACTIVO`, `INACTIVO` | `ACTIVO ↔ INACTIVO` | `ADMIN` | HU-ADM-11 |
| Turno (Nivel 2) | `ACTIVO`, `INACTIVO` | `ACTIVO → INACTIVO` | `ADMIN` | HU-ADM-12 |
| Insumo de inventario (Nivel 2) | Sin estado de activación | Catálogo con control de versión; stock mediante movimientos, compras y repuestos | Catálogo: `ADMIN`; consulta también Mantenimiento | HU-ADM-13 |

**Nota:** el ítem del menú tiene dos campos distintos: `DISPONIBLE`/`AGOTADO` (lo cambia Room Service) y `ACTIVO`/`INACTIVO` (lo cambia el Administrador). Los canales externos **no** tienen estado.

---

## 10. Reglas generales

| # | Regla | Origen |
|---|---|---|
| RG-EST-01 | **Lista cerrada:** solo se permiten las transiciones de este documento. | — |
| RG-EST-02 | **Historial:** cada cambio de estado de **reservas, habitaciones, pedidos, solicitudes e incidencias** registra el estado anterior, el nuevo, el responsable (o `SISTEMA`), la fecha, la hora y el motivo si aplica. Los cargos y pagos guardan su fecha y responsable en su propio registro. | ALC-TRA-03; HU-REC-06, HU-RS-02, HU-ADM-10 |
| RG-EST-03 | **Validación en el servidor:** las transiciones se validan en el backend, no solo en la interfaz. | HU-EMP-01 |
| RG-EST-04 | **Estados finales:** un registro en estado final no cambia de estado. | — |
| RG-EST-05 | **Mismos códigos en todas partes:** base de datos, backend, web, app y pruebas usan los códigos de este documento. Un mismo código puede repetirse en elementos distintos (ej. `CANCELADA` en reserva y en solicitud). | — |
| RG-EST-06 | **Motivo obligatorio** al cancelar una reserva, cancelar un pedido y anular un cargo. Resolver una incidencia exige la descripción de la solución. | HU-REC-05, HU-RS-04, HU-REC-13, HU-MYL-08 |
| RG-EST-07 | **Cambio simultáneo:** si otro usuario ya cambió el estado, la acción se rechaza y se muestra el estado actual (por ejemplo, dos empleados que toman la misma solicitud). | HU-RS-03, HU-MYL-02, HU-MYL-04, HU-MYL-07, HU-REC-07 |
| RG-EST-08 | **Tiempo real solo para 4 eventos** (sección 12). Las demás pantallas se actualizan al abrirlas o al recargar. | D-21 |

---

## 11. Efectos automáticos entre módulos

| Evento | Efectos automáticos | HU |
|---|---|---|
| **Reserva creada** (R1, R2, R3) | Cuenta `ABIERTA` con el cargo por alojamiento; ocupa cupo. Recepción y canal: correo de confirmación. Canal: pago `APROBADO` con método `CANAL` | HU-HUE-05, HU-REC-04, HU-CM-01 |
| **Pago de la reserva aprobado** (R4) | Reserva `CONFIRMADA`; pago `APROBADO`; correo de confirmación | HU-HUE-07 |
| **Vencimiento sin pago** (R5) | Reserva `CANCELADA`; cuenta `CERRADA`; pago `FALLIDO`; cupo liberado (previa comprobación en `VencimientoReservasJob`) | HU-HUE-06 |
| **Check-in** (R6) | Habitación `OCUPADA`; se habilitan las funciones de estadía en portal y app | HU-REC-12 |
| **Cancelación** (R7) | Cuenta `CERRADA`; cupo y habitación liberados; reembolso total en `RECURRENTE` si faltan ≥ 48 h antes de las 15:00 del día de llegada (un pago legado `STRIPE` retorna `PAGO_LEGADO_REQUIERE_CONCILIACION`). Sin correo | HU-REC-05 |
| **Check-out** (R8, en Recepción o en portal/app) | **Pago:** en Recepción, el pago único del saldo (P4) va dentro de la operación; en portal/app, el huésped paga antes con Recurrente (P1, P2) y el check-out solo se confirma con saldo 0. **Luego, en una sola operación:** factura `EMITIDA` (F1) y enviada en PDF por correo · reserva `FINALIZADA` · cuenta `CERRADA` · habitación `LIBRE` + `SUCIA` (C1), o `FUERA_DE_SERVICIO` si tiene una incidencia que impide su uso (C7) · solicitudes `PENDIENTE` o `EN_PROCESO` → `CANCELADA` (Q5) · pedidos `NUEVO` o `EN_PREPARACION` → `CANCELADO`, sin cargo (S6) · el portal/app ya no permite pedidos ni solicitudes · el teléfono deja de recibir notificaciones | HU-REC-14, HU-HUE-16, HU-HUE-17 |
| **Pedido entregado** (S4) | Un solo cargo `VIGENTE`; notificación push al huésped | HU-RS-06, HU-HUE-17 |
| **Solicitud atendida** (Q3) | Notificación push al huésped | HU-MYL-05, HU-HUE-17 |
| **Incidencia que impide el uso** (I1) | Habitación `LIBRE` → `FUERA_DE_SERVICIO`; habitación `OCUPADA` → indicador "Incidencia pendiente". Sin aviso automático a las reservas futuras asignadas: Recepción las ve en el calendario y cambia la habitación | HU-REC-17, HU-MYL-06 |
| **Incidencia resuelta** (I3) | Si era la última que impedía el uso: `FUERA_DE_SERVICIO` → `SUCIA`, o se quita "Incidencia pendiente" | HU-MYL-08 |

**Reglas de los efectos:**

- Si falla el envío de un correo o de una notificación push, el cambio de estado se guarda igual mediante Outbox transaccional (HU-HUE-07, HU-HUE-17).
- Si falla el check-out (por ejemplo, al emitir la factura), no se aplican los cambios del cierre: la reserva sigue `EN_ESTADIA` y la cuenta `ABIERTA`. En Recepción, tampoco se registra el pago de esa operación. Los pagos aprobados previamente se conservan; en portal/app se puede reintentar el check-out y, si el saldo sigue en 0, no se vuelve a cobrar (HU-REC-14, HU-HUE-16).

---

## 12. Tiempo real, notificaciones push y correos

### 12.1 Los 4 eventos en tiempo real

| # | Evento | Transiciones | Pantallas que se actualizan sin recargar | HU |
|---|---|---|---|---|
| 1 | Nuevo pedido | S1 | Cola de Room Service, con aviso visual | HU-RS-01, HU-RS-07 |
| 2 | Cambio de estado del pedido | S2 a S6 | Cola de Room Service y seguimiento del pedido en portal/app | HU-RS-01, HU-HUE-11 |
| 3 | Nueva solicitud | Q1 | Lista de solicitudes de Limpieza, con aviso visual | HU-MYL-04 |
| 4 | Cambio de estado de habitación | O1, O2, C1 a C8 | Estado de las habitaciones (Recepción) y pendientes de limpieza | HU-REC-10, HU-MYL-01 |

**No son de tiempo real:** el calendario Gantt, las solicitudes en portal/app, la cuenta en portal/app, las incidencias y los indicadores. Se actualizan al abrir la pantalla o al recargar.

### 12.2 Notificaciones push (solo con la reserva `EN_ESTADIA`)

| Cuando | Transición | HU |
|---|---|---|
| El pedido pasa a `ENTREGADO` | S4 | HU-HUE-17 |
| La solicitud pasa a `ATENDIDA` | Q3 | HU-HUE-17 |

### 12.3 Matriz de correos implementados y plantillas en el API

La existencia de una plantilla o registro en `outbox_events` no certifica entrega SMTP en un entorno sin servidor de correo configurado:

| Correo / plantilla | Disparador | Destinatario | Propósito y reglas |
|---|---|---|---|
| **Verificación de correo previa a reserva** | Solicitud en el paso «Verifica tu correo» antes de crear la reserva pública | Cliente (correo del formulario) | Valida que el cliente controla el correo antes de emitir el comprobante `X-Booking-Email-Verification` (vigencia de 20 min) asociado a `X-Booking-Draft` |
| **Confirmación de reserva** | R2 (`RECEPCION`), R3 (`CANAL`) y R4 (`PENDIENTE_PAGO → CONFIRMADA`) | Huésped principal | Envía el código `VS-...` y resumen de fechas/tipo. **Nota de implementación actual:** en `ConfirmacionReservaService.java` (`dev`), el indicador `pagado` de la plantilla se calcula por canal (`!RECEPCION`) y no constituye conciliación bancaria del importe aprobado |
| **Código OTP de acceso al portal / app** | Solicitud explícita en `/login` («Obtén tu código de acceso») o en la app móvil (`AccesoHuespedService`) | Huésped principal con al menos una reserva registrada | Código de 6 dígitos, vigencia de 10 minutos y un solo uso. No se envía automáticamente al pagar; el código `VS-...` no es contraseña |
| **Recuperación de contraseña del personal** | Solicitud en «¿Olvidaste tu contraseña?» (`RecuperacionPersonal.java`) | Empleado activo (no aplica al alta inicial ni a huéspedes) | Envía enlace temporal de restablecimiento de un solo uso |
| **Contacto público** | Envío del formulario público de contacto (`POST /api/v1/publico/contacto`) | Buzón operativo / acuse según configuración | Registra y despacha la consulta del visitante sin crear sesión ni reserva |
| **Objetos olvidados** | Registro/actualización en el módulo de objetos olvidados | Huésped / administración según evento | Aviso informativo sobre hallazgo o seguimiento; contrato integral en reconciliación |
| **Factura en PDF** | F1 (dentro del check-out R8) | Huésped principal | Envía los datos de la factura `EMITIDA` y su PDF tras el cierre transaccional |

No se envía correo al cancelar una reserva (HU-REC-05) ni al crear la contraseña temporal inicial de un empleado (se muestra una sola vez en pantalla al `ADMIN`).
