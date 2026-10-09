# 13 — Actividad: limpieza de habitaciones libres

**Vista:** Actividad · **Alcance del plan:** Hito.

Este flujo es diferente de atender una solicitud de un huésped alojado.

```mermaid
flowchart TB
  I[LIMPIEZA o AMBAS abre pendientes] --> F[Filtrar LIBRE y SUCIA / EN_LIMPIEZA; excluir FUERA_DE_SERVICIO]
  F --> P[Priorizar llegada hoy; después antigüedad de suciedad]
  P --> D{Habitación SUCIA disponible?}
  D -->|No / ya tomada| R[Actualizar lista y elegir otra]
  R --> P
  D -->|Sí| T[Iniciar → EN_LIMPIEZA; registrar empleado, fecha e historial]
  T --> W[Publicar cambio de habitación después del commit]
  W --> A{Empleado a cargo decide}
  A -->|Interrumpir| S[Volver a SUCIA y liberar responsable]
  S --> P
  A -->|Terminar| L[LIMPIA y fuera de pendientes]
  L --> N[Actualizar Recepción y Limpieza por WS]
  N --> C((Habilita check-in si se cumplen las demás condiciones))
  REC[Recepción marca LIBRE + LIMPIA como SUCIA] --> P
  OUT[Check-out sin incidencia bloqueante → SUCIA] --> P
```

## Reglas y límites

- Las ocupadas no aparecen en esta lista; se atienden mediante solicitud del huésped.
- Recepción solo puede marcar SUCIA una LIBRE + LIMPIA; no puede marcar LIMPIA.

## Referencias

- [10 RN-LIM-001,002,004,010,011](../10%20-%20Reglas%20de%20Negocio.md)
- [07 C2–C5](../07%20-%20Estados.md)
- [12 UC-07](../12%20-%20Casos%20de%20Uso.md)

**Historias vinculadas:** `HU-REC-10`, `HU-REC-11`, `HU-MYL-01`, `HU-MYL-02`, `HU-MYL-03`.

[Índice de diagramas](README.md) · [Cobertura de historias](COBERTURA.md) · [Anterior](12-secuencia-limpieza-o-articulos-solicitados.md) · [Siguiente](14-actividad-incidencia-y-recuperacion-de-habitacion.md)
