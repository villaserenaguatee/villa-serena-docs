# HU — Cliente y Huésped

> **Rol:** Cliente/Huésped (`HUESPED`)
> **Plataforma:** Web pública y App Android
> **Prefijo:** `HU-HUE`
> **Total de historias:** 18 (Nivel 1: 17 · Nivel 2: 1)
> **Referencias:** 01 — Alcance (secciones 5.A y 5.E)

Recordatorio del rol: el **Cliente** reserva en la web pública **sin iniciar sesión**. El **Huésped** entra a la **app** con su **correo + un código** que le llega por email.

---

## Épica 1: Explorar y reservar (Web pública)

### HU-HUE-01 — Ver la información del hotel

| Plataforma | Épica | Alcance | Nivel | Tamaño | Estado |
|---|---|---|---|---|---|
| Web pública | Explorar y reservar | ALC-PUB-01 | 1 | S | Pendiente |

**Historia**
- **Como** cliente
- **Quiero** ver la información general del hotel
- **Para** conocer Villa Serena antes de decidir mi reserva

**Criterios de aceptación**
1. La página de inicio muestra el nombre, una descripción, fotos y la ubicación del hotel.
2. Se muestran los datos de contacto (tomados de la configuración del hotel) y las horas fijas de check-in (15:00) y check-out (12:00).
3. Se muestra un acceso directo al buscador de disponibilidad.
4. La página se ve correctamente en computadora y en teléfono.

**Depende de:** HU-ADM-08
**Reglas relacionadas:** RN-APP-008, RN-RES-014 (documento 10)

---

### HU-HUE-02 — Ver el catálogo de habitaciones

| Plataforma | Épica | Alcance | Nivel | Tamaño | Estado |
|---|---|---|---|---|---|
| Web pública | Explorar y reservar | ALC-PUB-02 | 1 | S | Pendiente |

**Historia**
- **Como** cliente
- **Quiero** ver los tipos de habitación del hotel
- **Para** elegir el que mejor se adapta a mi viaje

**Criterios de aceptación**
1. Se listan todos los tipos de habitación activos.
2. Cada tipo muestra nombre, fotos, descripción, capacidad máxima y precio base por noche en quetzales (impuestos incluidos).
3. Al seleccionar un tipo se muestra su detalle con todas sus fotos y un botón para buscar disponibilidad de ese tipo.
4. Los tipos desactivados por el Administrador no se muestran.
5. Si no hay tipos activos, se muestra un mensaje claro en lugar de una lista vacía.

**Depende de:** HU-ADM-03
**Reglas relacionadas:** RN-HAB-010, RN-TAR-005 (documento 10)

---

### HU-HUE-03 — Buscar disponibilidad por fechas y huéspedes

| Plataforma | Épica | Alcance | Nivel | Tamaño | Estado |
|---|---|---|---|---|---|
| Web pública | Explorar y reservar | ALC-PUB-03 | 1 | M | Pendiente |

**Historia**
- **Como** cliente
- **Quiero** buscar habitaciones disponibles indicando fechas y número de huéspedes
- **Para** saber qué opciones tengo para mi estadía

**Criterios de aceptación**
1. Se eligen la fecha de entrada y la fecha de salida en un calendario, y el número de huéspedes.
2. La estadía debe ser de 1 a 30 noches; no se aceptan fechas pasadas, una salida igual o anterior a la entrada, ni una entrada a más de 365 días de hoy. Si alguna regla no se cumple, se muestra el motivo y no se busca.
3. Solo se muestran tipos de habitación activos cuya capacidad sea igual o mayor al número de huéspedes.
4. La disponibilidad de cada tipo y noche es: habitaciones activas del tipo que no están `Fuera de servicio` − reservas de ese tipo en estado `Pendiente de pago`, `Confirmada` o `En estadía` (tengan o no habitación asignada).
5. Solo se muestra un tipo si tiene disponibilidad en **todas** las noches del rango.
6. Si no hay disponibilidad, se muestra un mensaje claro y se sugiere cambiar las fechas o el número de huéspedes.

