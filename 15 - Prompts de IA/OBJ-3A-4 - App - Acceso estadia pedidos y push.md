# OBJ-3A-4 — App: acceso, estadía, pedidos y push

| Dato | Valor |
|---|---|
| Objetivo | 3A — Estadía y Room Service (documento 13) |
| Repositorio | `villa-serena-movil` |
| Responsable | Carlos |
| Horas estimadas | 6,5 h (inicio de sesión 1 h; mis reservas 1,5 h; pedir room service 1,5 h; seguir el pedido en vivo 1,5 h; token de push 1 h) |
| Cubre | HU-HUE-08 a HU-HUE-11 y HU-HUE-17 (lado app) |
| Depende de | OBJ-0F (proyecto Expo y development build), contrato parte 2 (OBJ-0G). Para conectar: OBJ-3A-2 (acceso y push) y OBJ-3A-1 (pedidos y WebSocket) |
| Calendario | Lun 5: inicio de sesión y mis reservas. Mar 6: pedidos y push. Mié 7: seguimiento en vivo. Jue 8: conectar todo al API |

> **Antes de empezar:** prepara tu computadora con la `16 - Guia de Arranque del Proyecto.md`. Para crear tu rama y subir tu trabajo con un pull request, sigue la sección 3 de `00 - Como usar los prompts.md`.

## Documentos que debes adjuntar a la IA

- `AGENTS.md`
- `openapi.yaml` (contrato, partes 1 y 2, con la sección `x-websocket`)
- `HU - Cliente y Huesped.md` (HU-HUE-08 a HU-HUE-11 y HU-HUE-17)
- `14 - Tecnologias y Arquitectura.md` (secciones 4.3, 6 y 6.1, punto 8)

## Prompt

```text
Trabajas en el repositorio villa-serena-movil del proyecto Villa Serena (lee
AGENTS.md y los documentos adjuntos). Responde en español. Expo SDK 54 y Expo
Router; no cambies de SDK. Copia openapi.yaml y genera los tipos.

Mientras el API no esté listo, usa datos de prueba con los tipos de openapi.yaml en
lib/mocks/estadia.ts, y deja un interruptor para pasar al API real.

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
   pedidos. Si @stomp/stompjs pide TextEncoder en React Native, agrega el polyfill
   necesario. El huésped no puede cancelar ni modificar pedidos.
5. Push (HU-HUE-17): al entrar, pide permiso (si lo niega, la app sigue igual);
   registra el Expo push token en el API; al tocar la notificación abre la
   pantalla del pedido (o de la solicitud). Se prueba con el development build.

No hagas: AsyncStorage para tokens, modo sin conexión, ni cambios de SDK.
Primero muéstrame el plan de archivos; después créalos por pasos.
```

## Cómo saber que quedó terminado

1. Con datos de prueba en Expo Go: inicio de sesión, selector y detalle, menú con agotados y carrito.
2. Conectado al API: el código llega a Mailpit y permite entrar; un pedido aparece en la pantalla de Room Service.
3. Al avanzar el pedido en la web, el estado cambia solo en la app.
4. Con el development build: al entregarse el pedido llega la notificación, y al tocarla se abre el pedido.

## Al terminar

Cuando todo lo de "Cómo saber que quedó terminado" funcione, pega esto a la IA:

```text
Terminamos esta tarea. Muéstrame git status y confirma que no se sube ningún .env
ni claves. Luego haz commit, push y abre el pull request a main con un título que
EMPIECE con "OBJ-3A-4:" (por ejemplo "OBJ-3A-4: <resumen corto>"). En la descripción
pon qué se hizo, cómo se probó y la lista de tareas de "17 - Avance del Proyecto.md"
con código OBJ-3A-4 que quedan completas.
```

Pide a un compañero que revise el PR. No marques el archivo 17: Josué lo actualiza una vez al día.
