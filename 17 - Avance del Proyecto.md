# 17 — Avance del proyecto

> **Cómo se usa:** cada línea empieza con el código de su prompt (por ejemplo **OBJ-1B**). Cada pull request se abre con un título que empieza con ese código. Una vez al día, Josué le pide a Claude Code que revise los PR fusionados y marque las casillas (`[ ]` → `[x]`) con el número del PR (guía `00 - Como usar los prompts.md`, sección 10). Nadie más tiene que editar este archivo.
> **Detalle de cada tarea:** documento 13 (Plan de Trabajo), sección 5.

| Objetivo | Meta | Estado |
|---|---|---|
| 0 — Base | Lun 5 | En curso (Josué: terminado) |
| 1 — Reservar | Mié 7 | Pendiente |
| 2 — Recepción | Jue 8 | Pendiente |
| 3A — Estadía y Room Service | Vie 9 | Pendiente |
| 3B — Limpieza y mantenimiento | Vie 9 | Pendiente |
| 4 — Check-out | Vie 9 | Pendiente |
| Integración | Vie 9 | Pendiente |

---

## Objetivo 0 — Base

- [ ] **PREP** · Preparar los 5 repositorios — Alex
- [x] **OBJ-0A** · Docker local: PostgreSQL, Mailpit, MinIO, Prometheus y Grafana — Josué — infra PR #1
- [ ] **OBJ-0B** · API: proyecto base — Hugo
- [x] **OBJ-0C** · API: esquema de la base de datos — Josué — api PR #3
- [x] **OBJ-0C** · API: datos iniciales — Josué — api PR #3
- [ ] **OBJ-0D** · API: seguridad y JWT, login y contraseña temporal — Pablo
- [ ] **OBJ-0G** · Contrato del API, objetivos 0 a 2 (vie 2) — Josué, Pablo y Hugo — api PR #2 abierto, falta la revisión de Pablo y Hugo
- [ ] **OBJ-0G** · Contrato del API, objetivos 3A a 4 (lun 5) — Josué, Pablo y Hugo
- [ ] **OBJ-0E** · Web: proyecto Next.js y BFF — Alex
- [ ] **OBJ-0E** · Web: diseño base de la web pública — Kim
- [ ] **OBJ-0F** · App: proyecto Expo (parte 1) — Carlos
- [ ] **OBJ-0F** · App: Firebase, EAS y development build (parte 2) — Carlos

## Objetivo 1 — Reservar

- [x] **OBJ-1A** · Diseño breve de la integración con canales — Josué — docs PR #5
- [x] **OBJ-1A** · Guía de Stripe CLI — Josué — docs PR #5
- [ ] **OBJ-1A** · API: información del hotel y catálogo — Josué
- [ ] **OBJ-1B** · API: disponibilidad y precio total — Pablo
- [ ] **OBJ-1B** · API: crear la reserva y registro común de cargos — Pablo
- [ ] **OBJ-1B** · API: Stripe Checkout, webhooks y cancelación a los 30 min — Pablo
- [ ] **OBJ-1C** · API: Outbox y correo de confirmación — Hugo
- [ ] **OBJ-1C** · API: endpoint del canal — Hugo
- [ ] **OBJ-1D** · Web: información del hotel y catálogo — Kim
- [ ] **OBJ-1D** · Web: búsqueda y precio total — Kim
- [ ] **OBJ-1D** · Web: formulario de datos y paso a Stripe — Kim
- [ ] **OBJ-1E** · Web: página del resultado del pago — Alex
- [ ] **OBJ-1E** · Web: pantalla del canal simulado — Alex

## Objetivo 2 — Recepción

