# Contrato compartido del API

La fuente de verdad es [villa-serena-docs/openapi.yaml](../openapi.yaml), en formato OpenAPI 3.1. Define el acuerdo entre Spring, la web mediante su BFF, la app y los canales externos. Sus actualizaciones se tramitan mediante issues de **villa-serena-docs** y PR hacia `main`, revisadas con los consumidores afectados.

**El YAML vive únicamente en docs.** API, web y móvil deben eliminar sus copias versionadas de `openapi.yaml` y ajustar scripts, CI e instrucciones para consumir docs. Los tipos TypeScript generados pueden permanecer en cada frontend. Swagger generado por Spring es una exportación de su implementación para contrastarla, no una segunda fuente canónica.

## Procedencia y estado inicial

La base procede de `villa-serena-api`, commit `9396c82`, con nacionalidad opcional ([issue API #55](https://github.com/villaserenaguatee/villa-serena-api/issues/55), [PR #56](https://github.com/villaserenaguatee/villa-serena-api/pull/56)). Contiene **109 rutas y 130 operaciones**. Se conserva la versión `0.2.0-propuesta`; el traslado cambia la ubicación y el proceso de mantenimiento, sin añadir operaciones ni declarar reconciliada toda la implementación.

El contrato acordado, el código implementado y las pruebas de integración son evidencias distintas. Las próximas issues deben reconciliar las omisiones contrastando reglas de producto, DTO, validaciones, permisos y pruebas.

La [reconciliación de inventario (docs #21)](inventario-contrato.md) sustituye las rutas propuestas por producto por GET/POST de `gestion/insumos`, `gestion/compras` y `gestion/movimientos`, según el uso actual de API y web. Compras y repuestos comparten existencias; el documento detalla compatibilidad y adopción pendiente en consumidores.

`MANUAL_CONTRATO_API.pdf` sirvió como referencia histórica. Describe esa base de 130 operaciones y menciona Spring Boot 3 y PostgreSQL 16; el acuerdo actual utiliza Spring Boot 4.1 y PostgreSQL 17. El PDF no sustituye al YAML. Una futura exportación debe identificar el commit del contrato que representa.

## Qué conecta cada pieza

| Pieza | Responsabilidad |
|---|---|
| `docs/openapi.yaml` | Operaciones HTTP, parámetros, encabezados, DTO, errores, autenticación y extensión `x-websocket`. |
| API Spring | Implementar rutas, validación, reglas y permisos; contrastar su OpenAPI generado y sus pruebas con docs. No requiere generar Java desde el YAML. |
| Web Next.js | Generar tipos directamente desde docs. Consumir Spring mediante el BFF con JWT fuera del navegador; relacionar las rutas internas de Next.js con las operaciones de Spring. |
| App Expo | Generar tipos desde la misma revisión de docs. Consumir Spring directamente con JWT en `expo-secure-store`. |
| WebSocket | Respetar tickets, destinos, suscripciones y mensajes de `x-websocket`. Los tipos HTTP no implementan este transporte. |
| Infra | Configurar orígenes, servicios y exposición; las credenciales permanecen fuera del contrato. |

## Instalar y comprobar docs

Se necesitan Node.js 24, pnpm 12 y Git. Desde la raíz de docs:

```bash
pnpm install --frozen-lockfile
pnpm check
pnpm contract:info
```

`pnpm check` valida el contrato, resuelve referencias, comprueba la generación TypeScript y ejecuta las pruebas de las herramientas. El workflow [Contrato API](../.github/workflows/contrato-api.yml) ejecuta estas comprobaciones en PR y cambios de `main`. Las advertencias de lint se distinguen de los errores que bloquean la ejecución.

`contract:info` imprime el commit del checkout, si las herramientas o el contrato tienen cambios locales, y la huella SHA-256 del YAML. Un checkout modificado no representa por sí solo el contenido de su commit.

## Consumir una revisión fija

Cada consumidor debe guardar en `api-contract.json` el repositorio `villaserenaguatee/villa-serena-docs` y el **SHA completo de un commit integrado**, y usarlo tanto en sus scripts como en CI. Por ejemplo:

```json
{
  "repository": "villaserenaguatee/villa-serena-docs",
  "revision": "<SHA completo de 40 caracteres del commit aprobado>"
}
```

El marcador se reemplaza al integrar la migración; no debe llegar como valor ficticio a una implementación. No generar contra `main` cambiante ni descargar el contrato durante una petición de la aplicación. Para actualizarlo se revisa el cambio de contrato y se actualiza deliberadamente esa revisión, los tipos y la implementación afectados.

En local se usa un checkout de docs en esa revisión, con sus dependencias instaladas. Su ubicación es configurable: no se exige una carpeta hermana. La opción `--revision SHA_COMPLETO` comprueba que el checkout corresponda al commit y que el contrato y las herramientas no tengan cambios locales.

## Generar y comprobar tipos TypeScript

La herramienta [scripts/contrato-api.mjs](../scripts/contrato-api.mjs) lee siempre el YAML de docs; no escribe copias YAML en consumidores. Desde docs:

```bash
pnpm contract:types --output RUTA_REPO_WEB/src/lib/api/schema.d.ts
pnpm contract:types --output RUTA_REPO_WEB/src/lib/api/schema.d.ts --check
```

Las rutas de salida son relativas a docs al ejecutar estos comandos, o pueden ser absolutas. Para reproducir una revisión publicada, añade `--revision SHA_COMPLETO`. Se acepta únicamente un archivo `.d.ts`; `--check` devuelve código distinto de cero si falta o difiere y no modifica el archivo. La salida incluye la huella del contrato y no debe editarse manualmente.

En web, la tarea de adopción debe conservar `pnpm generate:api`, pero conectarlo con la herramienta de docs y la revisión de `api-contract.json`. Después corresponde `pnpm check` y las pruebas de los flujos afectados. En móvil se configura un comando equivalente usando su ruta real de tipos; no se verificó ese repositorio porque no hay checkout local.

La generación produce tipos de datos y operaciones. No crea pantallas, llamadas BFF, lógica de negocio ni conexiones WebSocket.

## Comprobar API Spring

La tarea de adopción de API debe exportar el OpenAPI de Spring como JSON o YAML temporal y ejecutar desde docs:

```bash
pnpm contract:api --schema RUTA_OPENAPI_EXPORTADO_POR_SPRING
```

`check-api` compara **rutas y métodos** y falla si faltan operaciones o aparecen operaciones no declaradas. No compara DTO, validaciones, respuestas ni autorización: esas garantías requieren pruebas de conformidad adicionales en API. Las operaciones opcionales o todavía no implementadas deben tratarse explícitamente al reconciliar el alcance; no ocultar diferencias con listas de exclusión generales.

El estado inicial contiene diferencias conocidas, por lo que no se declara que esta comparación ya pase contra Spring. La issue de API debe registrar la evidencia y enlazar las actualizaciones necesarias en docs antes de activar una comprobación obligatoria que el código aún no cumple.

## CI de los consumidores

Las tareas de web y API deben implementar el checkout de docs fijado por `api-contract.json`, instalar sus dependencias con `--frozen-lockfile` y ejecutar la herramienta de esa revisión. En GitHub Actions pueden usarse dos checkouts separados: el consumidor y `villaserenaguatee/villa-serena-docs`. Cada uno conserva su raíz; no se necesita un monorepo ni copiar `openapi.yaml`.

- **Web y móvil:** generación con `--check`, comprobación TypeScript y pruebas de los flujos afectados.
- **API:** exportación temporal de Spring, comparación de operaciones y pruebas de DTO, respuestas y permisos.
- **Docs:** validación, generación y pruebas de herramientas mediante `pnpm check`.

Una PR de docs no cambia automáticamente los consumidores. Sus issues y PR deben registrar la revisión adoptada y los resultados. Si el acceso al repositorio requiere autenticación, usa las credenciales de CI; no guardes tokens en archivos ni URL.

## Actualizar el contrato por issue

La issue de docs describe el comportamiento actual y el esperado, y enlaza la pantalla, historia, regla o evidencia que lo motiva. Debe precisar método y ruta, parámetros y encabezados, campos requeridos u opcionales, valores nulos, respuestas, errores, autenticación, roles, compatibilidad y criterios verificables.

La PR actualiza el YAML y los ejemplos afectados y enlaza las tareas de API, web y móvil. Distingue qué está acordado, implementado y comprobado. Kimberly decide cambios de producto; el equipo coordina los técnicos y Alex facilita la resolución de discrepancias.

Después de integrar en docs, los consumidores actualizan su revisión fijada y regeneran tipos o ajustan su implementación. Los cambios incompatibles requieren coordinación para que contrato y consumidores puedan integrarse sin romper flujos existentes.

## Estado de pago y recuperación por intento

[Docs #25](https://github.com/villaserenaguatee/villa-serena-docs/issues/25) coordina
el cambio con [API #68](https://github.com/villaserenaguatee/villa-serena-api/issues/68).
La implementación ya está integrada en `dev` mediante [API PR #69](https://github.com/villaserenaguatee/villa-serena-api/pull/69).
Se amplía la consulta pública y se añaden la consulta protegida del pago de saldo
y la recuperación por intento. El YAML define sus rutas, encabezados, estados,
acciones, vencimientos, errores y permisos.

Se conservan los campos anteriores, pero cambia la semántica de `puedeReintentar`:
solo es verdadero para sustituir un intento fallido o vencido. Los consumidores
utilizan `accionPago` para iniciar, continuar, esperar, reintentar o no ofrecer
cobro. Un checkout pagado no confirma la reserva hasta el registro local. Una
consulta nunca crea sesiones ni acredita pagos.

La recuperación requiere clave y prueba vigente del correo y borrador originales;
puede renovarse esa prueba. Los intentos históricos sin vínculo de verificación
no habilitan la nueva consulta; mantienen el reenvío idempotente anterior. Un 404
no autoriza generar otra clave ante una creación cuyo resultado se desconoce.
La web conserva el intento antes de enviarlo y mantiene el BFF.

Después de revisar e integrar la PR de docs, API, web y app adoptan deliberadamente
su SHA. Este cambio no actualiza automáticamente el pin del API ni los tipos o
pantallas de los consumidores. El catálogo de ofertas, su creación y el webhook
de Recurrente ya están documentados; el flujo completo de verificación de correo
sigue pendiente en docs #23.

## Diferencias conocidas por reconciliar

### Catálogo y disponibilidad de ofertas (docs #23, primer bloque)

El contrato incluye GET `/api/v1/publico/ofertas` y GET `/api/v1/publico/ofertas/disponibilidad`, usados por la web. Se contrastaron [API `8d6e7e8`](https://github.com/villaserenaguatee/villa-serena-api/tree/8d6e7e8e8cea8847aa45601487bb73f9da6e88ac/src/main/java/com/villaserena/api/reservas) y [web `e6dbb38`](https://github.com/villaserenaguatee/villa-serena-web/blob/e6dbb385b95633cb04a76b57de2ea1bed42a21dd/src/lib/api/public.ts), únicamente en sus revisiones publicadas.

- Catálogo: conserva los nombres actuales (`slug`, `name`, `apiTypeId`, `price`, `bookable`, etc.). `bookable` indica elegibilidad general, no disponibilidad para fechas; las notas editoriales `pendingFeatures` no se publican.
- Disponibilidad: recibe `entrada`, `salida` y `huespedes`. El BFF de web traduce su parámetro interno `numeroHuespedes` a `huespedes` antes de llamar a Spring. Devuelve ofertas con capacidad, cupo del tipo y una habitación elegible libre durante toda la estadía, sin cantidades restantes. Puede devolver una lista vacía.
- La cotización por oferta usa precio fijo por noche, con `temporada: null` y `finDeSemana: false`. No reemplaza la cotización por tipo de `/publico/disponibilidad`. `inventarioCompartido` identifica ofertas sobre un mismo inventario; sus cupos no se suman. La creación vuelve a validar disponibilidad.

API y web no cambian en este bloque. Al adoptar el SHA completo de docs integrado, web puede generar los tipos de estas consultas y API comprobarlas junto con las demás operaciones. La [issue #23](https://github.com/villaserenaguatee/villa-serena-docs/issues/23) continúa abierta para los otros bloques. La lectura del código y la validación del contrato no sustituyen una prueba conectada contra Spring; no se ejecutó ese recorrido aquí. La app no cambia por documentar estas consultas públicas.

### Hora estimada de llegada (docs #22)

[API #57](https://github.com/villaserenaguatee/villa-serena-api/issues/57) y [PR #66, integrada en `dev`](https://github.com/villaserenaguatee/villa-serena-api/pull/66), revisión `01dc12eb004e4a2cc6fd43d4274933e0e9ae50d1`, implementan `horaEstimadaLlegada`. El canónico incorpora ese campo en `ReservaWebPeticion` para POST `/api/v1/publico/reservas` y POST `/api/v1/publico/ofertas/{slug}/reservas`; esta última ruta se declara aquí porque no estaba en la base.

- Entrada opcional y nullable: `"18:30"`, omitida o `null`. Solo `HH:mm` entre `00:00` y `23:59`, hora local `America/Guatemala`; no es un instante UTC y no admite segundos, zona ni cadena vacía. Formato inválido: 400 `DATOS_INVALIDOS`.
- Salida en `ReservaDetalle` autorizado para Recepción, consultado en GET `/api/v1/reservas/{codigo}`: `"18:30"` o `null`. Los demás endpoints de Recepción que reutilizan ese DTO conservan la misma forma. No se agrega a `EstadoReservaPublico`, `ReservaWebCreada`, listados ni DTO de la app; no se amplían permisos.
- Sin valor por defecto ni relleno histórico, e independiente del check-in. Cambiar la hora con la misma `Idempotency-Key` devuelve 409 `BOOKING_REQUEST_CONFLICT`; omitida y `null` conservan la misma huella y los reenvíos históricos.
- La hora opcional no sustituye la verificación de correo existente. Ambas creaciones documentan `Idempotency-Key`, `X-Booking-Draft` y `X-Booking-Email-Verification`; la reconciliación completa del flujo de correo sigue pendiente en el inventario de diferencias de abajo.

**Adopción:** [web #67](https://github.com/villaserenaguatee/villa-serena-web/issues/67) debe generar sus tipos desde el SHA completo de docs integrado, conectar el campo opcional en ambos flujos de reserva y mostrarlo en el detalle de Recepción con la etiqueta **Hora estimada de llegada**, sin inventar una hora cuando sea `null`. API debe adoptar la misma revisión en [API #58](https://github.com/villaserenaguatee/villa-serena-api/issues/58). La app no envía reservas públicas ni consume el detalle exclusivo de Recepción; no requiere una nueva pantalla o campo por esta actualización. Al actualizar sus tipos, conserva sus DTO y permisos actuales. No se ejecutaron las suites de consumidores desde docs.

### Inventario inicial de otras diferencias

Este es un inventario inicial obtenido del [código de API en 9396c82](https://github.com/villaserenaguatee/villa-serena-api/tree/9396c82/src/main/java/com/villaserena/api), no una auditoría exhaustiva ni una lista de cambios ya aprobados. Las próximas issues de docs deben precisar cada actualización.

| Área | Evidencia en el API | Diferencia con la base del contrato |
|---|---|---|
| Verificación de correo de reserva | `VerificacionCorreoReservaController`: `POST /api/v1/publico/correo/{actualizar,solicitar,verificar,estado,google}`. | No se declaran esas operaciones ni sus cuerpos, resultados, caducidad y errores. La existencia de `/google` en el código no significa que siga en el alcance del MVP. |
| Creación de reservas | `PublicoReservasController` y `PublicoOfertasController`: encabezados `X-Booking-Draft` y `X-Booking-Email-Verification`. | Las creaciones normal y por oferta ya declaran sus encabezados; docs #25 añade recuperación por intento. Sigue pendiente el flujo completo de verificación de correo. |
| Contacto público | `ContactoPublicoController`: `POST /api/v1/publico/contacto` con `Idempotency-Key`; `GET /api/v1/publico/contacto/{id}`. | Faltan operaciones, estados, esquema de petición y respuestas. |
| Recuperación del personal | `RecuperacionPersonalController`: `POST /api/v1/app/acceso/recuperacion/solicitar` y `/confirmar`. | Faltan operaciones, DTO, validación y respuestas. La ruta contiene `app` aunque el controlador atiende al personal; debe documentarse el comportamiento verificado. |
| País emisor de pasaporte | `HuespedDatos.paisEmisorPasaporte`, validación y migración V21. | Falta el campo y su condición de obligatoriedad en el esquema. Debe acordarse con la simplificación del MVP antes de actualizarlo. |
| Nacionalidad | API #55 / PR #56 ya integradas en `dev`. | El canónico incluye el cambio; al revisar, la copia de la web aún exigía nacionalidad. Eliminar la copia YAML y generar tipos desde docs en la tarea de adopción de web. |
| Pagos | [ADR-017](adr/ADR-017-pasarela-recurrente.md) acuerda Recurrente; la base del contrato aún describe Stripe. | Reconciliar rutas, firmas, DTO y transición con la implementación de pagos, sin sustituir nombres a ciegas. |

### Fotos de tipos de habitación con S3 y CloudFront (docs #37)

El flujo de galería de tipos de habitación (`HU-ADM-03`) utiliza dos operaciones del contrato canónico:
- `POST /api/v1/archivos/imagenes` (`multipart/form-data`, `uso=TIPO_HABITACION`, exclusivo `ADMIN`, `JPG`/`PNG` reales hasta 5 MiB): escribe el objeto bajo `tipos/` en el bucket público de assets y devuelve `ImagenSubida` (`{ clave }`).
- `PUT /api/v1/admin/tipos-habitacion/{id}/fotos` (`FotosTipoPeticion`, exclusivo `ADMIN`): valida las claves bajo `tipos/`, exige exactamente una foto con `principal: true`, guarda el orden y devuelve `TipoHabitacionAdmin` con `FotoCatalogo[]` (`clave`, `url`, `principal`, `orden`).

Se actualizaron los ejemplos de este flujo en [`openapi.yaml`](../openapi.yaml) para usar el dominio CDN (`https://d13s29erv78l4g.cloudfront.net/tipos/...`) en lugar de `localhost:9000` / MinIO, conservando intactos los esquemas y nombres de campos. El estado por componente (infraestructura AWS + política IAM `tipos/*` verificadas; implementación en [API #82](https://github.com/villaserenaguatee/villa-serena-api/issues/82) e integración en [web #69](https://github.com/villaserenaguatee/villa-serena-web/issues/69) pendientes) y el checklist de verificación están en la [guía operativa de fotos de tipos de habitación](../04-guias-y-referencia/fotos-tipos-habitacion.md).

Los documentos de `04-guias-y-referencia/historico` e `historial-prompts` conservan referencias antiguas al contrato en API como parte del historial. Para trabajo nuevo se aplica esta guía y el YAML de docs.
