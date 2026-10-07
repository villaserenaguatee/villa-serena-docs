# OBJ-0A — Infra: Docker local

| Dato | Valor |
|---|---|
| Objetivo | 0 — Base (documento 13) |
| Repositorio | `villa-serena-infra` |
| Responsable | Josué |
| Horas estimadas | 2 h |
| Cubre | Tareas técnicas: entorno local con Docker (ALC-TRA-10) y Grafana en local (ALC-TRA-09, AD-15) |
| Depende de | Nada. Puede hacerse el jueves 1 por la noche (opcional) |

> **Antes de empezar:** prepara tu computadora con la `16 - Guia de Arranque del Proyecto.md` (instalar, `.env` y encender Docker). Para crear tu rama y subir tu trabajo con un pull request, sigue la sección 3 de `00 - Como usar los prompts.md`.

## Documentos que debes adjuntar a la IA

- `AGENTS.md`
- `14 - Tecnologias y Arquitectura.md` (secciones 3.1, 4.4, 4.5 y 8)

## Prompt

```text
Trabajas en el repositorio villa-serena-infra del proyecto Villa Serena (lee AGENTS.md
y el documento 14 adjunto). Responde en español.

Objetivo: dejar listo el entorno local del hito con Docker Compose.

Crea:
1. docker-compose.dev.yml con estos servicios y volúmenes persistentes:
   - postgres: PostgreSQL 17. Base, usuario y contraseña desde variables del .env.
     Puerto 5432. La extensión btree_gist la crea Flyway desde el API, no aquí.
   - mailpit: SMTP en 1025 e interfaz web en 8025.
   - minio: API en 9000 y consola en 9001. Un servicio de inicio (por ejemplo
     minio/mc) que cree dos buckets: uno público (fotos del hotel, habitaciones,
     menú) y uno privado (PDF de facturas y fotos de incidencias). Nombres desde .env.
   - prometheus: puerto 9090; lee las métricas del API en
     host.docker.internal:8080/actuator/prometheus cada 15 s (el API corre fuera
     de Docker, en la computadora). Agrega extra_hosts host-gateway para Linux.
   - grafana: puerto 3001 (el 3000 es de la web). Datasource de Prometheus y un
     tablero aprovisionados desde archivos.
2. prometheus/prometheus.yml.
3. grafana/provisioning/ (datasource y dashboards) y grafana/dashboards/api.json
   con un tablero mínimo: estado del API (up), peticiones por segundo, errores
   HTTP 4xx y 5xx, CPU y memoria de la JVM. Métricas estándar de Micrometer.
4. .env.example con todas las variables (sin valores reales) y .gitignore con .env.
5. README.md: cómo arrancar, URLs de cada servicio y cómo apagar y borrar datos.

No hagas:
- No agregues el API, la web ni la app como servicios (corren fuera de Docker).
- No agregues Loki, alertas, Cloudflare, VPS ni CI/CD (son para después).
- No escribas secretos reales en ningún archivo que se suba.

Primero muéstrame el plan de archivos; después créalos.
```

## Cómo saber que quedó terminado

1. `docker compose -f docker-compose.dev.yml up -d` levanta los 5 servicios sin errores (`docker compose ps`).
2. Mailpit abre en http://localhost:8025 y la consola de MinIO en http://localhost:9001, con los dos buckets creados.
3. Grafana abre en http://localhost:3001 con el tablero del API (sin datos hasta que el API arranque).
4. Cuando Hugo termine OBJ-0B y el API corra, Prometheus (http://localhost:9090/targets) muestra el objetivo del API en estado "UP" y el tablero de Grafana muestra datos.
5. `git status` no muestra ningún `.env`.

## Al terminar

Cuando todo lo de "Cómo saber que quedó terminado" funcione, pega esto a la IA:

```text
Terminamos esta tarea. Muéstrame git status y confirma que no se sube ningún .env
ni claves. Luego haz commit, push y abre el pull request a main con un título que
EMPIECE con "OBJ-0A:" (por ejemplo "OBJ-0A: <resumen corto>"). En la descripción
pon qué se hizo, cómo se probó y la lista de tareas de "17 - Avance del Proyecto.md"
con código OBJ-0A que quedan completas.
```

Pide a un compañero que revise el PR. No marques el archivo 17: Josué lo actualiza una vez al día.
