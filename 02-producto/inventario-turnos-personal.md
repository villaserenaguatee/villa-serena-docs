# Inventario, Turnos y Personal

> Reconciliación 22/10/2026: [decisiones posteriores, estado implementado y límites del contrato](reconciliacion-frontend-20261022.md). Los estados «Pendiente» anteriores no certifican implementación; portal web y Android coexisten. No se reintroducen campos retirados del MVP.

Define el modelo para el personal del hotel, la gestión de turnos laborales y el catálogo de artículos e inventario compartido.

---

## Índice

1. [Propósito](#1-propósito)
2. [Decisiones de diseño](#2-decisiones-de-diseño)
3. [Personal (Nivel 1)](#3-personal-nivel-1)
4. [Perfil del huésped (Nivel 1)](#4-perfil-del-huésped-nivel-1)
5. [Catálogo de artículos para el huésped (Nivel 1)](#5-catálogo-de-artículos-para-el-huésped-nivel-1)
6. [Turnos (Nivel 2)](#6-turnos-nivel-2)
7. [Inventario compartido (Nivel 2)](#7-inventario-compartido-nivel-2)

---

## 1. Propósito

Define los datos y el funcionamiento de **personal**, **perfil del huésped**, **catálogo de artículos**, **turnos** e **inventario**.

El inventario comparte existencias con compras y repuestos de mantenimiento. Room Service, limpieza y solicitudes no descuentan automáticamente; los turnos no afectan el acceso. Las reglas con ID están en el documento **10 — Reglas de Negocio**; aquí se describe el modelo.

| Módulo | Nivel | Historias |
|---|---|---|
| Personal | 1 | HU-ADM-01, HU-ADM-02, HU-EMP-01, HU-EMP-02 |
| Perfil del huésped | 1 | HU-REC-01, HU-REC-02, HU-HUE-05, HU-HUE-08, HU-CM-01 |
| Catálogo de artículos | 1 (sin pantalla) | HU-HUE-13 |
| Turnos | 2 | HU-ADM-12 |
| Inventario | 2 | HU-ADM-13 |

---

## 2. Decisiones de diseño

| # | Decisión | Origen |
|---|---|---|
| D8-01 | **Inventario compartido:** compras y repuestos usan las mismas existencias; Room Service, limpieza y solicitudes no descuentan automáticamente. | D-20 |
| D8-02 | **Turnos e inventario son Nivel 2:** se construyen solo si da tiempo, en su versión mínima. Falta confirmar con el ingeniero si son obligatorios (Alcance, sección 9). | Alcance, sección 2 |
| D8-03 | **Los turnos son informativos:** no bloquean el acceso ni sugieren a quién asignar trabajo. | HU-ADM-12 |
| D8-04 | **No se valida el trabajo en curso al desactivar a un empleado.** No es necesario para funcionar ni para presentar. | Índice de HU, sección 7 |
| D8-05 | **El catálogo de artículos se carga en los datos iniciales;** no hay pantalla para administrarlo. | HU-HUE-13 |

---

## 3. Personal (Nivel 1)

### 3.1 Datos del empleado

| Campo | Descripción |
|---|---|
| Nombre completo | Se registra al crear la cuenta |
| Correo | Único entre los empleados; es su usuario |
| Teléfono | Se registra al crear la cuenta |
| Rol | `ADMIN`, `RECEPCION`, `ROOM_SERVICE` o `MANTENIMIENTO_LIMPIEZA` (uno solo) |
| Área | Solo para `MANTENIMIENTO_LIMPIEZA`: `LIMPIEZA`, `MANTENIMIENTO` o `AMBAS` (obligatoria) |
| Estado | `ACTIVO` o `INACTIVO` |
| Contraseña | Guardada con hash (BCrypt); nunca en texto plano |
| Contraseña temporal | Indica si debe cambiarla en el siguiente acceso |

Se editan nombre, teléfono, rol y área (HU-ADM-02).

### 3.2 Ciclo de la cuenta

| Paso | Qué pasa | Historias |
|---|---|---|
| 1. Crear | El Administrador registra al empleado. El sistema genera una **contraseña temporal** y se la muestra **una sola vez** (con opción de copiar). **No se envía correo**: la entrega es personal. El empleado queda `ACTIVO` | HU-ADM-01 |
| 2. Primer acceso | Entra con la contraseña temporal y el sistema le **exige cambiarla** antes de usar cualquier otra sección (al menos 8 caracteres, con una letra y un número, distinta de la actual) | HU-EMP-01, HU-EMP-02 |
| 3. Uso normal | Correo + contraseña. Tras **5 intentos fallidos seguidos**, la cuenta se bloquea **15 minutos**. Puede cambiar su contraseña cuando quiera | HU-EMP-01, HU-EMP-02 |
| 4. Olvidó su contraseña | No hay "olvidé mi contraseña": el Administrador la **restablece**, se genera otra contraseña temporal y la anterior deja de funcionar | HU-ADM-02 |
| 5. Desactivar | El Administrador lo pasa a `INACTIVO` (no puede hacerlo consigo mismo). No puede iniciar sesión ni renovar su sesión; La política anterior permitía conservar el acceso hasta vencer el JWT; es un antecedente histórico. El API inspeccionado comprueba la vigencia del empleado en cada petición. La reconciliación de esta política sigue pendiente en API #78, según RN-PER-014, sin debilitar los controles implementados. Se puede reactivar | HU-ADM-02 |

**Siempre queda un Administrador activo:** el Administrador no puede desactivarse ni cambiarse el rol a sí mismo, y quien desactiva es siempre un Administrador activo (HU-ADM-02).

### 3.3 Cuentas que existen desde el arranque

| Cuenta | Cómo se crea |
|---|---|
| Primer Administrador | Requiere habilitar explícitamente el bootstrap, deshabilitado por defecto; crea solo el primer ADMIN, exige cambio de contraseña y no sustituye cuentas existentes |
| Usuarios de prueba de cada rol, con **dos Administradores** | **Antecedente histórico (V-04), sustituido:** se propuso cargarlos mediante Flyway. El procedimiento vigente separa las migraciones del esquema de los fixtures: estos se cargan explícitamente después del arranque, solo en una instancia local con tablas de negocio vacías y con el bootstrap apagado; no se crean usuarios de demostración automáticamente |

El procedimiento y sus límites están en [ADR-007](../03-arquitectura/adr/ADR-007-almacenamiento-r2-s3.md) y su [guía de arranque](../04-guias-y-referencia/arranque-local.md). La documentación no ejecuta cargas ni acredita aprovisionamiento.

### 3.4 Responsable de cada acción

Los cambios de estado de reservas, habitaciones, pedidos, solicitudes e incidencias guardan **quién** los hizo (documento 07, RG-EST-02). También guardan su responsable los cargos, los pagos registrados en Recepción y las incidencias reportadas. Los cambios en los datos de los empleados **no** se registran en un historial (X-03).

---

## 4. Perfil del huésped (Nivel 1)

| Campo | Descripción |
|---|---|
| Nombre completo | Obligatorio |
| Correo | Obligatorio; **identifica al huésped** |
| Teléfono | Obligatorio |
| Nacionalidad | Opcional en el contrato; no se solicita en el formulario MVP. Los datos históricos se conservan |
| Tipo de documento | DPI en el formulario MVP; pasaporte conservado para lectura histórica |
| Número de documento | Obligatorio |

- Los datos se validan según contrato y origen; el formulario MVP solicita nombre, correo, teléfono y DPI, sin nacionalidad ni pasaporte (HU-HUE-05, HU-REC-01, HU-CM-01).
- Si ya existe un huésped con ese correo, la reserva se asocia a ese perfil **sin cambiar sus datos**.
- El huésped **no tiene contraseña**: entra a la app con un código de 6 dígitos enviado a su correo (HU-HUE-08).
- **Huéspedes adicionales:** se guardan en la reserva con nombre completo y DPI en el MVP; documentos históricos conservados y nacionalidad opcional en el API. **No son usuarios** y no entran a la app (HU-REC-02).

**Usuarios del sistema (resumen):**

| Tipo | Autenticación | Token |
|---|---|---|
| Empleado | Correo + contraseña (BCrypt) | JWT con su rol y, si aplica, su área. Acceso de 15 minutos y refresh de 7 días que se renueva en cada uso (documento 14); en la web, a través del BFF |
| Huésped | Correo + código OTP | JWT con rol `HUESPED`. Acceso de 15 minutos y refresh de 7 días que se renueva en cada uso |

---

## 5. Catálogo de artículos para el huésped (Nivel 1)

Es la lista de lo que el huésped puede pedir desde la app (toallas, almohadas, cobijas, papel higiénico, jabón, etc.).

| Campo | Descripción |
|---|---|
| Nombre | Ej. "Toalla de baño" |
| Cantidad máxima por solicitud | Ej. 4; no se acepta una cantidad mayor |

- Se carga en los **datos iniciales**; no hay pantalla para administrarlo (HU-HUE-13).
- **No está vinculado al inventario:** entregar artículos no descuenta stock (HU-HUE-13, HU-MYL-05).

---

## 6. Turnos (Nivel 2)

Solo se construye si da tiempo (HU-ADM-12).

### 6.1 Turno

| Campo | Descripción |
|---|---|
| Nombre | Ej. Mañana, Tarde, Noche |
| Hora de inicio y hora de fin | Puede cruzar la medianoche (ej. 22:00 a 06:00) |
| Estado | `ACTIVO` o `INACTIVO`; se puede editar y desactivar |

### 6.2 Asignación

| Campo | Descripción |
|---|---|
| Empleado | `ACTIVO` y que no sea Administrador |
| Fecha | Una o varias fechas |
| Turno | Un turno |

- Un empleado no puede tener dos turnos que se traslapen.
- Se puede quitar una asignación.
- Hay una **vista semanal** con los empleados y sus turnos por día.
- Los turnos son **solo informativos**: no limitan el acceso ni aplican otras reglas.

---

## 7. Inventario compartido (Nivel 2)

Inventario, compras y repuestos de mantenimiento usan los mismos insumos. Se conserva el funcionamiento de API y web mediante docs #21; no cambia su clasificación de Nivel 2.

### 7.1 Insumos

Cada insumo tiene UUID, versión, nombre, categoría, unidad, stock, stock mínimo y costo unitario. La creación admite stock inicial no negativo; al actualizar no se puede modificar directamente. No se exige nombre único ni existe desactivación. Campos adicionales como vencimiento se conservan; la API no los valida específicamente.

### 7.2 Cambios de existencias

| Operación | Efecto | Quién |
|---|---|---|
| Entrada manual | Suma cantidad positiva, con motivo | Administrador |
| Salida o merma manual | Resta cantidad positiva, con motivo; rechaza stock insuficiente | Administrador |
| Compra registrada, pagada o pendiente | Suma la cantidad al insumo; no modifica su costo unitario | Administrador |
| Repuestos de una orden en proceso | Descuenta el incremento del consumo o devuelve su reducción; rechaza stock insuficiente | Técnico a cargo de la orden o Administrador |

Los repuestos manuales identificados con `manual-` no afectan existencias. Room Service, limpieza y solicitudes no descuentan automáticamente.

Ejemplo: un insumo empieza con 0 focos; registrar una compra de 10 deja 10; usar 2 en una orden deja 8; registrar una merma de 1 deja 7.

### 7.3 Consulta e historial

La web calcula stock bajo cuando `stock <= stockMinimo` y filtra por categoría o esa marca. Mantenimiento puede consultar insumos; solo Administración registra insumos, compras y movimientos manuales.

La lista de movimientos contiene únicamente los manuales, con fecha UTC, tipo, cantidad, motivo e insumo. Compras y repuestos modifican stock y auditoría, pero no crean entradas en esa lista. El responsable queda en auditoría; la respuesta no genera `responsable` ni `stockResultante`. No se promete un historial único de todas las variaciones.

Los movimientos son inmutables. Un reenvío idéntico con el mismo UUID y versión 0 devuelve el original sin aplicar el stock de nuevo.

Las rutas, DTO, validaciones, errores y adopción se detallan en el [contrato de inventario](../03-arquitectura/inventario-contrato.md).
