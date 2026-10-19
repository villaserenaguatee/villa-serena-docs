# 00 — Cómo usar los prompts

> **Para qué sirve:** guía paso a paso para que cada integrante use su prompt con la IA, aunque no tenga experiencia con estas tecnologías.
> **Basado en:** 13 — Plan de Trabajo y 14 — Tecnologías y Arquitectura.
> **Comandos de ejemplo:** Git usa los mismos comandos en Windows, macOS y Linux. La guía 16, sección 1.1, indica las variantes de Maven Wrapper y archivos de entorno. El agente adapta los ejemplos a la terminal de la persona.
> **Antes de esta guía:** `16 - Guia de Arranque del Proyecto.md` (preparar la computadora y encender el proyecto).

---

## 1. Antes de empezar

Prepara tu computadora con la **`16 - Guia de Arranque del Proyecto.md`** (en la raíz de la documentación): qué instalar, cómo clonar los repositorios, cómo crear tu `.env` y cómo encender el proyecto cada día.

## 2. Objetivos y reparto inicial del trabajo

Las asignaciones de esta tabla son una referencia del plan. Las issues vigentes, sus prioridades y las indicaciones de la persona determinan el trabajo actual; las tareas pueden cambiar de integrante.

| Prompt | Repositorio | Responsable | Horas | Cuándo |
|---|---|---|---|---|
| Preparar los 5 repositorios (sección 6 de esta guía, no es prompt) | Todos | Alex | 1 | Jue 1 (opcional) o Vie 2 |
| OBJ-0A — Infra: Docker local | `villa-serena-infra` | Josué | 2 | Jue 1 (opcional) o Vie 2 |
| OBJ-0B — API: proyecto base | `villa-serena-api` | Hugo | 2 | Jue 1 (opcional) o Vie 2 |
| OBJ-0C — API: esquema y datos iniciales | `villa-serena-api` | Josué | 5 | Vie 2 y Lun 5 |
| OBJ-0D — API: seguridad y JWT | `villa-serena-api` | Pablo | 4 | Vie 2 y Lun 5 |
| OBJ-0E — Web: proyecto base y BFF | `villa-serena-web` | Alex (y Kim, diseño base) | 3,5 + 1 | Jue 1 (opcional), Vie 2 |
| OBJ-0F — Móvil: proyecto base | `villa-serena-movil` | Carlos | 1 + 1 (push, Vie 2) | Jue 1 (opcional) y Vie 2 |
| OBJ-0G — API: contrato OpenAPI (parte 1 y parte 2) | `villa-serena-api` | Josué (Pablo y Hugo revisan) | 3 | Vie 2 (parte 1) y Lun 5 (parte 2) |

**Prompts de los demás objetivos ya disponibles:**

