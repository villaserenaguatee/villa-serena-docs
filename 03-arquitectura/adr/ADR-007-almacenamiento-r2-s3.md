# ADR-007: R2 en desarrollo y S3 en producción; retirada de MinIO

- Estado: decisión aceptada en la sesión de trabajo; implementación y aprovisionamiento sujetos a las PR y comprobaciones enlazadas.
- Fecha: 19 de octubre de 2026.
- Actualiza: almacenamiento de AD-07 y AD-08. No cambia reglas de negocio, permisos funcionales ni contrato HTTP.
- Seguimiento: [API #75](https://github.com/villaserenaguatee/villa-serena-api/issues/75), [docs #35](https://github.com/villaserenaguatee/villa-serena-docs/issues/35), [infra #26](https://github.com/villaserenaguatee/villa-serena-infra/issues/26).

## Decisión

Se retira MinIO de los entornos y de las pruebas automatizadas. Se conserva el AWS SDK S3 existente y la interfaz de archivos privados del API.

| Perfil | Archivos privados | Servicios locales |
|---|---|---|
| `local` | Adaptador persistente en PostgreSQL | API y PostgreSQL; sin dependencia de nube |
| `dev` | Cloudflare R2 remoto, región `auto` | API, PostgreSQL, Mailpit, Prometheus y Grafana |
| `prod` | Amazon S3, región nativa y credenciales temporales del rol EC2 | Infraestructura de producción existente |

Las pruebas locales de integración con almacenamiento real se hacen en `dev`, directamente contra R2 en Cloudflare. `demo` no es un perfil del API. Mailpit permanece como SMTP de pruebas. Ningún perfil carga fixtures SQL automáticamente: Flyway versiona solo el esquema.

Los objetos públicos (fotos y APK) y los privados (facturas/fotos de incidencias) viven en buckets distintos. R2 publica únicamente el bucket público mediante un dominio propio; su bucket privado no tiene acceso anónimo ni dominio público. S3 bloquea el acceso público directo a ambos buckets y sirve los assets públicos mediante CloudFront con Origin Access Control. Los archivos privados siguen usando URLs firmadas del endpoint S3 del proveedor, vigentes por el plazo del API; no se firman contra el dominio de assets públicos.

R2 utiliza credenciales de objetos acotadas al bucket del API, distintas del token administrativo de Terraform y de las credenciales del backend de estado. S3 utiliza el rol EC2 existente, sin crear claves AWS permanentes. El rol solo necesita leer/escribir el bucket privado y comprobar si una clave existe; las eliminaciones de comprobación se limitan al prefijo `_checks/`.

## Consecuencias y comprobaciones

- Desarrollo con archivos remotos requiere Internet y una cuenta R2 configurada; `local` mínimo sigue disponible sin ella. Un API saludable no certifica conectividad con almacenamiento.
- Terraform prepara recursos independientes en `cloudflare/storage` y `aws/storage`, reutilizando proveedores, backend y rol existentes. `validate` no demuestra que un bucket esté creado; se requiere revisar/aplicar el plan y verificar acceso.
- El cliente configura región y endpoint por entorno y deshabilita cargas chunked para compatibilidad R2. Los secretos se mantienen en el backend; no se envían al navegador.
- Las pruebas habituales verifican el contrato HTTP del SDK y la firma sin MinIO ni credenciales reales. Una prueba remota explícita comprueba carga, lectura, URL firmada y rechazo anónimo, y limpia su objeto `_checks/`.
- No se migran ni borran archivos existentes automáticamente. Si se conservan datos de la instalación anterior, se trasladan los objetos manteniendo claves y se revisan las URLs absolutas antes de retirar contenedores o volúmenes.
- R2, S3 y CloudFront están sujetos a las condiciones/consumo del proveedor. No se presupone coste cero ni se aprovisionan recursos por actualizar esta documentación.
- Los backups y el bucket de estado Terraform conservan su configuración independiente; esta decisión no los traslada ni reutiliza sus credenciales para el API.

## Procedimiento

1. Revisa el [checklist de aprovisionamiento de infra](https://github.com/villaserenaguatee/villa-serena-infra/blob/main/docs/ALMACENAMIENTO.md).
2. Configura y arranca el perfil según [ENTORNOS del API](https://github.com/villaserenaguatee/villa-serena-api/blob/dev/docs/ENTORNOS.md).
3. Registra la evidencia remota de cada entorno por separado; las pruebas locales y las PR no acreditan un despliegue de producción.

Fuentes técnicas: [R2 y Java SDK](https://developers.cloudflare.com/r2/examples/aws/aws-sdk-java/), [autenticación R2](https://developers.cloudflare.com/r2/api/tokens/), [credenciales temporales AWS](https://docs.aws.amazon.com/sdk-for-java/latest/developer-guide/credentials-chain.html), [CloudFront OAC](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html).
