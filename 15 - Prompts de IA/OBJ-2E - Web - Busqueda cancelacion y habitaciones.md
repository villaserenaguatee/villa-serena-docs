# OBJ-2E — Web: búsqueda de reservas, cancelación y habitaciones

| Dato | Valor |
|---|---|
| Objetivo | 2 — Recepción (documento 13) |
| Repositorio | `villa-serena-web` |
| Responsable | Alex |
| Horas estimadas | 4 h (búsqueda, cancelación, asignación y canal 2,5 h; estado de las habitaciones y marcar sucia 1,5 h) |
| Cubre | HU-REC-05, HU-REC-06, HU-REC-07, HU-REC-10, HU-REC-11 y HU-CM-02 (lado web) |
| Depende de | OBJ-0E (BFF y panel) y contrato parte 1 (OBJ-0G). Para conectar: búsqueda de Josué (OBJ-2A), cancelación de Pablo (OBJ-2B) y habitaciones de Hugo (OBJ-2C) |
| Calendario | Lun 5: búsqueda. Mar 6: cancelar, asignar y habitaciones |

> **Antes de empezar:** prepara tu computadora con la `16 - Guia de Arranque del Proyecto.md`. Para crear tu rama y subir tu trabajo con un pull request, sigue la sección 3 de `00 - Como usar los prompts.md`.

## Documentos que debes adjuntar a la IA

- `AGENTS.md`
- `openapi.yaml` (contrato, parte 1)
- `HU - Recepcionista.md` (HU-REC-05 a HU-REC-07, HU-REC-10 y HU-REC-11) y `HU - Channel Manager.md` (HU-CM-02)
- `07 - Estados.md` (secciones 3 y 4)

## Prompt

```text
Trabajas en el repositorio villa-serena-web del proyecto Villa Serena (lee AGENTS.md
y los documentos adjuntos). Responde en español. Copia openapi.yaml y regenera los
tipos. Trabaja solo en app/panel/recepcion (búsqueda, detalle y habitaciones) y
components/panel. El Gantt, la creación de reservas y el check-in son de Kim.

Mientras el API no esté listo, usa datos de prueba con los tipos de openapi.yaml en
lib/mocks/recepcion.ts.

1. Búsqueda de reservas (HU-REC-06 y HU-CM-02): por nombre, documento, código y
   rango de fechas; filtros por estado y canal de origen; filtros rápidos "Llegan
   hoy" y "Salen hoy". Resultados con código, huésped, fechas, tipo, habitación
   (o "Sin asignar"), estado y canal (con su identificador externo si es Booking o
   Expedia). Mensaje claro si no hay resultados.
2. Detalle de la reserva: datos del huésped y adicionales, fechas, tipo,
   habitación, total, canal e historial de estados (fecha, hora y responsable).
   Solo muestra las acciones válidas para el estado (asignar habitación,
   check-in, cancelar, ver la cuenta, check-out, imprimir factura); los enlaces
   de check-in, cuenta y check-out llevan a las pantallas de Kim.
3. Cancelar (HU-REC-05): solo CONFIRMADA y nunca de canal externo (mensaje "Las
   reservas de canal no se cancelan desde el sistema"). Motivo obligatorio. Antes
   de confirmar, explica qué pasa con el dinero (reembolso total con 48 h o más
   antes de las 15:00 del día de llegada; sin reembolso con menos; nada si no hay
   pagos), según lo que devuelva el API. Muestra el error si Stripe rechaza.
4. Asignar o cambiar la habitación (HU-REC-07): solo PENDIENTE_PAGO o CONFIRMADA;
   lista de habitaciones permitidas que devuelve el API; mensaje si el API
   responde 409 por traslape.
5. Estado de las habitaciones (HU-REC-10 y HU-REC-11): tarjetas con número, tipo,
   piso, ocupación, condición e indicadores; filtros; botón "Marcar sucia" solo
   en LIBRE + LIMPIA. El tiempo real llega con el objetivo 3A: por ahora se
   actualiza al abrir la pantalla y con un botón "Actualizar".

No hagas: no calcules reembolsos en el navegador ni agregues acciones que no
estén en las historias.
Primero muéstrame el plan de archivos; después créalos por pasos.
```

## Cómo saber que quedó terminado

1. Con datos de prueba: búsqueda con filtros, detalle con historial y acciones según el estado.
2. Una reserva de canal no muestra "Cancelar".
3. "Marcar sucia" solo aparece en habitaciones libres y limpias.
4. Conectado al API: cancelar una reserva pagada con 48 h o más devuelve el dinero en Stripe (modo prueba).

## Al terminar

Cuando todo lo de "Cómo saber que quedó terminado" funcione, pega esto a la IA:

```text
Terminamos esta tarea. Muéstrame git status y confirma que no se sube ningún .env
ni claves. Luego haz commit, push y abre el pull request a main con un título que
EMPIECE con "OBJ-2E:" (por ejemplo "OBJ-2E: <resumen corto>"). En la descripción
pon qué se hizo, cómo se probó y la lista de tareas de "17 - Avance del Proyecto.md"
con código OBJ-2E que quedan completas.
```

Pide a un compañero que revise el PR. No marques el archivo 17: Josué lo actualiza una vez al día.
