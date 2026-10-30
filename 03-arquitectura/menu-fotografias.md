# Fotografías administrativas del menú

ItemMenuAdmin añade fotoUrl opcional y nullable: URL pública resuelta con ARCHIVOS_URL_PUBLICA y la fotoClave registrada, o null si no existe. GET listado/detalle y respuestas de creación/edición/estado incluyen el campo cuando el API actualizado está disponible. No cambia permisos ADMIN, endpoints, fotoClave, archivos ni registros. Consumidores anteriores ignoran el campo; la nueva Web tolera su ausencia, pero recuperar la imagen requiere el API actualizado.

La carga existente usa POST /api/v1/archivos/imagenes (multipart archivo, uso MENU), JPG/PNG hasta 5 MiB; la asociación sigue en POST/PATCH de productos. Activar/desactivar y reactivar disponibilidad son operaciones independientes. No se añaden endpoints ni migraciones.

Orden propuesto: revisar/integrar contrato, API compatible, desplegar API con autorización, luego Web. No se autoriza integración o despliegue en esta tarea.
