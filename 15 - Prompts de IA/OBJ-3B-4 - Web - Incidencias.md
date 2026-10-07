# OBJ-3B-4 — Web: incidencias

| Dato | Valor |
|---|---|
| Objetivo | 3B — Limpieza y mantenimiento (documento 13) |
| Repositorio | `villa-serena-web` |
| Responsable | Alex |
| Horas estimadas | 2,5 h |
| Cubre | HU-MYL-06 a HU-MYL-08 y HU-REC-17 (lado web); suscripción en vivo del estado de las habitaciones de Recepción |
| Depende de | OBJ-3A-3 (tu cliente de tiempo real), OBJ-2E (tu tablero de habitaciones) y contrato parte 2. Para conectar: OBJ-3B-1 (Hugo) |
| Calendario | Jue 8 |

> **Antes de empezar:** prepara tu computadora con la `16 - Guia de Arranque del Proyecto.md`. Para crear tu rama y subir tu trabajo con un pull request, sigue la sección 3 de `00 - Como usar los prompts.md`.

## Documentos que debes adjuntar a la IA

- `AGENTS.md`
- `openapi.yaml`
- `HU - Mantenimiento y Limpieza.md` (HU-MYL-06 a 08) y `HU - Recepcionista.md` (HU-REC-10 y HU-REC-17)

## Prompt

```text
Trabajas en el repositorio villa-serena-web del proyecto Villa Serena (lee AGENTS.md
y los documentos adjuntos). Responde en español. Copia openapi.yaml y regenera los
tipos.

1. Reportar un daño (HU-REC-17 y HU-MYL-06): formulario reutilizable para
   Recepción (desde el tablero de habitaciones) y para Mantenimiento/Limpieza:
   habitación, descripción obligatoria, "¿Impide usar la habitación?" y foto
   opcional (solo JPG o PNG de hasta 5 MB; valida antes de enviar). La foto se
   envía por el BFF como multipart.
2. Incidencias (HU-MYL-07 y 08) en app/panel/mantenimiento, solo área
   MANTENIMIENTO o AMBAS (si no, "Acceso denegado"): REPORTADA y EN_PROCESO por
   antigüedad, con habitación, piso, descripción, foto (URL firmada), si impide el
   uso, si está ocupada, quién la reportó, fecha y técnico. "Tomar" y "Resolver"
   (solución obligatoria; solo el técnico a cargo). Si el API responde 409,
   muestra quién la tiene y recarga.
3. Tablero de habitaciones de Recepción (tu OBJ-2E): suscríbelo a
   /topic/habitaciones con useTiempoReal para que se actualice solo; quita el
   botón "Actualizar" o déjalo como respaldo. En FUERA_DE_SERVICIO, muestra la
   incidencia que la bloquea (solo lectura).

Primero muéstrame el plan de archivos; después créalos por pasos.
```

## Cómo saber que quedó terminado

1. Reportar un daño con foto crea la incidencia; una foto de 6 MB se rechaza antes de enviarla.
2. Tomar y resolver funciona solo para el técnico a cargo.
3. El tablero de Recepción cambia solo cuando Limpieza inicia o termina una habitación.

## Al terminar

Cuando todo lo de "Cómo saber que quedó terminado" funcione, pega esto a la IA:

```text
Terminamos esta tarea. Muéstrame git status y confirma que no se sube ningún .env
ni claves. Luego haz commit, push y abre el pull request a main con un título que
EMPIECE con "OBJ-3B-4:" (por ejemplo "OBJ-3B-4: <resumen corto>"). En la descripción
pon qué se hizo, cómo se probó y la lista de tareas de "17 - Avance del Proyecto.md"
con código OBJ-3B-4 que quedan completas.
```

Pide a un compañero que revise el PR. No marques el archivo 17: Josué lo actualiza una vez al día.
