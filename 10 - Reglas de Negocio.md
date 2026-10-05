# 10 — Reglas de Negocio

> **Proyecto:** Property Management System (PMS) para Hoteles Boutique — Hotel ficticio "Villa Serena"
> **Estado:** 📝 Para revisión del equipo
> **Fecha:** 1 de octubre de 2026
> **Basado en:** 01 — Alcance y 04 — Historias de Usuario

## 1. Propósito y cómo leer este documento

Este documento reúne las reglas que ya aparecen en los criterios de aceptación de las historias de usuario. No agrega funcionalidades ni resuelve vacíos mediante reglas nuevas. El alcance y sus decisiones delimitan el trabajo.

Cada fila cita sus historias y criterios: **C2** significa criterio 2; **C1–C3**, criterios 1 a 3. Los IDs retirados no se reutilizan. Las referencias entre reglas complementan la lectura, pero no sustituyen la fuente citada.

Los códigos y transiciones de estados corresponden al documento **07 — Estados**; aquí se utilizan los códigos acordados y se expresan únicamente las condiciones exigidas por las HU, sin repetir diagramas ni tablas de transiciones. Las reglas de roles **R-ROL** corresponden al documento 02 y las generales de estados **RG-EST**, al 07; no se reproducen ni se cuentan en este documento.

Salvo las filas marcadas **Nivel 2**, las reglas corresponden a Nivel 1. Las condiciones que no están en los criterios, aunque aparezcan en notas, no se convierten en reglas normativas. Las dudas se registran en Observaciones para revisión.

## 2. Parámetros del sistema

Estos parámetros son constantes: el Administrador no los configura. Esto no impide editar los datos del hotel, precios, temporadas y catálogos que las HU sí permiten administrar. La cantidad máxima por artículo pertenece a su catálogo; no se inventa aquí un máximo numérico común.

Los IDs de parámetros no se reutilizan. PAR-20 (archivos) está en el documento 14 como validación técnica; PAR-21 (zona horaria) está en el documento 14, AD-19. PAR-18 (horario de Room Service) no existe, porque el servicio no tiene horario.


---

| # | Parámetro | Valor | Historias |
|---|---|---|---|
| PAR-01 | Hora de referencia de check-in | 15:00, fija; se permite antes si la habitación está lista | HU-HUE-01 (C2); HU-REC-12 (C4) |
| PAR-02 | Hora de check-out | 12:00, fija | HU-HUE-01 (C2); HU-HUE-16 (C1) |
| PAR-03 | Estadía mínima | 1 noche | HU-HUE-03 (C2); HU-REC-03 (C2); HU-CM-01 (C3) |
| PAR-04 | Estadía máxima | 30 noches | HU-HUE-03 (C2); HU-REC-03 (C2); HU-CM-01 (C3) |
| PAR-05 | Anticipación máxima de la entrada | 365 días desde hoy | HU-HUE-03 (C2); HU-REC-03 (C2); HU-CM-01 (C3) |
| PAR-06 | Plazo de pago de la reserva web | 30 minutos | HU-HUE-06 (C5) |
| PAR-07 | Umbral de reembolso total | 48 horas o más antes de las 15:00 del día de llegada | HU-REC-05 (C4) |
| PAR-10 | Moneda | Quetzales (GTQ) | HU-HUE-04 (C1); HU-HUE-15 (C4); HU-CM-01 (C1) |
| PAR-11 | Presentación de impuestos | Precio con impuestos incluidos; factura con “IVA incluido”, sin desglose ni tasas añadidas en este documento | HU-HUE-04 (C1); HU-REC-15 (C4) |
| PAR-12 | Redondeo del precio por noche | 2 decimales | HU-HUE-04 (C2); HU-REC-04 (C3) |
| PAR-13 | Noches de fin de semana | Viernes y sábado | HU-HUE-04 (C2); HU-ADM-07 (C2) |
| PAR-14 | OTP | 6 dígitos; vigencia de 10 minutos; un solo uso | HU-HUE-08 (C1, C2) |
| PAR-15 | Intentos fallidos del OTP y bloqueo | 5 intentos; bloqueo de 15 minutos | HU-HUE-08 (C4) |
| PAR-17 | Ventana del check-out en la app | 00:00 a 12:00 del día de salida | HU-HUE-16 (C1) |
| PAR-19 | Solicitudes de limpieza activas por habitación | Máximo 1 en `PENDIENTE` o `EN_PROCESO` | HU-HUE-12 (C4) |
| PAR-23 | Intentos de acceso del personal y bloqueo | 5 intentos fallidos seguidos; bloqueo de 15 minutos | HU-EMP-01 (C3) |
| PAR-24 | Contraseña del personal | Al menos 8 caracteres, una letra y un número; distinta de la actual | HU-EMP-02 (C3) |
| PAR-25 | Duración del token de acceso | 15 minutos (personal y app). Un empleado desactivado conserva su sesión abierta hasta que vence ese token | HU-HUE-08 (C6); HU-ADM-02 (C4) |
| PAR-26 | Refresh token de la app | 7 días; se renueva en cada uso | HU-HUE-08 (C6) |
| PAR-27 | Pago de la reserva web | 100 % del total | HU-HUE-06 (C1) |
| PAR-28 | Límite inferior de ajuste de tarifa | Mayor que −100 %, para temporada y fin de semana | HU-ADM-06 (C3); HU-ADM-07 (C4) |

---

## 3. Reservas — RN-RES

