# HU — Administrador

> **Rol:** Administrador (`ADMIN`)
> **Plataforma:** Web privada
> **Prefijo:** `HU-ADM`
> **Total de historias:** 13 (Nivel 1: 10 · Nivel 2: 3)
> **Referencias:** 01 — Alcance (sección 5.C)

Las historias comunes a todo el personal (iniciar sesión y cambiar la contraseña temporal) están en **"HU - Personal del Hotel"**. El Administrador usa **solo sus pantallas** y el canal simulado (HU-CM-03); no usa las pantallas de Recepción ni de piso (R-02).

---

## Épica 1: Personal

### HU-ADM-01 — Crear un empleado

| Plataforma | Épica | Alcance | Nivel | Tamaño | Estado |
|---|---|---|---|---|---|
| Web privada | Personal | ALC-ADM-01, ALC-ADM-02 | 1 | M | Pendiente |

**Historia**
- **Como** administrador
- **Quiero** crear la cuenta de un nuevo empleado
- **Para** que pueda entrar al sistema con el rol que le corresponde

**Criterios de aceptación**
1. Se registran nombre completo, correo, teléfono y rol (Administrador, Recepcionista, Room Service o Mantenimiento/Limpieza).
2. Si el rol es Mantenimiento/Limpieza, el área es obligatoria: Limpieza, Mantenimiento o Ambas. Para los demás roles no se pide área.
3. El correo debe ser único: si ya existe otro empleado con ese correo, se muestra un error y no se crea la cuenta.
4. Al guardar, el sistema genera una contraseña temporal y se la muestra al Administrador **una sola vez** (con opción de copiarla) para que se la entregue al empleado. Después no se puede volver a consultar.
5. No se envía ningún correo al empleado: la entrega de la contraseña temporal es personal.
6. El empleado queda `Activo` y, en su primer acceso, el sistema le exige cambiar la contraseña temporal (HU-EMP-02).

**Depende de:** Ninguna
**Reglas relacionadas:** RN-PER-001, RN-PER-007, RN-PER-008, RN-PER-009 (documento 10)
**Notas técnicas:** la contraseña temporal se guarda con hash, igual que cualquier contraseña; nunca en texto plano.

---

### HU-ADM-02 — Editar, desactivar o restablecer la contraseña de un empleado

| Plataforma | Épica | Alcance | Nivel | Tamaño | Estado |
|---|---|---|---|---|---|
| Web privada | Personal | ALC-ADM-01 | 1 | M | Pendiente |

**Historia**
- **Como** administrador
- **Quiero** modificar los datos de un empleado, desactivarlo o darle una nueva contraseña temporal
- **Para** mantener actualizado el personal del hotel y ayudar a quien olvidó su contraseña

**Criterios de aceptación**
1. Se listan los empleados con nombre, correo, rol, área y estado (`Activo` / `Inactivo`); se puede filtrar por rol y por estado.
2. Se pueden editar nombre, teléfono, rol y área, con la misma regla de área de HU-ADM-01.
3. Los empleados **no se eliminan**: se desactivan (`Inactivo`) o se reactivan (`Activo`). Su nombre se conserva en todos los registros históricos.
4. Un empleado `Inactivo` no puede iniciar sesión ni renovar su sesión. Si tenía una sesión abierta, puede seguir usándola hasta que venza su token de acceso (máximo 15 minutos); no se revisa su estado en cada acción.
5. El Administrador no puede desactivarse ni cambiarse el rol a sí mismo. Como quien desactiva es siempre un Administrador activo, nunca se queda el sistema sin Administrador.
6. **Restablecer contraseña:** genera una nueva contraseña temporal que se muestra al Administrador una sola vez; la contraseña anterior deja de funcionar y el empleado debe cambiarla en su siguiente acceso (HU-EMP-02).

**Depende de:** HU-ADM-01
**Reglas relacionadas:** RN-PER-001, RN-PER-002, RN-PER-005, RN-PER-007, RN-PER-010, RN-PER-014, RN-SEG-005 (documento 10)

---

## Épica 2: Catálogos

### HU-ADM-03 — Gestionar tipos de habitación

