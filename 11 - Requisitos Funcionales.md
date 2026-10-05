# 11 — Requisitos Funcionales

> **Proyecto:** Property Management System (PMS) para Hoteles Boutique — Hotel ficticio "Villa Serena"
> **Estado:** 📝 Para revisión del equipo
> **Fecha:** 1 de octubre de 2026
> **Basado en:** 01 — Alcance, 04 — Historias de Usuario, 07 — Estados, 09 — Matriz de Permisos y 10 — Reglas de Negocio

## 1. Propósito y cómo leer este documento

Define qué debe hacer el sistema por módulo, a partir del alcance y las 68 historias. Los criterios completos permanecen en cada HU; las restricciones se consultan en las RN citadas. Los documentos 02 y 08 complementan roles, personal, turnos e inventario. No agrega pantallas ni procesos al alcance.

| Columna | Significado |
|---|---|
| ID | Identificador estable. No se reutilizan los IDs retirados. |
| Requisito | Comportamiento verificable y sus condiciones principales. Los códigos de estado son los del documento 07. |
| Nivel | `1`: obligatorio en local para el 10 de octubre de 2026. `2`: solo si da tiempo tras completar Nivel 1. `Después`: infraestructura posterior al hito y anterior a la entrega final. `Fase 2`: fuera de V1; no se incorporan RF activos de ese nivel. |
| HU | IDs completos de historias o referencia expresa a la tarea técnica. |
| RN | IDs vigentes del documento 10; `—` cuando no existe una RN aplicable. No se usan aquí códigos de alcance como si fueran RN. |

Los roles son Administrador (`ADMIN`), Recepcionista (`RECEPCION`), Room Service (`ROOM_SERVICE`), Mantenimiento/Limpieza (`MANTENIMIENTO_LIMPIEZA`, abreviado `MYL` en el 09) y Huésped (`HUESPED`). Cliente público, canal, Stripe y sistema son actores, no nuevos roles. La web privada es para personal y la app Android para el huésped principal. El sistema opera para un hotel, en español y GTQ.

La trazabilidad de la sección 18 relaciona cada RF con el alcance. Grafana local, Docker local y el diseño de canales se consignan como tareas técnicas excluidas de RF, conforme a la instrucción expresa; ver OBS-RF-01. Los compromisos de infraestructura solicitados expresamente se reúnen al final de RF-SEG y conservan su nivel.

## 2. Reservas — RF-RES

| ID | Requisito | Nivel | HU | RN |
|---|---|---|---|---|
| RF-RES-001 | El sistema debe consultar disponibilidad por fechas y número de huéspedes usando el mismo cálculo en web, Recepción y API: habitaciones activas del tipo que no estén `FUERA_DE_SERVICIO`, menos reservas `PENDIENTE_PAGO`, `CONFIRMADA` o `EN_ESTADIA`, con o sin habitación asignada. Debe ofrecer solo tipos activos con capacidad y cupo en todas las noches; validar de 1 a 30 noches, sin fechas pasadas y entrada hasta 365 días, e informar si no hay opciones. En Recepción debe mostrar cuántas habitaciones quedan por cada tipo disponible. | 1 | HU-HUE-03, HU-REC-03, HU-CM-01 | RN-RES-005, RN-RES-006, RN-RES-007, RN-RES-008 |
| RF-RES-002 | Recepcionista debe poder crear una reserva con huésped principal, fechas, número de huéspedes y tipo, con habitación opcional según RF-HAB-002. El sistema debe revalidar disponibilidad al guardar y crearla `CONFIRMADA`, registrando al recepcionista; el saldo se cobra en el check-out. | 1 | HU-REC-04 | RN-RES-001, RN-RES-005, RN-RES-006, RN-RES-007, RN-RES-011, RN-PAG-007 |
| RF-RES-003 | El sistema debe impedir la sobreventa del cupo por tipo y los traslapes de reservas activas en una habitación, revalidando al crear la reserva o guardar la asignación. | 1 | HU-HUE-05, HU-REC-04, HU-REC-07, HU-CM-01 | RN-RES-001, RN-RES-002, RN-RES-008 |
| RF-RES-005 | Recepcionista debe poder cancelar únicamente reservas `CONFIRMADA` que no sean de canal, con motivo obligatorio y mostrando antes el efecto económico de RF-PAG-009. Al confirmar, la reserva debe quedar `CANCELADA`, la cuenta `CERRADA` tal como está y el cupo y la habitación asignada liberados, con fecha, hora y responsable. La ausencia del huésped se registra con el motivo "No se presentó". | 1 | HU-REC-05, HU-CM-02 | RN-CAN-001, RN-CAN-012, RN-CAN-013 |
| RF-RES-006 | Recepcionista debe poder buscar por nombre, documento, código y rango de fechas, filtrar por estado y canal, y abrir el detalle con huésped principal, adicionales, fechas, tipo, habitación, total, canal e historial de estados. Debe mostrar solo acciones válidas para el estado y un mensaje si no hay resultados. | 1 | HU-REC-06 | RN-RES-023 |
| RF-RES-007 | Recepcionista debe poder usar "Llegan hoy" para reservas `CONFIRMADA` con entrada hoy y acceso al check-in, y "Salen hoy" para reservas `EN_ESTADIA` con salida hoy, saldo y acceso al check-out. | 1 | HU-REC-06 | RN-RES-023 |
| RF-RES-008 | El sistema debe permitir reservar desde la web pública sin cuenta ni contraseña, mostrar el resumen antes del pago, revalidar disponibilidad y crear la reserva `PENDIENTE_PAGO`, con precio fijo y cupo ocupado. Los datos del principal se rigen por RF-HUE-001. | 1 | HU-HUE-05 | RN-RES-001, RN-RES-002, RN-RES-011, RN-TAR-007 |
| RF-RES-009 | El sistema debe revisar la reserva web a los 30 minutos: si la sesión de Stripe ya está pagada, debe confirmar la reserva y aprobar el pago; si venció sin pago, debe dejar reserva `CANCELADA`, pago `FALLIDO` y cuenta `CERRADA`, liberando el cupo y la habitación asignada. | 1 | HU-HUE-06 | RN-RES-012, RN-CAN-013 |
| RF-RES-010 | El sistema debe asignar a toda reserva un código único no secuencial y un origen ineditable: `DIRECTO_WEB`, `RECEPCION`, `BOOKING` o `EXPEDIA`; las externas deben conservar también su identificador del canal. | 1 | HU-HUE-05, HU-REC-04, HU-CM-01, HU-CM-02 | RN-RES-009, RN-RES-010 |
| RF-RES-012 | Recepcionista debe poder consultar el Gantt con habitaciones agrupadas por tipo, días en columnas y fila "Sin asignar"; barras de reservas activas y finalizadas, color por estado e ícono de canal; resumen y enlace al detalle al pulsar; navegación por semana, mes y "Hoy"; y botón "Nueva reserva". Debe actualizarse al abrir o volver, excluir `CANCELADA` y no permitir arrastrar ni estirar barras. | 1 | HU-REC-08 | RN-RES-018, RN-RES-024 |
| RF-RES-013 | Huésped debe poder consultar en la app las reservas asociadas a su correo de cualquier origen, con selector de código, fechas y estado; si tiene una `EN_ESTADIA`, debe abrirse directamente. La consulta no permite modificar ni cancelar reservas. | 1 | HU-HUE-09 | RN-APP-011, RN-SEG-001, RN-RES-018 |
| RF-RES-014 | El sistema debe enviar la confirmación al quedar la reserva `CONFIRMADA` en cualquiera de los tres orígenes, con código, fechas, tipo, huéspedes, total, horarios fijos, situación de pago, enlace de descarga de la app e instrucción de usar el mismo correo. Si el envío falla, debe registrar el error y reintentar sin desconfirmar la reserva. | 1 | HU-HUE-07, HU-REC-04, HU-CM-01 | RN-NOT-003, RN-NOT-005 |
| RF-RES-015 | Recepcionista debe poder iniciar una reserva seleccionando días libres en una fila del Gantt, abriendo el formulario con habitación, tipo y fechas precargados. Debe rechazar rangos traslapados o habitaciones `FUERA_DE_SERVICIO`, aplicar las validaciones de creación y mostrar la reserva al guardarla. | 2 | HU-REC-09 | RN-RES-025 |
| RF-RES-016 | El sistema debe rechazar la modificación de fechas, tipo o número de huéspedes de una reserva creada. Un cambio exige cancelarla y crear otra conforme a las restricciones de cancelación; la asignación previa al check-in se rige por RF-HAB-002. | 1 | HU-HUE-05, HU-REC-05, HU-REC-07, HU-REC-08 | RN-RES-018 |

## 3. Huéspedes — RF-HUE

