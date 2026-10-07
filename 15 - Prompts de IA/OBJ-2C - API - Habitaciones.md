# OBJ-2C — API: habitaciones (asignar, estado y marcar sucia)

| Dato | Valor |
|---|---|
| Objetivo | 2 — Recepción (documento 13) |
| Repositorio | `villa-serena-api` |
| Responsable | Hugo |
| Horas estimadas | 1,5 h |
| Cubre | HU-REC-07, HU-REC-10, HU-REC-11 (lado API) |
| Depende de | OBJ-0C (tablas), OBJ-0D (seguridad) y contrato parte 1 (OBJ-0G). El aviso en tiempo real llega con el WebSocket (OBJ-3A-1) |
| Calendario | Lun 5 |

> **Antes de empezar:** prepara tu computadora con la `16 - Guia de Arranque del Proyecto.md`. Para crear tu rama y subir tu trabajo con un pull request, sigue la sección 3 de `00 - Como usar los prompts.md`.

## Documentos que debes adjuntar a la IA

- `AGENTS.md`
- `openapi.yaml` (contrato, parte 1)
- `HU - Recepcionista.md` (HU-REC-07, HU-REC-10 y HU-REC-11)
- `07 - Estados.md` (sección 4, habitación)
- `09 - Matriz de Permisos.md` (sección 3.3)

## Prompt

```text
Trabajas en el repositorio villa-serena-api del proyecto Villa Serena (lee AGENTS.md
y los documentos adjuntos). Responde en español.

Objetivo: el módulo de habitaciones para Recepción (paquete estadia), según
openapi.yaml. Eres el dueño de "habitaciones"; reservas es de Pablo.

1. Estado de las habitaciones (HU-REC-10): número, tipo, piso, ocupación
   (LIBRE/OCUPADA) y condición (LIMPIA/SUCIA/EN_LIMPIEZA/FUERA_DE_SERVICIO), con
   los indicadores "Llega hoy", "Sale hoy" e "Incidencia pendiente" (calculados con
   "hoy" en America/Guatemala) y filtros por ocupación, condición, tipo y piso.
   Para FUERA_DE_SERVICIO, la incidencia que la bloquea (solo lectura).
2. Marcar sucia (HU-REC-11): solo LIBRE + LIMPIA → SUCIA. En cualquier otro caso,
   409 con mensaje en español. Recepción no marca limpia ni cambia la ocupación.
3. Asignar o cambiar la habitación (HU-REC-07): solo reservas PENDIENTE_PAGO o
   CONFIRMADA; solo habitaciones del mismo tipo, que no estén FUERA_DE_SERVICIO y
   sin otra reserva activa que se traslape. Vuelve a validar el traslape al
   guardar (la restricción EXCLUDE de la base también lo protege; tradúcela a 409).
   No exige que esté limpia.
4. Cada cambio se registra con HistorialEstadoService (fecha, hora y responsable).
5. Deja un método HabitacionEventos.publicarCambio(habitacionId) vacío, con TODO,
   donde el WebSocket (OBJ-3A-1) enviará el evento 4.
6. Permisos según el documento 09; pruebas de cada regla y de un 403 por rol.

No crees migraciones: pídeselas a Josué.
Primero muéstrame el plan; después impleméntalo.
```

## Cómo saber que quedó terminado

1. La lista de habitaciones devuelve ocupación, condición e indicadores, y los filtros funcionan.
2. Marcar sucia una habitación ocupada da 409; una libre y limpia pasa a `SUCIA`.
3. Asignar una habitación que ya está ocupada en esas fechas da 409.
4. `mvnw.cmd test` pasa.

## Al terminar

Cuando todo lo de "Cómo saber que quedó terminado" funcione, pega esto a la IA:

```text
Terminamos esta tarea. Muéstrame git status y confirma que no se sube ningún .env
ni claves. Luego haz commit, push y abre el pull request a main con un título que
EMPIECE con "OBJ-2C:" (por ejemplo "OBJ-2C: <resumen corto>"). En la descripción
pon qué se hizo, cómo se probó y la lista de tareas de "17 - Avance del Proyecto.md"
con código OBJ-2C que quedan completas.
```

Pide a un compañero que revise el PR. No marques el archivo 17: Josué lo actualiza una vez al día.
