# OBJ-2B — API: reservas de Recepción, cancelación y check-in

| Dato | Valor |
|---|---|
| Objetivo | 2 — Recepción (documento 13) |
| Repositorio | `villa-serena-api` |
| Responsable | Pablo |
| Horas estimadas | 3,5 h (disponibilidad y creación desde Recepción 1,5 h; cancelación 1 h; check-in 1 h) |
| Cubre | HU-REC-03, HU-REC-04, HU-REC-05 y HU-REC-12 (lado API) |
| Depende de | OBJ-1B (tus servicios de disponibilidad, tarifa, reserva y Stripe), OBJ-1C (aviso de confirmación de Hugo) y OBJ-2C (asignación de habitación de Hugo) |
| Calendario | Mié 7: reservas de Recepción. Jue 8: check-in. La cancelación queda entre tus pendientes previstos (documento 13, sección 7.3): hazla con tus horas opcionales o en cuanto termines lo demás |

> **Antes de empezar:** prepara tu computadora con la `16 - Guia de Arranque del Proyecto.md`. Para crear tu rama y subir tu trabajo con un pull request, sigue la sección 3 de `00 - Como usar los prompts.md`.

## Documentos que debes adjuntar a la IA

- `AGENTS.md`
- `openapi.yaml`
- `HU - Recepcionista.md` (HU-REC-03, 04, 05 y 12)
- `07 - Estados.md` (secciones 3, 4, 5 y 11)
- `10 - Reglas de Negocio.md` (reglas RN-RES, RN-CAN y RN-PAG)

## Prompt

```text
Trabajas en el repositorio villa-serena-api del proyecto Villa Serena (lee AGENTS.md
y los documentos adjuntos). Responde en español. REUTILIZA DisponibilidadService,
TarifaService, ReservaService y la integración con Stripe que ya hiciste en OBJ-1B;
no dupliques reglas.

1. Disponibilidad para Recepción (HU-REC-03): mismas reglas de la web, mostrando
   además cuántas habitaciones quedan por tipo, precio por noche y total.
2. Crear reserva desde Recepción (HU-REC-04): huésped existente o nuevo; mismas
   validaciones; habitación opcional (usa la asignación de Hugo). Revalida la
   disponibilidad al guardar. Nace CONFIRMADA, canal "Recepción", con el
   recepcionista que la creó y la cuenta ABIERTA con el cargo por alojamiento,
   SIN pago (se paga en el check-out). Llama a ConfirmacionReservaNotifier.
3. Cancelar (HU-REC-05): solo CONFIRMADA y nunca de canal externo (mensaje "Las
   reservas de canal no se cancelan desde el sistema"). Motivo obligatorio.
   Endpoint de "vista previa" que dice qué pasará con el dinero: reembolso total
   si faltan 48 h o más para las 15:00 del día de llegada (America/Guatemala) y
   hubo pago en línea; sin reembolso si faltan menos; nada si no hay pagos.
   Al confirmar: reembolso en Stripe si corresponde (pago REEMBOLSADO); si Stripe
   lo rechaza, NO se cancela y se informa el error. Reserva CANCELADA, cuenta
   CERRADA, habitación liberada, historial con motivo.
4. Check-in (HU-REC-12): solo CONFIRMADA, con hoy entre la fecha de entrada y el
   día anterior a la salida (America/Guatemala). Exige habitación asignada y
   LIBRE + LIMPIA. Reserva EN_ESTADIA y habitación OCUPADA en una sola
   transacción; publica el cambio de habitación (HabitacionEventos de Hugo).
5. Pruebas: cancelación con 48 h exactas, con menos, sin pagos y de canal; check-in
   fuera de fecha, sin habitación y con habitación sucia.
No crees migraciones: pídeselas a Josué.
Primero muéstrame el plan; después impleméntalo.
```

## Cómo saber que quedó terminado

1. Una reserva de Recepción nace `CONFIRMADA`, sin pago, y llega el correo a Mailpit.
2. La vista previa de cancelación dice lo correcto en los tres casos; cancelar una reserva web con 48 h o más reembolsa en Stripe.
3. El check-in solo funciona dentro de las fechas y con la habitación libre y limpia.
4. `mvnw.cmd test` pasa.

## Al terminar

Cuando todo lo de "Cómo saber que quedó terminado" funcione, pega esto a la IA:

```text
Terminamos esta tarea. Muéstrame git status y confirma que no se sube ningún .env
ni claves. Luego haz commit, push y abre el pull request a main con un título que
EMPIECE con "OBJ-2B:" (por ejemplo "OBJ-2B: <resumen corto>"). En la descripción
pon qué se hizo, cómo se probó y la lista de tareas de "17 - Avance del Proyecto.md"
con código OBJ-2B que quedan completas.
```

Pide a un compañero que revise el PR. No marques el archivo 17: Josué lo actualiza una vez al día.