| ID | Requisito | Nivel | HU | RN |
|---|---|---|---|---|
| RF-HUE-001 | El sistema debe registrar al huésped principal con los mismos seis datos obligatorios en web, Recepción y canal: nombre completo, correo válido, teléfono, nacionalidad, tipo de documento (DPI o pasaporte) y número. Debe identificarlo por correo y reutilizar el perfil existente sin modificar sus datos ni duplicarlo. | 1 | HU-REC-01, HU-HUE-05, HU-CM-01 | RN-RES-019 |
| RF-HUE-002 | Recepcionista debe poder registrar huéspedes adicionales con nombre, tipo y número de documento y nacionalidad en reservas `CONFIRMADA` o `EN_ESTADIA`, visibles en detalle y check-in. Principal y adicionales no deben superar el número de huéspedes reservado; los adicionales no acceden a la app. | 1 | HU-REC-02 | RN-RES-020, RN-APP-004 |

## 4. Habitaciones — RF-HAB

| ID | Requisito | Nivel | HU | RN |
|---|---|---|---|---|
| RF-HAB-001 | Recepcionista debe poder ver número, tipo, piso, ocupación y condición de las habitaciones, con filtros por esos campos de estado, tipo y piso; indicadores "Llega hoy", "Sale hoy" e "Incidencia pendiente"; y consulta de solo lectura de la incidencia que bloquea una habitación `FUERA_DE_SERVICIO`. Los estados deben actualizarse en tiempo real. | 1 | HU-REC-10 | RN-HAB-014, RN-NOT-009 |
| RF-HAB-002 | Recepcionista debe poder asignar o cambiar habitación solo con reserva `PENDIENTE_PAGO` o `CONFIRMADA`, eligiendo una activa del mismo tipo, sin traslapes ni condición `FUERA_DE_SERVICIO`. Debe revalidarse al guardar, registrar fecha, hora y responsable y actualizar la fila del Gantt; no se exige `LIMPIA` hasta el check-in. | 1 | HU-REC-07 | RN-RES-013, RN-HAB-001, RN-HAB-012 |
| RF-HAB-003 | El sistema debe mantener ocupación (`LIBRE`, `OCUPADA`) y condición (`LIMPIA`, `SUCIA`, `EN_LIMPIEZA`, `FUERA_DE_SERVICIO`) como dimensiones distintas, separadas de la activación del catálogo. La ocupación debe cambiar solo por check-in o check-out. | 1 | HU-REC-10, HU-REC-11, HU-REC-12, HU-REC-14 | RN-HAB-004 |
| RF-HAB-004 | El sistema debe aceptar cambios de habitación únicamente según las transiciones del documento 07 y los permisos del 09: Recepción puede marcar `SUCIA` solo una `LIBRE` + `LIMPIA`, registrando fecha, hora y responsable; el cambio a `LIMPIA` corresponde al personal de Limpieza a cargo. | 1 | HU-REC-11, HU-MYL-02, HU-MYL-03 | RN-HAB-005, RN-HAB-013 |
| RF-HAB-005 | El sistema debe dejar `FUERA_DE_SERVICIO` una habitación `LIBRE` al reportarse una incidencia que impide usarla y excluirla de disponibilidad y asignación. Si está `OCUPADA`, debe mantener su condición y mostrar "Incidencia pendiente"; al salir debe quedar `FUERA_DE_SERVICIO` si el daño sigue impidiendo el uso. Un daño que no impide usarla no cambia la condición. | 1 | HU-REC-17, HU-MYL-06, HU-REC-14 | RN-HAB-001, RN-HAB-002, RN-HAB-006, RN-HAB-008 |
| RF-HAB-006 | El sistema debe mostrar en la web los tipos activos con nombre, fotos, descripción, capacidad y precio base por noche en GTQ con impuestos incluidos; al seleccionar uno, su detalle y acceso a disponibilidad. Si no hay tipos activos, debe informar sin mostrar una lista vacía. | 1 | HU-HUE-02 | RN-HAB-010, RN-TAR-005, RN-TAR-009 |

## 5. Check-in y check-out — RF-REC

| ID | Requisito | Nivel | HU | RN |
|---|---|---|---|---|
| RF-REC-001 | Recepcionista debe poder efectuar check-in de una reserva `CONFIRMADA` cuando entrada ≤ hoy < salida, tras verificar principal y adicionales y tener habitación asignada `LIBRE` + `LIMPIA`. Debe dejar reserva `EN_ESTADIA`, habitación `OCUPADA` y registrar fecha, hora y responsable; las 15:00 son referencia y las noches no usadas se cobran igual. | 1 | HU-REC-12 | RN-RES-014, RN-HAB-004 |
| RF-REC-002 | El sistema debe completar el check-out de Recepción o app en una sola operación con saldo 0: emitir factura, dejar reserva `FINALIZADA`, cuenta `CERRADA` y habitación `LIBRE` + `SUCIA` o `FUERA_DE_SERVICIO` si persiste una incidencia que impide usarla; cancelar solicitudes `PENDIENTE` o `EN_PROCESO` y pedidos `NUEVO` o `EN_PREPARACION` sin cargo, estos últimos con motivo "Estadía finalizada"; y registrar fecha, hora y responsable. | 1 | HU-REC-14, HU-HUE-16 | RN-RES-015, RN-RES-021, RN-HAB-008, RN-LIM-009, RN-RS-011, RN-FAC-001 |
| RF-REC-004 | El sistema debe permitir iniciar el check-out solo con reserva `EN_ESTADIA` y sin pedidos `EN_CAMINO`. En la app debe limitarlo a las 00:00–12:00 del día de salida y pedir aceptación de la cancelación de pedidos `NUEVO` o `EN_PREPARACION`; fuera de esa ventana debe indicar acudir a Recepción. Recepción puede registrar la salida tardía sin automatismo ni cargo extra. | 1 | HU-REC-14, HU-HUE-16 | RN-RES-015, RN-APP-008, RN-RS-011 |
| RF-REC-005 | El sistema debe conservar reserva `EN_ESTADIA` y cuenta `ABIERTA` si falla el cierre, sin aplicar los efectos del check-out ni registrar el pago de esa operación en Recepción. Debe conservar pagos aprobados previamente, incluido Stripe, y permitir reintentar el cierre desde la app sin volver a cobrar cuando el saldo siga en 0. | 1 | HU-REC-14, HU-HUE-16 | RN-RES-022 |

## 6. Pagos y cuenta — RF-PAG

| ID | Requisito | Nivel | HU | RN |
|---|---|---|---|---|
| RF-PAG-001 | Recepcionista debe poder registrar en el check-out un único pago por el saldo completo, asociado a la cuenta, con monto, fecha, responsable y método `EFECTIVO`, `TARJETA` u `OTRO`, y referencia opcional. Si el saldo ya es 0, debe omitirse el pago. | 1 | HU-REC-14 | RN-PAG-007, RN-PAG-013, RN-PAG-014 |
| RF-PAG-002 | El sistema debe mostrar a Recepción y al huésped dueño la cuenta con alojamiento, cargos adicionales y anulados, pagos con fecha, método, monto y estado, y saldo en GTQ = cargos `VIGENTE` menos pagos `APROBADO`. Debe excluir del cálculo cargos `ANULADO` y pagos `PENDIENTE`, `FALLIDO` o `REEMBOLSADO`. La app debe permitir consulta de solo lectura en cualquier estado de reserva, actualizada al abrir o recargar. | 1 | HU-REC-13, HU-HUE-15 | RN-PAG-021, RN-TAR-009, RN-TAR-010, RN-APP-013, RN-SEG-001 |
| RF-PAG-003 | El sistema debe ofrecer Stripe en modo prueba para cobrar el 100 % de la reserva web y el saldo completo de la app, usando la página de Stripe sin recibir ni almacenar datos de tarjeta. | 1 | HU-HUE-06, HU-HUE-16 | RN-PAG-004, RN-PAG-005, RN-PAG-006, RN-PAG-013 |
| RF-PAG-004 | El sistema debe confirmar el pago en línea por el webhook de Stripe, sin usar la redirección del navegador como prueba de pago. Para el pago de la reserva web, los avisos repetidos no deben duplicar el registro; al aprobarlo debe pasar reserva a `CONFIRMADA` y pago a `APROBADO`. RF-RES-009 cubre la comprobación al vencer los 30 minutos. | 1 | HU-HUE-06, HU-HUE-16 | RN-PAG-001, RN-PAG-002, RN-RES-012 |
| RF-PAG-007 | El sistema debe crear una cuenta `ABIERTA` y el cargo por alojamiento junto con cada reserva; en reservas directas debe conservar el detalle por noche y, en las de canal, una línea por el monto recibido. | 1 | HU-HUE-05, HU-REC-04, HU-CM-01, HU-REC-13 | RN-PAG-009, RN-TAR-007, RN-TAR-010 |
| RF-PAG-008 | Recepcionista debe poder agregar cargos de servicio solo con reserva `EN_ESTADIA` y cuenta `ABIERTA`, indicando concepto, cantidad y precio unitario mayores que cero. El sistema debe calcular el total y guardar fecha, hora y responsable. | 1 | HU-REC-13 | RN-PAG-010, RN-PAG-019, RN-PAG-020 |
| RF-PAG-009 | El sistema debe aplicar reembolso total por Stripe al cancelar con 48 horas o más antes de las 15:00 del día de llegada si se pagó en línea; con menos tiempo no debe reembolsar y sin pagos no debe solicitar devolución. Si Stripe acepta, el pago debe quedar `REEMBOLSADO`; si rechaza, debe informar y mantener la reserva sin cancelar. | 1 | HU-REC-05 | RN-CAN-002, RN-CAN-006, RN-CAN-008, RN-CAN-011 |
| RF-PAG-010 | Huésped debe poder pagar desde la app el saldo completo para el check-out mediante Stripe, esperar la aprobación por webhook y continuar solo con saldo exactamente 0; si ya es 0, debe omitir el cobro. | 1 | HU-HUE-16 | RN-PAG-001, RN-PAG-013, RN-RES-015, RN-APP-008 |
| RF-PAG-011 | Recepcionista debe poder anular un cargo adicional registrado por error con motivo obligatorio y responsable, conservándolo visible como `ANULADO` y excluyéndolo del saldo. El sistema debe impedir borrar cargos, anular alojamiento o anular con cuenta `CERRADA`; aplica además la condición de acceso del documento 09, nota 14 (cuenta `ABIERTA`). | 1 | HU-REC-13, HU-HUE-15 | RN-PAG-011, RN-PAG-020, RN-PAG-021 |
| RF-PAG-012 | El sistema debe mantener una sola sesión de Stripe para pagar la reserva web y permitir reintentar en el mismo enlace mientras siga `PENDIENTE_PAGO`; un intento rechazado o cerrar la página debe mantener el pago `PENDIENTE`. Solo el vencimiento sin pago debe dejarlo `FALLIDO`; la página de retorno debe mostrar el estado y la opción de reintentar cuando corresponda. | 1 | HU-HUE-06 | RN-PAG-003, RN-RES-012 |
| RF-PAG-013 | El sistema debe registrar, al recibir una reserva de canal, un pago `APROBADO` de método `CANAL` por el mismo monto del cargo por alojamiento recibido. | 1 | HU-CM-01 | RN-PAG-008, RN-TAR-010 |

