# 12 — Casos de Uso

> **Proyecto:** Property Management System (PMS) para Hoteles Boutique — Hotel ficticio "Villa Serena"
> **Estado:** 📝 Para revisión del equipo
> **Fecha:** 1 de octubre de 2026
> **Basado en:** 01 — Alcance, 02 — Roles, 04 — Historias de Usuario, 07 — Estados y 09 — Matriz de Permisos

---

## Índice

1. [Propósito y plantilla](#1-propósito-y-plantilla)
2. [Actores](#2-actores)
3. [Mapa de casos de uso](#3-mapa-de-casos-de-uso)
4. [Reservas](#4-reservas) — UC-01, UC-02, UC-10, UC-14
5. [Pagos y facturación](#5-pagos-y-facturación) — UC-05, UC-20
6. [Estadía](#6-estadía) — UC-11, UC-03, UC-04
7. [Servicios al huésped](#7-servicios-al-huésped) — UC-06, UC-13
8. [Operación de habitaciones](#8-operación-de-habitaciones) — UC-07, UC-08
9. [Procesos automáticos](#9-procesos-automáticos) — UC-15
10. [Channel Manager](#10-channel-manager) — UC-16
11. [Administración y acceso del personal](#11-administración-y-acceso-del-personal) — UC-17, UC-19, UC-21, UC-18
12. [Historias que no necesitan un caso de uso](#12-historias-que-no-necesitan-un-caso-de-uso)

---

## 1. Propósito y plantilla

Un **caso de uso** describe **una interacción completa** entre un actor y el sistema para lograr un objetivo, incluido qué pasa cuando algo sale mal. Recorre varias historias de principio a fin. **No agrega reglas:** todo sale de las historias, del 07 y del 09.

Los IDs UC-09 y UC-12 no se utilizan.

| Campo | Contenido |
|---|---|
| Actores | Principal y secundarios (documento 02) |
| Historias | Historias que cubre |
| Nivel | 1 (obligatorio para el 10 de octubre) o 2 (si da tiempo) |
| Precondiciones | Qué debe ser cierto antes de empezar |
| Estados (07) | Transiciones del documento 07 que ocurren en el caso |
| Reglas (10) | Reglas del documento 10 de las historias que cubre el caso |
| Flujo principal | Pasos del caso exitoso |
| Flujos alternativos | Variantes y errores (`A1`, `A2`…), indicando el paso donde ocurren |
| Postcondiciones | Qué es cierto al terminar |

> **Reglas de negocio:** el campo "Reglas (10)" reúne las reglas del documento 10 de las historias que cubre cada caso (tabla "Historia → reglas" del 10).

---

## 2. Actores

| Actor | Tipo | Documento 02 |
|---|---|---|
| Cliente (web pública, sin sesión) | Humano | Sección 3.5 |
| Huésped (app, con sesión OTP) | Humano | Sección 3.5 |
| Recepcionista | Humano | Sección 3.2 |
| Room Service | Humano | Sección 3.3 |
| Mantenimiento/Limpieza (MYL) | Humano | Sección 3.4 |
| Administrador | Humano | Sección 3.1 |
| Sistema | Procesos automáticos | Sección 4 |
| Stripe | Sistema externo | Sección 4 |
| Canal externo | Sistema externo | Sección 4 |

---

## 3. Mapa de casos de uso

| UC | Nombre | Nivel | Cliente / Huésped | Recepción | Room Service | MYL | Admin | Sistema / externos |
|---|---|---|---|---|---|---|---|---|
| UC-01 | Buscar disponibilidad | 1 | ● | ● | | | | |
| UC-02 | Crear reserva | 1 | ● | ● | | | | Stripe, Sistema |
| UC-10 | Cancelar reserva | 1 | | ● | | | | Stripe, Sistema |
| UC-14 | Consultar el calendario Gantt | 1 | | ● | | | | |
| UC-05 | Procesar pago en línea | 1 | ● | | | | | Stripe, Sistema |
| UC-20 | Emitir e imprimir la factura | 1 | ○ | ● | | | | Sistema |
| UC-11 | Acceder a la app (OTP) | 1 | ● | | | | | |
| UC-03 | Realizar check-in | 1 | | ● | | | | Sistema |
| UC-04 | Realizar check-out | 1 | ● | ● | | | | Sistema, Stripe |
| UC-06 | Gestionar pedido de Room Service | 1 | ● | | ● | | | Sistema |
| UC-13 | Atender solicitud de limpieza o artículos | 1 | ● | | | ● | | Sistema |
| UC-07 | Limpiar una habitación | 1 | | ○ | | ● | | Sistema |
| UC-08 | Gestionar incidencia de mantenimiento | 1 | | ● | | ● | ○ | Sistema |
| UC-15 | Cancelar reservas web sin pago | 1 | | | | | | Sistema, Stripe |
| UC-16 | Recibir reserva de un canal externo | 1 | | ○ | | | ○ | **Canal** (principal) |
| UC-17 | Configurar tarifas dinámicas | 1 | | | | | ● | |
| UC-19 | Gestionar personal (y turnos, Nivel 2) | 1 / 2 | | | | | ● | |
| UC-21 | Acceso del personal | 1 | | ● | ● | ● | ● | |
| UC-18 | Gestionar inventario aislado | 2 | | | | | ● | |

● Actor principal · ○ Participa (consulta, recibe el resultado o ejecuta una parte)

---

## 4. Reservas

### UC-01 — Buscar disponibilidad

| Campo | Contenido |
|---|---|
| Actores | Cliente o Recepcionista |
| Historias | HU-HUE-03, HU-HUE-04, HU-REC-03 |
| Nivel | 1 |
| Precondiciones | Existen tipos de habitación activos con habitaciones activas y precio base. |
| Estados (07) | Ninguno (solo consulta) |
| Reglas (10) | RN-HAB-001, RN-RES-002, RN-RES-005, RN-RES-006, RN-RES-007, RN-RES-008, RN-TAR-001, RN-TAR-002, RN-TAR-005, RN-TAR-006, RN-TAR-007, RN-TAR-008, RN-TAR-009 |

**Flujo principal**

1. El actor indica fecha de entrada, fecha de salida y número de huéspedes.
2. El sistema valida: de 1 a 30 noches, sin fechas pasadas, salida posterior a la entrada y entrada a no más de 365 días.
3. El sistema toma los tipos **activos** con capacidad suficiente.
4. Para cada tipo y noche, calcula la disponibilidad: habitaciones activas no `FUERA_DE_SERVICIO` − reservas `PENDIENTE_PAGO`, `CONFIRMADA` o `EN_ESTADIA` del tipo (con o sin habitación).
5. Muestra solo los tipos con disponibilidad en **todas** las noches, con el precio de cada noche (base × temporada × fin de semana, redondeado a 2 decimales) y el total en quetzales.

**Flujos alternativos**

- **A1 (paso 2) — Fechas inválidas:** se muestra el motivo y no se busca.
- **A2 (paso 5) — Sin disponibilidad:** se muestra un mensaje claro y se sugiere cambiar las fechas o los huéspedes.
- **A3 (paso 5) — Recepción:** además muestra cuántas habitaciones quedan de cada tipo.

**Postcondiciones:** el actor conoce las opciones y precios. No cambia ningún dato.

---

### UC-02 — Crear reserva

| Campo | Contenido |
|---|---|
| Actores | Cliente (web) o Recepcionista (principal) · Stripe y Sistema (secundarios, solo web) |
| Historias | HU-HUE-05, HU-HUE-06, HU-HUE-07, HU-REC-01, HU-REC-04, HU-REC-07 |
| Nivel | 1 |
| Precondiciones | El actor hizo UC-01 y eligió un tipo de habitación. |
| Estados (07) | R1 o R2 · K1 · G1 · (web) P1, P2, R4 |
| Reglas (10) | RN-CAN-013, RN-HAB-001, RN-HAB-002, RN-NOT-003, RN-NOT-005, RN-PAG-001, RN-PAG-002, RN-PAG-003, RN-PAG-004, RN-PAG-005, RN-PAG-006, RN-PAG-007, RN-PAG-009, RN-PAG-014, RN-RES-001, RN-RES-002, RN-RES-004, RN-RES-005, RN-RES-006, RN-RES-007, RN-RES-009, RN-RES-010, RN-RES-011, RN-RES-012, RN-RES-013, RN-RES-018, RN-RES-019, RN-TAR-001, RN-TAR-002, RN-TAR-006, RN-TAR-007, RN-TAR-008 |

**Flujo principal (web pública)**

1. El cliente ingresa los 6 datos del huésped principal: nombre completo, correo, teléfono, nacionalidad, tipo y número de documento.
2. El sistema muestra el resumen: tipo, fechas, noches, huéspedes y total.
3. El cliente confirma.
4. El sistema **revalida la disponibilidad**.
5. El sistema busca al huésped por su correo: si ya existe, usa ese perfil sin cambiar sus datos; si no, lo crea.
6. El sistema crea la reserva `PENDIENTE_PAGO` (canal `DIRECTO_WEB`, código único, precio fijo) y la cuenta `ABIERTA` con el cargo por alojamiento.
7. El cliente paga en Stripe (**UC-05**).
8. Al aprobarse el pago, la reserva pasa a `CONFIRMADA` y se envía el correo de confirmación con el código y el enlace de la app.

**Flujos alternativos**

- **A1 (paso 1) — Datos incompletos o correo inválido:** se señala el campo y no se continúa.
- **A2 (paso 4) — Ya no hay disponibilidad:** se avisa, no se crea la reserva y se vuelve a UC-01.
- **A3 (paso 7) — No paga en 30 minutos:** la reserva se cancela sola (**UC-15**).
- **A4 — Reserva en Recepción:**
  1. El recepcionista elige un huésped existente o lo registra (HU-REC-01; si el correo ya existe, se usa ese perfil).
  2. Indica fechas, huéspedes, tipo y, si quiere, una habitación del tipo (HU-REC-07).
  3. El sistema muestra la tarifa de cada noche y el total.
  4. El sistema revalida la disponibilidad y crea la reserva directamente `CONFIRMADA` (canal `RECEPCION`) con la cuenta `ABIERTA`. **No se cobra por adelantado.**
  5. Se envía el correo de confirmación.
- **A5 (después de crearla) — El cliente se equivocó:** no puede cambiarla. Si ya pagó, pide a Recepción que la cancele (UC-10) y se crea otra; si no pagó, se cancela sola a los 30 minutos.

**Postcondiciones:** existe una reserva `CONFIRMADA` (o `PENDIENTE_PAGO` en espera de pago) con su cuenta, y la disponibilidad se redujo.

---

### UC-10 — Cancelar reserva

| Campo | Contenido |
|---|---|
| Actores | Recepcionista (principal) · Stripe y Sistema (secundarios) |
| Historias | HU-REC-05, HU-CM-02 |
| Nivel | 1 |
| Precondiciones | La reserva está `CONFIRMADA` y **no** viene de un canal externo. |
| Estados (07) | R7 · K2 · P6 (si hay reembolso) |
| Reglas (10) | RN-CAN-001, RN-CAN-002, RN-CAN-006, RN-CAN-008, RN-CAN-011, RN-CAN-012, RN-CAN-013, RN-RES-004, RN-RES-010, RN-SEG-006 |

**Flujo principal**

1. El recepcionista abre el detalle de la reserva (UC-14 o búsqueda) y elige "Cancelar".
2. El sistema muestra qué pasará con el dinero, sin cálculos parciales:
   - 48 horas o más antes de las 15:00 del día de llegada y pagada en línea → **reembolso total** por Stripe.
   - Menos de 48 horas → **sin reembolso**.
   - Reserva sin pagos (creada en Recepción) → nada que reembolsar.
3. El recepcionista escribe el motivo (obligatorio) y confirma.
4. Si corresponde, el sistema solicita el reembolso a Stripe y el pago pasa a `REEMBOLSADO`.
5. La reserva pasa a `CANCELADA`, la cuenta se cierra tal como está y se liberan el cupo y la habitación asignada. Se registra fecha, hora, responsable y motivo.

**Flujos alternativos**

- **A1 — Huésped que no llegó:** se cancela con el motivo "No se presentó". Como faltan menos de 48 horas, no hay reembolso.
- **A2 (paso 4) — Stripe rechaza el reembolso:** la reserva **no** se cancela y se muestra el error. Recepción puede volver a intentarlo.
- **A3 (paso 1) — Reserva de canal externo:** no aparece la opción de cancelar; si se intenta por otra vía, el sistema responde "Las reservas de canal no se cancelan desde el sistema". Si el huésped no llega, la reserva queda `CONFIRMADA` (limitación aceptada).
- **A4 (paso 1) — Reserva `PENDIENTE_PAGO` u otro estado:** la opción no aparece y el backend lo rechaza.
- **A5 — Cambiar fechas, tipo o huéspedes:** no se modifica; se cancela con este caso y se crea otra reserva (UC-02, A4).

**Postcondiciones:** reserva `CANCELADA`, cuenta `CERRADA`, disponibilidad liberada y reembolso total si correspondía. **No se envía correo**: Recepción avisa al cliente por su cuenta.

---

### UC-14 — Consultar el calendario Gantt

| Campo | Contenido |
|---|---|
| Actores | Recepcionista |
| Historias | HU-REC-08, HU-REC-09 (Nivel 2), HU-CM-02 |
| Nivel | 1 (crear desde el calendario: Nivel 2) |
| Precondiciones | Existen habitaciones activas. |
| Estados (07) | Ninguno (consulta) |
| Reglas (10) | RN-CAN-012, RN-RES-010, RN-RES-018, RN-RES-024, RN-RES-025, RN-SEG-006 |

**Flujo principal**

1. El recepcionista abre el calendario.
2. El sistema muestra las habitaciones agrupadas por tipo (filas), una fila "Sin asignar" y los días (columnas). Cada reserva activa o finalizada es una barra con color según su estado e ícono según su canal; las `CANCELADA` no se muestran.
3. El recepcionista navega por semanas o meses, o vuelve a "Hoy".
4. Hace clic en una barra y ve el resumen (código, huésped, fechas, estado y canal) con un enlace al detalle.
5. Con el botón "Nueva reserva" abre el formulario de UC-02 (A4); al guardar, la reserva aparece en el calendario.

**Flujos alternativos**

- **A1 — Reserva sin habitación:** aparece en la fila "Sin asignar" hasta que se le asigna una (HU-REC-07).
- **A2 — Cambiar fechas:** las barras no se arrastran ni se estiran; se cancela y se crea otra reserva.
- **A3 — Cambios de otros usuarios:** el calendario no es de tiempo real; se actualiza al abrirlo o al volver a él.
- **A4 (Nivel 2) — Crear seleccionando días:** el recepcionista selecciona días libres en la fila de una habitación y se abre el formulario de UC-02 (A4) con la habitación, el tipo y las fechas llenados. No se puede seleccionar un rango traslapado ni una habitación `FUERA_DE_SERVICIO`.

**Postcondiciones:** Recepción ve la ocupación del hotel.

---

## 5. Pagos y facturación

### UC-05 — Procesar pago en línea

| Campo | Contenido |
|---|---|
| Actores | Cliente (pago de la reserva) o Huésped (pago del saldo) · Stripe · Sistema |
| Historias | HU-HUE-06, HU-HUE-16 |
| Nivel | 1 |
| Precondiciones | Reserva `PENDIENTE_PAGO` (web) o reserva `EN_ESTADIA` con saldo mayor que cero, dentro de la ventana del check-out: de las 00:00 a las 12:00 del día de salida (app). |
| Estados (07) | P1, P2, P3 · R4 (si es el pago de la reserva) |
| Reglas (10) | RN-APP-005, RN-APP-006, RN-APP-008, RN-CAN-013, RN-FAC-005, RN-FAC-008, RN-HAB-008, RN-LIM-009, RN-PAG-001, RN-PAG-002, RN-PAG-003, RN-PAG-004, RN-PAG-005, RN-PAG-006, RN-PAG-013, RN-PAG-014, RN-RES-004, RN-RES-012, RN-RES-015, RN-RES-021, RN-RES-022, RN-RS-011 |

**Flujo principal**

1. El sistema registra un pago `PENDIENTE` y abre la sesión de Stripe por el total de la reserva (web) o por el saldo de la cuenta (app).
2. El actor paga en la página de Stripe (modo prueba). El sistema nunca ve los datos de la tarjeta.
3. Stripe envía el aviso (webhook) de pago aprobado.
4. El sistema verifica la firma y que el aviso no se haya procesado antes.
5. El pago pasa a `APROBADO`.
6. Si era el pago de la reserva, la reserva pasa a `CONFIRMADA` (UC-02, paso 8).
7. El actor vuelve al sitio o a la app y ve el resultado.

**Flujos alternativos**

- **A1 (paso 2) — Tarjeta rechazada o el actor cierra la página:** el pago sigue `PENDIENTE`; puede reintentar con el mismo enlace mientras la reserva siga `PENDIENTE_PAGO`. La página de retorno muestra "pago no completado" con la opción de reintentar.
- **A2 — La sesión vence sin pago:** el pago pasa a `FALLIDO` (en la reserva web, a los 30 minutos, con UC-15).
- **A3 (paso 4) — Aviso repetido:** se responde bien a Stripe y no se procesa de nuevo.
- **A4 (paso 4) — Firma inválida:** el aviso se rechaza y no cambia nada.
- **A5 (paso 7) — El actor vuelve antes de que llegue el aviso:** la página muestra "pago en proceso".

**Postcondiciones:** el pago queda `APROBADO` una sola vez, o `FALLIDO` si la sesión venció.

**Limitación aceptada:** en la app no se controla que el huésped abra dos sesiones de pago del saldo a la vez (documento 07, sección 5.3).

---

### UC-20 — Emitir e imprimir la factura

| Campo | Contenido |
|---|---|
| Actores | Recepcionista (principal) · Huésped (en su check-out desde la app) · Sistema |
| Historias | HU-REC-15, HU-REC-16, HU-HUE-16 |
| Nivel | 1 |
| Precondiciones | Ocurre dentro del check-out (UC-04). Saldo exactamente 0 y la cuenta no tiene otra factura. Los datos fiscales, la serie y el número inicial ya existen desde los datos iniciales. |
| Estados (07) | F1 |
| Reglas (10) | RN-APP-005, RN-APP-006, RN-APP-008, RN-FAC-001, RN-FAC-002, RN-FAC-004, RN-FAC-005, RN-FAC-007, RN-FAC-008, RN-FAC-009, RN-HAB-008, RN-LIM-009, RN-PAG-001, RN-PAG-005, RN-PAG-013, RN-PAG-014, RN-RES-015, RN-RES-021, RN-RES-022, RN-RS-011, RN-TAR-005 |

**Flujo principal (Recepción, dentro de UC-04)**

1. El recepcionista escribe el NIT del comprador o elige "Consumidor Final" (CF), y el nombre del comprador (por defecto, el del huésped).
2. El sistema valida el NIT con su dígito verificador (el último puede ser "K").
3. En la misma operación del check-out, el sistema toma el siguiente correlativo de la serie fija y crea la factura `EMITIDA`.
4. La factura muestra los datos del hotel, serie y número, fecha y hora, NIT y nombre del comprador, código de reserva, cargos vigentes, total con "IVA incluido" (sin desglose), los pagos (método y monto) y la leyenda "Factura de demostración — no válida ante la SAT".
5. El sistema genera el PDF, lo guarda y lo envía por correo al huésped.
6. El sistema ofrece imprimirla: el recepcionista elige ticket de 80 mm u hoja carta e imprime desde el navegador.

**Flujos alternativos**

- **A1 — Check-out desde la app:** el huésped indica su NIT o CF y el nombre del comprador; el sistema hace los pasos 2 a 5 y la app muestra la pantalla final con la factura.
- **A2 (paso 2) — NIT inválido:** se muestra un error y no se continúa hasta corregirlo o elegir CF.
- **A3 (paso 3) — Falla la emisión:** todo el check-out se revierte (UC-04, A5).
- **A4 — Reimprimir:** desde el detalle de la reserva, todas las veces que se quiera. Todas las impresiones son iguales (sin "COPIA") y el estado no cambia.

**Postcondiciones:** la cuenta tiene una única factura `EMITIDA`, sin saltos en el correlativo, guardada en PDF y enviada al huésped. No se modifica ni se anula.

---

## 6. Estadía

### UC-11 — Acceder a la app (OTP)

| Campo | Contenido |
|---|---|
| Actores | Huésped |
| Historias | HU-HUE-08, HU-HUE-09, HU-HUE-17 |
| Nivel | 1 |
| Precondiciones | El huésped tiene al menos una reserva hecha con su correo (web, Recepción o canal). |
| Estados (07) | Ninguno |
| Reglas (10) | RN-APP-001, RN-APP-002, RN-APP-003, RN-APP-005, RN-APP-010, RN-APP-011, RN-NOT-001, RN-NOT-002, RN-NOT-004, RN-SEG-001, RN-SEG-006 |

**Flujo principal**

1. El huésped abre la app y escribe su correo.
2. El sistema envía un código de 6 dígitos al correo (vence en 10 minutos, de un solo uso).
3. El huésped escribe el código.
4. El sistema lo valida y abre la sesión: token de acceso de 15 minutos y refresh de 7 días que se renueva en cada uso.
5. El huésped queda vinculado con todas las reservas de su correo.
6. Si tiene una reserva `EN_ESTADIA`, entra directo a ella; si no, ve el selector con código, fechas y estado de cada reserva.
7. La app pide permiso para enviar notificaciones (si lo rechaza, la app funciona igual).

**Flujos alternativos**

- **A1 (paso 2) — El correo no tiene reservas:** mensaje genérico que no revela si el correo existe.
- **A2 (paso 4) — Código vencido o ya usado:** se muestra un mensaje y puede pedir otro.
- **A3 (paso 4) — 5 intentos fallidos:** el acceso se bloquea 15 minutos.
- **A4 — No abre la app en 7 días o cierra sesión:** debe volver a entrar con un código; el teléfono deja de recibir notificaciones al cerrar sesión.
- **A5 (paso 6) — Reserva aún no `EN_ESTADIA`:** ve el detalle ("Por asignar" si no tiene habitación) y su cuenta; room service y solicitudes aparecen con el aviso de que estarán disponibles durante la estadía.

**Postcondiciones:** el huésped tiene sesión y solo ve sus propias reservas.

---

### UC-03 — Realizar check-in

| Campo | Contenido |
|---|---|
| Actores | Recepcionista (principal) · Sistema |
| Historias | HU-REC-06, HU-REC-07, HU-REC-02, HU-REC-12, HU-REC-10 |
| Nivel | 1 |
| Precondiciones | Reserva `CONFIRMADA`; hoy está entre la fecha de entrada y el día anterior a la salida. |
| Estados (07) | R6 · O1 |
| Reglas (10) | RN-APP-004, RN-HAB-001, RN-HAB-002, RN-HAB-004, RN-HAB-014, RN-NOT-009, RN-RES-002, RN-RES-013, RN-RES-014, RN-RES-018, RN-RES-020, RN-RES-023 |

**Flujo principal**

1. El recepcionista busca la reserva con el filtro "Llegan hoy" o con el buscador, y elige "Check-in".
2. El sistema muestra los datos del huésped principal y de los adicionales para verificarlos.
3. El sistema confirma que la reserva tiene una habitación asignada, `LIBRE` + `LIMPIA`.
4. El recepcionista confirma el check-in.
5. La reserva pasa a `EN_ESTADIA` y la habitación a `OCUPADA` (Recepción y Limpieza lo ven en tiempo real). Se registran fecha, hora y recepcionista.
6. En la app se habilitan room service y solicitudes.

**Flujos alternativos**

- **A1 (paso 3) — Sin habitación asignada:** el recepcionista asigna una del tipo reservado (HU-REC-07) y continúa.
- **A2 (paso 3) — La habitación no está `LIBRE` + `LIMPIA`:** no se permite el check-in. Recepción asigna otra limpia del mismo tipo o espera a Limpieza (UC-07). La hora de check-in (15:00) es referencial: se permite antes si la habitación ya está limpia.
- **A3 (paso 2) — Faltan huéspedes adicionales:** se registran en ese momento (HU-REC-02), sin superar el número de huéspedes de la reserva.
- **A4 — Llegada después de medianoche:** el check-in se permite, pero la reserva no aparece en "Llegan hoy"; Recepción la busca por nombre o código.
- **A5 (paso 1) — Reserva `PENDIENTE_PAGO` o de fechas futuras:** no se permite; se muestra el motivo.

**Postcondiciones:** reserva `EN_ESTADIA`, habitación `OCUPADA` y estadía habilitada en la app. Las noches no usadas se cobran igual.

---

### UC-04 — Realizar check-out

| Campo | Contenido |
|---|---|
| Actores | Recepcionista o Huésped (principal) · Sistema · Stripe (pago desde la app) |
| Historias | HU-REC-06, HU-REC-13, HU-REC-14, HU-REC-15, HU-HUE-15, HU-HUE-16, HU-HUE-17 |
| Nivel | 1 |
| Precondiciones | Reserva `EN_ESTADIA` sin pedidos `EN_CAMINO`. |
| Estados (07) | R8 · P4 (Recepción) · F1 · K2 · O2 · C1 o C7 · Q5 · S6 |
| Reglas (10) | RN-APP-005, RN-APP-006, RN-APP-008, RN-APP-013, RN-FAC-001, RN-FAC-002, RN-FAC-004, RN-FAC-005, RN-FAC-008, RN-FAC-009, RN-HAB-002, RN-HAB-004, RN-HAB-008, RN-LIM-009, RN-NOT-001, RN-NOT-002, RN-NOT-004, RN-PAG-001, RN-PAG-005, RN-PAG-007, RN-PAG-010, RN-PAG-011, RN-PAG-013, RN-PAG-014, RN-PAG-019, RN-PAG-020, RN-PAG-021, RN-RES-015, RN-RES-021, RN-RES-022, RN-RES-023, RN-RS-011, RN-SEG-001, RN-SEG-006, RN-TAR-005, RN-TAR-009, RN-TAR-010 |

**Flujo principal (Recepción)**

1. El recepcionista busca la estadía con el filtro "Salen hoy" o con el buscador.
2. El sistema muestra la cuenta completa y el saldo pendiente.
3. Si hay saldo, registra **un solo pago por el saldo total** con su método (efectivo, tarjeta u otro) y una referencia opcional. Si el saldo ya es 0, no se pide pago.
4. Indica el NIT o CF y el nombre del comprador, y confirma.
5. En **una sola operación**, el sistema:
   - emite la factura (**UC-20**);
   - pasa la reserva a `FINALIZADA` y la cuenta a `CERRADA`;
   - pasa la habitación a `LIBRE` + `SUCIA` (aparece en los pendientes de Limpieza);
   - cancela las solicitudes `PENDIENTE` o `EN_PROCESO`;
   - cancela sin cargo los pedidos `NUEVO` o `EN_PREPARACION` (motivo "Estadía finalizada").
6. El huésped recibe la factura por correo; su app muestra la pantalla final y deja de recibir notificaciones.

**Flujos alternativos**

- **A1 — Check-out desde la app:**
  1. Entre las 00:00 del día de salida y las 12:00, el huésped elige "Hacer check-out".
  2. Si tiene pedidos `NUEVO` o `EN_PREPARACION`, se le avisa que se cancelarán sin cargo y debe aceptarlo.
  3. Si hay saldo, lo paga con Stripe (**UC-05**); si ya es Q 0.00, se salta este paso.
  4. Indica su NIT o CF y el nombre del comprador, y confirma; el sistema hace el paso 5.
  5. La app muestra la pantalla final con la factura (se puede abrir el PDF).
- **A2 (paso 5) — La habitación tiene una incidencia sin resolver que impide su uso:** pasa a `FUERA_DE_SERVICIO` en lugar de `SUCIA`.
- **A3 (precondición) — Hay un pedido `EN_CAMINO`:** no se permite el check-out; se muestra el aviso de esperar la entrega.
- **A4 (A1, paso 1) — Fuera de la ventana de la app:** la app muestra el aviso de hacer el check-out en Recepción.
- **A5 (paso 5) — Falla algo (por ejemplo, la factura):** no se aplica ningún cambio y se muestra el motivo. En Recepción tampoco se registra el pago de esa operación; en la app, el pago ya aprobado se conserva y se puede reintentar sin volver a cobrar.
- **A6 — Salida tarde:** no hay nada automático ni cargo extra; Recepción hace el check-out cuando el huésped baje. Si la habitación tenía otra llegada, ese check-in espera a que esté `LIBRE` + `LIMPIA`.

**Postcondiciones:** reserva `FINALIZADA`, cuenta `CERRADA` con saldo 0 y factura `EMITIDA`, habitación lista para limpieza (o fuera de servicio).

---

## 7. Servicios al huésped

### UC-06 — Gestionar pedido de Room Service

| Campo | Contenido |
|---|---|
| Actores | Huésped (pide) · Room Service (atiende) · Sistema |
| Historias | HU-HUE-10, HU-HUE-11, HU-HUE-17, HU-RS-01 a HU-RS-07 |
| Nivel | 1 |
| Precondiciones | Reserva `EN_ESTADIA`; el menú tiene ítems `DISPONIBLE`. |
| Estados (07) | S1 a S5 · G1 |
| Reglas (10) | RN-APP-005, RN-NOT-001, RN-NOT-002, RN-NOT-004, RN-NOT-006, RN-NOT-007, RN-PAG-010, RN-RS-001, RN-RS-002, RN-RS-003, RN-RS-004, RN-RS-005, RN-RS-006, RN-RS-007, RN-RS-008, RN-RS-010, RN-RS-012, RN-SEG-002 |

**Flujo principal**

1. El huésped elige ítems del menú en la app, con cantidades y notas. Ve el total y el aviso de que se cargará a la cuenta al entregarse.
2. El sistema crea el pedido `NUEVO` con los precios congelados; aparece al instante en la cola de Room Service, con aviso visual (evento 1).
3. Room Service abre el detalle (ítems, notas destacadas, nombre del huésped, habitación y piso) y lo pasa a `EN_PREPARACION`.
4. Lo pasa a `EN_CAMINO` y luego a `ENTREGADO`, siempre en orden.
5. En cada cambio, el huésped ve el estado en la app sin recargar (evento 2).
6. Al pasar a `ENTREGADO`, el sistema genera **un solo** cargo "Room Service — Pedido #n" y el huésped recibe una notificación push.

**Flujos alternativos**

- **A1 (paso 1) — Ítem `AGOTADO`:** se ve como no disponible y no se puede agregar.
- **A2 (paso 2) — Un ítem se agotó mientras armaba el pedido:** el pedido no se crea y se indica qué ítem quitar.
- **A3 (pasos 3 y 4) — Cancelación:** Room Service cancela con motivo (también `EN_CAMINO`); no hay cargo y el huésped ve el motivo. El huésped no puede cancelar.
- **A4 (pasos 3 y 4) — Otro empleado ya cambió el estado:** se muestra un aviso y se recarga el pedido.
- **A5 — Check-out con el pedido `NUEVO` o `EN_PREPARACION`:** se cancela solo, sin cargo (UC-04).
- **A6 — Se pierde la conexión:** al reconectarse, la cola y la app vuelven a cargar el estado actual.

**Postcondiciones:** pedido `ENTREGADO` con su cargo, o `CANCELADO` sin cargo.

---

### UC-13 — Atender solicitud de limpieza o artículos

| Campo | Contenido |
|---|---|
| Actores | Huésped (pide) · MYL con área Limpieza o Ambas (atiende) · Sistema |
| Historias | HU-HUE-12, HU-HUE-13, HU-HUE-14, HU-HUE-17, HU-MYL-04, HU-MYL-05 |
| Nivel | 1 |
| Precondiciones | Reserva `EN_ESTADIA`. |
| Estados (07) | Q1 a Q5 |
| Reglas (10) | RN-APP-005, RN-LIM-003, RN-LIM-005, RN-LIM-006, RN-LIM-007, RN-LIM-008, RN-LIM-011, RN-LIM-013, RN-LIM-014, RN-LIM-015, RN-NOT-001, RN-NOT-002, RN-NOT-004, RN-NOT-008 |

**Flujo principal**

1. El huésped pide una limpieza (con comentario opcional) o elige artículos y cantidades en la app.
2. El sistema crea la solicitud `PENDIENTE`; aparece al instante en la lista de Limpieza, con aviso visual (evento 3).
3. Un empleado la toma: pasa a `EN_PROCESO` a su nombre.
4. El empleado la atiende y la marca `ATENDIDA`.
5. El huésped recibe una notificación push y ve el nuevo estado al abrir o recargar su lista de solicitudes.

**Flujos alternativos**

- **A1 (paso 1) — Ya hay una limpieza `PENDIENTE` o `EN_PROCESO` para la habitación:** no se crea otra; se muestra el mensaje.
- **A2 (paso 1) — Cantidad mayor al máximo del artículo:** no se acepta.
- **A3 (antes del paso 3) — El huésped la cancela:** solo mientras esté `PENDIENTE`.
- **A4 (paso 3) — Otro empleado ya la tomó o el huésped la canceló:** el sistema lo indica y actualiza la lista.
- **A5 — Check-out:** las solicitudes `PENDIENTE` o `EN_PROCESO` se cancelan solas; ya no se pueden marcar `ATENDIDA`.

**Postcondiciones:** solicitud `ATENDIDA` o `CANCELADA`. La condición de la habitación no cambia y no se descuenta inventario.

---

## 8. Operación de habitaciones

### UC-07 — Limpiar una habitación

| Campo | Contenido |
|---|---|
| Actores | MYL con área Limpieza o Ambas (principal) · Recepcionista (ve el resultado) · Sistema |
| Historias | HU-MYL-01, HU-MYL-02, HU-MYL-03, HU-REC-11, HU-REC-10 |
| Nivel | 1 |
| Precondiciones | La habitación está `SUCIA` (por check-out, por una incidencia resuelta o marcada por Recepción). |
| Estados (07) | C2 (si la marca Recepción) · C3, C4, C5 |
| Reglas (10) | RN-HAB-004, RN-HAB-005, RN-HAB-006, RN-HAB-013, RN-HAB-014, RN-LIM-001, RN-LIM-002, RN-LIM-004, RN-LIM-010, RN-LIM-011, RN-NOT-009 |

**Flujo principal**

1. El empleado ve la lista de pendientes: primero las de "Llegada hoy" y luego por el tiempo que llevan `SUCIA`.
2. Elige una habitación e inicia la limpieza: pasa a `EN_LIMPIEZA` a su nombre.
3. Limpia la habitación.
4. Marca la limpieza como terminada: pasa a `LIMPIA` y sale de la lista.
5. Recepción ve el cambio en tiempo real (evento 4) y, si hay una llegada hoy, ya puede hacer el check-in (UC-03).

**Flujos alternativos**

- **A1 (paso 2) — Otro empleado ya la inició:** se rechaza y se muestra quién la está limpiando.
- **A2 (paso 3) — Debe interrumpir:** la habitación vuelve a `SUCIA`, libre para cualquier compañero.
- **A3 (paso 3) — Encuentra un daño:** lo reporta (**UC-08**).
- **A4 — Recepción pide repetir la limpieza:** marca como `SUCIA` una habitación `LIBRE` + `LIMPIA` (HU-REC-11) y empieza este caso.

**Postcondiciones:** habitación `LIMPIA` y disponible para el check-in.

---

### UC-08 — Gestionar incidencia de mantenimiento

| Campo | Contenido |
|---|---|
| Actores | Recepcionista o MYL de cualquier área (reporta) · MYL con área Mantenimiento o Ambas (toma y resuelve) · Administrador (consulta) · Sistema |
| Historias | HU-REC-17, HU-MYL-06, HU-MYL-07, HU-MYL-08, HU-ADM-10, HU-REC-10 |
| Nivel | 1 |
| Precondiciones | La habitación existe. |
| Estados (07) | I1, I2, I3 · C6, C8 (y C7 en el check-out) |
| Reglas (10) | RN-HAB-001, RN-HAB-002, RN-HAB-003, RN-HAB-006, RN-HAB-014, RN-MAN-001, RN-MAN-002, RN-MAN-005, RN-MAN-006, RN-MAN-007, RN-MAN-009, RN-MAN-010, RN-MAN-012, RN-MAN-013, RN-NOT-009 |

**Flujo principal**

1. Un empleado reporta el daño: habitación, descripción, si impide el uso y una foto opcional. Se crea la incidencia `REPORTADA`.
2. Si impide el uso y la habitación está `LIBRE`, pasa a `FUERA_DE_SERVICIO` y deja de contar en la disponibilidad.
3. Un técnico ve la lista de incidencias activas (se actualiza al abrirla o con "Actualizar") y **toma** una: pasa a `EN_PROCESO` a su nombre.
4. El técnico repara y la marca `RESUELTA`, describiendo la solución.
5. Si la habitación estaba `FUERA_DE_SERVICIO` y no tiene otra incidencia que impida su uso, pasa a `SUCIA` (continúa en **UC-07**).
6. El Administrador ve la incidencia resuelta y su solución (solo lectura).

**Flujos alternativos**

- **A1 (paso 2) — La habitación está `OCUPADA`:** no cambia su condición; muestra "Incidencia pendiente" y se repara con el huésped alojado. Si sigue sin resolver en el check-out, pasa a `FUERA_DE_SERVICIO` (UC-04, A2). Al resolverse antes, se quita el indicador.
- **A2 (paso 2) — La habitación tenía reservas futuras asignadas:** no hay aviso automático; Recepción las ve en el calendario y les cambia la habitación (HU-REC-07).
- **A3 (paso 3) — Otro técnico ya la tomó:** se rechaza y se muestra quién la tiene.
- **A4 (paso 5) — Hay otra incidencia sin resolver que impide el uso:** la habitación sigue `FUERA_DE_SERVICIO`.
- **A5 (paso 1) — El daño no impide el uso:** la condición de la habitación no cambia.

**Postcondiciones:** incidencia `RESUELTA`; la habitación vuelve al flujo de limpieza. No hay asignación, reasignación, cierre ni cancelación.

---

## 9. Procesos automáticos

### UC-15 — Cancelar reservas web sin pago

| Campo | Contenido |
|---|---|
| Actores | Sistema (principal) · Stripe |
| Historias | HU-HUE-06 |
| Nivel | 1 |
| Precondiciones | Proceso programado del backend. |
| Estados (07) | R5 (o R4) · K2 · P3 |
| Reglas (10) | RN-CAN-013, RN-PAG-001, RN-PAG-002, RN-PAG-003, RN-PAG-004, RN-PAG-005, RN-PAG-006, RN-PAG-014, RN-RES-004, RN-RES-012 |

**Flujo principal**

1. El sistema busca las reservas `PENDIENTE_PAGO` creadas hace más de 30 minutos.
2. Para cada una, consulta su sesión en Stripe.
3. Si no está pagada: la reserva pasa a `CANCELADA`, la cuenta a `CERRADA`, el pago a `FALLIDO` y se liberan el cupo y la habitación asignada.

**Flujos alternativos**

- **A1 (paso 2) — La sesión ya estaba pagada:** la reserva se confirma en lugar de cancelarse (R4) y se envía el correo de confirmación.

**Postcondiciones:** no quedan reservas apartadas sin pago.

---

## 10. Channel Manager

### UC-16 — Recibir reserva de un canal externo

| Campo | Contenido |
|---|---|
| Actores | Canal externo (principal) · Administrador (canal simulado) · Recepcionista (ve la reserva) |
| Historias | HU-CM-01, HU-CM-02, HU-CM-03 |
| Nivel | 1 |
| Precondiciones | El canal y su clave existen en los datos iniciales. |
| Estados (07) | R3 · K1 · G1 · P5 |
| Reglas (10) | RN-CAN-012, RN-CM-001, RN-CM-003, RN-CM-004, RN-CM-007, RN-CM-009, RN-NOT-005, RN-PAG-008, RN-PAG-009, RN-PAG-014, RN-RES-001, RN-RES-005, RN-RES-006, RN-RES-007, RN-RES-009, RN-RES-010, RN-RES-011, RN-RES-019, RN-SEG-006, RN-TAR-008, RN-TAR-009, RN-TAR-010 |

**Flujo principal**

1. El canal envía a la API: canal y clave, identificador externo, tipo de habitación, fechas, huéspedes, los 6 datos del huésped principal y el monto en quetzales.
2. El sistema compara la clave con su hash.
3. Valida los datos (1 a 30 noches, sin fechas pasadas, a no más de 365 días, capacidad, tipo activo).
4. Verifica que no exista ya una reserva con ese identificador externo en ese canal.
5. Valida la disponibilidad con las mismas reglas que la web.
6. Busca al huésped por su correo (o lo crea) y crea la reserva `CONFIRMADA` con su código, el canal y el identificador externo; la cuenta con un cargo por alojamiento igual al monto del canal y un pago `APROBADO` con método `CANAL`.
7. Responde `201` con el código y envía el correo de confirmación al huésped.
8. Recepción ve la reserva en la búsqueda y en el calendario, con su canal y su identificador externo.

**Flujos alternativos**

- **A1 (paso 2) — Canal inexistente o clave incorrecta:** `401`; no se crea nada.
- **A2 (paso 3) — Datos faltantes o inválidos:** `400` con el problema.
- **A3 (paso 4) — Reserva repetida:** `200` con la reserva existente; no se duplica.
- **A4 (paso 5) — Sin disponibilidad:** `409` con un mensaje claro.
- **A5 — Canal simulado:** el Administrador elige el canal, llena los datos o los genera al azar y envía la reserva **por la API real**. Ve el código HTTP, el resultado, el motivo y, si se creó, el código de reserva. Puede reenviar la misma para demostrar que no se duplica.

**Postcondiciones:** la reserva externa existe una sola vez, con su canal, o fue rechazada con un motivo. El canal **no** puede cancelarla, y en el sistema tampoco se cancela.

---

## 11. Administración y acceso del personal

### UC-17 — Configurar tarifas dinámicas

| Campo | Contenido |
|---|---|
| Actores | Administrador |
| Historias | HU-ADM-03, HU-ADM-06, HU-ADM-07 |
| Nivel | 1 |
| Precondiciones | Existen tipos de habitación con precio base. |
| Estados (07) | Ninguno |
| Reglas (10) | RN-HAB-009, RN-HAB-010, RN-TAR-002, RN-TAR-003, RN-TAR-004, RN-TAR-007, RN-TAR-011, RN-TAR-012 |

**Flujo principal**

1. El Administrador crea una temporada: nombre, fechas, porcentaje de ajuste (positivo o negativo) y si aplica a todos los tipos o a algunos.
2. El sistema valida que la fecha de fin no sea anterior a la de inicio, que el ajuste sea mayor a −100 % y que no se traslape con otra temporada del mismo tipo.
3. El Administrador define el ajuste de fin de semana de cada tipo (por defecto 0 %), que aplica a las noches de viernes y sábado.
4. Los cambios aplican a las búsquedas y reservas **nuevas**.

**Flujos alternativos**

- **A1 (paso 2) — Temporada traslapada:** se muestra la temporada en conflicto y no se guarda.
- **A2 (pasos 2 y 3) — Ajuste de −100 % o menos:** no se guarda.
- **A3 — Editar o eliminar una temporada, o cambiar el precio base:** solo afecta reservas nuevas.

**Postcondiciones:** tarifas vigentes configuradas; las reservas existentes conservan su precio. No hay vista previa de tarifas.

---

### UC-19 — Gestionar personal (y turnos, Nivel 2)

| Campo | Contenido |
|---|---|
| Actores | Administrador |
| Historias | HU-ADM-01, HU-ADM-02, HU-ADM-12 (Nivel 2) |
| Nivel | 1 (turnos: Nivel 2) |
| Precondiciones | El Administrador tiene sesión. |
| Estados (07) | Empleado `ACTIVO` / `INACTIVO` (sección 9) |
| Reglas (10) | RN-PER-001, RN-PER-002, RN-PER-005, RN-PER-007, RN-PER-008, RN-PER-009, RN-PER-010, RN-PER-014, RN-SEG-005, RN-TUR-001, RN-TUR-002, RN-TUR-003, RN-TUR-005 |

**Flujo principal**

1. El Administrador crea un empleado: nombre, correo, teléfono, rol y, si es Mantenimiento/Limpieza, su área.
2. El sistema genera una contraseña temporal y la muestra **una sola vez** (con opción de copiar). No se envía correo.
3. El Administrador la entrega en persona; en su primer acceso, el empleado debe cambiarla (**UC-21**).

**Flujos alternativos**

- **A1 (paso 1) — Correo de otro empleado:** error; no se crea.
- **A2 (paso 1) — Rol Mantenimiento/Limpieza sin área:** no se permite.
- **A3 — Editar:** nombre, teléfono, rol y área, con la misma regla de área.
- **A4 — Desactivar o reactivar:** el empleado `INACTIVO` no puede iniciar sesión ni renovar su sesión; una sesión abierta le dura hasta que vence su token (máximo 15 minutos). El Administrador no puede desactivarse ni cambiarse el rol a sí mismo. No se revisa el trabajo en curso.
- **A5 — Restablecer contraseña:** se genera otra contraseña temporal (mostrada una vez); la anterior deja de funcionar.
- **A6 (Nivel 2) — Turnos:** define turnos (pueden cruzar la medianoche) y los asigna por fecha a empleados `ACTIVO` que no sean Administradores, sin traslapes. Hay una vista semanal. Son solo informativos.

**Postcondiciones:** el personal tiene cuentas con el rol correcto; siempre queda un Administrador activo.

---

### UC-21 — Acceso del personal

| Campo | Contenido |
|---|---|
| Actores | Cualquier empleado |
| Historias | HU-EMP-01, HU-EMP-02 |
| Nivel | 1 |
| Precondiciones | El empleado tiene una cuenta `ACTIVO`. |
| Estados (07) | Ninguno |
| Reglas (10) | RN-PER-011, RN-PER-012, RN-PER-013, RN-PER-014, RN-PER-015, RN-SEG-005 |

**Flujo principal**

1. El empleado ingresa su correo y su contraseña en la web privada.
2. El sistema los valida y entra directo a la sección de su rol.
3. El empleado trabaja solo en las pantallas de su rol (documento 09).
4. Cierra sesión desde cualquier pantalla.

**Flujos alternativos**

- **A1 (paso 2) — Correo o contraseña incorrectos:** mensaje genérico ("Correo o contraseña incorrectos").
- **A2 (paso 2) — 5 intentos fallidos seguidos:** la cuenta se bloquea 15 minutos, aunque luego escriba la contraseña correcta.
- **A3 (paso 2) — Contraseña temporal:** debe cambiarla antes de usar cualquier otra sección: contraseña actual, nueva (8 o más caracteres, con letra y número, distinta de la actual) y confirmación.
- **A4 (paso 2) — Empleado `INACTIVO`:** no puede entrar.
- **A5 (paso 3) — Intenta entrar a una sección de otro rol:** acceso denegado. Sin sesión, cualquier página privada lleva al inicio de sesión.
- **A6 — Cambiar su contraseña cuando quiera:** con las mismas reglas de A3.

**Postcondiciones:** el empleado tiene sesión con los permisos de su rol, o no entra.

---

### UC-18 — Gestionar inventario aislado (Nivel 2)

| Campo | Contenido |
|---|---|
| Actores | Administrador |
| Historias | HU-ADM-13 |
| Nivel | 2 |
| Precondiciones | Todo el Nivel 1 está terminado. |
| Estados (07) | Producto `ACTIVO` / `INACTIVO` |
| Reglas (10) | RN-INV-001, RN-INV-002, RN-INV-003, RN-INV-005, RN-INV-010, RN-INV-011 |

**Flujo principal**

1. El Administrador registra un producto: nombre único, categoría, unidad de medida y stock mínimo. El stock empieza en 0.
2. Registra una **entrada** (cantidad y motivo): el stock sube.
3. Registra una **salida** (cantidad y motivo): el stock baja.
4. En la lista ve el stock actual, el mínimo y la marca "Stock bajo" cuando el stock es igual o menor al mínimo.

**Flujos alternativos**

- **A1 (paso 3) — La salida supera el stock:** se rechaza; el stock nunca queda negativo.
- **A2 — Historial:** ve los movimientos de cada producto con fecha, tipo, cantidad, motivo y responsable.
- **A3 — Desactivar un producto.**

**Postcondiciones:** el stock refleja los movimientos manuales. **No** se conecta con Room Service, limpieza, solicitudes ni mantenimiento.

---

## 12. Historias que no necesitan un caso de uso

Son consultas o mantenimientos de catálogo de un solo paso; las historias ya las describen completas.

| Historia | Tema |
|---|---|
| HU-HUE-01, HU-HUE-02 | Información del hotel y catálogo de habitaciones |
| HU-ADM-03, HU-ADM-04, HU-ADM-05 | Tipos de habitación, habitaciones y menú (HU-ADM-03 participa en UC-17 por el precio base) |
| HU-ADM-08 | Datos del hotel y fiscales |
| HU-ADM-09 | Indicadores básicos |
| HU-ADM-11, HU-HUE-18 | Amenidades y Wi-Fi (Nivel 2) |

Todas las demás historias están en algún caso de uso.
