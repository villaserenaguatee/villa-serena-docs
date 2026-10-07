# OBJ-2C — API: habitaciones (asignar, estado y marcar sucia)

| Dato | Valor |
|---|---|
| Objetivo | 2 — Recepción (documento 13) |
| Repositorio | `villa-serena-api` |
| Responsable inicial | Hugo |
| Horas estimadas | 1,5 h |
| Cubre | HU-REC-07, HU-REC-10, HU-REC-11 (lado API) |
| Depende de | OBJ-0C (tablas), OBJ-0D (seguridad) y contrato parte 1 (OBJ-0G). El aviso en tiempo real llega con el WebSocket (OBJ-3A-1) |
| Calendario | Lun 5 |

> **Referencias de trabajo:** la guía 16 describe el entorno; la guía 00, sección 3, describe el flujo con issues, ramas y PR hacia `develop`.

## Referencias para la tarea

La lectura se limita a las secciones necesarias para la issue. AGENTS.md contiene los acuerdos de colaboración; estas referencias se amplían solo si hay una dependencia o discrepancia.

- `AGENTS.md`
- `openapi.yaml` (contrato, parte 1)
- `HU - Recepcionista.md` (HU-REC-07, HU-REC-10 y HU-REC-11)
- `07 - Estados.md` (sección 4, habitación)
- `09 - Matriz de Permisos.md` (sección 3.3)

El agente presenta un plan breve y continúa con el trabajo autorizado. La implementación puede adaptarse a la estructura existente; el resultado cumple los criterios siguientes.

## Resultado esperado

```text
Contexto: repositorio villa-serena-api del proyecto Villa Serena (acuerdos en AGENTS.md
y referencias pertinentes de la tarea). Comunicación en español.

Objetivo: el módulo de habitaciones para Recepción (paquete estadia), según
openapi.yaml. El módulo de habitaciones integra las reservas de OBJ-1B y OBJ-2B.

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
5. HabitacionEventos.publicarCambio(habitacionId) queda disponible con TODO,
   donde el WebSocket (OBJ-3A-1) enviará el evento 4.
6. Permisos según el documento 09; pruebas de cada regla y de un 403 por rol.

Los cambios de esquema necesarios se coordinan mediante issues y PR, conservando las migraciones ya aplicadas.
```

## Cómo saber que quedó terminado

1. La lista de habitaciones devuelve ocupación, condición e indicadores, y los filtros funcionan.
2. Marcar sucia una habitación ocupada da 409; una libre y limpia pasa a `SUCIA`.
3. Asignar una habitación que ya está ocupada en esas fechas da 409.
4. `mvnw.cmd test` pasa.

## Al terminar

Después de integrar la PR en `develop` y verificar el resultado, la issue queda actualizada o cerrada y la casilla correspondiente de `17 - Avance del Proyecto.md` incluye el número de PR (guía 00, sección 3).
