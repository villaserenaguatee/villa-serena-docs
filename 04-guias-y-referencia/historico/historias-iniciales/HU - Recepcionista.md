# Historias de Usuario — Recepcionista (Iniciales)

### 1. Registrar huésped
- **Como:** recepcionista
- **Quiero:** registrar los datos personales del huésped
- **Para:** crear correctamente su perfil dentro del sistema
- **¿Cómo debemos hacerlo?**
  Crear un formulario con nombre completo, DPI o pasaporte, teléfono, correo y nacionalidad. Validar que los datos obligatorios estén completos antes de guardar la información.

---

### 2. Realizar reserva
- **Como:** recepcionista
- **Quiero:** crear una reserva para un huésped
- **Para:** garantizar que tenga una habitación disponible durante su estadía
- **¿Cómo debemos hacerlo?**
  Seleccionar el huésped, las fechas de entrada y salida, la cantidad de personas y el tipo de habitación. El sistema debe verificar automáticamente que exista disponibilidad antes de confirmar la reserva.

---

### 3. Consultar disponibilidad
- **Como:** recepcionista
- **Quiero:** consultar las habitaciones disponibles por fecha
- **Para:** ofrecer al huésped las opciones disponibles
- **¿Cómo debemos hacerlo?**
  Ingresar la fecha de entrada y salida y mostrar las habitaciones disponibles, indicando número, tipo, capacidad y precio.

---

### 4. Asignar habitación
- **Como:** recepcionista
- **Quiero:** asignar una habitación a una reserva
- **Para:** garantizar que el huésped tenga una habitación preparada para su llegada
- **¿Cómo debemos hacerlo?**
  Mostrar únicamente las habitaciones disponibles y permitir seleccionar una. El sistema debe evitar que una habitación tenga dos reservas para las mismas fechas.

---

### 5. Realizar check-in
- **Como:** recepcionista
- **Quiero:** registrar la llegada del huésped
- **Para:** confirmar oficialmente su ingreso al hotel
- **¿Cómo debemos hacerlo?**
  Buscar la reserva, verificar los datos del huésped, confirmar la habitación y registrar la fecha y hora de entrada. La habitación debe cambiar automáticamente a estado ocupada.

---

### 6. Realizar check-out
- **Como:** recepcionista
- **Quiero:** registrar la salida del huésped
- **Para:** finalizar su estadía y liberar la habitación
- **¿Cómo debemos hacerlo?**
  Buscar la reserva, verificar los consumos y pagos pendientes, generar el total y confirmar la salida. La habitación debe cambiar automáticamente a estado disponible o limpieza, según el funcionamiento del hotel.

---

### 7. Modificar reserva
- **Como:** recepcionista
- **Quiero:** modificar una reserva
- **Para:** atender cambios solicitados por el huésped
- **¿Cómo debemos hacerlo?**
  Permitir modificar las fechas, cantidad de huéspedes o habitación. Antes de confirmar los cambios, el sistema debe verificar nuevamente la disponibilidad.

---

### 8. Cancelar reserva
- **Como:** recepcionista
- **Quiero:** cancelar una reserva
- **Para:** mantener actualizada la disponibilidad del hotel
- **¿Cómo debemos hacerlo?**
  Buscar la reserva, seleccionar el motivo de cancelación y solicitar confirmación. El sistema debe cambiar el estado de la reserva a cancelada y liberar la habitación.

---

### 9. Registrar pagos
- **Como:** recepcionista
- **Quiero:** registrar los pagos de los huéspedes
- **Para:** mantener actualizado el saldo de cada reserva
- **¿Cómo debemos hacerlo?**
  Mostrar el total de la reserva, el monto pagado y el saldo pendiente. Permitir seleccionar el método de pago, como efectivo, tarjeta u otro, y guardar la transacción.

---

### 10. Registrar servicios adicionales
- **Como:** recepcionista
- **Quiero:** agregar servicios consumidos por el huésped
- **Para:** incluirlos en su cuenta final
- **¿Cómo debemos hacerlo?**
  Seleccionar la reserva y agregar los servicios utilizados, como restaurante, lavandería, estacionamiento u otros. Indicar la cantidad y el precio de cada servicio.

