# 19 — Secuencia: conexiones y cuatro eventos en vivo

**Vista:** Secuencia · **Alcance del plan:** Hito.

WebSocket es una excepción al camino HTTP de la web por el BFF.

```mermaid
sequenceDiagram
  participant W as Navegador del personal
  participant B as BFF
  participant A as App huésped
  participant S as API REST / auth
  participant WS as Spring WebSocket STOMP
  W->>B: Pedir autorización de conexión
  B->>S: POST ws-ticket con JWT del personal
  S-->>B: Ticket de un uso y 60 segundos
  B-->>W: Ticket sin exponer JWT
  W->>WS: CONNECT directo con ticket
  A->>WS: CONNECT directo con JWT del huésped
  WS->>WS: Autenticar CONNECT y autorizar cada SUBSCRIBE
  W->>WS: Suscripción permitida por rol y área
  A->>WS: Solo su cola privada de pedidos
  Note over WS,S: Cambio de negocio confirmado en BD antes de publicar
  S-->>WS: Evento 1: nuevo pedido
  WS-->>W: /topic/pedidos solo ROOM_SERVICE
  S-->>WS: Evento 2: cambio de pedido
  WS-->>W: /topic/pedidos
  WS-->>A: /user/queue/pedidos solo dueño
  S-->>WS: Evento 3: nueva solicitud
  WS-->>W: /topic/solicitudes para LIMPIEZA o AMBAS
  S-->>WS: Evento 4: cambio de habitación
  WS-->>W: /topic/habitaciones para RECEPCION y LIMPIEZA o AMBAS
  opt Se perdió conexión
    W->>S: Recargar listas vía BFF después de reconectar
    A->>S: Recargar pedidos por REST
  end
```

## Reglas y límites

- Solo cuatro eventos: nuevo pedido, cambio de pedido, nueva solicitud y cambio de habitación.
- No hay WS para Gantt, cuenta, solicitudes de la app, incidencias ni indicadores.
- Se publica después del commit y al reconectar se vuelve a leer el estado con GET.

## Referencias

- [14 §§6,6.1](../14%20-%20Tecnologias%20y%20Arquitectura.md)
- [09 §7.4](../09%20-%20Matriz%20de%20Permisos.md)
- [07 §12.1](../07%20-%20Estados.md)
- [OpenAPI x-websocket](https://github.com/villaserenaguate/villa-serena-api/blob/main/openapi.yaml)

[Índice de diagramas](README.md) · [Cobertura de historias](COBERTURA.md) · [Anterior](18-secuencia-cierre-atomico-factura-y-archivos.md) · [Siguiente](20-secuencia-outbox-correos-y-notificaciones-push.md)
