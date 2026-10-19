# OBJ-0A — Infra: Docker local

| Dato | Valor |
|---|---|
| Objetivo | 0 — Base (documento 13) |
| Repositorio | `villa-serena-infra` |
| Responsable inicial | Josué |
| Horas estimadas | 2 h |
| Cubre | Tareas técnicas: entorno local con Docker (ALC-TRA-10) y Grafana en local (ALC-TRA-09, AD-15) |
| Depende de | Nada. Puede hacerse el jueves 1 por la noche (opcional) |

> **Referencias de trabajo:** la guía 16 describe el entorno; la guía 00, sección 3, describe el flujo con issues, ramas y PR hacia `develop`.

## Referencias para la tarea

La lectura se limita a las secciones necesarias para la issue. AGENTS.md contiene los acuerdos de colaboración; estas referencias se amplían solo si hay una dependencia o discrepancia.

- `AGENTS.md`
- `14 - Tecnologias y Arquitectura.md` (secciones 3.1, 4.4, 4.5 y 8)

El agente presenta un plan breve y continúa con el trabajo autorizado. La implementación puede adaptarse a la estructura existente; el resultado cumple los criterios siguientes.

## Resultado esperado

```text
Contexto: repositorio villa-serena-infra del proyecto Villa Serena (acuerdos en AGENTS.md
y secciones pertinentes del documento 14). Comunicación en español.

Objetivo: dejar listo el entorno local del hito con Docker Compose.

Entregables esperados:
1. docker-compose.dev.yml con estos servicios y volúmenes persistentes:
   - postgres: PostgreSQL 17. Base, usuario y contraseña desde variables del .env.
     Puerto 5432. La extensión btree_gist la crea Flyway desde el API, no aquí.
   - mailpit: SMTP en 1025 e interfaz web en 8025.
   - minio: API en 9000 y consola en 9001. Un servicio de inicio (por ejemplo
     minio/mc) que cree dos buckets: uno público (fotos del hotel, habitaciones,
     menú) y uno privado (PDF de facturas y fotos de incidencias). Nombres desde .env.
   - prometheus: puerto 9090; lee las métricas del API en
     host.docker.internal:8080/actuator/prometheus cada 15 s (el API corre fuera
     de Docker, en la computadora). En Linux incluye extra_hosts host-gateway.
   - grafana: puerto 3001 (el 3000 es de la web). Datasource de Prometheus y un
     tablero aprovisionados desde archivos.
2. prometheus/prometheus.yml.
3. grafana/provisioning/ (datasource y dashboards) y grafana/dashboards/api.json
   con un tablero mínimo: estado del API (up), peticiones por segundo, errores
   HTTP 4xx y 5xx, CPU y memoria de la JVM. Métricas estándar de Micrometer.
4. .env.example con todas las variables (sin valores reales) y .gitignore con .env.
5. README.md: cómo arrancar, URLs de cada servicio y cómo apagar y borrar datos.

Fuera de alcance:
- API, web y app corren fuera de Docker durante el hito.
- Loki, alertas y despliegue en VPS o Cloudflare quedan para después; los workflows
  de colaboración y Tunnel temporal se rigen por AGENTS.md.
- Los archivos versionados están libres de secretos reales.
```

## Cómo saber que quedó terminado

1. `docker compose -f docker-compose.dev.yml up -d` levanta los 5 servicios sin errores (`docker compose ps`).
2. Mailpit abre en http://localhost:8025 y la consola de MinIO en http://localhost:9001, con los dos buckets creados.
3. Grafana abre en http://localhost:3001 con el tablero del API (sin datos hasta que el API arranque).
4. Cuando Hugo termine OBJ-0B y el API corra, Prometheus (http://localhost:9090/targets) muestra el objetivo del API en estado "UP" y el tablero de Grafana muestra datos.
5. `git status` no muestra ningún `.env`.

## Al terminar

Después de integrar la PR en `develop` y verificar el resultado, la issue queda actualizada o cerrada y la casilla correspondiente de `17 - Avance del Proyecto.md` incluye el número de PR (guía 00, sección 3). Si hay un bloqueo, Alex facilita su resolución; el avance puede actualizarlo quien completó la tarea.
