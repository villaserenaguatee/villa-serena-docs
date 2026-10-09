# 03 — Actividad general: de la reserva a la siguiente llegada

**Vista:** Actividad · **Alcance del plan:** Hito.

La columna vertebral del hotel, con tres entradas y un cierre común.

```mermaid
flowchart TB
  IN((Inicio)) --> OR{Origen de reserva}
  OR -->|Web pública| W[Buscar cupo / calcular tarifa / registrar principal]
  OR -->|Recepción| R[Consultar cupo / registrar principal / crear]
  OR -->|Canal simulado| C[Autenticar canal / validar / evitar duplicados]
  W --> PP[Reserva PENDIENTE_PAGO + cuenta + alojamiento]
  PP --> PAY{Stripe pagado antes de vencer?}
  PAY -->|Sí · webhook o conciliación| CO[CONFIRMADA + correo]
  PAY -->|No · 30 min y comprobar Stripe| CA[CANCELADA + cuenta cerrada + liberar cupo]
  R & C --> CO
  CA --> FIN((Fin de reserva cancelada))
  CO --> L[Recepción busca reserva y asigna habitación]
  L --> Q{Confirmada / fecha válida / libre y limpia?}
  Q -->|No| WAIT[Resolver habitación o esperar fecha]
  WAIT --> Q
  Q -->|Sí| CI[Check-in → EN_ESTADIA + habitación OCUPADA]
  CO -.-> OTP[Huésped entra por OTP y ve sus reservas]
  OTP -.-> ES
  CI --> ES[Estadía · app + personal operando]
  ES --> ACTION{Necesidad durante estadía}
  ACTION -->|Pedido| RS[Room Service prepara y entrega → cargo + push]
  ACTION -->|Limpieza o artículos| SO[Limpieza toma y atiende solicitud → push]
  ACTION -->|Daño| MA[Reportar / técnico toma / resuelve]
  ACTION -->|Consultar o agregar cargos| CU[Cuenta y saldo]
  RS & SO & MA & CU --> ES
  ACTION -->|Salir| OUT{App en ventana o Recepción}
  OUT --> CHK[Sin pedido EN_CAMINO / NIT o CF / saldo cero tras pago]
  CHK --> TX[Check-out atómico + factura + cierre + cancelar pendientes + borrar push]
  TX --> HD{Incidencia que impide uso?}
  HD -->|No| SU[Habitación LIBRE + SUCIA]
  HD -->|Sí| FS[LIBRE + FUERA_DE_SERVICIO]
  FS --> FIX[Resolver última incidencia bloqueante]
  FIX --> SU
  SU --> CL[Limpieza inicia y termina → LIMPIA]
  CL --> NEXT((Disponible para próxima llegada))
```

## Reglas y límites

- Los servicios de estadía son opcionales y pueden repetirse; no son pasos obligatorios para salir.
- El acceso OTP puede ocurrir antes del check-in; solo los pedidos y solicitudes exigen EN_ESTADIA.
- Una habitación sucia puede asignarse antes de llegar; para check-in debe estar libre y limpia.

## Referencias

- [01 §4](../01%20-%20Alcance%20del%20Proyecto.md)
- [07 §§3,11](../07%20-%20Estados.md)
- [12 UC-02,03,04](../12%20-%20Casos%20de%20Uso.md)
- [13 objetivos 0–4](../13%20-%20Plan%20de%20Trabajo.md)

[Índice de diagramas](README.md) · [Cobertura de historias](COBERTURA.md) · [Anterior](02-participantes-y-responsabilidades.md) · [Siguiente](04-secuencia-general-del-viaje-del-huesped.md)