| Prompt | Repositorio | Responsable | Horas | Cuándo |
|---|---|---|---|---|
| OBJ-1C — API: correo de confirmación y canal | `villa-serena-api` | Hugo | 2,5 | Vie 2 |
| OBJ-1E — Web: resultado del pago y canal simulado | `villa-serena-web` | Alex | 2,5 | Vie 2 y Lun 5 |
| OBJ-4C — Web: cuenta, check-out e impresión | `villa-serena-web` | Kim | 3 | Vie 2 (datos de prueba) y Jue 8 (conectar) |
| OBJ-1A — API: hotel, catálogo, diseño del canal y guía de Stripe CLI | `villa-serena-api` y `villa-serena-docs` | Josué | 2,5 | Mar 6 y Jue 8 |
| OBJ-1B — API: disponibilidad, reserva, cargos y Stripe | `villa-serena-api` | Pablo | 5,5 | Lun 5 a Mié 7 |
| OBJ-1D — Web: web pública, búsqueda y formulario de reserva | `villa-serena-web` | Kim | 5,5 | Lun 5 y Mar 6 |
| OBJ-2C — API: habitaciones | `villa-serena-api` | Hugo | 1,5 | Lun 5 |
| OBJ-2E — Web: búsqueda, cancelación y habitaciones | `villa-serena-web` | Alex | 4 | Lun 5 y Mar 6 |
| OBJ-3A-1 — API: Room Service y WebSocket | `villa-serena-api` | Hugo | 6 | Lun 5 a Mié 7 |
| OBJ-3A-2 — API: acceso del huésped, mis reservas y push | `villa-serena-api` | Carlos | 2,5 | Lun 5 y Mar 6 |
| OBJ-3A-4 — App: acceso, estadía, pedidos y push | `villa-serena-movil` | Carlos | 6,5 | Lun 5 a Jue 8 |
| OBJ-2A — API: huéspedes, búsqueda, datos del Gantt y reservas de prueba | `villa-serena-api` | Josué | 4,5 | Mar 6 a Jue 8 |
| OBJ-2B — API: reservas de Recepción, cancelación y check-in | `villa-serena-api` | Pablo | 3,5 | Mié 7 y Jue 8 |
| OBJ-2D — Web: Gantt, reserva de Recepción y check-in | `villa-serena-web` | Kim | 6,5 | Mar 6 y Mié 7 |
| OBJ-3A-3 — Web: Room Service en vivo y cliente de tiempo real | `villa-serena-web` | Alex | 5 | Mié 7 y Jue 8 |
| OBJ-3B-1 — API: limpieza e incidencias | `villa-serena-api` | Hugo | 3,5 | Mié 7 y Jue 8 |
| OBJ-3B-2 — API y App: solicitudes del huésped | `villa-serena-api` y `villa-serena-movil` | Carlos | 4,5 | Mié 7 y Jue 8 |
| OBJ-3B-3 — Web: limpieza y solicitudes | `villa-serena-web` | Kim | 3,5 | Jue 8 |
| OBJ-3B-4 — Web: incidencias | `villa-serena-web` | Alex | 2,5 | Jue 8 |
| OBJ-4A — API: cuenta, check-out y pago desde la app | `villa-serena-api` | Pablo | 3,5 | Jue 8 |
| OBJ-4B — API: factura | `villa-serena-api` | Hugo | 2 | Mié 7 |
| OBJ-INT — Integración y prueba del flujo completo | Todos | Todos | 3 c/u | Vie 9 y Sáb 10 |
| OBJ-4D — App: cuenta y pago del saldo | `villa-serena-movil` | Carlos | 3 | Vie 2 (datos de prueba) y Jue 8 (conectar) |

Con esto están todos los prompts del plan (objetivos 0 a 4 e integración).

**Orden en el API:** OBJ-0B prepara el proyecto mínimo y su configuración; OBJ-0C incorpora el esquema y los datos iniciales. La comprobación conjunta valida el arranque con las migraciones aplicadas. La seguridad (OBJ-0D) reutiliza la base y el esquema. Las dependencias se integran en `develop` o se coordinan mediante ramas de trabajo cuando todavía están en una PR.

**Entorno compartido:** OBJ-0A proporciona Docker para las pruebas locales. El equipo puede usar un Cloudflare Tunnel temporal del backend para comprobar integraciones desde frontend, con acceso acordado y sin publicar credenciales (AGENTS.md).

El **contrato del API** (`openapi.yaml`, objetivos 0 a 2) se congela el viernes 2 y tiene su propio prompt aparte.

## 3. Flujo de trabajo con issues y Git

El ciclo es **issue → rama → implementación y verificación → PR → integración → cierre de la issue**. `develop` concentra el trabajo del equipo; `main` se reserva para la entrega del sistema terminado. Si falta `develop`, el agente propone crearla desde `main`.

### Inicio de sesión

La revisión de `git status`, la rama y `git fetch origin` permite conocer el estado antes de sincronizar. Los cambios locales se conservan. Una rama sin divergencias se actualiza con `git pull --ff-only`; una rama personal puede actualizarse mediante rebase sobre `origin/develop` cuando corresponda. El historial de una rama compartida no se reescribe unilateralmente.

### Selección de la tarea

GitHub CLI (`gh`) o el complemento/plugin permite revisar las issues, las urgentes, sus dependencias y los criterios de aceptación. El objetivo y la documentación se contrastan con la issue vigente. Las discrepancias y propuestas que requieren seguimiento quedan registradas como issues.

### Rama de trabajo

Los nombres usan `feat/`, `fix/`, `chore/`, `docs/` o `refactor/`, con la issue y el objetivo cuando ayuden a identificar la tarea. Ejemplo para una tarea nueva, con el árbol de trabajo limpio y `develop` existente:

```bat
git switch develop
git pull --ff-only
git switch -c feat/42-obj3a-room-service
```

Las tareas independientes pueden usar worktrees, cada uno con su rama. Ejemplo, con las referencias actualizadas:

```bat
git worktree add ../web-room-service -b feat/42-obj3a-room-service origin/develop
```

### Cambios y PR

La revisión previa al commit comprende el diff, los criterios de aceptación y la ausencia de secretos. El commit incluye los archivos de la tarea; los archivos ajenos permanecen fuera. Ejemplo, donde `<archivos-de-la-tarea>` representa las rutas que se van a incluir:

