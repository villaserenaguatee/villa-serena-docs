# Operaciones web existentes sin contrato integral — propuesta para revisión

**Estado: propuesta, no aprobada.** Inventario observado en API main `fd18b07386692802859525b0f4da2dfa70cb32d5` y web main `e0587c3013dbea7c68c494c4dd4329b37db720eb`. No modifica OpenAPI ni autoriza endpoints nuevos. Las rutas observadas se registran como evidencia técnica, no como contrato acordado.

## Operaciones observadas que requieren reconciliación

| Área | Rutas/familia observada | Datos/estados y permisos observados | Acuerdo pendiente |
|---|---|---|---|
| Verificación previa | POST `/api/v1/publico/correo/solicitar`, `/verificar`, `/estado`, `/actualizar` (últimos segmentos bajo `/api/v1/publico/correo`) | Comprobante asociado al correo/borrador; distinto de OTP de acceso | Revisar controladores/DTO de envío y validación; reconciliar con los encabezados canónicos ya incluidos. No inventar nombres o plazos nuevos. |
| Chat básico | GET/POST `/api/v1/app/reservas/{codigo}/chat` y `/api/v1/estancias/{codigo}/chat` | Mensaje `{clave,texto}`; lectura `id,autor,texto,creadoEn`; HUESPED propio/RECEPCION | Esquemas, límites, historial y acceso; chat avanzado se acuerda en API #94 antes de implementar. El rol RECEPCION no demuestra autoría individual. |
| Documentos | GET/POST de documentos del huésped, GET de metadatos/archivo y revisión de Recepción | Carga con clave, nombre y base64; JPG/PNG/PDF; autorización por reserva | Publicar DTO/errores/estados exactos tras revisión del controlador, tamaños y reglas de revisión. No eliminar PDF ni confundir revisión con check-in. |
| Objetos olvidados | Familia `/api/v1/objetos` y variante de Limpieza existente | Descripción/habitación/foto y revisión/envío/aviso/devolución; permisos por rol | Formalizar DTO, estados, destinatarios, autorización de foto y tratamiento de correo incierto sin duplicarlo. No deducirlos de botones o plantillas. |
| Perfil del huésped | GET `/api/v1/app/perfil` | Datos autorizados del principal; no permite editar permisos | Conciliar lectura histórica, datos minimizados y esquemas de perfil; no introducir PATCH por analogía. |
| Laboral | `/api/v1/laboral/perfil`, asistencia, correcciones y nóminas propias/ADMIN | Identidad real y perfil laboral; nómina calculada no es transferencia; solicitud no es cambio de cuenta | Revisar DTO y versiones/idempotencia existentes antes de proponerlos. Conservar la separación de cuentas oficiales y datos laborales. |
| Gestión ampliada | `/api/v1/gestion/{tipo}` para activos/preventivos/órdenes/gastos y servicios operativos existentes | Envoltorio id/clave/version/datos y auditoría; permisos dependen de recurso | Inventariar cada DTO y transición con pruebas; insumos/compras/movimientos ya son canónicos y no se vuelven a inventar. |
| Catálogos legacy | `/api/v1/admin/catalogos/tipos`, habitaciones, personal y temporadas | Datos básicos y perfiles versionados existentes | Plan de compatibilidad con operaciones canónicas: API #58/#82/#83/#84 y #92, sin sustituir datos ni respuestas silenciosamente. |

## No confundir propuesta con implementación

- API #88–#93 cubren operaciones canónicas ya aprobadas, aún ausentes en el backend inspeccionado; no requieren inventar DTO adicionales desde web.
- Publicación de ofertas, superficie/camas/características y fuente de precio requieren acuerdo de API #83/docs #40. Un campo deshabilitado no autoriza su persistencia ni una ruta nueva.
- Cambiar la hora desde alta de Recepción necesita ampliar expresamente `ReservaRecepcionPeticion`; la llegada pública y su detalle ya están en el contrato.
- No convertir el simulador local de canal en integración acreditada: HU-CM-03 requiere el API real y la operación administrativa sigue pendiente.

## Criterios para una futura propuesta de OpenAPI

1. Referenciar versión de controlador/DTO/validaciones/seguridad y consumidores; verificar límites, errores y respuesta real.
2. Acordar lo requerido por producto frente al comportamiento observado; un hecho del código no aprueba una regla de negocio nueva.
3. Separar titulares, roles y áreas, acceso histórico y estancia activa; evitar filtrar datos personales innecesarios.
4. Conservar idempotencia, concurrencia, archivos privados e históricos; definir compatibilidad con consumidores antiguos.
5. Presentar el cambio al contrato en revisión independiente y, solo tras aprobación e integración, fijar su nuevo SHA y regenerar consumidores.

No se crearon ni modificaron issues durante esta preparación local; el seguimiento existente permanece intacto.
