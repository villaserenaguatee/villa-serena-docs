# Módulo de Mantenimiento — Especificación Completa (Inicial)

**Sistema de Gestión Hotelera — Villa Serena**

---

## 1. Propósito del módulo

El Módulo de Mantenimiento gestiona la atención de averías, daños y trabajos técnicos del hotel. Su función es recibir las incidencias reportadas por las demás áreas, convertirlas en órdenes de trabajo, asignarlas a un técnico, dar seguimiento hasta su cierre y controlar el estado de las habitaciones que quedan inhabilitadas por una avería.

Adicionalmente administra el mantenimiento preventivo programado, el registro de los activos y equipos del hotel, y el consumo de repuestos.

---

## 2. Actores

| Actor | Descripción |
|---|---|
| **Encargado de Mantenimiento** | Actor principal. Recibe incidencias, prioriza, crea y asigna órdenes de trabajo, aprueba cierres, programa el mantenimiento preventivo y consulta indicadores. |
| **Técnico de Mantenimiento** | Ejecuta las órdenes asignadas, registra el avance, el tiempo empleado y los repuestos utilizados. |
| **Personal de Limpieza** (actor externo) | Origina incidencias desde su módulo al detectar averías durante la limpieza. |
| **Recepcionista** (actor externo) | Origina incidencias reportadas por los huéspedes y consulta cuándo una habitación volverá a estar disponible. |
| **Administrador** (actor externo) | Consulta los indicadores del área y el consumo de insumos. |

---

## 3. Historias de usuario

### MANTENIMIENTO — HU-1: Bandeja de incidencias recibidas
**Como** encargado de mantenimiento, **quiero** ver en una sola bandeja todas las incidencias reportadas por Limpieza y Recepción, **para** enterarme de las averías del hotel sin depender de avisos verbales.

**Criterios de aceptación:**
- La bandeja muestra, por cada incidencia: número de habitación o área, tipo de avería, descripción, prioridad, área que la reportó, responsable y fecha/hora del reporte.
- Las incidencias se ordenan por prioridad (alta → media → baja) y, dentro de cada prioridad, de la más reciente a la más antigua.
- Las incidencias marcadas como impide el uso de la habitación se distinguen visualmente del resto.
- Se puede filtrar por prioridad, por estado (pendiente, en proceso, resuelta) y por área que reportó.
- Las incidencias ya convertidas en orden de trabajo dejan de aparecer como pendientes y muestran el número de orden generado.

**Prioridad:** Alta

---

### MANTENIMIENTO — HU-2: Convertir una incidencia en orden de trabajo
**Como** encargado de mantenimiento, **quiero** generar una orden de trabajo a partir de una incidencia recibida, **para** convertir el reporte en una tarea con responsable y seguimiento.

**Criterios de aceptación:**
- Al convertir una incidencia, el sistema genera una orden con código correlativo (formato OT-0001).
- La orden hereda automáticamente la habitación, el tipo de avería, la descripción y la prioridad de la incidencia de origen.
- El encargado puede modificar la prioridad y ampliar la descripción antes de guardar.
- La orden nace en estado Abierta y queda enlazada a la incidencia de origen.
- La incidencia de origen cambia su estado a En proceso.
- Una incidencia no puede convertirse en orden de trabajo dos veces.

**Prioridad:** Alta

---

### MANTENIMIENTO — HU-3: Registrar una avería detectada por el propio personal técnico
**Como** técnico de mantenimiento, **quiero** registrar directamente una avería que yo mismo detecté, **para** que quede documentada aunque ninguna otra área la haya reportado.

**Criterios de aceptación:**
- El formulario permite indicar: ubicación (habitación o área común), tipo de avería, descripción, prioridad y si impide el uso de la habitación.
- Los tipos de avería disponibles son: fuga de agua, avería técnica, daño en mobiliario, problema eléctrico y otro.
- El sistema valida que la ubicación, el tipo y la descripción no queden vacíos, y muestra el mensaje de error junto al campo correspondiente.
- Al guardar, se genera directamente una orden de trabajo en estado Abierta, con origen Detección interna.

**Prioridad:** Media

---

### MANTENIMIENTO — HU-4: Asignar una orden de trabajo a un técnico
**Como** encargado de mantenimiento, **quiero** asignar cada orden de trabajo a un técnico y fijarle una fecha compromiso, **para** distribuir la carga del equipo y poder exigir un plazo.

