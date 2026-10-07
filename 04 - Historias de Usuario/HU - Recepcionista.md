# HU — Recepcionista

> **Rol:** Recepcionista (`RECEPCION`). Estas pantallas son solo de Recepción: el Administrador usa únicamente las suyas (R-02).
> **Plataforma:** Web privada
> **Prefijo:** `HU-REC`
> **Total de historias:** 17 (Nivel 1: 16 · Nivel 2: 1)
> **Referencias:** 01 — Alcance (sección B; ALC-MYL-07 de la sección G)

---

## Épica 1: Huéspedes y reservas

### HU-REC-01 — Registrar un huésped

| Plataforma | Épica | Alcance | Nivel | Tamaño | Estado |
|---|---|---|---|---|---|
| Web privada | Huéspedes y reservas | ALC-REC-01 | 1 | S | Pendiente |

**Historia**
- **Como** recepcionista
- **Quiero** registrar los datos personales de un huésped
- **Para** poder asociarlo a sus reservas

**Criterios de aceptación**
1. Se registran nombre completo, tipo de documento (DPI o pasaporte), número de documento, teléfono, correo y nacionalidad.
2. Todos los campos son obligatorios, incluido el correo, que debe tener un formato válido (a ese correo llegan la confirmación de la reserva, el código de acceso a la app y la factura).
3. El huésped se identifica por su correo: si ya existe un huésped con ese correo, se avisa y se usa el perfil existente; no se crea otro.
4. El huésped registrado queda disponible para asociarlo a reservas (HU-REC-04).

**Depende de:** Ninguna
**Reglas relacionadas:** RN-RES-019 (documento 10)

---

### HU-REC-02 — Registrar huéspedes adicionales

| Plataforma | Épica | Alcance | Nivel | Tamaño | Estado |
|---|---|---|---|---|---|
| Web privada | Huéspedes y reservas | ALC-REC-01 | 1 | S | Pendiente |

**Historia**
- **Como** recepcionista
- **Quiero** registrar a las demás personas que ocuparán la habitación
- **Para** tener un registro completo de los huéspedes alojados

**Criterios de aceptación**
1. Desde el detalle de una reserva `Confirmada` o `En estadía` se pueden agregar huéspedes adicionales con nombre completo, tipo y número de documento y nacionalidad.
2. El total de huéspedes registrados (principal + adicionales) no puede superar el número de huéspedes de la reserva; si se intenta, se muestra un mensaje y no se guarda.
3. Los huéspedes adicionales quedan asociados a la reserva, pero no tienen acceso a la app (solo el huésped principal entra con su correo).
4. Los huéspedes adicionales se muestran en el detalle de la reserva y en el check-in para verificarlos.

**Depende de:** HU-REC-04
**Reglas relacionadas:** RN-APP-004, RN-RES-020 (documento 10)
**Notas técnicas:** como las reservas no se modifican, el número de huéspedes de la reserva no cambia al registrar adicionales.

---

### HU-REC-03 — Consultar disponibilidad

| Plataforma | Épica | Alcance | Nivel | Tamaño | Estado |
|---|---|---|---|---|---|
| Web privada | Huéspedes y reservas | ALC-REC-03 | 1 | S | Pendiente |

**Historia**
- **Como** recepcionista
- **Quiero** consultar qué tipos de habitación están disponibles para unas fechas
- **Para** ofrecer opciones al huésped que llama o llega al hotel

**Criterios de aceptación**
1. Se ingresan fecha de entrada, fecha de salida y número de huéspedes.
2. La estadía debe ser de 1 a 30 noches, no puede incluir fechas pasadas y la fecha de entrada no puede estar a más de 365 días; si no se cumple, se muestra el motivo.
3. Solo se muestran los tipos de habitación activos cuya capacidad alcanza para el número de huéspedes indicado.
4. La disponibilidad de cada tipo y noche es: habitaciones activas del tipo que no están `Fuera de servicio` − reservas activas de ese tipo (`Pendiente de pago`, `Confirmada`, `En estadía`), **con o sin habitación asignada**. Un tipo se ofrece solo si tiene al menos 1 disponible en **todas** las noches del rango.
5. Para cada tipo disponible se muestra cuántas habitaciones quedan, el precio por noche y el total de la estadía en quetzales (impuestos incluidos).
6. Si no hay ningún tipo disponible, se muestra un mensaje claro.