## 7. Tarifas — RF-TAR

| ID | Requisito | Nivel | HU | RN |
|---|---|---|---|---|
| RF-TAR-001 | Administrador debe poder definir el precio base por noche de cada tipo en GTQ, mayor que cero, con efecto solo sobre reservas nuevas. | 1 | HU-ADM-03 | RN-TAR-004, RN-TAR-007, RN-TAR-009 |
| RF-TAR-002 | Administrador debe poder crear, editar y eliminar temporadas con nombre, inicio, fin y ajuste mayor que −100 %, aplicadas a todos los tipos o a los seleccionados. El sistema debe rechazar fin anterior a inicio y traslapes para un mismo tipo, indicando la temporada en conflicto; las reservas existentes conservan su precio. | 1 | HU-ADM-06 | RN-TAR-003, RN-TAR-004, RN-TAR-007, RN-TAR-011 |
| RF-TAR-003 | Administrador debe poder configurar por tipo el ajuste de viernes y sábado, con valor inicial de 0 % y mayor que −100 %, aplicable solo a reservas nuevas. | 1 | HU-ADM-07 | RN-TAR-002, RN-TAR-004, RN-TAR-007, RN-TAR-012 |
| RF-TAR-004 | El sistema debe calcular en el servidor cada noche de una reserva directa como base × (1 + ajuste de temporada) × (1 + ajuste de fin de semana cuando corresponda), redondear cada noche a dos decimales y sumar el total en GTQ con impuestos incluidos; debe mostrar el desglose y sus ajustes antes de reservar y fijar el precio al crearla. | 1 | HU-HUE-04, HU-REC-04, HU-REC-03 | RN-TAR-001, RN-TAR-002, RN-TAR-005, RN-TAR-006, RN-TAR-007, RN-TAR-008, RN-TAR-009 |

## 8. Room Service — RF-RS

| ID | Requisito | Nivel | HU | RN |
|---|---|---|---|---|
| RF-RS-001 | Room Service debe poder ver la cola de pedidos `NUEVO`, `EN_PREPARACION` y `EN_CAMINO` del más antiguo al más reciente, con habitación, piso, hora, tiempo transcurrido y estado. Debe retirar de la cola los `ENTREGADO` y `CANCELADO`, actualizarse con los eventos de pedido y recargarse al reconectar. | 1 | HU-RS-01 | RN-RS-012, RN-SEG-002, RN-NOT-007 |
| RF-RS-002 | Room Service debe poder consultar el detalle con ítems, cantidades, precios congelados, total, notas destacadas, nombre del huésped, habitación, piso e historial de estados; debe omitir correo, teléfono y documento. Si el pedido no existe, debe informar y volver a la cola. | 1 | HU-RS-02 | RN-SEG-002, RN-RS-006 |
| RF-RS-004 | Room Service debe poder avanzar un paso por acción en `NUEVO` → `EN_PREPARACION` → `EN_CAMINO` → `ENTREGADO`, sin saltos, retrocesos ni modificación del entregado. Si otro empleado ya lo cambió, debe avisar y recargar; cada paso debe registrar fecha, hora y responsable. | 1 | HU-RS-03 | RN-RS-001, RN-RS-002 |
| RF-RS-005 | Room Service debe poder cancelar pedidos `NUEVO`, `EN_PREPARACION` o `EN_CAMINO` con motivo obligatorio, fecha, hora y responsable. Deben quedar `CANCELADO`, sin cargo ni reactivación; el huésped debe ver el motivo. | 1 | HU-RS-04 | RN-RS-003, RN-RS-004 |
| RF-RS-006 | Room Service debe poder consultar el menú por categorías y marcar ítems `DISPONIBLE` como `AGOTADO`, con fecha, hora y responsable. El ítem debe verse no disponible al volver a abrir el menú y no admitir pedidos nuevos; solo Administrador puede reactivarlo. | 1 | HU-RS-05, HU-ADM-05 | RN-RS-005, RN-RS-008 |
| RF-RS-007 | El sistema debe generar una sola vez, al pasar el pedido a `ENTREGADO`, el cargo "Room Service — Pedido #n" en la cuenta `ABIERTA` de la reserva `EN_ESTADIA`, por la suma de precios congelados × cantidades. Debe quedar disponible para consulta; Room Service no puede editarlo ni anularlo. | 1 | HU-RS-06 | RN-RS-007 |
| RF-RS-009 | El sistema debe mostrar a Room Service un aviso visual de pedido nuevo sin recargar, con habitación, piso y hora, que abra el detalle al pulsarlo e incorpore el pedido a la cola según su antigüedad. | 1 | HU-RS-07 | RN-NOT-006 |
| RF-RS-010 | Huésped debe poder crear pedidos solo desde la app con reserva `EN_ESTADIA`, eligiendo ítems, cantidades y notas del menú por categorías. Debe ver el total y el aviso de cargo al entregar; el pedido debe nacer `NUEVO` con precios congelados. Si algún ítem se agotó, debe rechazarse el pedido completo indicando qué quitar. | 1 | HU-HUE-10 | RN-RS-005, RN-RS-006, RN-APP-005 |
| RF-RS-011 | Huésped debe poder consultar los pedidos de su estadía con fecha, estado y total, seguir cada estado en tiempo real y ver el motivo de cancelación; al reconectar debe cargarse el estado actual. La app no permite modificar ni cancelar pedidos. | 1 | HU-HUE-11 | RN-RS-004, RN-RS-010, RN-NOT-007 |
| RF-RS-012 | El sistema debe acompañar el aviso visual de pedido nuevo con un sonido si se implementa esta mejora de Nivel 2. | 2 | HU-RS-07 | — |

El sonido de RF-RS-012 conserva Nivel 2 por las notas técnicas de HU-RS-07; el aviso visual de esa misma historia sigue siendo Nivel 1.

## 9. Limpieza — RF-LIM

