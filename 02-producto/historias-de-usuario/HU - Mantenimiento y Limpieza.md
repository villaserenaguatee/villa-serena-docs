# HU — Mantenimiento y Limpieza

> **Rol:** Mantenimiento/Limpieza (`MANTENIMIENTO_LIMPIEZA`), con área **Limpieza**, **Mantenimiento** o **Ambas**
> **Plataforma:** Web privada (pensada para usarse desde el teléfono del empleado)
> **Prefijo:** `HU-MYL`
> **Total de historias:** 8 (Nivel 1: 8 · Nivel 2: 0)
> **Referencias:** 01 — Alcance (sección G)

---

## Épica 1: Limpieza

### HU-MYL-01 — Ver las habitaciones pendientes de limpieza

| Plataforma | Épica | Alcance | Nivel | Tamaño | Estado |
|---|---|---|---|---|---|
| Web privada | Limpieza | ALC-MYL-01 | 1 | M | Pendiente |

**Historia**
- **Como** personal de Limpieza
- **Quiero** ver las habitaciones que necesitan limpieza, ordenadas por prioridad
- **Para** atender primero las que se necesitan hoy

**Criterios de aceptación**
1. Se listan las habitaciones en condición `Sucia` o `En limpieza`; las `Fuera de servicio` no aparecen.
2. Cada habitación muestra número, piso, condición y, si está `En limpieza`, el empleado a cargo.
3. Las habitaciones que tienen asignada una reserva con llegada hoy aparecen primero, con la etiqueta "Llegada hoy"; el resto se ordena por el tiempo que llevan `Sucia`.
4. La lista se actualiza sin recargar cuando cambia el estado de una habitación; al quedar `Limpia`, la habitación sale de la lista.
5. Las habitaciones ocupadas no aparecen aquí: solo se limpian cuando el huésped lo solicita (HU-MYL-04).
6. Solo la ven los empleados con área Limpieza o Ambas; un empleado solo de Mantenimiento recibe "Acceso denegado".

**Depende de:** HU-EMP-01
**Reglas relacionadas:** RN-LIM-004, RN-LIM-010, RN-LIM-011, RN-NOT-009 (documento 10)

---

### HU-MYL-02 — Iniciar o interrumpir la limpieza de una habitación

| Plataforma | Épica | Alcance | Nivel | Tamaño | Estado |
|---|---|---|---|---|---|
| Web privada | Limpieza | ALC-MYL-02 | 1 | S | Pendiente |

**Historia**
- **Como** personal de Limpieza
- **Quiero** indicar que empecé a limpiar una habitación, o que tuve que dejarla
- **Para** que Recepción y mis compañeros sepan quién la está atendiendo

**Criterios de aceptación**
1. Solo se puede iniciar la limpieza de una habitación `Sucia`.
2. Al iniciar, la habitación pasa a `En limpieza`, queda a nombre del empleado y se registran fecha, hora y empleado.
3. Si otro empleado ya la inició, el sistema rechaza la acción y muestra quién la está limpiando.
4. Solo el empleado a cargo puede interrumpir la limpieza: la habitación vuelve a `Sucia` y queda libre para cualquier compañero.
5. Recepción ve cada cambio en tiempo real (HU-REC-10).

**Depende de:** HU-MYL-01
**Reglas relacionadas:** RN-LIM-001, RN-NOT-009 (documento 10)

---

### HU-MYL-03 — Marcar la limpieza como terminada

| Plataforma | Épica | Alcance | Nivel | Tamaño | Estado |
|---|---|---|---|---|---|
| Web privada | Limpieza | ALC-MYL-02 | 1 | S | Pendiente |

**Historia**
- **Como** personal de Limpieza
- **Quiero** registrar que terminé de limpiar una habitación
- **Para** que quede lista para el siguiente huésped