**Depende de:** HU-ADM-03
**Reglas relacionadas:** RN-HAB-001, RN-RES-002, RN-RES-005, RN-RES-006, RN-RES-007, RN-RES-008 (documento 10)
**Notas técnicas:** el cálculo de disponibilidad es el mismo que usan Recepción y la API del canal; conviene una sola función en el backend.

---

### HU-HUE-04 — Ver el precio total de mi estadía

| Plataforma | Épica | Alcance | Nivel | Tamaño | Estado |
|---|---|---|---|---|---|
| Web pública | Explorar y reservar | ALC-PUB-05 | 1 | M | Pendiente |

**Historia**
- **Como** cliente
- **Quiero** ver el precio total de mi estadía antes de reservar
- **Para** saber exactamente cuánto voy a pagar

**Criterios de aceptación**
1. Para cada tipo disponible se muestra el precio total de la estadía en quetzales, con impuestos incluidos.
2. El precio de cada noche es: precio base del tipo × (1 + % de la temporada vigente) × (1 + % de fin de semana si la noche es viernes o sábado), redondeado a 2 decimales. El total es la suma de las noches.
3. Se muestra el desglose por noche, indicando qué noches llevan ajuste de temporada o de fin de semana.
4. El precio se calcula en el servidor; el navegador solo lo muestra.
5. Stripe cobra el total que quedó fijo al crear la reserva (HU-HUE-05).

**Depende de:** HU-HUE-03, HU-ADM-03, HU-ADM-06
**Reglas relacionadas:** RN-TAR-001, RN-TAR-002, RN-TAR-005, RN-TAR-006, RN-TAR-007, RN-TAR-008, RN-TAR-009 (documento 10)

---

### HU-HUE-05 — Ingresar mis datos y confirmar la reserva

| Plataforma | Épica | Alcance | Nivel | Tamaño | Estado |
|---|---|---|---|---|---|
| Web pública | Explorar y reservar | ALC-PUB-04 | 1 | M | Pendiente |

**Historia**
- **Como** cliente
- **Quiero** reservar una habitación ingresando solo mis datos
- **Para** asegurar mi hospedaje sin crear una cuenta ni llamar por teléfono

**Criterios de aceptación**
1. Se piden nombre completo, correo, teléfono, nacionalidad, tipo de documento (DPI o pasaporte) y número de documento del huésped principal: los mismos datos que en Recepción (HU-REC-01) y en el canal (HU-CM-01).
2. El huésped se identifica por su correo: si ya existe un huésped con ese correo, la reserva se asocia a ese perfil sin cambiar sus datos.
3. Todos los campos son obligatorios y el correo debe tener un formato válido; si falta o está mal un dato, se señala el campo y no se continúa.
4. Antes de continuar al pago se muestra un resumen: tipo de habitación, fechas, número de noches, huéspedes y total.
5. Antes de crear la reserva se **vuelve a validar la disponibilidad**; si ya no hay, se avisa y la reserva no se crea.
6. La reserva se crea en estado `Pendiente de pago`, con canal de origen "Directo web" y un código único no secuencial (ej. `VS-7K2M9Q`). El precio queda fijo en ese momento.
7. Mientras está `Pendiente de pago`, la reserva ocupa cupo en la disponibilidad para evitar sobreventa.
8. Junto con la reserva se crea su cuenta `Abierta` con el cargo por alojamiento.
9. El cliente no puede cambiar la reserva después de crearla. Si se equivocó y ya pagó, debe pedir a Recepción que la cancele; si no ha pagado, la reserva se cancela sola a los 30 minutos (HU-HUE-06).

**Depende de:** HU-HUE-04
**Reglas relacionadas:** RN-PAG-009, RN-RES-001, RN-RES-002, RN-RES-009, RN-RES-010, RN-RES-011, RN-RES-018, RN-RES-019, RN-TAR-007 (documento 10)

---

### HU-HUE-06 — Pagar mi reserva en línea