- [ ] **OBJ-2A** · BD: ajustes y reservas de prueba (incluida una en estadía) — Josué
- [ ] **OBJ-2A** · API: registrar huésped y huéspedes adicionales — Josué
- [ ] **OBJ-2A** · API: búsqueda de reservas y datos del Gantt — Josué
- [ ] **OBJ-2B** · API: disponibilidad y creación de reservas desde Recepción — Pablo
- [ ] **OBJ-2B** · API: cancelación con reembolso — Pablo
- [ ] **OBJ-2B** · API: check-in — Pablo
- [ ] **OBJ-2C** · API: asignar habitación, estado de habitaciones y marcar sucia — Hugo
- [ ] **OBJ-2D** · Web: calendario Gantt — Kim
- [ ] **OBJ-2D** · Web: registro del huésped y creación de la reserva — Kim
- [ ] **OBJ-2D** · Web: check-in con huéspedes adicionales — Kim
- [ ] **OBJ-2E** · Web: búsqueda, cancelación, asignación y canal de origen — Alex
- [ ] **OBJ-2E** · Web: estado de las habitaciones y marcar sucia — Alex
- [ ] **OBJ-2A** · Prueba de punta a punta de Recepción — Josué

## Objetivo 3A — Estadía y Room Service

- [ ] **OBJ-2A** · BD: ajustes y guía del development build y red local — Josué
- [ ] **OBJ-3A-2** · API: acceso del huésped con código (OTP) — Carlos
- [ ] **OBJ-3A-2** · API: envío de push — Carlos
- [ ] **OBJ-3A-2** · API: mis reservas y detalle de la estadía — Carlos
- [ ] **OBJ-3A-1** · API: menú, pedidos, estados, cancelación, agotado y cargo — Hugo
- [ ] **OBJ-3A-1** · API: WebSocket (4 eventos) — Hugo
- [ ] **OBJ-3A-3** · Web: cola de pedidos en vivo y aviso de pedido nuevo — Alex
- [ ] **OBJ-3A-3** · Web: detalle, avance, cancelación y menú agotado — Alex
- [ ] **OBJ-3A-3** · Web: cliente de tiempo real compartido — Alex
- [ ] **OBJ-3A-4** · App: inicio de sesión con código — Carlos
- [ ] **OBJ-3A-4** · App: mis reservas y estadía — Carlos
- [ ] **OBJ-3A-4** · App: pedir room service — Carlos
- [ ] **OBJ-3A-4** · App: seguir el pedido en vivo — Carlos
- [ ] **OBJ-3A-4** · App: registro del token de push — Carlos

## Objetivo 3B — Limpieza y mantenimiento

- [ ] **OBJ-2A** · BD: ajustes — Josué
- [ ] **OBJ-3B-2** · API: solicitudes de limpieza y artículos — Carlos
- [ ] **OBJ-3B-1** · API: limpieza de habitaciones — Hugo
- [ ] **OBJ-3B-1** · API: incidencias con foto — Hugo
- [ ] **OBJ-3B-3** · Web: habitaciones por limpiar — Kim
- [ ] **OBJ-3B-3** · Web: solicitudes (tomar y atender) — Kim
- [ ] **OBJ-3B-4** · Web: incidencias (reportar, tomar y resolver) — Alex
- [ ] **OBJ-3B-2** · App: pedir limpieza o artículos y ver solicitudes — Carlos

## Objetivo 4 — Check-out

- [ ] **OBJ-4A** · API: consulta de cuenta y anulación de cargos — Pablo
- [ ] **OBJ-4A** · API: check-out con pago único — Pablo
- [ ] **OBJ-4A** · API: pago del saldo desde la app — Pablo
- [ ] **OBJ-4B** · API: factura (PDF, correlativo y correo) — Hugo
- [ ] **OBJ-4C** · Web: cuenta y cargos — Kim
- [ ] **OBJ-4C** · Web: check-out, factura e impresión — Kim
- [ ] **OBJ-4D** · App: ver mi cuenta — Carlos
- [ ] **OBJ-4D** · App: pagar el saldo y hacer el check-out — Carlos

## Integración (viernes 9)

- [ ] **OBJ-INT** · Flujo completo en Docker: reservar → check-in → estadía → operación → check-out — Todos
- [ ] **OBJ-INT** · Ensayo de la demostración (sábado 10) — Todos
