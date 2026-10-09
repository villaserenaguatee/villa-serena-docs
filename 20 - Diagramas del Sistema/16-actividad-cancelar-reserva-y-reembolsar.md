# 16 — Actividad: cancelar reserva y reembolsar

**Vista:** Actividad · **Alcance del plan:** Hito.

Recepción cancela solo CONFIRMADA de origen directo; canal permanece fuera de esta operación.

```mermaid
flowchart TB
  I[Recepción busca reserva y solicita cancelar] --> V{CONFIRMADA y no es canal externo?}
  V -->|No| E[Rechazar operación]
  V -->|Sí| M[Ingresar motivo y mostrar consecuencias del dinero]
  M --> P{Pago Stripe aprobado y al menos 48 h antes de llegada 15:00?}
  P -->|Sí| R[Solicitar reembolso TOTAL a Stripe]
  R --> OK{Stripe acepta?}
  OK -->|No| ERR[Mostrar fallo; conservar reserva y pago]
  OK -->|Sí| RE[Pago REEMBOLSADO]
  P -->|No| N[Sin reembolso: sin pago o fuera del umbral]
  RE & N --> TX[Guardar CANCELADA + CERRADA + motivo e historial]
  TX --> L[Liberar cupo y desasignar habitación]
  L --> F((Fin · sin factura de check-out ni correo de cancelación))
```

## Reglas y límites

- 48 horas se cuentan antes de las 15:00 del día de llegada.
- Si Stripe rechaza el reembolso, la reserva no se cancela. No se envía correo de cancelación.
- No-show no es un estado: No se presentó es un motivo de cancelación manual sin reembolso.

## Referencias

- [10 RN-CAN](../10%20-%20Reglas%20de%20Negocio.md)
- [07 R7](../07%20-%20Estados.md)
- [12 UC-10](../12%20-%20Casos%20de%20Uso.md)

**Historias vinculadas:** `HU-REC-05`.

[Índice de diagramas](README.md) · [Cobertura de historias](COBERTURA.md) · [Anterior](15-secuencia-cuenta-cargos-y-saldo.md) · [Siguiente](17-actividad-decisiones-del-check-out.md)
