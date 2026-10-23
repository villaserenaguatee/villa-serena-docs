# 15 — Secuencia: cuenta, cargos y saldo

> Reconciliación 22/10/2026: [flujos y decisiones actuales](../../02-producto/reconciliacion-frontend-20261022.md). El huésped consulta su cuenta desde el portal web (`/portal`) o desde la app Android.

**Vista:** Secuencia · **Alcance del plan:** Hito.

Una cuenta por reserva reúne alojamiento, servicios, room service y pagos.

```mermaid
sequenceDiagram
  actor R as Recepción
  participant B as Panel / BFF
  participant S as API cuenta
  participant D as PostgreSQL
  participant A as Portal web / App huésped
  Note over S,D: Al crear reserva: cuenta ABIERTA y cargo de alojamiento
  R->>B: Consultar cuenta
  B->>S: GET cuenta de reserva
  S->>D: Cargos, pagos y saldo
  S-->>B: Detalle completo de Recepción
  opt Servicio adicional
    R->>B: Concepto, cantidad y precio unitario
    B->>S: Agregar cargo
    S->>D: Validar EN_ESTADIA + cuenta ABIERTA
    S->>D: Cargo VIGENTE, total calculado y responsable
  end
  opt Error en cargo adicional
    R->>B: Anular con motivo
    B->>S: Anular adicional en cuenta ABIERTA
    S->>D: ANULADO, sin borrarlo, conservar historia
  end
  Note over S,D: Pedido ENTREGADO agrega un solo cargo automático
  A->>S: Abrir o recargar mi cuenta
  S->>D: Verificar dueño y calcular saldo
  S-->>A: Cargos, anulaciones, pagos y saldo, solo lectura
  Note over A,S: No hay WebSocket de cuenta, sin abonos ni pagos parciales
```

## Reglas y límites

- Saldo = cargos VIGENTE − pagos APROBADO; anulados, pendientes, fallidos y reembolsados no suman.
- Solo adicionales se anulan, con motivo; nunca se borran cargos ni se anula alojamiento.
- El huésped puede consultar la cuenta en cualquier estado desde `/portal` o la app, con actualización al abrir o recargar.

## Referencias

- [07 §5](../maquinas-de-estados.md)
- [10 RN-PAG-009–021](../../02-producto/reglas-de-negocio.md)
- [12 UC-04](../../02-producto/casos-de-uso.md)

**Historias vinculadas:** `HU-REC-13`, `HU-HUE-15`.

[Índice de diagramas](README.md) · [Cobertura de historias](COBERTURA.md) · [Anterior](14-actividad-incidencia-y-recuperacion-de-habitacion.md) · [Siguiente](16-actividad-cancelar-reserva-y-reembolsar.md)
