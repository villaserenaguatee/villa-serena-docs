# OBJ-3A-3 — Web: Room Service en vivo y cliente de tiempo real

| Dato | Valor |
|---|---|
| Objetivo | 3A — Estadía y Room Service (documento 13) |
| Repositorio | `villa-serena-web` |
| Responsable | Alex |
| Horas estimadas | 5 h (cola y aviso 2 h; detalle, avance, cancelación y menú 2 h; cliente de tiempo real 1 h) |
| Cubre | HU-RS-01 a HU-RS-05 y HU-RS-07 (lado web); cliente de tiempo real compartido |
| Depende de | OBJ-0E (BFF) y contrato parte 2. Para conectar: OBJ-3A-1 (Hugo: Room Service y WebSocket) |
| Calendario | Mié 7: cliente de tiempo real y cola. Jue 8: detalle, avance y menú |

> **Antes de empezar:** prepara tu computadora con la `16 - Guia de Arranque del Proyecto.md`. Para crear tu rama y subir tu trabajo con un pull request, sigue la sección 3 de `00 - Como usar los prompts.md`.

## Documentos que debes adjuntar a la IA

- `AGENTS.md`
- `openapi.yaml` (con la sección `x-websocket`)
- `HU - Room Service.md`
- `14 - Tecnologias y Arquitectura.md` (secciones 6 y 6.1)

## Prompt

```text
Trabajas en el repositorio villa-serena-web del proyecto Villa Serena (lee AGENTS.md
y los documentos adjuntos). Responde en español. Copia openapi.yaml y regenera los
tipos.

PARTE A — Cliente de tiempo real compartido (lo usarán Kim y Alex)
1. Route Handler del BFF que pide a Spring un ticket con POST /api/v1/auth/ws-ticket
   usando la sesión del empleado y lo devuelve al navegador (el JWT nunca sale).
2. Hook useTiempoReal(destino, alRecibir) en lib/tiempo-real con @stomp/stompjs:
   se conecta DIRECTO a Spring (URL pública del WebSocket en una variable
   NEXT_PUBLIC_), envía el ticket en CONNECT, pide un ticket nuevo en cada
   reconexión (la librería se reconecta sola) y llama a un callback "alReconectar"
   para recargar los datos. Una sola conexión compartida por pestaña.
3. Documenta en el README cómo suscribir una pantalla en 3 líneas.

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

No hagas: sonidos, indicador de conexión ni edición de cargos.
Primero muéstrame el plan de archivos; después créalos por pasos.
```

## Cómo saber que quedó terminado

1. Con el WebSocket de Hugo: un pedido hecho desde la app aparece en la cola sin recargar, con su aviso.
2. Avanzar el pedido cambia su estado en la app del huésped sin recargar.
3. Si se apaga y enciende el API, la cola se vuelve a cargar sola.
4. En las herramientas del navegador, el JWT no aparece en ninguna respuesta del BFF.

## Al terminar

Cuando todo lo de "Cómo saber que quedó terminado" funcione, pega esto a la IA:

```text
Terminamos esta tarea. Muéstrame git status y confirma que no se sube ningún .env
ni claves. Luego haz commit, push y abre el pull request a main con un título que
EMPIECE con "OBJ-3A-3:" (por ejemplo "OBJ-3A-3: <resumen corto>"). En la descripción
pon qué se hizo, cómo se probó y la lista de tareas de "17 - Avance del Proyecto.md"
con código OBJ-3A-3 que quedan completas.
```

Pide a un compañero que revise el PR. No marques el archivo 17: Josué lo actualiza una vez al día.
