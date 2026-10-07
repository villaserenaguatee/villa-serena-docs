# OBJ-2D — Web: Gantt, reserva de Recepción y check-in

| Dato | Valor |
|---|---|
| Objetivo | 2 — Recepción (documento 13) |
| Repositorio | `villa-serena-web` |
| Responsable | Kim |
| Horas estimadas | 6,5 h (Gantt 3 h; registro del huésped y creación de la reserva 2,5 h; check-in 1 h) |
| Cubre | HU-REC-01 a HU-REC-04, HU-REC-08 y HU-REC-12 (lado web) |
| Depende de | OBJ-0E (BFF y panel) y contrato parte 1. Para conectar: OBJ-2A (Josué) y OBJ-2B (Pablo) |
| Calendario | Mar 6: comenzar el Gantt. Mié 7: Gantt, reserva de Recepción y check-in |

> **Antes de empezar:** prepara tu computadora con la `16 - Guia de Arranque del Proyecto.md`. Para crear tu rama y subir tu trabajo con un pull request, sigue la sección 3 de `00 - Como usar los prompts.md`.

## Documentos que debes adjuntar a la IA

- `AGENTS.md`
- `openapi.yaml`
- `HU - Recepcionista.md` (HU-REC-01 a 04, 08 y 12)
- `14 - Tecnologias y Arquitectura.md` (sección 4.2)

## Prompt

```text
Trabajas en el repositorio villa-serena-web del proyecto Villa Serena (lee AGENTS.md
y los documentos adjuntos). Responde en español. Copia openapi.yaml y regenera los
tipos. Trabaja en app/panel/recepcion (calendario, nueva reserva y check-in). La
búsqueda, el detalle y las habitaciones son de Alex: enlázalos, no los cambies.
Mientras el API no esté listo, usa datos de prueba con los tipos de openapi.yaml.

1. Calendario Gantt (HU-REC-08) con EventCalendar (@event-calendar/core, licencia
   MIT), vista resourceTimelineMonth:
   - Filas: habitaciones agrupadas por tipo, más la fila "Sin asignar".
   - Barras de entrada a salida; sin CANCELADA. Color por estado e ícono por canal.
   - Clic: resumen (código, huésped, fechas, estado, canal) con enlace al detalle.
   - Navegación por semanas y meses y botón "Hoy".
   - Barras de solo lectura (no se arrastran ni se estiran).
   - Se actualiza al abrir la pantalla. Botón "Nueva reserva".
   Si EventCalendar da problemas con Next.js, cárgalo solo en el cliente (dynamic
   import con ssr: false).
2. Nueva reserva (HU-REC-01, 03 y 04): buscar un huésped existente o registrar uno
   nuevo (6 datos; si el correo ya existe, usar ese perfil con aviso); fechas y
   huéspedes con las mismas reglas de la web; tipos disponibles con cuántas
   quedan, precio por noche y total (del servidor); habitación opcional. Al
   guardar, mensaje si ya no hay disponibilidad. Aviso: "Se paga en el check-out".
3. Check-in (HU-REC-12), desde el detalle o "Llegan hoy": verificar datos del
   principal y adicionales (permite agregar adicionales hasta el número de
   huéspedes, HU-REC-02); pedir asignar habitación si falta; mostrar el motivo si
   no se puede (fecha, pago pendiente o habitación sucia).

No hagas: arrastrar barras, crear reservas seleccionando días en el Gantt (es
Nivel 2) ni cobros por adelantado.
Primero muéstrame el plan de archivos; después créalos por pasos.
```

## Cómo saber que quedó terminado

1. El Gantt muestra las reservas de prueba de Josué con colores e íconos, y navega por semanas y meses.
2. Una reserva creada desde Recepción aparece en el Gantt al guardar.
3. El check-in de una reserva de hoy con habitación limpia la deja `EN_ESTADIA`; con habitación sucia muestra el motivo.

## Al terminar

Cuando todo lo de "Cómo saber que quedó terminado" funcione, pega esto a la IA:

```text
Terminamos esta tarea. Muéstrame git status y confirma que no se sube ningún .env
ni claves. Luego haz commit, push y abre el pull request a main con un título que
EMPIECE con "OBJ-2D:" (por ejemplo "OBJ-2D: <resumen corto>"). En la descripción
pon qué se hizo, cómo se probó y la lista de tareas de "17 - Avance del Proyecto.md"
con código OBJ-2D que quedan completas.
```

Pide a un compañero que revise el PR. No marques el archivo 17: Josué lo actualiza una vez al día.
