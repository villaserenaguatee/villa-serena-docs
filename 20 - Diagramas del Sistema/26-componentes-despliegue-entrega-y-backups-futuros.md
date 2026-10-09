# 26 — Componentes: despliegue, entrega y backups futuros

**Vista:** Componentes · **Alcance del plan:** Después.

El diseño posterior al hito local; no es una descripción de infraestructura ya instalada.

```mermaid
flowchart LR
  U[Navegador y app APK] --> CF[Cloudflare · DNS / TLS / WAF]
  CF --> T[Cloudflare Tunnel]
  subgraph VPS[VPS · Docker Compose · posterior al hito]
    CD[cloudflared]
    W[Next.js / BFF]
    S[Spring API]
    D[(PostgreSQL)]
    MON[Prometheus + Grafana]
    CD --> W & S
    W --> S
    S --> D
    MON -->|Actuator| S
  end
  T --> CD
  S --> R2[Cloudflare R2 · fotos / PDF]
  S --> MAIL[Resend · correo]
  S --> EXT[Stripe + Expo / FCM]
  D --> BK[pg_dump diario]
  BK --> STORE[R2 · backups · retención 7 días]
  STORE --> REST[Restauración probada]
  subgraph ENTREGA[Entrega y repositorios]
    DOC[Docs · decisiones y referencias]
    INF[Infra · configuración]
    API[API · OpenAPI canónico]
    WEB[Web · copia contrato y tipos]
    APP[Móvil · copia contrato y tipos]
    API --> WEB & APP
    BR[Rama de tarea] --> PR[PR a develop]
    PR --> INT[Validar integración]
    INT --> MAIN[PR develop a main]
    MAIN --> CI[GitHub Actions · pruebas / build]
    CI --> REG[GHCR · imágenes]
    CI --> EAS[EAS · APK Android]
    DOC & INF & API & WEB & APP -.-> BR
  end
  REG --> VPS
  EAS --> U
```

## Reglas y límites

- Cinco repositorios: docs, infra, api, web y movil. No hay monorepo ni paquete shared.
- Git: rama de tarea → PR a develop → verificar integración → PR a main para entrega.
- Backups: pg_dump diario a R2, siete días de retención y restauración probada.
- Loki y alerta por caída/consumo son Nivel 2; Grafana/Prometheus locales siguen en el hito.

## Referencias

- [14 §§3.2,9,10,11](../14%20-%20Tecnologias%20y%20Arquitectura.md)
- [01 §6](../01%20-%20Alcance%20del%20Proyecto.md)
- [CONTRIBUTING §§2,5](../CONTRIBUTING.md)

[Índice de diagramas](README.md) · [Cobertura de historias](COBERTURA.md) · [Anterior](25-actividad-las-cinco-historias-opcionales.md)