**Depende de:** HU-ADM-03, HU-ADM-04, HU-ADM-06
**Reglas relacionadas:** RN-RES-002, RN-RES-005, RN-RES-006, RN-RES-007, RN-RES-008 (documento 10)
**Notas técnicas:** usa el mismo cálculo de disponibilidad y de precio que la web pública y el Channel Manager (un solo servicio en el backend).

---

### HU-REC-04 — Crear una reserva

| Plataforma | Épica | Alcance | Nivel | Tamaño | Estado |
|---|---|---|---|---|---|
| Web privada | Huéspedes y reservas | ALC-REC-02, ALC-REC-13 | 1 | M | Pendiente |

**Historia**
- **Como** recepcionista
- **Quiero** crear una reserva para un huésped
- **Para** garantizarle una habitación durante su estadía

**Criterios de aceptación**
1. Se selecciona un huésped existente o se registra uno nuevo (HU-REC-01); el correo del huésped es obligatorio.
2. Se indican fechas, número de huéspedes y tipo de habitación, con las mismas reglas de HU-REC-03 (1 a 30 noches, sin fechas pasadas, hasta 365 días, sin superar la capacidad del tipo). Opcionalmente se elige una habitación del tipo, con las reglas de HU-REC-07.
3. Antes de confirmar se muestra la tarifa de cada noche y el total: precio base del tipo × (1 + % de temporada vigente) × (1 + % de fin de semana si la noche es viernes o sábado), redondeado a 2 decimales. El precio lo calcula el servidor y queda fijo al crear la reserva.
4. Al guardar se **revalida la disponibilidad**; si ya no hay, la reserva no se crea y se muestra un mensaje.
5. La reserva nace `Confirmada`, con canal de origen "Recepción", un código único no secuencial (ej. `VS-7K2M9Q`) y el registro del recepcionista que la creó.
6. Junto con la reserva se crea la cuenta del huésped (`Abierta`) con el cargo por alojamiento. **No se cobra por adelantado:** todo el saldo se paga en el check-out (HU-REC-14).
7. Se envía al huésped el correo de confirmación con el código de reserva y el enlace de la app (el mismo de HU-HUE-07).

**Depende de:** HU-REC-01, HU-REC-03
**Reglas relacionadas:** RN-NOT-005, RN-PAG-007, RN-PAG-009, RN-RES-001, RN-RES-005, RN-RES-006, RN-RES-007, RN-RES-009, RN-RES-010, RN-RES-011, RN-RES-013, RN-TAR-001, RN-TAR-002, RN-TAR-006, RN-TAR-007, RN-TAR-008 (documento 10)

---

### HU-REC-05 — Cancelar una reserva

| Plataforma | Épica | Alcance | Nivel | Tamaño | Estado |
|---|---|---|---|---|---|
| Web privada | Huéspedes y reservas | ALC-REC-02 | 1 | M | Pendiente |

**Historia**
- **Como** recepcionista
- **Quiero** cancelar una reserva a pedido del huésped
- **Para** liberar la disponibilidad del hotel

**Criterios de aceptación**
1. Solo se pueden cancelar reservas `Confirmada`; en cualquier otro estado la opción no aparece y el backend lo rechaza. Las reservas `Pendiente de pago` no se cancelan a mano: se cancelan solas a los 30 minutos si no se pagan (HU-HUE-06).
2. Las reservas que llegaron de un canal externo (Booking, Expedia) **no se pueden cancelar** desde el sistema; se muestra un mensaje que lo indica.
3. El motivo de cancelación es obligatorio.
4. Antes de confirmar se muestra qué pasará con el dinero, sin cálculos parciales: si faltan **48 horas o más** para la hora de check-in (15:00, fija) del día de llegada y el huésped pagó en línea → **reembolso total** por Stripe; con menos de 48 horas → **sin reembolso**; si la reserva no tiene pagos (creada en Recepción) → no hay nada que reembolsar.
5. Al confirmar, la reserva pasa a `Cancelada`, la cuenta se cierra tal como está (`Cerrada`), la habitación asignada se libera y la disponibilidad vuelve a quedar libre. Se registra fecha, hora, responsable y motivo.
6. Si corresponde reembolso, se solicita a Stripe y el pago pasa a `Reembolsado`. Si Stripe rechaza el reembolso, la reserva no se cancela y se muestra el error.