| Plataforma | Épica | Alcance | Nivel | Tamaño | Estado |
|---|---|---|---|---|---|
| Web privada | Catálogos | ALC-ADM-06 | 1 | M | Pendiente |

**Historia**
- **Como** administrador
- **Quiero** crear y editar los tipos de habitación
- **Para** mostrarlos en la web y calcular sus precios

**Criterios de aceptación**
1. Se registran nombre, descripción, capacidad máxima de huéspedes y precio base por noche en quetzales (con impuestos incluidos).
2. Se pueden subir varias fotos y elegir la foto principal.
3. El nombre es obligatorio y no se repite; la capacidad debe ser al menos 1 y el precio base mayor a cero. Si no se cumple, se muestra un error y no se guarda.
4. Cambiar el precio base solo afecta las reservas nuevas; las reservas existentes conservan su precio.
5. Un tipo se puede desactivar: deja de mostrarse en la web pública y no admite reservas nuevas, pero conserva sus reservas existentes.
6. Los cambios se reflejan de inmediato en el catálogo de la web pública (HU-HUE-02).

**Depende de:** Ninguna
**Reglas relacionadas:** RN-HAB-009, RN-HAB-010, RN-TAR-004, RN-TAR-007 (documento 10)

---

### HU-ADM-04 — Gestionar habitaciones

| Plataforma | Épica | Alcance | Nivel | Tamaño | Estado |
|---|---|---|---|---|---|
| Web privada | Catálogos | ALC-ADM-06 | 1 | S | Pendiente |

**Historia**
- **Como** administrador
- **Quiero** registrar las habitaciones físicas del hotel
- **Para** que puedan reservarse y asignarse

**Criterios de aceptación**
1. Se registran número de habitación, piso y tipo de habitación (activo).
2. El número de habitación es único; si ya existe, se muestra un error y no se guarda.
3. Una habitación nueva se crea `Libre` + `Limpia` y suma de inmediato a la disponibilidad de su tipo.
4. Se puede cambiar el tipo de una habitación solo si no tiene reservas activas asignadas (`Pendiente de pago`, `Confirmada` o `En estadía`).
5. Una habitación se puede desactivar solo si no está `Ocupada` y no tiene reservas activas asignadas. Si no se cumple, se muestra el motivo.
6. Una habitación desactivada no cuenta para la disponibilidad ni aparece para asignar; se puede reactivar.

**Depende de:** HU-ADM-03
**Reglas relacionadas:** RN-HAB-007, RN-HAB-011, RN-HAB-012 (documento 10)

---

### HU-ADM-05 — Gestionar el menú de Room Service

| Plataforma | Épica | Alcance | Nivel | Tamaño | Estado |
|---|---|---|---|---|---|
| Web privada | Catálogos | ALC-ADM-07 | 1 | M | Pendiente |

**Historia**
- **Como** administrador
- **Quiero** administrar las categorías e ítems del menú de Room Service
- **Para** que los huéspedes y el personal vean opciones y precios correctos

**Criterios de aceptación**
1. Se gestionan categorías (ej. Desayunos, Platos fuertes, Bebidas).
2. Cada ítem tiene nombre, descripción, categoría, precio en quetzales y foto opcional. El precio debe ser mayor a cero; si no, se muestra un error y no se guarda.
3. Cada ítem está `Disponible` o `Agotado`. Room Service puede marcarlo `Agotado` (HU-RS-05), pero **solo el Administrador** lo reactiva a `Disponible`.
4. Los ítems `Agotado` se ven en la app, pero no se pueden pedir (HU-HUE-10).
5. Un ítem se puede desactivar para que deje de aparecer en el menú.
6. Cambiar el precio no afecta los pedidos ya creados: el precio se congela al pedir.

**Depende de:** Ninguna
**Reglas relacionadas:** RN-RS-005, RN-RS-006, RN-RS-008, RN-RS-013 (documento 10)

---

## Épica 3: Tarifas dinámicas

**Cálculo del precio por noche** (lo hace el servidor y queda fijo al crear la reserva):

