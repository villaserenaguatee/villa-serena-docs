# 05 — Actividad: disponibilidad y tarifa

**Vista:** Actividad · **Alcance del plan:** Hito.

El mismo cálculo sirve a web, Recepción y canal; el canal aporta su propio monto.

```mermaid
flowchart TB
  I[Hotel / catálogo activo / buscar fechas y huéspedes] --> V{Fechas y capacidad válidas?}
  V -->|No · 1 a 30 noches / entrada hasta 365 días| E[Mostrar motivo y corregir]
  E --> I
  V -->|Sí| T[Por tipo ACTIVO con capacidad suficiente]
  T --> H[Contar habitaciones activas que no estén FUERA_DE_SERVICIO]
  H --> R[Restar por noche reservas PENDIENTE_PAGO / CONFIRMADA / EN_ESTADIA]
  R --> C{Cupo al menos 1 en TODAS las noches?}
  C -->|No| N[No ofrecer ese tipo]
  C -->|Sí| O{Origen externo?}
  O -->|Canal| M[Usar monto del canal como una línea]
  O -->|Web o Recepción| P[Base × ajuste de temporada × ajuste de fin de semana]
  P --> D[Redondear cada noche a 2 decimales y sumar]
  D --> B[Mostrar desglose y total]
  M & B --> RE[Antes de guardar: revalidar cupo en servidor]
  RE --> OK{Sigue disponible?}
  OK -->|No| NO[409 · elegir otra opción]
  OK -->|Sí| G[Crear reserva y congelar precio]
```

## Reglas y límites

- Disponibilidad se comprueba por cada noche, aunque la reserva aún no tenga habitación.
- GTQ, impuestos incluidos y precio fijo al crear la reserva; viernes y sábado son fin de semana.

## Referencias

- [10 RN-RES-001,002,005–008](../10%20-%20Reglas%20de%20Negocio.md)
- [10 RN-TAR-001–010](../10%20-%20Reglas%20de%20Negocio.md)
- [12 UC-01](../12%20-%20Casos%20de%20Uso.md)

**Historias vinculadas:** `HU-HUE-01`, `HU-HUE-02`, `HU-HUE-03`, `HU-HUE-04`, `HU-REC-03`.

[Índice de diagramas](README.md) · [Cobertura de historias](COBERTURA.md) · [Anterior](04-secuencia-general-del-viaje-del-huesped.md) · [Siguiente](06-secuencia-reserva-web-stripe-y-vencimiento.md)
