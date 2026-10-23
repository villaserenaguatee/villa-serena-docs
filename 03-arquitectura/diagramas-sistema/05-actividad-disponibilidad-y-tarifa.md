# 05 — Actividad: disponibilidad y tarifa

**Vista:** Actividad · **Alcance del plan:** Hito.

El mismo cálculo de cupo por tipo sirve a web (`/api/v1/publico/disponibilidad`), Recepción y canal; las ofertas comerciales (`/api/v1/publico/ofertas/disponibilidad`) exigen además al menos una habitación elegible libre en `catalog_offer_rooms` y cotizan con su precio fijo por noche (`catalog_offers.base_price`). El canal aporta su propio monto.

```mermaid
flowchart TB
  I[Hotel / catálogo activo / buscar fechas y huéspedes] --> V{Fechas y capacidad válidas?}
  V -->|No · 1 a 30 noches / entrada hasta 365 días| E[Mostrar motivo y corregir]
  E --> I
  V -->|Sí| T[Por tipo ACTIVO o oferta elegible con capacidad suficiente]
  T --> H[Contar habitaciones activas que no estén FUERA_DE_SERVICIO]
  H --> R[Restar por noche reservas PENDIENTE_PAGO / CONFIRMADA / EN_ESTADIA]
  R --> C{Cupo del tipo >= 1 en TODAS las noches y, si es oferta, habitación elegible libre?}
  C -->|No| N[No ofrecer esa opción]
  C -->|Sí| O{Vía de cotización?}
  O -->|Canal| M[Usar monto del canal como una línea]
  O -->|Por tipo: Web o Recepción| P["room_types.base_price × ajuste temporada × ajuste fin de semana"]
  O -->|Por oferta comercial| OF["catalog_offers.base_price fijo por noche (temporada: null, finDeSemana: false)"]
  P & OF --> D[Redondear cada noche a 2 decimales y sumar]
  D --> B[Mostrar desglose y total]
  M & B --> RE[Antes de guardar: revalidar cupo en servidor]
  RE --> OK{Sigue disponible?}
  OK -->|No| NO[409 · elegir otra opción]
  OK -->|Sí| G[Crear reserva y congelar precio]
```

## Reglas y límites

- Disponibilidad se comprueba por cada noche, aunque la reserva aún no tenga habitación asignada; en ofertas comerciales se valida además una habitación elegible libre en `catalog_offer_rooms` y se informa `inventarioCompartido`.
- GTQ, impuestos incluidos y precio fijo al crear la reserva; viernes y sábado son fin de semana en la cotización por tipo.

## Referencias

- [10 RN-RES-001,002,005–008](../../02-producto/reglas-de-negocio.md#3-reservas--rn-res)
- [10 RN-TAR-001–010](../../02-producto/reglas-de-negocio.md#5-tarifas--rn-tar)
- [12 UC-01](../../02-producto/casos-de-uso.md#uc-01--buscar-disponibilidad)
- [Manual de habitaciones, ofertas y tipos](../../04-guias-y-referencia/admin-habitaciones-ofertas-tipos.md)

**Historias vinculadas:** `HU-HUE-01`, `HU-HUE-02`, `HU-HUE-03`, `HU-HUE-04`, `HU-REC-03`.

[Índice de diagramas](README.md) · [Cobertura de historias](COBERTURA.md) · [Anterior](04-secuencia-general-del-viaje-del-huesped.md) · [Siguiente](06-secuencia-reserva-web-stripe-y-vencimiento.md)
