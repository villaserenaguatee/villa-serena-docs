# Diagramas del sistema Villa Serena

Vista a grandes rasgos del sistema definido por la documentación: componentes, participantes, actividades, secuencias y estados. Los bloques Mermaid se pueden leer y editar en estos archivos; GitHub los representa como diagramas.

**Corte documental:** 9 de octubre de 2026, documentación base `3d26438`. Es un modelo de los requisitos y decisiones vigentes, no una auditoría de lo implementado.

## Recorrido recomendado

1. [Componentes y conexiones](01-componentes-y-conexiones.md) y [participantes](02-participantes-y-responsabilidades.md).
2. [Actividad general](03-actividad-general-de-la-reserva-a-la-siguiente-llegada.md) y [secuencia general](04-secuencia-general-del-viaje-del-huesped.md).
3. Reservas, operación y cierre en los diagramas 05–18.
4. Seguridad, notificaciones y estados en los diagramas 19–23.
5. Administración pospuesta, Nivel 2 y producción en los diagramas 24–26.

## Alcance y convenciones

- **Hito:** 53 historias activas del plan para el hito; **pospuesto:** 10 historias de Administración; **Nivel 2:** 5 historias opcionales. Producción se muestra como posterior al hito.
- Administración aparece como Nivel 1 en el alcance original, pero el plan pospone su objetivo. El canal simulado del Administrador continúa en el hito.
- Los recortes de reserva del plan no aparecen como aprobados: aquí se conservan check-out en app, Gantt y huéspedes adicionales.
- Las actividades usan `flowchart`, con acciones y decisiones; las secuencias usan `sequenceDiagram`, con actores, participantes y mensajes. Son vistas de alto nivel, no una especificación UML ejecutable.
- Los subcomponentes del API son módulos dentro de una única aplicación Spring; las flechas funcionales no implican microservicios.
- Fechas, horas operativas y reglas de vencimiento usan `America/Guatemala`. Los importes son GTQ y los precios quedan congelados según las reglas del origen de reserva.
- Cada diagrama enlaza sus fuentes y conserva los IDs de historias y reglas. Las referencias abreviadas indican documento, sección o familia de reglas.
- [Cobertura de las 68 historias](COBERTURA.md): permite localizar cada HU; no sustituye sus criterios de aceptación.

## Índice

| Nº | Diagrama | Vista | Alcance del plan |
|---|---|---|---|
| 01 | [Componentes y conexiones](01-componentes-y-conexiones.md) | Componentes | Hito |
| 02 | [Participantes y responsabilidades](02-participantes-y-responsabilidades.md) | Participantes | Mixto |
| 03 | [Actividad general: de la reserva a la siguiente llegada](03-actividad-general-de-la-reserva-a-la-siguiente-llegada.md) | Actividad | Hito |
| 04 | [Secuencia general del viaje del huésped](04-secuencia-general-del-viaje-del-huesped.md) | Secuencia | Hito |
| 05 | [Actividad: disponibilidad y tarifa](05-actividad-disponibilidad-y-tarifa.md) | Actividad | Hito |
| 06 | [Secuencia: reserva web, Stripe y vencimiento](06-secuencia-reserva-web-stripe-y-vencimiento.md) | Secuencia | Hito |
| 07 | [Secuencia: reserva de canal simulado](07-secuencia-reserva-de-canal-simulado.md) | Secuencia | Hito |
| 08 | [Secuencia: Recepción, asignación y check-in](08-secuencia-recepcion-asignacion-y-check-in.md) | Secuencia | Hito |
| 09 | [Secuencia: sesión del personal y BFF](09-secuencia-sesion-del-personal-y-bff.md) | Secuencia | Hito |
| 10 | [Secuencia: OTP, mis reservas y sesión de la app](10-secuencia-otp-mis-reservas-y-sesion-de-la-app.md) | Secuencia | Hito |
| 11 | [Secuencia: pedido, entrega, cargo y push](11-secuencia-pedido-entrega-cargo-y-push.md) | Secuencia | Hito |
| 12 | [Secuencia: limpieza o artículos solicitados](12-secuencia-limpieza-o-articulos-solicitados.md) | Secuencia | Hito |
| 13 | [Actividad: limpieza de habitaciones libres](13-actividad-limpieza-de-habitaciones-libres.md) | Actividad | Hito |
| 14 | [Actividad: incidencia y recuperación de habitación](14-actividad-incidencia-y-recuperacion-de-habitacion.md) | Actividad | Hito |
| 15 | [Secuencia: cuenta, cargos y saldo](15-secuencia-cuenta-cargos-y-saldo.md) | Secuencia | Hito |
| 16 | [Actividad: cancelar reserva y reembolsar](16-actividad-cancelar-reserva-y-reembolsar.md) | Actividad | Hito |
| 17 | [Actividad: decisiones del check-out](17-actividad-decisiones-del-check-out.md) | Actividad | Hito |
| 18 | [Secuencia: cierre atómico, factura y archivos](18-secuencia-cierre-atomico-factura-y-archivos.md) | Secuencia | Hito |
| 19 | [Secuencia: conexiones y cuatro eventos en vivo](19-secuencia-conexiones-y-cuatro-eventos-en-vivo.md) | Secuencia | Hito |
| 20 | [Secuencia: Outbox, correos y notificaciones push](20-secuencia-outbox-correos-y-notificaciones-push.md) | Secuencia | Hito |
| 21 | [Estados: reserva, cuenta, pago, cargo y factura](21-estados-reserva-cuenta-pago-cargo-y-factura.md) | Estados | Hito |
| 22 | [Estados: ocupación y condición de habitación](22-estados-ocupacion-y-condicion-de-habitacion.md) | Estados | Hito |
| 23 | [Estados: pedidos, solicitudes e incidencias](23-estados-pedidos-solicitudes-e-incidencias.md) | Estados | Hito |
| 24 | [Secuencia: Administración y configuración](24-secuencia-administracion-y-configuracion.md) | Secuencia | Pospuesto |
| 25 | [Actividad: las cinco historias opcionales](25-actividad-las-cinco-historias-opcionales.md) | Actividad | Nivel 2 |
| 26 | [Componentes: despliegue, entrega y backups futuros](26-componentes-despliegue-entrega-y-backups-futuros.md) | Componentes | Después |

