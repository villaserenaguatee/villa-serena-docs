# Modificación de mensajes de Recepción

El chat conserva el envío existente y agrega edición y eliminación lógica para Recepción. Las rutas del personal exigen RECEPCION. `puedeModificar` solo es verdadero cuando el mensaje fue enviado por ese empleado, su autor es RECEPCION, la reserva sigue EN_ESTADIA y el mensaje no está eliminado. Compartir el rol no permite modificar mensajes de otro empleado. Los mensajes de huéspedes tampoco se pueden modificar desde Recepción.

PUT y DELETE requieren la revisión `version` recibida al consultar. Una revisión obsoleta responde 409, un autor ajeno 403 y un mensaje que no pertenece a esa conversación 404. Al finalizar la estancia, el historial es de solo lectura. No se agrega una ventana temporal que no existía como regla del hotel.

Eliminar conserva la fila y su texto privado, marca `deleted_at` e incrementa la versión. Las consultas del personal y del huésped dejan de devolver el texto eliminado. Repetir una eliminación ya completada no elimina registros ni produce otra modificación. Editar conserva la fecha original y registra `editadoEn`. El huésped no obtiene permisos nuevos de edición o eliminación.

La migración V36 agrega tres columnas a `stay_messages`, sin cambiar sus filas anteriores. Los bloqueos siguen el orden reserva → mensaje, de modo que el cierre de estancia y los cambios del mensaje no se intercalen de forma insegura. No se cambia el manejo de documentos de check-in, pagos ni otros módulos.

Favoritos, archivados, eliminación de la lista y marcador de lectura se guardan por empleado y reserva. No cambian mensajes ni preferencias de otras personas. Los no leídos cuentan mensajes de huéspedes no eliminados posteriores al marcador personal. El marcador avanza como máximo hasta el último ID existente y nunca retrocede. No hay datos iniciales ni preferencias ficticias.

Dependencia de publicación: contrato → API → Web #139. Las PR permanecen en borrador, sin fusión ni despliegue automático autorizado. La Web conserva su manejo de indisponibilidad para versiones anteriores del API.
