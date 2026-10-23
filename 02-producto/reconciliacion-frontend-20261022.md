# Reconciliación del frontend — 22/10/2026

## Fuente, estado y trazabilidad

Esta revisión narrativa concilia el producto con web main `e0587c3013dbea7c68c494c4dd4329b37db720eb`, API main `fd18b07386692802859525b0f4da2dfa70cb32d5` y contrato docs `77225a11d06daf576a404e2a557185868bd49c56`. Los commits identifican fuentes inspeccionadas, no certifican el SHA de Spring desplegado ni una integración real.

La fuente HTTP canónica sigue siendo [openapi.yaml](../openapi.yaml). No se modifica en esta reconciliación. La web conserva el SHA fijado hasta una adopción revisada: una modificación narrativa no autoriza cambiar DTO, rutas o consumidores.

Los textos anteriores de las HU, diagramas y requisitos se conservan como trazabilidad, pero se interpretan con las decisiones posteriores siguientes. No se restauran nacionalidad obligatoria, pasaporte, traducción ni autollenado Google/Facebook en los formularios MVP. El soporte histórico del servidor no se elimina.

## Decisiones posteriores que sustituyen redacciones anteriores

| Tema | Comportamiento vigente y límites |
|---|---|
| Plataformas | El personal utiliza módulos privados web. El huésped principal puede acceder al portal web `/portal` y a la app Android. Android conserva push Expo/FCM; no se promete web push. Sustituye la exclusividad Android de D-06/D-08. |
| Idioma | La interfaz MVP es española; no hay selector de idiomas. Las cadenas EN conservadas internamente no constituyen un servicio de traducción público. |
| Datos del huésped | El formulario MVP solicita datos manuales, correo, teléfono +502 de ocho dígitos y DPI de trece dígitos. Nombre y apellidos permiten letras Unicode, espacios, guiones y apóstrofos; no números. Nacionalidad es opcional/nula en el API y no se solicita en el MVP. DPI/pasaporte y país emisor históricos se conservan sin inventar ni migrar información. |
| Identidad | Se diferencia verificación de correo antes de crear una reserva, código de reserva VS-…, OTP de acceso del huésped y recuperación del personal. Ninguno sustituye a otro. |
| Pagos | Recurrente es el proveedor nuevo en GTQ. Stripe permanece para lectura y conciliación de pagos históricos, no se cambia su proveedor ni se reembolsa un pago Stripe por Recurrente. |
| Cancelación | La regla de 48 horas antes de las 15:00 se evalúa cuando Recepción ejecuta la cancelación permitida. Enviar un mensaje o solicitud dentro del plazo no garantiza reembolso. No se agrega cancelación autónoma del huésped. |
| Datos temporales | El borrador usa sessionStorage y caduca a las dos horas de su última actualización. Los comprobantes del intento se separan y no se eliminan solo por antigüedad. Caducidad local no demuestra ausencia de reserva o pago. El enlace «Descartar datos de reserva» y su modal están retirados. |
| Sesión del personal | Temporal generada en servidor, mostrada una vez al ADMIN, entrega personal sin correo y cambio obligatorio. La vigencia después de desactivar presenta diferencia entre RN-PER-014 anterior y el control actual de API; se coordina en API #78 sin debilitar controles. |

## Flujo público y acceso

