# Cobertura de historias de usuario

Las 68 historias del índice V3 tienen al menos una vista asociada. Esta tabla localiza comportamientos a grandes rasgos; no certifica implementación ni cubre todos los criterios de aceptación de cada historia.

**Alcance del plan:** 53 del hito, 10 de Administración pospuestas y 5 de Nivel 2.

| Historia | Comportamiento | Alcance del plan | Diagramas |
|---|---|---|---|
| `HU-HUE-01` | Ver la información del hotel | Hito | [05](05-actividad-disponibilidad-y-tarifa.md) |
| `HU-HUE-02` | Ver el catálogo de habitaciones | Hito | [05](05-actividad-disponibilidad-y-tarifa.md) |
| `HU-HUE-03` | Buscar disponibilidad por fechas y huéspedes | Hito | [05](05-actividad-disponibilidad-y-tarifa.md) |
| `HU-HUE-04` | Ver el precio total de mi estadía | Hito | [05](05-actividad-disponibilidad-y-tarifa.md) |
| `HU-HUE-05` | Ingresar mis datos y confirmar la reserva | Hito | [06](06-secuencia-reserva-web-stripe-y-vencimiento.md) |
| `HU-HUE-06` | Pagar mi reserva en línea | Hito | [06](06-secuencia-reserva-web-stripe-y-vencimiento.md) |
| `HU-HUE-07` | Recibir la confirmación por correo | Hito | [06](06-secuencia-reserva-web-stripe-y-vencimiento.md) |
| `HU-HUE-08` | Entrar a la app con mi correo y un código | Hito | [10](10-secuencia-otp-mis-reservas-y-sesion-de-la-app.md) |
| `HU-HUE-09` | Ver mis reservas y el detalle de mi estadía | Hito | [10](10-secuencia-otp-mis-reservas-y-sesion-de-la-app.md) |
| `HU-HUE-10` | Pedir room service | Hito | [11](11-secuencia-pedido-entrega-cargo-y-push.md) |
| `HU-HUE-11` | Seguir mi pedido en vivo | Hito | [11](11-secuencia-pedido-entrega-cargo-y-push.md) |
| `HU-HUE-12` | Solicitar limpieza | Hito | [12](12-secuencia-limpieza-o-articulos-solicitados.md) |
| `HU-HUE-13` | Solicitar artículos | Hito | [12](12-secuencia-limpieza-o-articulos-solicitados.md) |
| `HU-HUE-14` | Ver el estado de mis solicitudes | Hito | [12](12-secuencia-limpieza-o-articulos-solicitados.md) |
| `HU-HUE-15` | Ver mi cuenta | Hito | [15](15-secuencia-cuenta-cargos-y-saldo.md) |
| `HU-HUE-16` | Pagar mi saldo y hacer check-out desde la app | Hito | [17](17-actividad-decisiones-del-check-out.md) |
| `HU-HUE-17` | Recibir notificaciones en mi teléfono | Hito | [10](10-secuencia-otp-mis-reservas-y-sesion-de-la-app.md) |
| `HU-HUE-18` | Ver las amenidades y el Wi-Fi | Nivel 2 | [25](25-actividad-las-cinco-historias-opcionales.md) |
| `HU-REC-01` | Registrar un huésped | Hito | [08](08-secuencia-recepcion-asignacion-y-check-in.md) |
| `HU-REC-02` | Registrar huéspedes adicionales | Hito | [08](08-secuencia-recepcion-asignacion-y-check-in.md) |
| `HU-REC-03` | Consultar disponibilidad | Hito | [05](05-actividad-disponibilidad-y-tarifa.md) |
| `HU-REC-04` | Crear una reserva | Hito | [08](08-secuencia-recepcion-asignacion-y-check-in.md) |
| `HU-REC-05` | Cancelar una reserva | Hito | [16](16-actividad-cancelar-reserva-y-reembolsar.md) |
| `HU-REC-06` | Buscar reservas | Hito | [08](08-secuencia-recepcion-asignacion-y-check-in.md) |
| `HU-REC-07` | Asignar o cambiar la habitación antes del check-in | Hito | [08](08-secuencia-recepcion-asignacion-y-check-in.md) |
| `HU-REC-08` | Ver el calendario Gantt | Hito | [08](08-secuencia-recepcion-asignacion-y-check-in.md) |
| `HU-REC-09` | Crear una reserva seleccionando días en el Gantt | Nivel 2 | [25](25-actividad-las-cinco-historias-opcionales.md) |
| `HU-REC-10` | Ver el estado de las habitaciones | Hito | [13](13-actividad-limpieza-de-habitaciones-libres.md) |
| `HU-REC-11` | Marcar una habitación libre como sucia | Hito | [13](13-actividad-limpieza-de-habitaciones-libres.md) |
| `HU-REC-12` | Realizar el check-in | Hito | [08](08-secuencia-recepcion-asignacion-y-check-in.md) |
| `HU-REC-13` | Consultar la cuenta y agregar cargos | Hito | [15](15-secuencia-cuenta-cargos-y-saldo.md) |
| `HU-REC-14` | Realizar el check-out con pago único | Hito | [17](17-actividad-decisiones-del-check-out.md) |
| `HU-REC-15` | Emitir la factura | Hito | [18](18-secuencia-cierre-atomico-factura-y-archivos.md) |
| `HU-REC-16` | Imprimir la factura | Hito | [18](18-secuencia-cierre-atomico-factura-y-archivos.md) |
| `HU-REC-17` | Reportar un daño en una habitación | Hito | [14](14-actividad-incidencia-y-recuperacion-de-habitacion.md) |
| `HU-RS-01` | Ver la cola de pedidos activos | Hito | [11](11-secuencia-pedido-entrega-cargo-y-push.md) |
| `HU-RS-02` | Ver el detalle de un pedido | Hito | [11](11-secuencia-pedido-entrega-cargo-y-push.md) |
| `HU-RS-03` | Avanzar el estado de un pedido | Hito | [11](11-secuencia-pedido-entrega-cargo-y-push.md) |
| `HU-RS-04` | Cancelar un pedido | Hito | [11](11-secuencia-pedido-entrega-cargo-y-push.md) |
| `HU-RS-05` | Consultar el menú y marcar ítems agotados | Hito | [11](11-secuencia-pedido-entrega-cargo-y-push.md) |
| `HU-RS-06` | Generar el cargo del pedido entregado | Hito | [11](11-secuencia-pedido-entrega-cargo-y-push.md) |
| `HU-RS-07` | Recibir aviso de pedido nuevo | Hito | [11](11-secuencia-pedido-entrega-cargo-y-push.md) |
| `HU-MYL-01` | Ver las habitaciones pendientes de limpieza | Hito | [13](13-actividad-limpieza-de-habitaciones-libres.md) |
| `HU-MYL-02` | Iniciar o interrumpir la limpieza de una habitación | Hito | [13](13-actividad-limpieza-de-habitaciones-libres.md) |
| `HU-MYL-03` | Marcar la limpieza como terminada | Hito | [13](13-actividad-limpieza-de-habitaciones-libres.md) |
| `HU-MYL-04` | Ver y tomar solicitudes de huéspedes | Hito | [12](12-secuencia-limpieza-o-articulos-solicitados.md) |
| `HU-MYL-05` | Atender una solicitud | Hito | [12](12-secuencia-limpieza-o-articulos-solicitados.md) |
| `HU-MYL-06` | Reportar un daño | Hito | [14](14-actividad-incidencia-y-recuperacion-de-habitacion.md) |
| `HU-MYL-07` | Ver las incidencias y tomar una | Hito | [14](14-actividad-incidencia-y-recuperacion-de-habitacion.md) |
| `HU-MYL-08` | Resolver una incidencia | Hito | [14](14-actividad-incidencia-y-recuperacion-de-habitacion.md) |
| `HU-ADM-01` | Crear un empleado | Pospuesto | [24](24-secuencia-administracion-y-configuracion.md) |
| `HU-ADM-02` | Editar, desactivar o restablecer la contraseña de un empleado | Pospuesto | [24](24-secuencia-administracion-y-configuracion.md) |
| `HU-ADM-03` | Gestionar tipos de habitación | Pospuesto | [24](24-secuencia-administracion-y-configuracion.md) |
| `HU-ADM-04` | Gestionar habitaciones | Pospuesto | [24](24-secuencia-administracion-y-configuracion.md) |
| `HU-ADM-05` | Gestionar el menú de Room Service | Pospuesto | [24](24-secuencia-administracion-y-configuracion.md) |
| `HU-ADM-06` | Gestionar temporadas | Pospuesto | [24](24-secuencia-administracion-y-configuracion.md) |
| `HU-ADM-07` | Configurar el ajuste de fin de semana | Pospuesto | [24](24-secuencia-administracion-y-configuracion.md) |
| `HU-ADM-08` | Configurar los datos del hotel y de facturación | Pospuesto | [24](24-secuencia-administracion-y-configuracion.md) |
| `HU-ADM-09` | Ver los indicadores básicos | Pospuesto | [24](24-secuencia-administracion-y-configuracion.md) |
| `HU-ADM-10` | Consultar las incidencias de mantenimiento | Pospuesto | [24](24-secuencia-administracion-y-configuracion.md) |
| `HU-ADM-11` | Gestionar amenidades y el Wi-Fi | Nivel 2 | [25](25-actividad-las-cinco-historias-opcionales.md) |
| `HU-ADM-12` | Definir y asignar turnos | Nivel 2 | [25](25-actividad-las-cinco-historias-opcionales.md) |
| `HU-ADM-13` | Gestionar el inventario | Nivel 2 | [25](25-actividad-las-cinco-historias-opcionales.md) |
| `HU-CM-01` | Recibir una reserva de un canal externo | Hito | [07](07-secuencia-reserva-de-canal-simulado.md) |
| `HU-CM-02` | Ver el canal de origen de las reservas | Hito | [07](07-secuencia-reserva-de-canal-simulado.md) |
| `HU-CM-03` | Enviar reservas de prueba con el canal simulado | Hito | [07](07-secuencia-reserva-de-canal-simulado.md) |
| `HU-EMP-01` | Iniciar y cerrar sesión en la web privada | Hito | [09](09-secuencia-sesion-del-personal-y-bff.md) |
| `HU-EMP-02` | Cambiar mi contraseña temporal | Hito | [09](09-secuencia-sesion-del-personal-y-bff.md) |

[Volver al índice](README.md) · [Índice V3 de historias](../04%20-%20Historias%20de%20Usuario/00%20-%20Indice%20de%20Historias%20de%20Usuario.md)
