# 16 — Guía de arranque del proyecto

> **Para qué sirve:** cómo preparar tu computadora la primera vez, cómo encender el proyecto cada día, cómo retomar el trabajo y qué hacer cuando algo falla.
> **Para quién:** los 6 integrantes. No hace falta experiencia previa con estas tecnologías.
> **Entornos:** Windows (Kimberly y Josué), macOS (Pablo, Carlos y Hugo) y Linux (Alex). Los comandos se ejecutan desde el repositorio correspondiente; las diferencias de terminal se indican en la sección 1.1.
> **Relacionado:** `15 - Prompts de IA/00 - Como usar los prompts.md` (cómo trabajar con la IA) y documento 14, sección 8.

---

## 1. Qué instalar (una sola vez)

| Programa | Quién lo necesita | Cómo comprobar que funciona |
|---|---|---|
| **Git** | Todos | `git --version` |
| **Docker Desktop** en Windows/macOS; Docker Engine con Compose o Docker Desktop en Linux | Todos | `docker --version` y `docker ps` sin error |
| **Visual Studio Code** u otro editor | Todos | — |
| Tu **herramienta de IA** (Claude Code, Codex, Copilot o Cursor) | Todos | — |
| **JDK 21** (por ejemplo, Eclipse Temurin 21) | Josué, Hugo y Pablo (API) | `java -version` muestra 21 |
| **Node.js 22 LTS** y **pnpm** (`npm install -g pnpm`) | Alex, Kim (web) y Carlos (app) | `node -v` y `pnpm -v` |
| **Expo Go de SDK 54** en un teléfono Android. Se descarga desde **expo.dev/go**, **no** desde la Play Store | Carlos | La app abre |
| Cuenta de **Expo** y **EAS CLI** (`npm install -g eas-cli`) | Carlos | `eas --version` |
| **DBeaver** (opcional), para ver la base de datos | Quien quiera | — |

No hace falta instalar Maven: el API trae su propio Maven (`mvnw`).

**Cuentas:** no hay que crear cuentas para PostgreSQL, Mailpit, MinIO ni Grafana; sus usuarios y contraseñas los inventas tú en el `.env`. Solo harán falta cuentas de **Stripe** en modo prueba (para los pagos, más adelante) y de **Expo** (Carlos).

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

El perfil `local`, cuando esté configurado, se selecciona añadiendo `-Dspring-boot.run.profiles=local`. En macOS/Linux, si el wrapper no tiene permiso de ejecución, `chmod +x mvnw` lo habilita. Los ejemplos con `<...>` son marcadores que se sustituyen antes de ejecutarlos; no son comandos para copiar literalmente.

---

## 2. Primera vez: preparar el proyecto

### 2.1 Clonar los repositorios

Cada integrante obtiene los repositorios necesarios desde GitHub en su ubicación habitual de trabajo. La documentación no fija rutas locales ni prescribe cómo crear carpetas. Git utiliza los mismos comandos en Windows, macOS y Linux.

| Quién | Repositorios |
|---|---|
| Todos | `villa-serena-infra` (los servicios de Docker) |
| Josué, Hugo y Pablo | `villa-serena-api` |
| Alex y Kim | `villa-serena-web` (y `villa-serena-api` para probar de punta a punta) |
| Carlos | `villa-serena-movil` (y `villa-serena-api` para probar de punta a punta) |
| Quien edite documentación | `villa-serena-docs` |

### 2.2 Crear tu `.env`

**Qué es:** un archivo de texto con la **configuración privada de tu computadora** (contraseñas, claves y direcciones). Cada línea tiene un nombre y un valor, por ejemplo `POSTGRES_PASSWORD=VillaSerena2026`. Docker, Spring, Next.js y Expo lo leen al arrancar, así las contraseñas no se escriben en el código. Está en `.gitignore`: **nunca se sube a GitHub**. Lo que sí se sube es su plantilla, `.env.example`.

**Cómo crearlo** (en cada repositorio que tenga `.env.example`):

