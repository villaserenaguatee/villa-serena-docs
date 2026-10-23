# Guion de Validación del Flujo MVP (`v0.1.0`) con Recurrente

Guía operativa para validar de punta a punta el flujo crítico del MVP (`v0.1.0`) definido en el [roadmap por versiones](../01-metodologia/roadmap-versiones.md), sustituyendo el guion histórico [`OBJ-INT`](historial-prompts/OBJ-INT%20-%20Integracion%20y%20prueba%20del%20flujo%20completo.md) que mezclaba capacidades de tres fases distintas y utilizaba Stripe.

> **Alcance de este documento:** proporciona el guion reproducible, la separación por versión de los 18 pasos del antiguo `OBJ-INT`, las precondiciones de entorno sin secretos y la matriz para registrar commits y evidencias de ejecución ([issue #13](https://github.com/villaserenaguatee/villa-serena-docs/issues/13)). La existencia de esta guía no sustituye la ejecución real en un entorno con Recurrente Sandbox activo.

---

## 1. Precondiciones y versiones de referencia

Antes de iniciar el recorrido, registra la revisión exacta de cada repositorio que se somete a prueba:

| Repositorio | Rama / entorno | Commit SHA de referencia inspeccionado | Estado de contrato (`api-contract.json`) |
|---|---|---|---|
| `villa-serena-docs` | `main` | `77225a11d06daf576a404e2a557185868bd49c56` | Fuente canónica (`openapi.yaml`) |
| `villa-serena-web` | `main` (local o Vercel) | `e1fd581f27e5909001efd3bf4c88d7b7fee59aee` | `77225a11d06daf576a404e2a557185868bd49c56` |
| `villa-serena-api` | `dev` / `main` (local o AWS) | `652eea19d09875f30671a3a6919be47d040f14e1` (`dev`) / `4d08eea9c61056269a2f24512aade2124a4f9ebf` (`main`) | `f30ff74fe939d467728c51c31d7aca157b3be34e` |
| `villa-serena-infra` | `main` | `d78f690046f28dcca2b333bd0d154703126a6665` | — |

### Servicios y variables requeridas (sin publicar secretos)

1. **Base de datos y correo de prueba:**
   - En entorno local ([`arranque-local.md`](arranque-local.md)): PostgreSQL 17 y Mailpit activos (`docker compose -f docker-compose.dev.yml up -d`).
   - Migraciones Flyway (`V1` a `V29`) aplicadas automáticamente al arrancar el API con perfil `local` o `dev`.
   - Datos base cargados de forma explícita con `scripts/demo/load-data.sql` (sobre una instancia local limpia) o primer `ADMIN` inicializado mediante `BOOTSTRAP_ADMIN_ENABLED=true`. **Nunca** ejecutar `load-data.sql` sobre la base de producción.
2. **Pasarela Recurrente Sandbox ([ADR-017](../03-arquitectura/adr/ADR-017-pasarela-recurrente.md)):**
   - Claves privadas de Sandbox configuradas únicamente en el backend (`RECURRENTE_PUBLIC_KEY`, `RECURRENTE_SECRET_KEY`, `RECURRENTE_WEBHOOK_SECRET`).
   - Webhook de Recurrente apuntando a `POST /api/v1/webhooks/recurrente` (con encabezados firmados por Svix: `svix-id`, `svix-timestamp`, `svix-signature`).
   - **Nota:** las pruebas antiguas ejecutadas con Stripe (`stripe-cli.md`, conservada como referencia histórica) no acreditan la validación de Recurrente.
3. **Frontend web en modo conectado al API:**
   - `VILLA_SERENA_BFF_MODE=api`, `STAFF_AUTH_MODE=spring` y `GUEST_AUTH_MODE=spring`. Los modos demo locales no acreditan integración real.

---

## 2. Separación entre el flujo MVP (`v0.1.0`) y versiones posteriores (`OBJ-INT` histórico)

El guion histórico `OBJ-INT` contenía 18 pasos. La tabla siguiente clasifica cuáles pertenecen al **MVP (`v0.1.0`)** y cuáles corresponden a **`v0.2.0`** o **`v0.3.0`** (que no bloquean el cierre de `v0.1.0`):

| Paso en `OBJ-INT` histórico | Descripción resumida | Versión vigente | ¿Exigido en `v0.1.0`? |
|---|---|---|---|
| **Paso 1** | Catálogo público, búsqueda de fechas y cotización con desglose | `v0.1.0` | **Sí** |
| **Paso 2** | Formulario de reserva pública, verificación de correo y pago 100 % en **Recurrente Sandbox** | `v0.1.0` | **Sí** (adaptado a Recurrente) |
| **Paso 3** | Correo de confirmación con código `VS-...` vía Outbox / Mailpit | `v0.1.0` | **Sí** |
| **Paso 4** | Recepción de reserva desde el canal externo simulado (`201` y reenvío idempotente `200`) | `v0.3.0` | No (`v0.3.0` — Canales externos) |
| **Paso 5 (parcial)** | Login de Recepción y búsqueda de la reserva (`Llegan hoy`, código o documento) | `v0.1.0` | **Sí** (búsqueda y filtros; el calendario Gantt es `v0.2.0`) |
| **Paso 6** | Alta de reserva en Recepción y cancelación de reserva confirmada elegible (≥ 48 h) con reembolso en Recurrente | `v0.1.0` | **Sí** (adaptado a Recurrente) |
| **Paso 7** | Asignar habitación `LIBRE` + `LIMPIA` y ejecutar check-in → `EN_ESTADIA` + `OCUPADA` | `v0.1.0` | **Sí** |
| **Paso 8** | Acceso del huésped por correo + código OTP de 6 dígitos | `v0.1.0` (portal `/portal`) / `v0.2.0` (app Android) | **Sí** en portal web; app Android en `v0.2.0` |
| **Pasos 9, 10 y 11** | Pedidos de Room Service en vivo, solicitudes de limpieza/artículos y notificaciones push Expo/FCM | `v0.2.0` | No (`v0.2.0` — Operativa y Móvil) |
| **Pasos 12 y 13** | Operación de limpieza en vivo e incidencias de mantenimiento con foto (`FUERA_DE_SERVICIO` → `SUCIA`) | `v0.2.0` | No (`v0.2.0` — Mantenimiento y Pisos) |
| **Paso 14** | Recepción consulta la cuenta, agrega un cargo adicional `VIGENTE`, anula otro con motivo y verifica el saldo | `v0.1.0` | **Sí** |
| **Paso 15** | Check-out con pago único del saldo → factura `EMITIDA`, vista de impresión (80 mm / carta) y PDF por correo | `v0.1.0` | **Sí** |
| **Paso 16** | Reserva `FINALIZADA`, cuenta `CERRADA` y habitación `LIBRE` + `SUCIA` | `v0.1.0` | **Sí** |
| **Paso 17** | Dashboard de métricas en Prometheus y Grafana | `v0.3.0` | No (`v0.3.0` — Analítica y Observabilidad) |
| **Paso 18** | Verificación de seguridad BFF: el JWT no se expone al navegador (cookies `httpOnly`) | `v0.1.0` | **Sí** |

---

## 3. Guion paso a paso para validar `v0.1.0`

| # | Paso de validación (`v0.1.0`) | Operación / Ruta involucrada | Resultado esperado | Estado / Evidencia |
|---|---|---|---|---|
| **MVP-01** | **Catálogo y disponibilidad pública:** abrir `/catalogo`, elegir fechas válidas (`fechaEntrada < fechaSalida`) y número de huéspedes. | `GET /api/v1/publico/ofertas` o `GET /api/v1/publico/tipos-habitacion/disponibles` | Muestra ofertas/tipos con capacidad suficiente y cotización en GTQ calculada por el servidor. | `[ ]` Pendiente de ejecución |
| **MVP-02** | **Verificación de correo y creación de reserva (`PENDIENTE_PAGO`):** completar datos del titular (nombre, correo, teléfono `+502`, DPI), verificar el correo y confirmar la creación. | Encabezados `Idempotency-Key`, `X-Booking-Draft` y `X-Booking-Email-Verification` → `POST /api/v1/publico/reservas` (o `/ofertas/{codigo}/reservas`) | Se crea la reserva en `PENDIENTE_PAGO` con código `VS-...`, cuenta `ABIERTA` y cargo por alojamiento `VIGENTE`. Ante corte de red, `GET /api/v1/publico/reservas/intento` recupera la misma reserva sin duplicarla. | `[ ]` Pendiente de ejecución |
| **MVP-03** | **Checkout alojado en Recurrente y confirmación por backend:** iniciar el pago, completar el cobro en Recurrente Sandbox y volver a `/reserva/resultado`. | `POST /api/v1/publico/reservas/{id}/pago`, `POST /api/v1/webhooks/recurrente` (Svix) y `GET /api/v1/publico/reservas/{id}/pago` | El webhook firmado por Svix (o la conciliación de `ConsultaProcesoPago`) registra el pago `APROBADO` (`metodo=RECURRENTE`), cambia la reserva a `CONFIRMADA` y encola el correo en `outbox_events`. La simple URL de retorno no confirma por sí sola la reserva. | `[ ]` Pendiente de ejecución |
| **MVP-04** | **Correo de confirmación y acceso al portal (`/portal`):** revisar el correo recibido en Mailpit/SMTP y entrar en `/login` con «Obtén tu código de acceso». | `POST /api/v1/huesped/auth/codigo` y `POST /api/v1/huesped/auth/verificar` | Llega el OTP de 6 dígitos (vigencia 10 min, un solo uso). El huésped entra a `/portal` y visualiza su reserva `CONFIRMADA` y su cuenta `ABIERTA` con saldo `0.00`. | `[ ]` Pendiente de ejecución |
| **MVP-05** | **Recepción — login, seguridad BFF y búsqueda:** iniciar sesión como `RECEPCION` en `/login` y buscar la reserva con el filtro «Llegan hoy» o por código `VS-...`. | `POST /api/v1/auth/login`, `GET /api/v1/reservas` | El personal entra a su panel; en DevTools → Application/Storage las cookies de sesión son `httpOnly` y el JWT no está expuesto en `localStorage`/`sessionStorage`. | `[ ]` Pendiente de ejecución |
| **MVP-06** | **Recepción — alta directa y cancelación con reembolso Recurrente:** crear una reserva desde Recepción (`CONFIRMADA` sin cobro previo) y cancelar una reserva web `CONFIRMADA` con ≥ 48 h antes de las 15:00 del día de llegada. | `POST /api/v1/reservas`, `POST /api/v1/reservas/{id}/cancelar` | La reserva cancelada pasa a `CANCELADA`, su cuenta a `CERRADA`, libera cupo y el pago `RECURRENTE` pasa a `REEMBOLSADO`. | `[ ]` Pendiente de ejecución |
| **MVP-07** | **Asignación de habitación y check-in:** en la reserva activa del día de hoy, asignar una habitación `LIBRE` + `LIMPIA` del tipo reservado y ejecutar el check-in. | `PUT /api/v1/reservas/{id}/habitacion` y `POST /api/v1/reservas/{id}/check-in` | La reserva cambia a `EN_ESTADIA` y la habitación a `OCUPADA`. Se registra el cambio en el historial con fecha, hora y responsable. | `[ ]` Pendiente de ejecución |
| **MVP-08** | **Cuenta, cargos adicionales y saldo:** agregar dos cargos de servicio adicional en la cuenta `ABIERTA` y anular uno de ellos indicando motivo obligatorio. | `GET /api/v1/reservas/{id}/cuenta`, `POST /api/v1/reservas/{id}/cuenta/cargos`, `POST /api/v1/reservas/{id}/cuenta/cargos/{cargoId}/anular` | El cargo anulado permanece visible como `ANULADO` sin sumar al saldo; el cargo por alojamiento no permite anulación; el saldo refleja exactamente `VIGENTE - APROBADO`. | `[ ]` Pendiente de ejecución |
| **MVP-09** | **Check-out atómico y emisión de factura (`EMITIDA`):** registrar el pago único del saldo pendiente y confirmar el check-out indicando NIT válido o `CF` y nombre del comprador. | `POST /api/v1/reservas/{id}/check-out` y `GET /api/v1/reservas/{id}/factura` | En una sola transacción: saldo queda en `0.00`, se emite la única factura `EMITIDA` con correlativo consecutivo, la reserva pasa a `FINALIZADA`, la cuenta a `CERRADA` y la habitación a `LIBRE` + `SUCIA`. | `[ ]` Pendiente de ejecución |
| **MVP-10** | **Impresión (80 mm / carta) y correo de factura:** abrir la vista de impresión de la factura en Recepción (80 mm y hoja carta), descargar el PDF y verificar el correo en Mailpit/SMTP. | Vista de impresión del navegador y `outbox_events` | La factura muestra la leyenda de factura de demostración e «IVA incluido» sin marca «COPIA»; reimprimir no altera estados ni crea otra factura. | `[ ]` Pendiente de ejecución |

---

## 4. Plantilla de registro de fallos y bloqueos

Cuando algún paso falle durante el ensayo, regístralo en la issue del repositorio correspondiente (`villa-serena-api`, `villa-serena-web` o `villa-serena-infra`) y enlázalo en [#13](https://github.com/villaserenaguatee/villa-serena-docs/issues/13) con este formato (sin incluir claves ni tokens):

```text
Paso: MVP-XX (<nombre del paso>)
Revisiones probadas: api=<sha>, web=<sha>, docs=<sha>
Acción ejecutada: <ruta/pantalla y datos ficticios usados>
Resultado observado: <código HTTP / mensaje en pantalla / estado en BD>
Resultado esperado: <según la tabla de la sección 3>
Issue enlazada y frente responsable: <URL de la issue — Backend / Frontend / Infra>
```
