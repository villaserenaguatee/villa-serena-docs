# Flujo ADMIN de fotos de tipos de habitación con S3, R2 y CloudFront

Esta guía documenta el flujo operativo y contractual de fotografías del catálogo de tipos de habitación:

`ADMIN → web/BFF → API → almacenamiento de assets (R2 en dev / S3 en prod) → CDN (CloudFront)`

Complementa la decisión de almacenamiento sin MinIO ([docs #35](https://github.com/villaserenaguatee/villa-serena-docs/issues/35) / [PR #36](https://github.com/villaserenaguatee/villa-serena-docs/pull/36)) y la guía de infraestructura en [`villa-serena-infra/docs/ALMACENAMIENTO.md`](https://github.com/villaserenaguatee/villa-serena-infra/blob/main/docs/ALMACENAMIENTO.md).

---

## 1. Estado verificado frente a pendientes

Tener un CDN activo y fotos prepublicadas **no acredita que el recorrido de carga y asociación desde Administración esté operativo**. Se distingue explícitamente cada pieza:

| Pieza | Estado actual | Evidencia / seguimiento |
|---|---|---|
| **Infraestructura AWS S3 + CloudFront** | **Verificada** | Bucket público de assets `villa-serena-prod-public-291723764646-us-east-1`, bucket privado `villa-serena-prod-private-291723764646-us-east-1` y distribución CloudFront `E1ZDTM6THJAMS0` (`https://d13s29erv78l4g.cloudfront.net`) aprovisionados ([infra #26](https://github.com/villaserenaguatee/villa-serena-infra/issues/26) / [PR #27](https://github.com/villaserenaguatee/villa-serena-infra/pull/27)). Se publicaron 17 fotos en `images/catalogo-aprobado/` con respuesta `200` por CDN y `403` anónimo directo en S3. |
| **Permisos IAM del rol EC2 para `tipos/*`** | **Aplicados y verificados** | Política `villa-serena-api-room-type-photos` sobre `villa-serena-prod-ec2-role` ([infra #28](https://github.com/villaserenaguatee/villa-serena-infra/issues/28) / [PR #29](https://github.com/villaserenaguatee/villa-serena-infra/pull/29)): permite únicamente `s3:GetObject` y `s3:PutObject` en `BUCKET_PUBLICO/tipos/*`. Pasaron 14 comprobaciones en IAM Simulator y el plan posterior quedó sin cambios. |
| **Contrato OpenAPI (`openapi.yaml`)** | **Definido** | Declara `POST /api/v1/archivos/imagenes` (`uso=TIPO_HABITACION`) y `PUT /api/v1/admin/tipos-habitacion/{id}/fotos` con `ImagenSubida`, `FotoTipoPeticion`, `FotosTipoPeticion` y `FotoCatalogo`. |
| **Backend: carga `TIPO_HABITACION` y asociación en el tipo** | **Pendiente de implementación** | El API actual solo admite `uso=INCIDENCIA` en `/api/v1/archivos/imagenes` ([API PR #76](https://github.com/villaserenaguatee/villa-serena-api/pull/76)). La subida bajo `tipos/*`, validación de claves y persistencia de la galería corresponden a [API #82](https://github.com/villaserenaguatee/villa-serena-api/issues/82) (y coordinación con [API #83](https://github.com/villaserenaguatee/villa-serena-api/issues/83)). |
| **Web: carga/asociación en Administración y migración de referencias** | **Pendiente de integración** | Sustituir referencias locales (`/images/catalogo-aprobado/...` / Unsplash) y conectar la subida y asociación en el panel de `ADMIN` corresponde a [web #69](https://github.com/villaserenaguatee/villa-serena-web/issues/69). |

---

## 2. Rol, módulo y propiedad de las fotos

- **Rol exclusivo de escritura:** `ADMIN`, en **Administración → Catálogos → Tipos de habitación** ([HU-ADM-03](../02-producto/historias-de-usuario/HU%20-%20Administrador.md#hu-adm-03--gestionar-tipos-de-habitación), [RN-HAB-009](../02-producto/reglas-de-negocio.md#4-habitaciones--rn-hab)).
- **Entidad propietaria de la galería:** el **tipo de habitación** (`room_types` / `room_type_photos`).
- **Habitaciones físicas ([HU-ADM-04](../02-producto/historias-de-usuario/HU%20-%20Administrador.md#hu-adm-04--gestionar-habitaciones)):** registran número, piso y tipo activo (`RN-HAB-011`) y **reutilizan la galería fotográfica de su tipo**. No se amplía el modelo a fotos por unidad física sin un acuerdo previo de producto.
- **Lectura pública:** las páginas públicas y de disponibilidad consumen únicamente URLs HTTPS públicas construidas con `ARCHIVOS_URL_PUBLICA` + `/` + `clave` (por ejemplo, `https://d13s29erv78l4g.cloudfront.net/tipos/suite-demo.jpg`). El navegador nunca recibe credenciales AWS/R2 ni nombres de buckets.

---

## 3. Secuencia de operaciones y contrato OpenAPI

Subir un archivo y asociarlo a la galería de un tipo son **dos operaciones separadas**:

```mermaid
sequenceDiagram
  actor A as ADMIN
  participant W as Web / BFF (Next.js)
  participant S as API Spring
  participant B as Bucket público (R2 dev / S3 prod)
  participant D as PostgreSQL
  participant C as CDN / Dominio público

  A->>W: 1. Selecciona imagen JPG/PNG (<= 5 MiB)
  W->>S: POST /api/v1/archivos/imagenes (multipart: archivo, uso=TIPO_HABITACION) + Bearer JWT (cookie httpOnly en BFF)
  S->>S: Verifica rol ADMIN, tamaño <= 5 MiB y firma binaria real (JPEG/PNG)
  S->>B: PutObject en tipos/<uuid>.<ext> (Cache-Control: public, max-age=31536000, immutable)
  S-->>W: 201 Created · ImagenSubida { clave: "tipos/<uuid>.jpg" }
  Note over A,D: El objeto ya existe en el bucket bajo tipos/*, pero la galería del tipo aún no cambió
  A->>W: 2. Define foto principal, orden y guarda la galería del tipo
  W->>S: PUT /api/v1/admin/tipos-habitacion/{id}/fotos (FotosTipoPeticion)
  S->>S: Valida rol ADMIN, exactamente una principal=true, prefijo tipos/ y existencia de cada clave
  S->>B: HeadObject de cada clave en tipos/*
  S->>D: Persiste galería ordenada y foto principal del tipo
  S-->>W: 200 OK · TipoHabitacionAdmin con FotoCatalogo[] (clave, url, principal, orden)
  W->>C: GET https://d13s29erv78l4g.cloudfront.net/tipos/<uuid>.jpg
  C-->>W: 200 OK (imagen servida por CDN; S3 directo anónimo responde 403)
```

### 3.1 Paso 1 — Subida de imagen (`POST /api/v1/archivos/imagenes`)

- **Transporte:** `multipart/form-data` enviado desde el navegador al BFF de Next.js; el BFF adjunta el JWT del `ADMIN` almacenado en cookie `httpOnly` y reenvía el multipart a Spring.
- **Campos (`SubirImagenPeticion`):**
  - `archivo`: binario `JPG` o `PNG` de máximo **5 MiB** (`5 242 880` bytes). El API valida el contenido real (magic bytes / MIME real), no solo la extensión ni el `Content-Type` declarado por el cliente.
  - `uso`: `TIPO_HABITACION` (exclusivo de `ADMIN`; `RECEPCION` y `MANTENIMIENTO_LIMPIEZA` solo tienen autorizado `INCIDENCIA`).
- **Escritura del objeto:** el API genera una clave nueva e inmutable bajo el prefijo `tipos/` (por ejemplo, `tipos/0192b5e4-7c90-7a12-9b1e-4d3a2f1c8e90.jpg`) en el bucket público de assets y escribe el objeto con `Cache-Control: public, max-age=31536000, immutable`.
- **Respuesta (`201 Created` — `ImagenSubida`):**
  ```json
  {
    "clave": "tipos/suite-demo.jpg"
  }
  ```
- **Diferencia con asociar:** si la subida tiene éxito pero el usuario cierra la pantalla o falla el paso 2, el objeto permanece bajo `tipos/` sin modificar la galería visible del tipo de habitación.

### 3.2 Paso 2 — Asociación y orden de la galería (`PUT /api/v1/admin/tipos-habitacion/{id}/fotos`)

- **Cuerpo (`FotosTipoPeticion`):** lista completa de fotos del tipo (`minItems: 1`), donde cada elemento (`FotoTipoPeticion`) indica `clave`, `principal` (`boolean`) y `orden` (`integer >= 0`):
  ```json
  {
    "fotos": [
      {
        "clave": "tipos/suite-demo.jpg",
        "principal": true,
        "orden": 0
      },
      {
        "clave": "tipos/suite-bano.jpg",
        "principal": false,
        "orden": 1
      }
    ]
  }
  ```
- **Reglas de validación en el API:**
  - Rol `ADMIN` obligatorio (`401` sin sesión, `403` otro rol).
  - El tipo `{id}` debe existir (`404` si no existe).
  - Todas las claves deben pertenecer al uso `TIPO_HABITACION` (prefijo `tipos/`, sin `..` ni rutas absolutas) y existir en almacenamiento.
  - Debe existir **exactamente una** foto con `principal: true` (si hay cero o más de una, responde `400 DATOS_INVALIDOS`).
- **Respuesta (`200 OK` — `TipoHabitacionAdmin`):** devuelve el tipo actualizado con su arreglo `fotos` (`FotoCatalogo`), donde cada elemento expone `clave`, `url` (`${ARCHIVOS_URL_PUBLICA}/${clave}`), `principal` y `orden`.

### 3.3 Estados de error y reintentos

| Situación | Código esperado | Comportamiento de recuperación |
|---|---|---|
| Sin sesión o token vencido | `401` | El BFF intenta renovar sesión o redirige a `/login`. |
| Rol distinto de `ADMIN` para `uso=TIPO_HABITACION` o `PUT .../fotos` | `403` | Rechazo inmediato; no escribe en almacenamiento ni altera la base de datos. |
| Formato distinto de JPG/PNG real, archivo vacío o `> 5 MiB` | `400` | Mostrar error junto al selector de archivo; el usuario elige un archivo válido. |
| Cero o más de una foto `principal: true`, o clave fuera de `tipos/` | `400` | Conservar en el formulario las claves ya subidas para que el `ADMIN` corrija la selección y reintente `PUT .../fotos` sin volver a subir los archivos. |
| Clave declarada en `PUT .../fotos` que no existe en el bucket | `400` / `404` | No reemplazar la galería anterior; permitir quitar la foto fallida o subirla de nuevo. |
| Fallo transitorio de red en el paso 2 (`PUT .../fotos`) | `502` / `503` | Reintentar únicamente el `PUT` reutilizando las `clave` ya obtenidas en el paso 1. |

---

## 4. Configuración y permisos por entorno

| Entorno | Bucket público de assets (`tipos/*`) | Bucket privado (`incidencias/*`, `facturas/*`) | Autenticación del API hacia almacenamiento | `ARCHIVOS_URL_PUBLICA` |
|---|---|---|---|---|
| `local` | Adaptador local en PostgreSQL (sin MinIO ni nube) | Adaptador local en PostgreSQL | Sin credenciales cloud | Ruta/URL local de desarrollo |
| `dev` | R2 `villa-serena-dev-public` | R2 `villa-serena-dev-private` | Credenciales S3 de R2 en `.env.dev` ignorado por Git (`STORAGE_ENDPOINT`, `STORAGE_REGION=auto`, `STORAGE_PATH_STYLE=true`) | `https://assets-dev.villaserenaguate.lat` |
| `prod` | S3 `villa-serena-prod-public-291723764646-us-east-1` | S3 `villa-serena-prod-private-291723764646-us-east-1` | Rol IAM de EC2 (`villa-serena-prod-ec2-role`, IMDSv2 hop limit 2), sin claves estáticas (`STORAGE_ENDPOINT` vacío, `STORAGE_PATH_STYLE=false`) | `https://d13s29erv78l4g.cloudfront.net` |

### 4.1 Semántica IAM en producción (`tipos/*` y `HeadObject`)

La política IAM `villa-serena-api-room-type-photos` aplicada sobre `villa-serena-prod-ec2-role` ([infra PR #29](https://github.com/villaserenaguatee/villa-serena-infra/pull/29)) concede únicamente:
- `s3:PutObject` y `s3:GetObject` sobre `arn:aws:s3:::villa-serena-prod-public-291723764646-us-east-1/tipos/*`.
- **No concede** `s3:ListBucket`, `s3:DeleteObject`, administración de versiones ni ACL en el bucket público, **ni permite escribir en `images/catalogo-aprobado/`**.
- **Implicación para el backend ([API #82](https://github.com/villaserenaguatee/villa-serena-api/issues/82)):** en Amazon S3, cuando el rol tiene `s3:GetObject` pero no `s3:ListBucket`, ejecutar `HEAD` (`HeadObject`) sobre una clave inexistente bajo `tipos/*` puede devolver HTTP **`403 Forbidden`** en lugar de `404 Not Found`. El API debe tratar esa respuesta en la verificación de una clave inexistente sin asumir que todo `403` equivale a `404` (distinguiendo error de clave inexistente frente a fallo de configuración o prefijo fuera de `tipos/`).

### 4.2 Caché inmutable, reemplazo de fotos y retirada de archivos locales

1. **Claves nuevas al reemplazar:** los objetos públicos se sirven con `Cache-Control: public, max-age=31536000, immutable`. Para reemplazar una imagen nunca se sobrescribe la misma clave; se sube un archivo nuevo (que recibe una clave nueva bajo `tipos/`) y se actualiza la asociación del tipo con `PUT /api/v1/admin/tipos-habitacion/{id}/fotos`.
2. **Conservación de objetos publicados:** ni el rol EC2 ni el flujo de actualización de galería borran objetos anteriores del bucket público; esto evita enlaces rotos en caché o referencias históricas.
3. **Retirada de archivos locales en web ([web #69](https://github.com/villaserenaguatee/villa-serena-web/issues/69)):** los archivos de `public/images/catalogo-aprobado/` y las referencias a Unsplash solo pueden retirarse en una PR posterior después de migrar todas las referencias al contrato/CDN y comprobar su carga.

---

## 5. Checklist de verificación demostrable

Al completarse [API #82](https://github.com/villaserenaguatee/villa-serena-api/issues/82) y [web #69](https://github.com/villaserenaguatee/villa-serena-web/issues/69), la verificación del flujo debe ejecutarse y reportarse con evidencia real (separando esta documentación preparada de las pruebas ejecutadas, y **sin introducir seeds en producción**):

- [ ] **1. Subida autorizada (`ADMIN`):** iniciar sesión como `ADMIN`, abrir **Administración → Catálogos → Tipos de habitación**, subir una foto `JPG` o `PNG` real (`<= 5 MiB`) y verificar respuesta `201` con `clave` bajo `tipos/`.
- [ ] **2. Asociación y recarga:** marcar una única foto como principal, definir el orden, guardar (`PUT /api/v1/admin/tipos-habitacion/{id}/fotos`), recargar la página de Administración y el catálogo público y comprobar que la foto nueva aparece con URL del CDN (`ARCHIVOS_URL_PUBLICA/tipos/...`).
- [ ] **3. Acceso por CDN frente a S3 directo:**
  ```bash
  curl -I https://d13s29erv78l4g.cloudfront.net/tipos/CLAVE_SUBIDA.jpg
  curl -I https://villa-serena-prod-public-291723764646-us-east-1.s3.us-east-1.amazonaws.com/tipos/CLAVE_SUBIDA.jpg
  ```
  Verificar que CloudFront responde `200 OK` y el acceso directo anónimo a S3 responde `403 Forbidden`.
- [ ] **4. Control de acceso por rol:** intentar `POST /api/v1/archivos/imagenes` con `uso=TIPO_HABITACION` y `PUT /api/v1/admin/tipos-habitacion/{id}/fotos` con sesión de `RECEPCION` o `MANTENIMIENTO_LIMPIEZA` y sin sesión; verificar rechazo `403` y `401` respectivamente.
- [ ] **5. Validación de archivo:** intentar subir un archivo mayor a 5 MiB o un archivo que no sea `JPG`/`PNG` real (por ejemplo, texto renombrado a `.jpg`); verificar rechazo `400`.
- [ ] **6. Fallo de asociación:** enviar `PUT /api/v1/admin/tipos-habitacion/{id}/fotos` sin foto principal, con dos principales o con una clave inexistente (`tipos/no-existe.jpg`); verificar rechazo sin corromper la galería previa del tipo.