1. La plantilla `.env.example` se copia a `.env` desde el repositorio; la sección 1.1 muestra el comando de cada terminal.
2. Abre `.env` con tu editor y sustituye cada `<TU_...>` por tu valor. **Los símbolos `<` y `>` no van:** se sustituye todo.
   ```env
   # Antes
   MINIO_ROOT_PASSWORD=<TU_CONTRASENA_MINIO>
   # Después
   MINIO_ROOT_PASSWORD=VillaSerena2026
   ```
3. Reglas para los valores:
   - Sin espacios alrededor del `=` y sin comillas.
   - Solo letras, números y, si quieres, `!`, `-` o `_`. **Evita `#`, `$` y `"`**.
   - Las contraseñas de MinIO deben tener **al menos 8 caracteres**.
   - Como todo es local y de prueba, las contraseñas **las inventas tú**.
4. Los valores que deben ser **iguales para todos** (la contraseña de PostgreSQL que también usa el API, y los hashes de los usuarios de prueba y de las claves de los canales) se comparten **por mensaje privado** entre el equipo.
5. **Nunca subas el `.env` ni pegues su contenido en un chat de IA.** Si la IA necesita saber qué variables hay, muéstrale el `.env.example`.

### 2.4 Valores del `.env` del API para los datos de prueba

Las migraciones de Flyway cargan empleados de prueba y dos canales. Sus contraseñas y claves **no están en el código**: Flyway las toma de tres valores de tu `.env` de `villa-serena-api`. Cada quien los genera en su computadora (con Docker abierto). **No los pegues en ningún chat de IA.**

**1. Contraseña de los empleados de prueba.** El equipo acuerda **por mensaje privado** una contraseña de demostración (por ejemplo `VillaSerena2026`). Genera su hash BCrypt:

```bat
docker run --rm httpd:2.4-alpine htpasswd -nbBC 10 "" VillaSerena2026
```

La respuesta empieza con `:$2y$10$...`. Copia todo **sin los dos puntos del inicio**:

