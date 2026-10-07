# OBJ-3A-4 — App: acceso, estadía, pedidos y push

| Dato | Valor |
|---|---|
| Objetivo | 3A — Estadía y Room Service (documento 13) |
| Repositorio | `villa-serena-movil` |
| Responsable inicial | Carlos |
| Horas estimadas | 6,5 h (inicio de sesión 1 h; mis reservas 1,5 h; pedir room service 1,5 h; seguir el pedido en vivo 1,5 h; token de push 1 h) |
| Cubre | HU-HUE-08 a HU-HUE-11 y HU-HUE-17 (lado app) |
| Depende de | OBJ-0F (proyecto Expo y development build), contrato parte 2 (OBJ-0G). Para conectar: OBJ-3A-2 (acceso y push) y OBJ-3A-1 (pedidos y WebSocket) |
| Calendario | Lun 5: inicio de sesión y mis reservas. Mar 6: pedidos y push. Mié 7: seguimiento en vivo. Jue 8: conectar todo al API |

> **Referencias de trabajo:** la guía 16 describe el entorno; la guía 00, sección 3, describe el flujo con issues, ramas y PR hacia `develop`.

## Referencias para la tarea

La lectura se limita a las secciones necesarias para la issue. AGENTS.md contiene los acuerdos de colaboración; estas referencias se amplían solo si hay una dependencia o discrepancia.

- `AGENTS.md`
- `openapi.yaml` (contrato, partes 1 y 2, con la sección `x-websocket`)
- `HU - Cliente y Huesped.md` (HU-HUE-08 a HU-HUE-11 y HU-HUE-17)
- `14 - Tecnologias y Arquitectura.md` (secciones 4.3, 6 y 6.1, punto 8)

El agente presenta un plan breve y continúa con el trabajo autorizado. La implementación puede adaptarse a la estructura existente; el resultado cumple los criterios siguientes.

## Resultado esperado

```text
Contexto: repositorio villa-serena-movil del proyecto Villa Serena (acuerdos en
AGENTS.md y referencias pertinentes de la tarea). Comunicación en español. Expo SDK 54 y Expo
Router, manteniendo SDK 54. Los tipos se generan desde la copia local de openapi.yaml.

Mientras falta el API, la pantalla utiliza datos de prueba con los tipos de openapi.yaml en
lib/mocks/estadia.ts, con un interruptor para pasar al API real.

1. Inicio de sesión (HU-HUE-08): pantalla del correo → pantalla del código de 6
   dígitos. Mensajes para código vencido o usado (con "Pedir otro código"), para el
   bloqueo de 15 minutos y el mensaje genérico si el correo no tiene reservas.
   Tokens en expo-secure-store; renovación con /auth/renovar como ya está en
   lib/api. Botón "Cerrar sesión" (revoca, borra el token de push y los tokens).
2. Mis reservas (HU-HUE-09): si tiene una EN_ESTADIA, entra directo a ella; si no,
   selector con código, fechas y estado. Detalle con fechas, hora de check-out,
   tipo, huéspedes, estado y habitación (o "Por asignar"). Room service y
   solicitudes solo activos con EN_ESTADIA; si no, aviso de que estarán
   disponibles durante la estadía.
3. Pedir room service (HU-HUE-10): menú por categorías con precio; los AGOTADO se
   ven no disponibles. Carrito con cantidades y notas, total y aviso de que se
   cargará a la cuenta al entregarse. Si el API rechaza por un ítem agotado,
   muestra cuál quitar.
4. Seguir el pedido (HU-HUE-11): lista de pedidos de la estadía con fecha, estado y
   total; el estado cambia solo, sin recargar, con @stomp/stompjs conectado
   directo a Spring con el JWT del huésped y suscrito a /user/queue/pedidos. Si
   el pedido se cancela, muestra el motivo. Al reconectar, vuelve a cargar los
   pedidos. La integración incluye el polyfill de TextEncoder si
   @stomp/stompjs lo requiere en React Native. El huésped no puede cancelar ni modificar pedidos.
5. Push (HU-HUE-17): al entrar, pide permiso (si lo niega, la app sigue igual);
   registra el Expo push token en el API; al tocar la notificación abre la
   pantalla del pedido (o de la solicitud). Se prueba con el development build.

Los tokens utilizan expo-secure-store. Modo sin conexión y cambios de SDK
quedan fuera de este objetivo.
```

## Cómo saber que quedó terminado

1. Con datos de prueba en Expo Go: inicio de sesión, selector y detalle, menú con agotados y carrito.
2. Conectado al API: el código llega a Mailpit y permite entrar; un pedido aparece en la pantalla de Room Service.
3. Al avanzar el pedido en la web, el estado cambia solo en la app.
4. Con el development build: al entregarse el pedido llega la notificación, y al tocarla se abre el pedido.

## Al terminar

Después de integrar la PR en `develop` y verificar el resultado, la issue queda actualizada o cerrada y la casilla correspondiente de `17 - Avance del Proyecto.md` incluye el número de PR (guía 00, sección 3).