| ID | Regla | Historias |
|---|---|--- |
| RN-RES-001 | Antes de crear una reserva se revalida la disponibilidad; si ya no hay cupo, no se crea. | HU-HUE-05 (C5); HU-REC-04 (C4); HU-CM-01 (C4) |
| RN-RES-002 | Ocupan cupo las reservas `PENDIENTE_PAGO`, `CONFIRMADA` y `EN_ESTADIA`, tengan o no habitación asignada. La asignación no permite reservas activas traslapadas en la misma habitación y el backend vuelve a comprobarlo al guardar. | HU-HUE-03 (C4); HU-HUE-05 (C7); HU-REC-03 (C4); HU-REC-07 (C2, C3) |
| RN-RES-004 | La cancelación libera la disponibilidad y la habitación asignada; también se aplica al vencimiento del pago web. | HU-REC-05 (C5); HU-HUE-06 (C5) |
| RN-RES-005 | La estadía debe tener entre 1 y 30 noches; la salida debe ser posterior a la entrada. | HU-HUE-03 (C2); HU-REC-03 (C2); HU-REC-04 (C2); HU-CM-01 (C3) |
| RN-RES-006 | No se aceptan fechas pasadas ni una fecha de entrada a más de 365 días de hoy. | HU-HUE-03 (C2); HU-REC-03 (C2); HU-REC-04 (C2); HU-CM-01 (C3) |
| RN-RES-007 | Solo se ofrecen y reservan tipos `ACTIVO` cuya capacidad alcance para el número de huéspedes indicado. | HU-HUE-03 (C3); HU-REC-03 (C3); HU-REC-04 (C2); HU-CM-01 (C3) |
| RN-RES-008 | Disponibilidad de un tipo en cada noche = habitaciones `ACTIVO` del tipo que no estén `FUERA_DE_SERVICIO` − reservas del tipo en `PENDIENTE_PAGO`, `CONFIRMADA` o `EN_ESTADIA` que ocupen esa noche, con o sin habitación asignada. Solo se ofrece el tipo si queda al menos 1 habitación en todas las noches del rango. | HU-HUE-03 (C4, C5); HU-REC-03 (C4) |
| RN-RES-009 | La reserva tiene un código único no secuencial, que se incluye en su confirmación por correo; la reserva de canal recibe un código propio del hotel. | HU-HUE-05 (C6); HU-REC-04 (C5); HU-CM-01 (C6, C7); HU-HUE-07 (C2) |
| RN-RES-010 | Toda reserva recibe automáticamente uno de estos canales de origen: `DIRECTO_WEB`, `RECEPCION`, `BOOKING` o `EXPEDIA`. El canal no se edita; las reservas externas conservan además su identificador externo. | HU-CM-02 (C1, C4); HU-HUE-05 (C6); HU-REC-04 (C5); HU-CM-01 (C6) |
| RN-RES-011 | La reserva web nace `PENDIENTE_PAGO`; las de Recepción y canal nacen `CONFIRMADA`. Recepción registra quién creó la reserva. | HU-HUE-05 (C6); HU-REC-04 (C5); HU-CM-01 (C6) |
| RN-RES-012 | Si no se paga en 30 minutos, la reserva web se cancela automáticamente y el pago queda `FALLIDO` al vencer la sesión sin pagarse. Antes de cancelarla se consulta la sesión de Stripe: si ya estaba pagada, se confirma en lugar de cancelarse. | HU-HUE-06 (C4, C5) |
| RN-RES-013 | Solo se asigna o cambia habitación antes del check-in, con la reserva `PENDIENTE_PAGO` o `CONFIRMADA`. Debe ser del mismo tipo reservado, no estar `FUERA_DE_SERVICIO` y no tener traslapes; no necesita estar `LIMPIA` para asignarse. El cambio registra fecha, hora y responsable. | HU-REC-07 (C1–C5); HU-REC-04 (C2) |
| RN-RES-014 | El check-in requiere reserva `CONFIRMADA`, habitación asignada `LIBRE` + `LIMPIA` y que hoy esté entre la fecha de entrada y el día anterior a la salida. Las noches no usadas se cobran igual. La hora fija de referencia es 15:00, pero se permite entrar antes si la habitación cumple las condiciones. Se registran fecha, hora y recepcionista. | HU-REC-12 (C1, C3–C5); HU-HUE-01 (C2) |
| RN-RES-015 | El check-out solo se confirma con reserva `EN_ESTADIA` y saldo exactamente 0. | HU-REC-14 (C1, C5); HU-HUE-16 (C1, C5) |
| RN-RES-018 | El cliente no modifica la reserva después de crearla. Para cambiar fechas, Recepción cancela y crea otra; el Gantt no permite arrastrar ni estirar reservas. La asignación o cambio de habitación anterior al check-in se rige por RN-RES-013. | HU-HUE-05 (C9); HU-REC-08 (C8); HU-REC-07 (C1) |
| RN-RES-019 | El huésped principal requiere nombre completo, correo, teléfono, nacionalidad, tipo de documento (DPI o pasaporte) y número de documento. El correo debe tener formato válido e identifica al huésped: si ya existe, se utiliza ese perfil sin cambiar sus datos ni crear otro. Los mismos 6 datos son obligatorios en web, Recepción y canal. | HU-HUE-05 (C1–C3); HU-REC-01 (C1–C4); HU-CM-01 (C1) |
| RN-RES-020 | Solo se agregan huéspedes adicionales a reservas `CONFIRMADA` o `EN_ESTADIA`, con nombre, tipo y número de documento y nacionalidad. Principal y adicionales no pueden superar el número de huéspedes de la reserva. | HU-REC-02 (C1, C2) |
| RN-RES-021 | Al confirmar el check-out se emite la factura, la reserva queda `FINALIZADA` y la cuenta `CERRADA`. Los efectos sobre habitación, pedidos y solicitudes son los de RN-HAB-008, RN-RS-011 y RN-LIM-009, tanto desde Recepción como desde la app. | HU-REC-14 (C5, C6); HU-HUE-16 (C6) |
| RN-RES-022 | El cierre de la estadía se completa en una sola operación. Si falla, por ejemplo al emitir la factura, no se aplican los cambios del check-out: la reserva sigue `EN_ESTADIA` y la cuenta `ABIERTA`. En Recepción tampoco se registra el pago de esa operación. Los pagos aprobados previamente, incluidos los de Stripe, se conservan; en la app se puede reintentar el check-out y, si el saldo sigue en 0, no se vuelve a cobrar. | HU-REC-14 (C7); HU-HUE-16 (C3, C6) |
| RN-RES-023 | “Llegan hoy” incluye reservas `CONFIRMADA` con entrada hoy; “Salen hoy”, reservas `EN_ESTADIA` con salida hoy. Desde el detalle solo se ofrecen acciones válidas para el estado actual. | HU-REC-06 (C2, C3, C6) |
| RN-RES-024 | El Gantt muestra reservas activas y finalizadas, excluye las `CANCELADA` y mantiene una fila para las que no tienen habitación asignada. Se actualiza al abrir o volver a la pantalla. | HU-REC-08 (C1, C2, C7) |
| RN-RES-025 | **Nivel 2.** Crear una reserva seleccionando días en el Gantt no permite rangos traslapados ni habitaciones `FUERA_DE_SERVICIO`; aplica las mismas reglas de noches, capacidad, tarifa y revalidación de disponibilidad de la creación en Recepción. | HU-REC-09 (C1–C3) |

---

## 4. Habitaciones — RN-HAB

| ID | Regla | Historias |
|---|---|--- |
| RN-HAB-001 | Las habitaciones `FUERA_DE_SERVICIO` no cuentan para la disponibilidad ni se ofrecen para asignación. | HU-HUE-03 (C4); HU-REC-07 (C2); HU-MYL-06 (C4) |
| RN-HAB-002 | Si una incidencia impide el uso de una habitación `OCUPADA`, se muestra “Incidencia pendiente”; el huésped sigue en la misma habitación y se repara con él alojado. Al check-out queda `FUERA_DE_SERVICIO` si la incidencia sigue impidiendo su uso. | HU-MYL-06 (C5); HU-REC-14 (C5); HU-REC-07 (C1) |
| RN-HAB-003 | Una habitación `FUERA_DE_SERVICIO` pasa a `SUCIA` al resolverse la incidencia que la bloquea, solo si no queda otra que impida usarla; entra a la lista de limpieza. | HU-MYL-08 (C4) |
| RN-HAB-004 | La ocupación, `LIBRE` u `OCUPADA`, cambia con el check-in y el check-out; Recepción no la cambia a mano. | HU-REC-11 (C2); HU-REC-12 (C5); HU-REC-14 (C5) |
| RN-HAB-005 | Recepción no puede marcar una habitación `LIMPIA`; lo hace Limpieza, y solo el empleado a cargo puede terminar una habitación `EN_LIMPIEZA`. | HU-REC-11 (C2); HU-MYL-03 (C1, C2) |
| RN-HAB-006 | Para dejar una habitación `FUERA_DE_SERVICIO` se reporta una incidencia que impida su uso. Si está `LIBRE`, esa incidencia cambia su condición; un daño que no impide usarla no cambia la condición. | HU-REC-11 (C3); HU-REC-17 (C3, C5); HU-MYL-06 (C4) |
| RN-HAB-007 | El número de habitación es único. Solo se cambia su tipo si no tiene reservas `PENDIENTE_PAGO`, `CONFIRMADA` o `EN_ESTADIA` asignadas. Solo se desactiva si no está `OCUPADA` y no tiene reservas activas asignadas. | HU-ADM-04 (C2, C4, C5) |
| RN-HAB-008 | El check-out deja la habitación `LIBRE` + `SUCIA`, o `LIBRE` + `FUERA_DE_SERVICIO` si tiene una incidencia que impide su uso. | HU-REC-14 (C5); HU-HUE-16 (C6) |
| RN-HAB-009 | El tipo de habitación exige nombre obligatorio y único, capacidad mínima de 1 y precio base mayor que cero; si no se cumple, no se guarda. | HU-ADM-03 (C1, C3) |
| RN-HAB-010 | Un tipo `INACTIVO` no aparece en el catálogo público ni admite reservas nuevas; conserva sus reservas existentes. | HU-ADM-03 (C5); HU-HUE-02 (C1, C4) |
| RN-HAB-011 | Una habitación se registra con número, piso y tipo `ACTIVO`; nace `LIBRE` + `LIMPIA` y suma a la disponibilidad de su tipo. | HU-ADM-04 (C1, C3) |
| RN-HAB-012 | Una habitación `INACTIVO` no cuenta para la disponibilidad ni aparece para asignar; puede reactivarse. | HU-ADM-04 (C6) |
| RN-HAB-013 | Recepción solo marca `SUCIA` una habitación `LIBRE` + `LIMPIA`. En otro caso la opción no aparece y el backend rechaza la acción. El cambio registra fecha, hora y responsable. | HU-REC-11 (C1, C4) |
| RN-HAB-014 | Los indicadores de habitación son: “Llega hoy”, por reserva asignada `CONFIRMADA` con entrada hoy; “Sale hoy”, por reserva `EN_ESTADIA` con salida hoy; e “Incidencia pendiente”, por habitación `OCUPADA` con una incidencia sin resolver que impide su uso. La incidencia de una habitación `FUERA_DE_SERVICIO` se consulta en solo lectura. | HU-REC-10 (C2, C5) |

