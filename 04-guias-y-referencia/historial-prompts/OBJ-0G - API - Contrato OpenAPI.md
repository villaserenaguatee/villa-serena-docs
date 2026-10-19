# OBJ-0G — API: contrato OpenAPI

| Dato | Valor |
|---|---|
| Objetivo | 0 — Base (documento 13) |
| Repositorio | `villa-serena-api` (archivo `openapi.yaml` en la raíz) |
| Responsables iniciales | Josué (preparación); revisión por integrantes de API y consumidores web/app |
| Horas estimadas | 3 h en total (0,5 h por persona en cada parte) |
| Calendario | **Parte 1** (objetivos 0, 1 y 2): se congela el **viernes 2**. **Parte 2** (objetivos 3A, 3B y 4): se congela el **lunes 5** |
| Depende de | OBJ-0B (proyecto base) para la carpeta; no necesita código |

> **Referencias de trabajo:** la guía 16 describe el entorno; la guía 00, sección 3, describe el flujo con issues, ramas y PR hacia `develop`.

**Para qué sirve:** el contrato dice exactamente qué rutas tiene el API, qué datos recibe y qué devuelve. Con él, Kim, Alex y Carlos pueden hacer sus pantallas con datos de prueba **sin esperar** a que el backend esté terminado. "Congelar" significa que, después de esa fecha, cualquier cambio se registra como issue y se revisa mediante PR con los consumidores del contrato.

## Referencias para la tarea

La lectura se limita a las secciones necesarias para la issue. AGENTS.md contiene los acuerdos de colaboración; estas referencias se amplían solo si hay una dependencia o discrepancia.

- `AGENTS.md`
- `13 - Plan de Trabajo.md` (secciones 5 y 10.1: qué historias van en cada objetivo)
- `11 - Requisitos Funcionales.md`
- `09 - Matriz de Permisos.md`
- `07 - Estados.md`
- `14 - Tecnologias y Arquitectura.md` (secciones 6 y 6.1)
- Las historias del objetivo: **parte 1** `HU - Personal del Hotel.md`, `HU - Cliente y Huesped.md` (HU-HUE-01 a 07), `HU - Recepcionista.md` (HU-REC-01 a 12) y `HU - Channel Manager.md`; **parte 2** `HU - Cliente y Huesped.md` (HU-HUE-08 a 17), `HU - Room Service.md`, `HU - Mantenimiento y Limpieza.md` y `HU - Recepcionista.md` (HU-REC-13 a 17)

El agente presenta un plan breve y continúa con el trabajo autorizado. La implementación puede adaptarse a la estructura existente; el resultado cumple los criterios siguientes.

## Resultado esperado — Parte 1 (viernes 2): objetivos 0, 1 y 2

```text
Contexto: repositorio villa-serena-api del proyecto Villa Serena (acuerdos en AGENTS.md
y referencias pertinentes de la tarea). Comunicación en español.

Objetivo: disponer del contrato del API en openapi.yaml (OpenAPI 3.1) para las
historias de los objetivos 0, 1 y 2 del documento 13. Es el acuerdo entre backend,
web y app. El entregable es el contrato YAML; el código Java pertenece a otros objetivos.

Cobertura esperada del contrato
La tabla de cobertura identifica método, ruta, historia (HU-...), requisito
(RF-...), permisos según el documento 09 y respuesta principal. Convenciones:
- Prefijo /api/v1. Grupos: /auth (personal), /publico (sin sesión: hotel, tipos de
  habitación, disponibilidad y precio, crear reserva web, iniciar pago y estado de
  la reserva al volver de Stripe), /pagos/stripe/webhook, /canal/reservas,
  /reservas, /huespedes, /habitaciones (Recepción) y /admin/canal-simulado si hace
  falta.
- Las rutas de /auth ya están acordadas: POST /auth/login, POST /auth/renovar,
  POST /auth/cerrar-sesion, POST /auth/cambiar-contrasena y GET /auth/yo.
- La cobertura corresponde a las historias de estos objetivos; una historia
  sin endpoint propio cuenta con una explicación.
La propuesta y la implementación forman parte de la tarea autorizada; las decisiones de alcance se consultan.

Resultado esperado — openapi.yaml
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
  dos roles ven datos distintos, sus esquemas también son distintos.

Resultado esperado — Comprobación
El contrato pasa la validación (por ejemplo npx @redocly/cli lint openapi.yaml)
y el resumen de verificación indica la cantidad de endpoints por grupo.
```

## Resultado esperado — Parte 2 (lunes 5): objetivos 3A, 3B y 4

```text
Contexto: villa-serena-api. Comunicación en español.

Objetivo: agregar a openapi.yaml los endpoints de los objetivos 3A, 3B y 4 del
documento 13, con las mismas reglas de la parte 1 (prefijo, formatos, enums,
errores y ejemplos). La evolución de endpoints congelados se coordina mediante
issue y PR con sus consumidores, explicando el impacto.

Grupos nuevos:
- /app (huésped, con su JWT): acceso con código (solicitar y verificar el OTP),
  mis reservas, detalle de la estadía, menú, pedidos, solicitudes, cuenta,
  registro del token de push y pago del saldo y check-out desde la app.
- /room-service (pedidos y menú agotado), /limpieza (habitaciones por limpiar y
  solicitudes), /incidencias, /cuentas (consulta, cargos y anulación),
  /checkout y /facturas (detalle y PDF).
- POST /auth/ws-ticket (ticket de 60 s del WebSocket, documento 14 sección 6).
- Los temas del WebSocket se documentan en la extensión x-websocket del
  archivo, con los 4 destinos del documento 14 y el formato de cada evento;
  no se presentan como endpoints HTTP.
```

## Cómo saber que quedó terminado

1. `npx @redocly/cli lint openapi.yaml` no muestra errores.
2. Cada historia de los objetivos tiene al menos un endpoint, o una nota de por qué no lo necesita.
3. Integrantes de API y de los consumidores revisaron los endpoints pertinentes en la PR.
4. Kim, Alex y Carlos copian el archivo a su repositorio y generan sus tipos sin errores (`openapi-typescript`).
5. Se avisó al grupo: "contrato congelado (parte 1 o 2)".

## Al terminar

Después de integrar la PR en `develop` y verificar el resultado, la issue queda actualizada o cerrada y la casilla correspondiente de `17 - Avance del Proyecto.md` incluye el número de PR (guía 00, sección 3). Si hay un bloqueo, Alex facilita su resolución; el avance puede actualizarlo quien completó la tarea.
