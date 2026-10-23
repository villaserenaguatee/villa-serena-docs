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
- Inventario comparte existencias con compras y repuestos; turnos son informativos. El canal simulado demuestra la API de entrada; no representa una integración bidireccional real con Booking o Expedia.
- La arquitectura de producción conserva los supuestos por confirmar del documento 14 §14.

## Fuentes de referencia

- [Alcance y decisiones](../../02-producto/alcance-y-decisiones.md)
- [Roles y responsabilidades](../../02-producto/roles-y-responsabilidades.md)
- [Máquinas de estados](../maquinas-de-estados.md)
- [Inventario, turnos y personal](../../02-producto/inventario-turnos-personal.md)
- [Matriz de permisos](../../02-producto/matriz-de-permisos.md)
- [Reglas de negocio](../../02-producto/reglas-de-negocio.md)
- [Requisitos funcionales](../../02-producto/requisitos-funcionales.md)
- [Casos de uso](../../02-producto/casos-de-uso.md)
- [Roadmap por versiones](../../01-metodologia/roadmap-versiones.md) (vigente) y [plan de trabajo original archivado](../../04-guias-y-referencia/historico/plan-de-trabajo-original.md) (histórico)
- [Arquitectura del sistema](../arquitectura-sistema.md)
- [Integración con canales](../../04-guias-y-referencia/integracion-canales.md)
- [Índice de historias de usuario](../../02-producto/historias-de-usuario/00%20-%20Indice%20de%20Historias%20de%20Usuario.md)
- [Guía de contribución](../../CONTRIBUTING.md)
- [HU - Administrador](../../02-producto/historias-de-usuario/HU%20-%20Administrador.md)
- [HU - Channel Manager](../../02-producto/historias-de-usuario/HU%20-%20Channel%20Manager.md)
- [HU - Cliente y Huésped](../../02-producto/historias-de-usuario/HU%20-%20Cliente%20y%20Huesped.md)
- [HU - Mantenimiento y Limpieza](../../02-producto/historias-de-usuario/HU%20-%20Mantenimiento%20y%20Limpieza.md)
- [HU - Personal del Hotel](../../02-producto/historias-de-usuario/HU%20-%20Personal%20del%20Hotel.md)
- [HU - Recepcionista](../../02-producto/historias-de-usuario/HU%20-%20Recepcionista.md)
- [HU - Room Service](../../02-producto/historias-de-usuario/HU%20-%20Room%20Service.md)
- [Contrato OpenAPI canónico](../../openapi.yaml) y [guía del contrato](../contrato-api.md).

Las historias iniciales se consideran históricas: el mapa usa el índice V3 y las reglas vigentes. No se ejecutó infraestructura del hotel para elaborar estos diagramas.
