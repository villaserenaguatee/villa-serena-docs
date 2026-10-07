# OBJ-3A-2 — API: acceso del huésped, mis reservas y push

| Dato | Valor |
|---|---|
| Objetivo | 3A — Estadía y Room Service (documento 13) |
| Repositorio | `villa-serena-api` |
| Responsable inicial | Carlos |
| Horas estimadas | 2,5 h (OTP y JWT del huésped 1 h; envío de push 1 h; mis reservas 0,5 h) |
| Cubre | HU-HUE-08, HU-HUE-09 y HU-HUE-17 (lado API) |
| Depende de | OBJ-0D (seguridad de Pablo), Outbox de Hugo (OBJ-1C) y contrato parte 2 (OBJ-0G) |
| Calendario | Lun 5: OTP. Mar 6: mis reservas y envío de push |

> **Referencias de trabajo:** la guía 16 describe el entorno; la guía 00, sección 3, describe el flujo con issues, ramas y PR hacia `develop`. Aunque tu capa principal es la app, esta parte se hace en el repositorio del API: clónalo y crea tu rama ahí.

## Referencias para la tarea

La lectura se limita a las secciones necesarias para la issue. AGENTS.md contiene los acuerdos de colaboración; estas referencias se amplían solo si hay una dependencia o discrepancia.

- `AGENTS.md`
- `openapi.yaml` (contrato, partes 1 y 2)
- `HU - Cliente y Huesped.md` (HU-HUE-08, HU-HUE-09 y HU-HUE-17)
- `14 - Tecnologias y Arquitectura.md` (secciones 6 y 6.1, punto 8)
- `09 - Matriz de Permisos.md` (secciones 3.8 y 7)

El agente presenta un plan breve y continúa con el trabajo autorizado. La implementación puede adaptarse a la estructura existente; el resultado cumple los criterios siguientes.

## Resultado esperado

```text
Contexto: repositorio villa-serena-api del proyecto Villa Serena (acuerdos en AGENTS.md
y referencias pertinentes de la tarea). Comunicación en español. La seguridad de OBJ-0D
(paquetes config y auth) aporta la emisión compartida de JWT y refresh.

PARTE A — Acceso del huésped con código (HU-HUE-08)
1. Solicitar código: correo → código de 6 dígitos, guardado con hash, vence en 10
   minutos, un solo uso. Se envía por el Outbox de Hugo (correo "codigo-acceso").
   Si el correo no tiene reservas, responde igual que si las tuviera (mensaje
   genérico que no revela si existe).
2. Verificar código: 5 intentos fallidos → bloqueo de 15 minutos. Si es correcto,
   emite JWT con tipo HUESPED (15 min) y refresh rotativo de 7 días, con el mismo
   mecanismo de Pablo. El huésped queda vinculado a todas las reservas de su correo.
3. Cerrar sesión del huésped: revoca el refresh y borra su token de push.

PARTE B — Mis reservas (HU-HUE-09)
1. Lista de las reservas del huésped (código, fechas y estado) y detalle (fechas,
   hora de check-out, tipo, huéspedes, estado y habitación o "Por asignar").
2. Solo sus propias reservas: una ajena responde 404.

PARTE C — Push (HU-HUE-17)
1. Registrar y borrar el Expo push token del teléfono (tabla dispositivos_push).
2. El Outbox compartido incluye el tipo PUSH y su envío a la API de Expo Push
   (https://exp.host/--/api/v2/push/send) con RestClient. Los reintentos utilizan el mecanismo
   compartido existente.
3. Solo se envía si la reserva está EN_ESTADIA. Textos sin datos personales ni
   montos: "Tu pedido fue entregado" y "Tu solicitud fue atendida", con los datos
   para abrir la pantalla correspondiente.
4. Al finalizar la estadía o cerrar sesión, se borran los tokens del huésped.
5. Si el envío falla, el cambio de estado ya está guardado (solo se reintenta).

Pruebas: código vencido, reutilizado y bloqueo tras 5 intentos; reserva ajena (404);
push no se envía fuera de EN_ESTADIA.
Los cambios de esquema necesarios se coordinan mediante issues y PR, conservando las migraciones ya aplicadas.
```

## Cómo saber que quedó terminado

1. Al pedir un código, el correo llega a Mailpit; con el código correcto, el API entrega los tokens del huésped.
2. Un código vencido o usado no funciona; tras 5 errores queda bloqueado 15 minutos.
3. "Mis reservas" solo muestra las del correo del huésped.
4. Con el development build: al entregar un pedido de prueba, llega la notificación al teléfono.

## Al terminar

Después de integrar la PR en `develop` y verificar el resultado, la issue queda actualizada o cerrada y la casilla correspondiente de `17 - Avance del Proyecto.md` incluye el número de PR (guía 00, sección 3).
