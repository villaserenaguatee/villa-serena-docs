# 08 — Inventario, Turnos y Personal

> **Proyecto:** Property Management System (PMS) para Hoteles Boutique — Hotel ficticio "Villa Serena"
> **Estado:** 📝 Para revisión del equipo
> **Fecha:** 1 de octubre de 2026
> **Basado en:** 01 — Alcance, 04 — Historias de Usuario y 07 — Estados
> **Documentos relacionados:** 02 — Definición de Roles · 09 — Matriz de Permisos

---

## Índice

1. [Propósito](#1-propósito)
2. [Decisiones de diseño](#2-decisiones-de-diseño)
3. [Personal (Nivel 1)](#3-personal-nivel-1)
4. [Perfil del huésped (Nivel 1)](#4-perfil-del-huésped-nivel-1)
5. [Catálogo de artículos para el huésped (Nivel 1)](#5-catálogo-de-artículos-para-el-huésped-nivel-1)
6. [Turnos (Nivel 2)](#6-turnos-nivel-2)
7. [Inventario aislado (Nivel 2)](#7-inventario-aislado-nivel-2)

---

## 1. Propósito

Define los datos y el funcionamiento de **personal**, **perfil del huésped**, **catálogo de artículos**, **turnos** e **inventario**.

Estos módulos **no se conectan entre sí ni con la operación**: no hay consumo de insumos, ni repuestos, ni reportes de faltantes, y los turnos no afectan el acceso. Las reglas con ID están en el documento **10 — Reglas de Negocio**; aquí se describe el modelo.

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
| D8-01 | **Sin integración de inventario:** Room Service, limpieza, solicitudes y mantenimiento no descuentan stock. | D-20 |
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
| 5. Desactivar | El Administrador lo pasa a `INACTIVO` (no puede hacerlo consigo mismo). No puede iniciar sesión ni renovar su sesión; si tenía una abierta, le sirve hasta que venza su token de acceso (máximo 15 minutos). Se puede reactivar | HU-ADM-02 |

**Siempre queda un Administrador activo:** el Administrador no puede desactivarse ni cambiarse el rol a sí mismo, y quien desactiva es siempre un Administrador activo (HU-ADM-02).

### 3.3 Cuentas que existen desde el arranque

| Cuenta | Cómo se crea |
|---|---|
| Primer Administrador | Al arrancar el sistema, con variables de entorno (tarea técnica) |
| Usuarios de prueba de cada rol, con **dos Administradores** | Datos iniciales (Flyway), para la demostración y para no perder el acceso (V-04) |

### 3.4 Responsable de cada acción

Los cambios de estado de reservas, habitaciones, pedidos, solicitudes e incidencias guardan **quién** los hizo (documento 07, RG-EST-02). También guardan su responsable los cargos, los pagos registrados en Recepción y las incidencias reportadas. Los cambios en los datos de los empleados **no** se registran en un historial (X-03).

---

## 4. Perfil del huésped (Nivel 1)

| Campo | Descripción |
|---|---|
| Nombre completo | Obligatorio |
| Correo | Obligatorio; **identifica al huésped** |
| Teléfono | Obligatorio |
| Nacionalidad | Obligatoria |
| Tipo de documento | DPI o pasaporte (obligatorio) |
| Número de documento | Obligatorio |

- Los **mismos 6 datos** se piden en la web, en Recepción y en la API del canal (HU-HUE-05, HU-REC-01, HU-CM-01).
- Si ya existe un huésped con ese correo, la reserva se asocia a ese perfil **sin cambiar sus datos**.
- El huésped **no tiene contraseña**: entra a la app con un código de 6 dígitos enviado a su correo (HU-HUE-08).
- **Huéspedes adicionales:** se guardan en la reserva con nombre completo, tipo y número de documento y nacionalidad. **No son usuarios** y no entran a la app (HU-REC-02).

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

## 7. Inventario aislado (Nivel 2)

Solo se construye si da tiempo (HU-ADM-13). **No se conecta con ningún otro módulo.**

### 7.1 Producto

| Campo | Descripción |
|---|---|
| Nombre | Único |
| Categoría | Ej. Insumos de limpieza, Amenidades, Repuestos |
| Unidad de medida | Ej. unidad, litro, rollo |
| Stock mínimo | Umbral para la marca "Stock bajo" |
| Stock actual | Empieza en 0; solo cambia con movimientos; nunca queda negativo |
| Estado | `ACTIVO` o `INACTIVO` |

### 7.2 Movimientos

| Tipo | Efecto | Quién | Datos |
|---|---|---|---|
| Entrada | + stock | Administrador | Cantidad mayor que cero y motivo obligatorio |
| Salida | − stock | Administrador | Cantidad mayor que cero y motivo obligatorio. Si supera el stock actual, se rechaza |

Cada movimiento guarda fecha, hora, tipo, cantidad, motivo y responsable, y se puede ver el historial de cada producto.

### 7.3 Lista de productos

Muestra stock actual, stock mínimo y categoría. Los productos con stock **igual o menor** al mínimo llevan la marca **"Stock bajo"**. Se puede filtrar por categoría y por "solo stock bajo". No hay alertas ni reportes de faltantes.