```
Precio de la noche = Precio base del tipo
                   × (1 + % de la temporada vigente)
                   × (1 + % de fin de semana, si la noche es viernes o sábado)
                   → redondeado a 2 decimales

Total de la estadía = suma de los precios de cada noche
```

Ejemplo: precio base Q500.00, temporada alta +20 %, noche de sábado +10 % → Q500.00 × 1.20 × 1.10 = **Q660.00**.

### HU-ADM-06 — Gestionar temporadas

| Plataforma | Épica | Alcance | Nivel | Tamaño | Estado |
|---|---|---|---|---|---|
| Web privada | Tarifas dinámicas | ALC-ADM-09 | 1 | M | Pendiente |

**Historia**
- **Como** administrador
- **Quiero** definir temporadas con un ajuste de precio
- **Para** cobrar más en temporada alta y menos en temporada baja

**Criterios de aceptación**
1. Una temporada tiene nombre, fecha de inicio, fecha de fin y porcentaje de ajuste (positivo o negativo).
2. La temporada se aplica a todos los tipos de habitación o solo a los tipos seleccionados.
3. La fecha de fin no puede ser anterior a la de inicio, y el ajuste debe ser mayor a −100 % (el precio nunca queda en cero ni negativo). Si no se cumple, se muestra un error.
4. No se permiten dos temporadas que se traslapen para un mismo tipo de habitación; se muestra cuál es la temporada en conflicto.
5. Se pueden editar y eliminar temporadas. Los cambios solo afectan reservas nuevas; las existentes conservan su precio.
6. El precio que ven el cliente (HU-HUE-04) y Recepción usa la temporada vigente de cada noche.

**Depende de:** HU-ADM-03
**Reglas relacionadas:** RN-TAR-003, RN-TAR-004, RN-TAR-007, RN-TAR-011 (documento 10)

---

### HU-ADM-07 — Configurar el ajuste de fin de semana

| Plataforma | Épica | Alcance | Nivel | Tamaño | Estado |
|---|---|---|---|---|---|
| Web privada | Tarifas dinámicas | ALC-ADM-09 | 1 | S | Pendiente |

**Historia**
- **Como** administrador
- **Quiero** definir un porcentaje de ajuste para las noches de fin de semana
- **Para** reflejar la mayor demanda de esos días

**Criterios de aceptación**
1. Se define un porcentaje de ajuste por tipo de habitación; por defecto es 0 %.
2. El ajuste se aplica solo a las noches de viernes y sábado.
3. Se combina con el ajuste de temporada según la fórmula de esta épica.
4. El ajuste debe ser mayor a −100 %; si no, se muestra un error y no se guarda.
5. Los cambios solo afectan reservas nuevas.

**Depende de:** HU-ADM-03
**Reglas relacionadas:** RN-TAR-002, RN-TAR-004, RN-TAR-007, RN-TAR-012 (documento 10)

---

## Épica 4: Configuración, indicadores y supervisión

### HU-ADM-08 — Configurar los datos del hotel y de facturación

| Plataforma | Épica | Alcance | Nivel | Tamaño | Estado |
|---|---|---|---|---|---|
| Web privada | Configuración, indicadores y supervisión | ALC-ADM-12 | 1 | M | Pendiente |

**Historia**
- **Como** administrador
- **Quiero** configurar los datos generales y fiscales del hotel
- **Para** que la web, la app, los correos y las facturas muestren información correcta

**Criterios de aceptación**
1. Se configuran nombre, descripción, dirección, teléfono, correo de contacto y fotos del hotel; los cambios se reflejan de inmediato en la web pública, la app y los correos.
2. Se editan los datos fiscales: nombre comercial, razón social, NIT del hotel y dirección fiscal. Todos son obligatorios; el NIT se valida con su dígito verificador (el último dígito puede ser "K"). Si un campo queda vacío o el NIT no es válido, se muestra un error y no se guarda.
3. La **serie fija** (ej. "VS-A") y el número inicial del correlativo **no se editan en esta pantalla**: se cargan en los datos iniciales.
4. El texto de la política de cancelación que ven los clientes se genera a partir de la regla (reembolso total con 48 horas o más antes de las 15:00 del día de llegada; sin reembolso con menos) y no se edita libremente.
5. Cambiar los datos del hotel no altera las facturas ya emitidas.

