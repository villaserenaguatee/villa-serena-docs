# 13 — Plan de Trabajo

> **Proyecto:** PMS para el hotel boutique ficticio "Villa Serena"
> **Fecha:** 1 de octubre de 2026
> **Estado:** plan aprobado; calendario con bloques de hasta 3 h por día seguro. La diferencia de 6,5 h se acepta como margen de error; los tres recortes restantes se deciden el martes 6.
> **Periodo:** del jueves 1 al sábado 10 de octubre de 2026
> **Hito:** sábado 10 de octubre: el flujo completo funcionando en local con Docker (no es la entrega final)
> **Basado en:** 01 — Alcance, 04 — Historias de Usuario y 14 — Tecnologías y Arquitectura

---

## Índice

1. Cómo se armó el plan
2. Capacidad del equipo
3. Repositorios
4. Resumen de objetivos
5. Detalle por objetivo
6. Horas por persona
7. Calendario
8. Trabajo en paralelo
9. Orden de recorte
10. Verificación
11. Pendientes que afectan al plan

---

## 1. Cómo se armó el plan

| Criterio | Cómo se aplicó |
|---|---|
| **Objetivos por etapa del flujo** | Cada objetivo es una parte del flujo que funciona de principio a fin (BD, API, web y app) y se puede demostrar al terminarlo. Dentro de cada objetivo, las tareas se separan por capa |
| **Contrato primero** | El contrato del API (OpenAPI) se congela por partes: objetivos 0 a 2 el viernes 2; objetivos 3A a 4 el lunes 5. Las pantallas pueden adelantarse con datos de prueba; las de cuenta y check-out se ajustan al contrato del lunes dentro de sus mismas horas |
| **Personas por capa** | Las capas son un reparto inicial. Las issues vigentes y sus prioridades orientan el trabajo; se pueden mover tareas entre personas sin duplicarlas ni aumentar horas (sección 6). Alex facilita el proceso como Scrum Master; Kimberly define prioridades y aceptación del producto como Product Owner |
| **Un prompt por objetivo** | Cada objetivo se puede construir con uno o dos prompts de IA (documento 15) |
| **Sin tareas nuevas** | Todo sale del Alcance, de las HU o del documento 14 |

**Estimación.** Se usó el campo **Tamaño** de cada HU. Cada historia incluye todas sus capas (BD, API y web o app) y se hace **con ayuda de IA**:

| Tamaño | Horas |
|---|---|
| S | 1 h |
| M | 2 h |
| L | 4 h |

Las tareas técnicas (no son HU) se estimaron aparte, con el mismo criterio.

---

## 2. Capacidad del equipo

| Dato | Valor |
|---|---|
| Integrantes | 6: Josué, Pablo, Hugo, Kim, Alex y Carlos |
| Presupuesto por persona | **20 h en total**, incluidas integración, coordinación y revisiones |
| Días seguros | Viernes 2 y lunes 5 a viernes 9: **6 días, máximo 3 h por persona y día** |
| Capacidad segura | **18 h por persona; 108 h del equipo** |
| Jueves 1, noche | Opcional, solo si hoy se terminan el plan y los prompts del objetivo 0. Únicamente repositorios, proyectos base y Docker local |
| Domingo 4 | Opcional, solo recuperación de atrasos, sin tareas fijas |
| Horas opcionales dentro del presupuesto | Hasta **2 h por persona entre jueves y domingo**, para completar las 20 h; no son horas garantizadas ni se suman por encima de 20 |
| Capacidad nominal total | **120 h**, si se pueden usar las horas opcionales |
| Viernes 9 | **18 h** reservadas: 3 h por persona para integración y errores |
| Capacidad nominal para construir | **102 h** (120 − 18) |
| Capacidad segura para construir | **90 h** (108 − 18) |
| Sábado 10 | Ensayo y demostración, fuera de las 20 h; no se usa para programar pendientes |

| Balance de estimaciones | Horas |
|---|---:|
| Objetivos 0 a 5 completos | 125,5 |
| Exclusión del objetivo 5: HU-ADM-02 a HU-ADM-08 y HU-ADM-10 | −13 |
| Exclusión del objetivo 5: crear empleados e indicadores | −4 |
| **Construcción estimada del plan activo (0 a 4)** | **108,5** |
| Capacidad nominal para construir | 102 |
| **Exceso aceptado como margen de error** | **6,5** |

**Decisión aprobada:** se conserva el alcance de los objetivos 0 a 4. No se aplican todavía los tres recortes de reserva; se deciden el martes 6, en el orden de la sección 9.2. El margen de 6,5 h es incertidumbre de la estimación, **no autorización para trabajar horas extra**.

Las 102 h incluyen 12 h opcionales del equipo. Si no se usa ningún día opcional, la diferencia frente a las 90 h seguras es **18,5 h**. El calendario no oculta esta diferencia ni promete que todas las tareas estimadas caben: limita las jornadas y muestra prioridades. El martes se compara el trabajo pendiente con las horas realmente disponibles.

---

## 3. Repositorios

Organización de GitHub: `villaserenaguate`.