1. El catálogo consulta ofertas reales; disponibilidad y cotización dependen del servidor. Una tarjeta no equivale a una habitación física ni garantiza cupo.
2. Datos → Revisión conserva el borrador. Los campos vacíos y formatos inválidos se informan junto al campo; no se envían valores inventados por campos retirados.
3. «Verifica tu correo» comprueba el correo y conserva el comprobante asociado al borrador. No se crea la reserva por el simple formato válido del correo. Los encabezados de creación/recuperación están en OpenAPI; el resto del flujo de correo se registra como diferencia contractual, no se inventan operaciones.
4. La creación usa el intento original y los comprobantes requeridos. Si hay respuesta perdida, se consulta `GET /api/v1/publico/reservas/intento` con `Idempotency-Key`, `X-Booking-Draft` y `X-Booking-Email-Verification`, y origen RESERVA/OFERTA. No se crea otra reserva para sustituir una respuesta incierta.
5. El API proporciona `urlPago` y `expiraEn`; la web valida el destino antes de redirigir. El proveedor aloja los campos de tarjeta; no se captura PAN/CVV en formularios propios.
6. `/reserva/resultado` consulta estado. `estadoCheckout` y `accionPago` distinguen INICIAR, CONTINUAR, ESPERAR, REINTENTAR y NINGUNA. Retorno exitoso, parámetros URL o checkout pagado no confirman por sí mismos la reserva. Incertidumbre de red no equivale a pago rechazado y no habilita un cobro duplicado.
7. El correo de confirmación depende de backend/Outbox/SMTP. El huésped abre «Ver mi reserva», utiliza el correo original y solicita un OTP de seis dígitos, válido diez minutos y de un solo uso. VS-… identifica la reserva y no sirve como contraseña. No se envía automáticamente un OTP después del pago.
8. La sesión permite historial cancelado/finalizado sin habilitar servicios de estancia. Pedidos y solicitudes requieren EN_ESTADIA; amenidades/Wi-Fi documentadas admiten cualquier reserva con sesión. No existe una caducidad de cuenta de 24 horas después del check-out.

## Estado por módulo

| Área | Integrado en frontend | Contrato y dependencia |
|---|---|---|
| Reserva/Recepción | Búsqueda, filtros, calendario, asignación antes de check-in, cancelación, cuenta, cargos, check-out y factura | Operaciones oficiales. Datos reales, permisos y persistencia requieren validación autorizada. Llegada opcional pública se muestra en detalle; alta Recepción aún no admite ese campo canónico. |
| Personal | Alta oficial, filtros, edición, propio rol/estado bloqueados, temporal/reset, cambio obligatorio y perfiles | Cuentas oficiales implementadas; datos laborales usan servicios separados existentes. Un fallo parcial no autoriza repetir un alta incierta ni sobrescribir perfiles concurrentes. |
| Hotel/menú/temporadas/indicadores | Formularios y consumidores oficiales preparados | API #88/#90/#92/#93. La ausencia del endpoint no se oculta con datos demo. |
| Amenidades/Wi-Fi y turnos | UI tipada preparada | Nivel 2, API #91/#89. Turnos informativos, empleados activos no ADMIN, cruce de medianoche permitido, rechazo final de traslapes por servidor. |
| Inventario | Insumos, mínimos, compras y movimientos; edición sin stock directo | Contrato oficial reconciliado. Compras y repuestos comparten existencias; no se inventa descuento automático de Room Service/limpieza. |
| Mantenimiento | Incidencias mínimas más órdenes, activos, preventivos y repuestos existentes | Incidencias canónicas; operaciones ampliadas legacy sin contrato integral. No confundir órdenes con reasignación de incidencias mínimas. |
| Limpieza/artículos | Operación del personal existente y UI canónica del huésped | Faltan rutas/DTO canónicos de huésped y cancelación: API #22. Reutilizar lo existente. |
| Room Service | Cola, notas, estados, cancelación, agotado y avisos | API existente. Mostrar responsable/fecha completos del historial es corrección local preparada en web; no se afirma publicada antes de aprobación. |
| Documentos/objetos/chat | Integraciones existentes, sin simular guardados reales | Contrato integral pendiente de acuerdo; véase propuesta separada. Subir documentos no cambia reserva a EN_ESTADIA. |
| Perfiles laborales/finanzas | Asistencia, nómina calculada, correcciones, gastos y activos existentes | DTO legacy por reconciliar. Nómina calculada no acredita pago/desembolso; corrección solicitada no modifica automáticamente identidad/rol. |
| Extensiones/experiencias/domótica/llave | Presentaciones resguardadas o locales | Sin operación oficial aplicable: no son servicios conectados disponibles, no habilitar cobros ni persistencia ficticia. |