```env
DEMO_PASSWORD_HASH=$2y$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Con esa contraseña entran todos los empleados de prueba (sus correos están en la migración V6). El hash contiene `$`: en el `.env` del API está bien así (la regla de evitar `$` es para el `.env` de Docker).

**2. Claves de los dos canales.** Inventa una clave para cada canal (por ejemplo `ClaveBookingDemo2026` y `ClaveExpediaDemo2026`) y genera su SHA-256:

```bat
docker run --rm alpine sh -c "printf %s ClaveBookingDemo2026 | sha256sum"
docker run --rm alpine sh -c "printf %s ClaveExpediaDemo2026 | sha256sum"
```

Cada uno responde 64 caracteres seguidos de un guion. Copia solo los 64 caracteres:

```env
CANAL1_KEY_HASH=<64 caracteres del primero>
CANAL2_KEY_HASH=<64 caracteres del segundo>
```

Las claves **en texto** (`ClaveBookingDemo2026`, etc.) van en el `.env` de `villa-serena-web`, para el canal simulado (variables `CANAL_..._CLAVE`).

**Importante:** Flyway usa estos valores **la primera vez** que crea la base. Si los cambias después, borra la base y vuelve a empezar (`docker compose -f docker-compose.dev.yml down -v` en `villa-serena-infra`).

### 2.3 Encender los servicios por primera vez

Con Docker disponible (Desktop en Windows/macOS o daemon en Linux), desde `villa-serena-infra`:

```bat
docker compose -f docker-compose.dev.yml up -d
```

La primera vez **descarga las imágenes** (puede tardar varios minutos y necesita buena conexión a Internet). Después, comprueba que funcionan las direcciones de la sección 3.

---

## 3. Qué servicios corren en Docker

| Servicio | Para qué sirve | Dirección en tu computadora |
|---|---|---|
| **PostgreSQL** | La base de datos | Puerto 5432 (la usa el API) |
| **Mailpit** | Atrapa los correos de prueba (códigos, confirmaciones y facturas) para verlos sin enviarlos de verdad | http://localhost:8025 |
| **MinIO** | Guarda archivos (fotos y PDF de facturas). Funciona igual que Cloudflare R2, que se usará después en el servidor | Consola: http://localhost:9001 |
| **Prometheus** | Recoge las métricas del API | http://localhost:9090 |
| **Grafana** | Muestra el tablero del API | http://localhost:3001 |

**Imagen de MinIO:** las imágenes oficiales de MinIO ya no están en Docker Hub. Se usa el fork `pgsty/minio`, compatible con S3 (aprobado por el equipo).

---

## 4. Cada día: encender el proyecto

1. Comprueba que Docker está disponible con `docker info`: Docker Desktop en Windows/macOS o Docker Engine/Desktop en Linux.
2. Enciende los servicios, dentro de `villa-serena-infra`:
   ```bat
   docker compose -f docker-compose.dev.yml up -d
   docker compose -f docker-compose.dev.yml ps -a
   ```
   Todos deben decir `running`, menos `minio-init`, que dice `exited (0)`. Es normal: solo crea los buckets y termina. Tus datos se conservan de un día a otro.
3. Enciende lo que vayas a usar, cada uno en **su propia ventana de terminal**:

| Parte | Carpeta | Comando | Dirección |
|---|---|---|---|
| API (Spring) | `villa-serena-api` | Maven Wrapper según la terminal (sección 1.1), con `spring-boot:run` | http://localhost:8080/swagger-ui.html |
| Web (Next.js) | `villa-serena-web` | `pnpm dev` | http://localhost:3000 |
| App (Expo) | `villa-serena-movil` | `npx expo start` y escanear el código QR con Expo Go | En el teléfono |
| Stripe (más adelante) | Cualquiera | `stripe listen --forward-to localhost:8080/<ruta-del-webhook>` | — |

El API debe estar encendido para que funcionen la web y la app. La app necesita que el teléfono y la computadora estén en la **misma red Wi-Fi**.

---

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
| Las notificaciones push | El **development build** (el APK que generó Carlos con EAS) instalado en el teléfono | `npx expo start --dev-client` y escanear el código QR |

Si el código QR no conecta, prueba `npx expo start --tunnel` (más lento; el API sigue usando la IP local).

**Si cambia la IP** (otra red, o el router la reasignó): actualiza `EXPO_PUBLIC_API_URL` y reinicia con caché limpia, porque esas variables quedan grabadas dentro de la app:

```bat
npx expo start -c
```

**Notificaciones push:** necesitan Internet en el teléfono y el development build; en Expo Go no funcionan. Solo llegan con la reserva `EN_ESTADIA`.

---

## 5. Retomar el trabajo (continuar donde lo dejaste)

Cada sesión comienza revisando el estado local y actualizando las referencias. Los cambios sin guardar en un commit se conservan antes de cambiar de rama o sincronizar. Si falta `develop`, el agente propone crearla desde `main`; la guía de prompts, sección 3, describe el flujo con issues y PR.

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

Los cambios de migraciones requieren comprobar el arranque del API con Flyway. Los cambios del contrato (`openapi.yaml`) requieren actualizar la copia local y regenerar los tipos en web y app.

Los perfiles `local`, `dev` y `prod` distinguen los entornos y aprovechan la configuración existente. Cuando el perfil `local` esté configurado, el API puede arrancar con el Maven Wrapper de la terminal (sección 1.1) y `spring-boot:run -Dspring-boot.run.profiles=local`. Los pasos de instalación y arranque siguen siendo ejemplos operativos para la persona, adaptables a su sistema.

Para las pruebas desde frontend, el equipo puede acordar un Cloudflare Tunnel temporal hacia el API. Mantiene autenticación, expone solo lo necesario y se cierra al terminar. Los servicios de administración de Docker y las credenciales permanecen fuera de esa exposición.

Cómo subir tu trabajo y abrir el pull request: `15 - Prompts de IA/00 - Como usar los prompts.md`, sección 3.

---

## 6. Al terminar: apagar

1. Detén el API, la web y la app con `Ctrl + C` en sus terminales.
2. Apaga los servicios (opcional), dentro de `villa-serena-infra`:
   ```bat
   docker compose -f docker-compose.dev.yml down
   ```
   Esto **no borra** los datos. En equipos con Docker Desktop, cerrarlo también detiene sus servicios.
3. **Solo si quieres empezar de cero** (borra la base de datos y los archivos de MinIO):
   ```bat
   docker compose -f docker-compose.dev.yml down -v
   ```

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