| Plataforma | Épica | Alcance | Nivel | Tamaño | Estado |
|---|---|---|---|---|---|
| Web pública | Explorar y reservar | ALC-PUB-06 | 1 | L | Pendiente |

**Historia**
- **Como** cliente
- **Quiero** pagar mi reserva con tarjeta en línea
- **Para** dejarla confirmada

**Criterios de aceptación**
1. El cliente paga el **100 %** del total en la página de Stripe (modo prueba); el sistema nunca recibe ni guarda los datos de la tarjeta.
2. La reserva pasa a `Confirmada` y el pago a `Aprobado` **solo** cuando llega el webhook de Stripe, no por la redirección del navegador.
3. Si el mismo webhook llega dos veces, el pago se registra una sola vez.
4. Hay una sola sesión de pago **para el pago de la reserva**: si un intento de pago es rechazado o el cliente cierra la página, puede reintentar con el mismo enlace mientras la reserva siga `Pendiente de pago`. Un intento rechazado no cambia el pago, que sigue `Pendiente`; el pago pasa a `Fallido` solo cuando la sesión vence (al cancelarse la reserva a los 30 minutos).
5. Si no se paga en 30 minutos, la reserva se cancela sola, con los mismos efectos de HU-REC-05 (criterio 5): la cuenta se cierra y la disponibilidad queda libre. Antes de cancelarla, el sistema consulta la sesión en Stripe: si ya estaba pagada, la confirma en lugar de cancelarla.
6. Al volver de Stripe, el cliente ve una página con el estado de su reserva: confirmada, pago en proceso o pago no completado (con opción de reintentar mientras la reserva siga `Pendiente de pago`).

**Depende de:** HU-HUE-05
**Reglas relacionadas:** RN-CAN-013, RN-PAG-001, RN-PAG-002, RN-PAG-003, RN-PAG-004, RN-PAG-005, RN-PAG-006, RN-PAG-014, RN-RES-004, RN-RES-012 (documento 10)
**Notas técnicas:** se usa Stripe Checkout; la cancelación a los 30 minutos es un proceso programado en el backend.

---

### HU-HUE-07 — Recibir la confirmación por correo

| Plataforma | Épica | Alcance | Nivel | Tamaño | Estado |
|---|---|---|---|---|---|
| Web pública | Explorar y reservar | ALC-PUB-07, ALC-TRA-05 | 1 | S | Pendiente |

**Historia**
- **Como** cliente
- **Quiero** recibir un correo cuando mi reserva quede confirmada
- **Para** tener mi código de reserva y saber cómo usar la app

**Criterios de aceptación**
1. El correo se envía automáticamente cuando la reserva queda `Confirmada`: en la web, al llegar el webhook de pago; en Recepción y en el canal, al crearse la reserva.
2. Incluye el código de reserva, fechas, tipo de habitación, número de huéspedes, total y horas de check-in (15:00) y check-out (12:00).
3. Indica si el total ya está pagado (web o canal) o si se paga en el check-out (Recepción).
4. Incluye el enlace de descarga de la app Android y la instrucción de entrar con el mismo correo de la reserva.
5. Si el envío falla, se reintenta y el error queda registrado; la reserva sigue `Confirmada` aunque el correo no salga.

**Depende de:** HU-HUE-06, HU-REC-04
**Reglas relacionadas:** RN-NOT-003, RN-NOT-005, RN-RES-009 (documento 10)

---

## Épica 2: Mi estadía (App)

### HU-HUE-08 — Entrar a la app con mi correo y un código

| Plataforma | Épica | Alcance | Nivel | Tamaño | Estado |
|---|---|---|---|---|---|
| App | Mi estadía | ALC-APP-01, ALC-TRA-01, ALC-TRA-05 | 1 | M | Pendiente |

**Historia**
- **Como** huésped
- **Quiero** entrar a la app con mi correo y un código que me llega por email
- **Para** acceder a mis reservas sin recordar una contraseña