---

## 5. Tarifas — RN-TAR

| ID | Regla | Historias |
|---|---|--- |
| RN-TAR-001 | Precio de cada noche = precio base del tipo × (1 + porcentaje de temporada vigente) × (1 + porcentaje de fin de semana, cuando corresponda). | HU-HUE-04 (C2); HU-REC-04 (C3) |
| RN-TAR-002 | El ajuste de fin de semana se aplica a las noches de viernes y sábado. | HU-HUE-04 (C2); HU-REC-04 (C3); HU-ADM-07 (C2) |
| RN-TAR-003 | No se permiten temporadas traslapadas para un mismo tipo de habitación; se indica cuál está en conflicto. | HU-ADM-06 (C4) |
| RN-TAR-004 | El precio base debe ser mayor que cero y los ajustes de temporada y fin de semana deben ser mayores que −100 %; no se guardan valores que incumplan estas condiciones. | HU-ADM-03 (C3); HU-ADM-06 (C3); HU-ADM-07 (C4) |
| RN-TAR-005 | Los precios de alojamiento incluyen impuestos. La factura muestra el total con “IVA incluido”, sin desglose de impuestos. | HU-HUE-02 (C2); HU-HUE-04 (C1); HU-REC-15 (C4) |
| RN-TAR-006 | Cada noche se redondea a 2 decimales y el total de la estadía es la suma de las noches. Antes de reservar se muestra el desglose por noche con sus ajustes. | HU-HUE-04 (C2, C3); HU-REC-04 (C3) |
| RN-TAR-007 | El precio queda fijo al crear la reserva; Stripe cobra ese total. Los cambios del precio base, temporadas o ajuste de fin de semana solo afectan reservas nuevas. | HU-HUE-05 (C6); HU-HUE-04 (C5); HU-REC-04 (C3); HU-ADM-03 (C4); HU-ADM-06 (C5); HU-ADM-07 (C5) |
| RN-TAR-008 | El precio de la reserva directa se calcula en el servidor; el navegador lo muestra. La reserva de canal usa el monto de RN-TAR-010. | HU-HUE-04 (C4); HU-REC-04 (C3); HU-CM-01 (C6) |
| RN-TAR-009 | Los precios, cargos, pagos, saldos e ingresos definidos en estas historias se expresan en quetzales (GTQ). | HU-HUE-04 (C1); HU-REC-13 (C1); HU-HUE-15 (C4); HU-CM-01 (C1); HU-ADM-09 (C3) |
| RN-TAR-010 | En una reserva de canal, el cargo por alojamiento es el monto enviado por el canal; se muestra como una sola línea, en lugar del detalle por noche. | HU-CM-01 (C6); HU-REC-13 (C1) |
| RN-TAR-011 | Una temporada tiene nombre, inicio, fin y porcentaje de ajuste; puede aplicarse a todos los tipos o a los seleccionados. El fin no puede ser anterior al inicio. Se puede editar o eliminar sin alterar reservas existentes. | HU-ADM-06 (C1–C3, C5) |
| RN-TAR-012 | El ajuste de fin de semana se define por tipo de habitación; su valor predeterminado es 0 % y se combina con la temporada mediante RN-TAR-001. | HU-ADM-07 (C1, C3) |

---

## 6. Pagos y cuenta — RN-PAG

| ID | Regla | Historias |
|---|---|--- |
| RN-PAG-001 | El pago en línea se confirma con el webhook de Stripe, no con la redirección del navegador. En la reserva web, ese evento deja la reserva `CONFIRMADA` y el pago `APROBADO`. La app también espera el webhook para dar por hecho el pago. | HU-HUE-06 (C2); HU-HUE-16 (C3) |
| RN-PAG-002 | Si un webhook del pago de la reserva llega dos veces, el pago se registra una sola vez. | HU-HUE-06 (C3) |
| RN-PAG-003 | Para el pago de la reserva existe una sola sesión de Stripe. Un intento rechazado o cerrar la página no cambia el pago: sigue `PENDIENTE` y puede reintentarse con el mismo enlace mientras la reserva siga `PENDIENTE_PAGO`. El pago pasa a `FALLIDO` cuando la sesión vence sin pagarse. Los reintentos no duplican pagos. | HU-HUE-06 (C3, C4) |
| RN-PAG-004 | El pago web se realiza en la página de Stripe; el sistema nunca recibe ni guarda los datos de tarjeta. | HU-HUE-06 (C1) |
| RN-PAG-005 | Stripe se usa en modo prueba para pagar la reserva web y el saldo desde la app. | HU-HUE-06 (C1); HU-HUE-16 (C3) |
| RN-PAG-006 | La reserva web se paga al 100 % del total. | HU-HUE-06 (C1) |
| RN-PAG-007 | Recepción no cobra por adelantado al crear la reserva: el saldo completo se paga en el check-out. | HU-REC-04 (C6); HU-REC-14 (C3) |
| RN-PAG-008 | Al recibir una reserva de canal se registra un pago `APROBADO`, con método `CANAL`, por el mismo monto que su cargo de alojamiento. | HU-CM-01 (C6) |
| RN-PAG-009 | Junto con la reserva se crea su cuenta `ABIERTA` con el cargo por alojamiento. | HU-HUE-05 (C8); HU-REC-04 (C6); HU-CM-01 (C6) |
| RN-PAG-010 | Solo se agregan cargos adicionales con reserva `EN_ESTADIA` y cuenta `ABIERTA`; el backend rechaza agregarlos en otro caso. | HU-REC-13 (C2); HU-RS-06 (C3) |
| RN-PAG-011 | Los cargos no se borran. Recepción puede anular un cargo adicional registrado por error con motivo obligatorio; queda visible como `ANULADO`, con responsable, y deja de sumar al saldo. El alojamiento no se anula. | HU-REC-13 (C5, C6); HU-HUE-15 (C2) |
| RN-PAG-013 | En el check-out, si hay saldo se paga completo en una sola operación de pago, sin abonos; si el saldo es 0, no se solicita pago. Recepción pide método y permite referencia opcional; la app cobra por Stripe. | HU-REC-14 (C3); HU-HUE-16 (C3) |
| RN-PAG-014 | Los métodos son `STRIPE` para pagos en línea, `CANAL` para reservas externas y `EFECTIVO`, `TARJETA` u `OTRO` para pagos registrados en Recepción. | HU-HUE-06 (C1); HU-HUE-16 (C3); HU-CM-01 (C6); HU-REC-14 (C3) |
| RN-PAG-019 | Un cargo manual requiere concepto, cantidad y precio unitario; cantidad y precio deben ser mayores que cero. El total se calcula automáticamente y se registran fecha, hora y responsable. | HU-REC-13 (C3, C4) |
| RN-PAG-020 | Con la cuenta `CERRADA` no se agregan ni anulan cargos. | HU-REC-13 (C6) |
| RN-PAG-021 | Saldo = suma de los cargos `VIGENTE` − suma de los pagos `APROBADO`. Los cargos `ANULADO` y los pagos `PENDIENTE`, `FALLIDO` o `REEMBOLSADO` no intervienen en el cálculo. | HU-HUE-15 (C4); HU-REC-13 (C1) |

---

## 7. Cancelación — RN-CAN

