# Inicialización segura del hotel

Propuesta local para Docs #55, API #112 y Web #98. Pendiente de revisión; no autoriza inicialización ni despliegue en producción.

## Contrato

`POST /api/v1/admin/hotel/inicializacion` requiere ADMIN y nueve campos generales/fiscales reales, sin fotografías, horarios, políticas ni series. Se recortan espacios y se normaliza el NIT con dígito verificador; CF no es válido para el emisor.

- 201: insertó únicamente `hotel_configuration.id=1`.
- 200: los nueve campos normalizados coinciden con la fila existente; no modifica nada.
- 409 `HOTEL_YA_CONFIGURADO`: existe con datos distintos; nunca sobrescribe ni reintenta mediante PUT.
- 400: validación o campos extra; 401/403: autenticación/autorización.

La idempotencia es natural, sin Idempotency-Key adicional. Dos peticiones concurrentes usan la misma clave única: una crea y la otra obtiene repetición o conflicto. Si el hotel se editó después, repetir el formulario inicial puede devolver 409; no debe deshacer esa edición. Las fotos existentes no participan en la comparación ni se modifican.

GET administrativo y público conservan 404 `HOTEL_NO_CONFIGURADO` cuando falta el registro. PUT pasa a actualizar únicamente una configuración existente, con el DTO completo anterior; si falta devuelve 404. Este ajuste explícito impide inicializar por la ruta de actualización. Configurar el hotel no aprovisiona ni reinicia series.

## Conservación y compatibilidad

Inicializar no modifica `hotel_photos`, `invoice_series`, `invoices`, habitaciones, cuentas, empleados, reservas ni pagos. PUT conserva su actualización autorizada de datos y asociaciones fotográficas para un hotel existente, pero no tiene efectos en series/correlativos. Las facturas emitidas conservan sus datos fiscales.

La serie se aprovisiona por separado. Si falta, la facturación puede seguir respondiendo `SERIE_NO_CONFIGURADA`: no se oculta ni se crea una serie desde esta operación. No se modifica el almacenamiento ni la carga HOTEL.

No requiere migración: la tabla y su clave única/restricción id=1 ya existen. No modificar migraciones aplicadas ni insertar datos de hotel ficticios en producción.

## Interfaz y operación segura

1. Verificar versión y entorno autorizado; consultar configuración sin escritura. Solo el 404 con código HOTEL_NO_CONFIGURADO habilita ofrecer inicialización. Conexión fallida, 401/403 o JSON inválido no la habilitan.
2. Mantener vista previa consultable y guardado normal bloqueado. El responsable introduce los datos genuinos aprobados, abre deliberadamente el formulario y confirma su inicialización. Ningún ejemplo del contrato rellena el formulario.
3. El BFF conserva la sesión del personal en servidor. Bloquear envíos duplicados; conservar campos ante error o resultado incierto.
4. Tras 200/201, validar la respuesta y volver a consultar; no anunciar éxito por estado local. Ante 409, ofrecer consultar la configuración vigente sin sobrescribirla.
5. Comprobar lectura administrativa/pública y conservación exacta de fotografías, facturas y series en un entorno de pruebas autorizado.

## Pruebas y adopción

PostgreSQL real aislado: ausencia, repetición normalizada, existencia con datos distintos, concurrencia igual/distinta, permisos, validación y campos extra. Comparar fotos/series/facturas antes y después, incluidas tablas vacías. PUT no inicializa; sus actualizaciones conservan facturas y numeración.

Los consumidores deben fijar el SHA completo del commit de Docs que incorpora este contrato en sus manifiestos `api-contract.json`, regenerar tipos mediante las herramientas oficiales y ejecutar las comprobaciones con `--revision`. No generar contra una rama cambiante ni usar una huella de contenido como sustituto del commit.

Orden de adopción: revisión del contrato → commit de Docs → actualización de manifiestos y tipos en API/Web → pruebas locales → publicación autorizada de las ramas y PR independientes. No mezclar correos ni rediseño administrativo en estas PR. La aprobación del código no autoriza inicializar producción.
