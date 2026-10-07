# OBJ-0G — API: contrato OpenAPI

| Dato | Valor |
|---|---|
| Objetivo | 0 — Base (documento 13) |
| Repositorio | `villa-serena-api` (archivo `openapi.yaml` en la raíz) |
| Responsables | Josué ejecuta el prompt; Pablo y Hugo revisan los endpoints de sus módulos |
| Horas estimadas | 3 h en total (0,5 h por persona en cada parte) |
| Calendario | **Parte 1** (objetivos 0, 1 y 2): se congela el **viernes 2**. **Parte 2** (objetivos 3A, 3B y 4): se congela el **lunes 5** |
| Depende de | OBJ-0B (proyecto base) para la carpeta; no necesita código |

> **Antes de empezar:** prepara tu computadora con la `16 - Guia de Arranque del Proyecto.md`. Para crear tu rama y subir tu trabajo con un pull request, sigue la sección 3 de `00 - Como usar los prompts.md`.

**Para qué sirve:** el contrato dice exactamente qué rutas tiene el API, qué datos recibe y qué devuelve. Con él, Kim, Alex y Carlos pueden hacer sus pantallas con datos de prueba **sin esperar** a que el backend esté terminado. "Congelar" significa que, después de esa fecha, cualquier cambio se avisa al grupo y pasa por Josué.

## Documentos que debes adjuntar a la IA

- `AGENTS.md`
- `13 - Plan de Trabajo.md` (secciones 5 y 10.1: qué historias van en cada objetivo)
- `11 - Requisitos Funcionales.md`
- `09 - Matriz de Permisos.md`
- `07 - Estados.md`
- `14 - Tecnologias y Arquitectura.md` (secciones 6 y 6.1)
- Las historias del objetivo: **parte 1** `HU - Personal del Hotel.md`, `HU - Cliente y Huesped.md` (HU-HUE-01 a 07), `HU - Recepcionista.md` (HU-REC-01 a 12) y `HU - Channel Manager.md`; **parte 2** `HU - Cliente y Huesped.md` (HU-HUE-08 a 17), `HU - Room Service.md`, `HU - Mantenimiento y Limpieza.md` y `HU - Recepcionista.md` (HU-REC-13 a 17)

## Prompt — Parte 1 (viernes 2): objetivos 0, 1 y 2

```text
Trabajas en el repositorio villa-serena-api del proyecto Villa Serena (lee AGENTS.md
y los documentos adjuntos). Responde en español.

Objetivo: escribir a mano el contrato del API en openapi.yaml (OpenAPI 3.1) para las
historias de los objetivos 0, 1 y 2 del documento 13. Es el acuerdo entre backend,
web y app. Solo el archivo YAML: no escribas código Java.

PASO 1 — Lista de endpoints (no escribas YAML todavía)
Muéstrame una tabla con: método, ruta, historia (HU-...), requisito (RF-...), quién
puede llamarlo según el documento 09 y respuesta principal. Usa estas reglas:
- Prefijo /api/v1. Grupos: /auth (personal), /publico (sin sesión: hotel, tipos de
  habitación, disponibilidad y precio, crear reserva web, iniciar pago y estado de
  la reserva al volver de Stripe), /pagos/stripe/webhook, /canal/reservas,
  /reservas, /huespedes, /habitaciones (Recepción) y /admin/canal-simulado si hace
  falta.
- Las rutas de /auth ya están acordadas: POST /auth/login, POST /auth/renovar,
  POST /auth/cerrar-sesion, POST /auth/cambiar-contrasena y GET /auth/yo.
- Nada que no salga de una historia de esos objetivos. Si una historia no necesita
  endpoint propio, dilo.
Espera mi aprobación.

PASO 2 — openapi.yaml
- JSON en camelCase. Fechas de estadía "YYYY-MM-DD"; fechas con hora en ISO 8601
  con zona. Montos en quetzales como número con 2 decimales.
- Estados y métodos de pago como enum con los valores exactos del documento 07
  (por ejemplo PENDIENTE_PAGO, CONFIRMADA; STRIPE, CANAL, EFECTIVO, TARJETA, OTRO).
- Seguridad: bearerAuth (JWT) para personal; la API del canal con los encabezados
  X-Canal-Codigo y X-Canal-Clave; el webhook de Stripe con el encabezado
  Stripe-Signature.
- Un esquema de error único: { codigo, mensaje, detalles } y las respuestas 400,
  401, 403, 404 y 409 donde apliquen, con mensajes en español.
- Cada endpoint con un ejemplo de petición y de respuesta.
- Listas sin paginación, salvo la búsqueda de reservas (page y size).
- Cada rol recibe solo los datos que puede ver (documento 09, notas 10 y 11): si
  dos roles ven datos distintos, usa dos esquemas distintos.

PASO 3 — Comprobación
Valida el archivo (por ejemplo con npx @redocly/cli lint openapi.yaml) y corrige
los errores. Muéstrame el resumen: cantidad de endpoints por grupo.
```

## Prompt — Parte 2 (lunes 5): objetivos 3A, 3B y 4

```text
Seguimos en villa-serena-api. Responde en español.

Objetivo: agregar a openapi.yaml los endpoints de los objetivos 3A, 3B y 4 del
documento 13, con las mismas reglas de la parte 1 (prefijo, formatos, enums,
errores y ejemplos). No cambies los endpoints ya congelados; si alguno necesita
un cambio, dímelo antes.

Grupos nuevos:
- /app (huésped, con su JWT): acceso con código (solicitar y verificar el OTP),
  mis reservas, detalle de la estadía, menú, pedidos, solicitudes, cuenta,
  registro del token de push y pago del saldo y check-out desde la app.
- /room-service (pedidos y menú agotado), /limpieza (habitaciones por limpiar y
  solicitudes), /incidencias, /cuentas (consulta, cargos y anulación),
  /checkout y /facturas (detalle y PDF).
- POST /auth/ws-ticket (ticket de 60 s del WebSocket, documento 14 sección 6).
- Los temas del WebSocket no van en OpenAPI: descríbelos en una sección
  x-websocket del archivo con los 4 destinos del documento 14 y el formato del
  mensaje de cada evento.

Primero muéstrame la tabla de endpoints nuevos y espera mi aprobación. Después
escribe el YAML, valídalo y muéstrame el resumen.
```

## Cómo saber que quedó terminado

1. `npx @redocly/cli lint openapi.yaml` no muestra errores.
2. Cada historia de los objetivos tiene al menos un endpoint, o una nota de por qué no lo necesita.
3. Pablo y Hugo revisaron los endpoints de sus módulos (comentario "Revisado" en el pull request).
4. Kim, Alex y Carlos copian el archivo a su repositorio y generan sus tipos sin errores (`openapi-typescript`).
5. Se avisó al grupo: "contrato congelado (parte 1 o 2)".

## Al terminar

Cuando todo lo de "Cómo saber que quedó terminado" funcione, pega esto a la IA:

```text
Terminamos esta tarea. Muéstrame git status y confirma que no se sube ningún .env
ni claves. Luego haz commit, push y abre el pull request a main con un título que
EMPIECE con "OBJ-0G:" (por ejemplo "OBJ-0G: <resumen corto>"). En la descripción
pon qué se hizo, cómo se probó y la lista de tareas de "17 - Avance del Proyecto.md"
con código OBJ-0G que quedan completas.
```

Pide a un compañero que revise el PR. No marques el archivo 17: Josué lo actualiza una vez al día.
