# HU — Room Service

> **Rol:** Room Service (`ROOM_SERVICE`)
> **Plataforma:** Web privada
> **Prefijo:** `HU-RS`
> **Total de historias:** 7 (Nivel 1: 7 · Nivel 2: 0)
> **Referencias:** 01 — Alcance (sección F)

---

## Épica 1: Gestión de pedidos

### HU-RS-01 — Ver la cola de pedidos activos

| Plataforma | Épica | Alcance | Nivel | Tamaño | Estado |
|---|---|---|---|---|---|
| Web privada | Gestión de pedidos | ALC-RS-01 | 1 | M | Pendiente |

**Historia**
- **Como** personal de Room Service
- **Quiero** ver la cola de pedidos activos
- **Para** saber cuáles debo atender primero

**Criterios de aceptación**
1. Se muestran solo los pedidos en estado `Nuevo`, `En preparación` y `En camino`.
2. Los pedidos se ordenan por antigüedad (el más antiguo primero).
3. Cada pedido muestra número de habitación, piso, hora del pedido, tiempo transcurrido y estado; cada estado se distingue por color o etiqueta.
4. La cola se actualiza sin recargar cuando llega un pedido nuevo o cambia el estado de un pedido.
5. Los pedidos `Entregado` y `Cancelado` salen de la cola.
6. No se muestra ningún dato personal del huésped salvo su nombre.
7. Al reconectarse el tiempo real (la librería se reconecta sola), la pantalla vuelve a cargar la cola completa. No hay indicador "Sin conexión".

**Depende de:** HU-EMP-01, HU-HUE-10
**Reglas relacionadas:** RN-NOT-006, RN-NOT-007, RN-RS-012, RN-SEG-002 (documento 10)

---

### HU-RS-02 — Ver el detalle de un pedido

| Plataforma | Épica | Alcance | Nivel | Tamaño | Estado |
|---|---|---|---|---|---|
| Web privada | Gestión de pedidos | ALC-RS-02 | 1 | S | Pendiente |

**Historia**
- **Como** personal de Room Service
- **Quiero** ver el detalle completo de un pedido
- **Para** prepararlo y entregarlo correctamente

**Criterios de aceptación**
1. Se muestran los ítems, sus cantidades, el precio de cada ítem (el precio congelado al momento de pedir) y el total.
2. Las notas del huésped (alergias, preferencias) se muestran de forma destacada.
3. Se muestran el nombre del huésped, el número de habitación y el piso; no se muestran correo, teléfono ni documento.
4. Se muestra el historial de estados del pedido con fecha, hora y responsable de cada cambio.
5. Si el pedido no existe, se muestra un mensaje claro y se vuelve a la cola.

**Depende de:** HU-RS-01
**Reglas relacionadas:** RN-RS-006, RN-SEG-002 (documento 10)

---

### HU-RS-03 — Avanzar el estado de un pedido

| Plataforma | Épica | Alcance | Nivel | Tamaño | Estado |
|---|---|---|---|---|---|
| Web privada | Gestión de pedidos | ALC-RS-04 | 1 | S | Pendiente |

**Historia**
- **Como** personal de Room Service
- **Quiero** avanzar el estado de un pedido
- **Para** que el huésped y el resto del personal conozcan su progreso

**Criterios de aceptación**
1. El estado solo avanza en orden: `Nuevo` → `En preparación` → `En camino` → `Entregado`, con un botón para el siguiente paso.
2. No se permite saltar estados ni retroceder; si se intenta (por ejemplo, desde otra pestaña), el sistema lo rechaza con un mensaje claro.
3. Si otro empleado ya cambió el estado del pedido, se muestra un aviso y se recarga el pedido con su estado actual.
4. Cada cambio registra fecha, hora y empleado responsable.
5. El huésped ve el nuevo estado en la app sin recargar (HU-HUE-11).
6. Al pasar a `Entregado` se genera el cargo (HU-RS-06) y el huésped recibe una notificación push de pedido entregado (HU-HUE-17).
7. Un pedido `Entregado` ya no se puede modificar.

**Depende de:** HU-RS-02
**Reglas relacionadas:** RN-NOT-001, RN-NOT-007, RN-RS-001, RN-RS-002, RN-RS-007 (documento 10)
**Notas técnicas:** mientras un pedido esté `En camino`, el check-out de esa reserva no se permite (HU-REC-14).

---

### HU-RS-04 — Cancelar un pedido

| Plataforma | Épica | Alcance | Nivel | Tamaño | Estado |
|---|---|---|---|---|---|
| Web privada | Gestión de pedidos | ALC-RS-05 | 1 | S | Pendiente |

**Historia**
- **Como** personal de Room Service
- **Quiero** cancelar un pedido indicando el motivo
- **Para** informar al huésped cuando un pedido no se puede entregar