| Repositorio | Contenido | Responsable |
|---|---|---|
| [villa-serena-docs](https://github.com/villaserenaguate/villa-serena-docs) | Documentación y diseño breve de la integración con canales (ALC-CM-01) | Josué |
| [villa-serena-infra](https://github.com/villaserenaguate/villa-serena-infra) | `docker-compose.dev.yml` (PostgreSQL, Mailpit, MinIO, Prometheus y Grafana), configuración de Prometheus, tablero de Grafana y `.env.example`. Después del hito: VPS, Cloudflare Tunnel y backups | Josué |
| [villa-serena-api](https://github.com/villaserenaguate/villa-serena-api) | Spring Boot, migraciones y datos iniciales de Flyway y el **contrato OpenAPI** (`openapi.yaml`) | Pablo y Hugo (las migraciones, Josué) |
| [villa-serena-web](https://github.com/villaserenaguate/villa-serena-web) | Next.js: web pública, panel privado, BFF y canal simulado | Kim y Alex |
| [villa-serena-movil](https://github.com/villaserenaguate/villa-serena-movil) | Expo (React Native): app Android del huésped | Carlos |

**Cómo se comparten los tipos.** El contrato vive en `villa-serena-api/openapi.yaml`. La web y la app copian ese archivo y generan sus tipos con **openapi-typescript**. Las etiquetas de los estados (documento 07) se guardan en un archivo pequeño dentro de cada frontend.

**Acuerdo vigente:** los 5 repositorios son obligatorios. Los documentos 14 y 00 usan la misma estructura. Cada frontend tiene su copia del contrato y genera sus propios tipos; no hay paquete compartido ni workspace entre repositorios. Alex prepara los repositorios; los responsables de la tabla mantienen su contenido.

---

## 4. Resumen de objetivos

| # | Objetivo | Qué queda funcionando | HU | Horas | Cierre |
|---|---|---|---|---|---|
| 0 | Base | Todo arranca en local; el personal inicia sesión según su rol | 2 | 22,5 | Lun 5 |
| 1 | Reservar | Un cliente reserva y paga en la web; el canal simulado crea reservas | 9 | 18,5 | Mié 7 |
| 2 | Recepción | Recepción ve el Gantt, crea y cancela reservas y hace el check-in | 12 | 20 | Jue 8 |
| 3A | Estadía y Room Service | El huésped entra a la app y pide room service en vivo, con push | 12 | 21 | Vie 9 |
| 3B | Limpieza y mantenimiento | Solicitudes, limpieza de habitaciones y daños | 12 | 15 | Vie 9 |
| 4 | Check-out | Cuenta, pago, factura impresa y por correo; la habitación queda Libre + Sucia | 6 | 11,5 | Vie 9 |
| 5 | Administración (fuera del hito) | Empleados y catálogos vienen en los datos iniciales; sin indicadores de negocio | 10 recortadas | 0 | — |
| 6 | Nivel 2 | Solo si sobra tiempo | 5 | 8 (fuera del plan) | — |
| | **Total activo (0 a 4)** | | **53 activas; 10 recortadas de Nivel 1** | **108,5** | |

**Las fechas de cierre son metas de seguimiento, no capacidad adicional.** El calendario de la sección 7 muestra los bloques disponibles y las condiciones para alcanzarlas. Adelantar 0,5 h del registro de cargos del objetivo 4 al 1 cambia sus subtotales, pero no las 108,5 h del plan.

**Ajustes respecto a la base de objetivos:**

| Ajuste | Motivo |
|---|---|
| **Grafana** pasa al objetivo 0 (contenedor de Docker más Actuator) | Es una tecnología obligatoria. Así no cae si se recorta el objetivo 5 |
| **WebSocket** en el objetivo 3A | Ahí están 3 de los 4 eventos. Hasta entonces, el estado de las habitaciones en Recepción se actualiza al abrir la pantalla |
| **HU-CM-02** (canal de origen) en el objetivo 2 | Se ve en la búsqueda de reservas de Recepción |
| **HU-REC-17** (daño desde Recepción) en el objetivo 3B | Usa el mismo módulo de incidencias que Mantenimiento |
| **HU-REC-02** (huéspedes adicionales) en el objetivo 2 | Se registran en el check-in |
| **HU-RS-06** (cargo del pedido) en el objetivo 3A | Se genera al entregar el pedido. En el objetivo 4 solo se ve en la cuenta |
| El objetivo 3 se divide en **3A y 3B** | Con 36 h no cabe en uno o dos prompts |
| Cierres ajustados al calendario de bloques de 3 h (R-01): objetivo 0 el **lunes 5**, objetivo 1 el **miércoles 7**, objetivo 2 el **jueves 8**, y 3A, 3B y 4 el **viernes 9**, junto con la integración | El esquema y la seguridad terminan el lunes 5, Stripe el miércoles 7 y el check-in el jueves 8. El martes 6 sigue siendo el punto de control (sección 9.2) |

---

## 5. Detalle por objetivo

Capas: **BD** (Flyway y PostgreSQL) · **API** (Spring) · **Web** (Next.js) · **App** (Expo) · **Infra** (Docker y entorno) · **Doc** (documentación).

### Objetivo 0 — Base

**Qué queda funcionando (demostración):** con `docker compose up` arrancan PostgreSQL, Mailpit, MinIO, Prometheus y Grafana. Spring crea las tablas y carga los datos iniciales. Un usuario de prueba de cada rol inicia sesión en la web privada, ve solo sus pantallas y cambia su contraseña temporal. Grafana muestra el estado del API. La app abre su pantalla inicial.

**HU:** HU-EMP-01, HU-EMP-02.
**Tareas técnicas:** permisos por rol, historial de cambios de estado, Grafana en local, Docker local, primer Administrador por variables de entorno y datos iniciales (Flyway).
**Depende de:** nada. **Prompts:** 2 (API e infraestructura; web y app).

| Capa | Tarea | Responsable | Horas |
|---|---|---|---|
| Infra | Preparar los 5 repositorios: `main` reservada para la entrega, `develop` para integrar PR, protección de ambas ramas, README y `.env.example` | Alex | 1 |
| Infra | `docker-compose.dev.yml` con PostgreSQL 17, Mailpit, MinIO, Prometheus y Grafana; tablero mínimo de Grafana (AD-15) | Josué | 2 |
| BD | Esquema completo de Nivel 1 en Flyway, con las restricciones del documento 14, sección 5 (`EXCLUDE`, únicos) | Josué | 3 |
| BD | Datos iniciales (AD-18): canales y claves, artículos, datos del hotel y fiscales, serie de la factura y usuarios de prueba con dos Administradores. Para el hito, también tipos de habitación, habitaciones, menú, temporadas y ajuste de fin de semana | Josué | 2 |
| API | Contrato OpenAPI (endpoints y DTO), `openapi.yaml`: 0 a 2 el viernes 2 (0,5 h por persona); 3A a 4 el lunes 5 (0,5 h por persona) | Josué, Pablo y Hugo | 3 (1 c/u) |
| API | Proyecto base: Spring Boot 4.1, Actuator + Micrometer, springdoc, CORS, manejo de errores, zona horaria (AD-19) e historial de estados | Hugo | 2 |
| API | Spring Security + JWT (15 min y refresh de 7 días), inicio y cierre de sesión, contraseña temporal, permisos por rol (documento 09) y primer Administrador por variables de entorno (HU-EMP-01, HU-EMP-02) | Pablo | 4 |
| Web | Proyecto Next.js 15 (P-01 resuelto), Tailwind, shadcn/ui, TanStack Query y tipos generados desde el contrato | Alex | 1 |
| Web | BFF: inicio y cierre de sesión con cookie httpOnly, revisión del `Origin`, proxy al API, menú por rol y cambio de contraseña (HU-EMP-01, HU-EMP-02) | Alex | 2,5 |
| Web | Diseño base de la web pública (encabezado, pie y estilos) | Kim | 1 |
| App | Proyecto Expo SDK 54 + Expo Router, expo-secure-store, cliente del API y tipos generados | Carlos | 1 |
| | **Total** | | **22,5** |

### Objetivo 1 — Reservar

**Qué queda funcionando (demostración):** un cliente ve el hotel y las habitaciones, busca por fechas, ve el precio total, ingresa sus datos y paga con una tarjeta de prueba de Stripe. La reserva queda `Confirmada` y el correo llega a Mailpit. Una reserva sin pago se cancela sola a los 30 minutos. Desde la pantalla del canal simulado, el Administrador crea una reserva de canal.

**HU:** HU-HUE-01 a HU-HUE-07, HU-CM-01, HU-CM-03.
**Tarea técnica:** diseño breve de la integración con canales (ALC-CM-01).
**Depende de:** objetivo 0. **Prompts:** 2 (API; web).

| Capa | Tarea | Responsable | Horas |
|---|---|---|---|
| Doc | Diseño breve de la integración con canales, en `villa-serena-docs` | Josué | 1 |
| Infra | Guía de Stripe CLI en local (cada integrante usa su propia clave de webhook) | Josué | 0,5 |
| API | Información del hotel y catálogo de habitaciones (HU-HUE-01, HU-HUE-02) | Josué | 1 |
| API | Disponibilidad y precio total con temporada y fin de semana (HU-HUE-03, HU-HUE-04) | Pablo | 1,5 |
| API | Crear la reserva, buscar el huésped por correo y abrir la cuenta (HU-HUE-05); dejar listo el registro común de cargos que usa Room Service (0,5 h adelantadas del objetivo 4) | Pablo | 1,5 |
| API | Stripe Checkout, los 2 webhooks y cancelación a los 30 min con `@Scheduled` (HU-HUE-06) | Pablo | 2,5 |
| API | Outbox y correo de confirmación con Thymeleaf (HU-HUE-07) | Hugo | 1 |
| API | Endpoint del canal con clave y sin duplicados (HU-CM-01) | Hugo | 1,5 |
| Web | Información del hotel y catálogo (HU-HUE-01, HU-HUE-02) | Kim | 1,5 |
| Web | Búsqueda de disponibilidad y precio total (HU-HUE-03, HU-HUE-04) | Kim | 2 |
| Web | Formulario de datos y paso a Stripe (HU-HUE-05, HU-HUE-06) | Kim | 2 |
| Web | Página del resultado del pago (HU-HUE-06) | Alex | 1 |
| Web | Pantalla del canal simulado (HU-CM-03) | Alex | 1,5 |
| | **Total** | | **18,5** |

La estimación base del objetivo es 18 h; las 0,5 h adicionales son el registro común de cargos, trasladado desde el objetivo 4.

### Objetivo 2 — Recepción

**Qué queda funcionando (demostración):** Recepción ve el Gantt con las reservas, consulta la disponibilidad, registra un huésped y crea una reserva. También busca reservas (con su canal de origen), cancela una `Confirmada` con reembolso de Stripe y asigna o cambia la habitación. Ve el estado de las habitaciones, marca una como sucia y hace el check-in con los huéspedes adicionales: la reserva pasa a `En estadía` y la habitación a `Ocupada`.

**HU:** HU-REC-01 a HU-REC-08, HU-REC-10 a HU-REC-12, HU-CM-02.
**Depende de:** objetivos 0 y 1. **Prompts:** 2 (API; web).

| Capa | Tarea | Responsable | Horas |
|---|---|---|---|
| BD | Ajustes de migraciones y reservas de prueba para llenar el Gantt (incluida una `En estadía`, para probar la app antes de que exista el check-in) | Josué | 1 |
| API | Registrar el huésped y los huéspedes adicionales (HU-REC-01, HU-REC-02) | Josué | 1 |
| API | Disponibilidad y creación de reservas desde Recepción (HU-REC-03, HU-REC-04) | Pablo | 1,5 |
| API | Cancelación con reembolso de Stripe (HU-REC-05) | Pablo | 1 |
| API | Check-in (HU-REC-12) | Pablo | 1 |
| API | Búsqueda de reservas con el canal de origen (HU-REC-06, HU-CM-02), solo consulta | Josué | 1 |
| API | Asignar habitación, estado de las habitaciones y marcar sucia (HU-REC-07, HU-REC-10, HU-REC-11) | Hugo | 1,5 |
| API | Datos para el Gantt (HU-REC-08), solo consulta | Josué | 0,5 |
| Web | Calendario Gantt con EventCalendar (HU-REC-08) | Kim | 3 |
| Web | Registro del huésped y creación de la reserva (HU-REC-01, HU-REC-03, HU-REC-04) | Kim | 2,5 |
| Web | Check-in con huéspedes adicionales (HU-REC-02, HU-REC-12) | Kim | 1 |
| Web | Búsqueda, cancelación, asignación de habitación y canal de origen (HU-REC-05 a HU-REC-07, HU-CM-02) | Alex | 2,5 |
| Web | Estado de las habitaciones y marcar sucia (HU-REC-10, HU-REC-11) | Alex | 1,5 |
| Infra | Prueba de punta a punta del objetivo (reservar, cancelar y hacer el check-in) | Josué | 1 |
| | **Total** | | **20** |

### Objetivo 3A — Estadía y Room Service

**Qué queda funcionando (demostración):** el huésped con check-in entra a la app con su correo y un código, y ve su estadía. Pide room service: Room Service recibe el aviso en vivo y avanza el pedido, y el huésped ve el cambio en vivo. Al entregarse, llega un push y se genera el cargo. Room Service puede cancelar un pedido y marcar ítems como agotados.

**HU:** HU-HUE-08 a HU-HUE-11, HU-HUE-17, HU-RS-01 a HU-RS-07.
**Tarea técnica:** WebSocket para los 4 eventos.
**Depende de:** objetivos 0, 1 (correo del Outbox) y 2 (el check-in habilita room service). La app avanza con datos de prueba desde el viernes 2. **Prompts:** 2 (API y web; app).

| Capa | Tarea | Responsable | Horas |
|---|---|---|---|
| BD | Ajustes de migraciones; guía del development build y de la red local para la app | Josué | 1 |
| API | Acceso del huésped con correo + código (OTP) y su JWT (HU-HUE-08) | Carlos | 1 |
| API | Agregar el envío de push con Expo Push al Outbox de Hugo, sin crear otro mecanismo de reintentos (HU-HUE-17) | Carlos | 1 |
| API | Mis reservas y detalle de la estadía (HU-HUE-09) | Carlos | 0,5 |
| API | Menú, pedidos, estados, cancelación, agotado y cargo al entregar usando el registro de cargos de Pablo (HU-HUE-10, HU-RS-02 a HU-RS-06) | Hugo | 3 |
| API | WebSocket + STOMP: ticket de 60 s, JWT del huésped y los 4 temas (documento 14, sección 6.1) | Hugo | 3 |
| Web | Cola de pedidos en vivo y aviso de pedido nuevo (HU-RS-01, HU-RS-07) | Alex | 2 |
| Web | Detalle, avance, cancelación de pedidos y menú agotado (HU-RS-02 a HU-RS-05) | Alex | 2 |
| Web | Cliente STOMP compartido en la web y pedido del ticket por el BFF; cada responsable suscribe sus pantallas dentro de sus horas | Alex | 1 |
| App | Inicio de sesión con código (HU-HUE-08) | Carlos | 1 |
| App | Mis reservas y estadía (HU-HUE-09) | Carlos | 1,5 |
| App | Pedir room service (HU-HUE-10) | Carlos | 1,5 |
| App | Seguir el pedido en vivo (HU-HUE-11) | Carlos | 1,5 |
| App | Firebase/EAS y development build el viernes 2; registro del token y comprobación con el API cuando esté listo, dentro de esta misma hora (HU-HUE-17) | Carlos | 1 |
| | **Total** | | **21** |

### Objetivo 3B — Limpieza y mantenimiento

**Qué queda funcionando (demostración):** el huésped pide limpieza o artículos y ve el estado de sus solicitudes. Mantenimiento/Limpieza recibe la solicitud en vivo, la toma y la atiende, y el huésped recibe el push. Ve las habitaciones por limpiar, inicia y termina la limpieza, y Recepción ve el cambio en vivo. Recepción o Mantenimiento reportan un daño con foto; el técnico lo toma y lo resuelve.

**HU:** HU-HUE-12 a HU-HUE-14, HU-MYL-01 a HU-MYL-08, HU-REC-17.
**Depende de:** objetivos 0, 2 y 3A (WebSocket y push). **Prompts:** 1.

| Capa | Tarea | Responsable | Horas |
|---|---|---|---|
| BD | Ajustes de migraciones | Josué | 1 |
| API | Solicitudes de limpieza y de artículos, y su estado (HU-HUE-12 a HU-HUE-14, HU-MYL-04, HU-MYL-05) | Carlos | 2 |
| API | Limpieza de habitaciones (HU-MYL-01 a HU-MYL-03) | Hugo | 1,5 |
| API | Incidencias con foto en MinIO (HU-MYL-06 a HU-MYL-08, HU-REC-17) | Hugo | 2 |
| Web | Habitaciones por limpiar, iniciar y terminar (HU-MYL-01 a HU-MYL-03) | Kim | 2 |
| Web | Solicitudes: tomar y atender (HU-MYL-04, HU-MYL-05) | Kim | 1,5 |
| Web | Incidencias: reportar, tomar y resolver (HU-MYL-06 a HU-MYL-08, HU-REC-17) | Alex | 2,5 |
| App | Pedir limpieza o artículos y ver las solicitudes (HU-HUE-12 a HU-HUE-14) | Carlos | 2,5 |
| | **Total** | | **15** |

### Objetivo 4 — Check-out

**Qué queda funcionando (demostración):** Recepción abre la cuenta, agrega un cargo y anula uno adicional. Hace el check-out con pago único en una sola operación: se emite la factura, se imprime desde el navegador (80 mm o carta) y llega por correo. La reserva pasa a `Finalizada` y la habitación a Libre + Sucia. El huésped ve su cuenta en la app y puede pagar su saldo con Stripe y hacer el check-out desde ahí.

**HU:** HU-HUE-15, HU-HUE-16, HU-REC-13 a HU-REC-16.
**Depende de:** objetivos 1 (Stripe), 2 (check-in) y 3A (cargos de room service). **Prompts:** 1.

| Capa | Tarea | Responsable | Horas |
|---|---|---|---|
| API | Consulta de cuenta y anulación de cargos (HU-REC-13, HU-HUE-15); reutiliza el registro de cargos adelantado al objetivo 1 | Pablo | 1 |
| API | Check-out en una sola operación con pago único (HU-REC-14) | Pablo | 1,5 |
| API | Pago del saldo con Stripe desde la app (HU-HUE-16) | Pablo | 1 |
| API | Factura con OpenPDF, correlativo y envío por correo (HU-REC-15) | Hugo | 2 |
| Web | Cuenta y cargos (HU-REC-13) | Kim | 1 |
| Web | Check-out, factura e impresión con CSS de 80 mm y carta (HU-REC-14 a HU-REC-16) | Kim | 2 |
| App | Ver mi cuenta (HU-HUE-15) | Carlos | 0,5 |
| App | Pagar el saldo y hacer el check-out (HU-HUE-16) | Carlos | 2,5 |
| | **Total** | | **11,5** |

### Objetivo 5 — Administración (fuera del hito)

**Alcance para el hito:** no se incluyen pantallas de administración ni indicadores en este hito (HU-ADM-01 a HU-ADM-10). Los empleados, catálogos, tarifas y datos del hotel vienen en Flyway; no se construyen pantallas de administración ni indicadores de negocio. **Grafana permanece en el objetivo 0 y el canal simulado en el objetivo 1.**

**Horas activas: 0.** Las historias se conservan en el catálogo general de historias de usuario.

Si más adelante se retoman esas últimas 4 h: Carlos mantiene el API de empleados (1 h) y de indicadores (1 h); Alex sus pantallas (1 h cada una). No tienen fecha ni prompt activo para este hito.

---

### Objetivo 6 — Nivel 2 (fuera del plan)

Fuera del calendario y del presupuesto activo. Solo se retoma si el flujo principal está terminado y queda tiempo real, después de revisar los recortes del objetivo 5. No se usa la reserva de integración.

| HU | Tamaño | Horas |
|---|---|---|
| HU-HUE-18 Ver las amenidades y el Wi-Fi | S | 1 |
| HU-REC-09 Crear una reserva seleccionando días en el Gantt | M | 2 |
| HU-ADM-11 Gestionar amenidades y el Wi-Fi | S | 1 |
| HU-ADM-12 Definir y asignar turnos | M | 2 |
| HU-ADM-13 Gestionar el inventario | M | 2 |
| **Total** | | **8** |

**Prompts:** 1.

---

## 6. Horas por persona

**Estimaciones de esfuerzo, no horas extra autorizadas.** Las tareas pueden cambiar de persona; se mantiene un responsable por módulo para evitar duplicación.

| Persona | Obj. 0 | Obj. 1 | Obj. 2 | Obj. 3A | Obj. 3B | Obj. 4 | Construcción estimada | Integración Vie 9 | Total estimado | Diferencia frente a 20 h |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Josué | 8 | 2,5 | 4,5 | 1 | 1 | 0 | 17 | 3 | 20 | 0 |
| Pablo | 5 | 5,5 | 3,5 | 0 | 0 | 3,5 | 17,5 | 3 | 20,5 | +0,5 |
| Hugo | 3 | 2,5 | 1,5 | 6 | 3,5 | 2 | 18,5 | 3 | 21,5 | +1,5 |
| Kim | 1 | 5,5 | 6,5 | 0 | 3,5 | 3 | 19,5 | 3 | 22,5 | +2,5 |
| Alex | 4,5 | 2,5 | 4 | 5 | 2,5 | 0 | 18,5 | 3 | 21,5 | +1,5 |
| Carlos | 1 | 0 | 0 | 9 | 4,5 | 3 | 17,5 | 3 | 20,5 | +0,5 |
| **Total** | **22,5** | **18,5** | **20** | **21** | **15** | **11,5** | **108,5** | **18** | **126,5** | **+6,5** |

El objetivo 5 tiene 0 h activas. Para aliviar a Pablo, que lleva el camino crítico (reservas, Stripe, check-in y check-out), Josué toma la búsqueda de reservas y los datos del Gantt (1,5 h, solo consultas) y Carlos toma "Mis reservas" del API (0,5 h), junto a su pantalla. No se agregan horas aparte de coordinación: revisiones, reunión breve y ajustes del contrato se absorben en los bloques existentes. Frente a 20 h, Kim queda **2,5 h** por encima; Hugo y Alex, **1,5 h**; Pablo y Carlos, **0,5 h**.

| Persona | Construcción segura (Vie 2 y Lun 5 a Jue 8) | Integración segura (Vie 9) | Máximo opcional entre Jue 1 y Dom 4 | Presupuesto total máximo |
|---|---:|---:|---:|---:|
| Cada integrante | 15 | 3 | 2 | 20 |
| **Equipo** | **90** | **18** | **12** | **120** |

La diferencia de estimación no se mete dentro de un día de más de 3 h. Si una tarea termina antes, se usa ese tiempo para la siguiente o para apoyar a otro integrante. Si no ocurre, queda pendiente para recuperación opcional o para la decisión del martes.

---

## 7. Calendario

### 7.1 Jueves 1 por la noche: adelanto opcional

Solo se trabaja si hoy se terminan el plan y los prompts del objetivo 0. Nadie necesita esperar a otro: los proyectos se pueden preparar en carpetas locales y subir cuando existan los repositorios. **No se asignan seguridad, esquema, contrato ni pantallas funcionales esta noche.**

| Persona | Adelanto permitido | Máximo |
|---|---|---:|
| Josué | Docker local: PostgreSQL, Mailpit, MinIO, Prometheus y Grafana | 2 h |
| Pablo | Sin tarea fija | 0 h |
| Hugo | Proyecto base de Spring | 2 h |
| Kim | Sin tarea fija | 0 h |
| Alex | Crear los 5 repositorios (1 h) y el proyecto Next.js (1 h) | 2 h |
| Carlos | Proyecto Expo | 1 h |
| **Total opcional previsto** | | **7 h** |

La generación de tipos y conexión al API se completan después del contrato, dentro de las horas de los proyectos base. El domingo 4 queda **sin tareas fijas**: solo recuperación voluntaria, hasta completar las 2 h opcionales por persona entre ambos días. Lo no utilizado no se considera disponible automáticamente.

### 7.2 Días seguros: prioridades dentro de bloques de 3 h

**Cada celda tiene un presupuesto máximo de 3 h.** Son bloques de avance, no una afirmación de que todas las tareas mencionadas terminan ese día. Se conserva la estimación de cada tarea en la sección 5. Los adelantos con datos de prueba incluyen su posterior conexión al API dentro de esas mismas estimaciones.

| Día | Josué | Pablo | Hugo | Kim | Alex | Carlos |
|---|---|---|---|---|---|---|
| **Vie 2 — 3 h c/u** | Contrato 0–2 (0,5 h); esquema (hasta 2,5 h) | Contrato 0–2 (0,5 h); seguridad y JWT (hasta 2,5 h) | Contrato 0–2 (0,5 h); Outbox/correo y canal (hasta 2,5 h) | Diseño base (1 h); adelantar cuenta y check-out con datos de prueba (hasta 2 h) | BFF e inicio de sesión (hasta 2,5 h); resultado del pago (hasta 0,5 h) | Firebase/EAS y development build; iniciar cuenta y check-out con datos de prueba. Hasta 1 h de configuración push y 2 h de pantallas |
| **Lun 5 — 3 h c/u** | Contrato 3A–4 (0,5 h); terminar esquema y datos iniciales (hasta 2,5 h) | Contrato 3A–4 (0,5 h); terminar seguridad; disponibilidad y precio (hasta 2,5 h) | Contrato 3A–4 (0,5 h); habitaciones y comienzo de Room Service (hasta 2,5 h) | Web pública: hotel, catálogo y disponibilidad | Resultado del pago, canal simulado y búsqueda de reservas | OTP en API y app; mis reservas. Ajustar datos de prueba al contrato |
| **Mar 6 — 3 h c/u** | **Guía de Stripe CLI (primero, antes de que Pablo pruebe Stripe)**; API del hotel y catálogo; registro del huésped; comenzar búsqueda de reservas | Disponibilidad, reserva, registro común de cargos y Stripe, por ese orden | Room Service y WebSocket | Terminar reserva web; avanzar Gantt | Búsqueda, cancelación, asignación y estado de habitaciones | Mis reservas (API y app), pedidos y envío de push usando el Outbox |
| **Mié 7 — 3 h c/u** | Búsqueda de reservas y datos del Gantt; reservas de prueba (incluida una `En estadía`); ajustes de migraciones de 3A | Terminar Stripe; reservas de Recepción | WebSocket, limpieza de habitaciones y factura | Gantt, reserva de Recepción y check-in | Cliente STOMP compartido y cola de Room Service | Seguimiento en vivo y solicitudes del huésped (API) |
| **Jue 8 — 3 h c/u** | Ajustes de migraciones de 3B; diseño breve del canal; prueba de punta a punta de Recepción | Check-in; consulta de cuenta y anulación; check-out. Pendientes de Pablo (2,5 h): cancelación con reembolso y pago del saldo desde la app (sección 7.3) | Terminar limpieza, incidencias y factura | Limpieza y solicitudes; conectar cuenta, check-out e impresión adelantados | Detalle y avance de pedidos; incidencias y suscripción de habitaciones | Solicitudes en app; conectar cuenta y pago del saldo adelantados; completar registro del token y prueba push |
| **Vie 9 — 3 h c/u** | Integración en Docker y corrección de errores | Integración de reservas y pagos | Integración de operación y factura | Integración de pantallas web | Integración de BFF y tiempo real | Integración de app y push |

**Viernes 2 si no se trabajó el jueves:** las bases pendientes entran primero en el mismo bloque de 3 h. No se añaden horas ni se mueven las demás fechas del calendario.

| Persona | Prioridad del viernes sin adelanto del jueves | Total máximo |
|---|---|---:|
| Josué | Docker 2 h; contrato 0–2 0,5 h; comenzar esquema 0,5 h | 3 h |
| Pablo | Contrato 0–2 0,5 h; seguridad 2,5 h | 3 h |
| Hugo | Base Spring 2 h; contrato 0–2 0,5 h; comenzar Outbox 0,5 h | 3 h |
| Kim | Diseño base 1 h; cuenta/check-out de prueba 2 h | 3 h |
| Alex | Repositorios 1 h; Next.js 1 h; comenzar BFF 1 h | 3 h |
| Carlos | Expo 1 h; configuración Firebase/EAS y development build hasta 1 h; cuenta/check-out de prueba 1 h | 3 h |

El trabajo desplazado queda visible como atraso del objetivo correspondiente; no se da por terminado ni se carga por encima de 3 h a otro día seguro. Se recupera solo si hay tiempo opcional o las tareas terminan antes de lo estimado. Los tiempos de espera de EAS no son trabajo activo: mientras se genera el build, Carlos avanza con datos de prueba.

### 7.3 Cierres y punto de control

| Fecha | Meta o decisión |
|---|---|
| Viernes 2 | Congelar contrato de objetivos 0 a 2. Avance de la base (esquema, seguridad, BFF y proyectos) |
| Lunes 5 | Congelar contrato de objetivos 3A a 4. **Meta: objetivo 0 cerrado** (todo arranca en local y el personal inicia sesión). Cualquier pendiente se informa como atraso |
| Martes 6, final del bloque | Comparar avance real y horas restantes. Revisar especialmente reserva demostrable, API de Recepción, build/push y tareas desplazadas del viernes. **Decidir**, sin aplicación automática, los recortes de reserva en el orden de la sección 9.2 |
| Miércoles 7 | **Meta: objetivo 1 cerrado**: reserva demostrable; no se declara cerrada hasta conectar API, web, Stripe y correo |
| Jueves 8 | **Meta: objetivo 2 cerrado** (Recepción demostrable). Estadía, operación y check-out avanzados con datos de prueba |
| Viernes 9 | **Cierre de 3A, 3B y 4** junto con la integración del flujo completo y la corrección de errores; reserva de 18 h del equipo. No incluye Administración |
| Sábado 10 | Ensayo y demostración, sin usarlo como jornada adicional de desarrollo |

**Pendientes previstos:** con bloques de 3 h, a Pablo le quedan 2,5 h sin día seguro (cancelación con reembolso y pago del saldo desde la app); se cubren con sus horas opcionales o con el recorte de reserva 1, que quita justamente el pago desde la app. Lo mismo aplica a quien termine un bloque con tareas pendientes: se informa como atraso en el punto de control.

**Límite del calendario:** los días seguros ofrecen 90 h de construcción. Con las 7 h de adelantos del jueves hay 97 h; las 5 h opcionales restantes no tienen tareas fijas. Aun usando las 12 h opcionales, quedan 6,5 h de diferencia estimada. Mantener las metas sin recortar depende de ahorrar tiempo en la ejecución; no es un cronograma de 108,5 h íntegramente cubierto por horas garantizadas.

**Verificación diaria:** los seis integrantes tienen 3 h como máximo en cada uno de los seis días seguros (18 h cada uno). La reunión breve y las revisiones se incluyen en estos bloques; no se suman por fuera. Los responsables comunican qué terminó y qué quedó pendiente.

---

## 8. Trabajo en paralelo

Los 6 trabajan en paralelo casi todo el tiempo, gracias al contrato del API y a los datos de prueba. Cada uno corre en su computadora su propio Docker, API, web, app y Stripe CLI. No hace falta trabajar a la misma hora.

### 8.1 Cuándo no se puede trabajar en paralelo

| Momento | Qué bloquea | Cómo se resuelve |
|---|---|---|
| Arranque opcional del jueves 1 | Todavía no hay contrato ni esquema | Solo repositorios, proyectos base independientes y Docker; se puede trabajar localmente antes de subir a GitHub |
| Vie 2 y Lun 5 | La web y la app necesitan acordar datos | Congelar 0 a 2 el viernes y 3A a 4 el lunes. Antes, solo adelantar vistas con datos de prueba; después ajustar y conectar dentro de las horas previstas |
| Cada cierre de objetivo | Hay que unir el API con la web y la app | Josué prueba el flujo del objetivo de punta a punta |

### 8.2 Coordinación de cambios compartidos

| Pieza compartida | Riesgo | Acuerdo |
|---|---|---|
| Migraciones de Flyway | Dos personas crean la misma versión (por ejemplo, dos `V5__`) | El equipo coordina las versiones mediante issues y PR; las migraciones aplicadas permanecen intactas y los cambios usan migraciones nuevas |
| Contrato OpenAPI | Alguien cambia un endpoint que otro ya usa | Los cambios se registran como issues y se revisan en PR con API y sus consumidores web/app |
| Spring Security | Varias tareas modifican la misma configuración | La seguridad compartida de OBJ-0D se reutiliza; los ajustes se coordinan mediante issues y PR y verifican permisos |
| Módulos del API | Dos personas tocan las mismas clases | **Pablo:** reservas, pagos, cuentas y registro común de cargos, check-in y check-out. **Hugo:** base, canal, habitaciones, limpieza, Room Service, incidencias, WebSocket, Outbox/correos y facturación. **Carlos:** OTP, mis reservas del huésped, envío push usando el Outbox y solicitudes; personal e indicadores solo si se retoma el objetivo 5. **Josué:** catálogos, huéspedes y consultas de Recepción (búsqueda de reservas y datos del Gantt, solo lectura) |
| Pantallas de la web | Kim y Alex editan el mismo diseño | **Kim:** web pública, Recepción (Gantt, reservas y check-in), limpieza, solicitudes, cuenta y check-out. **Alex:** BFF, resultado del pago, canal simulado, búsqueda y habitaciones, Room Service e incidencias; Administrador solo si se retoma el objetivo 5 |
| Cliente de tiempo real | Duplicar conexión o dejar pantallas sin suscripción | Alex prepara el cliente STOMP compartido. Alex suscribe habitaciones en Recepción y pedidos en Room Service; Kim suscribe solicitudes y habitaciones en Mantenimiento/Limpieza. Cada uno integra sus pantallas dentro de sus horas actuales |
| Git | Varias personas trabajan sobre la misma rama | Una rama por issue (por ejemplo, `feat/42-obj1-stripe`) y PR acotada a `develop`; `main` queda reservada para la entrega. Los worktrees permiten separar tareas independientes |
| Secretos | Claves subidas a GitHub | Solo en un `.env` fuera de Git; en el repositorio va únicamente `.env.example`. **Nunca pegar claves secretas en un chat de IA** |

---

## 9. Orden de recorte

Regla: se corta **desde el objetivo 6 hacia arriba**. Los objetivos 0 a 4 son el flujo principal y **no se cortan**; dentro de ellos **solo se simplifica o se quita una historia que no rompa el flujo**.

### 9.1 Recortes ya aplicados en este plan

| # | Recorte | Ahorro | Qué pasa en su lugar |
|---|---|---|---|
| 1 | **Objetivo 6 completo** (las 5 HU de Nivel 2) | 8 h | Se hace solo si sobra tiempo |
| 2 | **Objetivo 5 en su mínimo:** HU-ADM-02 a HU-ADM-08 y HU-ADM-10 | 13 h | Tipos de habitación, habitaciones, menú, temporadas, ajuste de fin de semana y datos del hotel van en los **datos iniciales de Flyway**, sin pantalla. Incidencias: el Administrador no las consulta |
| 3 | **Resto del objetivo 5:** HU-ADM-01 y HU-ADM-09 | 4 h | Empleados en datos iniciales, sin pantalla para crearlos ni indicadores de negocio. Grafana se mantiene en el objetivo 0 |

### 9.2 Recortes de reserva: decisión el martes 6 (en este orden)

**No aplicados.** Se conserva hoy el check-out desde la app, el Gantt previsto y los huéspedes adicionales. El martes se decide si hace falta alguno; no se activan automáticamente.

| # | Recorte | Objetivo | Ahorro | Qué pasa en su lugar |
|---|---|---|---|---|
| 1 | El check-out solo se hace en Recepción; se quita el pago desde la app (HU-HUE-16) | 4 (simplificación) | 4 h | El huésped baja a Recepción a pagar. Sigue viendo su cuenta en la app (HU-HUE-15) |
| 2 | Gantt solo para consulta, con la configuración básica de EventCalendar (HU-REC-08) | 2 (simplificación) | 2 h | Se ven las reservas por habitación, sin ajustes visuales |
| 3 | Sin huéspedes adicionales en el check-in (HU-REC-02) | 2 (simplificación) | 1 h | Solo se registra el huésped principal |

**Ahorro máximo de reserva: 7 h (4 + 2 + 1).** No está descontado de las 108,5 h actuales.

> Nota: estos recortes son solo para el hito del 10 de octubre. Las HU siguen en el Alcance y en el documento 04; si el equipo consigue más tiempo, se retoman en este mismo orden, al revés.

---

## 10. Verificación

### 10.1 Cada HU está en exactamente un objetivo

| Objetivo | HU | Cantidad |
|---|---|---|
| 0 | HU-EMP-01, HU-EMP-02 | 2 |
| 1 | HU-HUE-01 a 07, HU-CM-01, HU-CM-03 | 9 |
| 2 | HU-REC-01 a 08, HU-REC-10 a 12, HU-CM-02 | 12 |
| 3A | HU-HUE-08 a 11, HU-HUE-17, HU-RS-01 a 07 | 12 |
| 3B | HU-HUE-12 a 14, HU-MYL-01 a 08, HU-REC-17 | 12 |
| 4 | HU-HUE-15, HU-HUE-16, HU-REC-13 a 16 | 6 |
| 5 | HU-ADM-01 a 10 | 10 |
| **Nivel 1** | | **63** |
| 6 | HU-HUE-18, HU-REC-09, HU-ADM-11 a 13 | 5 |
| **Total** | | **68** |

La tabla conserva la trazabilidad de las 68 HU: **53 activas**, 10 de Nivel 1 recortadas del hito (objetivo 5) y 5 de Nivel 2 fuera del plan. No significa que las 63 de Nivel 1 se construyan ahora. Adelantar el registro de cargos al objetivo 1 no duplica HU-REC-13: su cierre funcional sigue en el objetivo 4.

### 10.2 Tareas técnicas (índice de HU, sección 5)

| Tarea técnica | Objetivo |
|---|---|
| Diseño breve de la integración con canales (ALC-CM-01) | 1 |
| Permisos por rol en Spring Security (ALC-TRA-02) | 0 |
| Historial de cambios de estado (ALC-TRA-03) | 0 |
| WebSocket para los 4 eventos (ALC-TRA-04) | 3A |
| Grafana en local (ALC-TRA-09) | 0 |
| Entorno local con Docker (ALC-TRA-10) | 0 |
| Primer Administrador por variables de entorno (ALC-TRA-01) | 0 |
| Datos iniciales con Flyway (AD-18) | 0 |

### 10.3 Horas por objetivo (con S = 1, M = 2 y L = 4)

| Objetivo | S | M | L | Horas de HU | Tareas técnicas | Total |
|---|---|---|---|---|---|---|
| 0 | 1 | 1 | 0 | 3 | 19,5 | 22,5 |
| 1 | 3 | 5 | 1 | 17 | 1 | 18 |
| 2 | 6 | 5 | 1 | 20 | — | 20 |
| 3A | 6 | 6 | 0 | 18 | 3 (WebSocket) | 21 |
| 3B | 9 | 3 | 0 | 15 | — | 15 |
| 4 | 2 | 3 | 1 | 12 | — | 12 |
| 5 (completo) | 3 | 7 | 0 | 17 | — | 17 |
| 5 (mínimo anterior, ya recortado) | 0 | 2 | 0 | 4 | — | 4 |
| 6 | 2 | 3 | 0 | 8 | — | 8 |

---

**La tabla anterior conserva la estimación base por tamaño.** Para el calendario se trasladan 0,5 h del objetivo 4 al 1: quedan 18,5 h y 11,5 h, respectivamente. El total completo 0 a 5 es 125,5 h; al quitar las 17 h de Administración, el activo es 108,5 h. Las tablas de tareas de la sección 5 y de personas de la sección 6 suman ese mismo total.

## 11. Pendientes que afectan al plan

| # | Pendiente | Quién | Antes de |
|---|---|---|---|
| 1 | **Versión de Next.js (P-01 resuelto):** 15 como versión principal | Equipo | Resuelto; no requiere una nueva decisión para comenzar |
| 2 | **Turnos e inventario:** confirmar con el ingeniero si son obligatorios. Si lo son, HU-ADM-12 y HU-ADM-13 (4 h) **no caben** en este plan sin recortar algo más | Josué | Lun 5 |
| 3 | **Supuestos S-01 a S-04** y si basta el PDF de 80 mm sin impresora térmica: confirmar con el catedrático | Josué | Jue 8 |
| 4 | **Documento 15:** comenzar por los prompts del objetivo 0; el arranque opcional del jueves depende de terminarlos hoy | Josué y equipo | Jue 1, antes de arrancar |
| 5 | Decidir si se aplica algún recorte de reserva según el avance y la disponibilidad opcional real | Equipo | Mar 6, dentro del bloque diario |
