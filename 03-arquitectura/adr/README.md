# Registro de Decisiones de Arquitectura (ADR)

Este directorio almacenará los Registros de Decisiones de Arquitectura (*Architecture Decision Records* - ADR) oficiales del sistema **Villa Serena**.

> **Nota de proceso:**  
> El inventario y auditoría detallada de las decisiones de arquitectura (AD-01 a AD-19) contra el código real existente en los repositorios de `api`, `web`, `infra` y `movil` se realizará al finalizar la reorganización documental para garantizar que cada registro refleje con precisión la implementación vigente.

---

## Decisiones Principales Documentadas

| Código | Decisión Clave | Módulo / Componente |
|---|---|---|
| **AD-01** | Stack Backend: Java 21 + Spring Boot 4.1 | `villa-serena-api` |
| **AD-02** | Motor Relacional: PostgreSQL 17 con extensión `btree_gist` y restricción `EXCLUDE` temporal | Base de datos |
| **AD-03** | Frontend Web: Next.js 15 con patrón BFF (*Backend for Frontend*) | `villa-serena-web` |
| **AD-04** | Aplicación Móvil: React Native con Expo SDK 54 | `villa-serena-movil` |
| **AD-05** | Pasarela de Pagos: Stripe Checkout y confirmación por webhooks criptográficos | Pagos |
| **AD-06** | Comunicación Bidireccional: WebSockets sobre STOMP con tickets efímeros | Tiempo Real |
| **AD-07** | Almacenamiento de Objetos: Compatible con S3 (MinIO en local / Cloudflare R2 en producción) | Archivos |
