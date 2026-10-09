# 17 — Actividad: decisiones del check-out

**Vista:** Actividad · **Alcance del plan:** Hito.

Una única salida funcional, con dos caminos de pago y reglas de bloqueo explícitas.

```mermaid
flowchart TB
  I[Solicitar check-out] --> E{Reserva EN_ESTADIA y sin pedido EN_CAMINO?}
  E -->|No| B[Rechazar o esperar entrega]
  E -->|Sí| O{Origen}
  O -->|App| T{Día de salida entre 00:00 y 12:00?}
  T -->|No| REC[Indicar hacerlo en Recepción]
  T -->|Sí| Q{Pedidos NUEVO / EN_PREPARACION?}
  Q -->|Sí| A[Aceptar cancelarlos sin cargo]
  Q -->|No| S{Saldo}
  A --> S
  S -->|Mayor que cero| ST[Pagar saldo completo por Stripe]
  ST --> W[Esperar webhook de pago aprobado y releer saldo]
  W --> Z{Saldo exactamente cero?}
  S -->|Cero| Z
  S -->|Negativo| NEG[Revisar cuenta; bloquear salida]
  O -->|Recepción| R[Consultar cuenta y preparar pago único si saldo positivo]
  REC --> R
  R --> RS{Saldo negativo?}
  RS -->|Sí| NEG
  RS -->|No| N[NIT válido o CF y nombre del comprador]
  Z -->|Sí| N
  Z -->|No| S
  N --> TX[Transacción de cierre: pago de Recepción si aplica + factura + estados + efectos]
  TX --> OK{Operación completa?}
  OK -->|No| RB[Rollback del cierre; en Recepción también del registro de pago]
  RB --> RET[Reintentar; conservar pagos ya aprobados antes del cierre]
  OK -->|Sí| DONE[FINALIZADA + CERRADA + factura EMITIDA]
  DONE --> ROOM[LIBRE + SUCIA o FUERA_DE_SERVICIO si daño bloqueante]
  DONE --> CAN[Cancelar pedidos nuevos o en preparación y solicitudes abiertas]
  DONE --> PUSH[Borrar push y bloquear nuevos pedidos / solicitudes]
  DONE --> INV[Factura por correo; PDF en app e impresión en Recepción]
```

## Reglas y límites

- Salida tarde se resuelve en Recepción; no hay proceso ni recargo automático.
- Saldo negativo también bloquea: el requisito es exactamente cero.
- Si falla el cierre, el pago Stripe previamente aprobado se conserva para reintentar sin cobrar otra vez.

## Referencias

- [10 RN-RES-015,021,022](../10%20-%20Reglas%20de%20Negocio.md)
- [10 RN-APP-008](../10%20-%20Reglas%20de%20Negocio.md)
- [10 RN-RS-011](../10%20-%20Reglas%20de%20Negocio.md)
- [12 UC-04](../12%20-%20Casos%20de%20Uso.md)

**Historias vinculadas:** `HU-HUE-16`, `HU-REC-14`.

[Índice de diagramas](README.md) · [Cobertura de historias](COBERTURA.md) · [Anterior](16-actividad-cancelar-reserva-y-reembolsar.md) · [Siguiente](18-secuencia-cierre-atomico-factura-y-archivos.md)
