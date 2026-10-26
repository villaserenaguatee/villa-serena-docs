# Galería del hotel

Contrato de Docs #56 para API #113 y Web #99. Depende de la inicialización de Docs #55. No autoriza operaciones de producción.

## Operaciones y propiedad

Se reutilizan `POST /api/v1/archivos/imagenes?uso=HOTEL`, `GET /api/v1/admin/hotel`, `PUT /api/v1/admin/hotel` y la lectura pública del hotel. No se introduce una ruta paralela de galería ni un endpoint de borrado físico.

Solo ADMIN puede cargar y asociar imágenes HOTEL. El servidor genera claves `hotel/{uuid}.jpg` o `.png` en el bucket público. Comprueba JPG/PNG decodificable, hasta 5 MiB y 16 millones de píxeles como protección de memoria. No confía en extensión ni MIME del navegador. Los otros usos mantienen sus permisos y validaciones.

La galería contiene claves y orden; la lectura pública devuelve las URL usando la configuración del almacenamiento. La primera imagen por orden es la portada; no se agrega un campo de fotografía principal. No se introduce un cupo de fotografías que el modelo actual no define.

Las referencias existentes se conservan, incluso si sus nombres históricos no usan UUID. Una clave nueva debe pertenecer a HOTEL, existir en almacenamiento público y no contener rutas privadas, navegación de directorios ni URL arbitrarias. Las claves y los órdenes nuevos no se duplican. No se modifica el catálogo de habitaciones, menú, amenidades o incidencias.

## Concurrencia y compatibilidad

GET administrativo devuelve un `ETag` fuerte calculado a partir de la galería consultada, sin datos fiscales. El consumidor conserva las comillas. Para cambiar claves u orden, envía ese valor en `If-Match` al PUT. La comparación y sustitución SQL se serializan bloqueando la configuración del hotel.

Si falta la revisión o está obsoleta, se devuelve 409 `GALERIA_CAMBIADA`: actualizar la galería y revisar los cambios. No se guarda parcialmente ningún dato ni se pierde la galería vigente. Una lista equivalente no es un cambio y no exige revisión, aunque se haya enviado en otro orden de JSON.

Los nueve campos generales/fiscales del PUT conservan sus reglas. Se permite omitir `fotos` para guardar esos datos sin alterar la galería ni exigir revisión; `null` sigue siendo inválido. Los clientes antiguos que envían las mismas fotos siguen funcionando. Un cliente antiguo que envía una galería diferente u obsoleta recibe conflicto y debe actualizarse, en lugar de sobrescribir fotografías.

Web #99 debe propagar ETag por el BFF y adoptar If-Match antes de habilitar cambios de fotos. Los formularios generales/fiscales pueden omitir fotos. No se modifica la Web en esta etapa de backend.

## Fallos y retirada

La subida y la asociación SQL son operaciones diferentes. Si falla una subida, no se informa éxito ni se cambia la galería. Si la asociación falla, las referencias anteriores permanecen y el cliente conserva las claves ya subidas para reintentar después de revisar el conflicto. No se promete una transacción distribuida entre S3/R2 y PostgreSQL.

Reemplazar sube una clave nueva y cambia la asociación. Quitar retira la asociación; una lista vacía retira todas. No elimina físicamente objetos, que podrían estar referenciados por contenido publicado o histórico. Los objetos huérfanos se identificarían para limpieza posterior mediante un procedimiento separado, autorizado y con verificación de referencias; no se implementa borrado automático.

## Almacenamiento y verificación

Se reutiliza AlmacenS3: R2 en desarrollo y S3 en producción, conforme a ADR-007. El entorno necesita bucket público, URL pública y permisos de escritura/consulta para `hotel/*`; tener permisos sobre `tipos/*` no acredita esos permisos. Credenciales y cambios de infraestructura quedan fuera del código.

Pruebas: formato real, tamaño, dimensiones, ADMIN/401/403, existencia y pertenencia de claves, equivalencia, orden, retirada, revisión ausente/obsoleta, dos escritores, fallo de almacenamiento, rollback fiscal y nueva consulta pública/administrativa. PostgreSQL temporal y adaptador de almacenamiento de pruebas no acreditan permisos remotos; la prueba R2/S3 requiere un entorno y autorización específicos.