| ID | Requisito | Nivel | HU | RN |
|---|---|---|---|---|
| RF-LIM-001 | Mantenimiento/Limpieza debe poder consultar, con área `LIMPIEZA` o `AMBAS`, habitaciones libres `SUCIA` o `EN_LIMPIEZA`, con número, piso, condición y empleado a cargo. Debe excluir `OCUPADA` y `FUERA_DE_SERVICIO`, actualizarse por cambios de habitación y retirar las que queden `LIMPIA`. | 1 | HU-MYL-01 | RN-LIM-004, RN-LIM-010, RN-LIM-011, RN-NOT-009 |
| RF-LIM-002 | Mantenimiento/Limpieza debe poder iniciar limpieza con área `LIMPIEZA` o `AMBAS` sobre habitación `SUCIA`, dejándola `EN_LIMPIEZA` a su nombre con fecha y hora; si otro ya la inició, debe rechazarse e indicar quién la tiene. Solo el empleado a cargo debe poder interrumpirla, devolviéndola a `SUCIA`. | 1 | HU-MYL-02 | RN-LIM-001, RN-LIM-011 |
| RF-LIM-003 | Mantenimiento/Limpieza debe poder finalizar únicamente la habitación `EN_LIMPIEZA` a su cargo, dejándola `LIMPIA`, registrando fecha, hora y empleado y retirándola de pendientes. | 1 | HU-MYL-03 | RN-LIM-002, RN-HAB-005 |
| RF-LIM-004 | Mantenimiento/Limpieza debe poder consultar, con área `LIMPIEZA` o `AMBAS`, solicitudes `PENDIENTE` y `EN_PROCESO` por antigüedad, con habitación, piso, tipo, hora, estado, artículos y cantidades y empleado a cargo. | 1 | HU-MYL-04 | RN-LIM-011, RN-LIM-014 |
| RF-LIM-005 | Mantenimiento/Limpieza debe poder marcar `ATENDIDA` solo una solicitud `EN_PROCESO` a su cargo, guardando fecha, hora y responsable y retirándola de atención. Debe rechazar solicitudes ya canceladas y no descontar inventario al entregar artículos; la limpieza solicitada por un huésped no cambia la condición de la habitación. | 1 | HU-MYL-05 | RN-LIM-007, RN-LIM-015 |
| RF-LIM-006 | Mantenimiento/Limpieza debe poder reportar daños desde cualquier área mediante el mismo registro de incidencia de RF-MAN-003. | 1 | HU-MYL-06 | RN-MAN-001 |
| RF-LIM-010 | El sistema debe priorizar en limpieza las habitaciones con reserva asignada que llega hoy y marcarlas "Llegada hoy"; debe ordenar las restantes por el tiempo que llevan `SUCIA`. | 1 | HU-MYL-01 | RN-LIM-010 |
| RF-LIM-015 | Mantenimiento/Limpieza debe poder tomar una solicitud `PENDIENTE`, con área `LIMPIEZA` o `AMBAS`, dejándola `EN_PROCESO` a su nombre con fecha y hora. Si ya fue tomada o cancelada, debe avisar y actualizar la lista; tomar una solicitud de limpieza no debe cambiar la condición de la habitación. | 1 | HU-MYL-04 | RN-LIM-011, RN-LIM-013, RN-LIM-014 |

## 10. Solicitudes del huésped — RF-SOL

| ID | Requisito | Nivel | HU | RN |
|---|---|---|---|---|
| RF-SOL-001 | Huésped debe poder crear desde la app una solicitud de limpieza con comentario opcional, solo con reserva `EN_ESTADIA`; debe nacer `PENDIENTE` sin cambiar la condición de la habitación y rechazarse si ya existe otra de limpieza `PENDIENTE` o `EN_PROCESO` para esa habitación. | 1 | HU-HUE-12 | RN-LIM-005, RN-LIM-006, RN-LIM-013 |
| RF-SOL-002 | El sistema debe enviar las solicitudes de limpieza y artículos directamente al personal de área `LIMPIEZA` o `AMBAS`, incorporándolas sin recargar y con aviso visual; los daños reportados por personal deben registrarse como incidencias mediante RF-MAN-003. | 1 | HU-MYL-04, HU-HUE-12, HU-HUE-13, HU-MYL-06, HU-REC-17 | RN-LIM-011, RN-NOT-008, RN-MAN-001 |
| RF-SOL-003 | Huésped debe poder consultar sus solicitudes de la estadía con tipo, fecha, hora y estados `PENDIENTE`, `EN_PROCESO`, `ATENDIDA` o `CANCELADA`, actualizadas al abrir o deslizar para recargar. | 1 | HU-HUE-14 | RN-LIM-003 |
| RF-SOL-004 | Huésped debe poder solicitar desde la app uno o varios artículos del catálogo inicial y sus cantidades, con reserva `EN_ESTADIA`, respetando el máximo de cada artículo. La solicitud debe nacer `PENDIENTE` y no descontar inventario. | 1 | HU-HUE-13 | RN-LIM-006, RN-LIM-007 |
| RF-SOL-005 | Huésped debe poder cancelar una solicitud propia solo mientras esté `PENDIENTE`, dejándola `CANCELADA`; si ya está `EN_PROCESO` o `ATENDIDA`, el sistema debe rechazar la cancelación e indicar el motivo. | 1 | HU-HUE-14 | RN-LIM-008 |

## 11. Mantenimiento — RF-MAN

| ID | Requisito | Nivel | HU | RN |
|---|---|---|---|---|
| RF-MAN-001 | Administrador debe poder consultar incidencias en solo lectura, con habitación, descripción, impedimento de uso, estado, autor, técnico y fechas; filtros por estado, habitación y técnico; y detalle con foto, solución e historial. Debe mostrar primero `REPORTADA` y `EN_PROCESO`, de la más reciente a la más antigua, y "Sin incidencias" cuando corresponda. | 1 | HU-ADM-10 | RN-MAN-007, RN-MAN-012, RN-MAN-013 |
| RF-MAN-003 | Recepcionista debe poder reportar un daño, igual que Mantenimiento/Limpieza de cualquier área, indicando habitación, descripción, si impide usarla y foto opcional. El sistema debe rechazar la falta de habitación o descripción y crear una incidencia `REPORTADA` con fecha, hora y autor, visible para técnicos y Administrador. | 1 | HU-REC-17, HU-MYL-06 | RN-MAN-001 |
| RF-MAN-005 | Mantenimiento/Limpieza debe poder consultar, con área `MANTENIMIENTO` o `AMBAS`, incidencias `REPORTADA` y `EN_PROCESO` por antigüedad, con habitación, piso, ocupación, descripción, foto, impedimento de uso, autor, fecha y técnico. Debe actualizarse al abrir o mediante "Actualizar". | 1 | HU-MYL-07 | RN-MAN-009, RN-MAN-013 |
| RF-MAN-006 | El sistema debe aplicar únicamente el ciclo `REPORTADA` → `EN_PROCESO` → `RESUELTA`: el técnico toma y resuelve mediante RF-MAN-013 y RF-MAN-014. No debe habilitar asignación, reasignación, devolución, cierre ni cancelación de incidencias. | 1 | HU-MYL-06, HU-MYL-07, HU-MYL-08 | RN-MAN-002, RN-MAN-009 |
| RF-MAN-008 | El sistema debe mantener `FUERA_DE_SERVICIO` una habitación mientras quede una incidencia que impida usarla; al resolver la última debe pasarla a `SUCIA` y mostrarla en limpieza. Si está `OCUPADA`, debe retirar "Incidencia pendiente" solo cuando no quede ninguna incidencia que impida usarla. | 1 | HU-MYL-08 | RN-HAB-003, RN-MAN-005, RN-MAN-006 |
| RF-MAN-013 | Mantenimiento/Limpieza debe poder tomar una incidencia `REPORTADA`, con área `MANTENIMIENTO` o `AMBAS`, dejándola `EN_PROCESO` a su nombre con fecha y hora. Si otro técnico ya la tomó, debe rechazar la acción e indicar quién la tiene. | 1 | HU-MYL-07 | RN-MAN-009 |
| RF-MAN-014 | Mantenimiento/Limpieza debe poder resolver solo una incidencia `EN_PROCESO` a su cargo, con descripción obligatoria de la solución. Debe quedar `RESUELTA`, con fecha, hora y técnico, sin modificación posterior. | 1 | HU-MYL-08 | RN-MAN-002, RN-MAN-009, RN-MAN-010 |

## 12. Administración — RF-ADM

