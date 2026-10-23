# Villa Serena PMS — Wiki del Sistema

Bienvenido a la documentación oficial y base de conocimiento de **Villa Serena**, un sistema de gestión hotelera (*Property Management System* - PMS) diseñado para un hotel boutique ficticio.

> **Nota sobre el estado del proyecto:**  
> **GitHub es la única fuente de la verdad sobre el avance real del código** (tableros de proyecto, issues abiertas y pull requests en los repositorios de `api`, `web`, `infra` y `movil`).  
> Este repositorio contiene la **fuente de verdad del contrato API** en [`openapi.yaml`](openapi.yaml) y funciona como la **Wiki de Referencia Técnica y de Negocio**: aquí se documentan las decisiones arquitectónicas, el modelo de datos, los requisitos, las reglas de negocio y la evolución del producto.

---

## 1. Visión del Producto

Villa Serena busca resolver la administración integral de un hotel boutique mediante cuatro componentes desacoplados:

1. **Web Pública (Huéspedes):** Portal de reservas con verificación de disponibilidad en tiempo real y pasarela de pago (Recurrente en Sandbox, en GTQ).
2. **Web Privada (Personal del Hotel):** Panel operativo para Recepción, Room Service, Limpieza/Mantenimiento y Administración, implementado con arquitectura BFF (*Backend for Frontend*).
3. **App Móvil (Huéspedes en Estadía):** Aplicación Android (React Native + Expo) para conserjería digital: pedidos a la habitación, solicitudes de toallas/artículos, seguimiento en vivo y notificaciones push.
4. **Backend / API REST Central:** Núcleo de lógica empresarial en Spring Boot 4.1 con base de datos relacional PostgreSQL 17, comunicación en tiempo real vía WebSockets (STOMP) y colas transaccionales de eventos.

---

## 2. Índice de la Documentación (Mapa de la Wiki)

La documentación se organiza en cuatro áreas temáticas para facilitar su consulta y mantenimiento:

```
villa-serena-docs/
├── 01-metodologia/          # Marco ágil (Scrumban) y hoja de ruta incremental
├── 02-producto/             # Requisitos, historias de usuario, reglas de negocio y permisos
├── 03-arquitectura/         # Diseño técnico, base de datos, estados y decisiones (ADR)
└── 04-guias-y-referencia/   # Manuales de entorno local, herramientas y notas operativas
```

### [01 · Metodología y Planificación](01-metodologia/)
* **[Marco de Trabajo Scrumban](01-metodologia/scrumban.md):** Ciclo de vida de tareas en GitHub (`Issue → Rama → PR → rama de integración`; en docs, `main`), Definition of Done (DoD) y acuerdos de colaboración del equipo.
* **[Roadmap por Versiones Incrementales](01-metodologia/roadmap-versiones.md):** Desglose del desarrollo por fases de menor a mayor complejidad (`v0.1.0 MVP`, `v0.2.0 Operativa`, `v0.3.0 Integral`).

### [02 · Especificación de Producto](02-producto/)
* **[Historias de Usuario](02-producto/historias-de-usuario/):** Catálogo de historias organizadas por rol y épica, priorizadas según la versión a la que pertenecen.
* **[Requisitos Funcionales](02-producto/requisitos-funcionales.md):** Requisitos detallados del sistema agrupados por módulo.
* **[Requisitos No Funcionales](02-producto/requisitos-no-funcionales.md):** Criterios de seguridad, rendimiento, concurrencia y observabilidad.
* **[Reglas de Negocio](02-producto/reglas-de-negocio.md):** Políticas del hotel (cancelaciones 48h, pago único, tarifas, horarios fijos de check-in/out).
* **[Roles y responsabilidades](02-producto/roles-y-responsabilidades.md)** y **[matriz de permisos](02-producto/matriz-de-permisos.md):** Roles del personal y accesos permitidos.
* **[Casos de Uso](02-producto/casos-de-uso.md):** Flujos de interacción detallados del sistema.

