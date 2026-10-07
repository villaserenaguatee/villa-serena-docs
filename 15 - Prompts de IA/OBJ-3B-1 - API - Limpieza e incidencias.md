# OBJ-3B-1 — API: limpieza de habitaciones e incidencias

| Dato | Valor |
|---|---|
| Objetivo | 3B — Limpieza y mantenimiento (documento 13) |
| Repositorio | `villa-serena-api` |
| Responsable | Hugo |
| Horas estimadas | 3,5 h (limpieza 1,5 h; incidencias con foto 2 h) |
| Cubre | HU-MYL-01 a HU-MYL-03, HU-MYL-06 a HU-MYL-08 y HU-REC-17 (lado API) |
| Depende de | OBJ-2C (tus habitaciones), OBJ-3A-1 (tu WebSocket) y contrato parte 2 |
| Calendario | Mié 7: limpieza. Jue 8: terminar limpieza e incidencias |

> **Antes de empezar:** prepara tu computadora con la `16 - Guia de Arranque del Proyecto.md`. Para crear tu rama y subir tu trabajo con un pull request, sigue la sección 3 de `00 - Como usar los prompts.md`.

## Documentos que debes adjuntar a la IA

- `AGENTS.md`
- `openapi.yaml`
- `HU - Mantenimiento y Limpieza.md` (HU-MYL-01 a 03 y 06 a 08) y `HU - Recepcionista.md` (HU-REC-17)
- `07 - Estados.md` (secciones 4 y 8)
- `09 - Matriz de Permisos.md` (secciones 3.3, 3.6 y 7.5)
- `14 - Tecnologias y Arquitectura.md` (sección 6: archivos subidos)

## Prompt

```text
Trabajas en el repositorio villa-serena-api del proyecto Villa Serena (lee AGENTS.md
y los documentos adjuntos). Responde en español. Paquete piso; reutiliza tu módulo
de habitaciones y HabitacionEventos.

PARTE A — Limpieza (solo MANTENIMIENTO_LIMPIEZA con área LIMPIEZA o AMBAS)
1. Pendientes (HU-MYL-01): SUCIA y EN_LIMPIEZA (no FUERA_DE_SERVICIO ni ocupadas),
   con el empleado a cargo; primero las que tienen llegada hoy (etiqueta), luego
   por tiempo que llevan SUCIA.
2. Iniciar (HU-MYL-02): SUCIA → EN_LIMPIEZA a nombre del empleado; si otro ya la
   inició, 409 con su nombre. Interrumpir: solo el empleado a cargo, vuelve a SUCIA.
3. Terminar (HU-MYL-03): solo el empleado a cargo, EN_LIMPIEZA → LIMPIA.
4. Cada cambio: historial y evento 4 (/topic/habitaciones).

PARTE B — Incidencias
1. Reportar (HU-MYL-06 y HU-REC-17): RECEPCION o MANTENIMIENTO_LIMPIEZA. Habitación
   y descripción obligatorias; "impide el uso"; foto opcional SOLO JPG o PNG de
   hasta 5 MB (valida tipo y tamaño) guardada en el bucket privado de MinIO (AWS
   SDK S3). Queda REPORTADA. Si impide el uso y la habitación está LIBRE →
   FUERA_DE_SERVICIO; si está OCUPADA → no cambia (indicador "Incidencia
   pendiente"; al hacer check-out pasará a FUERA_DE_SERVICIO: deja un método
   que el check-out de Pablo pueda consultar).
2. Ver y tomar (HU-MYL-07): solo área MANTENIMIENTO o AMBAS. REPORTADA y
   EN_PROCESO por antigüedad; tomar → EN_PROCESO a nombre del técnico; si otro ya
   la tomó, 409 con su nombre. La foto se entrega con URL firmada de corta
   duración.
3. Resolver (HU-MYL-08): solo el técnico a cargo, solución obligatoria → RESUELTA
   (ya no se modifica). Si la habitación estaba FUERA_DE_SERVICIO y no tiene otra
   incidencia que impida su uso → SUCIA; si está OCUPADA, se quita el indicador.
4. Historial y evento 4 en cada cambio de habitación.

Pruebas: concurrencia (dos empleados a la vez), permisos por área (403), foto de
6 MB o PDF rechazada, y resolver con otra incidencia pendiente.
No crees migraciones: pídeselas a Josué.
Primero muéstrame el plan; después impleméntalo por partes.
```

## Cómo saber que quedó terminado

1. Iniciar y terminar una limpieza cambia la habitación y Recepción lo ve en vivo.
2. Un empleado solo de Mantenimiento no puede ver la limpieza (403), y uno solo de Limpieza no puede ver las incidencias.
3. Reportar un daño que impide el uso en una habitación libre la deja `FUERA_DE_SERVICIO`; al resolverlo pasa a `SUCIA`.
4. Una foto mayor de 5 MB es rechazada.

## Al terminar

Cuando todo lo de "Cómo saber que quedó terminado" funcione, pega esto a la IA:

```text
Terminamos esta tarea. Muéstrame git status y confirma que no se sube ningún .env
ni claves. Luego haz commit, push y abre el pull request a main con un título que
EMPIECE con "OBJ-3B-1:" (por ejemplo "OBJ-3B-1: <resumen corto>"). En la descripción
pon qué se hizo, cómo se probó y la lista de tareas de "17 - Avance del Proyecto.md"
con código OBJ-3B-1 que quedan completas.
```

Pide a un compañero que revise el PR. No marques el archivo 17: Josué lo actualiza una vez al día.
