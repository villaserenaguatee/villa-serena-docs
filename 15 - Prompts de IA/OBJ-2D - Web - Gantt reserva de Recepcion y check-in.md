# OBJ-2D — Web: Gantt, reserva de Recepción y check-in

| Dato | Valor |
|---|---|
| Objetivo | 2 — Recepción (documento 13) |
| Repositorio | `villa-serena-web` |
| Responsable inicial | Kim |
| Horas estimadas | 6,5 h (Gantt 3 h; registro del huésped y creación de la reserva 2,5 h; check-in 1 h) |
| Cubre | HU-REC-01 a HU-REC-04, HU-REC-08 y HU-REC-12 (lado web) |
| Depende de | OBJ-0E (BFF y panel) y contrato parte 1. Para conectar: OBJ-2A (Josué) y OBJ-2B (Pablo) |
| Calendario | Mar 6: comenzar el Gantt. Mié 7: Gantt, reserva de Recepción y check-in |

> **Referencias de trabajo:** la guía 16 describe el entorno; la guía 00, sección 3, describe el flujo con issues, ramas y PR hacia `develop`.

## Referencias para la tarea

La lectura se limita a las secciones necesarias para la issue. AGENTS.md contiene los acuerdos de colaboración; estas referencias se amplían solo si hay una dependencia o discrepancia.

- `AGENTS.md`
- `openapi.yaml`
- `HU - Recepcionista.md` (HU-REC-01 a 04, 08 y 12)
- `14 - Tecnologias y Arquitectura.md` (sección 4.2)

El ámbito de archivos es una referencia de ubicación; los ajustes necesarios de integración se coordinan sin exclusividad personal. El agente presenta un plan breve y continúa con el trabajo autorizado. La implementación puede adaptarse a la estructura existente; el resultado cumple los criterios siguientes.

## Resultado esperado

```text
Contexto: repositorio villa-serena-web del proyecto Villa Serena (acuerdos en AGENTS.md
y referencias pertinentes de la tarea). Comunicación en español. Los tipos se generan desde la copia local de
openapi.yaml. Ámbito principal: app/panel/recepcion (calendario, nueva reserva y check-in). La
búsqueda, el detalle y las habitaciones reutilizan OBJ-2E; sus ajustes de
integración se coordinan mediante issue y PR.
Mientras falta el API, la pantalla utiliza datos de prueba con los tipos de openapi.yaml.

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

Fuera de alcance: arrastrar barras, crear reservas seleccionando días en el Gantt (es
Nivel 2) ni cobros por adelantado.
```

## Cómo saber que quedó terminado

1. El Gantt muestra las reservas de prueba de Josué con colores e íconos, y navega por semanas y meses.
2. Una reserva creada desde Recepción aparece en el Gantt al guardar.
3. El check-in de una reserva de hoy con habitación limpia la deja `EN_ESTADIA`; con habitación sucia muestra el motivo.

## Al terminar

Después de integrar la PR en `develop` y verificar el resultado, la issue queda actualizada o cerrada y la casilla correspondiente de `17 - Avance del Proyecto.md` incluye el número de PR (guía 00, sección 3).
