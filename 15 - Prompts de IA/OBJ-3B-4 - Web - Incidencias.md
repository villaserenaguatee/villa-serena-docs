# OBJ-3B-4 — Web: incidencias

| Dato | Valor |
|---|---|
| Objetivo | 3B — Limpieza y mantenimiento (documento 13) |
| Repositorio | `villa-serena-web` |
| Responsable inicial | Alex |
| Horas estimadas | 2,5 h |
| Cubre | HU-MYL-06 a HU-MYL-08 y HU-REC-17 (lado web); suscripción en vivo del estado de las habitaciones de Recepción |
| Depende de | OBJ-3A-3 (tu cliente de tiempo real), OBJ-2E (tu tablero de habitaciones) y contrato parte 2. Para conectar: OBJ-3B-1 (Hugo) |
| Calendario | Jue 8 |

> **Referencias de trabajo:** la guía 16 describe el entorno; la guía 00, sección 3, describe el flujo con issues, ramas y PR hacia `develop`.

## Referencias para la tarea

La lectura se limita a las secciones necesarias para la issue. AGENTS.md contiene los acuerdos de colaboración; estas referencias se amplían solo si hay una dependencia o discrepancia.

- `AGENTS.md`
- `openapi.yaml`
- `HU - Mantenimiento y Limpieza.md` (HU-MYL-06 a 08) y `HU - Recepcionista.md` (HU-REC-10 y HU-REC-17)

El agente presenta un plan breve y continúa con el trabajo autorizado. La implementación puede adaptarse a la estructura existente; el resultado cumple los criterios siguientes.

## Resultado esperado

```text
Contexto: repositorio villa-serena-web del proyecto Villa Serena (acuerdos en AGENTS.md
y referencias pertinentes de la tarea). Comunicación en español. Los tipos se generan desde la copia local de
openapi.yaml.

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
3. El tablero de habitaciones de Recepción (OBJ-2E) se actualiza con
   /topic/habitaciones mediante useTiempoReal. El botón "Actualizar" es opcional
   como respaldo. En FUERA_DE_SERVICIO se muestra la incidencia que bloquea
   la habitación (solo lectura).
```

## Cómo saber que quedó terminado

1. Reportar un daño con foto crea la incidencia; una foto de 6 MB se rechaza antes de enviarla.
2. Tomar y resolver funciona solo para el técnico a cargo.
3. El tablero de Recepción cambia solo cuando Limpieza inicia o termina una habitación.

## Al terminar

Después de integrar la PR en `develop` y verificar el resultado, la issue queda actualizada o cerrada y la casilla correspondiente de `17 - Avance del Proyecto.md` incluye el número de PR (guía 00, sección 3).