```bat
git status
git diff
git add <archivos-de-la-tarea>
git commit -m "feat: agrega cola de pedidos de Room Service"
git push -u origin feat/42-obj3a-room-service
```

La PR usa **base: develop**, enlaza la issue y explica el resultado y la verificación. Otro integrante revisa los cambios antes de integrarlos. Las dudas y los bloqueos se llevan a Alex para facilitar su resolución; Kimberly decide sobre el alcance y la aceptación del producto.

Después de integrar y verificar, se actualiza la issue y la casilla pertinente de `17 - Avance del Proyecto.md`, con el número de PR. Si `develop` es la rama predeterminada, `Closes #42` permite el cierre automático; en otro caso, la issue se cierra explícitamente al comprobar la integración.

La rama puede conservarse hasta confirmar que su trabajo está integrado. La limpieza de ramas es opcional y no utiliza borrado forzado para ocultar cambios pendientes.

## 4. El `.env` y el entorno local

Está en la **`16 - Guia de Arranque del Proyecto.md`**: qué es el `.env` y cómo crearlo (sección 2.2), qué servicios corren en Docker (sección 3), cómo encender el proyecto cada día (sección 4) y cómo apagarlo (sección 6).

## 5. Colaboración con la IA

`AGENTS.md` y `CLAUDE.md` en la raíz del repositorio aportan los acuerdos de trabajo. La persona indica la issue o el resultado esperado; el prompt del objetivo y sus referencias aportan los criterios funcionales y técnicos.

La lectura se limita a los archivos y secciones necesarios. Las listas de documentos de cada objetivo son referencias disponibles, no una obligación de adjuntar todo. El agente amplía el contexto cuando una dependencia o discrepancia lo requiere.

El agente presenta un plan breve y continúa con el trabajo autorizado. Puede resolver decisiones técnicas rutinarias sin otra aprobación. La persona conserva el control: puede corregir el rumbo, pedir explicaciones o detener el trabajo. Las decisiones de alcance o de impacto importante se consultan y se registran en issues cuando requieren seguimiento.

Las explicaciones se presentan en español, por bloques breves, adaptadas a la experiencia y al entorno de la persona. Los errores se investigan con la información pertinente y sin compartir secretos. Los criterios de aceptación permiten comprobar el resultado; el informe distingue qué se verificó y qué quedó pendiente.

**Ejemplos para iniciar o orientar una sesión:**

- *"Trabajamos en la issue #42; el resultado esperado está en OBJ-3A-3."*
- *"Presenta un plan breve y continúa con la implementación de la tarea."*
- *"Necesito entender este cambio; explícalo en palabras simples."*
- *"La solución mantiene las versiones acordadas y los criterios de la issue."*
- *"Los comandos corresponden a mi sistema y terminal: <entorno>."*

## 6. Preparación de los repositorios

Los cinco repositorios son `villa-serena-docs`, `villa-serena-infra`, `villa-serena-api`, `villa-serena-web` y `villa-serena-movil`. La preparación se coordina en issues y PR, sin exclusividad por integrante.

Cada repositorio cuenta con README de arranque, archivos de entorno de ejemplo sin secretos, reglas de Git apropiadas y las instrucciones compartidas `AGENTS.md` y `CLAUDE.md`. Las ramas `main` y `develop` tienen protección mediante PR y revisión; el equipo cuenta con los accesos necesarios. Si falta `develop`, se propone crearla desde `main`. Cambiar la rama predeterminada es una decisión del equipo.

## 7. Revisión del resultado

| Aspecto | Resultado esperado |
|---|---|
| Alcance | Cumple los criterios de la issue y los acuerdos del producto; distingue ajustes técnicos de nuevas funcionalidades. |
| Versiones | Mantiene las versiones acordadas; una propuesta de actualización tiene su issue e impacto explicado. |
| Seguridad | Los cambios versionados y los logs están libres de secretos y los permisos siguen aplicándose. |
| Integración | Los cambios de esquema, contrato, seguridad y tiempo real consideran sus consumidores y se coordinan mediante issues y PR. |
| Verificación | Los criterios de aceptación y comprobaciones pertinentes pasan; las limitaciones quedan informadas. |

## 8. Errores comunes

Están en la **`16 - Guia de Arranque del Proyecto.md`**, sección 7.

## 9. Si te atrasas

No trabajes más de 3 h en un día seguro. Avisa en la reunión diaria qué quedó pendiente; el martes 6 se decide si se aplica algún recorte de reserva (documento 13, sección 9.2).
