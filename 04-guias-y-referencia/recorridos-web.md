# Manual de recorridos web y errores

Referencia: [reconciliación y versiones del 22/10/2026](../02-producto/reconciliacion-frontend-20261022.md). Describe integraciones preparadas y límites; no proporciona credenciales ni certifica servicios de producción.

## Cliente y huésped

- Inicio y `/catalogo`: consultar información y ofertas. Si hotel/catálogo falla, informar el error; no activar demo automáticamente ni crear registros para rellenar una pantalla.
- Datos → Revisión → verificación de correo → Pago: conservar lo escrito entre pasos; usar Editar/regreso. El borrador caduca a las dos horas; un intento pendiente conserva su comprobante y se consulta antes de iniciar otro. No hay opción de descartar ni cancelación de una reserva mediante limpieza del navegador.
- Retorno `/reserva/resultado`: consultar estado y usar únicamente la acción habilitada por el API. Error de red significa estado desconocido. No confirmar pago por URL ni volver a cobrar por ausencia de respuesta.
- `/login`: correo y contraseña de personal, o código del huésped. «Obtén tu código de acceso» solicita OTP; mensajes genéricos no revelan si un correo existe. Respetar límites/Retry-After y vigencia real. «¿Olvidaste tu contraseña?» es recuperación de personal, no OTP del huésped.
- `/portal`: seleccionar reserva/historial, cuenta, servicios y chat según permisos. Servicios de estancia solo durante EN_ESTADIA. Historial finalizado/cancelado no habilita pedidos. Amenidades/Wi-Fi se consultan según contrato con sesión.
- Check-in documental: adjuntar JPG/PNG/PDF y consultar revisión. Los controles de documentos no son un lector de llave digital y no sustituyen la recepción del hotel ni realizan el check-in operativo.
- Salida: saldo y ventana autorizados por API; confirmar comprador/NIT o CF, aceptar cancelaciones requeridas y revisar la factura final. No presentar la llegada a la pasarela como pago aprobado. Reenvío de factura sin endpoint real no puede anunciar «correo enviado».

## Personal

- Login redirige por identidad, rol y área. Una temporal obliga a `/panel/cambiar-contrasena` antes de utilizar otros módulos. No se admite cambiar rol desde Perfil.
- Perfil muestra datos autorizados, información laboral y seguridad existentes. «Actualizar perfil» recarga; las solicitudes de corrección se gestionan separadamente y no alteran permisos automáticamente.
- Cerrar sesión utiliza el mecanismo existente y vuelve al login. Si falla el servicio, mostrar el error y no afirmar invalidación del servidor sin respuesta. No almacenar contraseñas/OTP en almacenamiento del navegador ni logs.
- Recepción: buscar reserva, abrir detalle, asignar habitación antes de check-in y operar cuenta/check-out. Cancelación requiere motivo y previsualización económica; las 48 horas se evalúan al ejecutar la cancelación.
- Calendario por habitaciones: la selección de noches libres HU-REC-09 es Nivel 2 y está preparada localmente para aprobación. Primera/última noche, botón de reservar selección y limpiar; ratón, toque y teclado usan el mismo recorrido. Fechas ocupadas o habitación fuera de servicio no son seleccionables. La disponibilidad vuelve a comprobarse antes de abrir el formulario y al guardar.
- Administración: empleados/cuentas y datos laborales separados; el temporal solo se muestra una vez. Filtros no sustituyen permisos. Habitaciones físicas y categorías no equivalen a publicar ofertas. Hotel, menú, temporadas, indicadores, amenidades y turnos pueden mostrar errores hasta que el API implemente sus operaciones.
- Limpieza: priorizar llegadas, iniciar/interrumpir/finalizar habitaciones y tomar/atender solicitudes según área y responsable. Rechazo de concurrencia exige consultar datos actualizados; no simular finalización.
- Mantenimiento: incidencias de tres pasos; órdenes/preventivos/activos existentes son operación ampliada. Repuestos comparten inventario. Un error de operaciones adicionales no debe ocultar las incidencias básicas.
- Room Service: cola, detalle, notas, transiciones consecutivas, motivo al cancelar, agotado sin reactivación de este rol. El historial debe conservar fecha/hora/responsable/motivo sin inventarlos; corrección preparada para aprobación. Cargo y notificación se producen en servidor al entregar.

## Demostración y errores

Demo requiere entorno development/test en localhost, modos demo coherentes y ausencia de API real. En conexión real se consultan datos del API; fallo no activa fixtures. Las operaciones sin soporte no muestran confirmación de guardado. En móvil se mantienen controles accesibles, desplazamiento y botones sin superponerse; la existencia de estilos responsive no acredita cada navegador/dispositivo.

No ejecutar reservas, pagos, correos o cambios de cuentas reales para comprobar este manual. Preparar casos con HTTP controlado; persistencia y permisos reales quedan para un entorno autorizado.