**Depende de:** HU-REC-04, HU-HUE-06
**Reglas relacionadas:** RN-CAN-001, RN-CAN-002, RN-CAN-006, RN-CAN-008, RN-CAN-011, RN-CAN-012, RN-CAN-013, RN-RES-004, RN-SEG-006 (documento 10)
**Notas técnicas:** para cambiar fechas, tipo o número de huéspedes, Recepción cancela la reserva y crea otra (las reservas no se modifican). **Huésped que no llega:** no existe el estado `No-show`; Recepción cancela la reserva con el motivo "No se presentó" y, como faltan menos de 48 horas, no hay reembolso (V-01). **No se envía correo de cancelación:** Recepción avisa al cliente por su cuenta (V-05). **Reserva de canal cuyo huésped no llega:** como las reservas de canal no se cancelan desde el sistema, queda `Confirmada`; es una limitación aceptada, porque no ocurre en la demostración.

---

### HU-REC-06 — Buscar reservas

| Plataforma | Épica | Alcance | Nivel | Tamaño | Estado |
|---|---|---|---|---|---|
| Web privada | Huéspedes y reservas | ALC-REC-08 | 1 | M | Pendiente |

**Historia**
- **Como** recepcionista
- **Quiero** buscar reservas y ver de un clic las llegadas y salidas de hoy
- **Para** encontrar rápido la información que necesito y organizar el día

**Criterios de aceptación**
1. Se puede buscar por nombre del huésped, número de documento, código de reserva y rango de fechas, y filtrar por estado y por canal de origen.
2. Filtro rápido **"Llegan hoy":** reservas `Confirmada` con fecha de entrada hoy, con acceso directo al check-in (HU-REC-12).
3. Filtro rápido **"Salen hoy":** reservas `En estadía` con fecha de salida hoy, con su saldo pendiente y acceso directo al check-out (HU-REC-14).
4. Los resultados muestran código, huésped principal, fechas, tipo, habitación (o "Sin asignar"), estado y canal de origen.
5. El detalle de la reserva muestra los datos del huésped y de los adicionales, las fechas, el tipo, la habitación, el total, el canal y el **historial de estados** con fecha, hora y responsable de cada cambio.
6. Desde el detalle solo se ofrecen las acciones válidas para el estado actual (asignar habitación, check-in, cancelar, ver la cuenta, check-out, imprimir factura).
7. Si no hay resultados, se muestra un mensaje claro.

**Depende de:** HU-REC-04
**Reglas relacionadas:** RN-RES-023 (documento 10)
**Notas técnicas:** el canal de origen se muestra como en HU-CM-02. **Llegadas después de medianoche:** "Llegan hoy" solo muestra las reservas con entrada hoy; quien llega después de medianoche (entrada de ayer) no aparece y Recepción lo busca por nombre o código. Es una limitación aceptada; lo mismo pasa con "Llega hoy" (HU-REC-10) y "Llegada hoy" (HU-MYL-01).

---

### HU-REC-07 — Asignar o cambiar la habitación antes del check-in

| Plataforma | Épica | Alcance | Nivel | Tamaño | Estado |
|---|---|---|---|---|---|
| Web privada | Huéspedes y reservas | ALC-REC-04 | 1 | S | Pendiente |

**Historia**
- **Como** recepcionista
- **Quiero** asignar o cambiar la habitación de una reserva antes de que llegue el huésped
- **Para** tener lista su habitación al llegar

**Criterios de aceptación**
1. Solo se puede asignar o cambiar la habitación de reservas `Pendiente de pago` o `Confirmada`. Con la reserva `En estadía` no se puede cambiar (no hay cambio de habitación durante la estadía); se muestra un mensaje.
2. Solo se ofrecen habitaciones del **mismo tipo reservado** que no estén `Fuera de servicio` y que no tengan otra reserva activa en fechas que se traslapen.
3. Al guardar, el backend vuelve a validar el traslape; si otra persona ya ocupó esa habitación en esas fechas, no se guarda y se muestra un mensaje.
4. La habitación no necesita estar `Limpia` para asignarse; esa condición se exige en el check-in.
5. El cambio queda registrado con fecha, hora y responsable, y la reserva sale de la fila "Sin asignar" del calendario (HU-REC-08).

**Depende de:** HU-REC-04, HU-ADM-04
**Reglas relacionadas:** RN-HAB-001, RN-HAB-002, RN-RES-002, RN-RES-013, RN-RES-018 (documento 10)
**Notas técnicas:** también se usa para asignar habitación a las reservas que llegan del canal sin habitación (HU-CM-01).