**Criterios de aceptación**
1. El huésped escribe su correo y recibe por email un código de 6 dígitos.
2. El código vence en 10 minutos y solo puede usarse una vez; si está vencido o ya se usó, se muestra un mensaje y se puede pedir uno nuevo.
3. Si el correo no tiene ninguna reserva, se muestra un mensaje genérico que no revela si el correo existe.
4. Después de 5 intentos fallidos, el acceso se bloquea 15 minutos y se muestra un mensaje para intentar más tarde.
5. Al entrar, el huésped queda vinculado con todas las reservas hechas con ese correo (web, Recepción o canal).
6. La sesión se mantiene mientras el huésped use la app: el token de acceso dura 15 minutos y se renueva solo con el refresh token, que dura 7 días y se renueva en cada uso. Si no abre la app en 7 días, o si cierra sesión, vuelve a entrar con un código.

**Depende de:** HU-HUE-05, HU-REC-04
**Reglas relacionadas:** RN-APP-001, RN-APP-002, RN-APP-003, RN-APP-010, RN-APP-011 (documento 10)
**Notas técnicas:** el código se guarda con hash; al verificarlo se emite un JWT con rol `HUESPED`.

---

### HU-HUE-09 — Ver mis reservas y el detalle de mi estadía

| Plataforma | Épica | Alcance | Nivel | Tamaño | Estado |
|---|---|---|---|---|---|
| App | Mi estadía | ALC-APP-02 | 1 | M | Pendiente |

**Historia**
- **Como** huésped
- **Quiero** ver mis reservas y el detalle de mi estadía
- **Para** tener a mano toda la información de mi hospedaje

**Criterios de aceptación**
1. Si el huésped tiene varias reservas, se muestra un selector con código, fechas y estado de cada una.
2. Al abrir la app, si tiene una reserva `En estadía`, entra directo a ella sin pasar por el selector.
3. El detalle muestra código de reserva, fechas de entrada y salida, hora de check-out, tipo de habitación, huéspedes y estado.
4. El número de habitación se muestra solo cuando ya fue asignada; si no, se muestra "Por asignar".
5. Las opciones de room service y solicitudes solo aparecen activas con la reserva `En estadía`; en otro estado se muestra un aviso de que estarán disponibles durante la estadía.
6. El huésped solo ve sus propias reservas; si intenta abrir una reserva ajena, el servidor la rechaza.

**Depende de:** HU-HUE-08, HU-REC-12
**Reglas relacionadas:** RN-APP-005, RN-APP-011, RN-SEG-001, RN-SEG-006 (documento 10)

---

### HU-HUE-10 — Pedir room service

| Plataforma | Épica | Alcance | Nivel | Tamaño | Estado |
|---|---|---|---|---|---|
| App | Mi estadía | ALC-APP-03 | 1 | M | Pendiente |

**Historia**
- **Como** huésped alojado
- **Quiero** pedir comida desde la app
- **Para** recibirla en mi habitación sin llamar a nadie

**Criterios de aceptación**
1. Solo está disponible si la reserva está `En estadía`.
2. Se muestra el menú por categorías con nombre, descripción y precio de cada ítem.
3. Los ítems `Agotado` se ven como no disponibles y no se pueden agregar.
4. El huésped elige ítems y cantidades y puede escribir notas (ej. "sin cebolla").
5. Antes de enviar se muestra el total y el aviso de que se cargará a la cuenta cuando el pedido sea entregado.
6. El pedido se crea en estado `Nuevo`, con los precios congelados en ese momento, y aparece al instante en la pantalla de Room Service.
7. Si un ítem se agotó mientras el huésped armaba el pedido, el pedido no se crea y se le indica qué ítem quitar.

**Depende de:** HU-HUE-09, HU-ADM-05
**Reglas relacionadas:** RN-APP-005, RN-NOT-006, RN-RS-005, RN-RS-006 (documento 10)

---

### HU-HUE-11 — Seguir mi pedido en vivo

