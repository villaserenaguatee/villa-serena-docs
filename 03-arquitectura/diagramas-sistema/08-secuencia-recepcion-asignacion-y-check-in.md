# 08 — Secuencia: Recepción, asignación y check-in

> Reconciliación 22/10/2026: [flujos y decisiones actuales](../../02-producto/reconciliacion-frontend-20261022.md). El nombre histórico del archivo se conserva. El portal web complementa Android; el retorno no confirma pagos y subir documentos no realiza check-in.

**Vista:** Secuencia · **Alcance del plan:** Hito.

Crear desde Recepción confirma sin cobrar por adelantado; asignar no es hacer check-in.

```mermaid
sequenceDiagram
  actor R as Recepción
  participant B as Panel / BFF
  participant S as API
  participant D as PostgreSQL
  participant O as Outbox / tiempo real
  opt Nueva reserva de Recepción
    R->>B: Principal con datos MVP y obligatoriedad del contrato de Recepción, más disponibilidad
    B->>S: Crear reserva con tarifa del servidor
    S->>D: Revalidar cupo, CONFIRMADA + cuenta + cargo alojamiento
    S->>O: Encolar confirmación, pago pendiente hasta check-out
    S-->>B: Código y detalle
  end
  R->>B: Buscar reserva o abrir Gantt
  B->>S: GET filtros o calendario
  S-->>B: Reservas y fila Por asignar
  R->>B: Asignar o cambiar habitación
  B->>S: Validar antes de check-in
  S->>D: Mismo tipo, activa, sin traslape, no fuera de servicio
  S->>D: Guardar asignación y responsable
  opt Huéspedes adicionales
    R->>B: Registrar datos MVP y DPI; nacionalidad opcional
    B->>S: Validar CONFIRMADA o EN_ESTADIA y límite del grupo
    S->>D: Guardar adicionales sin acceso a la app
  end
  R->>B: Confirmar check-in
  B->>S: Check-in de reserva CONFIRMADA
  S->>D: Validar fecha y habitación LIBRE + LIMPIA
  alt Condiciones incompletas
    S-->>B: Rechazar y mostrar motivo
  else Listo
    S->>D: EN_ESTADIA + OCUPADA + historial en una transacción
    S-->>O: Evento habitación después del commit
    S-->>B: Estadía abierta
  end
  Note over R,S: Referencia 15:00, puede entrar antes si está lista y en fecha válida
```

## Reglas y límites

- Principal y adicionales no pueden superar la cantidad de huéspedes reservada.
- La búsqueda admite nombre, documento, código, fechas y estado; Llegan hoy y Salen hoy son filtros.
- Gantt no arrastra ni modifica reservas y se actualiza al abrir o volver a la pantalla.

## Referencias

- [10 RN-RES-011,013,014,019,020,023,024](../../02-producto/reglas-de-negocio.md#3-reservas--rn-res)
- [12 UC-02,03,14](../../02-producto/casos-de-uso.md#uc-03--realizar-check-in)

**Historias vinculadas:** `HU-REC-01`, `HU-REC-02`, `HU-REC-04`, `HU-REC-06`, `HU-REC-07`, `HU-REC-08`, `HU-REC-12`.

[Índice de diagramas](README.md) · [Cobertura de historias](COBERTURA.md) · [Anterior](07-secuencia-reserva-de-canal-simulado.md) · [Siguiente](09-secuencia-sesion-del-personal-y-bff.md)