**Depende de:** Ninguna
**Reglas relacionadas:** RN-FAC-004, RN-FAC-009, RN-FAC-010, RN-FAC-011 (documento 10)
**Notas técnicas:** todos los datos de esta pantalla (incluidos los fiscales, la serie y el número inicial) vienen ya cargados en los datos iniciales, así que la facturación funciona desde el primer arranque. Las horas de check-in (15:00) y check-out (12:00) son **fijas** (constantes del sistema), no se configuran (R-01). El Wi-Fi para huéspedes es Nivel 2 y se configura en HU-ADM-11.

---

### HU-ADM-09 — Ver los indicadores básicos

| Plataforma | Épica | Alcance | Nivel | Tamaño | Estado |
|---|---|---|---|---|---|
| Web privada | Configuración, indicadores y supervisión | ALC-ADM-10 | 1 | M | Pendiente |

**Historia**
- **Como** administrador
- **Quiero** ver los indicadores principales del hotel
- **Para** conocer rápidamente cómo va la operación

**Criterios de aceptación**
1. Se muestran **3 tarjetas**: ocupación de hoy, ingresos y reservas por canal.
2. **Ocupación de hoy:** habitaciones `Ocupada` / habitaciones activas, en porcentaje. Siempre corresponde al día de hoy.
3. **Ingresos:** suma de los pagos `Aprobado` del rango, en quetzales. Un pago reembolsado pasa a `Reembolsado` y deja de sumar; no se resta aparte.
4. **Reservas por canal:** número de reservas creadas en el rango por canal de origen (Directo web, Recepción, Booking, Expedia), sin importar su estado (se cuentan también las canceladas).
5. Se puede elegir el rango de fechas para ingresos y reservas por canal; por defecto, el mes actual. Si la fecha de fin es anterior a la de inicio, se muestra un error.
6. Si no hay datos en el rango, las tarjetas muestran 0 sin error.
7. Solo el Administrador puede ver esta pantalla; los demás roles reciben acceso denegado.

**Depende de:** Ninguna
**Reglas relacionadas:** RN-IND-001, RN-IND-002, RN-IND-003, RN-IND-004, RN-TAR-009 (documento 10)

---

### HU-ADM-10 — Consultar las incidencias de mantenimiento

| Plataforma | Épica | Alcance | Nivel | Tamaño | Estado |
|---|---|---|---|---|---|
| Web privada | Configuración, indicadores y supervisión | ALC-ADM-11 | 1 | S | Pendiente |

**Historia**
- **Como** administrador
- **Quiero** consultar las incidencias de mantenimiento y su estado
- **Para** saber qué daños hay en el hotel y cómo avanza su reparación

**Criterios de aceptación**
1. Se listan las incidencias con habitación, descripción, si impide el uso, estado (`Reportada`, `En proceso` o `Resuelta`), quién la reportó, técnico a cargo (si ya la tomó), fecha de reporte y fecha de resolución.
2. Por defecto se muestran primero las incidencias `Reportada` y `En proceso`, de la más reciente a la más antigua.
3. Se puede filtrar por estado, habitación y técnico.
4. En el detalle se ven la foto (si la hay), la descripción de la solución (si está `Resuelta`) y el historial de cambios con fecha, hora y responsable.
5. La pantalla es **de solo lectura**: no tiene acciones para cambiar el estado de las incidencias.
6. Si no hay incidencias con los filtros elegidos, se muestra el mensaje "Sin incidencias".

**Depende de:** HU-MYL-06, HU-MYL-07, HU-MYL-08
**Reglas relacionadas:** RN-MAN-007, RN-MAN-012, RN-MAN-013 (documento 10)

---

## Épica 5: Si da tiempo (Nivel 2)

> Estas historias se construyen **solo** cuando todo el Nivel 1 esté terminado. Pendiente de confirmar con el ingeniero si turnos e inventario son obligatorios (Alcance, sección 9).

