# 12 — Secuencia: limpieza o artículos solicitados

**Vista:** Secuencia · **Alcance del plan:** Hito.

Las solicitudes van directamente a Limpieza; su seguimiento en la app se recarga por consulta.

```mermaid
sequenceDiagram
  actor H as Huésped
  participant A as App
  participant S as API solicitudes
  participant D as PostgreSQL
  participant W as Panel Limpieza / BFF
  actor L as Limpieza o AMBAS
  participant O as Outbox / Expo Push
  H->>A: Solicitar limpieza o artículos
  A->>S: Solicitud de reserva propia EN_ESTADIA
  S->>D: Validar limpieza única o cantidades máximas
  S->>D: Crear PENDIENTE e historial
  S-->>W: WS nueva solicitud después del commit
  W-->>L: Lista con habitación y piso sin datos personales
  alt Huésped cancela antes de que la tomen
    A->>S: Cancelar solo PENDIENTE
    S->>D: CANCELADA
  else Empleado toma y atiende
    L->>W: Tomar solicitud
    W->>S: PENDIENTE → EN_PROCESO
    S->>D: Bloquear y registrar empleado a cargo
    L->>W: Confirmar atención
    W->>S: EN_PROCESO → ATENDIDA por el mismo empleado
    S->>D: Estado e historial
    S->>O: Encolar aviso en la transacción
    O-->>H: Tu solicitud fue atendida
  end
  A->>S: Abrir o recargar mis solicitudes
  S-->>A: Estado actual, incluidas atendidas y canceladas
  Note over A,S: No existe un evento WS para el cambio de estado de solicitud
```

## Reglas y límites

- Una sola solicitud de limpieza PENDIENTE o EN_PROCESO por habitación.
- Artículos respetan su máximo de catálogo. No consumen inventario ni crean cargos documentados.
- Solicitar o tomar limpieza no cambia la condición de la habitación.

## Referencias

- [07 Q1–Q5](../07%20-%20Estados.md)
- [10 RN-LIM-003–015](../10%20-%20Reglas%20de%20Negocio.md)
- [12 UC-13](../12%20-%20Casos%20de%20Uso.md)

**Historias vinculadas:** `HU-HUE-12`, `HU-HUE-13`, `HU-HUE-14`, `HU-MYL-04`, `HU-MYL-05`.

[Índice de diagramas](README.md) · [Cobertura de historias](COBERTURA.md) · [Anterior](11-secuencia-pedido-entrega-cargo-y-push.md) · [Siguiente](13-actividad-limpieza-de-habitaciones-libres.md)