| Plataforma | Épica | Alcance | Nivel | Tamaño | Estado |
|---|---|---|---|---|---|
| App | Mi estadía | ALC-APP-04 | 1 | M | Pendiente |

**Historia**
- **Como** huésped
- **Quiero** ver el estado de mi pedido mientras se prepara
- **Para** saber cuándo va a llegar

**Criterios de aceptación**
1. Se muestra el estado actual del pedido: `Nuevo`, `En preparación`, `En camino`, `Entregado` o `Cancelado`.
2. El estado cambia en pantalla automáticamente, sin recargar, cuando Room Service lo avanza.
3. Si el pedido se cancela, se muestra el motivo que escribió Room Service.
4. Se listan los pedidos de la estadía con su fecha, estado y total.
5. El huésped no puede cancelar ni modificar un pedido desde la app.
6. Si se pierde la conexión, al recuperarla la pantalla muestra el estado actual del pedido.

**Depende de:** HU-HUE-10, HU-RS-03
**Reglas relacionadas:** RN-NOT-007, RN-RS-004, RN-RS-010 (documento 10)
**Notas técnicas:** usa el evento en tiempo real "cambio de estado del pedido". La app se conecta al WebSocket con su propio JWT de huésped, sin pasar por el BFF; esto se describirá en el documento 14.

---

### HU-HUE-12 — Solicitar limpieza

| Plataforma | Épica | Alcance | Nivel | Tamaño | Estado |
|---|---|---|---|---|---|
| App | Mi estadía | ALC-APP-05 | 1 | S | Pendiente |

**Historia**
- **Como** huésped alojado
- **Quiero** solicitar la limpieza de mi habitación desde la app
- **Para** que la limpien sin tener que ir a recepción

**Criterios de aceptación**
1. Solo está disponible si la reserva está `En estadía`.
2. El huésped puede escribir un comentario opcional (ej. "después de las 2 p.m.").
3. La solicitud se crea en estado `Pendiente` y aparece al instante al personal de Limpieza.
4. No se puede crear otra solicitud de limpieza si ya hay una `Pendiente` o `En proceso` para la misma habitación; se muestra un mensaje indicando que ya hay una en curso.
5. La solicitud no cambia la condición de la habitación (sigue como esté, por ejemplo `Limpia`).

**Depende de:** HU-HUE-09
**Reglas relacionadas:** RN-APP-005, RN-LIM-005, RN-LIM-006, RN-LIM-013, RN-NOT-008 (documento 10)

---

### HU-HUE-13 — Solicitar artículos

| Plataforma | Épica | Alcance | Nivel | Tamaño | Estado |
|---|---|---|---|---|---|
| App | Mi estadía | ALC-APP-05 | 1 | S | Pendiente |

**Historia**
- **Como** huésped alojado
- **Quiero** pedir artículos como toallas o almohadas desde la app
- **Para** recibirlos en mi habitación

**Criterios de aceptación**
1. Solo está disponible si la reserva está `En estadía`.
2. Se muestra la lista de artículos que se pueden pedir (toallas, almohadas, cobijas, papel higiénico, jabón, etc.).
3. El huésped elige uno o varios artículos y la cantidad de cada uno; cada artículo tiene una cantidad máxima y no se acepta una cantidad mayor.
4. La solicitud se crea en estado `Pendiente` y aparece al instante al personal de Limpieza.
5. Pedir artículos no descuenta inventario.

**Depende de:** HU-HUE-09
**Reglas relacionadas:** RN-APP-005, RN-LIM-006, RN-LIM-007, RN-NOT-008 (documento 10)
**Notas técnicas:** la lista de artículos y su cantidad máxima se cargan en los datos iniciales del sistema.

---

### HU-HUE-14 — Ver el estado de mis solicitudes

| Plataforma | Épica | Alcance | Nivel | Tamaño | Estado |
|---|---|---|---|---|---|
| App | Mi estadía | ALC-APP-05 | 1 | S | Pendiente |

**Historia**
- **Como** huésped
- **Quiero** ver el estado de mis solicitudes de limpieza y artículos
- **Para** saber si ya fueron atendidas

