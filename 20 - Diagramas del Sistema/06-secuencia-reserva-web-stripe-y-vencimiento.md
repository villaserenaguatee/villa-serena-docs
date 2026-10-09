# 06 — Secuencia: reserva web, Stripe y vencimiento

**Vista:** Secuencia · **Alcance del plan:** Hito.

Pagar y volver al sitio no equivale a confirmar: decide el webhook o la conciliación del API.

```mermaid
sequenceDiagram
  actor C as Cliente
  participant B as Web / BFF
  participant S as API reservas y pagos
  participant D as PostgreSQL
  participant X as Stripe
  participant J as Trabajo programado
  participant O as Outbox
  C->>B: Datos del principal, fechas y tipo
  B->>S: Crear reserva
  S->>D: Revalidar cupo, principal por correo, precio fijo
  S->>D: Reserva PENDIENTE_PAGO + cuenta ABIERTA + alojamiento
  S-->>B: Código de reserva
  B->>S: Iniciar pago del 100 por ciento
  S->>X: Crear o reutilizar una sesión de Checkout
  S->>D: Pago PENDIENTE asociado a la sesión
  S-->>B: URL de Stripe
  C->>X: Introducir tarjeta de prueba
  X-->>B: Retorno al sitio
  B->>S: Consultar estado, no darlo por pagado por el retorno
  alt Stripe confirma pago
    X->>S: Webhook firmado, evento pagado
    S->>D: Idempotencia, pago APROBADO, reserva CONFIRMADA
    S->>O: Encolar correo dentro de la transacción
    S-->>B: Estado confirmado
  else Pasan 30 minutos sin confirmación
    J->>S: Revisar reserva pendiente
    S->>X: Consultar sesión antes de cancelar
    alt Ya estaba pagada
      S->>D: Confirmar reserva y pago una sola vez
      S->>O: Encolar confirmación
    else No está pagada
      S->>D: CANCELADA, pago FALLIDO, cuenta CERRADA, liberar cupo
    end
  end
  Note over C,X: Villa Serena nunca recibe ni guarda los datos de tarjeta
```

## Reglas y límites

- Un intento rechazado deja el pago PENDIENTE; se reutiliza la misma sesión de la reserva.
- Antes de cancelar a los 30 minutos se consulta Stripe para no cancelar algo ya pagado.

## Referencias

- [07 R1,R4,R5,P1–P3](../07%20-%20Estados.md)
- [10 RN-PAG-001–006](../10%20-%20Reglas%20de%20Negocio.md)
- [12 UC-02,05,15](../12%20-%20Casos%20de%20Uso.md)

**Historias vinculadas:** `HU-HUE-05`, `HU-HUE-06`, `HU-HUE-07`.

[Índice de diagramas](README.md) · [Cobertura de historias](COBERTURA.md) · [Anterior](05-actividad-disponibilidad-y-tarifa.md) · [Siguiente](07-secuencia-reserva-de-canal-simulado.md)
