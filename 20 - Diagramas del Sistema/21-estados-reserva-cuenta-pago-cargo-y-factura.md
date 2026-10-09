# 21 — Estados: reserva, cuenta, pago, cargo y factura

**Vista:** Estados · **Alcance del plan:** Hito.

Cinco ciclos distintos que se relacionan sin confundirse.

```mermaid
flowchart LR
  subgraph RES[Reserva]
    WEB[Web] --> PP[PENDIENTE_PAGO]
    RC[Recepción o canal] --> CO[CONFIRMADA]
    PP -->|Pago aprobado| CO
    PP -->|30 min sin pago tras comprobar Stripe| CA[CANCELADA]
    CO -->|Recepción cancela directo| CA
    CO -->|Check-in| ES[EN_ESTADIA]
    ES -->|Check-out| FI[FINALIZADA]
  end
  subgraph CU[Cuenta]
    AB[ABIERTA al crear reserva] -->|Cancelar o finalizar| CE[CERRADA]
  end
  subgraph PA[Pago]
    PE[PENDIENTE] -->|Webhook pagado| AP[APROBADO]
    PE -->|Sesión vencida sin pago| FA[FALLIDO]
    AP -->|Cancelación directa elegible| RE[REEMBOLSADO]
    PC[Canal o pago de Recepción] --> AP
  end
  subgraph CG[Cargo]
    VI[VIGENTE] -->|Adicional con motivo y cuenta abierta| AN[ANULADO]
  end
  subgraph FC[Factura]
    EM[EMITIDA · solo en check-out / única / inmutable]
  end
  WEB & RC -.-> AB
  FI -.-> EM
  CA & FI -.-> CE
```

## Reglas y límites

- Reserva cancelada cierra la cuenta tal como está; solo el check-out emite factura.
- PENDIENTE_PAGO, CONFIRMADA y EN_ESTADIA consumen cupo. CANCELADA y FINALIZADA son finales.
- Pago rechazado no es FALLIDO: el intento deja PENDIENTE hasta vencimiento de sesión.

## Referencias

- [07 §§3,5](../07%20-%20Estados.md)
- [10 RN-PAG,RN-CAN,RN-FAC](../10%20-%20Reglas%20de%20Negocio.md)

[Índice de diagramas](README.md) · [Cobertura de historias](COBERTURA.md) · [Anterior](20-secuencia-outbox-correos-y-notificaciones-push.md) · [Siguiente](22-estados-ocupacion-y-condicion-de-habitacion.md)