**Criterios de aceptación**
1. Solo se puede terminar la limpieza de una habitación `En limpieza`, y solo el empleado a cargo puede hacerlo; si otro lo intenta, el sistema lo rechaza.
2. La habitación pasa a `Limpia` y se registran fecha, hora y empleado.
3. La habitación sale de la lista de pendientes.
4. Recepción ve el cambio en tiempo real y, si la habitación tiene una llegada hoy, ya puede hacer el check-in (HU-REC-12).

**Depende de:** HU-MYL-02
**Reglas relacionadas:** RN-HAB-005, RN-LIM-002, RN-NOT-009 (documento 10)

---

## Épica 2: Solicitudes

### HU-MYL-04 — Ver y tomar solicitudes de huéspedes

| Plataforma | Épica | Alcance | Nivel | Tamaño | Estado |
|---|---|---|---|---|---|
| Web privada | Solicitudes | ALC-MYL-03, ALC-TRA-04 | 1 | M | Pendiente |

**Historia**
- **Como** personal de Limpieza
- **Quiero** ver las solicitudes de limpieza y artículos de los huéspedes y tomar una
- **Para** atenderlas en orden y que nadie más trabaje en la misma

**Criterios de aceptación**
1. Se listan las solicitudes `Pendiente` y `En proceso`, ordenadas por antigüedad.
2. Cada solicitud muestra número de habitación, piso, tipo (limpieza o artículos), hora, estado y, si está `En proceso`, el empleado a cargo; las de artículos muestran cada artículo y su cantidad.
3. Cuando un huésped crea una solicitud, aparece en la lista sin recargar y con un aviso en pantalla.
4. Al tomar una solicitud `Pendiente`, pasa a `En proceso` a nombre del empleado y se registran fecha y hora.
5. Si otro empleado ya la tomó o el huésped la canceló, el sistema lo indica y actualiza la lista.
6. Tomar una solicitud de limpieza **no** cambia la condición de la habitación.
7. Solo la ven los empleados con área Limpieza o Ambas.

**Depende de:** HU-HUE-12, HU-HUE-13
**Reglas relacionadas:** RN-LIM-011, RN-LIM-013, RN-LIM-014, RN-NOT-008 (documento 10)

---

### HU-MYL-05 — Atender una solicitud

| Plataforma | Épica | Alcance | Nivel | Tamaño | Estado |
|---|---|---|---|---|---|
| Web privada | Solicitudes | ALC-MYL-03 | 1 | S | Pendiente |

**Historia**
- **Como** personal de Limpieza
- **Quiero** marcar como atendida la solicitud que tomé
- **Para** que el huésped sepa que ya se cumplió

**Criterios de aceptación**
1. Solo el empleado a cargo puede marcar como `Atendida` una solicitud `En proceso`; si otro lo intenta, el sistema lo rechaza.
2. Se registran fecha, hora y empleado, y la solicitud sale de la lista.
3. No se descuenta ningún inventario al entregar artículos.
4. El huésped ve el nuevo estado en la app y recibe una notificación push de solicitud atendida, sin datos personales (HU-HUE-17).
5. Si la solicitud ya fue cancelada (por ejemplo, porque el huésped hizo check-out), no se puede marcar `Atendida` y se muestra un mensaje claro.

**Depende de:** HU-MYL-04
**Reglas relacionadas:** RN-LIM-007, RN-LIM-015, RN-NOT-001 (documento 10)

---

## Épica 3: Mantenimiento

### HU-MYL-06 — Reportar un daño

| Plataforma | Épica | Alcance | Nivel | Tamaño | Estado |
|---|---|---|---|---|---|
| Web privada | Mantenimiento | ALC-MYL-07 | 1 | M | Pendiente |

**Historia**
- **Como** empleado del hotel (de cualquier área de Mantenimiento/Limpieza, o Recepción)
- **Quiero** reportar un daño que encontré en una habitación
- **Para** que un técnico lo repare

