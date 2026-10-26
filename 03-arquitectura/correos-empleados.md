# Correos de empleados: ampliación compatible

`correo` sigue siendo el identificador laboral único (sin distinguir mayúsculas), utilizado por autenticación y recuperación. No cambia de nombre ni se modifica en PATCH.

`correoPersonal` es un contacto opcional, nullable, de hasta 150 caracteres y formato email. No es único: varios empleados pueden compartir contacto. No participa en login, recuperación, roles ni tokens.

- POST /api/v1/admin/empleados: admite correoPersonal omitido o null.
- GET /api/v1/admin/empleados: devuelve correoPersonal (null para históricos).
- PATCH /api/v1/admin/empleados/{id}: omitir conserva, null elimina, cadena válida actualiza. Vacío no es un email válido.
- Los permisos ADMIN y la contraseña temporal de una sola visualización permanecen iguales.

## Migración y despliegue

Migración Flyway aditiva V33: nueva columna employees.personal_email nullable; sin copiar correo ni actualizar filas existentes. Conservar IDs, hashes, estados, roles, especialidades y sesiones. Aplicar primero API/migración compatible y después web. Los clientes anteriores pueden seguir enviando exactamente el mismo DTO.

El cambio de correo laboral queda fuera de esta ampliación: no crear otra cuenta ni reutilizar el correo personal. Requiere una operación futura explícita, auditoría, unicidad y política de sesiones aprobadas. El flujo histórico de correcciones laborales sigue siendo independiente y no se modifica aquí.

La web fija el SHA de esta PR y regenera tipos con las herramientas canónicas. Debe coordinarse con móvil antes de volver obligatorio un campo de respuesta; por compatibilidad correoPersonal permanece opcional en el contrato.

No se ejecutan migraciones ni altas en producción durante la preparación. Validar históricos con null, creación, actualización/borrado y login exclusivamente laboral en PostgreSQL aislado antes de desplegar.