| ID | Regla | Historias |
|---|---|--- |
| RN-CAN-001 | Recepción solo cancela manualmente reservas `CONFIRMADA`, con motivo obligatorio; en otro estado el backend rechaza la acción. Las `PENDIENTE_PAGO` se cancelan automáticamente según RN-RES-012. | HU-REC-05 (C1, C3) |
| RN-CAN-002 | Con 48 horas o más antes de las 15:00 del día de llegada, la cancelación devuelve el total pagado en línea por Stripe. | HU-REC-05 (C4) |
| RN-CAN-006 | Si la reserva no tiene pagos, no hay nada que reembolsar. | HU-REC-05 (C4) |
| RN-CAN-008 | Cuando corresponde reembolso, se solicita a Stripe y el pago queda `REEMBOLSADO`. Si Stripe lo rechaza, la reserva no se cancela y se muestra el error. | HU-REC-05 (C6) |
| RN-CAN-011 | Con menos de 48 horas antes de las 15:00 del día de llegada no hay reembolso. Antes de confirmar se informa qué ocurrirá con el dinero. | HU-REC-05 (C4) |
| RN-CAN-012 | Las reservas de canal no se cancelan desde el sistema: no se ofrece la opción y cualquier intento por otra vía se rechaza. | HU-REC-05 (C2); HU-CM-02 (C5) |
| RN-CAN-013 | Al cancelar, la reserva queda `CANCELADA` y la cuenta se cierra tal como está, `CERRADA`; se libera la habitación asignada y la disponibilidad. Se registran fecha, hora, responsable y motivo. El vencimiento del pago aplica los mismos efectos sobre cuenta y disponibilidad. | HU-REC-05 (C5); HU-HUE-06 (C5) |

---

## 8. Room Service — RN-RS

| ID | Regla | Historias |
|---|---|--- |
| RN-RS-001 | Room Service avanza el pedido en el orden definido para `NUEVO`, `EN_PREPARACION`, `EN_CAMINO` y `ENTREGADO`, un paso por acción. Un pedido `ENTREGADO` no se modifica. | HU-RS-03 (C1, C7) |
| RN-RS-002 | No se permite saltar ni retroceder estados. Si otro empleado ya cambió el pedido, se avisa y se recarga su estado actual. Cada cambio registra fecha, hora y responsable. | HU-RS-03 (C2–C4) |
| RN-RS-003 | Room Service puede cancelar pedidos `NUEVO`, `EN_PREPARACION` o `EN_CAMINO`, siempre con motivo. Se registran fecha, hora, empleado y motivo; un pedido `ENTREGADO` no se cancela. | HU-RS-04 (C1–C3, C6) |
| RN-RS-004 | Un pedido `CANCELADO` no se reactiva ni genera cargo; el huésped ve la cancelación y su motivo. | HU-RS-04 (C3–C5); HU-HUE-11 (C3) |
| RN-RS-005 | Los ítems `AGOTADO` se muestran como no disponibles y no se pueden pedir. Si un ítem se agota mientras se arma el pedido, el servidor rechaza el pedido completo e indica qué ítem quitar. Los pedidos ya creados no se modifican. | HU-HUE-10 (C3, C7); HU-RS-05 (C3, C4, C6); HU-ADM-05 (C4) |
| RN-RS-006 | Solo se crean pedidos con reserva `EN_ESTADIA`; nacen `NUEVO` y sus precios quedan congelados en ese momento. | HU-HUE-10 (C1, C6); HU-RS-02 (C1); HU-ADM-05 (C6) |
| RN-RS-007 | Al pasar a `ENTREGADO`, el pedido genera un solo cargo en la cuenta `ABIERTA` de la reserva `EN_ESTADIA`, aunque la entrega se reciba dos veces. El monto suma precio congelado × cantidad de cada ítem y el concepto es “Room Service — Pedido #n”. Room Service no edita ni anula el cargo; Recepción puede anularlo con motivo. | HU-RS-06 (C1–C4, C6); HU-RS-03 (C6) |
| RN-RS-008 | Room Service puede marcar un ítem `DISPONIBLE` como `AGOTADO`, registrando fecha, hora y empleado. Solo `ADMIN` lo reactiva a `DISPONIBLE`. | HU-RS-05 (C2, C5); HU-ADM-05 (C3) |
| RN-RS-010 | El huésped no puede cancelar ni modificar pedidos desde la app. | HU-HUE-11 (C5); HU-RS-04 (C5) |
| RN-RS-011 | Un pedido `EN_CAMINO` bloquea el check-out en Recepción y en la app. Al confirmar la salida, los pedidos `NUEVO` o `EN_PREPARACION` se cancelan sin cargo; en la app se avisa y el huésped debe aceptarlo. | HU-REC-14 (C2, C6); HU-HUE-16 (C2, C6) |
| RN-RS-012 | La cola solo incluye `NUEVO`, `EN_PREPARACION` y `EN_CAMINO`, del más antiguo al más reciente. Los pedidos `ENTREGADO` y `CANCELADO` salen de ella. Al reconectarse, se vuelve a cargar la cola completa. | HU-RS-01 (C1, C2, C5, C7) |
| RN-RS-013 | El ítem del menú requiere precio mayor que cero; desactivarlo lo oculta del menú. Cambiar su precio no altera los pedidos ya creados. | HU-ADM-05 (C2, C5, C6) |

---

## 9. Limpieza y solicitudes — RN-LIM

| ID | Regla | Historias |
|---|---|--- |
| RN-LIM-001 | Solo se inicia la limpieza de una habitación `SUCIA`; queda `EN_LIMPIEZA`, a nombre del empleado, con fecha y hora. Si otro empleado la inició, se rechaza la acción. Solo quien la tiene a cargo puede interrumpirla: vuelve a `SUCIA` y queda disponible para otro compañero. | HU-MYL-02 (C1–C4) |
| RN-LIM-002 | Solo el empleado a cargo termina una habitación `EN_LIMPIEZA`; queda `LIMPIA`, se registran fecha, hora y empleado, y sale de pendientes. | HU-MYL-03 (C1–C3) |
| RN-LIM-003 | La app lista las solicitudes de la estadía con tipo, fecha, hora y estado, incluidas las `ATENDIDA` y `CANCELADA`. La lista se actualiza al abrirla o al recargarla. | HU-HUE-14 (C1, C2) |
| RN-LIM-004 | Las habitaciones `OCUPADA` no aparecen en la lista de habitaciones pendientes de limpieza; solo se limpian cuando el huésped lo solicita. | HU-MYL-01 (C5) |
| RN-LIM-005 | Solo puede existir una solicitud `LIMPIEZA` en `PENDIENTE` o `EN_PROCESO` por habitación. Si ya existe, se rechaza otra. | HU-HUE-12 (C4) |
| RN-LIM-006 | Solo se crean solicitudes con reserva `EN_ESTADIA`; nacen `PENDIENTE`. | HU-HUE-12 (C1, C3); HU-HUE-13 (C1, C4) |
| RN-LIM-007 | Cada artículo solicitado tiene una cantidad máxima; no se acepta una cantidad mayor. Pedir y entregar artículos no descuenta inventario. | HU-HUE-13 (C3, C5); HU-MYL-05 (C3) |
| RN-LIM-008 | El huésped solo cancela solicitudes `PENDIENTE`, que quedan `CANCELADA`; no puede cancelar las `EN_PROCESO` o `ATENDIDA`. | HU-HUE-14 (C3, C4) |
| RN-LIM-009 | En el check-out se cancelan las solicitudes `PENDIENTE` y `EN_PROCESO`, tanto desde Recepción como desde la app. | HU-REC-14 (C6); HU-HUE-16 (C6) |
| RN-LIM-010 | La lista de limpieza muestra habitaciones `SUCIA` o `EN_LIMPIEZA`, excluye `FUERA_DE_SERVICIO` y prioriza las que tienen una reserva asignada con llegada hoy. El resto se ordena por el tiempo que llevan `SUCIA`. | HU-MYL-01 (C1, C3) |
| RN-LIM-011 | Las listas de limpieza y solicitudes son para personal con área `LIMPIEZA` o `AMBAS`; el área exclusivamente `MANTENIMIENTO` no tiene acceso a la lista de limpieza. | HU-MYL-01 (C6); HU-MYL-04 (C7) |
| RN-LIM-013 | Crear o tomar una solicitud de limpieza del huésped no cambia la condición de la habitación. | HU-HUE-12 (C5); HU-MYL-04 (C6) |
| RN-LIM-014 | La lista de solicitudes pendientes de atención contiene `PENDIENTE` y `EN_PROCESO`, por antigüedad. Al tomar una `PENDIENTE`, queda `EN_PROCESO` a nombre del empleado, con fecha y hora. Si ya fue tomada o cancelada, se informa y actualiza la lista. | HU-MYL-04 (C1, C4, C5) |
| RN-LIM-015 | Solo el empleado a cargo marca `ATENDIDA` una solicitud `EN_PROCESO`; se registran fecha, hora y empleado, y sale de la lista de atención. Si ya fue cancelada, no puede marcarse atendida. | HU-MYL-05 (C1, C2, C5) |

