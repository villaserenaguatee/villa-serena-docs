# AGENTS.md — Villa Serena Docs

## Trabajo con el equipo

La comunicación es en español, clara y breve. La persona dirige la sesión; el agente analiza, implementa y verifica el alcance autorizado. Kimberly decide prioridades, alcance y aceptación de producto; Alex facilita la resolución de dudas y bloqueos; las decisiones técnicas se coordinan con el equipo de desarrollo.

Al comenzar, revisa rama, cambios locales e instrucciones aplicables. Actualiza referencias con `git fetch` cuando sea posible y sincroniza sin perder trabajo ni reescribir ramas compartidas. Lee solo los archivos y secciones necesarios. Si hay una issue indicada, contrasta sus criterios con la documentación y el código; no revises tareas ajenas al alcance por defecto. Las indicaciones explícitas de la sesión tienen prioridad.

Presenta un plan breve y continúa el trabajo autorizado. Resuelve decisiones rutinarias siguiendo las convenciones existentes. Consulta cambios de alcance, contradicciones sin evidencia suficiente o acciones destructivas no autorizadas. No publiques secretos ni datos personales reales.

## Rama de integración de docs

En **este repositorio**, las ramas de trabajo parten de `main` y las PR se dirigen a `main`. No se requiere crear `develop` ni `dev` en docs. Este acuerdo no modifica las ramas de integración de API, web, móvil o infra.

Usa `docs/`, `fix/`, `chore/` o el tipo apropiado. Los commits describen el cambio en español. Conserva los cambios existentes y no integres una PR sin la revisión correspondiente. Consulta [CONTRIBUTING.md](CONTRIBUTING.md).

## Fuente de verdad del contrato

- **`openapi.yaml` de la raíz de villa-serena-docs es el único contrato canónico**, en OpenAPI 3.1. No se mantienen copias YAML/JSON del contrato en API, web ni móvil.
- Las actualizaciones del contrato se tramitan mediante **issues de villa-serena-docs** y PR revisadas con los consumidores afectados. El cambio documenta rutas, DTO, validaciones, errores, autenticación, permisos y compatibilidad relevantes.
- Un endpoint o una pantalla existente es evidencia que debe reconciliarse con el acuerdo. No declares conformidad solo porque el código existe, compila o genera Swagger. Distingue comportamiento acordado, implementado y comprobado.
- El contrato también contiene `x-websocket`. Los tipos HTTP generados no implementan las conexiones, tickets, destinos ni autorización de tiempo real.
- Los PDF y los archivos de `historico` e `historial-prompts` son referencias históricas. Si indican que el contrato vive en API o que deben copiarse sus YAML, aplica el enfoque actual descrito aquí.
- No deduzcas datos personales ni inventes valores para satisfacer validaciones. No relajes permisos para ajustar una demostración.

## Consumo por API, web y móvil

La [guía del contrato](03-arquitectura/contrato-api.md) define herramientas, comandos y pendientes. Docs contiene la generación de tipos y la comprobación de rutas; los consumidores usan un checkout de docs en un **commit fijo** y sus dependencias instaladas con el lockfile.

- **Web y móvil:** generan TypeScript directamente desde el YAML de docs mediante `scripts/contrato-api.mjs types --output RUTA/schema.d.ts`. Pueden versionar los tipos generados; no los editan manualmente ni copian el YAML. CI debe ejecutar la misma generación con `--check`.
- **API:** implementa el contrato mediante controladores, DTO, reglas y seguridad. Puede exportar su OpenAPI generado como artefacto temporal para contrastarlo con docs; no lo trata como otra fuente canónica ni lo versiona como tal.
- **Versionado de consumidores:** sus scripts y CI deben identificar el commit completo de docs utilizado y actualizarlo deliberadamente. No generar contra `main` cambiante ni descargar el contrato en tiempo de ejecución de la aplicación. La huella SHA-256 identifica el contenido exacto.
- **Conformidad:** `check-api` detecta diferencias de rutas y métodos. Se necesitan además pruebas de DTO, validación, respuestas y autorización. No presentes ese comando como validación completa de Spring.
- La web mantiene el patrón BFF y los tokens en cookies httpOnly. El WebSocket directo usa un ticket temporal obtenido a través del BFF. La app consume Spring directamente y guarda sus tokens en `expo-secure-store`.

## Verificación y entrega

Desde docs, con Node.js 24 y pnpm 12:

```bash
pnpm install --frozen-lockfile
pnpm check
```

`pnpm check` valida el OpenAPI, comprueba su generación TypeScript y prueba las herramientas. Revisa también `git diff --check`, enlaces y coherencia de los documentos afectados. El workflow `.github/workflows/contrato-api.yml` ejecuta las comprobaciones en PR y cambios de `main`.

Las versiones de producto acordadas son Spring Boot 4.1, Java 21, PostgreSQL 17, Next.js 15, React 19 y Expo SDK 54. No las cambies incidentalmente. Los instantes se guardan en UTC y las fechas de estadía no llevan hora; presentación y cálculos del negocio usan `America/Guatemala`.

Al entregar, indica qué cambió, cómo se verificó y qué consumidores o criterios quedan pendientes. Enlaza issues y PR relacionadas sin declarar resueltas tareas de otros repositorios por una actualización de documentación.