**Criterios de aceptación**
1. Se elige la habitación, se escribe una descripción y se indica si el daño impide usar la habitación; se puede adjuntar una foto opcional.
2. Sin habitación o sin descripción, el reporte no se guarda y se indica qué falta.
3. Se crea una incidencia `Reportada` con fecha, hora y empleado que la reportó, visible para los técnicos (HU-MYL-07) y el Administrador (HU-ADM-10).
4. Si impide usar la habitación y está `Libre`, pasa a `Fuera de servicio` y deja de contarse en la disponibilidad.
5. Si impide usar la habitación y está `Ocupada`, se muestra el indicador "Incidencia pendiente"; el huésped sigue en la misma habitación y se repara con él alojado. Al hacer check-out, la habitación pasa a `Fuera de servicio`.
6. Recepción ve el cambio de estado de la habitación en tiempo real.

**Depende de:** HU-EMP-01
**Reglas relacionadas:** RN-HAB-001, RN-HAB-002, RN-HAB-006, RN-MAN-001, RN-MAN-002, RN-MAN-007, RN-NOT-009 (documento 10)
**Notas técnicas:** es la misma funcionalidad que usa Recepción en HU-REC-17.

---

### HU-MYL-07 — Ver las incidencias y tomar una

| Plataforma | Épica | Alcance | Nivel | Tamaño | Estado |
|---|---|---|---|---|---|
| Web privada | Mantenimiento | ALC-MYL-09 | 1 | S | Pendiente |

**Historia**
- **Como** personal de Mantenimiento
- **Quiero** ver los daños reportados y tomar uno
- **Para** saber qué reparar y que quede claro quién lo está atendiendo

**Criterios de aceptación**
1. Se listan las incidencias `Reportada` y `En proceso`, ordenadas por antigüedad.
2. Cada incidencia muestra habitación, piso, descripción, foto (si tiene), si impide usar la habitación, si la habitación está ocupada, quién la reportó, fecha y, si está `En proceso`, el técnico a cargo.
3. Al tomar una incidencia `Reportada`, pasa a `En proceso` a nombre del técnico y se registran fecha y hora.
4. Si otro técnico ya la tomó, el sistema rechaza la acción y muestra quién la tiene.
5. Solo la ven y la toman los empleados con área Mantenimiento o Ambas; un empleado solo de Limpieza recibe "Acceso denegado".

**Depende de:** HU-MYL-06
**Reglas relacionadas:** RN-MAN-002, RN-MAN-007, RN-MAN-009, RN-MAN-013 (documento 10)
**Notas técnicas:** no hay asignación por el Administrador; el técnico toma la incidencia. Esta lista no es de tiempo real: se actualiza al abrirla o con un botón "Actualizar".

---

### HU-MYL-08 — Resolver una incidencia

| Plataforma | Épica | Alcance | Nivel | Tamaño | Estado |
|---|---|---|---|---|---|
| Web privada | Mantenimiento | ALC-MYL-09 | 1 | S | Pendiente |

**Historia**
- **Como** personal de Mantenimiento
- **Quiero** marcar como resuelta la incidencia que tomé
- **Para** registrar la reparación y que la habitación vuelva a usarse

**Criterios de aceptación**
1. Solo el técnico a cargo puede resolver una incidencia `En proceso`; si otro lo intenta, el sistema lo rechaza.
2. La descripción de la solución es obligatoria; sin ella, no se guarda.
3. La incidencia pasa a `Resuelta`, se registran fecha, hora y técnico, y ya no se puede modificar.
4. Si la habitación estaba `Fuera de servicio` y no tiene otra incidencia que impida su uso, pasa a `Sucia` y aparece en la lista de limpieza (HU-MYL-01); si tiene otra, sigue `Fuera de servicio`.
5. Si la habitación está `Ocupada` y no tiene otra incidencia que impida su uso, se quita el indicador "Incidencia pendiente".
6. El Administrador ve la incidencia resuelta con su solución (HU-ADM-10).

**Depende de:** HU-MYL-07
**Reglas relacionadas:** RN-HAB-003, RN-MAN-002, RN-MAN-005, RN-MAN-006, RN-MAN-007, RN-MAN-009, RN-MAN-010 (documento 10)