---

## 10. Mantenimiento — RN-MAN

| ID | Regla | Historias |
|---|---|--- |
| RN-MAN-001 | Recepción y cualquier área de Mantenimiento/Limpieza reportan daños indicando habitación, descripción y si impiden usarla; la foto es opcional. Sin habitación o descripción no se guarda. La incidencia nace `REPORTADA`, con fecha, hora y autor. | HU-REC-17 (C1, C2); HU-MYL-06 (C1–C3) |
| RN-MAN-002 | La incidencia se reporta, un técnico la toma y luego la resuelve: usa únicamente `REPORTADA`, `EN_PROCESO` y `RESUELTA`. Al resolverla ya no se modifica. | HU-MYL-06 (C3); HU-MYL-07 (C3); HU-MYL-08 (C3) |
| RN-MAN-005 | Si queda otra incidencia que impide usar una habitación, esta continúa `FUERA_DE_SERVICIO`; si está `OCUPADA`, solo se quita “Incidencia pendiente” cuando no queda ninguna que impida su uso. | HU-MYL-08 (C4, C5) |
| RN-MAN-006 | Al resolver la última incidencia que impide usar una habitación `FUERA_DE_SERVICIO`, se aplica RN-HAB-003. | HU-MYL-08 (C4) |
| RN-MAN-007 | Reportar, tomar y resolver una incidencia registra fecha, hora y responsable; el Administrador puede consultar el historial. | HU-MYL-06 (C3); HU-MYL-07 (C3); HU-MYL-08 (C3); HU-ADM-10 (C4) |
| RN-MAN-009 | Solo personal con área `MANTENIMIENTO` o `AMBAS` ve y toma incidencias en la lista técnica. Tomar una `REPORTADA` la deja `EN_PROCESO` a nombre del técnico; si otro ya la tomó, se rechaza. Solo el técnico a cargo puede resolverla. | HU-MYL-07 (C3–C5); HU-MYL-08 (C1) |
| RN-MAN-010 | Resolver una incidencia exige descripción de la solución; sin ella no se guarda. | HU-MYL-08 (C2) |
| RN-MAN-012 | La pantalla de incidencias de `ADMIN` es de solo lectura y no permite cambiar estados. | HU-ADM-10 (C5) |
| RN-MAN-013 | La lista técnica incluye incidencias `REPORTADA` y `EN_PROCESO`, por antigüedad. La consulta administrativa muestra primero esos estados, de la más reciente a la más antigua. | HU-MYL-07 (C1); HU-ADM-10 (C2) |

---

## 11. Personal y acceso del personal — RN-PER

| ID | Regla | Historias |
|---|---|--- |
| RN-PER-001 | `ADMIN` crea empleados y puede editar nombre, teléfono, rol y área, desactivarlos, reactivarlos o restablecer su contraseña. El alta registra nombre, correo, teléfono y rol. | HU-ADM-01 (C1); HU-ADM-02 (C2, C3, C6) |
| RN-PER-002 | Los empleados no se eliminan: se desactivan o reactivan; su nombre se conserva en los registros históricos. | HU-ADM-02 (C3) |
| RN-PER-005 | Un Administrador no puede desactivarse ni cambiarse el rol a sí mismo. | HU-ADM-02 (C5) |
| RN-PER-007 | El rol `MANTENIMIENTO_LIMPIEZA` exige área `LIMPIEZA`, `MANTENIMIENTO` o `AMBAS`; los demás roles no requieren área. | HU-ADM-01 (C2); HU-ADM-02 (C2) |
| RN-PER-008 | El correo de un empleado debe ser único entre empleados; si ya existe, no se crea la cuenta. | HU-ADM-01 (C3) |
| RN-PER-009 | Al crear un empleado queda `ACTIVO`; el sistema genera una contraseña temporal y la muestra a `ADMIN` una sola vez para entregarla personalmente. No se envía correo y no se puede volver a consultar esa contraseña. | HU-ADM-01 (C4–C6) |
| RN-PER-010 | Restablecer la contraseña genera otra temporal, visible una sola vez para `ADMIN`; la anterior deja de funcionar y se exige cambiar la temporal en el siguiente acceso. | HU-ADM-02 (C6) |
| RN-PER-011 | La contraseña temporal debe cambiarse antes de usar cualquier otra sección. Se solicitan contraseña actual, nueva y confirmación; se rechaza si la actual es incorrecta o la confirmación no coincide. | HU-EMP-01 (C5); HU-EMP-02 (C1, C2, C4) |
| RN-PER-012 | La contraseña nueva tiene al menos 8 caracteres, una letra y un número, y es distinta de la actual. Al guardarla, la anterior deja de funcionar. El empleado puede cambiarla posteriormente con las mismas reglas. | HU-EMP-02 (C3, C5, C6) |
| RN-PER-013 | El acceso del empleado usa correo y contraseña; ante credenciales incorrectas se muestra un mensaje genérico. Tras 5 intentos fallidos seguidos, se bloquea la cuenta 15 minutos, incluso con la contraseña correcta. El contador se reinicia al entrar correctamente. | HU-EMP-01 (C1–C3) |
| RN-PER-014 | Al desactivar a un empleado se impiden nuevos inicios y renovaciones de sesión. Una sesión abierta sigue hasta vencer su token de acceso, como máximo 15 minutos; no se comprueba la desactivación en cada acción. | HU-ADM-02 (C4); HU-EMP-01 (C4) |
| RN-PER-015 | Sin sesión, las páginas privadas llevan al inicio de sesión; con sesión, se rechaza el acceso a secciones de otro rol. Se puede cerrar sesión desde cualquier pantalla y después las páginas privadas vuelven a pedir acceso. | HU-EMP-01 (C1, C6, C7) |

---

## 12. Seguridad — RN-SEG

| ID | Regla | Historias |
|---|---|--- |
| RN-SEG-001 | El huésped solo consulta sus propias reservas y cuentas; el servidor rechaza registros ajenos. | HU-HUE-09 (C6); HU-HUE-15 (C6) |
| RN-SEG-002 | Room Service solo ve el nombre del huésped como dato personal; no ve correo, teléfono ni documento. Puede ver habitación y piso para entregar. | HU-RS-01 (C6); HU-RS-02 (C3) |
| RN-SEG-005 | Un empleado `INACTIVO` no inicia ni renueva sesión; la sesión ya abierta se rige por RN-PER-014. | HU-EMP-01 (C4); HU-ADM-02 (C4) |
| RN-SEG-006 | El backend rechaza las acciones o datos no autorizados expresamente en las historias: reservas y cuentas ajenas, cargos fuera de estadía o con cuenta cerrada, y cancelaciones no permitidas. Ocultar una opción no sustituye estos rechazos. | HU-HUE-09 (C6); HU-HUE-15 (C6); HU-REC-13 (C2, C6); HU-REC-05 (C1); HU-CM-02 (C5) |

---

## 13. App y acceso del huésped — RN-APP

