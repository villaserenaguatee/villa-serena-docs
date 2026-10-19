# 14 — Actividad: incidencia y recuperación de habitación

**Vista:** Actividad · **Alcance del plan:** Hito.

Un daño con huésped alojado se atiende sin cambiarlo de habitación.

```mermaid
flowchart TB
  I[Reportar habitación, descripción, impide uso y foto opcional] --> R[Incidencia REPORTADA + autor e historial]
  R --> B{Impide usarla?}
  B -->|No| SAME[Conservar condición]
  B -->|Sí| O{Está OCUPADA?}
  O -->|Sí| OC[Indicador Incidencia pendiente; reparar con huésped alojado]
  O -->|No · LIBRE| FS[FUERA_DE_SERVICIO; excluir del cupo]
  FS --> REV[Recepción revisa asignaciones futuras]
  SAME & OC & REV --> T[Técnico autorizado toma → EN_PROCESO]
  T --> OWN{Es el técnico a cargo y describe solución?}
  OWN -->|No| ERR[Rechazar resolución]
  ERR --> T
  OWN -->|Sí| END[RESUELTA e historial]
  END --> Q{Queda otra incidencia que impida uso?}
  Q -->|Sí| KEEP[Conservar bloqueo o indicador]
  Q -->|No| H{Está FUERA_DE_SERVICIO?}
  H -->|Sí| SU[SUCIA → entra a limpieza]
  H -->|No · ocupada| CLEAR[Quitar indicador; conservar condición]
  SU --> W[WS cambio habitación]
  KEEP & CLEAR & W --> F((Fin de incidencia))
```

## Reglas y límites

- Reporta Recepción o cualquier área MYL; toma y resuelve MANTENIMIENTO o AMBAS.
- Solo el técnico a cargo resuelve, con solución obligatoria. No hay reasignación ni repuestos.
- Recepción revisa futuras asignaciones en el calendario; no hay aviso automático para esas reservas.

## Referencias

- [10 RN-MAN](../10%20-%20Reglas%20de%20Negocio.md)
- [10 RN-HAB-001–003,006](../10%20-%20Reglas%20de%20Negocio.md)
- [12 UC-08](../12%20-%20Casos%20de%20Uso.md)

**Historias vinculadas:** `HU-REC-17`, `HU-MYL-06`, `HU-MYL-07`, `HU-MYL-08`.

[Índice de diagramas](README.md) · [Cobertura de historias](COBERTURA.md) · [Anterior](13-actividad-limpieza-de-habitaciones-libres.md) · [Siguiente](15-secuencia-cuenta-cargos-y-saldo.md)