## Catálogo comercial y configuración inicial

El tipo/categoría representa capacidad y precio base de tipo; `rooms` son unidades físicas. Una oferta comercial tiene contenido, precio y requisitos propios y se relaciona con unidades mediante `catalog_offer_rooms`. Las fotografías de tipo y características físicas no equivalen al estado de publicación de una oferta.

El CRUD básico existente usa `/api/v1/admin/catalogos/tipos` y `/habitaciones`. Registrar varias unidades no debe duplicar tarjetas. Cantidades físicas se derivan de registros; disponibilidad se consulta por fechas y reservas. El precio público y el de cotización deben tener una fuente acordada; cambiar solamente `room_types.base_price` no acredita actualizar `catalog_offers.base_price`. `precioBase` es el nombre del campo API.

Superficie, camas, características, principal/galería, asociaciones y publicación integral dependen de API #82/#83; errores de duplicados, de #84. No equiparar ACTIVO a publicado ni `bookable` a disponibilidad para cualquier rango. La promesa anterior de reflejo inmediato queda condicionada a esa integración y sus datos, no solo a modificar el tipo.

`HOTEL_NO_CONFIGURADO` observado exige investigar primero los registros y el entorno. API #10 registra la inicialización real, #47 la serie fiscal y #88 GET/PUT administrativos. No usar demo, reiniciar series ni afirmar que PostgreSQL está vacío por un 404 o listado vacío.

## Preparación local de frontend, todavía sin publicación

- HU-RS-02: conservar responsable y fecha/hora del API en historial, con ausencia explícita si falta un dato histórico.
- HU-REC-09 (Nivel 2): selección de noches libres, salida exclusiva, fechas/habitación/tipo precargados; consulta de disponibilidad antes del formulario y revalidación al guardar.
- NIT de huésped: reutilizar el validador guatemalteco, CF permitido, error accesible y rechazo final en servidor.

Estos ajustes se preparan para revisión. No se incorporan al SHA publicado citado hasta aprobar sus commits y PR.

## Evidencia, límites y seguimiento

La PR web #90 integró #88; las comprobaciones técnicas aprobaron. Mocks y recorridos aislados no acreditan persistencia, correos, cobros o permisos reales. Las historias con «Pendiente» y los informes de fases anteriores (`web/docs/ENTREGA_ACTUAL.md` y `api/docs/ENTREGA_ACTUAL.md`, que aún mencionan Stripe, llenado social o traducción) se conservan como fotografías históricas y no constituyen el inventario actual de código.

- **Indicador `pagado` en correo de confirmación:** en `ConfirmacionReservaService.java` (`dev`), el campo `pagado` de la plantilla aún se calcula por canal (`!RECEPCION`) y no representa una conciliación bancaria del importe aprobado.
- **Vigencia de sesión tras desactivar personal ([API #78](https://github.com/villaserenaguatee/villa-serena-api/issues/78)):** mientras la redacción histórica de `RN-PER-014` permitía que el JWT siguiera válido hasta expirar, `EmpleadoVigente.java` comprueba estado, rol, área y revocación en cada petición. No se debilita ese control.

Seguimiento documental relacionado: docs #39 (flujos/acceso), #40 (catálogo), #37 (fotos), #38 (arquitectura) y #35 (almacenamiento). API #94 es exclusivamente el acuerdo previo del chat avanzado.

Quedan **VALIDACIONES FUTURAS CON BACKEND** ([docs #13](https://github.com/villaserenaguatee/villa-serena-docs/issues/13)): titularidad/permisos entre sesiones, persistencia/concurrencia/idempotencia, SMTP y Outbox, PDF/impresión, archivos públicos/privados y Recurrente Sandbox con webhook/conciliación/retornos/saldo y reembolsos. Sin escrituras reales para preparar esta documentación.
