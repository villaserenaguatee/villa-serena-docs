# Reservas de experiencias

Las experiencias amplían una amenidad existente sin copiar su nombre, descripción, imagen ni estado. Cada amenidad admite una configuración de experiencia. No se crean experiencias, precios, fechas ni cupos de ejemplo mediante migración.

## Configuración explícita

Administración configura categoría libre, duración, horarios con inicio y fin, capacidad, modalidad (INMEDIATA, APROBACION o COORDINACION), tarifa (GRATUITA, POR_PERSONA o POR_RESERVA), precio, cobro y cancelación. La configuración no tiene valores comerciales implícitos: el operador debe completarla. La imagen se administra por el flujo de amenidades existente y nunca se borra físicamente aquí.

GRATUITA exige precio cero y SIN_CARGO. Las tarifas pagadas exigen precio positivo y CUENTA o ANTICIPADO. CUENTA conserva la restricción de cuenta abierta y alojamiento EN_ESTADIA, incluso si requiereEstadia es falso. ANTICIPADO no permite confirmar en línea: abre una consulta persistente con Recepción. No se integra otro pago ni se simula una confirmación sin anticipo. COORDINACION también utiliza consultas, separadas de las reservas y sin consumir cupos.

## Acceso y fechas

Un huésped autenticado consulta y crea durante una reserva CONFIRMADA o EN_ESTADIA cuya fecha de salida no ha pasado. Puede reservar antes del check-in las experiencias gratuitas que no exijan presencia. La experiencia debe ocurrir dentro de las fechas del alojamiento (ambos días incluidos), en horario futuro configurado por Administración. No se inventa una hora de llegada o salida para experiencias. Mis reservas y consultas siguen disponibles como historial propio al finalizar o cancelar el alojamiento. La propiedad se valida por código de alojamiento y sujeto JWT; no se confía en IDs locales ni en habitación.

## Cupos y cambios

PENDIENTE y CONFIRMADA consumen cupos. Recepción decide solicitudes pendientes; rechazar exige motivo y libera los cupos. La aprobación revalida estado del alojamiento, disponibilidad del servicio, horario futuro y requisitos. La política no incluye caducidad automática de solicitudes: Recepción debe decidirlas. Una consulta respondida no equivale a una reserva confirmada.

Toda mutación bloquea primero la experiencia en PostgreSQL, luego el alojamiento/horario/reserva necesarios, de forma consistente entre procesos. Una clave UUID por alojamiento distingue reintentos: el mismo cuerpo devuelve el mismo registro; reutilizarla para otro cuerpo produce 409. Una restricción única impide dos reservas activas del mismo alojamiento y horario, incluso con claves distintas. No se pueden mover horarios con reservas registradas ni reducir capacidad por debajo de los cupos usados. Las franjas activas de una misma experiencia no se superponen.

## Dinero y cancelaciones

El total y la política de cancelación se fijan al crear la reserva. Los cambios de precio posteriores no revalorizan registros existentes. El cargo CUENTA se genera exactamente una vez al confirmar una reserva inmediata o aprobar una pendiente, reutilizando CargoService. El cargo se vincula mediante una referencia única y charge_id único. Consultar, elegir y solicitar aprobación no genera cargos.

La cancelación depende de cancelable y de los minutos de antelación configurados, fijados en cada reserva. Si hay cargo, se anula el mismo mediante CuentaService, con motivo, dentro de la transacción que cancela y libera cupos. Si la cuenta ya está cerrada, la operación se rechaza completa; no se simula devolución bancaria. Repetir una cancelación completada no duplica reversos. No se altera Recurrente, pagos, facturas ni reservas públicas. La cancelación del alojamiento no cancela silenciosamente las experiencias: deben gestionarse con su política y cuenta; el historial permanece visible.

## Dependencias

Primero contrato Docs, luego migración/servicios API, luego tipos generados/BFF y pantallas Web. Las tres PR permanecen en borrador. No ejecutar migraciones sobre datos reales, integrar ni desplegar sin autorización. La PR Web #134 de check-in no forma parte de este trabajo.

Antes de habilitar oferta real, el hotel debe definir precios, capacidad, horarios, cancelación y modalidades en Administración. Se requieren pruebas de último cupo concurrente, duplicados, claves incompatibles, permisos, revisiones obsoletas, cancelaciones, cargo único y anulación, consultas y persistencia en PostgreSQL, además de recorridos Web bilingües.
