# OBJ-3B-3 — Web: limpieza y solicitudes

| Dato | Valor |
|---|---|
| Objetivo | 3B — Limpieza y mantenimiento (documento 13) |
| Repositorio | `villa-serena-web` |
| Responsable | Kim |
| Horas estimadas | 3,5 h (limpieza 2 h; solicitudes 1,5 h) |
| Cubre | HU-MYL-01 a HU-MYL-05 (lado web) |
| Depende de | Cliente de tiempo real de Alex (OBJ-3A-3), contrato parte 2. Para conectar: OBJ-3B-1 (Hugo) y OBJ-3B-2 (Carlos) |
| Calendario | Jue 8 |

> **Antes de empezar:** prepara tu computadora con la `16 - Guia de Arranque del Proyecto.md`. Para crear tu rama y subir tu trabajo con un pull request, sigue la sección 3 de `00 - Como usar los prompts.md`.

## Documentos que debes adjuntar a la IA

- `AGENTS.md`
- `openapi.yaml` (con la sección `x-websocket`)
- `HU - Mantenimiento y Limpieza.md` (HU-MYL-01 a 05)
- `README.md` de `villa-serena-web` (cómo usar el cliente de tiempo real de Alex)

## Prompt

```text
Trabajas en el repositorio villa-serena-web del proyecto Villa Serena (lee AGENTS.md
y los documentos adjuntos). Responde en español. Copia openapi.yaml y regenera los
tipos. Trabaja en app/panel/limpieza. Usa el hook useTiempoReal de Alex; no crees
otra conexión.

Solo para MANTENIMIENTO_LIMPIEZA con área LIMPIEZA o AMBAS (si no, "Acceso denegado").

1. Habitaciones por limpiar (HU-MYL-01 a 03): SUCIA y EN_LIMPIEZA con número, piso,
   condición y empleado a cargo; primero "Llegada hoy". Botones "Iniciar" (en
   SUCIA), "Interrumpir" y "Terminar" (solo si estás a cargo). Si el API responde
   409, muestra quién la está limpiando y recarga. Suscripción a
   /topic/habitaciones: al quedar LIMPIA sale de la lista; al reconectar, recarga.
2. Solicitudes (HU-MYL-04 y 05): PENDIENTE y EN_PROCESO por antigüedad, con
   habitación, piso, tipo, hora, estado, empleado y artículos con cantidades.
   Suscripción a /topic/solicitudes con aviso visual de solicitud nueva.
   Botones "Tomar" (en PENDIENTE) y "Atendida" (solo si estás a cargo). Si el
   API responde 409 (ya tomada o cancelada), muestra el motivo y recarga.

No hagas: sonidos, indicador de conexión ni descuento de inventario.
Primero muéstrame el plan de archivos; después créalos por pasos.
```

## Cómo saber que quedó terminado

1. Iniciar y terminar una limpieza funciona y la habitación sale de la lista.
2. Una solicitud creada en la app aparece sola, con aviso.
3. Un empleado solo de Mantenimiento ve "Acceso denegado".

## Al terminar

Cuando todo lo de "Cómo saber que quedó terminado" funcione, pega esto a la IA:

```text
Terminamos esta tarea. Muéstrame git status y confirma que no se sube ningún .env
ni claves. Luego haz commit, push y abre el pull request a main con un título que
EMPIECE con "OBJ-3B-3:" (por ejemplo "OBJ-3B-3: <resumen corto>"). En la descripción
pon qué se hizo, cómo se probó y la lista de tareas de "17 - Avance del Proyecto.md"
con código OBJ-3B-3 que quedan completas.
```

Pide a un compañero que revise el PR. No marques el archivo 17: Josué lo actualiza una vez al día.
