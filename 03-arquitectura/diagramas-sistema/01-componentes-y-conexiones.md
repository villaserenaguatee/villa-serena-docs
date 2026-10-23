# 01 — Componentes y conexiones

**Vista:** Componentes · **Alcance del plan:** Hito.

Quién llama a quién, dónde se deciden las reglas y cuáles servicios son externos.

```mermaid
flowchart LR
  subgraph personas[Personas y dispositivos]
    C[Cliente · navegador]
    P[Personal · navegador]
    H[Huésped · Android]
  end
  subgraph web[Web · Next.js 15 + React]
    W[Web pública y panel privado]
    B[BFF · sesión del personal]
    SIM[Canal simulado · ADMIN]
    W --> B
    SIM --> B
  end
  subgraph spring[API único · Spring Boot 4.1 / Java 21]
    S[REST + Spring Security]
    WS[WebSocket STOMP]
    R[Reservas / tarifas / cuentas / pagos]
    E[Estadía / habitaciones / check-in y out]
    O[Room Service / limpieza / solicitudes / incidencias]
    A[Autenticación / huésped / catálogos / facturación]
    N[Outbox + trabajos programados]
    S --> R & E & O & A
    R & E & O & A --> N
    O & E --> WS
  end
  subgraph docker[Servicios previstos en Docker local]
    DB[(PostgreSQL 17)]
    M[Mailpit · SMTP de prueba]
    PR[Prometheus]
    G[Grafana]
    PR --> G
  end
  C & P --> W
  B -->|HTTP · JWT solo en servidor| S
  P -.->|WS directo · ticket 60 s| WS
  H -->|HTTP + JWT · SecureStore| S
  H -.->|WS directo · JWT| WS
  S --> DB
  S --> F[R2 remoto en dev · S3 en prod]
  N --> DB
  N --> M
  N --> X[Expo Push → FCM → teléfono]
  S -->|Checkout / reembolso| ST[Stripe · modo prueba]
  ST --> CLI[Stripe CLI · webhook local]
  CLI -->|Firma Stripe| S
  CH[Canal externo simulado] -->|Canal + clave| S
  PR -->|Lee Actuator / Micrometer| S
```

Almacenamiento actualizado por [ADR-007](../adr/ADR-007-almacenamiento-r2-s3.md); los demás componentes del diagrama conservan su alcance de plan.

## Reglas y límites

- Los recuadros dentro de Spring son módulos de un solo API, no microservicios.
- El Docker local está previsto por la documentación; este atlas no afirma que esté disponible.
- El contrato está en api/openapi.yaml; web y app generan sus tipos por separado.

## Referencias

- [14 §§2–6](../arquitectura-sistema.md#2-decisiones-de-arquitectura)
- [09 §§5–7](../../02-producto/matriz-de-permisos.md#5-actores-que-no-son-usuarios)
- [19 §2](../../04-guias-y-referencia/integracion-canales.md#2-qué-hace-hoy-el-sistema)

[Índice de diagramas](README.md) · [Cobertura de historias](COBERTURA.md) · [Siguiente](02-participantes-y-responsabilidades.md)
