# Contribuir a la documentación de Villa Serena

Esta guía describe cómo trabajar una issue de documentación, desde su preparación hasta el cierre. Empieza por el [README.md](README.md) y consulta la guía de metodología en [01-metodologia/scrumban.md](01-metodologia/scrumban.md).

Al participar en el proyecto, sigue el [Código de conducta](CODE_OF_CONDUCT.md).

## 1. Preparar la issue

Antes de programar o editar documentos:

1. Lee la descripción, los criterios de aceptación y las conversaciones de la issue.
2. Revisa el código o documento actual para confirmar qué falta y qué ya existe.
3. Identifica el objetivo (`OBJ-`), las historias de usuario (`HU-`) y las reglas relacionadas cuando apliquen.
4. Comprueba dependencias: contrato, migraciones, endpoints o PR de otro repositorio. Enlaza esas dependencias en la issue.
5. Asígnate la issue o comenta que la tomarás para evitar trabajo duplicado. Si el resultado esperado es ambiguo, acláralo antes de implementar esa parte.

Una issue lista para trabajar debe indicar el problema, el resultado esperado, el alcance y criterios verificables. Para errores, agrega pasos de reproducción, resultado actual y esperado. Si falta información, completa la issue antes de darla por resuelta.

Si el cambio afecta varios repositorios, utiliza una issue y un PR por repositorio y enlázalos entre sí. Los números de issue son propios de cada repositorio.

## 2. Crear una rama

En este repositorio de documentación, el flujo de integración es **rama de trabajo → PR a `main` → revisión e integración**. Actualmente no existe `dev` ni `develop` en docs. Esta excepción corresponde a docs; cada repositorio de código conserva su rama de integración acordada.

Crea una rama por tarea desde `main` actualizado. No edites directamente `main`. Ejemplo:

```bash
git status
git fetch origin
git switch main
git pull --ff-only origin main
git switch -c docs/12-descripcion-corta
```

Conserva cualquier trabajo pendiente antes de cambiar de rama; no lo descartes ni lo mezcles con otra issue.

Usa `feat/<numero>-<descripcion>` para funcionalidades, `fix/...` para errores, `docs/...` para documentación o `chore/...` para mantenimiento. Las ramas existentes con nombres `obj...` pueden conservarse; vincula su PR con la issue.

## 3. Implementar y verificar

- Limita el cambio a los criterios de aceptación. Registra otros hallazgos en una issue aparte.
- Sigue las convenciones y versiones del repositorio. Evita refactors o actualizaciones de dependencias ajenos a la tarea.
- Coordina cambios a piezas compartidas, especialmente migraciones y contrato OpenAPI, con sus responsables. La fuente del contrato es [`openapi.yaml`](openapi.yaml) en docs; sus actualizaciones se tramitan mediante issues de docs siguiendo la [guía del contrato](03-arquitectura/contrato-api.md).
- Agrega o ajusta pruebas cuando el comportamiento lo requiera. Recorre los criterios de aceptación y registra evidencia del resultado.
- Actualiza la documentación que cambie con el comportamiento.
- Mantén fuera de Git las claves, contraseñas, archivos `.env`, datos personales reales y archivos generados locales.

Si utilizas IA, dale la issue y las referencias necesarias, revisa su propuesta y verifica lo que produce. El responsable de la entrega comprueba el alcance, el diff y los resultados; una respuesta de la IA no sustituye las pruebas.

## Comprobaciones de documentación

- Contrasta los cambios con las historias de usuario vigentes y sus criterios de aceptación. Conserva los identificadores `ALC-`, `HU-`, `RN-`, `RF-`, `UC-`, `AD-` y `PAR-`; no los renombres ni reutilices.
- Mantén consistentes los estados, reglas, permisos, requisitos, casos de uso y arquitectura afectados. Busca referencias con `rg` antes de cambiar una decisión compartida.
- Comprueba enlaces relativos, rutas, nombres de archivos, tablas y listas en la vista previa de Markdown. Para nombres con espacios, usa destinos de enlace codificados o entre `< >`.
- Distingue alcance acordado, propuesta, implementación y pendiente. Vincula los PR como evidencia de avance; una propuesta escrita no demuestra que la función esté implementada.
- Si cambias una decisión, explica el motivo y los documentos o repositorios afectados. Si una discrepancia requiere decisión del equipo, descríbela en la issue antes de darla por resuelta.
- Para el contrato, ejecuta `pnpm install --frozen-lockfile` y `pnpm check`: valida el YAML, sus referencias y la generación de tipos, y ejecuta las pruebas de las herramientas. El workflow `Contrato API` lo comprueba en CI. Los consumidores generan desde docs sin copiar el YAML; la conformidad de la implementación se verifica además en sus propias tareas. Usa `git diff --check` y revisión de contenido y enlaces; registra la verificación realizada en el PR.

## 4. Guardar y abrir el pull request

Revisa los archivos y agrega únicamente los correspondientes a la issue:

```bash
git diff
git diff --check
git status --short
git add CONTRIBUTING.md
git diff --cached
git commit -m "docs: agregar guia de contribucion (#12)"
git push -u origin HEAD
```

El archivo y mensaje son ejemplos: sustitúyelos por los de tu tarea. Usa mensajes que expliquen el cambio, como `feat: ... (#12)` o `fix: ... (#12)`.

Abre el PR de la issue con **base: `main`** y **compare: tu rama de trabajo**. Incluye:

- Problema y comportamiento resultante.
- Issue relacionada y dependencias en otros repositorios.
- Criterios de aceptación cubiertos.
- Cómo lo probaste: comandos, resultados y capturas si hay cambios visuales.
- Limitaciones o criterios pendientes, si existen.

Puedes usar esta descripción:

```markdown
## Cambio
Qué problema resuelve y qué comportamiento queda.

## Issue
Relacionado con #12

## Validación
- [ ] Criterios de aceptación verificados.
- [ ] Comprobaciones aplicables ejecutadas; comandos y resultados adjuntos.
- [ ] Documentación actualizada cuando corresponde.

## Dependencias y pendientes
Enlaces a PR/issues relacionados o "Ninguno".
```

En docs, enlaza la issue en la PR hacia `main`; usa `Closes #12` solo cuando se cumpla todo el alcance. Comprueba su cierre después de integrar. Los cambios de otros repositorios se enlazan por su URL y conservan su propio seguimiento.

## 5. Revisar, integrar y cerrar

Solicita revisión a otro integrante, atiende sus observaciones y confirma que la PR se dirija a `main`. Verifica el diff, los enlaces y los criterios aplicables antes de integrar. Conserva evidencia de los cambios de contrato y de las tareas pendientes en sus consumidores; no declares completada una integración funcional solo porque se haya actualizado documentación.

Si aparece un bloqueo, registra evidencia, dependencia y trabajo pendiente en la issue y conserva los avances.
