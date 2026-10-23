# 04 — Secuencia general del viaje del huésped

> Reconciliación 22/10/2026: [flujos y decisiones actuales](../../02-producto/reconciliacion-frontend-20261022.md). El nombre histórico del archivo se conserva. El portal web complementa Android; el retorno no confirma pagos y subir documentos no realiza check-in.

**Vista:** Secuencia · **Alcance del plan:** Hito.

Una vista temporal compacta de la experiencia completa y sus participantes.

```mermaid
sequenceDiagram
  actor C as Cliente / huésped
  participant W as Web + BFF
  participant S as API Spring
  participant X as Recurrente
  actor R as Recepción
  participant A as App Android
  actor O as Personal de operación
  participant N as Correo / Push
  C->>W: Buscar, elegir y reservar
  W->>S: Validar cupo y crear PENDIENTE_PAGO
  S-->>W: Código y enlace de Checkout
  C->>X: Pagar alojamiento completo
  X->>S: Webhook firmado de pago aprobado
  S->>S: Confirmar reserva y pago
  S-->>N: Encolar correo de confirmación
  R->>W: Buscar y asignar habitación
  W->>S: Check-in con habitación libre y limpia
  S->>S: EN_ESTADIA y OCUPADA
  C->>A: Correo y OTP
  A->>S: Verificar y recibir sesión del huésped
  opt Servicios durante estadía
    A->>S: Crear pedido o solicitud
    S-->>O: Aviso en su panel por WebSocket
    O->>W: Preparar / entregar o atender
    W->>S: Guardar estado y efectos
    S-->>A: Estado del pedido por WebSocket
    S-->>N: Push de entrega o atención
  end
  alt Salida por app
    C->>A: Pagar saldo si existe, indicar NIT/CF y confirmar
    opt Saldo mayor que cero
      A->>X: Checkout de saldo
      X->>S: Webhook confirma pago
    end
    A->>S: Solicitar check-out
  else Salida por Recepción
    R->>W: Cobrar saldo e indicar NIT/CF
    W->>S: Confirmar check-out
  end
  S->>S: Factura, FINALIZADA, cuenta CERRADA, habitación LIBRE
  S-->>N: Factura por correo
  S-->>A: Pantalla final y PDF
  S-->>W: Factura para imprimir
  O->>W: Limpiar habitación tras salida
  W->>S: SUCIA → EN_LIMPIEZA → LIMPIA
```

## Reglas y límites

- Los mensajes resumen casos de uso; no son una lista exhaustiva de endpoints.
- La operación del personal y del portal web del huésped pasa por el BFF. Esta secuencia representa Android para la estadía: solo ese cliente llama directamente al API y usa push Expo; no excluye el portal web.

## Referencias

- [01 §4](../../02-producto/alcance-y-decisiones.md#4-flujo-principal-del-sistema)
- [12 UC-02,03,04,06,11,13,20](../../02-producto/casos-de-uso.md#3-mapa-de-casos-de-uso)

[Índice de diagramas](README.md) · [Cobertura de historias](COBERTURA.md) · [Anterior](03-actividad-general-de-la-reserva-a-la-siguiente-llegada.md) · [Siguiente](05-actividad-disponibilidad-y-tarifa.md)