---

## Épica 2: Calendario

### HU-REC-08 — Ver el calendario Gantt

| Plataforma | Épica | Alcance | Nivel | Tamaño | Estado |
|---|---|---|---|---|---|
| Web privada | Calendario | ALC-REC-12 | 1 | L | Pendiente |

**Historia**
- **Como** recepcionista
- **Quiero** ver las reservas en un calendario de habitaciones por días
- **Para** entender de un vistazo la ocupación del hotel

**Criterios de aceptación**
1. Las filas son las habitaciones, agrupadas por tipo, más una fila **"Sin asignar"** para las reservas que todavía no tienen habitación. Las columnas son los días.
2. Cada reserva activa o finalizada se muestra como una barra desde la fecha de entrada hasta la de salida; las reservas `Cancelada` no se muestran.
3. El color de la barra indica el estado de la reserva y un ícono indica el canal de origen (Directo web, Recepción, Booking, Expedia).
4. Al hacer clic en una barra se muestra un resumen (código, huésped, fechas, estado y canal) con un enlace al detalle de la reserva (HU-REC-06).
5. Se puede navegar por semanas y por meses, y volver a **"Hoy"**.
6. El botón **"Nueva reserva"** abre el formulario de HU-REC-04; al guardar, la reserva aparece en el calendario.
7. El calendario se actualiza al abrir la pantalla o al volver a ella (no requiere tiempo real).
8. Las barras no se pueden arrastrar ni estirar; para cambiar las fechas de una reserva se cancela y se crea otra.

**Depende de:** HU-REC-04, HU-REC-07
**Reglas relacionadas:** RN-RES-018, RN-RES-024 (documento 10)

---

### HU-REC-09 — Crear una reserva seleccionando días en el Gantt

| Plataforma | Épica | Alcance | Nivel | Tamaño | Estado |
|---|---|---|---|---|---|
| Web privada | Calendario | ALC-REC-12b | 2 | M | Pendiente |

**Historia**
- **Como** recepcionista
- **Quiero** crear una reserva seleccionando días libres en la fila de una habitación
- **Para** reservar más rápido mientras veo la ocupación

**Criterios de aceptación**
1. Al seleccionar un rango de días libres en la fila de una habitación, se abre el formulario de HU-REC-04 con la habitación, su tipo y las fechas ya llenados.
2. No se puede seleccionar un rango que se traslape con otra reserva de esa habitación ni en una habitación `Fuera de servicio`.
3. El formulario aplica las mismas validaciones de HU-REC-04 (noches, capacidad, tarifa y revalidación de disponibilidad); si alguna falla, la reserva no se crea y se muestra el motivo.
4. Al guardar, la nueva reserva aparece en el calendario.

**Depende de:** HU-REC-08
**Reglas relacionadas:** RN-RES-025 (documento 10)

---

## Épica 3: Habitaciones

### HU-REC-10 — Ver el estado de las habitaciones

| Plataforma | Épica | Alcance | Nivel | Tamaño | Estado |
|---|---|---|---|---|---|
| Web privada | Habitaciones | ALC-REC-10 | 1 | M | Pendiente |

**Historia**
- **Como** recepcionista
- **Quiero** ver el estado actual de todas las habitaciones
- **Para** saber cuáles puedo usar para el check-in

**Criterios de aceptación**
1. Cada habitación muestra su número, tipo, piso, **ocupación** (`Libre` / `Ocupada`) y **condición** (`Limpia` / `Sucia` / `En limpieza` / `Fuera de servicio`).
2. Se muestran los indicadores **"Llega hoy"** (tiene asignada una reserva `Confirmada` con entrada hoy), **"Sale hoy"** (su reserva `En estadía` sale hoy) e **"Incidencia pendiente"** (está `Ocupada` y tiene una incidencia que impide su uso sin resolver).
3. Se puede filtrar por ocupación, condición, tipo y piso.
4. Los cambios de estado de las habitaciones (limpieza, mantenimiento, check-in y check-out) se ven **en tiempo real**, sin recargar la página.
5. Para una habitación `Fuera de servicio` se puede consultar, en solo lectura, la incidencia que la bloquea y su estado.
6. Si ninguna habitación cumple los filtros, se muestra un mensaje claro.

