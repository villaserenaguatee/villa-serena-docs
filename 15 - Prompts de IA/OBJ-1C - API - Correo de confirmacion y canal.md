# OBJ-1C — API: correo de confirmación y endpoint del canal

| Dato | Valor |
|---|---|
| Objetivo | 1 — Reservar (documento 13) |
| Repositorio | `villa-serena-api` |
| Responsable inicial | Hugo |
| Horas estimadas | 2,5 h (Outbox y correo 1 h; canal 1,5 h) |
| Cubre | HU-HUE-07, HU-CM-01 |
| Depende de | OBJ-0B (proyecto base), OBJ-0C (tablas `outbox`, `canales`, `reservas`) y contrato parte 1 (OBJ-0G). La creación de la reserva es de Pablo (OBJ-1B) |
| Calendario | Vie 2 (2,5 h) |

> **Referencias de trabajo:** la guía 16 describe el entorno; la guía 00, sección 3, describe el flujo con issues, ramas y PR hacia `develop`.

## Referencias para la tarea

La lectura se limita a las secciones necesarias para la issue. AGENTS.md contiene los acuerdos de colaboración; estas referencias se amplían solo si hay una dependencia o discrepancia.

- `AGENTS.md`
- `openapi.yaml` (contrato, parte 1)
- `HU - Cliente y Huesped.md` (HU-HUE-07) y `HU - Channel Manager.md` (HU-CM-01)
- `07 - Estados.md` (sección 12.3, correos)
- `10 - Reglas de Negocio.md` (reglas RN-NOT y RN-CM)
- `14 - Tecnologias y Arquitectura.md` (secciones 2, 4.1 y 5)

El agente presenta un plan breve y continúa con el trabajo autorizado. La implementación puede adaptarse a la estructura existente; el resultado cumple los criterios siguientes.

## Resultado esperado

```text
Contexto: repositorio villa-serena-api del proyecto Villa Serena (acuerdos en AGENTS.md
y referencias pertinentes de la tarea). Comunicación en español.

Objetivo: dos piezas del objetivo 1, en los paquetes notificaciones y canal.

PARTE A — Outbox y correo de confirmación (HU-HUE-07)
1. Servicio OutboxService.encolar(tipo, destinatario, datos): guarda un registro en
   la tabla outbox dentro de la MISMA transacción del cambio de estado. Si el
   envío falla después, la reserva no se ve afectada.
2. Proceso @Scheduled (cada 30 s) que toma los pendientes, los envía y marca
   ENVIADO, o suma un intento y guarda el error. Máximo 5 intentos.
3. Envío con Spring Mail + Thymeleaf. En local, SMTP de Mailpit (localhost:1025).
   Remitente y URL de descarga de la app desde el .env (MAIL_FROM, APP_DOWNLOAD_URL).
4. Plantilla "confirmacion-reserva" en español con todo lo del criterio 2 a 4 de
   HU-HUE-07: código, fechas, tipo de habitación, huéspedes, total, horas 15:00 y
   12:00, si está pagado o se paga en el check-out, enlace de la app e
   instrucción de entrar con el mismo correo.
5. Método público ConfirmacionReservaNotifier.notificar(reservaId) que Pablo
   llamará cuando la reserva quede CONFIRMADA (webhook, Recepción o canal).
   El tipo de outbox queda listo para que Carlos agregue después el push.

PARTE B — Endpoint del canal (HU-CM-01), según openapi.yaml
1. Autenticación con los encabezados X-Canal-Codigo y X-Canal-Clave: compara el
   SHA-256 de la clave con el hash guardado. Canal inexistente o clave mala: 401
   sin crear nada.
2. Validaciones del criterio 3 (400 con el motivo): los 6 datos del huésped, 1 a
   30 noches, sin fechas pasadas ni a más de 365 días, capacidad del tipo y tipo
   activo.
3. Idempotencia: si ya existe una reserva con el mismo canal e identificador
   externo, responde 200 con esa reserva y no crea otra.
4. La disponibilidad y la creación de la reserva NO se programan aquí: se llaman
   al servicio de reservas de Pablo (por ejemplo,
   ReservaService.crearReservaCanal(...)). El nombre y los parámetros se
   coordinan mediante issue y PR. Mientras falta el servicio, una interfaz con
   implementación temporal marcada TODO permite avanzar.
5. Resultado 201 con el código de reserva; 409 si no hay disponibilidad.
6. Al crearse, llama a ConfirmacionReservaNotifier.notificar(...).

Pruebas: idempotencia, clave incorrecta (401), datos inválidos (400) y que el
correo quede en outbox. Una columna faltante se coordina mediante issue y PR, conservando las migraciones ya aplicadas.
```

## Cómo saber que quedó terminado

1. `mvnw.cmd test` pasa.
2. Con `curl` o Swagger: una reserva del canal con clave correcta responde 201; repetida, responde 200 con la misma reserva; con clave incorrecta, 401.
3. Cuando el servicio de Pablo esté listo, el correo de confirmación aparece en Mailpit (http://localhost:8025) con todos los datos del criterio 2.
4. Si apagas Mailpit y confirmas una reserva, la reserva queda `CONFIRMADA` y el correo queda pendiente en `outbox`; al encender Mailpit, sale solo.

## Al terminar

Después de integrar la PR en `develop` y verificar el resultado, la issue queda actualizada o cerrada y la casilla correspondiente de `17 - Avance del Proyecto.md` incluye el número de PR (guía 00, sección 3). Si hay un bloqueo, Alex facilita su resolución; el avance puede actualizarlo quien completó la tarea.
