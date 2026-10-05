# Historias de Usuario — Room Service (Iniciales)

## Épica 1: Gestión de pedidos

### HU-01: Ver pedidos pendientes
**Como** encargado de Room Service, **quiero** ver la lista de pedidos pendientes de mi turno, **para** saber cuáles debo atender primero.

**Criterios de aceptación:**
- El sistema muestra número de habitación, hora del pedido y estado.
- Los pedidos se ordenan por antigüedad (más urgente primero).
- Se distingue visualmente entre "nuevo", "en preparación" y "en camino".

---

### HU-02: Ver detalle de un pedido
**Como** encargado de Room Service, **quiero** ver el detalle completo de un pedido, **para** prepararlo correctamente.

**Criterios de aceptación:**
- Se muestran ítems, cantidades, notas especiales (alergias, sin cebolla, etc.) y nombre del huésped.
- Se muestra el número de habitación y piso.

---

### HU-03: Registrar pedido telefónico
**Como** encargado de Room Service, **quiero** registrar manualmente un pedido que un huésped hizo por teléfono, **para** que quede en el sistema igual que uno hecho desde la app.

**Criterios de aceptación:**
- Puedo seleccionar habitación, ítems del menú y cantidad.
- Puedo agregar notas u observaciones.
- El pedido queda con estado "nuevo" tras guardarse.

---

### HU-04: Actualizar estado del pedido
**Como** encargado de Room Service, **quiero** cambiar el estado de un pedido (nuevo → en preparación → en camino → entregado), **para** que otros roles y el huésped sepan el progreso.

**Criterios de aceptación:**
- Los cambios de estado solo pueden ir en el orden definido (no saltar de "nuevo" a "entregado" sin pasar por los intermedios), salvo cancelación.
- Cada cambio de estado registra fecha/hora.

---

### HU-05: Cancelar un pedido
**Como** encargado de Room Service, **quiero** cancelar un pedido con un motivo, **para** llevar control de incidencias (ítem agotado, error de registro, etc.).

**Criterios de aceptación:**
- Se solicita un motivo obligatorio al cancelar.
- El pedido cancelado no puede reactivarse, solo consultarse en el historial.

---

## Épica 2: Menú y catálogo

### HU-06: Consultar el menú disponible
**Como** encargado de Room Service, **quiero** consultar el catálogo de ítems disponibles con precios, **para** tomar pedidos sin errores.

**Criterios de aceptación:**
- El menú muestra nombre, descripción, precio y disponibilidad (disponible/agotado).
- Los ítems marcados como agotados no pueden agregarse a un nuevo pedido.

---

### HU-07: Marcar ítem como agotado temporalmente
**Como** encargado de Room Service, **quiero** marcar un ítem del menú como no disponible, **para** evitar que se sigan generando pedidos con ese producto.

**Criterios de aceptación:**
- Un ítem marcado como agotado no aparece como seleccionable al crear pedidos.
- Un administrador puede reactivarlo.

---

## Épica 3: Facturación y cargos

### HU-08: Cargar el pedido a la cuenta de la habitación
**Como** encargado de Room Service, **quiero** que el importe del pedido se agregue automáticamente al folio/cuenta del huésped, **para** que recepción pueda cobrarlo al hacer el check-out.

**Criterios de aceptación:**
- El monto se calcula según ítems y cantidades del pedido.
- El cargo queda asociado al número de habitación y visible para recepción.

---

## Épica 4: Historial y reportes

### HU-09: Consultar historial de pedidos entregados
**Como** encargado de Room Service, **quiero** consultar los pedidos ya entregados de mi turno, **para** verificar que todo se completó correctamente.

**Criterios de aceptación:**
- Se puede filtrar por fecha, habitación o estado.
- Se muestra el tiempo total desde que se creó el pedido hasta la entrega.

---

## Épica 5: Notificaciones

### HU-10: Recibir notificación de nuevo pedido
**Como** encargado de Room Service, **quiero** recibir una notificación cuando llega un pedido nuevo, **para** atenderlo sin tener que estar revisando la pantalla constantemente.

**Criterios de aceptación:**
- La notificación incluye número de habitación y hora.
- Se puede acceder al detalle del pedido tocando/haciendo clic en la notificación.
