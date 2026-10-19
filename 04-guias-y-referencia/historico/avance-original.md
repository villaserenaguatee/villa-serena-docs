# 17 — Avance del proyecto

> **Cómo se usa:** cuando tu pull request se fusiona, cambia tu casilla de `[ ]` a `[x]` y agrega el número del PR. Si no puedes editarlo, avisa en el grupo y Josué lo marca.
> **Detalle de cada tarea:** documento 13 (Plan de Trabajo), sección 5.

| Objetivo | Meta | Estado |
|---|---|---|
| 0 — Base | Lun 5 | En curso |
| 1 — Reservar | Mié 7 | Pendiente |
| 2 — Recepción | Jue 8 | Pendiente |
| 3A — Estadía y Room Service | Vie 9 | Pendiente |
| 3B — Limpieza y mantenimiento | Vie 9 | Pendiente |
| 4 — Check-out | Vie 9 | Pendiente |
| Integración | Vie 9 | Pendiente |

---

## Objetivo 0 — Base

- [ ] Preparar los 5 repositorios — Alex
- [ ] Docker local: PostgreSQL, Mailpit, MinIO, Prometheus y Grafana (OBJ-0A) — Josué — PR #1 abierto, falta fusionarlo
- [ ] API: proyecto base (OBJ-0B) — Hugo
- [ ] API: esquema de la base de datos (OBJ-0C) — Josué
- [ ] API: datos iniciales (OBJ-0C) — Josué
- [ ] API: seguridad y JWT, login y contraseña temporal (OBJ-0D) — Pablo
- [ ] Contrato del API, objetivos 0 a 2 (vie 2) — Josué, Pablo y Hugo
- [ ] Contrato del API, objetivos 3A a 4 (lun 5) — Josué, Pablo y Hugo
- [ ] Web: proyecto Next.js y BFF (OBJ-0E) — Alex
- [ ] Web: diseño base de la web pública (OBJ-0E) — Kim
- [ ] App: proyecto Expo (OBJ-0F, parte 1) — Carlos
- [ ] App: Firebase, EAS y development build (OBJ-0F, parte 2) — Carlos

## Objetivo 1 — Reservar

- [ ] Diseño breve de la integración con canales — Josué
- [ ] Guía de Stripe CLI — Josué
- [ ] API: información del hotel y catálogo — Josué
- [ ] API: disponibilidad y precio total — Pablo
- [ ] API: crear la reserva y registro común de cargos — Pablo
- [ ] API: Stripe Checkout, webhooks y cancelación a los 30 min — Pablo
- [ ] API: Outbox y correo de confirmación — Hugo
- [ ] API: endpoint del canal — Hugo
- [ ] Web: información del hotel y catálogo — Kim
- [ ] Web: búsqueda y precio total — Kim
- [ ] Web: formulario de datos y paso a Stripe — Kim
- [ ] Web: página del resultado del pago — Alex
- [ ] Web: pantalla del canal simulado — Alex

## Objetivo 2 — Recepción

- [ ] BD: ajustes y reservas de prueba (incluida una en estadía) — Josué
- [ ] API: registrar huésped y huéspedes adicionales — Josué
- [ ] API: búsqueda de reservas y datos del Gantt — Josué
- [ ] API: disponibilidad y creación de reservas desde Recepción — Pablo
- [ ] API: cancelación con reembolso — Pablo
- [ ] API: check-in — Pablo
- [ ] API: asignar habitación, estado de habitaciones y marcar sucia — Hugo
- [ ] Web: calendario Gantt — Kim
- [ ] Web: registro del huésped y creación de la reserva — Kim
- [ ] Web: check-in con huéspedes adicionales — Kim
- [ ] Web: búsqueda, cancelación, asignación y canal de origen — Alex
- [ ] Web: estado de las habitaciones y marcar sucia — Alex
- [ ] Prueba de punta a punta de Recepción — Josué

## Objetivo 3A — Estadía y Room Service

- [ ] BD: ajustes y guía del development build y red local — Josué
- [ ] API: acceso del huésped con código (OTP) — Carlos
- [ ] API: envío de push — Carlos
- [ ] API: mis reservas y detalle de la estadía — Carlos
- [ ] API: menú, pedidos, estados, cancelación, agotado y cargo — Hugo
- [ ] API: WebSocket (4 eventos) — Hugo
- [ ] Web: cola de pedidos en vivo y aviso de pedido nuevo — Alex
- [ ] Web: detalle, avance, cancelación y menú agotado — Alex
- [ ] Web: cliente de tiempo real compartido — Alex
- [ ] App: inicio de sesión con código — Carlos
- [ ] App: mis reservas y estadía — Carlos
- [ ] App: pedir room service — Carlos
- [ ] App: seguir el pedido en vivo — Carlos
- [ ] App: registro del token de push — Carlos

## Objetivo 3B — Limpieza y mantenimiento

- [ ] BD: ajustes — Josué
- [ ] API: solicitudes de limpieza y artículos — Carlos
- [ ] API: limpieza de habitaciones — Hugo
- [ ] API: incidencias con foto — Hugo
- [ ] Web: habitaciones por limpiar — Kim
- [ ] Web: solicitudes (tomar y atender) — Kim
- [ ] Web: incidencias (reportar, tomar y resolver) — Alex
- [ ] App: pedir limpieza o artículos y ver solicitudes — Carlos

## Objetivo 4 — Check-out

- [ ] API: consulta de cuenta y anulación de cargos — Pablo
- [ ] API: check-out con pago único — Pablo
- [ ] API: pago del saldo desde la app — Pablo
- [ ] API: factura (PDF, correlativo y correo) — Hugo
- [ ] Web: cuenta y cargos — Kim
- [ ] Web: check-out, factura e impresión — Kim
- [ ] App: ver mi cuenta — Carlos
- [ ] App: pagar el saldo y hacer el check-out — Carlos

## Integración (viernes 9)

- [ ] Flujo completo en Docker: reservar → check-in → estadía → operación → check-out — Todos
- [ ] Ensayo de la demostración (sábado 10) — Todos