**Depende de:** HU-ADM-04
**Reglas relacionadas:** RN-HAB-014, RN-NOT-009 (documento 10)

---

### HU-REC-11 — Marcar una habitación libre como sucia

| Plataforma | Épica | Alcance | Nivel | Tamaño | Estado |
|---|---|---|---|---|---|
| Web privada | Habitaciones | ALC-REC-10 | 1 | S | Pendiente |

**Historia**
- **Como** recepcionista
- **Quiero** marcar como sucia una habitación libre
- **Para** que Limpieza la vuelva a preparar antes de entregarla

**Criterios de aceptación**
1. Solo se puede marcar como `Sucia` una habitación `Libre` + `Limpia`; en cualquier otro caso la opción no aparece y el backend lo rechaza.
2. Recepción no puede marcar una habitación como `Limpia` (lo hace Limpieza, HU-MYL-03) ni cambiar la ocupación a mano (cambia solo con el check-in y el check-out).
3. Para dejar una habitación `Fuera de servicio` se debe reportar un daño (HU-REC-17).
4. El cambio registra fecha, hora y responsable, y aparece en tiempo real en la lista de Limpieza y en el estado de las habitaciones.

**Depende de:** HU-REC-10
**Reglas relacionadas:** RN-HAB-004, RN-HAB-005, RN-HAB-006, RN-HAB-013, RN-NOT-009 (documento 10)

---

## Épica 4: Estadía y cuenta

### HU-REC-12 — Realizar el check-in

| Plataforma | Épica | Alcance | Nivel | Tamaño | Estado |
|---|---|---|---|---|---|
| Web privada | Estadía y cuenta | ALC-REC-05 | 1 | M | Pendiente |

**Historia**
- **Como** recepcionista
- **Quiero** registrar la llegada del huésped
- **Para** iniciar oficialmente su estadía

**Criterios de aceptación**
1. Solo se puede hacer check-in de reservas `Confirmada` si **hoy está entre la fecha de entrada y el día anterior a la salida** (así entra también quien llega después de medianoche); si no, se muestra el motivo (por ejemplo, una reserva `Pendiente de pago` o de fechas futuras). Las noches no usadas se cobran igual.
2. Se muestran los datos del huésped principal y de los adicionales para verificarlos, y se pueden agregar adicionales (HU-REC-02).
3. Si la reserva no tiene habitación asignada, se pide asignarla antes de continuar (HU-REC-07).
4. La habitación asignada debe estar `Libre` + `Limpia`; si no, se avisa y no se permite el check-in. La hora de check-in (15:00, fija) es referencial: se permite antes si la habitación ya está limpia.
5. Al confirmar, la reserva pasa a `En estadía` y la habitación a `Ocupada`; se registran fecha, hora y recepcionista. La cuenta ya existe desde que se creó la reserva.
6. Desde ese momento el huésped puede usar en la app room service y solicitudes. Ver su cuenta no depende del estado de la reserva (HU-HUE-15).

**Depende de:** HU-REC-04, HU-REC-07
**Reglas relacionadas:** RN-HAB-004, RN-RES-014 (documento 10)

---

### HU-REC-13 — Consultar la cuenta y agregar cargos

| Plataforma | Épica | Alcance | Nivel | Tamaño | Estado |
|---|---|---|---|---|---|
| Web privada | Estadía y cuenta | ALC-REC-06 | 1 | M | Pendiente |

**Historia**
- **Como** recepcionista
- **Quiero** ver la cuenta del huésped y agregarle los servicios que consume
- **Para** saber cuánto debe e incluirlo todo en el cobro final

**Criterios de aceptación**
1. La cuenta muestra el cargo por alojamiento con el detalle por noche (en las reservas de canal, una sola línea con el monto del canal), los cargos adicionales (room service y servicios) con fecha, concepto y monto, los pagos (en línea, del canal o en Recepción) con su estado, y el saldo pendiente en quetzales. El saldo es la suma de los cargos `Vigente` menos la suma de los pagos `Aprobado`; los cargos `Anulado` y los pagos `Pendiente`, `Fallido` o `Reembolsado` no intervienen en ese cálculo.
2. Solo se pueden agregar cargos si la reserva está `En estadía` y la cuenta está `Abierta`; si no, la opción no aparece y el backend lo rechaza.
3. Para agregar un cargo se indica concepto (restaurante, lavandería, estacionamiento u otro), cantidad y precio unitario (ambos mayores que cero); el total del cargo se calcula solo.
4. Cada cargo queda registrado con fecha, hora y responsable, y el huésped lo ve en su cuenta en la app.
5. Los cargos no se borran: un cargo adicional registrado por error se **anula** con un motivo obligatorio. Queda visible como anulado, con responsable, y deja de sumar al saldo.
6. El cargo por alojamiento no se puede anular; con la cuenta `Cerrada` no se agregan ni anulan cargos.

