# OBJ-3B-3 — Web: limpieza y solicitudes

| Dato | Valor |
|---|---|
| Objetivo | 3B — Limpieza y mantenimiento (documento 13) |
| Repositorio | `villa-serena-web` |
| Responsable inicial | Kim |
| Horas estimadas | 3,5 h (limpieza 2 h; solicitudes 1,5 h) |
| Cubre | HU-MYL-01 a HU-MYL-05 (lado web) |
| Depende de | Cliente de tiempo real de Alex (OBJ-3A-3), contrato parte 2. Para conectar: OBJ-3B-1 (Hugo) y OBJ-3B-2 (Carlos) |
| Calendario | Jue 8 |

> **Referencias de trabajo:** la guía 16 describe el entorno; la guía 00, sección 3, describe el flujo con issues, ramas y PR hacia `develop`.

## Referencias para la tarea

La lectura se limita a las secciones necesarias para la issue. AGENTS.md contiene los acuerdos de colaboración; estas referencias se amplían solo si hay una dependencia o discrepancia.

- `AGENTS.md`
- `openapi.yaml` (con la sección `x-websocket`)
- `HU - Mantenimiento y Limpieza.md` (HU-MYL-01 a 05)
- `README.md` de `villa-serena-web` (cómo usar el cliente de tiempo real de Alex)

El ámbito de archivos es una referencia de ubicación; los ajustes necesarios de integración se coordinan sin exclusividad personal. El agente presenta un plan breve y continúa con el trabajo autorizado. La implementación puede adaptarse a la estructura existente; el resultado cumple los criterios siguientes.

## Resultado esperado

```text
Contexto: repositorio villa-serena-web del proyecto Villa Serena (acuerdos en AGENTS.md
y referencias pertinentes de la tarea). Comunicación en español. Los tipos se generan desde la copia local de
openapi.yaml. Ámbito principal: app/panel/limpieza. La pantalla reutiliza el hook useTiempoReal de OBJ-3A-3,
con una conexión compartida por pestaña.

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

Fuera de alcance: sonidos, indicador de conexión y descuento de inventario.
```

## Cómo saber que quedó terminado

1. Iniciar y terminar una limpieza funciona y la habitación sale de la lista.
2. Una solicitud creada en la app aparece sola, con aviso.
3. Un empleado solo de Mantenimiento ve "Acceso denegado".

## Al terminar

Después de integrar la PR en `develop` y verificar el resultado, la issue queda actualizada o cerrada y la casilla correspondiente de `17 - Avance del Proyecto.md` incluye el número de PR (guía 00, sección 3).