### HU-ADM-11 — Gestionar amenidades y el Wi-Fi

| Plataforma | Épica | Alcance | Nivel | Tamaño | Estado |
|---|---|---|---|---|---|
| Web privada | Si da tiempo (Nivel 2) | ALC-ADM-08 | 2 | S | Pendiente |

**Historia**
- **Como** administrador
- **Quiero** administrar las amenidades del hotel y los datos del Wi-Fi
- **Para** que los huéspedes los consulten en la app

**Criterios de aceptación**
1. Cada amenidad tiene nombre, descripción, foto, horario y ubicación. El nombre es obligatorio; sin él no se guarda.
2. Se puede definir el orden en que aparecen.
3. Una amenidad se puede activar o desactivar; las inactivas no se muestran en la app.
4. Se configuran el nombre de la red Wi-Fi y la contraseña para huéspedes.
5. Los cambios se ven en la app (HU-HUE-18) sin publicar una nueva versión de la app.

**Depende de:** Ninguna
**Reglas relacionadas:** RN-APP-012 (documento 10)

---

### HU-ADM-12 — Definir y asignar turnos

| Plataforma | Épica | Alcance | Nivel | Tamaño | Estado |
|---|---|---|---|---|---|
| Web privada | Si da tiempo (Nivel 2) | ALC-ADM-03 | 2 | M | Pendiente |

**Historia**
- **Como** administrador
- **Quiero** definir los turnos del hotel y asignarlos a los empleados por fecha
- **Para** saber quién trabaja cada día

**Criterios de aceptación**
1. Se crea un turno con nombre (ej. Mañana, Tarde, Noche), hora de inicio y hora de fin; un turno puede cruzar la medianoche (ej. 22:00 a 06:00).
2. Se pueden editar y desactivar turnos.
3. Se asigna un turno a un empleado `Activo` para una o varias fechas; también se puede quitar una asignación.
4. No se pueden asignar turnos a empleados `Inactivo` ni a Administradores; se muestra un error.
5. Un empleado no puede tener dos turnos que se traslapen; si ocurre, se muestra un error y no se guarda.
6. Se muestra una vista semanal con los empleados y sus turnos por día.
7. Los turnos son solo informativos: no limitan el acceso al sistema ni aplican otras reglas.

**Depende de:** HU-ADM-01
**Reglas relacionadas:** RN-TUR-001, RN-TUR-002, RN-TUR-003, RN-TUR-005 (documento 10)

---

### HU-ADM-13 — Gestionar el inventario

| Plataforma | Épica | Alcance | Nivel | Tamaño | Estado |
|---|---|---|---|---|---|
| Web privada | Si da tiempo (Nivel 2) | ALC-ADM-04 | 2 | M | Pendiente |

**Historia**
- **Como** administrador
- **Quiero** registrar los productos del hotel y sus entradas y salidas
- **Para** controlar su existencia y saber cuándo reponerlos

**Criterios de aceptación**
1. Cada producto tiene nombre (único), categoría (ej. Insumos de limpieza, Amenidades, Repuestos), unidad de medida y stock mínimo. El stock inicial es cero.
2. Una **entrada** aumenta el stock y una **salida** lo disminuye; ambas piden cantidad mayor a cero y un motivo obligatorio.
3. El stock nunca queda negativo: si una salida supera el stock actual, se muestra un error y no se registra.
4. Cada movimiento registra fecha, hora, tipo, cantidad, motivo y responsable; se puede ver el historial de cada producto.
5. Se listan los productos con stock actual, stock mínimo y categoría. Los que tienen stock igual o menor al mínimo muestran la marca **"Stock bajo"**; se puede filtrar por categoría y por "solo stock bajo".
6. Un producto se puede desactivar.
7. El inventario es **aislado**: Room Service, limpieza, solicitudes y mantenimiento no modifican el stock; solo cambia con los movimientos manuales del Administrador.

**Depende de:** Ninguna
**Reglas relacionadas:** RN-INV-001, RN-INV-002, RN-INV-003, RN-INV-005, RN-INV-010, RN-INV-011 (documento 10)
