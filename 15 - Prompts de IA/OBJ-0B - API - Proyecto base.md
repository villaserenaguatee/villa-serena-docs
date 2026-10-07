# OBJ-0B — API: proyecto base

| Dato | Valor |
|---|---|
| Objetivo | 0 — Base (documento 13) |
| Repositorio | `villa-serena-api` |
| Responsable | Hugo |
| Horas estimadas | 2 h |
| Cubre | Proyecto base de Spring; tarea técnica: historial de cambios de estado (ALC-TRA-03) |
| Depende de | El pull request del esquema de Josué (rama `obj0-esquema`) **fusionado en `main`** antes de empezar. **Pablo (OBJ-0D) parte de este proyecto** |

> **Antes de empezar:** prepara tu computadora con la `16 - Guia de Arranque del Proyecto.md` (instalar, `.env` y encender Docker). Para crear tu rama y subir tu trabajo con un pull request, sigue la sección 3 de `00 - Como usar los prompts.md`.

## Lo que ya existe en el repositorio (léelo antes de empezar)

| Ya existe en `main` | Qué significa para ti |
|---|---|
| Un proyecto inicial con el paquete **`com.villaserena.api`** | **Complétalo**; no crees otro proyecto ni cambies el paquete |
| El archivo **`src/main/resources/application.yaml`** (con **a**: `.yaml`) con una sección `spring.flyway.placeholders` | Usa **ese** archivo; **no crees** `application.yml`. **Conserva** la sección de placeholders |
| Las migraciones **V1 a V6** en `src/main/resources/db/migration` (tablas y datos de prueba) | **No las cambies.** Al arrancar, Flyway las aplica solas |
| `openapi.yaml` (contrato del API) | No lo cambies; los cambios pasan por Josué |

**Antes de arrancar el API**, tu `.env` necesita tres valores para los datos de prueba: `DEMO_PASSWORD_HASH`, `CANAL1_KEY_HASH` y `CANAL2_KEY_HASH`. Cómo generarlos: guía 16, sección 2.4. Sin ellos, Flyway se detiene con el error "No value provided for placeholder".

## Documentos que debes adjuntar a la IA

- `AGENTS.md`
- `14 - Tecnologias y Arquitectura.md` (secciones 2, 4.1, 5, 6 y 7)
- `07 - Estados.md` (sección 10, reglas generales del historial)

## Prompt

```text
Trabajas en el repositorio villa-serena-api del proyecto Villa Serena (lee AGENTS.md
y los documentos adjuntos). Responde en español.

Objetivo: completar el proyecto base del backend, sin lógica de negocio todavía.

IMPORTANTE: el repositorio YA tiene un proyecto inicial (paquete
com.villaserena.api), el archivo src/main/resources/application.yaml con una
sección spring.flyway.placeholders, las migraciones V1 a V6 de Flyway y
openapi.yaml. Revisa primero qué existe y complétalo; no crees un proyecto nuevo,
no crees application.yml, no cambies el paquete ni las migraciones.

Completa:
1. Proyecto Maven con Spring Boot 4.1 y Java 21 (con ./mvnw). Paquete raíz
   com.villaserena.api y los paquetes vacíos de la sección 7 del documento 14
   (config, auth, reservas, estadia, roomservice, piso, personal, catalogos,
   facturacion, canal, notificaciones, comun; sin inventario, que es Nivel 2).
2. Dependencias: spring-boot-starter-webmvc, -data-jpa, -validation, -flyway
   (con flyway-database-postgresql), -actuator, -security-oauth2-resource-server
   (solo la dependencia; la configuración la hace Pablo), driver de PostgreSQL,
   micrometer-registry-prometheus y springdoc-openapi para Spring Boot 4.
   Si una versión no es compatible con Spring Boot 4.1, avísame antes de cambiarla.
3. En el application.yaml EXISTENTE (conserva spring.flyway.placeholders): que
   lea el .env con spring.config.import=optional:file:.env[.properties];
   conexión a PostgreSQL desde variables del .env,
   puerto 8080, zona horaria de la JVM y de Jackson en UTC, y
   hibernate.jdbc.time_zone=UTC. Zona de negocio America/Guatemala como bean
   ZoneId o constante en comun (AD-19).
4. Actuator: exponer health y prometheus.
5. CORS: permitir solo http://localhost:3000 (variable de entorno), métodos
   GET, POST, PUT, PATCH y DELETE, con credenciales.
6. Manejo de errores global (@RestControllerAdvice) con un formato único:
   { "codigo", "mensaje", "detalles" } y mensajes en español. Casos: validación
   (400), no encontrado (404), prohibido (403), conflicto (409) y error interno
   (500, sin mostrar detalles técnicos).
7. Historial de cambios de estado (comun): entidad JPA que mapee la tabla
   historial_estados TAL COMO está en la migración V5 (léela) y el servicio
   HistorialEstadoService.registrar(tipoEntidad, idEntidad, estadoAnterior,
   estadoNuevo, tipoResponsable, idResponsable, motivo). Usa
   spring.jpa.hibernate.ddl-auto=validate: Hibernate nunca crea ni cambia tablas.
8. springdoc: Swagger UI en /swagger-ui.html y JSON en /v3/api-docs.
9. .env.example (sin valores reales), .gitignore con .env y README.md con los
   pasos para arrancar.

Mientras Pablo no termine la seguridad, deja una configuración temporal que
permita /actuator/** y /swagger-ui/** y /v3/api-docs/** sin sesión, marcada con
un comentario TODO para Pablo.

No hagas:
- No crees ni cambies migraciones de Flyway (solo Josué). Si una tabla no
  coincide con lo que necesitas, avísame y se lo pido a Josué.
- No agregues endpoints de negocio, WebSocket, Stripe ni correo todavía.

Primero muéstrame el plan de archivos; después créalos.
```

## Cómo saber que quedó terminado

1. Con los servicios de OBJ-0A arriba y los tres valores de la guía 16 (sección 2.4) en tu `.env`, `mvnw.cmd spring-boot:run` arranca sin errores y Flyway aplica V1 a V6 (en la consola aparece "Successfully applied 6 migrations").
1b. Comprobación de los datos de prueba:
   ```bat
   docker exec -it villa-serena-dev-postgres-1 psql -U villaserena -d villaserena -c "select count(*) from habitaciones;"
   ```
   Debe responder `12`. (Si tu base o tu usuario tienen otro nombre, usa los de tu `.env`).
2. http://localhost:8080/actuator/health responde `{"status":"UP"}`.
3. http://localhost:8080/actuator/prometheus muestra métricas y Prometheus marca el API como "UP".
4. http://localhost:8080/swagger-ui.html abre.
5. Una petición a una ruta inexistente responde con el formato de error en español.
6. `git status` no muestra ningún `.env`.

## Al terminar

Cuando todo lo de "Cómo saber que quedó terminado" funcione, pega esto a la IA:

```text
Terminamos esta tarea. Muéstrame git status y confirma que no se sube ningún .env
ni claves. Luego haz commit, push y abre el pull request a main con un título que
EMPIECE con "OBJ-0B:" (por ejemplo "OBJ-0B: <resumen corto>"). En la descripción
pon qué se hizo, cómo se probó y la lista de tareas de "17 - Avance del Proyecto.md"
con código OBJ-0B que quedan completas.
```

Pide a un compañero que revise el PR. No marques el archivo 17: Josué lo actualiza una vez al día.
