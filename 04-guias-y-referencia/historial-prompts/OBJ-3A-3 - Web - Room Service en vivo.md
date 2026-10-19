# OBJ-3A-3 — Web: Room Service en vivo y cliente de tiempo real

| Dato | Valor |
|---|---|
| Objetivo | 3A — Estadía y Room Service (documento 13) |
| Repositorio | `villa-serena-web` |
| Responsable inicial | Alex |
| Horas estimadas | 5 h (cola y aviso 2 h; detalle, avance, cancelación y menú 2 h; cliente de tiempo real 1 h) |
| Cubre | HU-RS-01 a HU-RS-05 y HU-RS-07 (lado web); cliente de tiempo real compartido |
| Depende de | OBJ-0E (BFF) y contrato parte 2. Para conectar: OBJ-3A-1 (Hugo: Room Service y WebSocket) |
| Calendario | Mié 7: cliente de tiempo real y cola. Jue 8: detalle, avance y menú |

> **Referencias de trabajo:** la guía 16 describe el entorno; la guía 00, sección 3, describe el flujo con issues, ramas y PR hacia `develop`.

## Referencias para la tarea

La lectura se limita a las secciones necesarias para la issue. AGENTS.md contiene los acuerdos de colaboración; estas referencias se amplían solo si hay una dependencia o discrepancia.

- `AGENTS.md`
- `openapi.yaml` (con la sección `x-websocket`)
- `HU - Room Service.md`
- `14 - Tecnologias y Arquitectura.md` (secciones 6 y 6.1)

El agente presenta un plan breve y continúa con el trabajo autorizado. La implementación puede adaptarse a la estructura existente; el resultado cumple los criterios siguientes.

## Resultado esperado

```text
Contexto: repositorio villa-serena-web del proyecto Villa Serena (acuerdos en AGENTS.md
y referencias pertinentes de la tarea). Comunicación en español. Los tipos se generan desde la copia local de
openapi.yaml.

PARTE A — Cliente de tiempo real compartido (lo usarán Kim y Alex)
1. Route Handler del BFF que pide a Spring un ticket con POST /api/v1/auth/ws-ticket
   usando la sesión del empleado y lo devuelve al navegador (el JWT nunca sale).
2. Hook useTiempoReal(destino, alRecibir) en lib/tiempo-real con @stomp/stompjs:
   se conecta DIRECTO a Spring (URL pública del WebSocket en una variable
   NEXT_PUBLIC_), envía el ticket en CONNECT, pide un ticket nuevo en cada
   reconexión (la librería se reconecta sola) y llama a un callback "alReconectar"
   para recargar los datos. Una sola conexión compartida por pestaña.
3. El README incluye un ejemplo breve de suscripción de una pantalla.

PARTE B — Pantallas de Room Service (app/panel/room-service)
1. Cola (HU-RS-01): solo NUEVO, EN_PREPARACION y EN_CAMINO, el más antiguo
   primero, con habitación, piso, hora, tiempo transcurrido, estado por color y
   solo el nombre del huésped. Se actualiza con /topic/pedidos; al reconectar,
   recarga la cola completa. Sin indicador "Sin conexión".
2. Aviso de pedido nuevo (HU-RS-07): aviso visual (toast) con habitación, piso y
   hora; al hacer clic abre el detalle.
3. Detalle (HU-RS-02) con ítems, cantidades, notas y total; botón del siguiente
   estado (HU-RS-03); si el API responde 409 (otro empleado ya lo cambió), aviso y
   recarga.
4. Cancelar (HU-RS-04) con motivo obligatorio, mientras no esté ENTREGADO.
5. Menú (HU-RS-05) por categorías con estado; botón "Marcar agotado" solo en
   DISPONIBLE (no hay botón para reactivar).

Fuera de alcance: sonidos, indicador de conexión y edición de cargos.
```

## Cómo saber que quedó terminado

1. Con el WebSocket de Hugo: un pedido hecho desde la app aparece en la cola sin recargar, con su aviso.
2. Avanzar el pedido cambia su estado en la app del huésped sin recargar.
3. Si se apaga y enciende el API, la cola se vuelve a cargar sola.
4. En las herramientas del navegador, el JWT no aparece en ninguna respuesta del BFF.

## Al terminar

Después de integrar la PR en `develop` y verificar el resultado, la issue queda actualizada o cerrada y la casilla correspondiente de `17 - Avance del Proyecto.md` incluye el número de PR (guía 00, sección 3).
