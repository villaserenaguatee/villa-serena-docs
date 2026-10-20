# Guía de Arranque del Entorno Local

Instrucciones para configurar y encender el ecosistema local de desarrollo (Docker Compose con PostgreSQL, Mailpit, Prometheus y Grafana; R2 remoto para archivos en dev; API Spring Boot, Web Next.js y App Expo).

Para el flujo actual de web y API, prepara Docker, API y web. La app se retoma según el [roadmap por versiones](../01-metodologia/roadmap-versiones.md); no hace falta instalar Expo para trabajar solo en web o API. Esta guía no fija una fecha de entrega.

---

## 1. Qué instalar (una sola vez)

| Programa | Quién lo necesita | Cómo comprobar que funciona |
|---|---|---|
| **Git** | Todos | `git --version` |
| **Docker Desktop** en Windows/macOS; Docker Engine con Compose o Docker Desktop en Linux | Quien ejecute servicios locales o pruebas que usen contenedores | `docker --version` y `docker ps` sin error |
| **Visual Studio Code** u otro editor | Todos | — |
| **JDK 21** (por ejemplo, Eclipse Temurin 21) | Quien ejecute el API | `java -version` muestra 21 |
| **Node.js 24** y **pnpm 12** | Quien trabaje en web o compruebe el contrato de docs | `node -v` muestra 24 y `pnpm -v` muestra 12 |
| **Expo Go de SDK 54** en un teléfono Android, desde **expo.dev/go** | Solo quien pruebe la app | La app abre |
| Cuenta de **Expo** y **EAS CLI** | Solo quien genere el development build de la app | `eas --version` |
| **DBeaver** (opcional), para ver la base de datos | Quien quiera | — |

No hace falta instalar Maven: el API trae su propio Maven (`mvnw`).

**Cuentas:** PostgreSQL, Mailpit y Grafana se configuran localmente; los archivos de `dev` usan una cuenta R2 remota según [ADR-007](../03-arquitectura/adr/ADR-007-almacenamiento-r2-s3.md). Para probar pagos se usa **Recurrente Sandbox**, con claves privadas en el API; consulta la sección 4.2. Expo solo se necesita para el trabajo de la app.

---

### 1.1 Referencia por sistema y terminal

| Sistema | Integrantes | Terminal habitual |
|---|---|---|
| Windows | Kimberly y Josué | PowerShell o cmd |
| macOS | Pablo, Carlos y Hugo | Terminal con zsh/bash |
| Linux | Alex | Terminal con bash/zsh |

Los comandos de Git, pnpm, Expo y Docker Compose son comunes. Las variantes de Maven Wrapper y copia de archivos son:

| Operación, desde el repositorio | Windows — cmd | Windows — PowerShell | macOS y Linux |
|---|---|---|---|
| Arrancar el API | `mvnw.cmd spring-boot:run` | `./mvnw.cmd spring-boot:run` | `./mvnw spring-boot:run` |
| Probar el API | `mvnw.cmd test` | `./mvnw.cmd test` | `./mvnw test` |
| Copiar el entorno de ejemplo | `copy .env.example .env` | `Copy-Item .env.example .env` | `cp .env.example .env` |

El API tiene perfiles `local`, `dev` y `prod`; `demo` se retira. Los fixtures se cargan manualmente, después del esquema (sección 2.3). En macOS/Linux, si el wrapper no tiene permiso de ejecución, `chmod +x mvnw` lo habilita. Los ejemplos con `<...>` son marcadores que se sustituyen antes de ejecutarlos; no son comandos para copiar literalmente.

---

## 2. Primera vez: preparar el proyecto

### 2.1 Clonar los repositorios

Cada integrante obtiene los repositorios necesarios desde GitHub en su ubicación habitual de trabajo. La documentación no fija rutas locales ni prescribe cómo crear carpetas. Git utiliza los mismos comandos en Windows, macOS y Linux.

