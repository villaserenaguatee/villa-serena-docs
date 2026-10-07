# OBJ-2A — API: huéspedes, búsqueda, datos del Gantt y reservas de prueba

| Dato | Valor |
|---|---|
| Objetivo | 2 — Recepción (documento 13) |
| Repositorio | `villa-serena-api` |
| Responsable | Josué |
| Horas estimadas | 4,5 h (reservas de prueba 1 h; huéspedes 1 h; búsqueda y Gantt 1,5 h; prueba de punta a punta 1 h) |
| Cubre | HU-REC-01, HU-REC-02, HU-REC-06, HU-REC-08 y HU-CM-02 (lado API) |
| Depende de | OBJ-0C (tablas), OBJ-0D (seguridad), OBJ-1B (servicio de reservas de Pablo) y contrato parte 1 (OBJ-0G) |
| Calendario | Mar 6: huéspedes y comenzar la búsqueda. Mié 7: búsqueda, datos del Gantt y reservas de prueba. Jue 8: prueba de punta a punta |

> **Antes de empezar:** prepara tu computadora con la `16 - Guia de Arranque del Proyecto.md`. Para crear tu rama y subir tu trabajo con un pull request, sigue la sección 3 de `00 - Como usar los prompts.md`.

## Documentos que debes adjuntar a la IA

- `AGENTS.md`
- `openapi.yaml`
- `HU - Recepcionista.md` (HU-REC-01, 02, 06 y 08) y `HU - Channel Manager.md` (HU-CM-02)
- `07 - Estados.md` (sección 3)
- `09 - Matriz de Permisos.md` (secciones 3.1 y 6)

## Prompt

```text
Trabajas en el repositorio villa-serena-api del proyecto Villa Serena (lee AGENTS.md
y los documentos adjuntos). Responde en español. Estas consultas son de solo
lectura sobre reservas (el módulo de reservas es de Pablo; no cambies sus clases).

1. Huéspedes (HU-REC-01): registrar con los 6 datos obligatorios; el correo
   identifica al huésped: si ya existe, responde con el perfil existente y un aviso
   (no crea otro). Búsqueda de huéspedes por nombre, documento o correo para
   asociarlos a una reserva.
2. Huéspedes adicionales (HU-REC-02): solo en reservas CONFIRMADA o EN_ESTADIA;
   nombre, tipo y número de documento y nacionalidad. El total (principal +
   adicionales) no supera los huéspedes de la reserva (409 si se pasa).
3. Búsqueda de reservas (HU-REC-06 y HU-CM-02): por nombre, documento, código y
   rango de fechas; filtros de estado y canal; filtros rápidos "Llegan hoy"
   (CONFIRMADA con entrada hoy) y "Salen hoy" (EN_ESTADIA con salida hoy, con
   saldo). "Hoy" en America/Guatemala. Paginación page y size. Detalle con
   huésped, adicionales, fechas, tipo, habitación, total, canal, identificador
   externo e historial de estados.
4. Datos del Gantt (HU-REC-08): para un rango de fechas, las habitaciones
   agrupadas por tipo más la fila "Sin asignar", y las reservas activas o
   FINALIZADA (sin CANCELADA) con código, huésped, fechas, estado y canal.
5. Permisos según el documento 09 (RECEPCION). Pruebas de cada regla.

Datos de prueba (migración nueva de Flyway, solo tú creas migraciones):
- Unas 12 reservas repartidas en el mes actual y el siguiente, de varios canales
  (Directo web, Recepción, Booking, Expedia) y estados, para llenar el Gantt.
- Al menos una reserva EN_ESTADIA con habitación OCUPADA y su huésped con un
  correo de prueba, para que Carlos pruebe la app sin esperar el check-in.
- Una reserva CONFIRMADA con llegada hoy no sirve en una migración (las fechas
  cambian): crea un endpoint o script SOLO de desarrollo, desactivado fuera del
  perfil "dev", que genere reservas relativas a "hoy".

Primero muéstrame el plan; después impleméntalo.
```

## Prueba de punta a punta de Recepción (jueves 8, 1 h)

Sin IA, con todo encendido (Docker, API y web):

1. Reservar en la web y pagar con la tarjeta de prueba → aparece en la búsqueda y en el Gantt con canal "Directo web".
2. Crear una reserva desde Recepción → aparece con canal "Recepción" y llega el correo a Mailpit.
3. Enviar una reserva desde el canal simulado → aparece con su ícono de canal.
4. Cancelar una reserva web con 48 h o más → reembolso en Stripe.
5. Hacer el check-in de una reserva de hoy con habitación limpia → `EN_ESTADIA` y habitación `OCUPADA`.
6. Anotar los errores encontrados y avisar a su responsable.

## Cómo saber que quedó terminado

1. Registrar un huésped con un correo existente devuelve el perfil existente.
2. La búsqueda y los filtros rápidos devuelven lo esperado; el Gantt trae la fila "Sin asignar".
3. Las reservas de prueba aparecen al arrancar con la base vacía.
4. La prueba de punta a punta pasa o sus errores están avisados.

## Al terminar

Cuando todo lo de "Cómo saber que quedó terminado" funcione, pega esto a la IA:

```text
Terminamos esta tarea. Muéstrame git status y confirma que no se sube ningún .env
ni claves. Luego haz commit, push y abre el pull request a main con un título que
EMPIECE con "OBJ-2A:" (por ejemplo "OBJ-2A: <resumen corto>"). En la descripción
pon qué se hizo, cómo se probó y la lista de tareas de "17 - Avance del Proyecto.md"
con código OBJ-2A que quedan completas.
```

Pide a un compañero que revise el PR. No marques el archivo 17: Josué lo actualiza una vez al día.