### [03 · Arquitectura y Diseño Técnico](03-arquitectura/)
* **[Contrato API canónico](openapi.yaml):** Fuente de verdad compartida por API, web y app. Consulta la [guía de actualización, generación de tipos y conformidad](03-arquitectura/contrato-api.md); las actualizaciones se registran mediante issues de este repositorio.
* **[Arquitectura General del Sistema](03-arquitectura/arquitectura-sistema.md):** Topología de servicios, patrón BFF, seguridad JWT y comunicación en tiempo real.
* **[Máquinas de Estados](03-arquitectura/maquinas-de-estados.md):** Ciclos de vida y transiciones válidas para Reservas, Habitaciones, Pedidos, Solicitudes y Cuentas.
* **[Diagramas del Sistema (Mermaid)](03-arquitectura/diagramas-sistema/):** Atlas visual con 26 diagramas de actividad, secuencia, componentes y cobertura de historias.
* **[Registro de Decisiones Arquitectónicas (ADR)](03-arquitectura/adr/):** Histórico justificado de decisiones técnicas tomadas a lo largo del proyecto.

### [04 · Guías y Referencia Operativa](04-guias-y-referencia/)
* **[Guía de Arranque Local](04-guias-y-referencia/arranque-local.md):** Pasos para levantar el ecosistema completo con Docker Compose.
* **[Guion de Validación del Flujo MVP (`v0.1.0`) con Recurrente](04-guias-y-referencia/validacion-mvp-v0-1-0.md):** Precondiciones, clasificación respecto al `OBJ-INT` histórico, los 10 pasos de prueba del MVP y plantilla de registro de evidencias.
* **[Pagos con Recurrente](04-guias-y-referencia/arranque-local.md#42-probar-pagos-con-recurrente):** Configuración local de Sandbox y webhook. La [guía de Stripe CLI](04-guias-y-referencia/stripe-cli.md) se conserva como referencia histórica.
* **[Fotos de Tipos de Habitación (S3, R2 y CloudFront)](04-guias-y-referencia/fotos-tipos-habitacion.md):** Flujo `ADMIN → BFF → API → S3/R2 → CloudFront`, permisos IAM bajo `tipos/*` y checklist de verificación.
* **[Diseño de Integración con Canales](04-guias-y-referencia/integracion-canales.md):** Simulación de ingesta de reservas externas.

---

## 3. Repositorios del Ecosistema

El código del proyecto se encuentra distribuido en los siguientes repositorios de la organización:

| Repositorio | Descripción | Stack Tecnológico |
|---|---|---|
| [`villa-serena-api`](https://github.com/villaserenaguatee/villa-serena-api) | Backend central y API REST | Java 21, Spring Boot 4.1, PostgreSQL 17, Flyway |
| [`villa-serena-web`](https://github.com/villaserenaguatee/villa-serena-web) | Portal público y panel del personal (BFF) | Next.js 15, React 19, TypeScript, Tailwind CSS |
| [`villa-serena-movil`](https://github.com/villaserenaguatee/villa-serena-movil) | App de conserjería para huéspedes | React Native, Expo SDK 54, Expo Router |
| [`villa-serena-infra`](https://github.com/villaserenaguatee/villa-serena-infra) | Infraestructura y despliegue local/remoto | Docker Compose, Terraform, Ansible, AWS |
| [`villa-serena-docs`](https://github.com/villaserenaguatee/villa-serena-docs) | Wiki y contrato API canónico | Markdown, Mermaid, OpenAPI y herramientas Node.js |

## Referencias históricas

[Documentos archivados](04-guias-y-referencia/historico/README.md) y [prompts antiguos](04-guias-y-referencia/historial-prompts/README.md) conservan decisiones, responsables y fechas anteriores. Para trabajar hoy se usan las guías vigentes, el roadmap y las issues; no se ejecutan los prompts antiguos como instrucciones actuales.

## Comprobar el contrato

Con Node.js 24 y pnpm 12, ejecuta `pnpm install --frozen-lockfile` y `pnpm check`. Las instrucciones para agentes están en [AGENTS.md](AGENTS.md). API, web y móvil consumen una revisión fija de docs; no mantienen copias locales de `openapi.yaml`. Consulta la [guía del contrato](03-arquitectura/contrato-api.md) para generar tipos y comprobar consumidores.

## Estado de los recorridos web (22/10/2026)

- [Reconciliación de funcionalidades, decisiones posteriores y bloqueos](02-producto/reconciliacion-frontend-20261022.md).
- [Manual de recorridos web y errores](04-guias-y-referencia/recorridos-web.md).
- [Operaciones existentes sin contrato canónico: propuesta pendiente de acuerdo](03-arquitectura/propuestas/contratos-web-pendientes.md).

Estos documentos distinguen código integrado, preparación local para aprobación y validación pendiente. No certifican servicios reales por tener pantallas o mocks.
