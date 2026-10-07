# OBJ-0B — API: proyecto base

| Dato | Valor |
|---|---|
| Objetivo | 0 — Base (documento 13) |
| Repositorio | `villa-serena-api` |
| Responsable inicial | Hugo |
| Horas estimadas | 2 h |
| Cubre | Proyecto base de Spring; tarea técnica: historial de cambios de estado (ALC-TRA-03) |
| Depende de | Repositorio disponible. OBJ-0B prepara la base; OBJ-0C incorpora el esquema y los datos; la verificación conjunta utiliza OBJ-0A y OBJ-0C. OBJ-0D reutiliza esta base. |

> **Referencias de trabajo:** la guía 16 describe el entorno; la guía 00, sección 3, describe el flujo con issues, ramas y PR hacia `develop`.

## Referencia del estado inicial del repositorio

| Elemento disponible, según la rama actual | Resultado esperado |
|---|---|
| Proyecto inicial con el paquete **`com.villaserena.api`** | La base aprovecha el proyecto existente y conserva su paquete. |
| Configuración de Spring y placeholders de Flyway | Los perfiles `local`, `dev` y `prod` aprovechan los archivos existentes; los placeholders leen valores del entorno sin duplicar la configuración. |
| Migraciones disponibles en `src/main/resources/db/migration` | Flyway aplica las migraciones existentes; los cambios de esquema usan migraciones nuevas coordinadas por issue y PR. |
| `openapi.yaml` (contrato del API) | El proyecto reutiliza el contrato; cualquier evolución se coordina mediante issue y PR con sus consumidores. |

**Antes de arrancar el API**, tu `.env` necesita tres valores para los datos de prueba: `DEMO_PASSWORD_HASH`, `CANAL1_KEY_HASH` y `CANAL2_KEY_HASH`. Cómo generarlos: guía 16, sección 2.4. Sin ellos, Flyway se detiene con el error "No value provided for placeholder".

## Referencias para la tarea

La lectura se limita a las secciones necesarias para la issue. AGENTS.md contiene los acuerdos de colaboración; estas referencias se amplían solo si hay una dependencia o discrepancia.

- `AGENTS.md`
- `14 - Tecnologias y Arquitectura.md` (secciones 2, 4.1, 5, 6 y 7)
- `07 - Estados.md` (sección 10, reglas generales del historial)

El agente presenta un plan breve y continúa con el trabajo autorizado. La implementación puede adaptarse a la estructura existente; el resultado cumple los criterios siguientes.

## Resultado esperado

```text
Contexto: repositorio villa-serena-api del proyecto Villa Serena (acuerdos en AGENTS.md
y referencias pertinentes de la tarea). Comunicación en español.

Objetivo: completar el proyecto base del backend, sin lógica de negocio todavía.

La base aprovecha el proyecto y la configuración existentes, con el paquete
com.villaserena.api y los placeholders de Flyway. El esquema y los datos de
OBJ-0C pueden incorporarse después; la existencia de migraciones no es un
requisito para comenzar OBJ-0B. La verificación conjunta utiliza el esquema disponible.

Estado esperado del proyecto:
1. Proyecto Maven con Spring Boot 4.1 y Java 21 (con ./mvnw). Paquete raíz
   com.villaserena.api y los paquetes vacíos de la sección 7 del documento 14
   (config, auth, reservas, estadia, roomservice, piso, personal, catalogos,
   facturacion, canal, notificaciones, comun; sin inventario, que es Nivel 2).
2. Dependencias: spring-boot-starter-webmvc, -data-jpa, -validation, -flyway
   (con flyway-database-postgresql), -actuator, -security-oauth2-resource-server
   (la configuración de seguridad corresponde a OBJ-0D), driver de PostgreSQL,
   micrometer-registry-prometheus y springdoc-openapi para Spring Boot 4.
   Una incompatibilidad de versión queda registrada como issue con su impacto.
3. Configuración por perfiles local, dev y prod, con placeholders existentes y
   lectura del .env mediante spring.config.import=optional:file:.env[.properties];
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
   historial_estados según el esquema disponible de OBJ-0C y el servicio
   HistorialEstadoService.registrar(tipoEntidad, idEntidad, estadoAnterior,
   estadoNuevo, tipoResponsable, idResponsable, motivo). La configuración utiliza
   spring.jpa.hibernate.ddl-auto=validate: Hibernate nunca crea ni cambia tablas.
8. springdoc: Swagger UI en /swagger-ui.html y JSON en /v3/api-docs.
9. .env.example (sin valores reales), .gitignore con .env y README.md con los
   pasos para arrancar.

Hasta integrar OBJ-0D, una configuración temporal permite /actuator/**,
/swagger-ui/** y /v3/api-docs/** sin sesión, identificada con un TODO de OBJ-0D.

Fuera de alcance:
- Los cambios de esquema se coordinan mediante issues y PR; las migraciones
  ya aplicadas permanecen intactas.
- Endpoints de negocio, WebSocket, Stripe y correo pertenecen a otros objetivos.
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

Después de integrar la PR en `develop` y verificar el resultado, la issue queda actualizada o cerrada y la casilla correspondiente de `17 - Avance del Proyecto.md` incluye el número de PR (guía 00, sección 3). Si hay un bloqueo, Alex facilita su resolución; el avance puede actualizarlo quien completó la tarea.