**Depende de:** HU-REC-04, HU-REC-12
**Reglas relacionadas:** RN-PAG-010, RN-PAG-011, RN-PAG-019, RN-PAG-020, RN-PAG-021, RN-SEG-006, RN-TAR-009, RN-TAR-010 (documento 10)
**Notas técnicas:** el cargo de room service lo genera el sistema al entregar el pedido (HU-RS-06).

---

### HU-REC-14 — Realizar el check-out con pago único

| Plataforma | Épica | Alcance | Nivel | Tamaño | Estado |
|---|---|---|---|---|---|
| Web privada | Estadía y cuenta | ALC-REC-05, ALC-REC-06 | 1 | M | Pendiente |

**Historia**
- **Como** recepcionista
- **Quiero** cobrar el saldo y registrar la salida del huésped
- **Para** cerrar su estadía, facturar y liberar la habitación

**Criterios de aceptación**
1. Solo se puede hacer check-out de reservas `En estadía`. Se muestra la cuenta completa y el saldo pendiente.
2. Si hay un pedido de room service `En camino`, no se permite el check-out; se muestra un mensaje para esperar la entrega.
3. **Pago único:** si hay saldo, se registra **un solo pago por el saldo total** (no se aceptan abonos) indicando el método (efectivo, tarjeta u otro) y una referencia opcional. Si el saldo ya es 0, no se pide pago.
4. Se indica el NIT del comprador (validado con su dígito verificador; el último dígito puede ser "K") o se elige "Consumidor Final" (CF), y el nombre del comprador (por defecto, el del huésped). Si el NIT no es válido, no se puede continuar.
5. Al confirmar, con el saldo exactamente en 0: se emite la factura (HU-REC-15), la reserva pasa a `Finalizada`, la cuenta a `Cerrada` y la habitación a `Libre` + `Sucia` (o `Fuera de servicio` si tiene una incidencia que impide su uso).
6. También al confirmar: las solicitudes `Pendiente` o `En proceso` pasan a `Cancelada` y los pedidos `Nuevo` o `En preparación` pasan a `Cancelado` (sin cargo). Se registran fecha, hora y responsable.
7. Todo ocurre en una sola operación: si algo falla (por ejemplo, un error al emitir la factura), no se registra el pago ni cambia ningún estado, y se muestra el motivo. Esto se refiere al pago que Recepción registra dentro del check-out; los pagos aprobados previamente, incluidos los de Stripe, se conservan.

**Depende de:** HU-REC-13, HU-REC-15
**Reglas relacionadas:** RN-FAC-005, RN-HAB-002, RN-HAB-004, RN-HAB-008, RN-LIM-009, RN-PAG-007, RN-PAG-013, RN-PAG-014, RN-RES-015, RN-RES-021, RN-RES-022, RN-RS-011 (documento 10)
**Notas técnicas:** el check-out desde la app (HU-HUE-16) produce los mismos efectos; ambos deben usar el mismo servicio del backend. **Salida tarde:** si el huésped no hace el check-out a la hora de salida, no ocurre nada automático; Recepción lo hace cuando el huésped baje, sin cargo extra (este check-out no limita la fecha). Si la habitación tenía otra llegada, ese check-in queda bloqueado porque no está `Libre` + `Limpia` (V-03).

---

## Épica 5: Facturación

### HU-REC-15 — Emitir la factura

| Plataforma | Épica | Alcance | Nivel | Tamaño | Estado |
|---|---|---|---|---|---|
| Web privada | Facturación | ALC-REC-15, ALC-TRA-05 | 1 | M | Pendiente |

**Historia**
- **Como** recepcionista
- **Quiero** que se emita la factura de la cuenta del huésped al hacer el check-out
- **Para** entregarle el documento de cobro de su estadía

