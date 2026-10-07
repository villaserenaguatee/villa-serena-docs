# 02 — Definición de Roles

> **Proyecto:** Property Management System (PMS) para Hoteles Boutique — Hotel ficticio "Villa Serena"
> **Estado:** 📝 Para revisión del equipo
> **Fecha:** 1 de octubre de 2026
> **Basado en:** 01 — Alcance, 04 — Historias de Usuario y 07 — Estados
> **Documentos relacionados:** 08 — Inventario, Turnos y Personal · 09 — Matriz de Permisos

---

## Índice

1. [Propósito del documento](#1-propósito-del-documento)
2. [Resumen de roles](#2-resumen-de-roles)
3. [Detalle por rol](#3-detalle-por-rol)
4. [Actores que no son usuarios](#4-actores-que-no-son-usuarios)
5. [Reglas generales de roles](#5-reglas-generales-de-roles)

---

## 1. Propósito del documento

Define **quién usa el sistema**, **desde dónde**, **cómo entra** y **de qué es responsable**. La acción exacta que puede hacer cada rol está en el documento **09 — Matriz de Permisos**.

**Regla principal:** cada rol usa **solo sus pantallas**. El Administrador tiene las suyas y el canal simulado; no usa las pantallas de Recepción ni las de piso. En la demostración se entra con el usuario de cada rol.

---

## 2. Resumen de roles

| Rol | Código | Dónde trabaja | Cómo entra | Quién crea la cuenta |
|---|---|---|---|---|
| Administrador | `ADMIN` | Web privada | Correo + contraseña | El primero, al arrancar el sistema (variables de entorno); los de prueba, en los datos iniciales |
| Recepcionista | `RECEPCION` | Web privada | Correo + contraseña | Administrador |
| Room Service | `ROOM_SERVICE` | Web privada | Correo + contraseña | Administrador |
| Mantenimiento/Limpieza | `MANTENIMIENTO_LIMPIEZA` | Web privada (pensada para el teléfono del empleado) | Correo + contraseña | Administrador |
| Cliente/Huésped | `HUESPED` | Web pública (Cliente) y app Android (Huésped) | Cliente: sin sesión. Huésped: correo + código de 6 dígitos (OTP) | Su perfil se crea al hacer la primera reserva |

> El **código** del rol se guarda en la base de datos y va en el JWT. Se escribe igual en todo el proyecto.

**Datos iniciales (Flyway):** un usuario de prueba de cada rol y **dos Administradores**, para no perder el acceso si uno olvida su contraseña (V-04).

---

## 3. Detalle por rol

### 3.1 Administrador (`ADMIN`)

**Descripción:** configura el hotel y supervisa la operación. **Solo usa sus pantallas** y el canal simulado.

| Área | Responsabilidad | Historias |
|---|---|---|
| Personal | Crear, editar, desactivar y reactivar empleados; asignar rol y área; generar contraseñas temporales | HU-ADM-01, HU-ADM-02 |
| Catálogos | Tipos de habitación, habitaciones y menú de Room Service (incluido reactivar ítems agotados) | HU-ADM-03, HU-ADM-04, HU-ADM-05 |
| Tarifas | Temporadas y ajuste de fin de semana | HU-ADM-06, HU-ADM-07 |
| Configuración | Datos generales y fiscales del hotel | HU-ADM-08 |
| Indicadores | Ocupación de hoy, ingresos y reservas por canal | HU-ADM-09 |
| Mantenimiento | **Consultar** las incidencias (solo lectura) | HU-ADM-10 |
| Channel Manager | Enviar reservas de prueba con el canal simulado | HU-CM-03 |
| Nivel 2 (si da tiempo) | Amenidades y Wi-Fi, turnos e inventario aislado | HU-ADM-11, HU-ADM-12, HU-ADM-13 |

**No hace:** operaciones de Recepción (reservas, check-in, check-out, cargos, facturas), tareas de piso (limpieza, solicitudes, incidencias) ni tareas de Room Service. **No asigna** incidencias: el técnico las toma.

### 3.2 Recepcionista (`RECEPCION`)

**Descripción:** atiende al huésped y gestiona el ciclo de la reserva, desde la creación hasta el check-out y la factura.

| Área | Responsabilidad | Historias |
|---|---|---|
| Huéspedes | Registrar al huésped principal (los 6 datos; se identifica por su correo) y a los adicionales | HU-REC-01, HU-REC-02 |
| Reservas | Consultar disponibilidad, crear y cancelar reservas (**no las modifica**), buscar reservas, ver el canal de origen | HU-REC-03 a HU-REC-06, HU-CM-02 |
| Habitaciones | Asignar o cambiar la habitación **antes del check-in**; ver el estado de las habitaciones; marcar como sucia una habitación libre y limpia | HU-REC-07, HU-REC-10, HU-REC-11 |
| Calendario | Ver el calendario Gantt | HU-REC-08 (y HU-REC-09, Nivel 2) |
| Estadía | Check-in; consultar la cuenta y agregar o anular cargos; check-out con pago único | HU-REC-12, HU-REC-13, HU-REC-14 |
| Facturación | Emitir la factura en el check-out e imprimirla | HU-REC-15, HU-REC-16 |
| Mantenimiento | Reportar daños | HU-REC-17 |

**No puede:** cancelar reservas `PENDIENTE_PAGO` (se cancelan solas) ni reservas de canal; modificar reservas; marcar una habitación como `LIMPIA`; crear o cancelar solicitudes o pedidos; gestionar personal, catálogos, tarifas o configuración.

### 3.3 Room Service (`ROOM_SERVICE`)

**Descripción:** prepara y entrega los pedidos que los huéspedes hacen desde la app. Un solo rol cubre cocina y entrega.

| Área | Responsabilidad | Historias |
|---|---|---|
| Pedidos | Ver la cola y el detalle, avanzar el estado y cancelar con motivo; recibir el aviso de pedido nuevo | HU-RS-01 a HU-RS-04, HU-RS-07 |
| Menú | Consultar el menú y marcar ítems como agotados | HU-RS-05 |
| Cargo | El cargo del pedido entregado lo genera el sistema; Room Service no lo edita ni lo anula | HU-RS-06 |

**No puede:** crear pedidos (solo entran desde la app); reactivar ítems agotados (solo el Administrador); ver datos personales del huésped más allá del nombre, la habitación y el piso.

### 3.4 Mantenimiento/Limpieza (`MANTENIMIENTO_LIMPIEZA`)

**Descripción:** mantiene las habitaciones limpias y en funcionamiento. Es **un solo rol** con el atributo **Área**, que asigna el Administrador.

| Área | Código | Qué hace |
|---|---|---|
| Limpieza | `LIMPIEZA` | Habitaciones pendientes de limpieza y solicitudes de los huéspedes |
| Mantenimiento | `MANTENIMIENTO` | Incidencias: tomarlas y resolverlas |
| Ambas | `AMBAS` | Todo lo anterior |

| Responsabilidad | Área | Historias |
|---|---|---|
| Ver las habitaciones pendientes de limpieza; iniciar, interrumpir y terminar la limpieza | `LIMPIEZA` o `AMBAS` | HU-MYL-01, HU-MYL-02, HU-MYL-03 |
| Ver, tomar y atender las solicitudes de limpieza y de artículos | `LIMPIEZA` o `AMBAS` | HU-MYL-04, HU-MYL-05 |
| Reportar un daño | Cualquier área | HU-MYL-06 |
| Ver las incidencias, tomar una y resolverla | `MANTENIMIENTO` o `AMBAS` | HU-MYL-07, HU-MYL-08 |

**Flujo de incidencias (3 pasos):** cualquier empleado de este rol, o Recepción, reporta el daño (`REPORTADA`) → un técnico la **toma** (`EN_PROCESO`) → el mismo técnico la **resuelve** (`RESUELTA`). El Administrador solo consulta.

**No puede:** ver reservas, pagos ni datos personales del huésped; solo ve el número de habitación y el piso.

### 3.5 Cliente/Huésped (`HUESPED`)

**Descripción:** persona que reserva y se hospeda en el hotel. Lo que puede hacer **depende de dónde está y del estado de su reserva**.

| Situación | Sesión | Qué puede hacer | Dónde | Historias |
|---|---|---|---|---|
| **Cliente** | No | Ver el hotel y el catálogo, buscar disponibilidad, ver el precio, reservar y pagar el 100 % | Web pública | HU-HUE-01 a HU-HUE-07 |
| **Huésped con reserva** (`PENDIENTE_PAGO` o `CONFIRMADA`) | Sí (OTP) | Ver sus reservas y el detalle | App | HU-HUE-08, HU-HUE-09 |
| **Huésped en estadía** (`EN_ESTADIA`) | Sí (OTP) | Además: room service, solicitudes de limpieza y artículos, ver su cuenta, pagar el saldo y hacer el check-out; recibe notificaciones push | App | HU-HUE-10 a HU-HUE-17 |
| **Estadía finalizada** (`FINALIZADA`) | Sí (OTP) | Ver la pantalla final con su factura; ya no hace pedidos ni solicitudes | App | HU-HUE-16 |
| **En cualquier estado** | Sí (OTP) | Ver todas sus reservas en el selector (también las `CANCELADA`), con su estado; ver su cuenta; *Nivel 2:* ver las amenidades y el Wi-Fi | App | HU-HUE-09, HU-HUE-15, HU-HUE-18 |

**Reglas del rol:**

- El perfil del huésped tiene **los mismos 6 datos** en todos los orígenes (nombre, correo, teléfono, nacionalidad, tipo y número de documento) y **se identifica por su correo**. Si el correo ya existe, se usa ese perfil sin cambiar sus datos.
- Al entrar a la app, queda vinculado con **todas** las reservas hechas con su correo (web, Recepción o canal).
- Los **huéspedes adicionales** son **registros** (nombre, tipo y número de documento, nacionalidad), **no usuarios**: solo el huésped principal entra a la app.
- El huésped solo ve **sus propias** reservas, pedidos, solicitudes y cuenta.
- El huésped **no** modifica ni cancela reservas ni pedidos; solo puede cancelar sus solicitudes `PENDIENTE`. Si se equivocó en una reserva ya pagada, pide a Recepción que la cancele.

---

## 4. Actores que no son usuarios

No tienen cuenta, pero participan en los procesos (documento 07).

| Actor | Código | Qué hace | Cómo se autentica |
|---|---|---|---|
| Sistema | `SISTEMA` | Procesos automáticos: cancelar reservas sin pago a los 30 minutos, efectos del check-out, cargo del pedido entregado, cambios de la habitación por incidencias, correos y notificaciones push | Proceso interno del backend (`@Scheduled` y servicios) |
| Stripe | `STRIPE` | Avisa del resultado de los pagos (pagado o sesión vencida) | Firma del webhook de Stripe |
| Canal externo | `CANAL` | Envía reservas a la API (Booking o Expedia; en la demostración, el canal simulado). **No cancela** | Clave del canal (guardada con hash; cargada en los datos iniciales) |

---

## 5. Reglas generales de roles

| # | Regla | Historias |
|---|---|---|
| R-ROL-01 | **Un empleado tiene un solo rol.** | HU-ADM-01 |
| R-ROL-02 | **Los empleados no se eliminan, se desactivan.** Un empleado `INACTIVO` no puede iniciar sesión; su nombre se conserva en los registros históricos. | HU-ADM-02, HU-EMP-01 |
| R-ROL-03 | **Solo el Administrador crea cuentas de personal.** El personal no se registra solo. El primer Administrador se crea al arrancar el sistema. | HU-ADM-01 |
| R-ROL-05 | **El rol Mantenimiento/Limpieza requiere un área** (`LIMPIEZA`, `MANTENIMIENTO` o `AMBAS`). Los demás roles no tienen área. | HU-ADM-01 |
| R-ROL-06 | **El huésped solo accede a su propia información.** Si intenta abrir un registro ajeno, el servidor lo rechaza. | HU-HUE-09, HU-HUE-15 |
| R-ROL-07 | **Los permisos se aplican en el backend** (Spring Security), no solo en la interfaz. | HU-EMP-01 |
| R-ROL-08 | **Cada rol usa solo sus pantallas.** Un empleado no entra a las secciones de otro rol (acceso denegado). El Administrador no usa las pantallas de Recepción ni de piso. | HU-EMP-01, índice de HU (sección 7) |
