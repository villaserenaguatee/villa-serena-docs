# Tecnologías y Arquitectura del Sistema

> Estado 22/10/2026: frontend publicado en Vercel, HTTP mediante BFF y API independiente; el diseño VPS anterior se conserva como antecedente/propuesta, no como topología acreditada. El portal web complementa Android, sin trasladar push Expo al navegador. Véase [reconciliación](../02-producto/reconciliacion-frontend-20261022.md) y docs #38.

> Conciliación con la [PR #36](https://github.com/villaserenaguatee/villa-serena-docs/pull/36), todavía pendiente de integración: almacenamiento definido por [ADR-007](https://github.com/villaserenaguatee/villa-serena-docs/blob/5dcd7a26ea01a0063375aa18df8fe792e4270301/03-arquitectura/adr/ADR-007-almacenamiento-r2-s3.md): R2 en `dev`, S3 en `prod` y `local` mínimo sin nube. Los comandos y variables vigentes están en [ENTORNOS del API](https://github.com/villaserenaguatee/villa-serena-api/blob/dev/docs/ENTORNOS.md); los diseños de despliegue y backups de otras secciones no acreditan aprovisionamiento.

Este documento describe la arquitectura global, topología de servicios, patrón BFF, seguridad (JWT y CORS) y stack tecnológico oficial para el ecosistema de **Villa Serena**.

---

## Índice

1. [Tecnologías obligatorias](#1-tecnologías-obligatorias)
2. [Decisiones de arquitectura](#2-decisiones-de-arquitectura)
3. [Vista general](#3-vista-general)
4. [Tecnologías por capa](#4-tecnologías-por-capa)
5. [Dónde vive cada regla](#5-dónde-vive-cada-regla)
6. [Seguridad: JWT, BFF y CORS](#6-seguridad-jwt-bff-y-cors) — incluye 6.1 Patrón BFF y seguridad de sesión
7. [Estructura de los repositorios](#7-estructura-de-los-repositorios)
8. [Entorno local](#8-entorno-local)
9. [Despliegue en la VPS (después)](#9-despliegue-en-la-vps-después)
10. [CI/CD (después)](#10-cicd-después)
11. [Requisitos no funcionales](#11-requisitos-no-funcionales)
12. [Limitaciones conocidas y mitigaciones](#12-limitaciones-conocidas-y-mitigaciones)
13. [Cuentas y costos](#13-cuentas-y-costos)
14. [Supuestos técnicos y estado de confirmación académica](#14-supuestos-técnicos-y-estado-de-confirmación-académica)

---

## 1. Tecnologías obligatorias

Confirmadas por el catedrático. No se sustituyen.

| Tecnología | Uso en el proyecto | Cuándo |
|---|---|---|
| **Spring** (Spring Boot) | Backend: API REST con toda la lógica de negocio | Hito |
| **Spring Security + JWT** | Autenticación y autorización | Hito |
| **Next.js + React** | Web pública y panel privado; también actúa como BFF | Hito |
| **PostgreSQL** | Base de datos | Hito |
| **Recurrente** | Pasarela de pagos local en Quetzales (reemplaza a Stripe; ver [ADR-017](adr/ADR-017-pasarela-recurrente.md)) | Hito |
| **Facturación + impresora** | Factura de demostración impresa desde Recepción | Hito |
| **API REST, BFF y CORS** | Patrones de arquitectura | Hito |
| **React Native** | App del huésped (Expo) | Hito |
| **Grafana** | Monitoreo; en el hito, **en local con Docker** | Hito |
| **Cloudflare** | DNS, proxy, SSL, WAF y Tunnel delante de la VPS | Después |
| **VPS** (pagada o AWS) | Aloja web, backend y base de datos | Después |

**Lenguajes:** **Java** (backend), **TypeScript** (web y app) y **SQL** (migraciones).

---

## 2. Decisiones de arquitectura

| # | Decisión | Motivo |
|---|---|---|
| AD-01 | **Spring Boot 4.1 con Java 21 LTS** expone una **API REST** con toda la lógica de negocio | Obligatorio |
| AD-02 | **Spring Security + JWT** para todos: personal con correo y contraseña (**contraseña temporal** generada por el Administrador y cambio obligatorio); huésped con **código OTP por correo** | Obligatorio; HU-ADM-01, HU-EMP-02, HU-HUE-08 |
| AD-03 | **Next.js aplica el patrón BFF:** las peticiones HTTP de la web al API pasan por Next.js, que mantiene el JWT en cookies httpOnly y llama a Spring. El WebSocket conecta directamente a Spring mediante un ticket temporal obtenido por el BFF | Patrón BFF con excepción explícita de WebSocket |
| AD-04 | **La app llama directamente a Spring** (API y WebSocket) con su propio JWT guardado en `expo-secure-store`, **sin pasar por el BFF** | La app no usa cookies de navegador; HU-HUE-11 |
| AD-05 | **CORS** en Spring permite solo los orígenes propios (en el hito, `http://localhost:3000`) | Obligatorio |
| AD-06 | **PostgreSQL 17** con migraciones **Flyway** y **Spring Data JPA**. Las reglas que nunca deben romperse también son **restricciones de la base de datos** (sección 5) | Doble protección |
| AD-07 | **Almacenamiento por entorno:** `local` mínimo sin nube; `dev` con R2 remoto y servicios auxiliares Docker; `prod` con S3. Ver [ADR-007](https://github.com/villaserenaguatee/villa-serena-docs/blob/5dcd7a26ea01a0063375aa18df8fe792e4270301/03-arquitectura/adr/ADR-007-almacenamiento-r2-s3.md) | D-22; ALC-TRA-10 |
| AD-08 | **Después del hito:** una sola **VPS** con Docker Compose detrás de **Cloudflare** (DNS, proxy, SSL, WAF y **Tunnel**: la VPS no abre puertos). Los archivos usan **R2 remoto en dev** y **Amazon S3 en producción**, mediante el adaptador S3 configurable; ver [ADR-007](https://github.com/villaserenaguatee/villa-serena-docs/blob/5dcd7a26ea01a0063375aa18df8fe792e4270301/03-arquitectura/adr/ADR-007-almacenamiento-r2-s3.md) | D-12; ALC-TRA-06 |
| AD-09 | **Tiempo real con WebSocket + STOMP**, **solo para 4 eventos**: nuevo pedido, cambio de estado del pedido, nueva solicitud y cambio de estado de habitación | D-21; documento 07, sección 12 |
| AD-10 | **Notificaciones push** con **Expo Push Service sobre FCM**, enviadas por Spring, **solo** para pedido `ENTREGADO` y solicitud `ATENDIDA` | ALC-APP-10; HU-HUE-17 |
| AD-11 | **App con React Native + Expo SDK 54** (Expo Router). Expo Go de SDK 54 (desde expo.dev/go) para pruebas rápidas; **development build** para probar push; **APK con EAS Build** | Decisión del 1 de octubre: se queda en SDK 54 |
| AD-12 | **Tareas en segundo plano con `@Scheduled` + Outbox:** la **revisión y conciliación de reservas web al vencer el plazo**, con cancelación solo tras confirmar vencimiento sin pago, y el **reintento de correos y push**. No hay cancelación automática por no-show, ni recordatorios, ni sincronización con canales | HU-HUE-06, HU-HUE-07, HU-HUE-17 |
| AD-13 | **Channel Manager: REST/JSON simple.** Clave por canal (guardada con hash), sin duplicados por identificador externo. **Sin formato OTA, sin firma HMAC, sin cancelación y sin pantalla de canales.** El canal simulado (pantalla del Administrador) llama a la API real con las claves de sus variables de entorno | ALC-CM-03; HU-CM-01, HU-CM-03 |
| AD-14 | **Facturación como módulo de Spring:** factura de demostración con serie fija (datos iniciales), correlativo sin saltos, total con "IVA incluido" **sin desglose**, sin anulación ni "COPIA". **Impresión desde el navegador** (CSS para 80 mm y carta) | D-13, D-18; supuesto S-02 |
| AD-15 | **Grafana en local:** Spring Actuator + Micrometer → **Prometheus** → **Grafana**, con un tablero de estado del API, peticiones, errores HTTP, CPU y RAM. Logs centralizados (Loki) y alertas son **Nivel 2** | ALC-TRA-09 y ALC-TRA-09b |
| AD-16 | **5 repositorios en `villaserenaguate`:** `villa-serena-docs`, `villa-serena-infra`, `villa-serena-api`, `villa-serena-web` y `villa-serena-movil`. El contrato canónico vive en `villa-serena-docs/openapi.yaml`; API lo implementa y los frontends generan tipos directamente desde docs, sin copias YAML locales | Separación obligatoria; un contrato de referencia |
| AD-17 | **Pasarela Recurrente (reemplaza a Stripe):** cobro en Quetzales (GTQ) mediante Checkout alojado de Recurrente y webhooks con firma criptográfica (ver [ADR-017](adr/ADR-017-pasarela-recurrente.md)) | Moneda local (GTQ), pasarela guatemalteca; HU-HUE-06 |
| AD-18 | **Flyway solo versiona el esquema.** Los fixtures locales se cargan explícitamente después del arranque. El primer administrador se crea únicamente con bootstrap habilitado, sin generar administradores adicionales | Índice de HU, sección 5; V-04, V-06 |
| AD-19 | **Zona horaria America/Guatemala:** las fechas se guardan en UTC y se convierten a esta zona para mostrar y para calcular "hoy", la regla de 48 horas, la ventana del check-out y el check-in | Necesario para las reglas de fecha de las historias |

---

## 3. Vista general

### 3.1 Entorno de desarrollo local

```
NAVEGADOR (cliente y personal)
  ├── páginas y peticiones ──────► web — Next.js (BFF), localhost:3000
  │                                  └── HTTP + JWT ──► api — Spring Boot 4.1 (localhost:8080)
  └── WebSocket con ticket de 60 s ─────────────────► api (directo, sin pasar por el BFF)

APP ANDROID (huésped)
  └── HTTP y WebSocket con su propio JWT ───────────► api (directo)

api — Spring Boot
  ├──► PostgreSQL 17 ........ datos            (Docker)
  ├──► Mailpit .............. correos de prueba (Docker)
  ├──► Cloudflare R2 ........ fotos y PDF       (remoto; perfil dev)
  ├──► Expo Push → FCM ...... notificaciones push
  └──◄ Recurrente ........... avisos de pago por webhook accesible desde el proveedor

Prometheus (Docker) ──lee métricas de──► api (Actuator)
Grafana (Docker) ─────muestra──────────► Prometheus
```

### 3.2 Después del hito (VPS)

```
 Navegador ─┐                         ┌─ App Android
            ▼                         ▼
 ┌────────────── CLOUDFLARE: DNS · Proxy + SSL · WAF · Tunnel ──────────────┐
 └───────────────┬──────────────────────────────────────────────────────────┘
                 │ (túnel cifrado; la VPS no abre puertos)
 ┌───────────────▼──────────────── VPS · Docker Compose ────────────────────┐
 │  web (Next.js) · api (Spring) · postgres · cloudflared · monitoreo        │
 └───────────────────────────────────────────────────────────────────────────┘
   Archivos: Amazon S3 (assets públicos por CloudFront) · Backups: configuración independiente · Correo: Resend · Pagos: Recurrente · Push: Expo/FCM
```

---

## 4. Tecnologías por capa

### 4.1 Backend (`villa-serena-api`, Java)

| Tecnología | Uso |
|---|---|
| **Spring Boot 4.1** + **Java 21 LTS** + **Maven** | Proyecto del backend (starters `spring-boot-starter-webmvc`, `-security-oauth2-resource-server`, `-flyway`) |
| **Spring Web** (REST) | Endpoints `/api/v1/...` |
| **Spring Security** + **OAuth2 Resource Server** (JWT con claves propias) | Emisión y validación de JWT; `@PreAuthorize` por rol y verificación de propiedad (documento 09) |
| **BCrypt** | Contraseñas del personal y códigos OTP guardados con hash |
| **Spring Data JPA** (Hibernate) + **Flyway** | Acceso a datos y migraciones del esquema; fixtures separados de carga explícita |
| **Jakarta Bean Validation** | Validación de entradas |
| **Spring WebSocket + STOMP** | Los 4 eventos en tiempo real (sección 6) |
| **Spring Scheduling** (`@Scheduled`) + **tabla Outbox** | Revisión/conciliación al vencer el plazo, cancelación confirmada sin pago y reintentos de correos/push |
| **Spring Mail** + **Thymeleaf** | Correos existentes de OTP de acceso, confirmación de reserva y factura; también verificación previa del correo y recuperación del personal. El inventario original de tres era un subconjunto del flujo de estadía. SMTP depende del entorno configurado; una plantilla no acredita entrega |
| **Cliente HTTP de Recurrente** | Checkout alojado, verificación del webhook y reembolso total; conserva registros históricos del proveedor anterior |
| **OpenPDF** | PDF de la factura |
| **AWS SDK S3** | Archivos en **Cloudflare R2** (dev) o **Amazon S3** (prod), con credenciales por entorno y URL firmadas para los privados. `local` mínimo usa el adaptador persistente en PostgreSQL, sin nube |
| **RestClient** de Spring | Envío de push a Expo Push API |
| **springdoc-openapi** | OpenAPI generado y Swagger UI para contrastar la implementación; los tipos TypeScript se generan desde el contrato canónico de docs |
| **Actuator** + **Micrometer (Prometheus)** | Salud y métricas para Grafana |
| **JUnit 5** + **Mockito** + **Testcontainers** + **Spring Security Test** | Pruebas |

### 4.2 Web (`villa-serena-web`, TypeScript)

| Tecnología | Uso |
|---|---|
| **Next.js 15** (App Router) + **React 19** | Web pública, panel privado y **BFF**; versión principal acordada (P-01 resuelto) |
| **Route Handlers de Next.js** | BFF: login, cierre de sesión, renovación y reenvío de peticiones a Spring |
| **Tailwind CSS 4** + **shadcn/ui** + **lucide-react** | Estilos y componentes |
| **TanStack Query** + **TanStack Table** | Datos y tablas |
| **React Hook Form** + **Zod** | Formularios y validación |
| **react-day-picker** (Calendar de shadcn/ui, modo rango) | Selector de fechas de la reserva |
| **EventCalendar** (`@event-calendar/core`, MIT), vista `resourceTimelineMonth` | Calendario Gantt de Recepción |
| **@stomp/stompjs** | Tiempo real (Room Service, Limpieza y estado de habitaciones) |
| **date-fns** + **@date-fns/tz** | Fechas en America/Guatemala |
| **openapi-typescript** + **openapi-fetch** (generación desde `villa-serena-docs/openapi.yaml`) | Tipos y cliente del API |
| **CSS de impresión** (`@media print`, `@page`) | Factura en 80 mm y carta |

### 4.3 App (`villa-serena-movil`, TypeScript)

| Tecnología | Uso |
|---|---|
| **React Native + Expo SDK 54** + **Expo Router** | App del huésped |
| **Expo Go (SDK 54)** | Pruebas rápidas (todo excepto push). Se instala desde expo.dev/go |
| **Development build** (`expo-dev-client`) vía EAS | Pruebas con notificaciones push |
| **EAS Build** | APK para entregar |
| **NativeWind** | Estilos con clases de Tailwind |
| **expo-secure-store** | Guardar el JWT y el refresh token |
| **openapi-typescript** + **openapi-fetch** | Tipos y cliente del API generados dentro de `villa-serena-movil`, desde `villa-serena-docs/openapi.yaml` |
| **TanStack Query** | Datos de la app (sin modo sin conexión) |
| **React Hook Form** + **Zod** | Formularios (correo, código, NIT) |
| **@stomp/stompjs** | Seguimiento en vivo del pedido (evento 2) |
| **expo-notifications** | Recibir push (Expo Push + FCM) |
| **expo-web-browser** + **expo-linking** | Abrir el checkout de Recurrente y volver a la app |

### 4.4 Datos y archivos

| Tecnología | Uso |
|---|---|
| **PostgreSQL 17** (contenedor, volumen persistente) | Base de datos única |
| **Extensión `btree_gist`** | Restricción `EXCLUDE` contra reservas traslapadas en una misma habitación |
| **Flyway** | Solo migraciones del esquema al arrancar Spring; fixtures explícitos y separados, nunca automáticos |
| **Cloudflare R2** (dev) / **Amazon S3** (prod) | Bucket **público**: fotos del hotel, tipos de habitación, menú y amenidades. Bucket **privado**: PDF de facturas y fotos de incidencias |

### 4.5 Entorno, monitoreo y calidad

| Tecnología | Uso | Cuándo |
|---|---|---|
| **Docker + Docker Compose** | Contenedores locales: `postgres`, `mailpit`, `prometheus`, `grafana` | Hito |
| **Grafana** + **Prometheus** | Tablero mínimo del API (ALC-TRA-09) | Hito |
| **Recurrente Sandbox** | Probar el checkout con webhook accesible mediante una URL acordada; ver la guía de arranque | Desarrollo y demo |
| **Loki** + alerta por caída o consumo alto | ALC-TRA-09b | Nivel 2 |
| **VPS Ubuntu 24.04** + **Cloudflare** + **cloudflared** | Producción | Después |
| **GitHub Actions** + **GHCR** | CI/CD | Después |
| **Vitest** + **Playwright** | Pruebas de web y de extremo a extremo | Si da tiempo |
| **ESLint + Prettier**, **Spotless** | Estilo de código | Hito |
| **pnpm** en cada frontend | Dependencias independientes por repositorio, sin workspaces | Hito |

---

## 5. Dónde vive cada regla

| Mecanismo | Qué protege | Reglas (documento 10) |
|---|---|---|
| **Restricciones de PostgreSQL** (Flyway) | Sin reservas traslapadas en la misma habitación (`EXCLUDE`); número de habitación único; correo único de empleado y de huésped; una reserva por canal e identificador externo; un solo cargo por pedido; una sola factura por cuenta; una sola solicitud de limpieza activa por habitación (índice único parcial); correlativo de factura único por serie | RN-RES-002, RN-HAB-007, RN-PER-008, RN-RES-019, RN-CM-004, RN-RS-007, RN-FAC-001, RN-LIM-005, RN-FAC-004 |
| **Servicios de dominio de Spring** (`@Transactional`, bloqueo donde hay concurrencia) | Disponibilidad, tarifas, reservas, cuenta y pagos, check-in y check-out (una sola operación), facturación, indicadores y los efectos del documento 07 (sección 11) | RN-RES, RN-HAB, RN-TAR, RN-PAG, RN-CAN, RN-RS, RN-LIM, RN-MAN, RN-FAC, RN-IND (en especial RN-RES-022) |
| **Inventario y gestión operativa** (transacción y bloqueo del insumo compartido) | Movimientos manuales, compras y repuestos actualizan existencias y auditoría; salidas, mermas y repuestos rechazan stock insuficiente. El stock actual vive en los registros JSON de gestión, no en una restricción SQL específica de stock | RN-INV-001, RN-INV-002, RN-INV-003, RN-INV-011 |
| **Máquinas de estado en Spring** (transiciones por enum) + **historial** | Las transiciones del documento 07; cada cambio se registra en `historial_estados` | RG-EST-01 a 08 (documento 07); RN-RS-001, RN-RS-002, RN-MAN-002 |
| **Spring Security** | La matriz del documento 09 (rol, área y propiedad), acceso del personal y del huésped | RN-SEG-001, 002, 005, 006; RN-PER-011 a 015; RN-APP-001 a 004, RN-APP-010; RN-LIM-011, RN-MAN-009 |
| **`@Scheduled`** | Revisión/conciliación al vencer el plazo; conservar cupo en procesamiento/incertidumbre y cancelar solo tras vencimiento sin pago confirmado (UC-15); procesamiento del Outbox | RN-RES-012, RN-CAN-013 |
| **Outbox** | Correos y push con reintentos: si fallan, el cambio de estado se guarda igual | RN-NOT-002, RN-NOT-003 |
| **WebSocket STOMP** | Los 4 eventos en tiempo real | RN-NOT-006 a 009 |
| **Webhook de Recurrente y conciliación** | Verificación del pago en backend con firma e idempotencia; el retorno del navegador no acredita el cobro | RN-PAG-001 a 003 |
| **Módulo de Channel Manager** | Clave del canal, validaciones, sin duplicados y misma disponibilidad que la web | RN-CM-001, 003, 004; RN-TAR-010, RN-PAG-008 |

**Principio:** la interfaz valida para dar buena experiencia, pero **Spring y la base de datos deciden**. Una regla solo está implementada si se cumple aunque alguien llame al API directamente.


---

## 6. Seguridad: JWT, BFF y CORS

| Tema | Diseño |
|---|---|
| **Tokens** | Acceso de **15 minutos** + renovación (refresh) de **7 días**, **rotativo** (se renueva en cada uso) y guardado con hash en la base de datos para poder revocarlo. Igual para personal y huésped |
| **Contenido del JWT** | Id de usuario, tipo (EMPLEADO o HUESPED), rol, área (solo Mantenimiento/Limpieza) y expiración. Nunca datos personales |
| **Personal** | Correo + contraseña (BCrypt). El Administrador genera una **contraseña temporal** (se muestra una vez, sin correo); el empleado debe cambiarla en su primer acceso. **5 intentos fallidos seguidos → bloqueo de 15 minutos** |
| **Huésped** | OTP de 6 dígitos por correo, vence en 10 minutos, un solo uso, guardado con hash. **5 intentos fallidos → bloqueo de 15 minutos** |
| **Empleado desactivado** | No puede iniciar sesión ni renovar: sus refresh tokens se revocan. La política anterior permitía conservar el acceso hasta vencer el JWT; es un antecedente histórico. El API inspeccionado comprueba la vigencia del empleado en cada petición. La reconciliación de esta política sigue pendiente en API #78, según RN-PER-014, sin debilitar los controles implementados. |
| **BFF (web)** | El navegador llama a `/api/...` de Next.js. Next.js guarda los tokens en **cookies httpOnly, Secure, SameSite=Lax**, renueva el acceso y llama a Spring. El navegador nunca ve el JWT |
| **App** | Guarda los tokens en `expo-secure-store` y llama a Spring directamente |
| **CORS** | Spring permite solo los orígenes propios: en el hito, `http://localhost:3000`; después, `https://<dominio>`. La app no depende de CORS |
| **WebSocket** | Conexión STOMP autenticada en el mensaje `CONNECT`. **App:** envía su JWT. **Web:** el BFF pide un **ticket** de un solo uso y 60 segundos (`POST /api/v1/auth/ws-ticket`). Spring autoriza cada suscripción (tabla siguiente) |
| **Webhook de Recurrente** | Firma Svix sobre el cuerpo original; idempotente por `svix-id` |
| **API del canal** | Canal + clave en cada petición, comparada con su hash. Sin HMAC |
| **Archivos subidos** | Solo imágenes **JPG o PNG de hasta 5 MB** (fotos del hotel, tipos de habitación, menú, amenidades e incidencias). Spring valida el tipo y el tamaño antes de guardarlas; los PDF de facturas los genera el sistema (decisión del 1 de octubre, documento 10, OBS-02) |
| **Red (después)** | Cloudflare Tunnel: la VPS no abre puertos web ni de base de datos; SSH solo con llave |
| **Secretos** | Archivo `.env` fuera de Git (local y VPS) y GitHub Secrets. Nunca en el repositorio ni en un chat de IA |

**Suscripciones WebSocket (los 4 eventos, documento 09, sección 7.4):**

| Destino | Eventos | Quién se suscribe |
|---|---|---|
| `/topic/pedidos` | 1 y 2 (nuevo pedido y cambio de estado) | `ROOM_SERVICE` |
| `/user/queue/pedidos` | 2 (estado de **su** pedido) | `HUESPED` (solo los suyos) |
| `/topic/solicitudes` | 3 (nueva solicitud) | `MANTENIMIENTO_LIMPIEZA` con área `LIMPIEZA` o `AMBAS` |
| `/topic/habitaciones` | 4 (cambio de estado de habitación) | `RECEPCION` y `MANTENIMIENTO_LIMPIEZA` con área `LIMPIEZA` o `AMBAS` |


### 6.1 Patrón BFF y seguridad de sesión

Cómo se implementa la sesión de la web. No agrega funcionalidad: deja por escrito lo que ya está decidido (AD-03, AD-04 y el documento 09).

**1. Qué pasa por el BFF y qué no**

| Petición | Camino | Sesión |
|---|---|---|
| Web pública: información del hotel, disponibilidad, crear la reserva, iniciar el pago y página de retorno de Recurrente | Navegador → BFF → Spring | Sin sesión |
| Panel del personal y portal web del huésped | Navegador → BFF → Spring | Cookies httpOnly de la sesión correspondiente; permisos y titularidad validados por Spring |
| WebSocket del panel | Navegador → **Spring directo**, con el ticket de 60 segundos que entrega el BFF | Ticket |
| App del huésped (API y WebSocket) | App → **Spring directo** | JWT del huésped |
| Webhook de Recurrente y API del canal | Servicio externo → **Spring directo** | Firma Svix / clave del canal |

- El portal web del huésped tiene sesión mediante el BFF y cookies httpOnly. Android llama directamente al API y utiliza SecureStore; no utiliza el BFF. La exclusividad anterior de la app es un antecedente sustituido por la coexistencia de ambos clientes.
- El reenviador genérico del BFF (`/api/...` → `/api/v1/...`) **bloquea** las rutas del webhook de Recurrente y de la API del canal.

**2. Inicio de sesión del personal**

1. El navegador envía correo y contraseña al BFF.
2. El BFF llama a Spring, recibe el token de acceso y el refresh, y los guarda en **cookies httpOnly, Secure (fuera de localhost), SameSite=Lax, path=/**. Nunca los devuelve en el cuerpo de la respuesta.
3. El navegador solo recibe los datos del empleado (nombre, rol, área y si debe cambiar la contraseña).

**3. Renovación**

- Si Spring responde **401**, el BFF intenta renovar **una sola vez** con el refresh y repite la petición.
- Cada renovación **rota** el refresh (el anterior deja de servir). Si la renovación falla, el BFF borra las cookies y la web lleva al inicio de sesión.

**4. Cierre de sesión** (HU-EMP-01, criterio 7)

- El BFF pide a Spring que **revoque** el refresh y luego **borra las cookies**. Después, las páginas privadas vuelven a pedir inicio de sesión.

**5. Protección CSRF**

- Además de SameSite=Lax, el BFF rechaza las peticiones que cambian datos (`POST`, `PUT`, `PATCH`, `DELETE`) si el encabezado `Origin` no es el propio.

**6. Protección de rutas**

- El **middleware** de Next.js 15 redirige al inicio de sesión si no hay cookie de sesión en `/panel/**`.
- El layout del servidor confirma el rol con `GET /api/v1/auth/yo` y muestra "Acceso denegado" si la sección no es de su rol (R-ROL-08). Spring vuelve a validar el permiso en cada endpoint.

**7. Contraseña temporal** (HU-EMP-02, criterio 1)

- Mientras el empleado no cambie su contraseña temporal, su JWT lleva una marca (por ejemplo, `debeCambiarContrasena`). **Spring rechaza** cualquier operación excepto cambiar la contraseña y cerrar sesión, y la web lo lleva a la pantalla de cambio.
- Al cambiarla, Spring emite tokens nuevos sin la marca.

**8. App del huésped**

- Guarda acceso y refresh en `expo-secure-store`; renueva igual que el BFF (un intento ante 401, con rotación).
- Al cerrar sesión, revoca el refresh y elimina el registro del teléfono para push (HU-HUE-17).

---

## 7. Estructura de los repositorios

Organización: **`villaserenaguate`**. Los cinco repositorios son obligatorios y tienen dependencias y configuración propias.

| Repositorio | Contenido |
|---|---|
| `villa-serena-docs` | Contrato canónico `openapi.yaml`, documentación y diseño breve del Channel Manager (ALC-CM-01) |
| `villa-serena-infra` | `docker-compose.dev.yml`, `.env.example`, configuración de Prometheus y Grafana. Después: Compose de despliegue, Cloudflare y backups |
| `villa-serena-api` | Spring Boot/Maven, implementación del contrato de docs, migraciones Flyway del esquema y fixtures locales de carga explícita |
| `villa-serena-web` | Next.js: web pública, panel privado, BFF y canal simulado; tipos generados directamente desde el contrato de docs |
| `villa-serena-movil` | Expo: app Android; tipos generados directamente desde el contrato de docs |

**Contrato y tipos:** la fuente de verdad es `villa-serena-docs/openapi.yaml`. Las actualizaciones se registran mediante issues de docs y se revisan con los consumidores afectados. No se mantienen copias YAML en API, web ni app. Cada consumidor fija un commit de docs; web y app generan sus tipos con la herramienta de docs y el API implementa y verifica ese acuerdo. La [guía del contrato](contrato-api.md) describe el proceso, las herramientas de generación y comprobación y las diferencias conocidas. Las etiquetas de estados se mantienen en un archivo pequeño de cada frontend. No hay `packages/shared`, monorepo ni `pnpm workspaces`; tampoco se crea otro repositorio o paquete para compartir código.

El calendario original de congelación se conserva como antecedente. La evolución actual del contrato se coordina mediante issues y PR en docs, con API, web y app; las referencias históricas al archivo canónico en API quedan sustituidas por este acuerdo.

Estructura interna del API:

```text
villa-serena-api/
├── src/main/java/com/villaserena/api/
│   ├── config/          Seguridad, CORS, WebSocket, OpenAPI
│   ├── auth/            Login, contraseña temporal, OTP, JWT y renovación
│   ├── reservas/        Disponibilidad, tarifas, reservas, cuentas y pagos
│   ├── estadia/         Check-in, check-out y habitaciones
│   ├── roomservice/     Menú y pedidos
│   ├── piso/            Limpieza, solicitudes e incidencias
│   ├── personal/        Gestión laboral; empleados de prueba solo mediante fixtures explícitos
│   ├── inventario/      Nivel 2, movimientos; existencias compartidas con compras y repuestos
│   ├── catalogos/       Catálogos; datos de prueba mediante fixtures explícitos, no Flyway
│   ├── facturacion/     Facturas PDF
│   ├── canal/           API del canal REST/JSON
│   ├── notificaciones/  WebSocket, push, correos y Outbox
│   └── comun/           Estados, historial, errores y utilidades
└── src/main/resources/db/migration/
```

Las carpetas fuera del hito son una referencia para después; no hay que implementarlas ahora. CI/CD sigue después del hito, en los repositorios correspondientes.

---

## 8. Entorno local

| Paso | Comando o detalle |
|---|---|
| Servicios | `docker compose -f docker-compose.dev.yml up -d` desde `villa-serena-infra` (PostgreSQL, Mailpit, Prometheus y Grafana; R2 remoto para archivos en dev) |
| Backend | Desde `villa-serena-api`, utiliza Compose y los comandos del perfil elegido en [ENTORNOS del API](https://github.com/villaserenaguatee/villa-serena-api/blob/dev/docs/ENTORNOS.md). `local`: API y PostgreSQL, almacenamiento privado persistente en PostgreSQL, sin nube. `dev`: R2 remoto y servicios auxiliares. Flyway crea solo el esquema; fixtures manuales posteriores |
| Web | `pnpm dev` en `villa-serena-web` (`http://localhost:3000`) |
| App | `npx expo start` en `villa-serena-movil` (Expo Go de SDK 54) o el development build para probar push |
| Recurrente | Sandbox y webhook `/api/v1/pagos/recurrente/webhook` accesible por el proveedor; ver [arranque local](../04-guias-y-referencia/arranque-local.md#42-probar-pagos-con-recurrente) |
| Correos | Se ven en la interfaz web de Mailpit |
| Monitoreo | Tablero de Grafana con estado del API, peticiones, errores HTTP, CPU y RAM |
| Secretos | Archivos `.env.local` o `.env.dev` del API (Recurrente Sandbox, JWT, credenciales R2 de dev y claves de canal), **fuera de Git** |

**Para la demostración:** la app en el teléfono debe llegar al API de la computadora (misma red Wi-Fi y la IP local de la computadora). El push necesita el development build y conexión a Internet.

---

## 9. Despliegue en la VPS (después)

Se planifica después de validar el MVP según el [roadmap](../01-metodologia/roadmap-versiones.md), sin fijar aquí una nueva fecha (ALC-TRA-06, ALC-TRA-08).

| Tema | Diseño |
|---|---|
| **Tamaño mínimo** | 2 vCPU, 4 GB de RAM, 40 GB SSD (Spring ~1 GB, Next.js ~300 MB, PostgreSQL ~500 MB) |
| **Equivalentes en AWS** | EC2 `t3.medium` o Lightsail de 4 GB |
| **Sistema** | Ubuntu 24.04 LTS, Docker Engine + Compose, usuario sin root, firewall que bloquea todo lo entrante excepto SSH |
| **Contenedores** | `web`, `api`, `postgres` (volumen persistente), `cloudflared` y monitoreo |
| **Archivos** | Amazon S3; públicos por CloudFront/OAC y privados con URLs firmadas |
| **Correo** | Resend |
| **App** | APK con EAS Build apuntando a `https://api.<dominio>` |
| **Backups** | `pg_dump` diario comprimido → Cloudflare R2, 7 días de retención; restauración probada |

---

## 10. CI/CD (después)

ALC-TRA-07. Se configura después del hito.

| Evento | Pasos |
|---|---|
| **Pull request** | Backend: `mvn verify` (compilación, formato, pruebas). Web y app: lint y typecheck. Tipos del OpenAPI al día |
| **Merge a `main`** | Lo anterior → imágenes `api` y `web` a GHCR (etiqueta del commit) → despliegue en la VPS por SSH → APK con EAS Build |

**Integración durante el desarrollo:** las PR se dirigen a la rama acordada de cada repositorio (`main` en docs; `dev` o `develop` en código), con revisión y las verificaciones configuradas. Las protecciones y resultados efectivos se consultan en GitHub. Los workflows del tablero y de colaboración pueden funcionar antes del despliegue.

**Configuración por entorno:** se usan los archivos y variables existentes, con credenciales fuera de Git. El API distingue `local`, `dev` y `prod`; no utiliza un perfil `demo` para cargar datos. Flyway aplica solo el esquema. Los fixtures se cargan de forma manual y explícita, después del arranque, solo en una instancia local con tablas de negocio vacías. El bootstrap queda deshabilitado por defecto; si se habilita, crea solo el primer ADMIN, exige cambio de contraseña y no sustituye cuentas existentes. Para fixtures sobre tablas vacías debe permanecer apagado. Consulta el [arranque de la PR #36](https://github.com/villaserenaguatee/villa-serena-docs/blob/5dcd7a26ea01a0063375aa18df8fe792e4270301/04-guias-y-referencia/arranque-local.md) y ENTORNOS del API; esta propuesta documental no ejecuta esas operaciones. Un Tunnel temporal puede facilitar las pruebas del API desde frontend, con autenticación, acceso acordado y cierre al terminar; no expone servicios administrativos de Docker.

---

## 11. Requisitos no funcionales

### Seguridad

| ID | Requisito | Cuándo |
|---|---|---|
| RNF-SEC-001 | Spring Security es el único mecanismo de autenticación y autorización; emite y valida JWT. | Hito |
| RNF-SEC-002 | Tokens de acceso de 15 minutos y de renovación de 7 días, rotativos y revocables. | Hito |
| RNF-SEC-003 | La autorización sigue la matriz del documento 09 en cada endpoint y en la propiedad del recurso. | Hito |
| RNF-SEC-004 | La VPS no expone puertos web ni de base de datos; todo entra por Cloudflare Tunnel. | Después |
| RNF-SEC-005 | Cloudflare aplica SSL, WAF y límite de peticiones en login, OTP y API del canal. | Después |
| RNF-SEC-006 | En la web, los JWT solo existen en cookies httpOnly del BFF. | Hito |
| RNF-SEC-007 | CORS restringido a los orígenes propios. | Hito |
| RNF-SEC-008 | Contraseñas, códigos OTP y claves de canal guardados con hash. | Hito |
| RNF-SEC-009 | El sistema no recibe ni guarda datos de tarjeta; el webhook verifica la firma Svix de Recurrente. | Hito |
| RNF-SEC-010 | Los PDF de facturas y las fotos de incidencias se entregan con URL firmadas de corta duración. | Hito |
| RNF-SEC-011 | Los secretos solo están en `.env` fuera de Git y en GitHub Secrets. | Hito |

### Datos y disponibilidad

| ID | Requisito | Cuándo |
|---|---|---|
| RNF-DAT-001 | PostgreSQL es la única base de datos; todo cambio de esquema es una migración Flyway. | Hito |
| RNF-DAT-002 | Backup diario con restauración probada (RPO ≤ 24 h, RTO ≤ 2 h). | Después |
| RNF-DAT-003 | Los contenedores se reinician solos si fallan y tienen health checks. | Hito |
| RNF-DAT-004 | Las fechas se guardan en UTC y se muestran y calculan en America/Guatemala (AD-19). | Hito |

### Rendimiento

| ID | Requisito |
|---|---|
| RNF-REN-001 | Objetivo: hotel pequeño (≈ 12–30 habitaciones) y tráfico bajo. |
| RNF-REN-002 | La búsqueda de disponibilidad responde en menos de 2 segundos. |
| RNF-REN-003 | Los 4 eventos en tiempo real llegan en menos de 3 segundos. |

### Observabilidad

| ID | Requisito | Cuándo |
|---|---|---|
| RNF-OBS-001 | Grafana muestra el estado del API, las peticiones, los errores HTTP, la CPU y la RAM. | Hito (ALC-TRA-09) |
| RNF-OBS-002 | Una alerta por caída del API o consumo alto. | Nivel 2 (ALC-TRA-09b) |
| RNF-OBS-003 | Los logs de los contenedores se centralizan (Loki). | Nivel 2 (ALC-TRA-09b) |

### Mantenibilidad

| ID | Requisito | Cuándo |
|---|---|---|
| RNF-MAN-001 | Todo cambio entra por pull request con revisión y pipeline en verde. | Después |
| RNF-MAN-002 | El API está documentado con OpenAPI; los tipos de TypeScript se generan de ese documento. | Hito |
| RNF-MAN-003 | Imágenes Docker identificadas por commit. | Después |
| RNF-MAN-004 | Rollback a una imagen estable anterior con un solo comando. | Después |

### Compatibilidad y usabilidad

| ID | Requisito |
|---|---|
| RNF-USA-001 | La web pública y el panel de Mantenimiento/Limpieza se ven bien en computadora y teléfono. |
| RNF-USA-002 | La app se instala como APK en Android 7.0 o superior. |
| RNF-USA-003 | Interfaz en español y montos en quetzales. |
| RNF-USA-004 | Los estados usan las etiquetas del documento 07; los colores los define la web. |
| RNF-USA-005 | La factura se imprime bien en impresora térmica de 80 mm y en hoja carta. |

---

## 12. Limitaciones conocidas y mitigaciones

| Limitación | Mitigación |
|---|---|
| Expo Go no recibe push desde SDK 53 | Probar push con un **development build**; Expo Go para todo lo demás |
| Expo Go de la Play Store ya está en SDK 57 | Instalar el Expo Go de SDK 54 desde expo.dev/go |
| EAS Build gratuito tiene un límite de builds al mes | Generar el APK solo para entregas; alternativa `eas build --local` |
| En el hito, la app depende de la red local | Teléfono y computadora en la misma Wi-Fi; la IP del API en una variable de entorno de la app |
| EventCalendar no trae componente oficial de React | Envolverlo en un componente que lo monta en un `useEffect` |
| Spring necesita ~1 GB de RAM | Límites de memoria de la JVM; VPS de 4 GB como mínimo |
| Una sola VPS es un punto único de falla | Reinicio automático, backups en R2 y rollback (después) |
| La demostración usa Recurrente Sandbox | No acredita preparación para cobros reales; producción requiere configuración y validación propias |
| La factura no está certificada ante la SAT | Se identifica como "factura de demostración"; FEL real queda en Fase 2 |
| Limitaciones funcionales aceptadas | Están en los documentos 07 y 09 y en el índice de historias (sección 7); no requieren tecnología adicional |

---

## 13. Cuentas y costos

| Servicio | Plan | Costo | Cuándo |
|---|---|---|---|
| Recurrente | Sandbox, sin cobros reales | No estima tarifas de producción | Desarrollo y demo |
| Expo (EAS) + Firebase (FCM) | Free | $0 | Hito |
| GitHub | Free | $0 | Hito |
| Mailpit, Prometheus, Grafana (Docker local) | Software libre | $0 | Desarrollo |
| **VPS** (pagada o AWS) | Por confirmar | Según proveedor | Después |
| **Dominio** | Anual | ~$10–15 al año | Después |
| Cloudflare y almacenamiento R2/S3/CloudFront | Según servicios y consumo | Consultar proveedor | Según entorno |
| Resend | Free | $0 | Después |

---

## 14. Supuestos técnicos y estado de confirmación académica

El detalle de seguimiento académico de [#11](https://github.com/villaserenaguatee/villa-serena-docs/issues/11) se consolida en [Alcance y decisiones, sección 9](../02-producto/alcance-y-decisiones.md#9-estado-de-supuestos-técnicos-y-confirmaciones-académicas):

| # | Supuesto técnico | Resolución adoptada en el sistema | Alternativa descartada |
|---|---|---|---|
| S-01 | **Canal de notificaciones en tiempo real** | El navegador y la app abren WebSocket/STOMP directo contra Spring Boot (la web usa un ticket de un solo uso y 60 segundos emitido vía BFF). | Cloudflare Workers / Durable Objects como servidor intermediario de WebSocket |
| S-02 | **Facturación simulada e impresión en 80 mm / carta** | Factura de demostración (serie fija, correlativo consecutivo, NIT con verificador o `CF`, total con "IVA incluido" sin desglose, PDF y vista de impresión del navegador para formato térmico de **80 mm** u **hoja carta**). | Certificador FEL real ante la SAT o protocolo ESC/POS de hardware térmico directo |
| S-03 | **Sincronización en segundo plano** | Tareas programadas en el backend (`@Scheduled` para `VencimientoReservasJob` y procesador transaccional de `outbox_events`). | Sincronización offline-first en el cliente móvil |
| S-04 | **Infraestructura de despliegue** | Web/BFF desplegada en **Vercel** y API + PostgreSQL 17 en **AWS EC2 `t4g.small` (Debian 13 ARM64)** detrás de AWS HTTP API Gateway + VPC Link + Cloud Map, con almacenamiento en S3 + CloudFront. | VPS única con todos los contenedores detrás de Cloudflare Tunnel |
| P-01 (resuelto) | **Versión principal de Next.js: 15**, acordada por el equipo | App Router sobre Next.js 15 y React 19. | — |