| ID | Regla | Historias |
|---|---|--- |
| RN-APP-001 | El huésped entra con correo y OTP de 6 dígitos enviado por email; vence en 10 minutos y es de un solo uso. Si venció o fue usado, se rechaza y se puede pedir otro. | HU-HUE-08 (C1, C2) |
| RN-APP-002 | Tras 5 intentos fallidos de verificación del OTP, el acceso se bloquea 15 minutos. | HU-HUE-08 (C4) |
| RN-APP-003 | Si el correo no tiene reservas, se responde con un mensaje genérico que no revela si existe. | HU-HUE-08 (C3) |
| RN-APP-004 | Solo el huésped principal entra a la app con su correo; los huéspedes adicionales no tienen acceso. | HU-REC-02 (C3) |
| RN-APP-005 | Room service y solicitudes solo se habilitan con reserva `EN_ESTADIA`; el check-out exige además la ventana de RN-APP-008. | HU-HUE-09 (C5); HU-HUE-10 (C1); HU-HUE-12 (C1); HU-HUE-13 (C1); HU-HUE-16 (C1) |
| RN-APP-006 | Después del check-out, la app muestra la pantalla final con la factura, permite abrir su PDF y ya no permite pedidos ni solicitudes. | HU-HUE-16 (C8) |
| RN-APP-008 | El check-out en la app solo está disponible de las 00:00 del día de salida a las 12:00, hora fija de check-out. Fuera de esa ventana se indica hacerlo en Recepción. | HU-HUE-16 (C1); HU-HUE-01 (C2) |
| RN-APP-010 | La sesión de la app usa token de acceso de 15 minutos y refresh token de 7 días que se renueva en cada uso. Si no se abre la app en 7 días o se cierra sesión, se vuelve a entrar con OTP. | HU-HUE-08 (C6) |
| RN-APP-011 | Al entrar se vinculan todas las reservas hechas con ese correo, sin importar su origen. Si hay varias se ofrece un selector; si hay una `EN_ESTADIA`, se entra directamente a ella. La habitación se muestra cuando esté asignada; de lo contrario, “Por asignar”. | HU-HUE-08 (C5); HU-HUE-09 (C1, C2, C4) |
| RN-APP-012 | **Nivel 2.** Las amenidades exigen nombre para guardarse; pueden activarse, desactivarse y ordenarse. La app solo muestra las activas, junto con red y contraseña de Wi-Fi; cualquier huésped con sesión puede consultarlas, sin importar el estado de su reserva. | HU-ADM-11 (C1–C4); HU-HUE-18 (C1–C4) |
| RN-APP-013 | La cuenta en la app es de solo lectura; se actualiza al abrirla o al deslizar para recargar, e incluye cargos, anulaciones, pagos con estado y saldo. | HU-HUE-15 (C1–C5) |

---

## 14. Channel Manager — RN-CM

| ID | Regla | Historias |
|---|---|--- |
| RN-CM-001 | Cada petición incluye canal y clave; la clave se compara con el hash guardado. Si el canal no existe o la clave es incorrecta, se responde 401 y no se crea nada. | HU-CM-01 (C2) |
| RN-CM-003 | La API valida los mismos datos, fechas, capacidad, tipo activo y disponibilidad exigidos para reservas directas. Datos faltantes o inválidos devuelven 400; falta de disponibilidad devuelve 409. | HU-CM-01 (C1, C3, C4) |
| RN-CM-004 | El mismo identificador externo del mismo canal no crea otra reserva: se responde 200 con la existente. Una reserva nueva válida devuelve 201 con su código. | HU-CM-01 (C5, C6); HU-CM-03 (C6) |
| RN-CM-007 | El canal simulado envía la reserva a través de la API real con la clave del canal elegido; permite reenviar el mismo identificador para demostrar que no se duplica. Si la API rechaza, muestra el motivo y no crea nada. | HU-CM-03 (C3, C5, C6) |
| RN-CM-009 | Solo `ADMIN` accede al canal simulado; los demás roles reciben acceso denegado. Se elige `BOOKING` o `EXPEDIA`, se proporcionan tipo, fechas, huéspedes, los 6 datos del principal y monto, o se generan datos de prueba con identificador externo nuevo. | HU-CM-03 (C1, C2) |

---

## 15. Facturación — RN-FAC

| ID | Regla | Historias |
|---|---|--- |
| RN-FAC-001 | Se emite una sola factura por cuenta, únicamente en el check-out de Recepción o de la app y con saldo 0. No se permite una segunda factura para esa cuenta. | HU-REC-15 (C1) |
| RN-FAC-002 | La factura contiene datos del hotel, serie y número, fecha y hora, NIT o CF y nombre del comprador, código de reserva, cargos no anulados, total con “IVA incluido” sin desglose y pagos de la cuenta con método y monto de cada uno. | HU-REC-15 (C2, C4) |
| RN-FAC-004 | La numeración usa la serie fija cargada en los datos iniciales y el siguiente correlativo consecutivo sin saltos. La serie y su número inicial no se editan en la configuración. | HU-REC-15 (C3); HU-ADM-08 (C3) |
| RN-FAC-005 | En el check-out se elige NIT o “CF” (Consumidor Final) y se indica nombre del comprador, por defecto el del huésped. El NIT se valida con su dígito verificador, que puede ser “K”; si no es válido, no se continúa. | HU-REC-14 (C4); HU-HUE-16 (C4); HU-REC-15 (C2) |
| RN-FAC-007 | La factura se imprime en 80 mm o carta desde una vista del navegador preparada para ese formato. Solo se ofrece imprimir si hay factura `EMITIDA`. Se puede reimprimir desde la reserva, sin cambiar el estado y sin marca “COPIA”; en 80 mm no debe cortarse el contenido. | HU-REC-16 (C1–C5) |
| RN-FAC-008 | La factura queda `EMITIDA`, lleva “Factura de demostración — no válida ante la SAT”, se genera y guarda en PDF y se envía al correo del huésped. | HU-REC-15 (C4, C5); HU-HUE-16 (C7) |
| RN-FAC-009 | Una factura emitida no se modifica ni se anula; cambiar los datos del hotel no altera facturas anteriores. | HU-REC-15 (C6); HU-ADM-08 (C5) |
| RN-FAC-010 | Nombre comercial, razón social, NIT del hotel y dirección fiscal son obligatorios. El NIT se valida con su dígito verificador, que puede terminar en “K”; no se guardan campos vacíos ni NIT inválido. | HU-ADM-08 (C2) |
| RN-FAC-011 | La política de cancelación publicada se genera a partir de la regla de 48 horas antes de las 15:00 del día de llegada; no se edita libremente. | HU-ADM-08 (C4) |

---

## 16. Notificaciones y correos — RN-NOT

| ID | Regla | Historias |
|---|---|--- |
| RN-NOT-001 | El huésped solo recibe push mientras su reserva está `EN_ESTADIA`, por pedido `ENTREGADO` y por solicitud `ATENDIDA`. | HU-HUE-17 (C2–C4); HU-RS-03 (C6); HU-MYL-05 (C4) |
| RN-NOT-002 | La app pide permiso para push; si el huésped lo rechaza, sigue funcionando. Si un envío falla, el cambio de estado del pedido o solicitud se guarda igualmente. | HU-HUE-17 (C1, C7) |
| RN-NOT-003 | Si falla el correo de confirmación, se reintenta y el error se registra; la reserva sigue `CONFIRMADA`. | HU-HUE-07 (C5) |
| RN-NOT-004 | Las push no muestran datos personales ni montos; al cerrar sesión o finalizar la estadía, el teléfono deja de recibirlas. Al tocar una, se abre su pedido o solicitud. | HU-HUE-17 (C5, C6, C8) |
| RN-NOT-005 | La confirmación se envía automáticamente al quedar la reserva `CONFIRMADA`: por webhook en web, al crearla en Recepción o canal. Incluye código, fechas, tipo, número de huéspedes, total, horas 15:00 y 12:00, si ya está pagada o se cobra al check-out, enlace de descarga de la app e indicación de usar el mismo correo. | HU-HUE-07 (C1–C4); HU-CM-01 (C7); HU-REC-04 (C7) |
| RN-NOT-006 | El pedido nuevo aparece sin recargar en la cola de Room Service con aviso visual; el aviso muestra habitación, piso y hora, y abre el detalle al pulsarlo. | HU-HUE-10 (C6); HU-RS-01 (C4); HU-RS-07 (C1–C4) |
| RN-NOT-007 | Los cambios de estado de pedidos actualizan la cola y la app automáticamente; al recuperar la conexión se muestra el estado actual. | HU-RS-01 (C4, C7); HU-RS-03 (C5); HU-HUE-11 (C2, C6) |
| RN-NOT-008 | Una nueva solicitud de limpieza o artículos aparece sin recargar en la lista de Limpieza y genera un aviso visual. | HU-HUE-12 (C3); HU-HUE-13 (C4); HU-MYL-04 (C3) |
| RN-NOT-009 | Los cambios de estado de habitación se reflejan en tiempo real en Recepción y en la lista de limpieza. | HU-REC-10 (C4); HU-REC-11 (C4); HU-MYL-01 (C4); HU-MYL-02 (C5); HU-MYL-03 (C4); HU-MYL-06 (C6) |

---

## 17. Indicadores — RN-IND

