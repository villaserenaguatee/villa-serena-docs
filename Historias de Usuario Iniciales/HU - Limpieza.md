# Historias de Usuario — Limpieza (Iniciales)

### HU-01: Ver habitaciones pendientes de limpieza
**Como** personal de Mantenimiento (Limpieza), **quiero** visualizar las habitaciones que tienen una limpieza pendiente, **para** organizar las habitaciones que debo atender.

**Criterios de aceptación:**
- Se muestra el número de habitación.
- Se muestra el estado actual de limpieza.
- Solo se muestran como pendientes las habitaciones que necesitan limpieza.
- Se permite seleccionar una habitación para comenzar la limpieza.

---

### HU-02: Cambiar estado de limpieza de la habitación
**Como** personal de Mantenimiento (Limpieza), **quiero** actualizar el estado de limpieza de una habitación, **para** informar el progreso del servicio.

**Criterios de aceptación:**
- Se puede cambiar el estado entre Pendiente, En limpieza y Limpia.
- El nuevo estado queda registrado en el sistema.
- Una habitación marcada como limpia deja de aparecer entre las habitaciones pendientes.

---

### HU-03: Registrar limpieza terminada
**Como** personal de Mantenimiento (Limpieza), **quiero** registrar cuando termine de limpiar una habitación, **para** indicar que la habitación está lista.

**Criterios de aceptación:**
- Se permite marcar la limpieza como finalizada.
- Se registra la fecha y hora de finalización.
- La habitación cambia su estado a Limpia.
- La habitación deja de aparecer en la lista de limpiezas pendientes.

---

### HU-04: Ver solicitudes de limpieza de los huéspedes
**Como** personal de Mantenimiento (Limpieza), **quiero** visualizar las solicitudes de limpieza realizadas por los huéspedes, **para** atender las habitaciones que soliciten el servicio.

**Criterios de aceptación:**
- Se muestra el número de habitación.
- Se muestra la fecha y hora de la solicitud.
- Se muestra el estado de la solicitud.
- Se permite seleccionar una solicitud para atenderla.

---

### HU-05: Atender solicitudes de artículos para la habitación
**Como** personal de Mantenimiento (Limpieza), **quiero** recibir las solicitudes de artículos realizadas por los huéspedes, **para** entregar lo solicitado en la habitación correspondiente.

**Criterios de aceptación:**
- Se muestra el número de habitación.
- Se muestra el artículo solicitado.
- Se muestra la cantidad solicitada.
- Se pueden solicitar artículos como toallas, papel higiénico, jabón, almohadas o cobijas.
- Se permite indicar que la solicitud está siendo atendida.

---

### HU-06: Actualizar estado de las solicitudes
**Como** personal de Mantenimiento (Limpieza), **quiero** actualizar el estado de las solicitudes de los huéspedes, **para** llevar un control de cuáles están pendientes y cuáles ya fueron atendidas.

**Criterios de aceptación:**
- La solicitud puede tener estado Pendiente, En proceso o Atendida.
- El cambio de estado queda registrado.
- Las solicitudes atendidas no aparecen en la lista de pendientes.
- Las solicitudes atendidas pueden consultarse posteriormente.

---

### HU-07: Reportar daños o desperfectos en habitaciones
**Como** personal de Mantenimiento (Limpieza), **quiero** reportar los daños que encuentre en una habitación, **para** informar que necesitan reparación.

**Criterios de aceptación:**
- Se debe seleccionar la habitación donde se encontró el daño.
- Se debe ingresar una descripción del problema.
- Se pueden reportar problemas como luces dañadas, duchas, puertas, muebles o aire acondicionado.
- El reporte queda registrado para su seguimiento.

---

### HU-08: Reportar objetos olvidados
**Como** personal de Mantenimiento (Limpieza), **quiero** registrar los objetos olvidados encontrados en las habitaciones, **para** llevar un control y facilitar su devolución al huésped.

**Criterios de aceptación:**
- Se registra el número de habitación.
- Se debe ingresar una descripción del objeto encontrado.
- Se registra la fecha y hora en que fue encontrado.
- El objeto queda registrado como pendiente de devolución.

---

### HU-09: Registrar productos de limpieza utilizados
**Como** personal de Mantenimiento (Limpieza), **quiero** registrar los productos utilizados durante la limpieza, **para** llevar un control de los insumos consumidos.

**Criterios de aceptación:**
- Se permite seleccionar el producto utilizado.
- Se registra la cantidad utilizada.
- Se pueden registrar productos como jabón, desinfectante y bolsas de basura.
- El registro queda asociado al servicio de limpieza realizado.

---

### HU-10: Reportar falta de productos e insumos
**Como** personal de Mantenimiento (Limpieza), **quiero** reportar los productos e insumos que estén por agotarse, **para** solicitar su reposición.

**Criterios de aceptación:**
- Se permite seleccionar el producto faltante.
- Se puede indicar la cantidad necesaria.
- El reporte queda registrado como pendiente de reposición.
- Se puede consultar posteriormente el estado del reporte.

---

### HU-11: Ver habitaciones con atención prioritaria
**Como** personal de Mantenimiento (Limpieza), **quiero** identificar las habitaciones que requieren atención prioritaria, **para** atender primero las que necesitan estar disponibles rápidamente.

**Criterios de aceptación:**
- Las habitaciones prioritarias aparecen identificadas.
- Se muestra el número de habitación.
- Se indica el motivo de la prioridad.
- Las habitaciones prioritarias aparecen antes que las solicitudes normales.

---

### HU-12: Consultar información de la habitación
**Como** personal de Mantenimiento (Limpieza), **quiero** consultar la información de una habitación, **para** conocer su estado y los servicios que necesita.

**Criterios de aceptación:**
- Se muestra el número de habitación.
- Se muestra el estado de limpieza.
- Se muestran las solicitudes pendientes.
- Se muestran los artículos solicitados por el huésped.

---

### HU-13: Registrar observaciones de la habitación
**Como** personal de Mantenimiento (Limpieza), **quiero** registrar observaciones encontradas durante la limpieza, **para** informar cualquier situación importante de la habitación.

**Criterios de aceptación:**
- Se permite escribir una observación.
- La observación queda asociada a la habitación.
- Se registra la fecha de la observación.
- Las observaciones pueden consultarse posteriormente.

---

### HU-14: Consultar historial de servicios realizados
**Como** personal de Mantenimiento (Limpieza), **quiero** consultar los servicios que ya fueron realizados, **para** llevar un control de las tareas atendidas.

**Criterios de aceptación:**
- Se muestran las habitaciones atendidas.
- Se muestra el tipo de servicio realizado.
- Se muestra la fecha y hora del servicio.
- Se muestra el estado final del servicio.

---

### HU-15: Confirmar entrega de artículos solicitados
**Como** personal de Mantenimiento (Limpieza), **quiero** confirmar la entrega de los artículos solicitados por los huéspedes, **para** registrar que la solicitud fue completada.

**Criterios de aceptación:**
- Se muestra la habitación que realizó la solicitud.
- Se muestran los artículos y cantidades solicitadas.
- Se permite marcar la solicitud como Entregada.
- Una solicitud entregada deja de aparecer entre las solicitudes pendientes.
- La entrega queda registrada en el historial.