| ID | Requisito | Nivel | HU | RN |
|---|---|---|---|---|
| RF-ADM-001 | Administrador debe poder gestionar las tarifas de temporada y fin de semana según RF-TAR-002 y RF-TAR-003, sin vista previa mensual de precios. | 1 | HU-ADM-06, HU-ADM-07 | RN-TAR-003, RN-TAR-007, RN-TAR-011, RN-TAR-012 |
| RF-ADM-002 | Administrador debe poder consultar tres tarjetas: ocupación de hoy = habitaciones `OCUPADA` / habitaciones activas; ingresos = pagos `APROBADO` del rango, sin sumar los `REEMBOLSADO`; y reservas creadas en el rango por canal, incluidas las canceladas. Debe elegir rango para las dos últimas, con mes actual por defecto, rechazar fin anterior a inicio y mostrar 0 si no hay datos. | 1 | HU-ADM-09 | RN-IND-001, RN-IND-002, RN-IND-003, RN-IND-004 |
| RF-ADM-003 | Administrador debe poder crear empleados con nombre, correo único, teléfono y rol; para Mantenimiento/Limpieza debe exigir área `LIMPIEZA`, `MANTENIMIENTO` o `AMBAS`. El empleado debe quedar `ACTIVO` y recibir una contraseña temporal mostrada al Administrador una sola vez para entrega personal, sin correo. | 1 | HU-ADM-01 | RN-PER-001, RN-PER-007, RN-PER-008, RN-PER-009 |
| RF-ADM-004 | Administrador debe poder gestionar productos de inventario aislado con nombre único, categoría, unidad y stock mínimo, stock inicial 0 y desactivación; listar stock actual y mínimo, marcar "Stock bajo" cuando stock ≤ mínimo y filtrar por categoría o esa marca. | 2 | HU-ADM-13 | RN-INV-001, RN-INV-005, RN-INV-010 |
| RF-ADM-005 | Administrador debe poder gestionar tipos de habitación con nombre único obligatorio, descripción, capacidad mínima 1, precio base mayor que cero y varias fotos con una principal. Debe poder activar o desactivar tipos sin alterar reservas existentes; los cambios del catálogo deben reflejarse en la web. Los demás catálogos antes agrupados aquí se detallan en RF-ADM-011, RF-ADM-012 y RF-ADM-013. | 1 | HU-ADM-03 | RN-HAB-009, RN-HAB-010, RN-TAR-004, RN-TAR-007 |
| RF-ADM-006 | Administrador debe poder configurar nombre, descripción, dirección, teléfono, correo y fotos del hotel, con efecto en web, app y correos, sin alterar facturas emitidas. Deben mantenerse fijas las horas 15:00 y 12:00 y publicarse la política generada de la regla de 48 horas, sin edición libre. | 1 | HU-ADM-08 | RN-FAC-009, RN-FAC-011 |
| RF-ADM-007 | El sistema debe mostrar en la web pública nombre, descripción, fotos, ubicación y contacto configurados, horarios fijos 15:00 y 12:00 y acceso al buscador; la página debe poder consultarse en computadora y teléfono. | 1 | HU-HUE-01 | — |
| RF-ADM-009 | Administrador debe poder definir, editar y desactivar turnos con nombre e inicio y fin, incluidos los que cruzan medianoche; los turnos deben ser informativos y no limitar el acceso al sistema. | 2 | HU-ADM-12 | RN-TUR-003, RN-TUR-005 |
| RF-ADM-010 | Administrador debe poder asignar y quitar turnos por una o varias fechas a empleados `ACTIVO` que no sean Administradores, consultar una vista semanal y rechazar traslapes del mismo empleado. | 2 | HU-ADM-12 | RN-TUR-001, RN-TUR-002, RN-TUR-005 |
| RF-ADM-011 | Administrador debe poder crear habitaciones con número único, piso y tipo activo, inicialmente `LIBRE` + `LIMPIA`; cambiar su tipo solo sin reservas activas asignadas; y desactivarlas solo si no están `OCUPADA` ni tienen reservas activas asignadas. Las inactivas deben excluirse del cupo y la asignación y poder reactivarse. | 1 | HU-ADM-04 | RN-HAB-007, RN-HAB-011, RN-HAB-012 |
| RF-ADM-012 | Administrador debe poder gestionar categorías e ítems del menú con nombre, descripción, categoría, precio en GTQ mayor que cero y foto opcional; desactivar ítems para ocultarlos y reactivar de `AGOTADO` a `DISPONIBLE`. Los cambios de precio no deben alterar pedidos ya creados. | 1 | HU-ADM-05 | RN-RS-005, RN-RS-008, RN-RS-013 |
| RF-ADM-013 | Administrador debe poder gestionar amenidades con nombre obligatorio, descripción, foto, horario, ubicación, orden y activación. Los cambios deben reflejarse en la app sin publicar otra versión. | 2 | HU-ADM-11 | RN-APP-012 |
| RF-ADM-014 | Administrador debe poder listar empleados con filtros por rol y estado, editar nombre, teléfono, rol y área y desactivarlos o reactivarlos sin eliminarlos ni perder su nombre histórico. No debe poder desactivarse ni cambiarse el rol a sí mismo; un inactivo no debe iniciar ni renovar sesión, aunque el acceso vigente dure hasta 15 minutos. | 1 | HU-ADM-02 | RN-PER-001, RN-PER-002, RN-PER-005, RN-PER-007, RN-PER-014 |
| RF-ADM-015 | Administrador debe poder restablecer la contraseña de un empleado generando otra temporal, visible una sola vez; la anterior debe dejar de funcionar y el empleado debe cambiar la temporal en el siguiente acceso. | 1 | HU-ADM-02 | RN-PER-010 |
| RF-ADM-016 | Administrador debe poder registrar entradas y salidas manuales de inventario con cantidad mayor que cero y motivo obligatorio, rechazando salidas superiores al stock. Debe guardarse fecha, hora, tipo, cantidad, motivo y responsable, y poder consultarse el historial por producto; ningún otro módulo debe modificar el stock. | 2 | HU-ADM-13 | RN-INV-001, RN-INV-002, RN-INV-003, RN-INV-011 |
| RF-ADM-017 | Administrador debe poder configurar el nombre de la red Wi-Fi y su contraseña para huéspedes. Los cambios deben reflejarse en la app sin publicar otra versión. | 2 | HU-ADM-11 | RN-APP-012 |

## 13. App del huésped — RF-APP

| ID | Requisito | Nivel | HU | RN |
|---|---|---|---|---|
| RF-APP-001 | El sistema debe autenticar al huésped principal por correo y OTP de seis dígitos, válido 10 minutos y de un solo uso; permitir pedir otro si venció o fue usado; bloquear 15 minutos tras cinco intentos fallidos; y responder genéricamente si el correo no tiene reservas. | 1 | HU-HUE-08 | RN-APP-001, RN-APP-002, RN-APP-003, RN-APP-004 |
| RF-APP-002 | Huésped debe poder ver código, fechas, hora de check-out, tipo, huéspedes y estado de su reserva; debe ver la habitación cuando esté asignada o "Por asignar" mientras no lo esté. | 1 | HU-HUE-09 | RN-APP-011, RN-SEG-001 |
| RF-APP-003 | Huésped debe poder consultar, con sesión y en cualquier estado de reserva, amenidades activas con nombre, foto, descripción, horario y ubicación, junto con red y contraseña Wi-Fi; si no hay amenidades, debe mostrar un mensaje. | 2 | HU-HUE-18 | RN-APP-012 |
| RF-APP-004 | El sistema debe habilitar pedidos y solicitudes de la app únicamente con reserva `EN_ESTADIA`, mostrando un aviso en otro estado. La consulta de cuenta no debe depender del check-in; el check-out debe aplicar además RF-REC-004. | 1 | HU-HUE-09, HU-HUE-10, HU-HUE-12, HU-HUE-13, HU-HUE-15, HU-HUE-16, HU-REC-12 | RN-APP-005, RN-APP-008, RN-APP-013 |
| RF-APP-005 | El sistema debe mostrar después del check-out una pantalla final con la factura y acceso a su PDF, impedir nuevos pedidos y solicitudes y detener las notificaciones al teléfono. | 1 | HU-HUE-16, HU-HUE-17 | RN-APP-006, RN-NOT-004 |
| RF-APP-006 | El sistema debe mantener la sesión de la app con acceso de 15 minutos y renovación mediante refresh token de siete días renovado en cada uso; tras siete días sin abrirla o después de cerrar sesión debe solicitar nuevamente OTP. | 1 | HU-HUE-08 | RN-APP-010 |

## 14. Channel Manager — RF-CM

| ID | Requisito | Nivel | HU | RN |
|---|---|---|---|---|
| RF-CM-002 | El sistema debe recibir reservas externas por una API documentada con OpenAPI y ejemplos de respuesta, autenticada por canal y clave comparada con su hash. Debe validar identificador externo, tipo, fechas, huéspedes, seis datos del principal, monto en GTQ y disponibilidad; devolver 401 por autenticación inválida, 400 por datos inválidos, 409 sin cupo y 201 con código al crear `CONFIRMADA`. Debe reutilizar RF-HUE-001, RF-PAG-007 y RF-PAG-013. | 1 | HU-CM-01 | RN-CM-001, RN-CM-003, RN-RES-011, RN-RES-019, RN-TAR-010, RN-PAG-008 |
| RF-CM-004 | Recepcionista debe poder ver el origen en detalle, búsqueda y Gantt, filtrar por canal y ver el identificador externo de Booking o Expedia. Las reservas externas no deben ofrecer cancelación y el backend debe rechazarla si se intenta. | 1 | HU-CM-02 | RN-RES-010, RN-CAN-012 |
| RF-CM-005 | Administrador debe poder enviar reservas de prueba por la API real desde el canal simulado, eligiendo Booking o Expedia y sus datos o generándolos al azar; ver código HTTP, resultado, motivo y código de reserva; y reenviar el mismo identificador para demostrar que no se duplica. Los demás roles no deben acceder. | 1 | HU-CM-03 | RN-CM-007, RN-CM-009 |
| RF-CM-008 | El sistema debe responder 200 con la reserva existente al recibir otra vez el mismo identificador externo del mismo canal, sin crear otra reserva, cuenta ni pago. | 1 | HU-CM-01, HU-CM-03 | RN-CM-004 |

