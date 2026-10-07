# Historias de Usuario — Huéspedes (Iniciales)

### HU-01: Reserva de Habitaciones en Línea
- **COMO:** Huésped del hotel
- **QUIERO:** Buscar disponibilidad y reservar una habitación desde la página web
- **PARA:** Asegurar mi hospedaje de forma rápida y sin necesidad de llamar por teléfono

#### Criterios de Aceptación:
- Permite seleccionar fechas de check-in/check-out y número de huéspedes.
- Muestra únicamente habitaciones disponibles con tipo, precio por noche y fotos.
- Solicita datos personales (nombre, correo, teléfono) para la confirmación.
- Envía un correo automático de confirmación con el código de reserva.
- Actualiza el inventario en tiempo real para evitar overbooking.

#### Notas Técnicas:
- Integración con pasarela de pago para validación o cobro con tarjeta.
- Conexión directa del motor de reservas con la base de datos principal.

---

### HU-02: Check-In Web Anticipado
- **COMO:** Huésped con reserva confirmada
- **QUIERO:** Realizar el check-in desde mi teléfono 24 horas antes de mi llegada
- **PARA:** Evitar filas en recepción y acceder directamente a mi habitación

#### Criterios de Aceptación:
- Envía enlace único por email/SMS 24 horas antes del ingreso.
- Permite cargar imagen del documento de identidad (DNI/pasaporte) y verificar datos.
- Incluye firma digital de los términos y condiciones de la estancia.
- Permite ingresar peticiones especiales (p. ej., cama adicional, piso alto).
- Genera una llave digital o código QR de acceso al finalizar el proceso.

#### Notas Técnicas:
- Módulo de carga de archivos con validación de formato (JPG/PDF).
- Integración con PMS para actualizar estado a "Check-in completado".

---

### HU-03: Portal de Servicios y Pedidos a la Habitación
- **COMO:** Huésped alojado en el hotel
- **QUIERO:** Solicitar comida, servicios adicionales y realizar consultas desde la plataforma web o app
- **PARA:** Recibir atención rápida sin necesidad de llamar o acudir presencialmente a recepción

#### Criterios de Aceptación:
- Acceso vía código QR en habitación o desde la app del hotel.
- Menú interactivo de restaurante con tiempos de entrega y notas de alergias/preferencias.
- Catálogo de servicios adicionales (toallas extra, limpieza, almohadas, etc.).
- Mensajería/chat en tiempo real con la recepción para consultas.
- Seguimiento en vivo del estado del pedido (Recibido, En preparación, En camino).
- Carga automática del costo a la cuenta general de la habitación.

#### Notas Técnicas:
- Implementación de WebSockets/Push para alertas en cocina y recepción.
- Conexión con el PMS para transferencia directa de cargos.

---

### HU-04: Control de Confort y Amenidades (IoT y Reservas)
- **COMO:** Huésped alojado
- **QUIERO:** Controlar la domótica de mi habitación y agendar espacios en las instalaciones
- **PARA:** Personalizar mi ambiente y asegurar mi turno en áreas de uso limitado

#### Criterios de Aceptación:
- Control de temperatura, luces y cortinas desde el dispositivo móvil.
- Apertura de puerta vía tecnología NFC/Bluetooth/QR.
- Módulo de reserva de turnos para spa, gimnasio, canchas o restaurantes temáticos.
- Conexión automática a la red Wi-Fi sin escribir contraseña.

#### Notas Técnicas:
- Integración con controladores IoT del edificio y cerraduras inteligentes.
- Motor de agendas con límites de aforo por área.

---

### HU-05: Control de Gastos, Facturación y Check-Out Digital
- **COMO:** Huésped hospedado
- **QUIERO:** Consultar mi cuenta en tiempo real, pagar y realizar el check-out desde mi móvil
- **PARA:** Monitorear mi presupuesto y retirarme del hotel sin hacer filas

#### Criterios de Aceptación:
- Desglose actualizado de consumos (estancia, restaurante, room service, servicios).
- Formulario para carga de datos fiscales y emisión de factura electrónica.
- Pago del saldo pendiente vía tarjeta de crédito, débito o puntos de fidelidad.
- Cambio automático del estado de la habitación a "Desocupada/Pendiente de Limpieza".
- Desactivación inmediata de llaves digitales tras procesar el pago.
- Envío de comprobante de pago y factura vía correo electrónico.

#### Notas Técnicas:
- Cumplimiento PCI-DSS en la pasarela de pago.
- Integración con el sistema de facturación electrónica local y el PMS.
