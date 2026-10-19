# 11 — Secuencia: pedido, entrega, cargo y push

**Vista:** Secuencia · **Alcance del plan:** Hito.

El cargo aparece al entregar, no al pedir. Estado, cargo y aviso deben quedar coherentes.

```mermaid
sequenceDiagram
  actor H as Huésped
  participant A as App
  participant S as API Room Service / cuenta
  participant D as PostgreSQL
  participant W as Panel Room Service / BFF
  actor R as Room Service
  participant O as Outbox / Expo Push
  H->>A: Ver menú y enviar ítems, cantidades y notas
  A->>S: Crear pedido propio en EN_ESTADIA
  S->>D: Revalidar ítems, NUEVO y precios congelados
  S-->>W: WS nuevo pedido después del commit
  W-->>R: Cola por antigüedad, habitación, piso y nombre
  Note over W,R: Sin correo, teléfono, documento ni pagos
  R->>W: Tomar siguiente paso
  W->>S: NUEVO → EN_PREPARACION
  S->>D: Guardar estado e historial
  S-->>A: WS cambio de su pedido
  R->>W: Enviar a habitación
  W->>S: EN_PREPARACION → EN_CAMINO
  S->>D: Guardar, ahora bloquea check-out
  S-->>A: WS cambio de su pedido
  alt Entregado
    R->>W: Confirmar entrega
    W->>S: EN_CAMINO → ENTREGADO
    S->>D: Estado + un único cargo a cuenta ABIERTA + historial
    S->>O: Encolar push sin datos personales ni montos
    S-->>A: WS entregado, consultar cuenta para ver cargo
    O-->>H: Tu pedido fue entregado
  else Room Service cancela antes de entregar
    R->>W: Motivo obligatorio
    W->>S: Cancelar pedido no final
    S->>D: CANCELADO + motivo, sin cargo
    S-->>A: WS cancelado y motivo
  end
```

## Reglas y límites

- Precios congelados al crear; si un ítem se agotó, se rechaza el pedido completo.
- El huésped no cancela ni modifica el pedido. Room Service cancela estados no finales con motivo.
- ROOM_SERVICE puede marcar agotado; solo ADMIN reactiva. No hay horario ni descuento de inventario.

## Referencias

- [07 S1–S6](../07%20-%20Estados.md)
- [10 RN-RS](../10%20-%20Reglas%20de%20Negocio.md)
- [09 VIS-02](../09%20-%20Matriz%20de%20Permisos.md)
- [12 UC-06](../12%20-%20Casos%20de%20Uso.md)

**Historias vinculadas:** `HU-HUE-10`, `HU-HUE-11`, `HU-RS-01`, `HU-RS-02`, `HU-RS-03`, `HU-RS-04`, `HU-RS-05`, `HU-RS-06`, `HU-RS-07`.

[Índice de diagramas](README.md) · [Cobertura de historias](COBERTURA.md) · [Anterior](10-secuencia-otp-mis-reservas-y-sesion-de-la-app.md) · [Siguiente](12-secuencia-limpieza-o-articulos-solicitados.md)