## 15. Tiempo real, notificaciones y correos — RF-NOT

| ID | Requisito | Nivel | HU | RN |
|---|---|---|---|---|
| RF-NOT-001 | El sistema debe actualizar pantallas en tiempo real solo para cuatro eventos: nuevo pedido → cola de Room Service; cambio de estado del pedido → cola y app del dueño; nueva solicitud → lista de Limpieza; cambio de estado de habitación → Recepción y pendientes de limpieza. Las demás pantallas deben actualizarse al abrir o recargar. | 1 | HU-RS-01, HU-RS-07, HU-HUE-11, HU-MYL-04, HU-REC-10, HU-MYL-01 | RN-NOT-006, RN-NOT-007, RN-NOT-008, RN-NOT-009 |
| RF-NOT-002 | El sistema debe enviar únicamente estos correos: confirmación al quedar la reserva `CONFIRMADA`, OTP al solicitar acceso y factura PDF al emitirla. El fallo de envío no debe revertir el cambio de estado; el reintento de confirmación se rige por RF-RES-014. | 1 | HU-HUE-07, HU-HUE-08, HU-REC-15, HU-HUE-16 | RN-APP-001, RN-NOT-003, RN-NOT-005, RN-FAC-008 |
| RF-NOT-003 | El sistema debe enviar push solo por pedido `ENTREGADO` y solicitud `ATENDIDA`, mientras la reserva esté `EN_ESTADIA`, sin datos personales ni montos; al pulsarlas debe abrir el pedido o solicitud. Debe pedir permiso, mantener operativa la app si se rechaza y guardar el cambio de estado aunque falle el envío; al cerrar sesión o finalizar la estadía debe detenerlas. | 1 | HU-HUE-17 | RN-NOT-001, RN-NOT-002, RN-NOT-004 |

## 16. Facturación e impresión — RF-FAC

| ID | Requisito | Nivel | HU | RN |
|---|---|---|---|---|
| RF-FAC-001 | El sistema debe emitir una única factura por cuenta, solo en el check-out con saldo 0, usando NIT validado por dígito verificador (incluida K) o CF y nombre del comprador, precargado con el nombre del huésped. Debe incluir datos del hotel, serie fija y siguiente correlativo consecutivo sin saltos, fecha, hora, reserva, cargos no anulados, pagos con método y monto y total con "IVA incluido", sin desglose; quedar `EMITIDA`, inmutable y sin anulación, con "Factura de demostración — no válida ante la SAT". | 1 | HU-REC-15, HU-REC-14, HU-HUE-16 | RN-FAC-001, RN-FAC-002, RN-FAC-004, RN-FAC-005, RN-FAC-008, RN-FAC-009 |
| RF-FAC-002 | El sistema debe generar y guardar el PDF de la factura y enviarlo al correo del huésped; debe permitir su consulta únicamente a Recepción y al huésped dueño, según el documento 09. | 1 | HU-REC-15, HU-HUE-16 | RN-FAC-008, RN-SEG-001 |
| RF-FAC-003 | Recepcionista debe poder imprimir la factura `EMITIDA`, con la opción ofrecida inmediatamente al emitirla en Recepción, desde el navegador en formato de 80 mm u hoja carta, sin elementos de interfaz, con montos alineados y sin cortes en 80 mm; y reimprimir desde la reserva sin límite, sin marca "COPIA" ni cambios de estado. | 1 | HU-REC-16, HU-REC-15 | RN-FAC-007 |
| RF-FAC-005 | Administrador debe poder editar nombre comercial, razón social, NIT y dirección fiscal obligatorios, validando el dígito verificador del NIT, incluida K. La serie fija y el correlativo inicial deben provenir de los datos iniciales y no ser editables; los cambios no deben alterar facturas anteriores. | 1 | HU-ADM-08 | RN-FAC-004, RN-FAC-009, RN-FAC-010 |

## 17. Seguridad y trazabilidad — RF-SEG

| ID | Requisito | Nivel | HU | RN |
|---|---|---|---|---|
| RF-SEG-001 | El sistema debe permitir al personal iniciar sesión con correo y contraseña, entrar a la sección de su rol y cerrar sesión desde cualquier pantalla. Debe responder genéricamente ante credenciales incorrectas, bloquear 15 minutos tras cinco intentos fallidos seguidos, reiniciar el contador al entrar correctamente y rechazar empleados `INACTIVO`; sin sesión debe llevar al acceso. | 1 | HU-EMP-01 | RN-PER-013, RN-PER-015, RN-SEG-005 |
| RF-SEG-002 | El sistema debe autorizar cada operación en el backend con Spring Security según el documento 09: rol, área, estado, propiedad del registro y empleado a cargo cuando corresponda. Debe rechazar accesos ajenos aunque se invoquen directamente; Administrador solo debe usar sus secciones y el simulador. Room Service solo debe recibir el nombre como dato personal del huésped y Mantenimiento/Limpieza no debe recibir sus datos personales. | 1 | HU-EMP-01, HU-HUE-09, HU-HUE-15, HU-RS-02, HU-MYL-04, HU-MYL-07 | RN-SEG-001, RN-SEG-002, RN-SEG-006, RN-LIM-011, RN-MAN-009 |
| RF-SEG-003 | El sistema debe guardar por cada cambio de estado de reserva, habitación, pedido, solicitud e incidencia: estado anterior y nuevo, responsable o `SISTEMA`, fecha, hora y motivo cuando corresponda; debe permitir consultar los historiales indicados en el detalle de reserva, pedido e incidencia. Cargos y pagos deben conservar fecha y responsable en su propio registro. | 1 | HU-REC-06, HU-RS-02, HU-ADM-10 | RN-RS-002, RN-MAN-007 |
| RF-SEG-004 | El sistema debe exigir cambiar la contraseña temporal antes de usar otra sección, solicitando actual, nueva y confirmación; validar la actual, coincidencia, mínimo ocho caracteres, una letra, un número y diferencia con la actual. Al guardar debe invalidar la anterior y dar acceso al rol; el empleado debe poder cambiarla posteriormente con las mismas reglas. | 1 | HU-EMP-02 | RN-PER-011, RN-PER-012 |
| RF-SEG-005 | El sistema debe crear el primer Administrador al arrancar, tomando sus credenciales de variables de entorno, según la tarea técnica del índice de historias, sección 5. | 1 | Tarea técnica: primer Administrador (índice HU, sección 5) | — |
| RF-SEG-006 | El sistema debe centralizar logs y disponer de una alerta por caída o consumo alto, como ampliación de Nivel 2 de la monitorización local. | 2 | Tarea técnica: ALC-TRA-09b (índice HU, sección 5) | — |
| RF-SEG-007 | El sistema debe estar desplegado en una VPS con Docker detrás de Cloudflare, con URL pública para la web y APK instalable para la app, después del hito local. | Después | Compromiso técnico: ALC-TRA-06 (Alcance, sección 6) | — |
| RF-SEG-008 | El sistema debe contar con un flujo de entrega mediante pull requests revisados, pruebas automáticas y despliegue automático, después del hito local. | Después | Compromiso técnico: ALC-TRA-07 (Alcance, sección 6) | — |
| RF-SEG-009 | El sistema debe contar con backups de la base de datos y una restauración probada, después del hito local. | Después | Compromiso técnico: ALC-TRA-08 (Alcance, sección 6) | — |

## 18. Trazabilidad

### 18.1 Alcance → RF

Incluye los 67 elementos de las secciones 5 y 6 del Alcance: 58 de Nivel 1, 6 de Nivel 2 y 3 de Después. Tres elementos de Nivel 1 son tareas técnicas excluidas expresamente del catálogo funcional. Los demás tienen al menos un RF.

