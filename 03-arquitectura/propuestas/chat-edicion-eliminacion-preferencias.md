# Chat: edición, eliminación y preferencias — API #94

**Estado: propuesta pendiente de aprobación.** Este documento define una alternativa concreta para revisar con producto, API, web y móvil. No constituye un acuerdo del equipo, no habilita funcionalidades y no modifica `openapi.yaml`. La issue [API #94](https://github.com/villaserenaguatee/villa-serena-api/issues/94) permanece abierta hasta registrar las decisiones y su aprobación explícita.

## Evidencia y compatibilidad

Revisión: API `a95533224288f0dd0f01decea0ae1a94694f8328`, `EstanciaComunicacionController` y migración V11; docs `2ffcc9c`, contrato canónico y propuesta `contratos-web-pendientes.md`.

Actualmente GET/POST de `/api/v1/app/reservas/{codigo}/chat` y `/api/v1/estancias/{codigo}/chat` consultan/envían mensajes. La lectura devuelve `id, autor, texto, creadoEn`; `autor` es HUESPED o RECEPCION, no la identidad del empleado. El envío recibe `clave` UUID y `texto` no vacío de hasta 2000 caracteres, recorta extremos y exige EN_ESTADIA. Deduplica por reserva, clase de autor, identidad y clave; reutilizar la clave con otro texto genera `CLAVE_REUTILIZADA`. Una repetición ya registrada se devuelve incluso después de cerrar la estancia. Estas condiciones se conservan.

El controlador admite ambos roles en ambas familias de rutas; el huésped se restringe a sus reservas. La lectura no exige EN_ESTADIA. Hay `author_id` persistido, pero no versión, fechas de edición/eliminación ni preferencias. Es evidencia de implementación, no aprobación del acceso histórico ni de las rutas cruzadas entre roles.

La web conectada usa `src/components/common/EstanciaChat.tsx` y las listas permitidas del BFF; sus controles preparados y el almacenamiento local de las vistas de demostración no acreditan persistencia del API. Las operaciones de chat básico aún requieren reconciliación con el contrato canónico. No se generarán tipos ni se cambiará `api-contract.json` por esta propuesta.

## Decisiones para producto y consumidores

Cada fila necesita una decisión explícita; las recomendaciones siguientes no son reglas vigentes.

| Tema | Propuesta para revisar | Confirmación pendiente |
|---|---|---|
| Edición | Solo autor real, durante EN_ESTADIA, sin plazo adicional; texto recortado de 1 a 2000 caracteres. No editar mensajes eliminados. | Kimberly confirma ventana y límites; API/web/móvil revisan viabilidad. |
| Eliminación | Solo autor real, durante EN_ESTADIA; eliminación lógica compartida con marcador «Mensaje eliminado». No borrar conversación ni ofrecer moderación por rol. | Confirmar alcance compartido y si se necesita moderación en otra tarea. |
| Historial | Conservar trazabilidad de actor, instante y versión; texto original y revisiones quedan fuera del DTO público. No añadir registro del texto en logs. | Producto/equipo responsable acuerdan necesidad, acceso, retención y purga del texto antes de implementar. No se propone retención ilimitada. |
| Preferencias | Favorita, archivada y fijada, independientes y personales, inicialmente falsas. Archivar no elimina ni cierra; fijar no altera la vista de otros. No carpetas arbitrarias ni límite de fijadas en esta alternativa. | Aprobar cada preferencia, independencia y límites. |
| Nuevo mensaje | No desarchiva automáticamente ni cambia favoritas/fijadas. | Confirmar comportamiento de bandejas. |
| Acceso | Huésped titular de la reserva; Recepción autenticada con acceso vigente. Mutaciones de mensajes solo EN_ESTADIA. Lectura y preferencias conservan el acceso de consulta aprobado. | Confirmar acceso histórico, expiración y si ambas familias deben limitarse a su rol; no ampliarlo por inferencia. |
| Actualización entre participantes | Tras éxito, invalidar/refrescar consulta; sondeo como mecanismo inicial, sin inventar destinos WebSocket. | Acordar intervalo y latencia aceptable con web/móvil; tiempo real requiere contrato separado si se exige. |

Kimberly decide comportamiento y aceptación; backend propone garantías; web y móvil revisan recorridos/consumo. Alex facilita desacuerdos. No se asignan desarrolladores unilateralmente ni se presume aprobación por silencio.

## DTO propuestos para revisión

Los nombres son candidatos de esquema, sin rutas HTTP nuevas aprobadas. Las operaciones concretas, métodos, encabezados y códigos finales se incorporarán en una PR posterior de OpenAPI, después de resolver la tabla anterior.

| DTO | Campos y restricciones propuestos |
|---|---|
| MensajeChat | Campos existentes `id, autor, texto, creadoEn`; añadir `version` entero >= 1, `esPropio`, `puedeEditar`, `puedeEliminar` booleanos, `editadoEn` y `eliminadoEn` como instante UTC o null. `texto` sigue siendo string; para un eliminado devuelve «Mensaje eliminado», nunca el texto anterior. No expone `author_id`. |
| EditarMensajeChatPeticion | `texto` string recortado de 1 a 2000, `versionEsperada` entero >= 1 y `clave` UUID de operación. No admite autor, rol, permisos ni reserva en el cuerpo como fuente de autorización. |
| EliminarMensajeChatPeticion | `versionEsperada` entero >= 1 y `clave` UUID de operación. No eliminación física ni texto nuevo. |
| PreferenciasChat | `favorita`, `archivada`, `fijada` booleanos, `version` entero >= 0 y `actualizadoEn` instante UTC o null. Ausencia de fila representa todos false, versión 0 y fecha null. |
| GuardarPreferenciasChatPeticion | Los tres booleanos explícitos, `versionEsperada` entero >= 0 y `clave` UUID. Estado completo, evitando ambigüedad de null/campo omitido. |

El servidor calcula `esPropio` comparando clase de principal e ID autenticados con el autor persistido, y los permisos con acceso, titularidad, estado y eliminación. Dos empleados RECEPCION no comparten autoría; IDs numéricos iguales de un huésped y un empleado tampoco. El rol o un booleano enviado por el cliente nunca autoriza una mutación. Los permisos del DTO orientan la interfaz, pero cada escritura se revalida en el servidor.

Los campos anteriores son aditivos; se conserva el array de lectura, orden por ID, envío básico y su respuesta existente. Consumidores antiguos verán el marcador eliminado como texto; hay que verificar ese comportamiento con ambas interfaces antes de publicar. La web preparada usa `puedeModificar`, `eliminado` y `version` en su petición de edición; no coincide con todos los nombres propuestos aquí y su eliminación preparada no envía versión ni clave. Esas llamadas no se habilitarán por agregar campos al API: antes hay que adaptar conjuntamente DTO, BFF y componente al contrato que se apruebe. La consulta del mensaje y la respuesta de cada cambio deben representar la misma versión. No introducir paginación o envoltorios incompatibles como parte de esta tarea.

## Concurrencia, errores y reintentos propuestos

- Mensajes: actualización atómica condicionada por reserva, mensaje, autor autenticado, estado vigente y versión. Cada cambio efectivo incrementa versión; un texto idéntico o preferencias idénticas puede devolver la representación actual sin incrementarla si coincide la versión esperada. El check-out concurrente debe serializarse con la mutación para impedir cambios después del cierre.
- Preferencias: unicidad por reserva, clase de principal e ID. Cambios en dos dispositivos del mismo usuario compiten por su versión; otro empleado o huésped tiene una fila independiente. Resolver atómicamente también la creación desde versión 0.
- Clave de operación: deduplicación por principal, reserva, operación y recurso; guardar huella de payload y resultado en la misma transacción. Repetir exactamente devuelve el resultado original sin otra edición ni auditoría. Misma clave y distinto payload produce 409 `CLAVE_REUTILIZADA`. Revisar la deduplicación antes de comparar versión en un reintento, pero después de autenticar y verificar acceso vigente; revocar acceso impide recuperar el resultado. Acordar retención de claves con el equipo antes de fijar garantía temporal.
- Tras timeout, reintentar con la misma clave y payload. Tras conflicto de versión, consultar, mostrar cambios y pedir al usuario decidir; nunca sobrescribir automáticamente. Una nueva intención usa nueva clave y versión actual.
- Errores conservan `{codigo,mensaje,detalles}` en español: 400 `DATOS_INVALIDOS`; 401 sin sesión; 403 sin rol permitido o autor ajeno con acceso a la conversación; 404 para reserva inaccesible/recurso inexistente o mensaje que no pertenece a ella; 409 `VERSION_CONFLICTO`, `CHAT_CERRADO`, `MENSAJE_ELIMINADO` o `CLAVE_REUTILIZADA`. Son códigos candidatos, sujetos a aprobación. No devolver el contenido de un recurso ajeno en un error.
- Una segunda eliminación con nueva clave/versión obsoleta genera conflicto; el reintento de la misma eliminación confirmada conserva su resultado. Los cambios y su auditoría deben confirmar o revertirse juntos.

## Casos de aceptación para las tareas posteriores

| Caso | Resultado esperado de la propuesta |
|---|---|
| Autor edita durante estancia | Cambia texto, incrementa versión y marca `editadoEn`; ambos participantes ven la misma versión tras refrescar. |
| Autor elimina | Ambos ven marcador sin texto previo; no se cambia el resto de la conversación. |
| Huésped intenta modificar mensaje de Recepción | 403; sin cambio ni filtración de texto histórico. |
| Otro empleado del mismo rol intenta modificar | Permisos false y 403, aunque pueda consultar esa conversación. |
| IDs iguales entre clases de principal | No confieren autoría. |
| Huésped de otra reserva o mensaje de otra conversación | 404; no lectura, modificación ni preferencias ajenas. |
| Usuario sin sesión/rol | 401/403 según autenticación y autorización, sin cambios. |
| Dos ediciones con misma versión | Solo una confirma; la otra recibe 409 y debe consultar. |
| Eliminación compite con edición | Solo una confirma; no reaparece texto eliminado por una escritura obsoleta. |
| Cambio compite con check-out | Se respeta el orden transaccional; no escritura posterior al cierre. |
| Timeout tras confirmar y reintento idéntico | Mismo resultado, sin doble versión/auditoría; clave con payload distinto da 409. |
| Preferencias en dos sesiones del mismo usuario | Persisten tras nueva sesión y se comparten entre sus dispositivos; conflicto si actualizan la misma versión. |
| Preferencias de dos empleados | Una favorita/archivada/fijada no cambia la del otro ni borra mensajes compartidos. |
| Primera escritura concurrente de preferencias | Una crea versión 1; la otra recibe conflicto, sin duplicados. |
| Compatibilidad | GET/POST existentes mantienen formato y deduplicación; cliente sin permisos nuevos no muestra acciones de modificación. |
| Estancia cerrada | Rechaza nuevas mutaciones de mensaje; lectura/preferencias se prueban según el acceso histórico que se apruebe. |

## Secuencia de aprobación e implementación

1. Revisar la tabla de decisiones y registrar en API #94 cada acuerdo, participante, referencia y fecha. Cualquier desacuerdo queda visible; publicar esta propuesta no satisface el criterio de acuerdo explícito.
2. Una vez aprobado el comportamiento, preparar issue/PR en docs con operaciones, métodos, DTO, errores, autenticación, idempotencia y compatibilidad exactos. Reconciliar el chat básico; coordinar con [API #58](https://github.com/villaserenaguatee/villa-serena-api/issues/58). No copiar OpenAPI a consumidores.
3. Tras aprobación e integración del contrato, fijar su SHA en consumidores y crear tareas de backend (migración nueva, reglas, permisos, auditoría, concurrencia e idempotencia), web (BFF, permisos, conflictos y refresco) y móvil (tipos, sesión, persistencia y refresco). Coordinar versión Flyway; no modificar V11 aplicada.
4. Ejecutar los casos anteriores en integración con PostgreSQL y pruebas de contrato, y comprobar dos empleados y huésped en sesiones reales. Pruebas de documentación no acreditan esas verificaciones.

La #94 puede cerrarse cuando existan acuerdos explícitos y un contrato aprobado con seguimientos de implementación. Este documento por sí solo no cumple esas condiciones. No se han implementado edición, eliminación ni preferencias por su publicación.
