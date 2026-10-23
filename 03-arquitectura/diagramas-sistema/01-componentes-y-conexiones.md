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
  subgraph web[Web · Next.js 15 + React · local o Vercel]
    W[Web pública y panel privado]
    B[BFF · sesión y proxys HTTP]
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
  subgraph servicios[Persistencia, correo, objetos y observabilidad]
    DB[(PostgreSQL 17)]
    M[SMTP · Mailpit local / proveedor SMTP]
    F[Objetos · MinIO / R2 / S3 + CloudFront]
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
  S --> F
  N --> DB
  N --> M
  N --> X[Expo Push → FCM → teléfono]
  S -->|Checkout / reembolso GTQ| REC[Recurrente · Sandbox]
  REC -->|Webhook firmado Svix| S
  CH[Canal externo simulado] -->|Canal + clave| S
  PR -->|Lee Actuator / Micrometer| S
```

## Reglas y límites

- Los recuadros dentro de Spring son módulos de un solo API, no microservicios.
- En local, PostgreSQL 17, Mailpit, MinIO, Prometheus y Grafana corren en Docker Compose; en despliegue compartido, la web corre en Vercel y el API detrás de AWS HTTP API Gateway + EC2 ARM64 + S3 + CloudFront.
- El contrato canónico vive en [`villa-serena-docs/openapi.yaml`](../../openapi.yaml) y cada consumidor fija su revisión en `api-contract.json` ([guía del contrato](../contrato-api.md)).

## Referencias

- [Arquitectura del sistema §§2–6](../arquitectura-sistema.md)
- [Despliegue y modelo de datos](../../04-guias-y-referencia/despliegue-y-modelo-datos.md)
- [Matriz de permisos §§5–7](../../02-producto/matriz-de-permisos.md)
- [Integración con canales §2](../../04-guias-y-referencia/integracion-canales.md)

[Índice de diagramas](README.md) · [Cobertura de historias](COBERTURA.md) · [Siguiente](02-participantes-y-responsabilidades.md)