**Criterios de aceptación**
1. Se listan las solicitudes de la estadía con tipo, fecha, hora y estado: `Pendiente`, `En proceso`, `Atendida` o `Cancelada`.
2. La lista se actualiza al abrir la pantalla y al deslizar hacia abajo para recargar.
3. El huésped puede cancelar una solicitud mientras esté `Pendiente`; pasa a `Cancelada`.
4. Si la solicitud ya está `En proceso` o `Atendida`, no se puede cancelar y se muestra el motivo.

**Depende de:** HU-HUE-12, HU-HUE-13, HU-MYL-05
**Reglas relacionadas:** RN-LIM-003, RN-LIM-008 (documento 10)
**Notas técnicas:** el cambio de estado de una solicitud no es uno de los 4 eventos en tiempo real; el huésped se entera por la notificación push de HU-HUE-17.

---

### HU-HUE-15 — Ver mi cuenta

| Plataforma | Épica | Alcance | Nivel | Tamaño | Estado |
|---|---|---|---|---|---|
| App | Mi estadía | ALC-APP-07 | 1 | S | Pendiente |

**Historia**
- **Como** huésped
- **Quiero** ver mis consumos, pagos y saldo
- **Para** controlar mis gastos durante la estadía

**Criterios de aceptación**
1. Se muestra el cargo por alojamiento y cada cargo adicional (room service y servicios agregados por Recepción) con fecha, concepto y monto.
2. Los cargos anulados por Recepción se muestran marcados como anulados y no suman al saldo.
3. Se muestran los pagos con fecha, método, monto y estado.
4. Se muestra el saldo pendiente en quetzales (ej. Q 0.00 si la reserva se pagó en la web y no hay consumos). El saldo es la suma de los cargos `Vigente` menos la suma de los pagos `Aprobado`; los cargos `Anulado` y los pagos `Pendiente`, `Fallido` o `Reembolsado` no intervienen en ese cálculo.
5. La información es de solo lectura y se actualiza al abrir la pantalla y al deslizar para recargar.
6. El huésped solo ve la cuenta de sus propias reservas; una cuenta ajena es rechazada por el servidor.

**Depende de:** HU-HUE-09, HU-RS-06
**Reglas relacionadas:** RN-APP-013, RN-PAG-011, RN-PAG-021, RN-SEG-001, RN-SEG-006, RN-TAR-009 (documento 10)

---

### HU-HUE-16 — Pagar mi saldo y hacer check-out desde la app

| Plataforma | Épica | Alcance | Nivel | Tamaño | Estado |
|---|---|---|---|---|---|
| App | Mi estadía | ALC-APP-08 | 1 | L | Pendiente |

**Historia**
- **Como** huésped
- **Quiero** pagar mi saldo y hacer el check-out desde el teléfono
- **Para** retirarme del hotel sin hacer fila en recepción

**Criterios de aceptación**
1. Solo está disponible con la reserva `En estadía`, desde las 00:00 del día de salida hasta la hora de check-out (12:00, fija). Fuera de esa ventana se muestra el aviso de hacer el check-out en Recepción.
2. No se permite si hay un pedido `En camino`; se muestra el aviso de esperar la entrega. Si hay pedidos `Nuevo` o `En preparación`, se avisa que se cancelarán sin cargo y el huésped debe aceptarlo.
3. Si el saldo es mayor que cero, el huésped paga el saldo completo con Stripe (modo prueba) en un solo pago; el pago se da por hecho solo al llegar el webhook. Si el saldo ya es Q 0.00, se salta este paso.
4. El huésped indica su NIT (validado con su dígito verificador; el último dígito puede ser "K") o elige "Consumidor Final", y el nombre del comprador (por defecto, su nombre). Un NIT inválido se rechaza con un mensaje claro.
5. El check-out solo se confirma con saldo exactamente Q 0.00.
6. Al confirmar: se emite la factura, la reserva pasa a `Finalizada`, la cuenta a `Cerrada`, la habitación a `Libre` + `Sucia` (o `Fuera de servicio` si tiene una incidencia que impide su uso), las solicitudes `Pendiente` o `En proceso` pasan a `Cancelada` y los pedidos `Nuevo` o `En preparación` pasan a `Cancelado`. Estos cambios se completan en una sola operación. Si falla la emisión de la factura, no se aplican los cambios del check-out: la reserva sigue `En estadía` y la cuenta `Abierta`. El pago ya aprobado por Stripe se conserva y se puede reintentar el check-out; si el saldo sigue en Q 0.00, no se vuelve a cobrar.
7. La factura en PDF se envía al correo del huésped.
8. La app muestra una pantalla final con la factura (se puede abrir el PDF) y ya no permite hacer pedidos ni solicitudes.