---

### 11. Consultar cuenta del huésped
- **Como:** recepcionista
- **Quiero:** consultar los cargos de un huésped
- **Para:** informarle cuánto debe pagar antes de su salida
- **¿Cómo debemos hacerlo?**
  Mostrar el costo del alojamiento, los servicios adicionales, pagos realizados, descuentos y el saldo pendiente del huésped.

---

### 12. Generar comprobante
- **Como:** recepcionista
- **Quiero:** generar un comprobante de pago
- **Para:** entregárselo al huésped como evidencia de su transacción
- **¿Cómo debemos hacerlo?**
  Después de registrar el pago, generar un comprobante que incluya los datos del huésped, número de reserva, conceptos cobrados, total, monto pagado, método de pago y fecha.

---

### 13. Consultar información de reservas
- **Como:** recepcionista
- **Quiero:** buscar reservas por nombre, DPI o código
- **Para:** encontrar rápidamente la información del huésped
- **¿Cómo debemos hacerlo?**
  Crear un buscador que permita utilizar diferentes criterios, como nombre, DPI, número de reserva o fecha, y mostrar las reservas que coincidan con la búsqueda.

---

### 14. Consultar estado de habitaciones
- **Como:** recepcionista
- **Quiero:** consultar el estado de las habitaciones
- **Para:** saber cuáles puedo ofrecer a los huéspedes
- **¿Cómo debemos hacerlo?**
  Mostrar todas las habitaciones clasificadas según su estado: disponible, ocupada, reservada, en limpieza o en mantenimiento.

---

### 15. Registrar solicitudes de huéspedes
- **Como:** recepcionista
- **Quiero:** registrar las solicitudes de los huéspedes
- **Para:** darles seguimiento y brindar una mejor atención
- **¿Cómo debemos hacerlo?**
  Crear una solicitud asociada al huésped y a su habitación, indicando la descripción de la solicitud, fecha, prioridad y estado.

---

### 16. Notificar solicitudes a otros empleados
- **Como:** recepcionista
- **Quiero:** enviar solicitudes al personal correspondiente
- **Para:** que sean atendidas oportunamente
- **¿Cómo debemos hacerlo?**
  Seleccionar el área responsable, como limpieza o mantenimiento, registrar la solicitud y permitir consultar su estado hasta que sea atendida.

---

### 17. Consultar historial del huésped
- **Como:** recepcionista
- **Quiero:** consultar el historial de estadías de un huésped
- **Para:** conocer sus reservas anteriores cuando sea necesario
- **¿Cómo debemos hacerlo?**
  Buscar al huésped y mostrar sus visitas anteriores, incluyendo fechas de entrada y salida, habitaciones utilizadas, pagos y servicios consumidos.

---

### 18. Registrar huéspedes adicionales
- **Como:** recepcionista
- **Quiero:** registrar a todos los huéspedes que ocuparán una habitación
- **Para:** mantener un registro completo de las personas alojadas
- **¿Cómo debemos hacerlo?**
  Desde la reserva, permitir agregar varios huéspedes y asociarlos a la misma reserva y habitación. Registrar los datos necesarios de cada persona.

---

### 19. Consultar reservas del día
- **Como:** recepcionista
- **Quiero:** consultar las entradas y salidas programadas para el día
- **Para:** organizar las actividades de recepción
- **¿Cómo debemos hacerlo?**
  Crear una vista diaria donde se puedan visualizar los check-in, check-out, reservas pendientes y habitaciones disponibles.

---

### 20. Actualizar estado de habitación
- **Como:** recepcionista
- **Quiero:** actualizar el estado de una habitación
- **Para:** mantener sincronizada la información del hotel
- **¿Cómo debemos hacerlo?**
  Permitir cambiar el estado de las habitaciones según las reglas del sistema, por ejemplo, de limpieza a disponible o de disponible a ocupada, evitando cambios que generen conflictos con las reservas.
