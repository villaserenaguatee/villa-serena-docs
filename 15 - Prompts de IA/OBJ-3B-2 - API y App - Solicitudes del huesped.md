# OBJ-3B-2 — API y App: solicitudes del huésped

| Dato | Valor |
|---|---|
| Objetivo | 3B — Limpieza y mantenimiento (documento 13) |
| Repositorios | `villa-serena-api` (parte A) y `villa-serena-movil` (parte B) |
| Responsable | Carlos |
| Horas estimadas | 4,5 h (API 2 h; app 2,5 h) |
| Cubre | HU-HUE-12 a HU-HUE-14 y HU-MYL-04 y HU-MYL-05 (lado API); HU-HUE-12 a HU-HUE-14 (lado app) |
| Depende de | OBJ-3A-1 (WebSocket de Hugo: evento 3), OBJ-3A-2 (tu push) y contrato parte 2 |
| Calendario | Mié 7: API. Jue 8: app |

> **Antes de empezar:** prepara tu computadora con la `16 - Guia de Arranque del Proyecto.md`. Para crear tu rama y subir tu trabajo con un pull request, sigue la sección 3 de `00 - Como usar los prompts.md`. Son dos repositorios: una rama y un pull request en cada uno.

## Documentos que debes adjuntar a la IA

- `AGENTS.md`
- `openapi.yaml`
- `HU - Cliente y Huesped.md` (HU-HUE-12 a 14) y `HU - Mantenimiento y Limpieza.md` (HU-MYL-04 y 05)
- `07 - Estados.md` (sección 7)
- `08 - Inventario Turnos y Personal.md` (sección 5: catálogo de artículos)

## Prompt — Parte A: API (en `villa-serena-api`)

```text
Trabajas en el repositorio villa-serena-api del proyecto Villa Serena (lee AGENTS.md
y los documentos adjuntos). Responde en español. Paquete piso (solicitudes).

1. Huésped (solo su reserva EN_ESTADIA; ajenas = 404):
   - Solicitar limpieza (HU-HUE-12) con comentario opcional. Una sola solicitud de
     limpieza PENDIENTE o EN_PROCESO por habitación (409 con mensaje). No cambia
     la condición de la habitación.
   - Solicitar artículos (HU-HUE-13) del catálogo (datos iniciales) respetando la
     cantidad máxima de cada artículo. No descuenta inventario.
   - Ver sus solicitudes (HU-HUE-14) y cancelar solo las PENDIENTE.
2. Personal (MANTENIMIENTO_LIMPIEZA con área LIMPIEZA o AMBAS):
   - Lista PENDIENTE y EN_PROCESO por antigüedad, con habitación, piso, tipo, hora,
     estado, empleado a cargo y artículos con cantidades (HU-MYL-04).
   - Tomar: PENDIENTE → EN_PROCESO a su nombre; si otro ya la tomó o fue cancelada,
     409 con el motivo.
   - Atender (HU-MYL-05): solo el empleado a cargo, EN_PROCESO → ATENDIDA; si ya
     está CANCELADA, 409.
3. Eventos: al crear, evento 3 en /topic/solicitudes (método que dejó Hugo). Al
   pasar a ATENDIDA, push "Tu solicitud fue atendida" por el Outbox.
4. Historial de cada cambio. Pruebas de las reglas y de permisos por área.
No crees migraciones: pídeselas a Josué.
```

## Prompt — Parte B: app (en `villa-serena-movil`)

```text
Trabajas en el repositorio villa-serena-movil (Expo SDK 54). Responde en español.
Copia openapi.yaml y regenera los tipos.

Pantallas de solicitudes, solo activas con la reserva EN_ESTADIA:
1. Solicitar limpieza (HU-HUE-12) con comentario opcional; si ya hay una en curso,
   muestra el mensaje del API.
2. Solicitar artículos (HU-HUE-13): lista del catálogo con selector de cantidad que
   no pasa del máximo.
3. Mis solicitudes (HU-HUE-14): tipo, fecha, hora y estado; se recarga al abrir y
   al deslizar; botón "Cancelar" solo en PENDIENTE (si no, muestra el motivo).
4. Al tocar el push de solicitud atendida, abre esta lista.
No agregues tiempo real en esta pantalla (se actualiza al abrir y al deslizar).
```

## Cómo saber que quedó terminado

1. Una solicitud creada en la app aparece en vivo en la pantalla de Limpieza de Kim.
2. Una segunda solicitud de limpieza para la misma habitación muestra el mensaje de "ya hay una en curso".
3. Al atenderla, el huésped recibe el push y la ve `ATENDIDA` al recargar.

## Al terminar

Cuando todo lo de "Cómo saber que quedó terminado" funcione, pega esto a la IA:

```text
Terminamos esta tarea. Muéstrame git status y confirma que no se sube ningún .env
ni claves. Luego haz commit, push y abre el pull request a main con un título que
EMPIECE con "OBJ-3B-2:" (por ejemplo "OBJ-3B-2: <resumen corto>"). En la descripción
pon qué se hizo, cómo se probó y la lista de tareas de "17 - Avance del Proyecto.md"
con código OBJ-3B-2 que quedan completas.
```

Pide a un compañero que revise el PR. No marques el archivo 17: Josué lo actualiza una vez al día.