**Depende de:** HU-HUE-15, HU-REC-15 (usa el mismo servicio de check-out del backend que HU-REC-14)
**Reglas relacionadas:** RN-APP-005, RN-APP-006, RN-APP-008, RN-FAC-005, RN-FAC-008, RN-HAB-008, RN-LIM-009, RN-PAG-001, RN-PAG-005, RN-PAG-013, RN-PAG-014, RN-RES-015, RN-RES-021, RN-RES-022, RN-RS-011 (documento 10)
**Notas técnicas:** el check-out de la app y el de Recepción deben usar el mismo servicio del backend para que los efectos sean idénticos.

---

### HU-HUE-17 — Recibir notificaciones en mi teléfono

| Plataforma | Épica | Alcance | Nivel | Tamaño | Estado |
|---|---|---|---|---|---|
| App | Mi estadía | ALC-APP-10 | 1 | M | Pendiente |

**Historia**
- **Como** huésped
- **Quiero** recibir notificaciones en mi teléfono
- **Para** enterarme de mis pedidos y solicitudes sin tener la app abierta

**Criterios de aceptación**
1. Al entrar a la app se pide permiso para enviar notificaciones; si el huésped lo rechaza, la app funciona igual.
2. Recibe una notificación cuando su pedido pasa a `Entregado`.
3. Recibe una notificación cuando su solicitud pasa a `Atendida`.
4. Solo recibe notificaciones mientras su reserva está `En estadía`.
5. Las notificaciones no muestran datos personales ni montos.
6. Al tocar la notificación se abre la pantalla del pedido o de la solicitud.
7. Si el envío de una notificación falla, el cambio de estado del pedido o la solicitud se guarda igual.
8. Al cerrar sesión o al finalizar la estadía, el teléfono deja de recibir notificaciones.

**Depende de:** HU-HUE-08, HU-RS-03, HU-MYL-05
**Reglas relacionadas:** RN-NOT-001, RN-NOT-002, RN-NOT-004 (documento 10)
**Notas técnicas:** Spring → Expo Push → FCM. Expo Go no recibe push: se prueba con un *development build*.

---

## Épica 3: Si da tiempo (Nivel 2)

### HU-HUE-18 — Ver las amenidades y el Wi-Fi

| Plataforma | Épica | Alcance | Nivel | Tamaño | Estado |
|---|---|---|---|---|---|
| App | Si da tiempo | ALC-APP-06 | 2 | S | Pendiente |

**Historia**
- **Como** huésped
- **Quiero** consultar las amenidades del hotel y los datos del Wi-Fi
- **Para** aprovechar los servicios durante mi estadía

**Criterios de aceptación**
1. Se listan las amenidades activas con nombre, foto, descripción, horario y ubicación.
2. Se muestran el nombre de la red Wi-Fi y su contraseña.
3. Las amenidades desactivadas por el Administrador no se muestran.
4. La información es visible para cualquier huésped con sesión, sin importar el estado de su reserva.
5. Si no hay amenidades registradas, se muestra un mensaje claro en lugar de una lista vacía.

**Depende de:** HU-HUE-08, HU-ADM-11
**Reglas relacionadas:** RN-APP-012 (documento 10)