**Criterios de aceptación**
1. Solo se pueden cancelar pedidos que aún no estén `Entregado` (`Nuevo`, `En preparación` o `En camino`).
2. El motivo es obligatorio; sin motivo, no se permite cancelar.
3. El pedido pasa a `Cancelado`, se registran fecha, hora, empleado y motivo, y no puede reactivarse.
4. Un pedido cancelado no genera ningún cargo en la cuenta del huésped.
5. El huésped ve en la app que su pedido fue cancelado y el motivo; el huésped no puede cancelar pedidos.
6. Si se intenta cancelar un pedido `Entregado`, el sistema lo rechaza con un mensaje claro.

**Depende de:** HU-RS-02
**Reglas relacionadas:** RN-RS-003, RN-RS-004, RN-RS-010 (documento 10)
**Notas técnicas:** los pedidos `Nuevo` o `En preparación` que siguen abiertos al hacer el check-out se cancelan solos, sin cargo (HU-REC-14).

---

## Épica 2: Menú

### HU-RS-05 — Consultar el menú y marcar ítems agotados

| Plataforma | Épica | Alcance | Nivel | Tamaño | Estado |
|---|---|---|---|---|---|
| Web privada | Menú | ALC-RS-06 | 1 | S | Pendiente |

**Historia**
- **Como** personal de Room Service
- **Quiero** consultar el menú y marcar como agotado un ítem que ya no tengo
- **Para** que los huéspedes no pidan productos que no se pueden preparar

**Criterios de aceptación**
1. El menú se muestra por categorías con nombre, descripción, precio y estado (`Disponible` / `Agotado`).
2. Room Service puede marcar un ítem `Disponible` como `Agotado`; el cambio registra fecha, hora y empleado.
3. Un ítem `Agotado` aparece como no disponible en la app la próxima vez que el huésped abre el menú y no se puede pedir.
4. Si un huésped intenta pedir un ítem que se agotó mientras tenía el menú abierto, el servidor rechaza el pedido con un mensaje claro.
5. Room Service no puede volver a marcar un ítem como `Disponible`; solo el Administrador lo reactiva (HU-ADM-05).
6. Los pedidos ya creados con ese ítem no se modifican.

**Depende de:** HU-ADM-05
**Reglas relacionadas:** RN-RS-005, RN-RS-008 (documento 10)

---

## Épica 3: Cargo a la cuenta

### HU-RS-06 — Generar el cargo del pedido entregado

| Plataforma | Épica | Alcance | Nivel | Tamaño | Estado |
|---|---|---|---|---|---|
| Web privada | Cargo a la cuenta | ALC-RS-08 | 1 | S | Pendiente |

**Historia**
- **Como** personal de Room Service
- **Quiero** que el importe del pedido se cargue solo a la cuenta del huésped al entregarlo
- **Para** que se cobre en el check-out sin registrarlo a mano

**Criterios de aceptación**
1. El cargo se genera automáticamente cuando el pedido pasa a `Entregado`.
2. El monto es la suma de precio × cantidad de cada ítem, con el precio congelado al momento de pedir.
3. El cargo se agrega a la cuenta `Abierta` de la reserva `En estadía`, con el concepto "Room Service — Pedido #n".
4. Un pedido genera **un solo** cargo, aunque el cambio a `Entregado` se reciba dos veces.
5. El cargo queda registrado al instante; Recepción y el huésped lo ven al abrir o recargar la cuenta (no es un evento en tiempo real).
6. Room Service no puede editar ni anular el cargo; solo Recepción puede anularlo, con motivo.

**Depende de:** HU-RS-03
**Reglas relacionadas:** RN-PAG-010, RN-RS-007 (documento 10)
**Notas técnicas:** una restricción única (pedido → cargo) en la base de datos evita el cargo doble.

---

## Épica 4: Avisos

### HU-RS-07 — Recibir aviso de pedido nuevo

| Plataforma | Épica | Alcance | Nivel | Tamaño | Estado |
|---|---|---|---|---|---|
| Web privada | Avisos | ALC-RS-10, ALC-TRA-04 | 1 | S | Pendiente |

**Historia**
- **Como** personal de Room Service
- **Quiero** recibir un aviso cuando llega un pedido nuevo
- **Para** atenderlo sin estar revisando la pantalla constantemente

**Criterios de aceptación**
1. Cuando un huésped hace un pedido, aparece un aviso visual en pantalla, sin recargar la página.
2. El aviso muestra el número de habitación, el piso y la hora del pedido.
3. Al hacer clic en el aviso se abre el detalle del pedido (HU-RS-02).
4. El pedido nuevo aparece en la cola en su lugar según su antigüedad.

**Depende de:** HU-RS-01
**Reglas relacionadas:** RN-NOT-006 (documento 10)
**Notas técnicas:** el aviso es solo visual. El sonido queda como Nivel 2 (si da tiempo).