| Alcance | Nivel | RF o tarea técnica excluida |
|---|---|---|
| ALC-PUB-01 | 1 | RF-ADM-007 |
| ALC-PUB-02 | 1 | RF-HAB-006 |
| ALC-PUB-03 | 1 | RF-RES-001 |
| ALC-PUB-04 | 1 | RF-HUE-001, RF-PAG-007, RF-RES-003, RF-RES-008, RF-RES-010, RF-RES-016 |
| ALC-PUB-05 | 1 | RF-TAR-004 |
| ALC-PUB-06 | 1 | RF-PAG-003, RF-PAG-004, RF-PAG-012, RF-RES-009 |
| ALC-PUB-07 | 1 | RF-RES-014 |
| ALC-REC-01 | 1 | RF-HUE-001, RF-HUE-002 |
| ALC-REC-02 | 1 | RF-PAG-007, RF-PAG-009, RF-RES-002, RF-RES-003, RF-RES-005, RF-RES-010, RF-RES-014, RF-RES-016 |
| ALC-REC-03 | 1 | RF-RES-001, RF-TAR-004 |
| ALC-REC-04 | 1 | RF-HAB-002, RF-RES-003, RF-RES-016 |
| ALC-REC-05 | 1 | RF-APP-004, RF-FAC-001, RF-HAB-003, RF-HAB-005, RF-PAG-001, RF-REC-001, RF-REC-002, RF-REC-004, RF-REC-005 |
| ALC-REC-06 | 1 | RF-PAG-001, RF-PAG-002, RF-PAG-007, RF-PAG-008, RF-PAG-011, RF-REC-002, RF-REC-005 |
| ALC-REC-08 | 1 | RF-RES-006, RF-RES-007 |
| ALC-REC-10 | 1 | RF-HAB-001, RF-HAB-003, RF-HAB-004 |
| ALC-REC-12 | 1 | RF-RES-012 |
| ALC-REC-12b | 2 | RF-RES-015 |
| ALC-REC-13 | 1 | RF-TAR-004 |
| ALC-REC-15 | 1 | RF-FAC-001, RF-FAC-002 |
| ALC-REC-16 | 1 | RF-FAC-003 |
| ALC-ADM-01 | 1 | RF-ADM-003, RF-ADM-014, RF-ADM-015, RF-SEG-004 |
| ALC-ADM-02 | 1 | RF-ADM-003 |
| ALC-ADM-03 | 2 | RF-ADM-009, RF-ADM-010 |
| ALC-ADM-04 | 2 | RF-ADM-004, RF-ADM-016 |
| ALC-ADM-06 | 1 | RF-ADM-005, RF-ADM-011, RF-TAR-001 |
| ALC-ADM-07 | 1 | RF-ADM-012 |
| ALC-ADM-08 | 2 | RF-ADM-013, RF-ADM-017 |
| ALC-ADM-09 | 1 | RF-ADM-001, RF-TAR-001, RF-TAR-002, RF-TAR-003 |
| ALC-ADM-10 | 1 | RF-ADM-002 |
| ALC-ADM-11 | 1 | RF-MAN-001 |
| ALC-ADM-12 | 1 | RF-ADM-006, RF-FAC-005 |
| ALC-CM-01 | 1 | — Documento de diseño; tarea técnica fuera de RF (sección 19). |
| ALC-CM-02 | 1 | RF-CM-004, RF-RES-010 |
| ALC-CM-03 | 1 | RF-CM-002, RF-CM-008, RF-HUE-001, RF-PAG-007, RF-PAG-013, RF-RES-001, RF-RES-003, RF-RES-010, RF-RES-014 |
| ALC-CM-04 | 1 | RF-CM-005 |
| ALC-APP-01 | 1 | RF-APP-001, RF-APP-006 |
| ALC-APP-02 | 1 | RF-APP-002, RF-APP-004, RF-RES-013 |
| ALC-APP-03 | 1 | RF-APP-004, RF-RS-010 |
| ALC-APP-04 | 1 | RF-RS-011 |
| ALC-APP-05 | 1 | RF-APP-004, RF-SOL-001, RF-SOL-002, RF-SOL-003, RF-SOL-004, RF-SOL-005 |
| ALC-APP-06 | 2 | RF-APP-003 |
| ALC-APP-07 | 1 | RF-APP-004, RF-PAG-002 |
| ALC-APP-08 | 1 | RF-APP-004, RF-APP-005, RF-FAC-001, RF-FAC-002, RF-PAG-003, RF-PAG-004, RF-PAG-010, RF-REC-002, RF-REC-004, RF-REC-005 |
| ALC-APP-10 | 1 | RF-APP-005, RF-NOT-003 |
| ALC-RS-01 | 1 | RF-RS-001 |
| ALC-RS-02 | 1 | RF-RS-002 |
| ALC-RS-04 | 1 | RF-RS-004 |
| ALC-RS-05 | 1 | RF-RS-005 |
| ALC-RS-06 | 1 | RF-RS-006 |
| ALC-RS-08 | 1 | RF-RS-007 |
| ALC-RS-10 | 1 | RF-RS-009, RF-RS-012 |
| ALC-MYL-01 | 1 | RF-LIM-001, RF-LIM-010 |
| ALC-MYL-02 | 1 | RF-HAB-004, RF-LIM-002, RF-LIM-003 |
| ALC-MYL-03 | 1 | RF-LIM-004, RF-LIM-005, RF-LIM-015, RF-SOL-002 |
| ALC-MYL-07 | 1 | RF-HAB-005, RF-LIM-006, RF-MAN-003, RF-MAN-006, RF-SOL-002 |
| ALC-MYL-09 | 1 | RF-MAN-005, RF-MAN-006, RF-MAN-008, RF-MAN-013, RF-MAN-014 |
| ALC-TRA-01 | 1 | RF-APP-001, RF-APP-006, RF-SEG-001, RF-SEG-004, RF-SEG-005 |
| ALC-TRA-02 | 1 | RF-SEG-002 |
| ALC-TRA-03 | 1 | RF-SEG-003 |
| ALC-TRA-04 | 1 | RF-NOT-001, RF-RS-009, RF-SOL-002 |
| ALC-TRA-05 | 1 | RF-APP-001, RF-FAC-002, RF-NOT-002, RF-RES-014 |
| ALC-TRA-09 | 1 | — Grafana local; tarea técnica fuera de RF (sección 19). |
| ALC-TRA-09b | 2 | RF-SEG-006 |
| ALC-TRA-10 | 1 | — Docker local; tarea técnica fuera de RF (sección 19). |
| ALC-TRA-06 | Después | RF-SEG-007 |
| ALC-TRA-07 | Después | RF-SEG-008 |
| ALC-TRA-08 | Después | RF-SEG-009 |

### 18.2 Historia → RF

Las 68 historias tienen al menos un requisito. Los IDs de esta tabla son exclusivamente de las historias.