**Criterios de aceptación**
1. La factura se emite **solo en el check-out** (desde Recepción, HU-REC-14, o desde la app, HU-HUE-16), con el saldo de la cuenta en 0. Hay una sola factura por cuenta: no se puede emitir una segunda.
2. Usa el NIT (o "CF" — Consumidor Final) y el nombre del comprador indicados en el check-out.
3. El número es el siguiente correlativo de la **serie fija** cargada en los datos iniciales, consecutivo y sin saltos.
4. La factura muestra los datos del hotel, serie y número, fecha y hora, NIT y nombre del comprador, código de reserva, detalle de cargos (sin los anulados), total con la leyenda "IVA incluido" (sin desglose de impuestos) y los pagos de la cuenta (método y monto de cada uno), con la leyenda **"Factura de demostración — no válida ante la SAT"**.
5. La factura queda `Emitida`; se genera el PDF, se guarda y se envía por correo al huésped.
6. Una factura emitida no se modifica ni se anula.
7. En Recepción, al emitirla se ofrece imprimirla de inmediato (HU-REC-16).

**Depende de:** HU-ADM-08
**Reglas relacionadas:** RN-FAC-001, RN-FAC-002, RN-FAC-004, RN-FAC-005, RN-FAC-008, RN-FAC-009, RN-TAR-005 (documento 10)
**Notas técnicas:** es la historia base de facturación; la usan el check-out de Recepción y el de la app. El correlativo se asigna dentro de la misma transacción del check-out para evitar saltos. Los datos fiscales, la serie y el número inicial existen siempre desde el arranque (datos iniciales), así que no hay bloqueo por "faltan datos de facturación".

---

### HU-REC-16 — Imprimir la factura

| Plataforma | Épica | Alcance | Nivel | Tamaño | Estado |
|---|---|---|---|---|---|
| Web privada | Facturación | ALC-REC-16 | 1 | S | Pendiente |

**Historia**
- **Como** recepcionista
- **Quiero** imprimir la factura del huésped
- **Para** entregársela en papel

**Criterios de aceptación**
1. Se puede elegir el formato: **ticket de 80 mm** (impresora térmica) u **hoja carta**.
2. La impresión se lanza desde el navegador con una vista preparada para ese formato, sin menús ni botones de la pantalla.
3. En el formato de 80 mm el contenido cabe en el ancho del papel, sin cortes, y los montos quedan alineados.
4. Se puede imprimir de nuevo desde el detalle de la reserva cuantas veces se quiera; todas las impresiones son iguales (sin marca "COPIA") e imprimir no cambia el estado de la factura.
5. Si la reserva no tiene una factura `Emitida`, la opción de imprimir no aparece.

**Depende de:** HU-REC-15
**Reglas relacionadas:** RN-FAC-007 (documento 10)
**Notas técnicas:** CSS de impresión (`@media print` y `@page`) con tamaños para 80 mm y carta. No requiere un controlador especial de impresora.

---

## Épica 6: Mantenimiento

### HU-REC-17 — Reportar un daño en una habitación

| Plataforma | Épica | Alcance | Nivel | Tamaño | Estado |
|---|---|---|---|---|---|
| Web privada | Mantenimiento | ALC-MYL-07 | 1 | S | Pendiente |

**Historia**
- **Como** recepcionista
- **Quiero** reportar un daño que me informa un huésped o que detecto
- **Para** que Mantenimiento lo repare

**Criterios de aceptación**
1. Se selecciona la habitación, se escribe una descripción, se indica si el daño impide usar la habitación y se puede adjuntar una foto (opcional). Si falta la descripción, no se crea la incidencia.
2. Se crea una incidencia `Reportada` con fecha, hora y quien la reportó, visible para Mantenimiento y para el Administrador (solo consulta).
3. Si el daño impide usar la habitación y está `Libre`, pasa a `Fuera de servicio`. Si tenía reservas futuras asignadas, Recepción las ve en el calendario (HU-REC-08) y les cambia la habitación con HU-REC-07; no hay aviso automático.
4. Si el daño impide usar la habitación y está `Ocupada`, no cambia su condición: muestra el indicador "Incidencia pendiente" (HU-REC-10) y se repara con el huésped alojado (no hay cambio de habitación). Al hacer el check-out pasa a `Fuera de servicio`.
5. Si el daño no impide usar la habitación, su condición no cambia.

**Depende de:** HU-REC-10
**Reglas relacionadas:** RN-HAB-006, RN-MAN-001 (documento 10)
**Notas técnicas:** es la misma incidencia que crea el personal de Mantenimiento/Limpieza (HU-MYL-06).
