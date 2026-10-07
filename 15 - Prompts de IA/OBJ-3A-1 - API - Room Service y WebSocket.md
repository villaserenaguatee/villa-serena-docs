# OBJ-3A-1 — API: Room Service y WebSocket

| Dato | Valor |
|---|---|
| Objetivo | 3A — Estadía y Room Service (documento 13) |
| Repositorio | `villa-serena-api` |
| Responsable inicial | Hugo |
| Horas estimadas | 6 h (menú, pedidos y cargo 3 h; WebSocket 3 h) |
| Cubre | HU-HUE-10 y HU-RS-01 a HU-RS-07 (lado API); tarea técnica: WebSocket para los 4 eventos (ALC-TRA-04) |
| Depende de | OBJ-0D (seguridad), contrato parte 2 (OBJ-0G), registro común de cargos de Pablo (OBJ-1B) y JWT del huésped de Carlos (OBJ-3A-2) |
| Calendario | Lun 5: comenzar Room Service. Mar 6: Room Service y WebSocket. Mié 7: WebSocket |

> **Referencias de trabajo:** la guía 16 describe el entorno; la guía 00, sección 3, describe el flujo con issues, ramas y PR hacia `develop`.

## Referencias para la tarea

La lectura se limita a las secciones necesarias para la issue. AGENTS.md contiene los acuerdos de colaboración; estas referencias se amplían solo si hay una dependencia o discrepancia.

- `AGENTS.md`
- `openapi.yaml` (contrato, partes 1 y 2, con la sección `x-websocket`)
- `HU - Room Service.md` y `HU - Cliente y Huesped.md` (HU-HUE-10, HU-HUE-11 y HU-HUE-17)
- `07 - Estados.md` (secciones 6 y 12)
- `09 - Matriz de Permisos.md` (secciones 3.4 y 7.4)
- `14 - Tecnologias y Arquitectura.md` (secciones 6 y 6.1)

El agente presenta un plan breve y continúa con el trabajo autorizado. La implementación puede adaptarse a la estructura existente; el resultado cumple los criterios siguientes.

## Resultado esperado

```text
Contexto: repositorio villa-serena-api del proyecto Villa Serena (acuerdos en AGENTS.md
y referencias pertinentes de la tarea). Comunicación en español.

PARTE A — Room Service (paquete roomservice), según openapi.yaml
1. Menú: por categorías, con estado DISPONIBLE/AGOTADO. Room Service solo puede
   marcar DISPONIBLE → AGOTADO (no al revés).
2. Crear pedido (huésped, HU-HUE-10): solo con su reserva EN_ESTADIA y solo sus
   propias reservas (si no, 404). Ítems, cantidades y notas; precios congelados al
   pedir; estado NUEVO. Si algún ítem está AGOTADO, rechaza el pedido e indica
   cuál quitar.
3. Cola (HU-RS-01): solo NUEVO, EN_PREPARACION y EN_CAMINO, el más antiguo primero,
   con habitación, piso, hora, estado y solo el nombre del huésped.
4. Avanzar (HU-RS-03): solo en orden NUEVO → EN_PREPARACION → EN_CAMINO →
   ENTREGADO. Usa control de concurrencia (versión optimista): si otro empleado ya
   lo cambió, 409 con el estado actual. ENTREGADO ya no se modifica.
5. Cancelar (HU-RS-04): desde NUEVO, EN_PREPARACION o EN_CAMINO, con motivo
   obligatorio. No genera cargo.
6. Cargo (HU-RS-06): al pasar a ENTREGADO, llama a CargoService.registrarCargo
   (de Pablo) con el concepto "Room Service — Pedido #n" y la suma de precio ×
   cantidad. Un solo cargo por pedido (la base tiene un índice único; trata el
   duplicado como ya hecho).
7. Al pasar a ENTREGADO, encola el push "pedido entregado" en el Outbox (Carlos
   implementa el envío). Sin datos personales ni montos.
8. Historial de cada cambio con HistorialEstadoService.

PARTE B — WebSocket + STOMP (los 4 eventos del documento 07, sección 12)
1. Endpoint STOMP (por ejemplo /ws) con autenticación en el mensaje CONNECT:
   - Web: ticket de un solo uso y 60 segundos, emitido por POST /api/v1/auth/ws-ticket
     (con la sesión del empleado) y guardado en memoria o en base.
   - App: el JWT del huésped.
2. Autoriza cada suscripción según el documento 14 (sección 6):
   /topic/pedidos (ROOM_SERVICE), /user/queue/pedidos (HUESPED, solo los suyos),
   /topic/solicitudes y /topic/habitaciones (MANTENIMIENTO_LIMPIEZA con área
   LIMPIEZA o AMBAS; /topic/habitaciones también RECEPCION).
3. Eventos publicados: evento 1 (pedido nuevo) y 2 (cambio de estado) en /topic/pedidos y al
   huésped dueño; evento 4: HabitacionEventos.publicarCambio de
   OBJ-2C queda implementado. El método del evento 3 permite integrar solicitudes
   (OBJ-3B-2). Los eventos se publican después de confirmar la transacción.
4. El mensaje de cada evento sigue el formato de x-websocket en openapi.yaml.

Pruebas: orden de estados, cancelación sin cargo, un solo cargo por pedido,
suscripción rechazada para un rol sin permiso y ticket vencido o reutilizado.
Los cambios de esquema necesarios se coordinan mediante issues y PR, conservando las migraciones ya aplicadas.
```

## Cómo saber que quedó terminado

1. Un pedido creado aparece en la cola; avanzar en orden funciona y saltar un estado da 409.
2. Al entregar, la cuenta tiene un solo cargo aunque se repita la petición.
3. Con un cliente STOMP de prueba: Room Service recibe el pedido nuevo; un huésped solo recibe los cambios de sus pedidos; un rol sin permiso no puede suscribirse.
4. `mvnw.cmd test` pasa.

## Al terminar

Después de integrar la PR en `develop` y verificar el resultado, la issue queda actualizada o cerrada y la casilla correspondiente de `17 - Avance del Proyecto.md` incluye el número de PR (guía 00, sección 3).