| Historia | Nombre | RF |
|---|---|---|
| HU-HUE-01 | Ver la información del hotel | RF-ADM-007 |
| HU-HUE-02 | Ver el catálogo de habitaciones | RF-HAB-006 |
| HU-HUE-03 | Buscar disponibilidad por fechas y huéspedes | RF-RES-001 |
| HU-HUE-04 | Ver el precio total de mi estadía | RF-TAR-004 |
| HU-HUE-05 | Ingresar mis datos y confirmar la reserva | RF-HUE-001, RF-PAG-007, RF-RES-003, RF-RES-008, RF-RES-010, RF-RES-016 |
| HU-HUE-06 | Pagar mi reserva en línea | RF-PAG-003, RF-PAG-004, RF-PAG-012, RF-RES-009 |
| HU-HUE-07 | Recibir la confirmación por correo | RF-NOT-002, RF-RES-014 |
| HU-HUE-08 | Entrar a la app con mi correo y un código | RF-APP-001, RF-APP-006, RF-NOT-002 |
| HU-HUE-09 | Ver mis reservas y el detalle de mi estadía | RF-APP-002, RF-APP-004, RF-RES-013, RF-SEG-002 |
| HU-HUE-10 | Pedir room service | RF-APP-004, RF-RS-010 |
| HU-HUE-11 | Seguir mi pedido en vivo | RF-NOT-001, RF-RS-011 |
| HU-HUE-12 | Solicitar limpieza | RF-APP-004, RF-SOL-001, RF-SOL-002 |
| HU-HUE-13 | Solicitar artículos | RF-APP-004, RF-SOL-002, RF-SOL-004 |
| HU-HUE-14 | Ver el estado de mis solicitudes | RF-SOL-003, RF-SOL-005 |
| HU-HUE-15 | Ver mi cuenta | RF-APP-004, RF-PAG-002, RF-PAG-011, RF-SEG-002 |
| HU-HUE-16 | Pagar mi saldo y hacer check-out desde la app | RF-APP-004, RF-APP-005, RF-FAC-001, RF-FAC-002, RF-NOT-002, RF-PAG-003, RF-PAG-004, RF-PAG-010, RF-REC-002, RF-REC-004, RF-REC-005 |
| HU-HUE-17 | Recibir notificaciones en mi teléfono | RF-APP-005, RF-NOT-003 |
| HU-HUE-18 | Ver las amenidades y el Wi-Fi | RF-APP-003 |
| HU-REC-01 | Registrar un huésped | RF-HUE-001 |
| HU-REC-02 | Registrar huéspedes adicionales | RF-HUE-002 |
| HU-REC-03 | Consultar disponibilidad | RF-RES-001, RF-TAR-004 |
| HU-REC-04 | Crear una reserva | RF-PAG-007, RF-RES-002, RF-RES-003, RF-RES-010, RF-RES-014, RF-TAR-004 |
| HU-REC-05 | Cancelar una reserva | RF-PAG-009, RF-RES-005, RF-RES-016 |
| HU-REC-06 | Buscar reservas | RF-RES-006, RF-RES-007, RF-SEG-003 |
| HU-REC-07 | Asignar o cambiar la habitación antes del check-in | RF-HAB-002, RF-RES-003, RF-RES-016 |
| HU-REC-08 | Ver el calendario Gantt | RF-RES-012, RF-RES-016 |
| HU-REC-09 | Crear una reserva seleccionando días en el Gantt | RF-RES-015 |
| HU-REC-10 | Ver el estado de las habitaciones | RF-HAB-001, RF-HAB-003, RF-NOT-001 |
| HU-REC-11 | Marcar una habitación libre como sucia | RF-HAB-003, RF-HAB-004 |
| HU-REC-12 | Realizar el check-in | RF-APP-004, RF-HAB-003, RF-REC-001 |
| HU-REC-13 | Consultar la cuenta y agregar cargos | RF-PAG-002, RF-PAG-007, RF-PAG-008, RF-PAG-011 |
| HU-REC-14 | Realizar el check-out con pago único | RF-FAC-001, RF-HAB-003, RF-HAB-005, RF-PAG-001, RF-REC-002, RF-REC-004, RF-REC-005 |
| HU-REC-15 | Emitir la factura | RF-FAC-001, RF-FAC-002, RF-FAC-003, RF-NOT-002 |
| HU-REC-16 | Imprimir la factura | RF-FAC-003 |
| HU-REC-17 | Reportar un daño en una habitación | RF-HAB-005, RF-MAN-003, RF-SOL-002 |
| HU-RS-01 | Ver la cola de pedidos activos | RF-NOT-001, RF-RS-001 |
| HU-RS-02 | Ver el detalle de un pedido | RF-RS-002, RF-SEG-002, RF-SEG-003 |
| HU-RS-03 | Avanzar el estado de un pedido | RF-RS-004 |
| HU-RS-04 | Cancelar un pedido | RF-RS-005 |
| HU-RS-05 | Consultar el menú y marcar ítems agotados | RF-RS-006 |
| HU-RS-06 | Generar el cargo del pedido entregado | RF-RS-007 |
| HU-RS-07 | Recibir aviso de pedido nuevo | RF-NOT-001, RF-RS-009, RF-RS-012 |
| HU-MYL-01 | Ver las habitaciones pendientes de limpieza | RF-LIM-001, RF-LIM-010, RF-NOT-001 |
| HU-MYL-02 | Iniciar o interrumpir la limpieza de una habitación | RF-HAB-004, RF-LIM-002 |
| HU-MYL-03 | Marcar la limpieza como terminada | RF-HAB-004, RF-LIM-003 |
| HU-MYL-04 | Ver y tomar solicitudes de huéspedes | RF-LIM-004, RF-LIM-015, RF-NOT-001, RF-SEG-002, RF-SOL-002 |
| HU-MYL-05 | Atender una solicitud | RF-LIM-005 |
| HU-MYL-06 | Reportar un daño | RF-HAB-005, RF-LIM-006, RF-MAN-003, RF-MAN-006, RF-SOL-002 |
| HU-MYL-07 | Ver las incidencias y tomar una | RF-MAN-005, RF-MAN-006, RF-MAN-013, RF-SEG-002 |
| HU-MYL-08 | Resolver una incidencia | RF-MAN-006, RF-MAN-008, RF-MAN-014 |
| HU-ADM-01 | Crear un empleado | RF-ADM-003 |
| HU-ADM-02 | Editar, desactivar o restablecer la contraseña de un empleado | RF-ADM-014, RF-ADM-015 |
| HU-ADM-03 | Gestionar tipos de habitación | RF-ADM-005, RF-TAR-001 |
| HU-ADM-04 | Gestionar habitaciones | RF-ADM-011 |
| HU-ADM-05 | Gestionar el menú de Room Service | RF-ADM-012, RF-RS-006 |
| HU-ADM-06 | Gestionar temporadas | RF-ADM-001, RF-TAR-002 |
| HU-ADM-07 | Configurar el ajuste de fin de semana | RF-ADM-001, RF-TAR-003 |
| HU-ADM-08 | Configurar los datos del hotel y de facturación | RF-ADM-006, RF-FAC-005 |
| HU-ADM-09 | Ver los indicadores básicos | RF-ADM-002 |
| HU-ADM-10 | Consultar las incidencias de mantenimiento | RF-MAN-001, RF-SEG-003 |
| HU-ADM-11 | Gestionar amenidades y el Wi-Fi | RF-ADM-013, RF-ADM-017 |
| HU-ADM-12 | Definir y asignar turnos | RF-ADM-009, RF-ADM-010 |
| HU-ADM-13 | Gestionar el inventario | RF-ADM-004, RF-ADM-016 |
| HU-CM-01 | Recibir una reserva de un canal externo | RF-CM-002, RF-CM-008, RF-HUE-001, RF-PAG-007, RF-PAG-013, RF-RES-001, RF-RES-003, RF-RES-010, RF-RES-014 |
| HU-CM-02 | Ver el canal de origen de las reservas | RF-CM-004, RF-RES-005, RF-RES-010 |
| HU-CM-03 | Enviar reservas de prueba con el canal simulado | RF-CM-005, RF-CM-008 |
| HU-EMP-01 | Iniciar y cerrar sesión en la web privada | RF-SEG-001, RF-SEG-002 |
| HU-EMP-02 | Cambiar mi contraseña temporal | RF-SEG-004 |

## 19. Fuera de este documento

- **ALC-TRA-09 — Grafana local:** estado del API, peticiones, errores HTTP, CPU y RAM. Tarea técnica del índice HU, sección 5.
- **ALC-TRA-10 — Docker local:** entorno compartido con PostgreSQL y correo de prueba. Tarea técnica del índice HU, sección 5.
- **ALC-CM-01 — Diseño de Channel Manager:** documento breve sobre la futura integración real. Tarea técnica, no pantalla ni comportamiento adicional de la API.
- **Datos iniciales con Flyway:** canales y claves, artículos y máximos, hotel, datos fiscales, serie y correlativo inicial y usuarios de prueba por rol, incluidos dos Administradores. Son una tarea técnica del índice HU, sección 5; su carga no genera RF de administración de esos datos.

## 20. Observaciones para revisión

Las observaciones no autorizan funciones ni correcciones en otros documentos. Se transcriben los comportamientos explícitos vigentes y se señalan las diferencias sin añadir soluciones.

| ID | Hallazgo | Tratamiento en este documento |
|---|---|---|
| OBS-RF-01 | Las instrucciones exigen un RF por cada elemento del alcance, pero también excluyen expresamente Grafana local, Docker local y el documento de diseño de canales de los RF. | Se incluyen los 67 elementos en trazabilidad; ALC-TRA-09, ALC-TRA-10 y ALC-CM-01 se marcan como tareas técnicas, sin inventar RF. Los 64 restantes tienen RF. |
| OBS-RF-02 | Las instrucciones exigen HU o tarea del índice para cada RF, pero piden también ALC-TRA-06, ALC-TRA-07 y ALC-TRA-08. Estos aparecen en la sección 6 del Alcance, no como historias ni como tareas de la sección 5 del índice. | RF-SEG-007 a RF-SEG-009 se incluyen por la instrucción expresa de documentar Después, citando directamente su origen. No se crean HU ficticias. |

## 21. Resumen

| Módulo | Nivel 1 | Nivel 2 | Después | Fase 2 | Total |
|---|---:|---:|---:|---:|---:|
| RF-RES — Reservas | 13 | 1 | 0 | 0 | 14 |
| RF-HUE — Huéspedes | 2 | 0 | 0 | 0 | 2 |
| RF-HAB — Habitaciones | 6 | 0 | 0 | 0 | 6 |
| RF-REC — Check-in y check-out | 4 | 0 | 0 | 0 | 4 |
| RF-PAG — Pagos y cuenta | 11 | 0 | 0 | 0 | 11 |
| RF-TAR — Tarifas | 4 | 0 | 0 | 0 | 4 |
| RF-RS — Room Service | 9 | 1 | 0 | 0 | 10 |
| RF-LIM — Limpieza | 8 | 0 | 0 | 0 | 8 |
| RF-SOL — Solicitudes del huésped | 5 | 0 | 0 | 0 | 5 |
| RF-MAN — Mantenimiento | 7 | 0 | 0 | 0 | 7 |
| RF-ADM — Administración | 10 | 6 | 0 | 0 | 16 |
| RF-APP — App del huésped | 5 | 1 | 0 | 0 | 6 |
| RF-CM — Channel Manager | 4 | 0 | 0 | 0 | 4 |
| RF-NOT — Tiempo real, notificaciones y correos | 3 | 0 | 0 | 0 | 3 |
| RF-FAC — Facturación e impresión | 4 | 0 | 0 | 0 | 4 |
| RF-SEG — Seguridad y trazabilidad | 5 | 1 | 3 | 0 | 9 |
| **Total** | **100** | **10** | **3** | **0** | **113** |

Los conteos corresponden a IDs de requisito, no a pantallas ni estimaciones de trabajo.

**Cobertura verificada:** 68/68 historias; 67/67 elementos de alcance consignados (64 con RF y 3 tareas técnicas excluidas); 113 IDs únicos; todas las referencias RN corresponden a reglas vigentes del documento 10. Los compromisos Después y las excepciones documentales se identifican en OBS-RF-01 y OBS-RF-02.
