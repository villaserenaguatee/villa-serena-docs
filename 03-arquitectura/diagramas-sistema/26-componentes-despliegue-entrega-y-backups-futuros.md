# 26 — Componentes: despliegue en Vercel y AWS, entrega y sincronización del contrato

**Vista:** Componentes · **Alcance del plan:** Despliegue compartido y producción.

Topología implementada en `villa-serena-infra` (`aws/gateway`, `aws/compute`, `aws/storage` y `ansible/`) junto con el flujo de entrega y sincronización de `api-contract.json`.

```mermaid
flowchart LR
  U[Navegador · Cliente y Personal] --> VERCEL["Vercel · villaserenaguate.org (Next.js 15 + BFF)"]
  APK[App Android · Huésped] --> APIGW["AWS HTTP API Gateway · api.villaserenaguate.org"]
  VERCEL -->|HTTPS desde BFF| APIGW
  APIGW --> VPCL["VPC Link + Cloud Map (api.villaserena.internal:8080)"]
  subgraph AWS_EC2["AWS EC2 t4g.small · Debian 13 ARM64 · Ansible"]
    S["systemd: villa-serena-api (:8080)"]
    D[(PostgreSQL 17 local :5432)]
    S --> D
  end
  VPCL --> S
  subgraph AWS_STORAGE["Almacenamiento y CDN (AWS)"]
    S3[(S3 privado · fotos de tipos)]
    CF["CloudFront + OAC (URLs públicas de lectura)"]
    CF --> S3
  end
  S -->|Presigned PUT / HeadObject / DeleteObject| S3
  U -->|GET imagen pública| CF
  OPS[Equipo / CI-CD] -->|Diagnóstico y despliegue sin SSH público| SSM[AWS Systems Manager Session Manager]
  SSM --> AWS_EC2
  S --> REC[Recurrente Sandbox + webhook Svix]
  S --> EXT[SMTP + Expo / FCM]
  subgraph ENTREGA[Entrega y sincronización entre los 5 repositorios]
    DOC["villa-serena-docs · openapi.yaml canónico"]
    INF["villa-serena-infra · Docker + Terraform + Ansible"]
    API["villa-serena-api · api-contract.json"]
    WEB["villa-serena-web · api-contract.json"]
    APP["villa-serena-movil · api-contract.json"]
    DOC -->|Fija commit SHA| API & WEB & APP
    BR[Rama de tarea] --> PR[PR a develop / main en docs]
    PR --> CI[GitHub Actions · check / test / build]
  end
```

## Reglas y límites

- Cinco repositorios: `docs`, `infra`, `api`, `web` y `movil`. El contrato canónico vive únicamente en [`villa-serena-docs/openapi.yaml`](../../openapi.yaml) y cada consumidor fija su revisión en `api-contract.json`.
- **Web pública y privada:** desplegada en Vercel (`https://www.villaserenaguate.org`). El navegador habla con el BFF de Next.js y carga imágenes públicas servidas por CloudFront.
- **API e infraestructura AWS:** `api.villaserenaguate.org` entra por AWS HTTP API Gateway + VPC Link + Cloud Map hacia `villa-serena-api.service` (`127.0.0.1:8080`) y PostgreSQL 17 local en EC2 ARM64 administrada por AWS Systems Manager (SSM) sin SSH público expuesto.
- **Imágenes de catálogo:** subida directa por URL prefirmada (`PUT`) a S3 privado y lectura pública vía CloudFront con Origin Access Control (OAC).

## Referencias

- [Arquitectura del sistema §§2, 9 y 10](../arquitectura-sistema.md#2-decisiones-de-arquitectura)
- [Despliegue, modelo de datos y diagnóstico operativo](../../04-guias-y-referencia/despliegue-y-modelo-datos.md)
- [Contrato API y sincronización](../contrato-api.md)
- [Marco de trabajo Scrumban](../../01-metodologia/scrumban.md)
- [CONTRIBUTING §§2,5](../../CONTRIBUTING.md#2-crear-una-rama)

[Índice de diagramas](README.md) · [Cobertura de historias](COBERTURA.md) · [Anterior](25-actividad-las-cinco-historias-opcionales.md)