**Criterios de aceptación:**
- Solo se pueden asignar órdenes en estado Abierta o Asignada.
- La lista de técnicos disponibles muestra únicamente al personal activo con rol de Mantenimiento.
- Junto a cada técnico se muestra su número de órdenes abiertas, para poder comparar la carga de trabajo.
- Al asignar, la orden pasa a estado Asignada y queda registrado quién la asignó y cuándo.
- Una orden puede reasignarse a otro técnico; el sistema conserva el registro de la asignación anterior.

**Prioridad:** Alta

---

### MANTENIMIENTO — HU-5: Consultar mis órdenes asignadas
**Como** técnico de mantenimiento, **quiero** ver únicamente las órdenes que me fueron asignadas, ordenadas por urgencia, **para** saber qué debo atender primero en mi turno.

**Criterios de aceptación:**
- La vista muestra solo las órdenes asignadas al técnico activo y que no estén cerradas ni canceladas.
- Cada orden muestra: código, ubicación, tipo de avería, prioridad, fecha compromiso y estado actual.
- Las órdenes con la fecha compromiso vencida se identifican como Atrasadas.
- El orden de presentación es: atrasadas primero, luego por prioridad y después por antigüedad.

**Prioridad:** Media

---

### MANTENIMIENTO — HU-6: Registrar el avance y cerrar una orden de trabajo
**Como** técnico de mantenimiento, **quiero** registrar el trabajo realizado y cerrar la orden, **para** dejar constancia de la solución aplicada.

**Criterios de aceptación:**
- El estado de la orden avanza según la secuencia: Abierta → Asignada → En proceso → Resuelta → Cerrada.
- No se permite saltar estados ni retroceder, salvo la cancelación, que se puede hacer desde cualquier estado no cerrado.
- Para pasar a Resuelta es obligatorio describir la solución aplicada y el tiempo empleado.
- El cierre definitivo (Cerrada) solo lo puede realizar el encargado de mantenimiento, no el técnico.
- Cada cambio de estado guarda la fecha, la hora y el responsable, y queda visible en el historial de la orden.
- Al cerrar la orden, si existía una incidencia de origen, esta pasa automáticamente a Resuelta.

**Prioridad:** Alta

---

### MANTENIMIENTO — HU-7: Cancelar o reprogramar una orden de trabajo
**Como** encargado de mantenimiento, **quiero** cancelar o reprogramar una orden, **para** manejar los casos en que el trabajo ya no procede o debe esperar un repuesto.

**Criterios de aceptación:**
- La cancelación exige un motivo escrito obligatorio.
- Una orden cancelada no puede volver a modificarse ni reabrirse.
- La reprogramación permite cambiar la fecha compromiso y exige justificar el cambio.
- Ambas acciones quedan registradas en el historial de la orden con fecha, hora y responsable.
- Si la orden mantenía una habitación fuera de servicio, al cancelarla el sistema pregunta si la habitación debe liberarse.

**Prioridad:** Media

---

### MANTENIMIENTO — HU-8: Bloquear y liberar habitaciones por avería
**Como** encargado de mantenimiento, **quiero** marcar una habitación como fuera de servicio y devolverla a disponible al terminar, **para** impedir que Recepción venda una habitación inhabitable.

**Criterios de aceptación:**
- Cuando una incidencia u orden indica que impide el uso, la habitación pasa automáticamente al estado Mantenimiento.
- Una habitación en estado Mantenimiento no aparece como disponible en la búsqueda de disponibilidad de Recepción.
- El sistema no permite poner en mantenimiento una habitación que esté ocupada; primero debe resolverse la situación del huésped.
- La habitación no puede liberarse mientras siga existiendo al menos una orden abierta que la afecte.
- Al liberarla, la habitación no pasa directamente a Disponible, sino a En limpieza, para que el módulo de Limpieza la valide antes de volver a venderse.
- Se muestra el listado de habitaciones fuera de servicio con el tiempo que llevan inhabilitadas.

**Prioridad:** Alta

---

### MANTENIMIENTO — HU-9: Programar mantenimiento preventivo
**Como** encargado de mantenimiento, **quiero** programar tareas de mantenimiento que se repiten periódicamente, **para** anticiparme a las averías en lugar de solo reaccionar a ellas.

**Criterios de aceptación:**
- Se puede definir una tarea preventiva indicando: nombre, equipo o área a la que aplica, frecuencia (semanal, mensual, trimestral, semestral o anual) y fecha de la próxima ejecución.
- El sistema muestra un calendario o listado con las tareas preventivas próximas a vencer.
- Las tareas cuya fecha ya pasó se identifican como Vencidas.
- Al ejecutar una tarea preventiva se genera una orden de trabajo de tipo Preventivo.
- Al cerrarse esa orden, el sistema calcula automáticamente la siguiente fecha de ejecución según la frecuencia definida.
- Las tareas preventivas pueden desactivarse sin borrarse, conservando su historial.

