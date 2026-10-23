# Alcance del Proyecto y Decisiones Generales

> Reconciliación 22/10/2026: [decisiones posteriores, estado implementado y límites del contrato](reconciliacion-frontend-20261022.md). Los estados «Pendiente» anteriores no certifican implementación; portal web y Android coexisten. No se reintroducen campos retirados del MVP.

Este documento define el perímetro funcional del PMS Villa Serena: qué componentes y capacidades se construyen y qué queda explícitamente fuera de alcance para mantener el sistema enfocado y viable.

---

## Índice

1. [Propósito del documento](#1-propósito-del-documento)
2. [Niveles de prioridad](#2-niveles-de-prioridad)
3. [Decisiones generales](#3-decisiones-generales)
4. [Flujo principal del sistema](#4-flujo-principal-del-sistema)
5. [Alcance del sistema y conciliación por versión](#5-alcance-del-sistema-y-conciliación-por-versión)
6. [Infraestructura y despliegue compartido](#6-infraestructura-y-despliegue-compartido)
7. [Fuera de alcance](#7-fuera-de-alcance)
8. [Resumen por componente y versión](#8-resumen-por-componente-y-versión)
9. [Estado de supuestos técnicos y confirmaciones académicas](#9-estado-de-supuestos-técnicos-y-confirmaciones-académicas)

---

## 1. Propósito del documento

Este documento define **qué se construye** en el PMS Villa Serena y **qué queda fuera**. Todos los demás documentos (historias de usuario, estados, reglas, permisos, arquitectura y plan de trabajo) se derivan de este.

**Criterio de alcance:** una funcionalidad se conserva solo si **la pidió el ingeniero** o si, sin ella, **se rompe el flujo principal** (sección 4). Todo lo demás se simplifica, se pospone o se descarta.

**Regla del equipo:** si una funcionalidad no aparece en la sección 5, no se construye. Cualquier cambio se discute con el equipo y se actualiza aquí primero.

Los **IDs de alcance** (ej. `ALC-PUB-03`) son estables y todos los documentos los usan como referencia. Los IDs eliminados no se reutilizan.

---

## 2. Niveles de prioridad

| Nivel | Significado |
|---|---|
| **Nivel 1** | Capacidades base del producto. Su distribución entre MVP y versiones posteriores se consulta en el roadmap |
| **Nivel 2** | Capacidades opcionales, planificadas después del flujo principal según el roadmap |
| **Después** | Infraestructura posterior a la validación del MVP; sin fecha nueva fijada en este documento |
| **Descartado** | Fuera del alcance actual. Queda como trabajo futuro (Fase 2) |

La entrega se organiza por el [roadmap vigente](../01-metodologia/roadmap-versiones.md): `v0.1.0` valida reserva, pago, check-in, cuenta, check-out y factura; `v0.2.0` incorpora operación y móvil; `v0.3.0` agrupa capacidades complementarias. Los niveles del catálogo no obligan a entregar todas sus funciones en el MVP. Las confirmaciones académicas se registran en [#11](https://github.com/villaserenaguatee/villa-serena-docs/issues/11).

---

## 3. Decisiones generales

### 3.1 Decisiones generales

| # | Decisión | Detalle |
|---|---|---|
| D-01 | **Un solo hotel** | El sistema administra únicamente Villa Serena. No es multi-propiedad |
| D-02 | **Moneda única: quetzales (GTQ)** | Todos los precios, cargos, pagos y reportes en Q |
| D-03 | **Idioma: español** | Toda la interfaz (web y app) en español |
| D-04 | **Pagos con Recurrente en Sandbox** | Checkout alojado en GTQ, sin dinero real; el backend verifica el pago por webhook o conciliación, nunca por la vuelta del navegador. Véase el [contrato vigente](../03-arquitectura/contrato-api.md) |
| D-05 | **Channel Manager simulado** | Solo se **reciben** reservas de un canal simulado a través de una API. La conexión real con Booking o Expedia es Fase 2 |
| D-06 | **Personal en web privada; huésped en portal web y app Android** | Recepción, Room Service, Mantenimiento/Limpieza y Administrador usan la **web privada**. El huésped principal accede al **portal web (`/portal`)** en `v0.1.0` y a la **app Android** en `v0.2.0` (que incorpora notificaciones push Expo/FCM) |
| D-07 | **Reserva sin cuenta** | El cliente reserva en la web pública sin crear cuenta ni contraseña (verifica su correo antes de emitir la reserva) |
| D-08 | **Acceso del huésped por código al correo (OTP)** | En el portal web (`/login` → `/portal`) y en la **app Android**: correo + código de 6 dígitos (vigencia de 10 minutos, un solo uso), sin contraseña |
| D-10 | **App Android con React Native + Expo** | TypeScript, Expo SDK 54 (`v0.2.0`). Expo Go sirve para pruebas rápidas; las notificaciones push se prueban con un *development build*, porque Expo Go no las recibe. Se entrega como APK (EAS Build). Ver [arquitectura del sistema](../03-arquitectura/arquitectura-sistema.md) |
| D-11 | **Base técnica y validación académica** | Spring Boot 4.1 con Spring Security + JWT, Next.js 15 + React 19 como BFF, PostgreSQL 17, Grafana y API REST con CORS. La pasarela vigente es Recurrente ([ADR-017](../03-arquitectura/adr/ADR-017-pasarela-recurrente.md)); el plan académico inicial mencionaba Stripe. El registro de confirmaciones académicas se detalla en la [sección 9](#9-estado-de-supuestos-técnicos-y-confirmaciones-académicas) |
| D-12 | **Despliegue en la nube y opción de VPS** | La topología compartida implementada publica la web en **Vercel** y el API en **AWS** (HTTP API Gateway + VPC Link + Cloud Map + EC2 Debian 13 ARM64 + S3 + CloudFront); el diseño de VPS única detrás de Cloudflare se conserva como referencia alternativa (`S-04`) |
| D-13 | **Facturación simulada con impresión en 80 mm o carta** | Facturas con serie, correlativo, NIT y total con "IVA incluido" (sin desglose de impuestos), marcadas como **factura de demostración** (sin certificación ante la SAT), con vista de impresión desde el navegador para formato térmico de **80 mm** u **hoja carta** y descarga en **PDF** (`S-02`) |

### 3.2 Decisiones de simplificación

| # | Decisión | Detalle |
|---|---|---|
| D-14 | **Pago único, sin abonos** | Cada pago liquida el **saldo completo**. En la web se paga el **100 % al reservar**. En Recepción se cobra **todo en el check-out** (alojamiento y consumos) |
| D-15 | **No se modifican reservas** | Ni el huésped ni Recepción modifican una reserva. Para cambiar algo, **Recepción la cancela y crea una nueva** |
| D-16 | **Cancelación de todo o nada** | Solo **Recepción** cancela (a pedido del huésped), y solo reservas `Confirmada` que no vengan de un canal externo; las `Pendiente de pago` se revisan al vencer los 30 minutos según el proceso real de pago y solo se cancelan tras confirmar vencimiento sin pago. Con **48 horas o más** antes de las **15:00 del día de llegada**: reembolso **total** por Recurrente para pagos nuevos (si pagó en línea); los pagos históricos de Stripe conservan su proveedor y requieren conciliación con él. Con menos de 48 horas o si no llega: **no hay reembolso** (si no llega, Recepción cancela la reserva con el motivo "No se presentó"; no existe el estado `No-show`). No se calculan penalidades |
| D-17 | **Sin cambio de habitación durante la estadía** | La habitación se asigna o cambia **solo antes del check-in**. Si hay un daño con el huésped dentro, se atiende con el huésped alojado |
| D-18 | **Facturación mínima** | Solo se factura **en el check-out**. Se emite, se imprime (80 mm o carta desde el navegador) y se envía en PDF por correo. **Sin anulación de facturas ni marca "COPIA"**. Los datos fiscales van en la configuración del hotel; la **serie fija** y su número inicial no se editan |
| D-19 | **Mantenimiento de 3 pasos** | Reportar daño → el técnico lo toma (**En proceso**) → **Resuelta**. Sin asignación del Administrador ni reasignaciones en el flujo mínimo de incidencias. Las órdenes operativas existentes sí registran repuestos compartidos con inventario (docs #21) |
| D-20 | **Inventario compartido con compras y repuestos** | Se conserva el flujo actual de API y web (docs #21): movimientos manuales, compras y repuestos de órdenes modifican las mismas existencias. Room Service, limpieza y solicitudes no descuentan automáticamente. El menú conserva **Disponible** o **Agotado** |
| D-21 | **Tiempo real solo para 4 eventos** | Nuevo pedido, cambio de estado del pedido, nueva solicitud y cambio de estado de habitación. No se crea una arquitectura de eventos para todas las entidades |
| D-22 | **Entregas incrementales por versión** | El proyecto se organiza en tres entregas incrementales (`v0.1.0`, `v0.2.0` y `v0.3.0`) según el [roadmap vigente](../01-metodologia/roadmap-versiones.md). La fecha original del 10 de octubre de 2026 es histórica y no fija la entrega actual |

---

## 4. Flujo principal del sistema

Es la visión completa del producto. El MVP (`v0.1.0`) cubre reserva, pago, check-in, cuenta, check-out y factura; los pasos de app Android y operación en vivo corresponden a `v0.2.0`, y las funciones analíticas/complementarias a `v0.3.0` según el roadmap.

1. **Reservar (web pública — `v0.1.0`):** el cliente busca fechas, elige un tipo u oferta, ve el precio cotizado, verifica su correo, ingresa sus datos y **paga el 100 % con Recurrente**. Recibe confirmación con su **código de reserva (`VS-...`)** (que identifica la reserva y no sustituye el OTP de acceso).
   - Recepción también puede crear reservas (`v0.1.0`, se pagan en el check-out), y el **canal simulado** puede enviarlas por la API (`v0.3.0`).
2. **Check-in (Recepción — `v0.1.0`):** busca la reserva ("Llegan hoy"), asigna una habitación **libre y limpia** y hace el check-in.
3. **Estadía (portal web en `v0.1.0` / app Android en `v0.2.0`):** el huésped entra con su **correo + código OTP**, ve su estadía y su cuenta; en `v0.2.0` **pide room service** (se carga a su cuenta), **solicita limpieza o artículos** y recibe **notificaciones push**.
4. **Operación (web privada — `v0.2.0`):** Room Service prepara y entrega los pedidos; Limpieza limpia habitaciones y atiende solicitudes; Mantenimiento resuelve daños.
5. **Check-out (Recepción o portal/app — `v0.1.0` / `v0.2.0`):** se paga el saldo, se indica **NIT o Consumidor Final**, se **emite la factura** (vista de impresión en 80 mm/carta, PDF y envío por correo) y la habitación pasa a **Libre + Sucia**.

---

## 5. Alcance del sistema y conciliación por versión

La columna **Nivel** indica la clasificación del catálogo (sección 2) y la columna **Versión** indica la fase asignada en el [roadmap por versiones incrementales](../01-metodologia/roadmap-versiones.md) (`v0.1.0` MVP, `v0.2.0` Operativa y Móvil, `v0.3.0` Integral y Analítica).

### A. Web pública — Motor de reservas (Cliente)

| ID | Funcionalidad | Nivel | Versión |
|---|---|---|---|
| ALC-PUB-01 | Página de inicio con la información del hotel | 1 | `v0.1.0` |
| ALC-PUB-02 | Catálogo de tipos de habitación y ofertas: fotos, descripción, capacidad y precio | 1 | `v0.1.0` |
| ALC-PUB-03 | Búsqueda de disponibilidad por fechas y número de huéspedes | 1 | `v0.1.0` |
| ALC-PUB-04 | Reserva sin cuenta: datos del huésped principal, verificación de correo y resumen antes de pagar | 1 | `v0.1.0` |
| ALC-PUB-05 | Precio total con la tarifa vigente (precio base + temporada + fin de semana) | 1 | `v0.1.0` |
| ALC-PUB-06 | Pago del **100 %** con Recurrente (Sandbox), verificado por el backend | 1 | `v0.1.0` |
| ALC-PUB-07 | Correo de confirmación con código de reserva (`VS-...`) | 1 | `v0.1.0` |

### B. Web privada — Recepción

| ID | Funcionalidad | Nivel | Versión |
|---|---|---|---|
| ALC-REC-01 | Registrar al huésped principal y a los huéspedes adicionales de una reserva | 1 | `v0.1.0` |
| ALC-REC-02 | **Crear y cancelar** reservas, con validación de disponibilidad (sin modificar) | 1 | `v0.1.0` |
| ALC-REC-03 | Consultar disponibilidad por fechas, respetando el cupo por tipo de habitación | 1 | `v0.1.0` |
| ALC-REC-04 | Asignar o cambiar la habitación de una reserva **antes del check-in**, sin traslapes | 1 | `v0.1.0` |
| ALC-REC-05 | Realizar check-in y check-out | 1 | `v0.1.0` |
| ALC-REC-06 | Consultar la cuenta del huésped, agregar cargos por servicios y **registrar el pago único** del saldo | 1 | `v0.1.0` |
| ALC-REC-08 | Buscar reservas (nombre, documento, código, fecha, estado) con **filtros rápidos "Llegan hoy" y "Salen hoy"** | 1 | `v0.1.0` |
| ALC-REC-10 | Consultar el estado de las habitaciones y marcar como sucia una habitación libre (tiempo real en `v0.2.0`) | 1 | `v0.1.0` / `v0.2.0` |
| ALC-REC-12 | **Calendario Gantt:** habitaciones en filas, días en columnas, reservas con color por estado, clic para ver el detalle y botón "Nueva reserva" | 1 | `v0.2.0` |
| ALC-REC-12b | Crear una reserva seleccionando días directamente en el Gantt | 2 | `v0.3.0` |
| ALC-REC-13 | Ver la tarifa aplicada al crear una reserva | 1 | `v0.1.0` |
| ALC-REC-15 | **Facturación:** emitir la factura en el check-out, a nombre de un NIT o de Consumidor Final, y enviarla en PDF por correo | 1 | `v0.1.0` |
| ALC-REC-16 | **Impresión:** imprimir la factura desde el navegador en formato térmico de 80 mm u hoja carta (y descarga en PDF) | 1 | `v0.1.0` |

### C. Web privada — Administrador

| ID | Funcionalidad | Nivel | Versión |
|---|---|---|---|
| ALC-ADM-01 | Gestión de personal: crear, editar y desactivar empleados; **generar una contraseña temporal** | 1 | `v0.1.0` |
| ALC-ADM-02 | Asignar rol (y área, en Mantenimiento/Limpieza) a cada empleado | 1 | `v0.1.0` |
| ALC-ADM-03 | **Turnos mínimos:** definir turnos y asignarlos a empleados, sin reglas adicionales | 2 | `v0.3.0` |
| ALC-ADM-04 | **Inventario compartido:** insumos con stock y mínimo, entradas/salidas/mermas manuales, compras y repuestos de órdenes sobre las mismas existencias; marca de "stock bajo" (ya implementado en API y web) | 2 | `v0.3.0` |
| ALC-ADM-06 | Catálogo de tipos de habitación y habitaciones (fotos, capacidad, precio base) | 1 | `v0.1.0` |
| ALC-ADM-07 | Menú de Room Service, incluido reactivar ítems agotados | 1 | `v0.2.0` |
| ALC-ADM-08 | Catálogo de amenidades del hotel (para portal y app) | 2 | `v0.3.0` |
| ALC-ADM-09 | **Tarifas dinámicas:** precio base por tipo, temporadas por rango de fechas y ajuste de fin de semana (sin vista previa) | 1 | `v0.1.0` |
| ALC-ADM-10 | **Indicadores básicos:** 3 tarjetas (ocupación, ingresos y reservas por canal) | 1 | `v0.3.0` |
| ALC-ADM-11 | Consultar las incidencias de mantenimiento y su estado (solo lectura) | 1 | `v0.2.0` |
| ALC-ADM-12 | **Configuración del hotel:** nombre, contacto y datos fiscales (las horas de check-in 15:00 y check-out 12:00 son fijas; la serie de factura es inmutable) | 1 | `v0.1.0` |

### D. Channel Manager (preparación)

| ID | Funcionalidad | Nivel | Versión |
|---|---|---|---|
| ALC-CM-01 | Documento de diseño breve de la integración (cómo se conectaría a Booking o Expedia en el futuro) | 1 | `v0.3.0` |
| ALC-CM-02 | Campo "canal de origen" en cada reserva (Directo web, Recepción, Booking, Expedia) | 1 | `v0.1.0` |
| ALC-CM-03 | API para **recibir** reservas externas: clave por canal, validación de disponibilidad y sin duplicados. **Sin firma HMAC, sin cancelación y sin pantalla de canales** | 1 | `v0.3.0` |
| ALC-CM-04 | Canal simulado que envía reservas de prueba a la API | 1 | `v0.3.0` |

### E. Portal del huésped y App móvil Android — Huésped

| ID | Funcionalidad | Nivel | Versión |
|---|---|---|---|
| ALC-APP-01 | Acceso por correo + código OTP (portal web `/portal` en `v0.1.0`; app Android en `v0.2.0`) | 1 | `v0.1.0` / `v0.2.0` |
| ALC-APP-02 | Ver los detalles de la estadía: fechas, habitación, huéspedes y estado | 1 | `v0.1.0` / `v0.2.0` |
| ALC-APP-03 | Pedir Room Service desde el menú, con notas | 1 | `v0.2.0` |
| ALC-APP-04 | Seguimiento en vivo del pedido (Nuevo → En preparación → En camino → Entregado) | 1 | `v0.2.0` |
| ALC-APP-05 | Solicitar limpieza y artículos (toallas, almohadas, etc.), sin inventario | 1 | `v0.2.0` |
| ALC-APP-06 | Directorio de amenidades y datos del Wi-Fi | 2 | `v0.3.0` |
| ALC-APP-07 | Ver mi cuenta: consumos, pagos y saldo | 1 | `v0.1.0` / `v0.2.0` |
| ALC-APP-08 | Pagar el saldo (Recurrente), indicar NIT o Consumidor Final, hacer el check-out digital y ver la **pantalla final con la factura** | 1 | `v0.1.0` / `v0.2.0` |
| ALC-APP-10 | **Notificaciones push** en Android (Spring → Expo Push → FCM): **pedido entregado** y **solicitud atendida** | 1 | `v0.2.0` |

**Efectos del check-out** (desde Recepción o desde el portal/app):

1. Se emite la factura y se envía por correo.
2. La reserva pasa a `FINALIZADA` y la cuenta se cierra.
3. La habitación pasa a `LIBRE` + `SUCIA` (o `FUERA_DE_SERVICIO` si tiene un daño que impide su uso).
4. Las solicitudes pendientes o en proceso se cancelan.
5. Los pedidos de room service `NUEVO` o `EN_PREPARACION` se cancelan. Si hay un pedido `EN_CAMINO`, no se permite el check-out hasta que se entregue.
6. En el portal/app, el huésped ve su factura y ya no puede hacer pedidos ni solicitudes.

### F. Web privada — Room Service

| ID | Funcionalidad | Nivel | Versión |
|---|---|---|---|
| ALC-RS-01 | Cola de pedidos activos, ordenada por antigüedad | 1 | `v0.2.0` |
| ALC-RS-02 | Detalle del pedido (ítems, cantidades, notas, habitación y piso) | 1 | `v0.2.0` |
| ALC-RS-04 | Avanzar el estado del pedido sin saltos | 1 | `v0.2.0` |
| ALC-RS-05 | Cancelar un pedido con motivo (simple) | 1 | `v0.2.0` |
| ALC-RS-06 | Consultar el menú y marcar un ítem como agotado | 1 | `v0.2.0` |
| ALC-RS-08 | Cargo automático del pedido entregado a la cuenta del huésped | 1 | `v0.2.0` |
| ALC-RS-10 | Aviso en pantalla (tiempo real) de pedido nuevo | 1 | `v0.2.0` |

### G. Web privada — Mantenimiento/Limpieza

| ID | Funcionalidad | Nivel | Versión |
|---|---|---|---|
| ALC-MYL-01 | Habitaciones pendientes de limpieza, con prioridad "Llegada hoy" | 1 | `v0.2.0` |
| ALC-MYL-02 | Cambiar el estado de limpieza (Sucia → En limpieza → Limpia) | 1 | `v0.2.0` |
| ALC-MYL-03 | Ver, tomar y atender solicitudes de limpieza y artículos (aviso en tiempo real) | 1 | `v0.2.0` |
| ALC-MYL-07 | Reportar un daño, que crea una incidencia (lo pueden hacer Recepción y Mantenimiento/Limpieza) | 1 | `v0.2.0` |
| ALC-MYL-09 | El técnico toma la incidencia (**En proceso**) y la **resuelve** con la descripción de la solución | 1 | `v0.2.0` |

### H. Transversal

| ID | Funcionalidad | Nivel | Versión |
|---|---|---|---|
| ALC-TRA-01 | Autenticación: personal con correo + contraseña (bloqueo tras 5 intentos fallidos); huésped con OTP en portal/app; **primer Administrador creado por bootstrap controlado** (`BOOTSTRAP_ADMIN_ENABLED`, deshabilitado por defecto y sin sustituir cuentas existentes) | 1 | `v0.1.0` |
| ALC-TRA-02 | 5 roles con permisos aplicados en el backend (Spring Security) | 1 | `v0.1.0` |
| ALC-TRA-03 | Historial de cambios de estado con fecha, hora y responsable | 1 | `v0.1.0` |
| ALC-TRA-04 | Tiempo real para 4 eventos: nuevo pedido, cambio de estado del pedido, nueva solicitud y cambio de estado de habitación | 1 | `v0.2.0` |
| ALC-TRA-05 | Correos transaccionales (Outbox): verificación previa a reserva, confirmación, código OTP, recuperación de personal, contacto y factura | 1 | `v0.1.0` |
| ALC-TRA-09 | **Grafana en local** (Docker): estado del API, peticiones, errores HTTP, CPU y RAM | 1 | `v0.3.0` |
| ALC-TRA-09b | Logs centralizados y una alerta por caída o consumo alto | 2 | `v0.3.0` |
| ALC-TRA-10 | **Entorno local con Docker** (PostgreSQL y correo de prueba) para que todo el equipo desarrolle y haga la demostración | 1 | `v0.1.0` |

---

## 6. Infraestructura y despliegue compartido

| ID | Funcionalidad | Estado |
|---|---|---|
| ALC-TRA-06 | Despliegue público: web en **Vercel** (`villaserenaguate.org`) y API en **AWS** (`api.villaserenaguate.org`, HTTP API Gateway + VPC Link + Cloud Map + EC2 ARM64 + S3 + CloudFront); app Android como APK instalable (EAS Build) | Implementado en `infra` / `web` / `api` (APK en `v0.2.0`) |
| ALC-TRA-07 | CI/CD en GitHub Actions: validación de contrato, pruebas automáticas y workflow manual de despliegue a EC2 por AWS SSM (`cd.yml`) | Implementado |
| ALC-TRA-08 | Backups de la base de datos con restauración probada | Posterior al MVP |

---

## 7. Fuera de alcance

### 7.1 Funcionalidades fuera de alcance

| ID | Funcionalidad | Motivo |
|---|---|---|
| ALC-PUB-08 | Cancelar "mi reserva" de forma autónoma desde la web | Recepción gestiona las cancelaciones; el huésped consulta su reserva e historial en `/portal` o en la app |
| ALC-PUB-09 | Check-in operativo automático con foto del documento | Subir documentos no cambia la reserva a `EN_ESTADIA`; el check-in operativo lo ejecuta Recepción |
| ALC-REC-07 | Comprobante de pago independiente en PDF | La factura emitida en el check-out lo cubre |
| ALC-REC-09 | Vista del día especializada | Lo cubren los filtros rápidos de ALC-REC-08 |
| ALC-REC-11 | Recepción registra y distribuye solicitudes | El huésped las crea desde el portal/app y llegan directo a Limpieza |
| ALC-REC-14 | Aviso a Recepción de nuevas solicitudes | Las solicitudes van directo a Limpieza, que recibe el aviso |
| ALC-ADM-05 | Reportes de faltantes y reposición | No se agrega como requisito de esta reconciliación del inventario |
| ALC-APP-09 | Estadísticas avanzadas de estadías en la app | El portal/app muestra las reservas asociadas al correo sin habilitar servicios de estancia en reservas cerradas |
| ALC-RS-03 | Pedido telefónico | Los pedidos los crea el huésped desde portal web o Android; no se habilita pedido telefónico del personal |
| ALC-RS-07 | Marcar ítem como agotado (separado) | Se une con ALC-RS-06 |
| ALC-RS-09 | Historial de pedidos con filtros y tiempo de entrega | Analítica secundaria |
| ALC-MYL-04 | Información de la habitación y observaciones | No bloquea el flujo |
| ALC-MYL-05 | Insumos usados en la limpieza | No hay descuento automático desde limpieza |
| ALC-MYL-06 | Reportar faltantes de insumos | No se incorpora un flujo de solicitudes de reposición |
| ALC-MYL-08 | Objetos olvidados | Módulo independiente del flujo principal |
| ALC-MYL-11 | Historial de servicios | Puede agregarse después |

ALC-MYL-10 (repuestos de mantenimiento) deja de estar excluido: docs #21 conserva su implementación en órdenes sobre los mismos insumos. No cambia el flujo mínimo de incidencias. Véase [contrato de inventario](../03-arquitectura/contrato-api.md).

**También quedan fuera** (partes de funcionalidades que sí se construyen): modificar reservas; cambio de habitación durante la estadía; abonos y pagos parciales; penalidad de "primera noche"; reembolsos parciales y en efectivo; anulación de facturas y marca "COPIA"; asignación y reasignación de incidencias por el Administrador; cancelación de reservas desde el canal; firma HMAC; pantalla de administración de canales; vista previa de tarifas; recordatorio push de check-out; avisos a Recepción de reservas nuevas y check-outs.

### 7.2 Fase 2

| # | Funcionalidad |
|---|---|
| F2-01 | Firma digital de términos, llave digital o QR de acceso a la habitación |
| F2-02 | Domótica, apertura por NFC o Bluetooth, Wi-Fi automático |
| F2-03 | Reservar turnos en spa, gimnasio o canchas |
| F2-04 | Chat en tiempo real con recepción |
| F2-06 | Crear reservas desde la app |
| F2-07 | Versión iOS de la app |
| F2-08 | Certificación real de facturas ante la SAT (FEL) |
| F2-09 | Programa de fidelidad y pago con puntos |
| F2-10 | Conexión real con Booking o Expedia |
| F2-11 | Mapeo de tipos de habitación del hotel ↔ tipos de cada canal |
| F2-12 | Gantt: arrastrar para mover o extender reservas |
| F2-13 | Tarifas por nivel de ocupación |
| F2-14 | Indicadores avanzados: RevPAR, ADR, gráficas históricas |
| F2-15 | Bitácora de auditoría general |
| F2-16 | Registro de activos y mantenimiento preventivo |
| F2-18 | Multi-hotel, multi-idioma y multi-moneda |

---

## 8. Resumen por componente y versión

| Componente | Nivel 1 | Nivel 2 | En `v0.1.0` (MVP) | En `v0.2.0` (Operativa/Móvil) | En `v0.3.0` (Integral/Analítica) |
|---|---|---|---|---|---|
| A. Web pública | 7 | 0 | 7 (`ALC-PUB-01` a `07`) | 0 | 0 |
| B. Recepción | 12 | 1 | 11 (`ALC-REC-01` a `06`, `08`, `10`, `13`, `15`, `16`) | 1 (`ALC-REC-12` Gantt + tiempo real de `10`) | 1 (`ALC-REC-12b`) |
| C. Administrador | 8 | 3 | 5 (`ALC-ADM-01`, `02`, `06`, `09`, `12`) | 2 (`ALC-ADM-07`, `11`) | 4 (`ALC-ADM-03`, `04`, `08`, `10`) |
| D. Channel Manager | 4 | 0 | 1 (`ALC-CM-02`) | 0 | 3 (`ALC-CM-01`, `03`, `04`) |
| E. Portal / App Huésped | 8 | 1 | 4 en portal web (`ALC-APP-01`, `02`, `07`, `08`) | 8 en app Android (`ALC-APP-01` a `05`, `07`, `08`, `10`) | 1 (`ALC-APP-06`) |
| F. Room Service | 7 | 0 | 0 | 7 (`ALC-RS-01`, `02`, `04`, `05`, `06`, `08`, `10`) | 0 |
| G. Mantenimiento/Limpieza | 5 | 0 | 0 | 5 (`ALC-MYL-01`, `02`, `03`, `07`, `09`) | 0 |
| H. Transversal | 7 | 1 | 5 (`ALC-TRA-01`, `02`, `03`, `05`, `10`) | 1 (`ALC-TRA-04`) | 2 (`ALC-TRA-09`, `09b`) |
| **Total catálogo** | **58** | **6** | **33 capacidades base** | **20 capacidades operativas/móvil** | **11 capacidades analíticas/Nivel 2** |

El catálogo de referencia conserva **58 funcionalidades de Nivel 1**, **6 de Nivel 2** y **3 de infraestructura** distribuidas incrementalmente entre `v0.1.0`, `v0.2.0` y `v0.3.0`. Se retira la exigencia temporal de completar las 58 funcionalidades para la fecha vencida del 10 de octubre de 2026.

---

## 9. Estado de supuestos técnicos y confirmaciones académicas

Para trazabilidad de [#11](https://github.com/villaserenaguatee/villa-serena-docs/issues/11), la tabla siguiente separa la **resolución técnica e implementación actual en el repositorio** de la **constancia de confirmación académica del catedrático** (sin dar por confirmada una validación externa cuando no conste evidencia escrita):

| Ítem / Supuesto | Resolución técnica vigente en el proyecto | Estado de confirmación académica |
|---|---|---|
| **Turnos (`ALC-ADM-03`, `HU-ADM-12`) e inventario compartido (`ALC-ADM-04`, `HU-ADM-13`) — `D8-02`** | **Inventario compartido ya está implementado** en API y web (`/api/v1/gestion/inventario/...`, compras, repuestos y movimientos manuales) y documentado en [`inventario-turnos-personal.md`](inventario-turnos-personal.md#7-inventario-compartido-nivel-2). **Turnos** cuenta con interfaz tipada en web y especificación en `v0.3.0`, pendiente del endpoint [`API #89`](https://github.com/villaserenaguatee/villa-serena-api/issues/89). | Planificado en `v0.3.0` (con inventario ya operativo); la constancia expresa del catedrático sobre la obligatoriedad de turnos en la evaluación final permanece abierta a registro cuando se emita. |
| **Pasarela de pagos Recurrente en GTQ (`D-04`, `D-11`, `ADR-017`)** | Implementada en API y web en sustitución de Stripe para reservas y cobros nuevos en GTQ ([ADR-017](../03-arquitectura/adr/ADR-017-pasarela-recurrente.md)), conservando compatibilidad histórica de lectura para registros antiguos `STRIPE`. | Cambio técnico adoptado por soporte nativo en GTQ para Guatemala; validación del flujo de extremo a extremo seguida en [#13](https://github.com/villaserenaguatee/villa-serena-docs/issues/13). |
| **`S-01` — WebSocket directo al backend** | El navegador conecta por STOMP/WebSocket con Spring mediante un ticket de un solo uso y 60 segundos obtenido a través del BFF (sin Cloudflare Workers ni exposición del JWT). | Adoptado en arquitectura ([sección 6 de arquitectura](../03-arquitectura/arquitectura-sistema.md#6-seguridad-jwt-bff-y-cors)). |
| **`S-02` — Facturación simulada e impresión en 80 mm / carta y PDF (`ALC-REC-15`, `ALC-REC-16`)** | Factura de demostración sin certificación FEL real, con serie fija, correlativo sin saltos, NIT con dígito verificador o `CF`, descarga en PDF y vista de impresión desde el navegador en formato térmico de **80 mm** u **hoja carta** (sin requerir impresora térmica física conectada por ESC/POS). | Criterio de demostración en navegador (vista 80 mm / carta + PDF) documentado; pendiente de constancia académica expresa en caso de exigirse hardware físico. |
| **`S-03` — Tareas en segundo plano (`@Scheduled` + Outbox)** | La sincronización en segundo plano se ejecuta en el backend mediante `@Scheduled` (`VencimientoReservasJob` y procesador de `outbox_events`), sin modo offline en la app móvil. | Adoptado en arquitectura ([sección 5 de arquitectura](../03-arquitectura/arquitectura-sistema.md#5-dónde-vive-cada-regla)). |
| **`S-04` — Infraestructura de despliegue** | Superado por el despliegue real en **Vercel** (web/BFF) y **AWS** (HTTP API Gateway + VPC Link + Cloud Map + EC2 `t4g.small` Debian 13 ARM64 + PostgreSQL 17 + S3 + CloudFront). | Implementado en `villa-serena-infra` ([sección 14 de arquitectura](../03-arquitectura/arquitectura-sistema.md#14-supuestos-técnicos-y-estado-de-confirmación-académica)). |
