# Guion de Validación del Flujo MVP (`v0.1.0`) con Recurrente

Guía operativa para validar de punta a punta el flujo crítico del MVP (`v0.1.0`) definido en el [roadmap por versiones](../01-metodologia/roadmap-versiones.md), sustituyendo el guion histórico [`OBJ-INT`](historial-prompts/OBJ-INT%20-%20Integracion%20y%20prueba%20del%20flujo%20completo.md) que mezclaba capacidades de tres fases distintas, utilizaba Stripe y fijaba las fechas vencidas del 9 y 10 de octubre.

> **Alcance de este documento:** proporciona el guion reproducible con las rutas exactas de [`openapi.yaml`](../openapi.yaml), la separación por versión de los 18 pasos del antiguo `OBJ-INT`, el estado real de la migración a Recurrente (`API #54` y `Web #61`), la cobertura automatizada existente y la matriz para registrar el ensayo en vivo ([issue #13](https://github.com/villaserenaguatee/villa-serena-docs/issues/13)). La existencia de esta guía y de las pruebas automatizadas no sustituye el ensayo manual en equipo con Recurrente Sandbox activo; la fecha del ensayo se acuerda según la disponibilidad actual del equipo, sin reutilizar las fechas vencidas del 9 y 10 de octubre ni el compromiso antiguo de 3 horas por persona.

---

## 1. Precondiciones, versiones de referencia y estado de migración a Recurrente

Antes de iniciar el recorrido, registra la revisión exacta de cada repositorio que se somete a prueba:

| Repositorio | Rama / entorno | Commit SHA de referencia inspeccionado | Estado de contrato (`api-contract.json`) |
|---|---|---|---|
| `villa-serena-docs` | `main` | `8bf74fd` (rama `main` vigente) | Fuente canónica ([`openapi.yaml`](../openapi.yaml)) |
| `villa-serena-web` | `main` (local o Vercel) | `e1fd581f27e5909001efd3bf4c88d7b7fee59aee` | `77225a11d06daf576a404e2a557185868bd49c56` |
| `villa-serena-api` | `dev` / `main` (local o AWS) | `5152025` (`dev` local) / `652eea19d09875f30671a3a6919be47d040f14e1` (`origin/dev`) | `f30ff74fe939d467728c51c31d7aca157b3be34e` |
| `villa-serena-infra` | `main` | `d78f690046f28dcca2b333bd0d154703126a6665` | — |

### Estado real de la migración a Recurrente ([ADR-017](../03-arquitectura/adr/ADR-017-pasarela-recurrente.md))
- **Contrato OpenAPI (`villa-serena-docs/openapi.yaml`):** migrado a Recurrente (`POST /api/v1/pagos/recurrente/webhook` con cabeceras Svix `svix-id`, `svix-timestamp`, `svix-signature`; consulta de proceso `GET /api/v1/publico/reservas/{codigo}/estado` y `GET /api/v1/app/reservas/{codigo}/pago-saldo/estado`; `MetodoPago` incluye `RECURRENTE` y conserva `STRIPE` solo para registros históricos con código `PAGO_LEGADO_REQUIERE_CONCILIACION`).
- **Backend (`villa-serena-api` — [API #54](https://github.com/villaserenaguatee/villa-serena-api/issues/54)):** implementado y cubierto por pruebas de integración (`PasarelaRecurrenteClientTest`, `MigracionRecurrenteTest`, `ConsultaProcesoPagoTest`). La simple redirección del navegador nunca confirma el pago.
- **Frontend web (`villa-serena-web` — [Web #61](https://github.com/villaserenaguatee/villa-serena-web/issues/61)):** flujo de reserva pública, redirección al checkout alojado (`urlPago`), recuperación de intento (`GET /api/v1/publico/reservas/intento`) y consulta de estado (`GET /api/v1/publico/reservas/{codigo}/estado`) reconciliados en [`recorridos-web.md`](recorridos-web.md) y [`reconciliacion-frontend-20261022.md`](../02-producto/reconciliacion-frontend-20261022.md).
- **Herramientas históricas de Stripe:** la [guía de Stripe CLI](stripe-cli.md) se conserva exclusivamente como referencia histórica del proveedor anterior. Un resultado obtenido con Stripe o en modo demo desconectado no acredita la validación de Recurrente.

### Servicios y variables requeridas en entorno limpio (sin publicar secretos)

1. **Base de datos y correo de prueba ([`arranque-local.md`](arranque-local.md)):**
   - Para verificar desde un entorno limpio sin perder datos locales de trabajo, utiliza una base de prueba limpia o respalda antes el volumen local; levanta PostgreSQL 17 y Mailpit (`docker compose -f docker-compose.dev.yml up -d`).
   - Al iniciar el API con perfil `local` o `dev`, Flyway aplica automáticamente las migraciones de esquema (`V1` a `V29`) dejando las tablas de negocio vacías y `/actuator/health` en `UP`.
   - Carga explícitamente los datos de prueba con `scripts/demo/load-data.sql` (con `BOOTSTRAP_ADMIN_ENABLED=false`) o inicializa el primer `ADMIN` con `BOOTSTRAP_ADMIN_ENABLED=true`. **Nunca** ejecutar `load-data.sql` en producción.
2. **Pasarela Recurrente Sandbox ([ADR-017](../03-arquitectura/adr/ADR-017-pasarela-recurrente.md)):**
   - Claves privadas de Sandbox configuradas únicamente en el entorno del backend (`RECURRENTE_PUBLIC_KEY`, `RECURRENTE_SECRET_KEY`, `RECURRENTE_WEBHOOK_SECRET`).
   - Webhook de Recurrente apuntando a `POST /api/v1/pagos/recurrente/webhook` (con encabezados firmados por Svix: `svix-id`, `svix-timestamp`, `svix-signature`). Si el API corre en una computadora local, se utiliza un túnel HTTPS temporal acordado por el equipo hacia el puerto `8080`.
3. **Frontend web en modo conectado al API:**
   - `VILLA_SERENA_BFF_MODE=api`, `STAFF_AUTH_MODE=spring` y `GUEST_AUTH_MODE=spring`. Los modos demo locales del BFF no acreditan integración real.

---

## 2. Separación entre el flujo MVP (`v0.1.0`) y versiones posteriores (`OBJ-INT` histórico)

El guion histórico [`OBJ-INT`](historial-prompts/OBJ-INT%20-%20Integracion%20y%20prueba%20del%20flujo%20completo.md) contenía 18 pasos sin marcar. La tabla siguiente clasifica cuáles pertenecen al **MVP (`v0.1.0`)** y cuáles corresponden a **`v0.2.0`** o **`v0.3.0`** (que no son requisitos para validar ni cerrar `v0.1.0`):

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

## 3. Guion paso a paso para validar `v0.1.0` y evidencia reproducible

Cada paso indica la ruta exacta de [`openapi.yaml`](../openapi.yaml), el resultado esperado, la suite de integración automatizada que lo verifica en `villa-serena-api` / `villa-serena-docs` y la casilla para el ensayo manual en vivo:

| # | Paso de validación (`v0.1.0`) | Operación / Ruta en `openapi.yaml` | Resultado esperado | Cobertura automatizada reproducible (`api` / `docs`) | Estado del ensayo manual |
|---|---|---|---|---|---|
| **MVP-01** | **Catálogo y disponibilidad pública:** abrir `/ofertas` o el buscador de fechas (`entrada < salida`) y número de huéspedes. | `GET /api/v1/publico/ofertas`, `GET /api/v1/publico/ofertas/disponibilidad`, `GET /api/v1/publico/tipos-habitacion`, `GET /api/v1/publico/disponibilidad` | Muestra ofertas/tipos `ACTIVO` con capacidad suficiente y cotización en GTQ calculada por el servidor (`inventarioCompartido` cuando aplica). | `CatalogoPublicoIntegrationTest` (`api`) · `contrato-api.test.mjs` (`docs`) | `[ ]` Pendiente de ensayo en vivo |
| **MVP-02** | **Verificación de correo y creación de reserva (`PENDIENTE_PAGO`):** completar datos del titular (nombre, correo, teléfono, documento y `horaEstimadaLlegada` opcional), verificar el correo y crear la reserva. | Encabezados `Idempotency-Key`, `X-Booking-Draft` y `X-Booking-Email-Verification` → `POST /api/v1/publico/reservas` o `POST /api/v1/publico/ofertas/{slug}/reservas`; recuperación en `GET /api/v1/publico/reservas/intento` | Crea la reserva en `PENDIENTE_PAGO` con código `VS-...`, ventana de 30 min (`pagoVenceEn`), cuenta `ABIERTA` y cargo de alojamiento `VIGENTE`. Ante corte de red recupera la misma reserva sin duplicarla. | `ReservaWebIntegrationTest`, `RecuperacionReservaIntegrationTest`, `HoraEstimadaLlegadaIntegrationTest` (`api`) | `[ ]` Pendiente de ensayo en vivo |
| **MVP-03** | **Checkout alojado en Recurrente y confirmación por webhook Svix:** iniciar el pago, completar el cobro en Recurrente Sandbox y volver a la pantalla de confirmación. | `POST /api/v1/publico/reservas/{codigo}/pago`, `POST /api/v1/pagos/recurrente/webhook` (`svix-id`, `svix-timestamp`, `svix-signature`) y `GET /api/v1/publico/reservas/{codigo}/estado` | El webhook firmado por Svix (o la conciliación de `ConsultaProcesoPago`) registra el pago `APROBADO` (`metodo=RECURRENTE`), pasa la reserva a `CONFIRMADA` y encola el correo en `outbox_events`. El retorno del navegador no aprueba pagos por sí solo. | `MigracionRecurrenteTest`, `PasarelaRecurrenteClientTest`, `ConsultaProcesoPagoTest` (`api`) | `[ ]` Pendiente de ensayo en vivo |
| **MVP-04** | **Correo de confirmación y acceso al portal (`/portal`):** verificar el correo en Mailpit/SMTP y entrar con correo + código OTP de 6 dígitos. | `POST /api/v1/app/acceso/solicitar-codigo`, `POST /api/v1/app/acceso/verificar-codigo`, `GET /api/v1/app/reservas`, `GET /api/v1/app/reservas/{codigo}/cuenta` | Llega el OTP de 6 dígitos (vigencia 10 min, un solo uso, máx. 5 intentos). El huésped entra a `/portal` y consulta su reserva `CONFIRMADA` y su cuenta `ABIERTA` con saldo `0.00`. | `OutboxIntegrationTest`, `AccesoHuespedIntegrationTest`, `AccesoUnificadoTest` (`api`) | `[ ]` Pendiente de ensayo en vivo |
| **MVP-05** | **Recepción — login, seguridad BFF y búsqueda:** iniciar sesión como `RECEPCION` y buscar la reserva con el filtro «Llegan hoy», por código `VS-...` o por documento/apellido. | `POST /api/v1/auth/login`, `GET /api/v1/reservas`, `GET /api/v1/reservas/{codigo}` | El personal entra al panel; en DevTools → Application/Storage las cookies de sesión son `httpOnly` y el JWT no está en `localStorage`/`sessionStorage`. | `AuthIntegrationTest`, `AuthHardeningTest`, `BusquedaRecepcionIntegrationTest` (`api`) | `[ ]` Pendiente de ensayo en vivo |
| **MVP-06** | **Recepción — alta directa y cancelación con reembolso Recurrente:** crear una reserva desde Recepción (`CONFIRMADA` sin cobro previo) y cancelar una reserva web `CONFIRMADA` elegible (≥ 48 h antes de las 15:00 del día de llegada). | `POST /api/v1/reservas`, `GET /api/v1/reservas/{codigo}/cancelacion`, `POST /api/v1/reservas/{codigo}/cancelar` | La reserva cancelada pasa a `CANCELADA`, su cuenta a `CERRADA`, libera cupo y el pago `RECURRENTE` pasa a `REEMBOLSADO`. Pagos históricos `STRIPE` responden `PAGO_LEGADO_REQUIERE_CONCILIACION`. | `RecepcionIntegrationTest`, `MigracionRecurrenteTest` (`api`) | `[ ]` Pendiente de ensayo en vivo |
| **MVP-07** | **Asignación de habitación y check-in:** en la reserva activa del día de llegada, asignar una habitación `LIBRE` + `LIMPIA` del tipo reservado y ejecutar el check-in. | `GET /api/v1/habitaciones/disponibles`, `PUT /api/v1/reservas/{codigo}/habitacion`, `POST /api/v1/reservas/{codigo}/check-in` | La reserva pasa a `EN_ESTADIA` y la habitación a `OCUPADA`, registrando el cambio en `state_history` con fecha, hora y empleado responsable. | `RecepcionIntegrationTest`, `AsignacionConcurrenteTest`, `HabitacionesIntegrationTest` (`api`) | `[ ]` Pendiente de ensayo en vivo |
| **MVP-08** | **Cuenta, cargos adicionales y saldo:** agregar dos cargos de servicio adicional en la cuenta `ABIERTA` y anular uno de ellos indicando motivo obligatorio. | `GET /api/v1/cuentas/{codigo}`, `POST /api/v1/cuentas/{codigo}/cargos`, `POST /api/v1/cuentas/{codigo}/cargos/{id}/anular` | El cargo anulado permanece en la cuenta como `ANULADO` sin sumar al saldo; el cargo de alojamiento no permite anulación; el saldo es `VIGENTE − APROBADO`. | `CheckoutIntegrationTest` (`api`) | `[ ]` Pendiente de ensayo en vivo |
| **MVP-09** | **Check-out atómico y emisión de factura (`EMITIDA`):** liquidar el saldo pendiente (en Recepción o vía `POST /api/v1/app/reservas/{codigo}/pago-saldo` con Recurrente) y confirmar el check-out con NIT válido o `CF`. | `POST /api/v1/checkout/{codigo}` (Recepción) o `POST /api/v1/app/reservas/{codigo}/checkout` (Huésped); `GET /api/v1/facturas/{id}` | En una sola transacción: saldo en `0.00`, única factura `EMITIDA` con correlativo consecutivo sin saltos, reserva `FINALIZADA`, cuenta `CERRADA` y habitación `LIBRE` + `SUCIA`. Si algo falla, hace rollback completo conservando pagos previos aprobados. | `CheckoutIntegrationTest`, `CheckoutRollbackTest`, `NitTest`, `FacturaIntegrationTest` (`api`) | `[ ]` Pendiente de ensayo en vivo |
| **MVP-10** | **PDF privado, impresión (80 mm / carta) y correo de factura:** consultar el PDF con URL firmada de corta duración, abrir la vista de impresión (80 mm y carta) y verificar el envío por correo en Mailpit/SMTP. | `GET /api/v1/facturas/{id}/pdf`, `GET /api/v1/app/reservas/{codigo}/factura` y cola `outbox_events` | La factura incluye la leyenda de demostración sin validez fiscal e «IVA incluido» sin marca «COPIA»; imprimir o reimprimir no altera estados ni emite otra factura. | `FacturaIntegrationTest`, `FacturaCorreoMailpitTest`, `AlmacenS3Test` (`api`) | `[ ]` Pendiente de ensayo en vivo |

---

## 4. Comandos de verificación automatizada y plantilla de registro del ensayo

### Comprobación automatizada previa al ensayo en vivo
```bash
# 1.En villa-serena-docs: validar contrato OpenAPI, tipos generados y enlaces Markdown
node scripts/contrato-api.mjs validate && node --test scripts/contrato-api.test.mjs

# 2. En villa-serena-api: ejecutar la suite de pruebas de integración con PostgreSQL (Testcontainers)
./mvnw -B verify
```

### Plantilla para registrar el ensayo en vivo, fallos o bloqueos en [#13](https://github.com/villaserenaguatee/villa-serena-docs/issues/13)
Cuando se ejecute el ensayo acordado por el equipo o se detecte un fallo en cualquiera de los pasos `MVP-01` a `MVP-10`, abre la issue en el repositorio correspondiente (`villa-serena-api`, `villa-serena-web` o `villa-serena-infra`) y regístralo en [#13](https://github.com/villaserenaguatee/villa-serena-docs/issues/13) con este formato (sin incluir claves ni tokens):

```text
Fecha del ensayo: <YYYY-MM-DD acordada por el equipo>
Participantes por frente: Backend (<nombres>), Frontend (<nombres>), Entorno/Docs (<nombres>)
Revisiones probadas: api=<sha>, web=<sha>, docs=<sha>, infra=<sha>
Paso: MVP-XX (<nombre del paso>)
Acción ejecutada: <ruta/pantalla y datos ficticios usados>
Resultado observado: <OK / código HTTP / mensaje en pantalla / estado en BD>
Evidencia reproducible: <captura sin secretos, ID de reserva VS-..., evento Svix o log de prueba>
Issue de fallo y frente responsable (si aplica): <URL de la issue — Backend / Frontend / Infra>
```
