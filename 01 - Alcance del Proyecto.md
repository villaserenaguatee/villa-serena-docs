# 01 — Alcance del Proyecto

> **Proyecto:** Property Management System (PMS) para Hoteles Boutique — Hotel ficticio "Villa Serena"
> **Estado:** 📝 Para revisión del equipo
> **Fecha:** 30 de septiembre de 2026
> **Hito del 10 de octubre de 2026:** el sistema debe estar casi terminado y funcionando **en local** (backend, web y app). No es la entrega final.
> **Siguiente documento:** 04 — Historias de Usuario

---

## Índice

1. [Propósito del documento](#1-propósito-del-documento)
2. [Niveles de prioridad](#2-niveles-de-prioridad)
3. [Decisiones generales](#3-decisiones-generales)
4. [Flujo principal del sistema](#4-flujo-principal-del-sistema)
5. [Alcance del sistema](#5-alcance-del-sistema)
6. [Después del 10 de octubre](#6-después-del-10-de-octubre)
7. [Fuera de alcance](#7-fuera-de-alcance)
8. [Resumen](#8-resumen)
9. [Pendientes](#9-pendientes)

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
| **Nivel 1** | Obligatorio para el **10 de octubre**, funcionando en local. Es la demostración mínima del sistema |
| **Nivel 2** | Se construye **solo si da tiempo** después de terminar todo el Nivel 1 |
| **Después** | Va **después del 10 de octubre** y antes de la entrega final (infraestructura) |
| **Descartado** | Fuera del alcance actual. Queda como trabajo futuro (Fase 2) |

**Regla:** nadie empieza una funcionalidad de Nivel 2 mientras quede algo de Nivel 1 sin terminar en su frente de trabajo.

---

## 3. Decisiones generales

### 3.1 Decisiones generales

| # | Decisión | Detalle |
|---|---|---|
| D-01 | **Un solo hotel** | El sistema administra únicamente Villa Serena. No es multi-propiedad |
| D-02 | **Moneda única: quetzales (GTQ)** | Todos los precios, cargos, pagos y reportes en Q |
| D-03 | **Idioma: español** | Toda la interfaz (web y app) en español |
| D-04 | **Pagos con Stripe en modo prueba** | Flujo completo (pago + confirmación por webhook) sin dinero real, en la web y en la app |
| D-05 | **Channel Manager simulado** | Solo se **reciben** reservas de un canal simulado a través de una API. La conexión real con Booking o Expedia es Fase 2 |
| D-06 | **Personal en web, huésped en app** | Recepción, Room Service, Mantenimiento/Limpieza y Administrador usan la **web privada**. La **app Android** es exclusiva del huésped |
| D-07 | **Reserva sin cuenta** | El cliente reserva en la web pública sin crear cuenta ni contraseña |
| D-08 | **Acceso del huésped por código al correo (OTP)** | Solo en la **app**: correo + código de 6 dígitos, sin contraseña |
| D-10 | **App Android con React Native + Expo** | TypeScript, Expo SDK 54. Expo Go sirve para pruebas rápidas; las notificaciones push se prueban con un *development build*, porque Expo Go no las recibe. Se entrega como APK (EAS Build). Ver documento 14 |
| D-11 | **Tecnologías obligatorias del catedrático** | Spring Boot con Spring Security + JWT, Next.js + React como BFF, PostgreSQL, Stripe, Cloudflare, Grafana y API REST con CORS. Ver documento 14 |
| D-12 | **Todo en una VPS** | Web, backend y base de datos en una VPS con Docker detrás de Cloudflare. **Se hace después del 10 de octubre** |
| D-13 | **Facturación simulada con impresión** | Facturas con serie, correlativo, NIT y total con "IVA incluido" (sin desglose de impuestos), marcadas como **factura de demostración** (sin certificación ante la SAT), impresas en térmica de 80 mm u hoja carta |

### 3.2 Decisiones de simplificación

| # | Decisión | Detalle |
|---|---|---|
| D-14 | **Pago único, sin abonos** | Cada pago liquida el **saldo completo**. En la web se paga el **100 % al reservar**. En Recepción se cobra **todo en el check-out** (alojamiento y consumos) |
| D-15 | **No se modifican reservas** | Ni el huésped ni Recepción modifican una reserva. Para cambiar algo, **Recepción la cancela y crea una nueva** |
| D-16 | **Cancelación de todo o nada** | Solo **Recepción** cancela (a pedido del huésped), y solo reservas `Confirmada` que no vengan de un canal externo; las `Pendiente de pago` se cancelan solas a los 30 minutos. Con **48 horas o más** antes de las **15:00 del día de llegada**: reembolso **total** por Stripe (si pagó en línea). Con menos de 48 horas o si no llega: **no hay reembolso** (si no llega, Recepción cancela la reserva con el motivo "No se presentó"; no existe el estado `No-show`). No se calculan penalidades |
| D-17 | **Sin cambio de habitación durante la estadía** | La habitación se asigna o cambia **solo antes del check-in**. Si hay un daño con el huésped dentro, se atiende con el huésped alojado |
| D-18 | **Facturación mínima** | Solo se factura **en el check-out**. Se emite, se imprime (80 mm o carta) y se envía en PDF por correo. **Sin anulación de facturas ni marca "COPIA"**. Los datos fiscales van en la configuración del hotel; la **serie fija** y su número inicial se cargan en los datos iniciales y no se editan |
| D-19 | **Mantenimiento de 3 pasos** | Reportar daño → el técnico lo toma (**En proceso**) → **Resuelta**. Sin asignación del Administrador, sin reasignaciones ni repuestos |
| D-20 | **Sin integración de inventario** | Room Service, limpieza y mantenimiento **no descuentan inventario**. El menú solo marca cada ítem como **Disponible** o **Agotado** |
| D-21 | **Tiempo real solo para 4 eventos** | Nuevo pedido, cambio de estado del pedido, nueva solicitud y cambio de estado de habitación. No se crea una arquitectura de eventos para todas las entidades |
| D-22 | **Hito del 10 de octubre en local** | Todo el Nivel 1 funcionando en local con Docker. VPS, Cloudflare, CI/CD y backups van **después** |

---

## 4. Flujo principal del sistema

Es la columna vertebral del sistema. **Toda funcionalidad de Nivel 1 existe para que este flujo funcione de principio a fin.**

1. **Reservar (web pública):** el cliente busca fechas, elige un tipo de habitación, ve el precio (tarifa dinámica), ingresa sus datos y **paga el 100 % con Stripe**. Recibe un correo con su **código de reserva** y el **enlace de la app**.
   - Recepción también puede crear reservas (se pagan en el check-out), y el **canal simulado** puede enviarlas por la API.
2. **Check-in (Recepción):** busca la reserva ("Llegan hoy"), asigna una habitación **libre y limpia** y hace el check-in.
3. **Estadía (app):** el huésped entra con su **correo + código**, ve su estadía, **pide room service** (se carga a su cuenta), **solicita limpieza o artículos** y recibe **notificaciones push**.
4. **Operación (web privada):** Room Service prepara y entrega los pedidos; Limpieza limpia habitaciones y atiende solicitudes; Mantenimiento resuelve daños.
5. **Check-out (app o Recepción):** se paga el saldo, se indica **NIT o Consumidor Final**, se **emite la factura** (impresa y por correo) y la habitación pasa a **Libre + Sucia**.

---

## 5. Alcance del sistema

La columna **Nivel** indica la prioridad (sección 2).

### A. Web pública — Motor de reservas (Cliente)

| ID | Funcionalidad | Nivel |
|---|---|---|
| ALC-PUB-01 | Página de inicio con la información del hotel | 1 |
| ALC-PUB-02 | Catálogo de tipos de habitación: fotos, descripción, capacidad y precio | 1 |
| ALC-PUB-03 | Búsqueda de disponibilidad por fechas y número de huéspedes | 1 |
| ALC-PUB-04 | Reserva sin cuenta: datos del huésped principal y resumen antes de pagar | 1 |
| ALC-PUB-05 | Precio total con la tarifa vigente (precio base + temporada + fin de semana) | 1 |
| ALC-PUB-06 | Pago del **100 %** con Stripe (modo prueba), confirmado por webhook | 1 |
| ALC-PUB-07 | Correo de confirmación con código de reserva y enlace de descarga de la app | 1 |

### B. Web privada — Recepción

| ID | Funcionalidad | Nivel |
|---|---|---|
| ALC-REC-01 | Registrar al huésped principal y a los huéspedes adicionales de una reserva | 1 |
| ALC-REC-02 | **Crear y cancelar** reservas, con validación de disponibilidad (sin modificar) | 1 |
| ALC-REC-03 | Consultar disponibilidad por fechas, respetando el cupo por tipo de habitación | 1 |
| ALC-REC-04 | Asignar o cambiar la habitación de una reserva **antes del check-in**, sin traslapes | 1 |
| ALC-REC-05 | Realizar check-in y check-out | 1 |
| ALC-REC-06 | Consultar la cuenta del huésped, agregar cargos por servicios y **registrar el pago único** del saldo | 1 |
| ALC-REC-08 | Buscar reservas (nombre, documento, código, fecha, estado) con **filtros rápidos "Llegan hoy" y "Salen hoy"** | 1 |
| ALC-REC-10 | Consultar el estado de las habitaciones (en tiempo real) y marcar como sucia una habitación libre | 1 |
| ALC-REC-12 | **Calendario Gantt:** habitaciones en filas, días en columnas, reservas con color por estado, clic para ver el detalle y botón "Nueva reserva" | 1 |
| ALC-REC-12b | Crear una reserva seleccionando días directamente en el Gantt | 2 |
| ALC-REC-13 | Ver la tarifa aplicada al crear una reserva | 1 |
| ALC-REC-15 | **Facturación:** emitir la factura en el check-out, a nombre de un NIT o de Consumidor Final, y enviarla en PDF por correo | 1 |
| ALC-REC-16 | **Impresión:** imprimir la factura en impresora térmica de 80 mm u hoja carta | 1 |

### C. Web privada — Administrador

| ID | Funcionalidad | Nivel |
|---|---|---|
| ALC-ADM-01 | Gestión de personal: crear, editar y desactivar empleados; **generar una contraseña temporal** | 1 |
| ALC-ADM-02 | Asignar rol (y área, en Mantenimiento/Limpieza) a cada empleado | 1 |
| ALC-ADM-03 | **Turnos mínimos:** definir turnos y asignarlos a empleados, sin reglas adicionales | 2 |
| ALC-ADM-04 | **Inventario aislado:** productos con stock y mínimo, entradas y salidas manuales, marca de "stock bajo". Sin conexión con otros módulos | 2 |
| ALC-ADM-06 | Catálogo de tipos de habitación y habitaciones (fotos, capacidad, precio base) | 1 |
| ALC-ADM-07 | Menú de Room Service, incluido reactivar ítems agotados | 1 |
| ALC-ADM-08 | Catálogo de amenidades del hotel (para la app) | 2 |
| ALC-ADM-09 | **Tarifas dinámicas:** precio base por tipo, temporadas por rango de fechas y ajuste de fin de semana (sin vista previa) | 1 |
| ALC-ADM-10 | **Indicadores básicos:** 3 tarjetas (ocupación, ingresos y reservas por canal) | 1 |
| ALC-ADM-11 | Consultar las incidencias de mantenimiento y su estado (solo lectura) | 1 |
| ALC-ADM-12 | **Configuración del hotel:** nombre, contacto y datos fiscales (las horas de check-in 15:00 y check-out 12:00 son fijas; la serie de factura va en los datos iniciales) | 1 |

### D. Channel Manager (preparación)

| ID | Funcionalidad | Nivel |
|---|---|---|
| ALC-CM-01 | Documento de diseño breve de la integración (cómo se conectaría a Booking o Expedia en el futuro) | 1 |
| ALC-CM-02 | Campo "canal de origen" en cada reserva (Directo web, Recepción, Booking, Expedia) | 1 |
| ALC-CM-03 | API para **recibir** reservas externas: clave por canal, validación de disponibilidad y sin duplicados. **Sin firma HMAC, sin cancelación y sin pantalla de canales** | 1 |
| ALC-CM-04 | Canal simulado que envía reservas de prueba a la API | 1 |

### E. App móvil Android — Huésped

| ID | Funcionalidad | Nivel |
|---|---|---|
| ALC-APP-01 | Acceso por correo + código OTP | 1 |
| ALC-APP-02 | Ver los detalles de la estadía: fechas, habitación, huéspedes y estado | 1 |
| ALC-APP-03 | Pedir Room Service desde el menú, con notas | 1 |
| ALC-APP-04 | Seguimiento en vivo del pedido (Nuevo → En preparación → En camino → Entregado) | 1 |
| ALC-APP-05 | Solicitar limpieza y artículos (toallas, almohadas, etc.), sin inventario | 1 |
| ALC-APP-06 | Directorio de amenidades y datos del Wi-Fi | 2 |
| ALC-APP-07 | Ver mi cuenta: consumos, pagos y saldo | 1 |
| ALC-APP-08 | Pagar el saldo (Stripe), indicar NIT o Consumidor Final, hacer el check-out digital y ver la **pantalla final con la factura** | 1 |
| ALC-APP-10 | **Notificaciones push** (Spring → Expo Push → FCM): **pedido entregado** y **solicitud atendida** | 1 |

**Efectos del check-out** (desde la app o desde Recepción):

1. Se emite la factura y se envía por correo.
2. La reserva pasa a `FINALIZADA` y la cuenta se cierra.
3. La habitación pasa a `LIBRE` + `SUCIA` (o `FUERA_DE_SERVICIO` si tiene un daño que impide su uso).
4. Las solicitudes pendientes o en proceso se cancelan.
5. Los pedidos de room service `NUEVO` o `EN_PREPARACION` se cancelan. Si hay un pedido `EN_CAMINO`, no se permite el check-out hasta que se entregue.
6. En la app, el huésped ve la pantalla final con su factura y ya no puede hacer pedidos ni solicitudes.

### F. Web privada — Room Service

| ID | Funcionalidad | Nivel |
|---|---|---|
| ALC-RS-01 | Cola de pedidos activos, ordenada por antigüedad | 1 |
| ALC-RS-02 | Detalle del pedido (ítems, cantidades, notas, habitación y piso) | 1 |
| ALC-RS-04 | Avanzar el estado del pedido sin saltos | 1 |
| ALC-RS-05 | Cancelar un pedido con motivo (simple) | 1 |
| ALC-RS-06 | Consultar el menú y marcar un ítem como agotado | 1 |
| ALC-RS-08 | Cargo automático del pedido entregado a la cuenta del huésped | 1 |
| ALC-RS-10 | Aviso en pantalla (tiempo real) de pedido nuevo | 1 |

### G. Web privada — Mantenimiento/Limpieza

| ID | Funcionalidad | Nivel |
|---|---|---|
| ALC-MYL-01 | Habitaciones pendientes de limpieza, con prioridad "Llegada hoy" | 1 |
| ALC-MYL-02 | Cambiar el estado de limpieza (Sucia → En limpieza → Limpia) | 1 |
| ALC-MYL-03 | Ver, tomar y atender solicitudes de limpieza y artículos (aviso en tiempo real) | 1 |
| ALC-MYL-07 | Reportar un daño, que crea una incidencia (lo pueden hacer Recepción y Mantenimiento/Limpieza) | 1 |
| ALC-MYL-09 | El técnico toma la incidencia (**En proceso**) y la **resuelve** con la descripción de la solución | 1 |

### H. Transversal

| ID | Funcionalidad | Nivel |
|---|---|---|
| ALC-TRA-01 | Autenticación: personal con correo + contraseña (bloqueo tras 5 intentos fallidos); huésped con OTP en la app; **primer Administrador creado al arrancar** con variables de entorno | 1 |
| ALC-TRA-02 | 5 roles con permisos aplicados en el backend (Spring Security) | 1 |
| ALC-TRA-03 | Historial de cambios de estado con fecha, hora y responsable | 1 |
| ALC-TRA-04 | Tiempo real para 4 eventos: nuevo pedido, cambio de estado del pedido, nueva solicitud y cambio de estado de habitación | 1 |
| ALC-TRA-05 | Correos: código OTP, confirmación de reserva y factura | 1 |
| ALC-TRA-09 | **Grafana en local** (Docker): estado del API, peticiones, errores HTTP, CPU y RAM | 1 |
| ALC-TRA-09b | Logs centralizados y una alerta por caída o consumo alto | 2 |
| ALC-TRA-10 | **Entorno local con Docker** (PostgreSQL y correo de prueba) para que todo el equipo desarrolle y haga la demostración | 1 |

---

## 6. Después del 10 de octubre

Se hacen después del hito y antes de la entrega final.

| ID | Funcionalidad |
|---|---|
| ALC-TRA-06 | Despliegue en una VPS con Docker detrás de Cloudflare: web con URL pública y app como APK instalable |
| ALC-TRA-07 | CI/CD: pull requests con revisión, pruebas automáticas y despliegue automático |
| ALC-TRA-08 | Backups de la base de datos con restauración probada |

---

## 7. Fuera de alcance

### 7.1 Funcionalidades fuera de alcance

| ID | Funcionalidad | Motivo |
|---|---|---|
| ALC-PUB-08 | Consultar y cancelar "mi reserva" desde la web | Recepción gestiona las cancelaciones. El huésped consulta su reserva en la app |
| ALC-PUB-09 | Check-in anticipado con foto del documento | El check-in en Recepción ya existe |
| ALC-REC-07 | Comprobante de pago independiente en PDF | La factura lo cubre |
| ALC-REC-09 | Vista del día especializada | Lo cubren los filtros rápidos de ALC-REC-08 |
| ALC-REC-11 | Recepción registra y distribuye solicitudes | El huésped las crea desde la app y llegan directo a Limpieza |
| ALC-REC-14 | Aviso a Recepción de nuevas solicitudes | Las solicitudes van directo a Limpieza, que recibe el aviso |
| ALC-ADM-05 | Reportes de faltantes y reposición | Depende del inventario integrado, que se elimina |
| ALC-APP-09 | Historial de estadías en la app | Basta la pantalla final del check-out (ALC-APP-08) |
| ALC-RS-03 | Pedido telefónico | Los pedidos entran solo desde la app |
| ALC-RS-07 | Marcar ítem como agotado (separado) | Se une con ALC-RS-06 |
| ALC-RS-09 | Historial de pedidos con filtros y tiempo de entrega | Analítica secundaria |
| ALC-MYL-04 | Información de la habitación y observaciones | No bloquea el flujo |
| ALC-MYL-05 | Insumos usados en la limpieza | Sin inventario integrado |
| ALC-MYL-06 | Reportar faltantes de insumos | Sin inventario integrado |
| ALC-MYL-08 | Objetos olvidados | Módulo independiente del flujo principal |
| ALC-MYL-10 | Repuestos de mantenimiento | Sin inventario integrado |
| ALC-MYL-11 | Historial de servicios | Puede agregarse después |

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

## 8. Resumen

| Componente | Nivel 1 | Nivel 2 |
|---|---|---|
| A. Web pública | 7 | 0 |
| B. Recepción | 12 | 1 |
| C. Administrador | 8 | 3 |
| D. Channel Manager | 4 | 0 |
| E. App Android | 8 | 1 |
| F. Room Service | 7 | 0 |
| G. Mantenimiento/Limpieza | 5 | 0 |
| H. Transversal | 7 | 1 |
| **Total** | **58** | **6** |
| **Después del 10 de octubre** | **3** | |
| **Fuera de alcance** | **17** | |

El alcance tiene **58 funcionalidades obligatorias para el 10 de octubre**, 6 opcionales (Nivel 2) y 3 para después.