| ID | Regla | Historias |
|---|---|--- |
| RN-IND-001 | Los ingresos son la suma de pagos `APROBADO` del rango elegido, en quetzales. Un pago `REEMBOLSADO` deja de sumar; no se resta por separado. | HU-ADM-09 (C3) |
| RN-IND-002 | La ocupación de hoy es habitaciones `OCUPADA` ÷ habitaciones activas, expresada en porcentaje; siempre corresponde a hoy. | HU-ADM-09 (C2) |
| RN-IND-003 | Las reservas por canal cuentan todas las creadas en el rango, incluidas las canceladas, agrupadas por origen. | HU-ADM-09 (C4) |
| RN-IND-004 | El rango de ingresos y reservas por canal es, por defecto, el mes actual; se rechaza un fin anterior al inicio. Sin datos se muestra 0. Solo `ADMIN` accede a los indicadores. | HU-ADM-09 (C5–C7) |

---

## 18. Si da tiempo — Nivel 2

Inventario y turnos se construyen solo si da tiempo, según el alcance. Su posible obligatoriedad sigue pendiente de confirmación con el ingeniero. Las otras reglas de Nivel 2 son RN-RES-025 (selección de días en el Gantt) y RN-APP-012 (amenidades y Wi-Fi), marcadas en sus áreas para conservar la agrupación por prefijo.


---

### Inventario — RN-INV

| ID | Regla | Historias |
|---|---|--- |
| RN-INV-001 | **Nivel 2.** El inventario es aislado: el stock solo cambia con movimientos manuales del Administrador; Room Service, limpieza, solicitudes y mantenimiento no lo modifican. | HU-ADM-13 (C7) |
| RN-INV-002 | **Nivel 2.** El stock no queda negativo; se rechaza una salida que supere el stock actual. | HU-ADM-13 (C3) |
| RN-INV-003 | **Nivel 2.** Cada movimiento registra fecha, hora, tipo, cantidad, motivo y responsable; se consulta el historial de cada producto. | HU-ADM-13 (C4) |
| RN-INV-005 | **Nivel 2.** Un producto con stock igual o menor al mínimo muestra “Stock bajo”; se puede filtrar por esa marca y por categoría. | HU-ADM-13 (C5) |
| RN-INV-010 | **Nivel 2.** El producto tiene nombre único, categoría, unidad y stock mínimo; comienza con stock cero y se puede desactivar. | HU-ADM-13 (C1, C6) |
| RN-INV-011 | **Nivel 2.** Las entradas aumentan el stock y las salidas lo disminuyen; ambas requieren cantidad mayor que cero y motivo obligatorio. | HU-ADM-13 (C2) |

---

### Turnos — RN-TUR

| ID | Regla | Historias |
|---|---|--- |
| RN-TUR-001 | **Nivel 2.** Un empleado no puede tener turnos traslapados; se rechaza la asignación que provoque el traslape. | HU-ADM-12 (C5) |
| RN-TUR-002 | **Nivel 2.** Solo se asignan turnos a empleados `ACTIVO`; no se asignan a `ADMIN` ni a empleados `INACTIVO`. | HU-ADM-12 (C3, C4) |
| RN-TUR-003 | **Nivel 2.** Los turnos son informativos, no restringen acceso al sistema ni aplican otras reglas. | HU-ADM-12 (C7) |
| RN-TUR-005 | **Nivel 2.** Un turno tiene nombre, hora de inicio y fin; puede cruzar medianoche. Se puede editar o desactivar; se asigna por una o varias fechas y se puede quitar la asignación. | HU-ADM-12 (C1–C3) |

---

## 19. Historia → reglas

Las 68 historias están incluidas. Esta tabla relaciona únicamente IDs RN; los parámetros se rastrean en la sección 2. Una historia puede contener requisitos de pantalla o entrega que no sean reglas de negocio; esos requisitos continúan definidos en la HU.

| Historia | Reglas |
|---|---|
| HU-HUE-01 | RN-RES-014, RN-APP-008 |
| HU-HUE-02 | RN-HAB-010, RN-TAR-005 |
| HU-HUE-03 | RN-RES-002, RN-RES-005, RN-RES-006, RN-RES-007, RN-RES-008, RN-HAB-001 |
| HU-HUE-04 | RN-TAR-001, RN-TAR-002, RN-TAR-005, RN-TAR-006, RN-TAR-007, RN-TAR-008, RN-TAR-009 |
| HU-HUE-05 | RN-RES-001, RN-RES-002, RN-RES-009, RN-RES-010, RN-RES-011, RN-RES-018, RN-RES-019, RN-TAR-007, RN-PAG-009 |
| HU-HUE-06 | RN-RES-004, RN-RES-012, RN-PAG-001, RN-PAG-002, RN-PAG-003, RN-PAG-004, RN-PAG-005, RN-PAG-006, RN-PAG-014, RN-CAN-013 |
| HU-HUE-07 | RN-RES-009, RN-NOT-003, RN-NOT-005 |
| HU-HUE-08 | RN-APP-001, RN-APP-002, RN-APP-003, RN-APP-010, RN-APP-011 |
| HU-HUE-09 | RN-SEG-001, RN-SEG-006, RN-APP-005, RN-APP-011 |
| HU-HUE-10 | RN-RS-005, RN-RS-006, RN-APP-005, RN-NOT-006 |
| HU-HUE-11 | RN-RS-004, RN-RS-010, RN-NOT-007 |
| HU-HUE-12 | RN-LIM-005, RN-LIM-006, RN-LIM-013, RN-APP-005, RN-NOT-008 |
| HU-HUE-13 | RN-LIM-006, RN-LIM-007, RN-APP-005, RN-NOT-008 |
| HU-HUE-14 | RN-LIM-003, RN-LIM-008 |
| HU-HUE-15 | RN-TAR-009, RN-PAG-011, RN-PAG-021, RN-SEG-001, RN-SEG-006, RN-APP-013 |
| HU-HUE-16 | RN-RES-015, RN-RES-021, RN-RES-022, RN-HAB-008, RN-PAG-001, RN-PAG-005, RN-PAG-013, RN-PAG-014, RN-RS-011, RN-LIM-009, RN-APP-005, RN-APP-006, RN-APP-008, RN-FAC-005, RN-FAC-008 |
| HU-HUE-17 | RN-NOT-001, RN-NOT-002, RN-NOT-004 |
| HU-HUE-18 | RN-APP-012 |
| HU-REC-01 | RN-RES-019 |
| HU-REC-02 | RN-RES-020, RN-APP-004 |
| HU-REC-03 | RN-RES-002, RN-RES-005, RN-RES-006, RN-RES-007, RN-RES-008 |
| HU-REC-04 | RN-RES-001, RN-RES-005, RN-RES-006, RN-RES-007, RN-RES-009, RN-RES-010, RN-RES-011, RN-RES-013, RN-TAR-001, RN-TAR-002, RN-TAR-006, RN-TAR-007, RN-TAR-008, RN-PAG-007, RN-PAG-009, RN-NOT-005 |
| HU-REC-05 | RN-RES-004, RN-CAN-001, RN-CAN-002, RN-CAN-006, RN-CAN-008, RN-CAN-011, RN-CAN-012, RN-CAN-013, RN-SEG-006 |
| HU-REC-06 | RN-RES-023 |
| HU-REC-07 | RN-RES-002, RN-RES-013, RN-RES-018, RN-HAB-001, RN-HAB-002 |
| HU-REC-08 | RN-RES-018, RN-RES-024 |
| HU-REC-09 | RN-RES-025 |
| HU-REC-10 | RN-HAB-014, RN-NOT-009 |
| HU-REC-11 | RN-HAB-004, RN-HAB-005, RN-HAB-006, RN-HAB-013, RN-NOT-009 |
| HU-REC-12 | RN-RES-014, RN-HAB-004 |
| HU-REC-13 | RN-TAR-009, RN-TAR-010, RN-PAG-010, RN-PAG-011, RN-PAG-019, RN-PAG-020, RN-PAG-021, RN-SEG-006 |
| HU-REC-14 | RN-RES-015, RN-RES-021, RN-RES-022, RN-HAB-002, RN-HAB-004, RN-HAB-008, RN-PAG-007, RN-PAG-013, RN-PAG-014, RN-RS-011, RN-LIM-009, RN-FAC-005 |
| HU-REC-15 | RN-TAR-005, RN-FAC-001, RN-FAC-002, RN-FAC-004, RN-FAC-005, RN-FAC-008, RN-FAC-009 |
| HU-REC-16 | RN-FAC-007 |
| HU-REC-17 | RN-HAB-006, RN-MAN-001 |
| HU-RS-01 | RN-RS-012, RN-SEG-002, RN-NOT-006, RN-NOT-007 |
| HU-RS-02 | RN-RS-006, RN-SEG-002 |
| HU-RS-03 | RN-RS-001, RN-RS-002, RN-RS-007, RN-NOT-001, RN-NOT-007 |
| HU-RS-04 | RN-RS-003, RN-RS-004, RN-RS-010 |
| HU-RS-05 | RN-RS-005, RN-RS-008 |
| HU-RS-06 | RN-PAG-010, RN-RS-007 |
| HU-RS-07 | RN-NOT-006 |
| HU-MYL-01 | RN-LIM-004, RN-LIM-010, RN-LIM-011, RN-NOT-009 |
| HU-MYL-02 | RN-LIM-001, RN-NOT-009 |
| HU-MYL-03 | RN-HAB-005, RN-LIM-002, RN-NOT-009 |
| HU-MYL-04 | RN-LIM-011, RN-LIM-013, RN-LIM-014, RN-NOT-008 |
| HU-MYL-05 | RN-LIM-007, RN-LIM-015, RN-NOT-001 |
| HU-MYL-06 | RN-HAB-001, RN-HAB-002, RN-HAB-006, RN-MAN-001, RN-MAN-002, RN-MAN-007, RN-NOT-009 |
| HU-MYL-07 | RN-MAN-002, RN-MAN-007, RN-MAN-009, RN-MAN-013 |
| HU-MYL-08 | RN-HAB-003, RN-MAN-002, RN-MAN-005, RN-MAN-006, RN-MAN-007, RN-MAN-009, RN-MAN-010 |
| HU-ADM-01 | RN-PER-001, RN-PER-007, RN-PER-008, RN-PER-009 |
| HU-ADM-02 | RN-PER-001, RN-PER-002, RN-PER-005, RN-PER-007, RN-PER-010, RN-PER-014, RN-SEG-005 |
| HU-ADM-03 | RN-HAB-009, RN-HAB-010, RN-TAR-004, RN-TAR-007 |
| HU-ADM-04 | RN-HAB-007, RN-HAB-011, RN-HAB-012 |
| HU-ADM-05 | RN-RS-005, RN-RS-006, RN-RS-008, RN-RS-013 |
| HU-ADM-06 | RN-TAR-003, RN-TAR-004, RN-TAR-007, RN-TAR-011 |
| HU-ADM-07 | RN-TAR-002, RN-TAR-004, RN-TAR-007, RN-TAR-012 |
| HU-ADM-08 | RN-FAC-004, RN-FAC-009, RN-FAC-010, RN-FAC-011 |
| HU-ADM-09 | RN-TAR-009, RN-IND-001, RN-IND-002, RN-IND-003, RN-IND-004 |
| HU-ADM-10 | RN-MAN-007, RN-MAN-012, RN-MAN-013 |
| HU-ADM-11 | RN-APP-012 |
| HU-ADM-12 | RN-TUR-001, RN-TUR-002, RN-TUR-003, RN-TUR-005 |
| HU-ADM-13 | RN-INV-001, RN-INV-002, RN-INV-003, RN-INV-005, RN-INV-010, RN-INV-011 |
| HU-CM-01 | RN-RES-001, RN-RES-005, RN-RES-006, RN-RES-007, RN-RES-009, RN-RES-010, RN-RES-011, RN-RES-019, RN-TAR-008, RN-TAR-009, RN-TAR-010, RN-PAG-008, RN-PAG-009, RN-PAG-014, RN-CM-001, RN-CM-003, RN-CM-004, RN-NOT-005 |
| HU-CM-02 | RN-RES-010, RN-CAN-012, RN-SEG-006 |
| HU-CM-03 | RN-CM-004, RN-CM-007, RN-CM-009 |
| HU-EMP-01 | RN-PER-011, RN-PER-013, RN-PER-014, RN-PER-015, RN-SEG-005 |
| HU-EMP-02 | RN-PER-011, RN-PER-012 |