Reparto registrado por frentes: web/móvil, Kimberly y Alexander; backend, Pablo, Carlos y Hugo; documentación/infraestructura, Josué. Cada frente acuerda su distribución interna; esta guía indica herramientas por tarea, sin asignar trabajo individual.

| Para trabajar en | Repositorios |
|---|---|
| Servicios locales | `villa-serena-infra` |
| Backend | `villa-serena-api` y `villa-serena-infra` |
| Web conectada | `villa-serena-web` y un API accesible; si corre en tu equipo, también API e infra |
| App conectada | `villa-serena-movil` y un API accesible |
| Documentación o comprobación del contrato | `villa-serena-docs`; los consumidores usan la revisión fijada en su `api-contract.json` |

### 2.2 Crear tu `.env`

**Qué es:** un archivo de texto con la **configuración privada de tu computadora** (contraseñas, claves y direcciones). API usa `.env.local.example` o `.env.dev.example` para `.env.local` o `.env.dev`; infra conserva `.env.example` para su Compose auxiliar y web usa `.env.local`. El API importa solo el archivo de su perfil como propiedades de Spring. Estos archivos privados no se suben a GitHub.

**Cómo crearlo:**

1. Desde API, elige `local` mínimo o `dev` con integraciones y copia su plantilla a `.env.local` o `.env.dev`.
2. Completa las variables de [ENTORNOS del API](https://github.com/villaserenaguatee/villa-serena-api/blob/dev/docs/ENTORNOS.md). Como mínimo, los comandos Compose necesitan `DB_PASSWORD` y `JWT_SECRET`; dev añade la contraseña de Grafana. El API puede arrancar sin R2, pero para usar archivos debes configurarlo.
3. Los archivos se leen como propiedades: usa `CLAVE=valor`, sin `source`, sin expansiones de shell ni comillas. Genera contraseñas locales aleatorias; no copies secretos de producción.
4. Si usas el Compose auxiliar de infra en lugar del de API, haz coincidir su contraseña/usuario con la configuración de conexión del API y evita ejecutar ambos sobre los mismos puertos.
5. Nunca subas los archivos privados ni pegues secretos en chats. Las credenciales R2 del API se limitan al bucket de desarrollo y son distintas del token administrativo y del backend de Terraform.

### 2.3 Configurar el API y sus datos de prueba

Sigue el [checklist de entornos del API](https://github.com/villaserenaguatee/villa-serena-api/blob/dev/docs/ENTORNOS.md) y el [procedimiento R2/S3 de infra](https://github.com/villaserenaguatee/villa-serena-infra/blob/main/docs/ALMACENAMIENTO.md). `local` mínimo no requiere nube; las pruebas locales de archivos se hacen con `dev`, directamente contra R2.

Flyway aplica solo el esquema. Ningún perfil carga hotel, catálogos o empleados ficticios automáticamente. El script `scripts/demo/load-data.sql` del API se ejecuta explícitamente después del arranque contra una instancia local con tablas de negocio vacías; consulta su [procedimiento de carga](https://github.com/villaserenaguatee/villa-serena-api/blob/dev/README.md#carga-local-explícita). Sus hashes se pasan al proceso de `psql`, no a Flyway. No ejecutes fixtures en producción.

El bootstrap del primer administrador está deshabilitado por defecto. Si lo necesitas, habilítalo explícitamente y sigue el checklist del API: solo crea el primer ADMIN, exige cambio de contraseña y no sustituye credenciales existentes. Si vas a cargar fixtures sobre tablas vacías, deja el bootstrap apagado.

### 2.4 Conectar la web al API local

En el `.env.local` de web, ajusta el destino de su plantilla al API que vas a usar. Para uno en tu computadora con los puertos habituales:

```env
API_URL=http://localhost:8080
VILLA_SERENA_BFF_MODE=api
STAFF_AUTH_MODE=spring
GUEST_AUTH_MODE=spring
NEXT_PUBLIC_WS_URL=ws://localhost:8080/ws
```

En el API, `WEB_URL` y `CORS_ORIGENES` deben corresponder a la web, normalmente `http://localhost:3000`. Si el API es compartido, usa su dirección acordada. Reinicia web al cambiar su entorno. Los modos de demostración de web no prueban la conexión con Spring.

Antes del primer arranque de web, instala sus dependencias desde `villa-serena-web` con `pnpm install --frozen-lockfile`.

### 2.5 Encender los servicios por primera vez

Con Docker disponible, elige los comandos de [ENTORNOS del API](https://github.com/villaserenaguatee/villa-serena-api/blob/dev/docs/ENTORNOS.md). Desde `villa-serena-api`, para dev con el API en Docker:

```bash
docker compose --env-file .env.dev -f compose.dev.yml up -d --build --wait
```

Para ejecutar el API con Maven, arranca solo las dependencias según esa misma guía y utiliza `-Dspring-boot.run.profiles=dev`. No arranques al mismo tiempo el API de Docker y Maven sobre el mismo puerto. El Compose auxiliar de infra sigue disponible para dependencias; no incluye un servidor de objetos.

## 3. Servicios de desarrollo

| Servicio | Dónde corre | Dirección |
|---|---|---|
| PostgreSQL 17 | Docker | `localhost:5432` |
| Mailpit | Docker | `http://localhost:8025`; SMTP `localhost:1025` |
| Prometheus | Docker | `http://localhost:9090` |
| Grafana | Docker | `http://localhost:3001` |
| Cloudflare R2 | Remoto | Endpoint y dominio configurados mediante infra |

MinIO se retira. R2 necesita Internet y credenciales válidas para probar archivos. Las pruebas automatizadas habituales no requieren R2 ni S3 y no usan MinIO.

## 4. Cada día: encender el proyecto

1. Comprueba Docker con `docker info`.
2. Levanta el perfil elegido del API siguiendo su checklist y comprueba `http://localhost:8080/actuator/health`.
3. En web ejecuta `pnpm dev`; en la app, cuando corresponda, `npx expo start`.
4. Accede a `http://localhost:3000/panel/login` con el administrador operativo o los usuarios ficticios que hayas cargado deliberadamente. Un API saludable puede tener todas las tablas de negocio vacías.
5. Cuando trabajes con archivos remotos, ejecuta la comprobación explícita de R2/S3 indicada en infra; `UP` no certifica acceso al bucket.

El recorrido funcional completo se verifica en la issue #13. Para usar el API desde el teléfono, sigue la sección 4.1.

### 4.1 Probar la app en el teléfono

La app del teléfono habla **directo con el API** de la computadora (no pasa por la web). Por eso necesitan estar en la **misma red** y la app debe usar la **IP local** de la computadora, nunca `localhost` (en el teléfono, `localhost` es el propio teléfono).

**1. Misma red Wi-Fi.** Conecta la computadora y el teléfono a la misma red. Si estás en una red de la universidad o pública y no se ven entre sí (muchas bloquean la conexión entre dispositivos), activa el **punto de acceso** del teléfono y conecta la computadora a él.

**2. Averiguar la IP local de la computadora.**

| Sistema | Referencia |
|---|---|
| Windows | `ipconfig`: IPv4 del adaptador conectado. |
| macOS | Configuración del Sistema → Red → conexión activa → detalles de TCP/IP. |
| Linux | `ip -4 address`: IPv4 de la interfaz conectada, distinta de loopback. |

Un ejemplo de IP local es `192.168.1.50`; cada integrante utiliza la de su conexión actual.

**3. Ponerla en el `.env` de `villa-serena-movil`:**

```env
EXPO_PUBLIC_API_URL=http://192.168.1.50:8080
```

(Si el `.env.example` tiene otra variable para el WebSocket, usa la misma IP: `ws://192.168.1.50:8080/...`).

**4. Acceso del teléfono al API.** El backend escucha en una interfaz accesible desde la red local. El firewall permite la conexión al puerto 8080 desde esa red de prueba: en Windows, con el perfil de red privada; en macOS, mediante los permisos del firewall para Java; en Linux, según el firewall activo. La configuración se adapta al equipo y no desactiva globalmente el firewall.

**5. Comprobar desde el teléfono:** abre en el navegador del teléfono `http://192.168.1.50:8080/actuator/health`. Debe decir `UP`. Si no carga, el problema es la red o el firewall, no la app.

**6. Abrir la app:**

| Para probar… | Qué usar | Comando en `villa-serena-movil` |
|---|---|---|
| Todo menos las notificaciones push | **Expo Go de SDK 54** (desde expo.dev/go) | `npx expo start` y escanear el código QR |
| Las notificaciones push | El **development build** generado por el frente móvil e instalado en el teléfono | `npx expo start --dev-client` y escanear el código QR |

Si el código QR no conecta, prueba `npx expo start --tunnel` (más lento; el API sigue usando la IP local).

**Si cambia la IP** (otra red, o el router la reasignó): actualiza `EXPO_PUBLIC_API_URL` y reinicia con caché limpia, porque esas variables quedan grabadas dentro de la app:

```bat
npx expo start -c
```

**Notificaciones push:** necesitan Internet en el teléfono y el development build; en Expo Go no funcionan. Solo llegan con la reserva `EN_ESTADIA`.

---

### 4.2 Probar pagos con Recurrente

Configura las claves de Sandbox `RECURRENTE_PUBLIC_KEY`, `RECURRENTE_SECRET_KEY` y `RECURRENTE_WEBHOOK_SECRET` únicamente en el entorno del API. Para recibir avisos del proveedor, registra una URL accesible que termine en `/api/v1/pagos/recurrente/webhook`; un `localhost` del equipo no es accesible para Recurrente. El equipo puede acordar un túnel temporal al API.

La vuelta del navegador no confirma el pago. Sigue el [ADR-017](../03-arquitectura/adr/ADR-017-pasarela-recurrente.md), el [contrato vigente](../03-arquitectura/contrato-api.md) y el README del API para la configuración y comprobación del webhook. La [guía de Stripe CLI](stripe-cli.md) queda como referencia histórica para el proveedor anterior, no como paso de arranque actual. La adaptación de pagos de web se sigue en [web #61](https://github.com/villaserenaguatee/villa-serena-web/issues/61); consulta su estado publicado antes de probar el recorrido.

---

## 5. Retomar el trabajo (continuar donde lo dejaste)

Cada sesión comienza revisando el estado local y actualizando las referencias. Los cambios sin guardar en un commit se conservan antes de cambiar de rama o sincronizar. En los repositorios de código se usa la rama de integración acordada (`dev` o `develop`); docs utiliza ramas de trabajo y PR hacia `main`, según su `AGENTS.md`.

Ejemplo para una tarea nueva, con el árbol limpio y `develop` existente:

```bat
git status
git fetch origin
git switch develop
git pull --ff-only
git switch -c feat/<issue>-<nombre-corto>
```

Ejemplo para continuar una rama existente con upstream y sin divergencias:

```bat
git status
git fetch origin
git switch feat/<issue>-<nombre-corto>
git pull --ff-only
```

Una rama personal puede actualizarse mediante rebase sobre `origin/develop` cuando corresponda; las ramas compartidas se sincronizan según el acuerdo del equipo, sin reescribir su historial unilateralmente. Los conflictos se investigan preservando ambos cambios y Alex facilita la resolución de bloqueos.

Los cambios de migraciones requieren comprobar el arranque del API con Flyway. Los cambios del contrato se registran en issues de docs y modifican `villa-serena-docs/openapi.yaml`, la fuente de verdad. API, web y app consumen un commit fijo de docs sin mantener copias YAML locales; web y app regeneran sus tipos con la herramienta de docs. Consulta la [guía del contrato](../03-arquitectura/contrato-api.md).

Para el arranque del API elige `local` o `dev` según su guía. Los fixtures se cargan manualmente; no actives el perfil retirado `demo`. Los pasos de instalación y arranque se adaptan a la terminal de cada persona.

Para las pruebas desde frontend, el equipo puede acordar un Cloudflare Tunnel temporal hacia el API. Mantiene autenticación, expone solo lo necesario y se cierra al terminar. Los servicios de administración de Docker y las credenciales permanecen fuera de esa exposición.

Cómo subir tu trabajo y abrir el pull request: [CONTRIBUTING.md](../CONTRIBUTING.md). Las asignaciones y fechas de `historico/` e `historial-prompts/` son referencias históricas; no sustituyen el reparto del equipo ni el roadmap vigente.

---

## 6. Al terminar: apagar

1. Detén el API, la web y la app con `Ctrl + C` en sus terminales.
2. Apaga los servicios (opcional), dentro de `villa-serena-infra`:
   ```bat
   docker compose -f docker-compose.dev.yml down
   ```
   Esto **no borra** los datos. En equipos con Docker Desktop, cerrarlo también detiene sus servicios.
3. **Solo si decides borrar los datos locales** (PostgreSQL y demás volúmenes del proyecto, después de respaldarlos):
   ```bat
   docker compose -f docker-compose.dev.yml down -v
   ```
   Esto no borra objetos remotos de R2/S3. Para los stacks propios del API usa sus comandos de parada con el archivo y proyecto correspondientes.

---

## 7. Errores comunes y qué hacer

| Mensaje o situación | Qué significa | Qué hacer |
|---|---|---|
| `fatal: not a git repository` | Estás en otra carpeta | Verifica que la terminal está en el repositorio; la ruta depende de tu equipo y terminal |
| `Deletion of directory '.git/...' failed. Should I try again? (y/n)` | Windows no deja borrar una carpeta interna vacía porque un programa la tiene abierta | Escribe `n`. No afecta al repositorio |
| `cannot lock ref ...` al hacer `git fetch` | Una referencia local quedó a medio actualizar | Repite `git fetch`. Si sigue: `git update-ref -d refs/remotes/origin/main` y `git fetch` |
| `Cannot connect to the Docker daemon` o `docker` no responde | Docker no está disponible | Comprueba Docker Desktop o el daemon de Docker Engine, según tu sistema |
| `short read ... unexpected EOF` o `no such host` al descargar imágenes | Se cortó Internet o falla el DNS mientras Docker descargaba | Revisa tu Wi-Fi; si usas VPN o proxy, apágalo (o configúralo en Docker Desktop → Settings → Resources → Proxies). Luego repite `docker compose ... up -d`; Docker continúa donde se quedó |
| `port is already allocated` | Otro programa usa ese puerto | Cierra ese programa o cambia el puerto en tu `.env` |
| `'.' no se reconoce como un comando` al usar `./mvnw` | En `cmd` se escribe distinto | Usa el Maven Wrapper indicado para tu terminal en la sección 1.1 |
| La app en el teléfono no llega al API | Redes distintas, se usó `localhost`, firewall o la IP cambió | Sigue la sección 4.1, pasos 1 a 5; si la IP cambió, `npx expo start -c` |
| Las notificaciones push no llegan | Se está usando Expo Go, no hay Internet en el teléfono o la reserva no está `EN_ESTADIA` | Usa el development build (sección 4.1, paso 6) |
| El pull request dice que tiene conflictos | Otra persona cambió lo mismo | Revisar ambos cambios y coordinarlos; Alex facilita la resolución si hay un bloqueo |
| La IA propone actualizar versiones o agregar funciones | Puede cambiar el alcance | Registrar la propuesta como issue con su impacto; el equipo acuerda lo técnico y Kimberly decide sobre el producto |