## Decisiones que requieren lectura conjunta

- El cierre de la estadía agrupa los cambios de negocio en BD. Correo y almacenamiento de PDF requieren coordinación; no se supone una transacción distribuida entre BD, archivos y correo.
- Los cuatro eventos WebSocket se publican después del commit; al reconectar, las pantallas vuelven a consultar el estado. Cuenta, Gantt, incidencias y estados de solicitudes en la app se recargan según sus historias.
- Inventario es aislado y turnos son informativos. El canal simulado demuestra la API de entrada; no representa una integración bidireccional real con Booking o Expedia.
- La arquitectura de producción conserva los supuestos por confirmar del documento 14 §14.

## Fuentes de referencia

- [01 - Alcance del Proyecto.md](../01%20-%20Alcance%20del%20Proyecto.md)
- [02 - Definicion de Roles.md](../02%20-%20Definicion%20de%20Roles.md)
- [07 - Estados.md](../07%20-%20Estados.md)
- [08 - Inventario Turnos y Personal.md](../08%20-%20Inventario%20Turnos%20y%20Personal.md)
- [09 - Matriz de Permisos.md](../09%20-%20Matriz%20de%20Permisos.md)
- [10 - Reglas de Negocio.md](../10%20-%20Reglas%20de%20Negocio.md)
- [11 - Requisitos Funcionales.md](../11%20-%20Requisitos%20Funcionales.md)
- [12 - Casos de Uso.md](../12%20-%20Casos%20de%20Uso.md)
- [13 - Plan de Trabajo.md](../13%20-%20Plan%20de%20Trabajo.md)
- [14 - Tecnologias y Arquitectura.md](../14%20-%20Tecnologias%20y%20Arquitectura.md)
- [19 - Diseno de Integracion con Canales.md](../19%20-%20Diseno%20de%20Integracion%20con%20Canales.md)
- [04 - Historias de Usuario/00 - Indice de Historias de Usuario.md](../04%20-%20Historias%20de%20Usuario/00%20-%20Indice%20de%20Historias%20de%20Usuario.md)
- [CONTRIBUTING.md](../CONTRIBUTING.md)
- [04 - Historias de Usuario/HU - Administrador.md](../04%20-%20Historias%20de%20Usuario/HU%20-%20Administrador.md)
- [04 - Historias de Usuario/HU - Channel Manager.md](../04%20-%20Historias%20de%20Usuario/HU%20-%20Channel%20Manager.md)
- [04 - Historias de Usuario/HU - Cliente y Huesped.md](../04%20-%20Historias%20de%20Usuario/HU%20-%20Cliente%20y%20Huesped.md)
- [04 - Historias de Usuario/HU - Mantenimiento y Limpieza.md](../04%20-%20Historias%20de%20Usuario/HU%20-%20Mantenimiento%20y%20Limpieza.md)
- [04 - Historias de Usuario/HU - Personal del Hotel.md](../04%20-%20Historias%20de%20Usuario/HU%20-%20Personal%20del%20Hotel.md)
- [04 - Historias de Usuario/HU - Recepcionista.md](../04%20-%20Historias%20de%20Usuario/HU%20-%20Recepcionista.md)
- [04 - Historias de Usuario/HU - Room Service.md](../04%20-%20Historias%20de%20Usuario/HU%20-%20Room%20Service.md)
- [Contrato OpenAPI del API](https://github.com/villaserenaguate/villa-serena-api/blob/main/openapi.yaml).

Las historias iniciales se consideran históricas: el mapa usa el índice V3 y las reglas vigentes. No se ejecutó infraestructura del hotel para elaborar estos diagramas.