---

## 20. Observaciones para revisión

Todas las observaciones quedaron resueltas: OBS-06 por los cambios aprobados por Joss y OBS-01 a OBS-05 y OBS-07 por las decisiones del 1 de octubre. Se contrastaron con el documento 07 el pago web (sección 5.3), el saldo (sección 5.1) y los efectos del check-out (R8 y sección 11).

| ID | Tema | Duda o diferencia |
|---|---|---|
| OBS-01 | Horario de Room Service — resuelta | Decisión del 1 de octubre: no hay horario; el servicio está siempre disponible y no se programa ninguna restricción. PAR-18 y RN-RS-009 quedan retirados. |
| OBS-02 | Archivos: tamaño y formatos — resuelta | Decisión del 1 de octubre: validación técnica en el documento 14 (solo imágenes JPG o PNG de hasta 5 MB), no regla de negocio. PAR-20 y RN-APP-009 quedan retirados de este documento. |
| OBS-03 | Zona horaria y almacenamiento de fechas — resuelta | Se conserva como decisión técnica en el documento 14, AD-19: fechas en UTC, mostradas y calculadas en America/Guatemala ("hoy", 48 horas, ventana del check-out y check-in). |
| OBS-04 | Daño en habitación ocupada — resuelta | Decisión del 1 de octubre: se corrigió HU-REC-17 (C4): "Si el daño impide usar la habitación y está `Ocupada`…". Coincide con HU-MYL-06 (C5) y RN-HAB-002. |
| OBS-05 | Cargo visible de inmediato — resuelta | Decisión del 1 de octubre: se corrigió HU-RS-06 (C5): el cargo queda registrado al instante y Recepción y el huésped lo ven al abrir o recargar la cuenta. No hay un quinto evento en tiempo real. |
| OBS-06 | Pago en la app y fallo de facturación — resuelta | Aplicado por aprobación de Joss: el pago de Recepción forma parte de la operación del check-out; un pago aprobado previamente por Stripe se conserva si falla la emisión de la factura. La reserva y la cuenta siguen abiertas y se puede reintentar el check-out sin volver a cobrar si el saldo sigue en 0. Alineado en RN-RES-022, HU-REC-14 (C7), HU-HUE-16 (C6) y documento 07 (R8 y sección 11). |
| OBS-07 | Decisiones documentadas fuera de criterios — resuelta | Decisión del 1 de octubre: las notas técnicas de las HU y la sección 7 del índice de HU son fuente válida. No se crean RN adicionales: esas decisiones ya están en los documentos 07, 11 y 12. |

---

## 21. Resumen

**Parámetros normativos: 21.** Los parámetros siguen separados de las reglas RN.

| Prefijo | Área | Nivel 1 | Nivel 2 | Total |
|---|---|---|---|---|
| RN-RES | Reservas | 21 | 1 | 22 |
| RN-HAB | Habitaciones | 14 | 0 | 14 |
| RN-TAR | Tarifas | 12 | 0 | 12 |
| RN-PAG | Pagos y cuenta | 16 | 0 | 16 |
| RN-CAN | Cancelación | 7 | 0 | 7 |
| RN-RS | Room Service | 12 | 0 | 12 |
| RN-LIM | Limpieza y solicitudes | 14 | 0 | 14 |
| RN-MAN | Mantenimiento | 9 | 0 | 9 |
| RN-PER | Personal y acceso del personal | 12 | 0 | 12 |
| RN-SEG | Seguridad | 4 | 0 | 4 |
| RN-APP | App y acceso del huésped | 10 | 1 | 11 |
| RN-CM | Channel Manager | 5 | 0 | 5 |
| RN-FAC | Facturación | 9 | 0 | 9 |
| RN-NOT | Notificaciones y correos | 9 | 0 | 9 |
| RN-IND | Indicadores | 4 | 0 | 4 |
| RN-INV | Inventario | 0 | 6 | 6 |
| RN-TUR | Turnos | 0 | 4 | 4 |
| **Total** |  | **158** | **12** | **170** |

Total: **170 reglas**, 21 parámetros normativos y 68 historias en la trazabilidad. El total no cuenta R-ROL, RG-EST, parámetros ni observaciones. Las reglas consolidan criterios presentes en las HU; no representan ampliación del alcance.