**Prioridad:** Media

---

### MANTENIMIENTO — HU-10: Registrar los activos y equipos del hotel
**Como** encargado de mantenimiento, **quiero** llevar un registro de los equipos del hotel y su historial de intervenciones, **para** decidir con datos cuándo conviene reparar y cuándo reemplazar.

**Criterios de aceptación:**
- Cada activo registra: nombre, categoría (climatización, electricidad, fontanería, mobiliario, ascensores, cocina), ubicación, marca/modelo, fecha de instalación y estado (operativo, en reparación, fuera de servicio).
- Desde el detalle de un activo se puede consultar el historial completo de órdenes de trabajo que lo afectaron.
- El sistema muestra el número de intervenciones y el costo acumulado de cada activo.
- Los activos con más intervenciones que un umbral configurable se señalan como Recurrentes.
- Una orden de trabajo puede asociarse opcionalmente a un activo.

**Prioridad:** Baja

---

### MANTENIMIENTO — HU-11: Registrar el consumo de repuestos
**Como** técnico de mantenimiento, **quiero** registrar los repuestos y materiales que utilicé en una orden, **para** que el consumo se descuente del inventario y quede reflejado el costo real de la reparación.

**Criterios de aceptación:**
- Al registrar el avance de una orden se pueden añadir uno o varios repuestos, indicando cantidad.
- El sistema descuenta la cantidad utilizada del stock del módulo de Inventario.
- No se permite registrar una cantidad mayor a la existencia disponible.
- La orden muestra el costo total de los repuestos consumidos.
- El movimiento se registra en el inventario como una salida, con el código de la orden de trabajo como motivo.

**Prioridad:** Media

---

### MANTENIMIENTO — HU-12: Consultar los indicadores del área
**Como** encargado de mantenimiento, **quiero** consultar los indicadores de desempeño del área en un período determinado, **para** justificar ante la administración el rendimiento del equipo y las necesidades de recursos.

**Criterios de aceptación:**
- Se puede seleccionar el período a consultar: últimos 7 días, últimos 30 días, este mes o este año.
- Se muestran como mínimo: órdenes abiertas, órdenes cerradas, órdenes atrasadas, tiempo promedio de resolución y número de habitaciones fuera de servicio.
- Se presenta la distribución de las órdenes por tipo de avería y por prioridad.
- Se identifican las habitaciones y los activos con mayor número de incidencias en el período.
- Se muestra el costo total en repuestos del período.

**Prioridad:** Baja

---

## 4. Reglas de negocio del módulo

| # | Regla |
|---|---|
| **RN-1** | Toda orden de trabajo debe tener origen: una incidencia reportada, una detección interna o una tarea preventiva. |
| **RN-2** | El ciclo de estados de una orden es `Abierta` → `Asignada` → `En proceso` → `Resuelta` → `Cerrada`. Solo la cancelación rompe la secuencia. |
| **RN-3** | Únicamente el encargado de mantenimiento puede cerrar o cancelar una orden. |
| **RN-4** | Toda cancelación requiere un motivo escrito. |
| **RN-5** | Una habitación con al menos una orden abierta que impide su uso no puede liberarse. |
| **RN-6** | Una habitación liberada por mantenimiento pasa a `En limpieza`, nunca directo a `Disponible`. |
| **RN-7** | Todo cambio de estado se registra con fecha, hora y responsable, y es inmodificable. |
| **RN-8** | El consumo de repuestos no puede exceder la existencia registrada en inventario. |

---

## 5. Dependencias con los demás módulos

| Módulo | Relación |
|---|---|
| **Limpieza** | Le entrega incidencias detectadas durante la limpieza. Recibe de vuelta las habitaciones liberadas, en estado `En limpieza`, para su validación final. |
| **Recepción** | Le entrega las averías reportadas por los huéspedes. Recibe la información de qué habitaciones están fuera de servicio y desde cuándo, para no venderlas. |
| **Administración** | Recibe los indicadores del área. Le proporciona el personal con rol de Mantenimiento (HU-4 de Administración) y el inventario del que se descuentan los repuestos (HU-5 de Administración). |
| **Room Service** | Sin dependencia directa. Eventualmente puede reportar averías en el equipamiento de las habitaciones. |

---

## 6. Alcance no contemplado

Quedan fuera de este módulo:
- La compra de repuestos a proveedores.
- La gestión de contratos con empresas externas de mantenimiento.
- La nómina del personal técnico.
- El mantenimiento de áreas ajenas al hotel.
