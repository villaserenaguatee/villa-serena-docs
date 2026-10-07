# OBJ-1E — Web: resultado del pago y canal simulado

| Dato | Valor |
|---|---|
| Objetivo | 1 — Reservar (documento 13) |
| Repositorio | `villa-serena-web` |
| Responsable | Alex |
| Horas estimadas | 2,5 h (resultado del pago 1 h; canal simulado 1,5 h) |
| Cubre | HU-HUE-06 (criterio 6, página al volver de Stripe) y HU-CM-03 |
| Depende de | OBJ-0E (proyecto web y BFF) y contrato parte 1 (OBJ-0G). Para probar de punta a punta: el pago de Pablo (OBJ-1B) y el endpoint del canal de Hugo (OBJ-1C) |
| Calendario | Vie 2 (resultado del pago, 0,5 h) y Lun 5 (resto) |

> **Antes de empezar:** prepara tu computadora con la `16 - Guia de Arranque del Proyecto.md`. Para crear tu rama y subir tu trabajo con un pull request, sigue la sección 3 de `00 - Como usar los prompts.md`.

## Documentos que debes adjuntar a la IA

- `AGENTS.md`
- `openapi.yaml` (contrato, parte 1; copia del repositorio `villa-serena-api`)
- `HU - Cliente y Huesped.md` (HU-HUE-06) y `HU - Channel Manager.md` (HU-CM-01 y HU-CM-03)
- `14 - Tecnologias y Arquitectura.md` (sección 6.1)

## Prompt

```text
Trabajas en el repositorio villa-serena-web del proyecto Villa Serena (lee AGENTS.md
y los documentos adjuntos). Responde en español. Copia openapi.yaml a la raíz y
regenera los tipos con el script "tipos" antes de empezar.

PARTE A — Página del resultado del pago (HU-HUE-06, criterio 6)
1. Página pública app/(publico)/reserva/resultado/page.tsx a la que Stripe regresa
   con el código de la reserva en la URL (usa el formato que defina openapi.yaml
   para el success_url y el cancel_url).
2. Consulta el estado por el BFF (endpoint público de estado de la reserva) y
   muestra uno de tres casos:
   - Confirmada: mensaje de éxito, código de reserva y "te enviamos un correo".
   - Pago en proceso (aún PENDIENTE_PAGO): mensaje de espera y nueva consulta cada
     3 segundos, máximo 1 minuto.
   - Pago no completado: mensaje claro y botón "Reintentar pago" mientras la
     reserva siga PENDIENTE_PAGO (usa el enlace de pago que devuelva el API).
     Si ya está CANCELADA, explica que venció el tiempo de 30 minutos.
3. Usa el diseño público de Kim (components/publico). Mientras el API no exista,
   prueba con datos de prueba de los tres casos.

PARTE B — Canal simulado (HU-CM-03), solo ADMIN
1. Pantalla app/panel/admin/canal-simulado. Otros roles ven "Acceso denegado".
2. Formulario: canal (Booking o Expedia), tipo de habitación (lista del API),
   fechas, número de huéspedes, los 6 datos del huésped, monto en quetzales e
   identificador externo. Botón "Generar datos al azar" que llena todo con un
   identificador externo nuevo.
3. Route Handler propio del BFF (por ejemplo, POST /api/admin/canal-simulado) que:
   verifica que la sesión sea ADMIN, lee el código y la clave del canal elegido
   de variables de entorno del servidor (CANAL_BOOKING_CODIGO, CANAL_BOOKING_CLAVE,
   CANAL_EXPEDIA_CODIGO, CANAL_EXPEDIA_CLAVE; agrégalas a .env.example sin valores)
   y llama a la API REAL del canal de Spring (POST /api/v1/canal/reservas) con los
   encabezados X-Canal-Codigo y X-Canal-Clave. Las claves NUNCA llegan al
   navegador. El reenviador genérico del BFF sigue bloqueando /canal.
4. Muestra la respuesta: código HTTP, aceptada o rechazada, motivo y, si se
   creó, el código de reserva.
5. Botón "Reenviar la misma reserva" (mismo identificador externo) para
   demostrar que no se duplica (la API responde 200 con la reserva existente).

No hagas: no envíes cancelaciones, no agregues pantallas de administración de
canales ni guardes las claves en el código.

Primero muéstrame el plan de archivos; después créalos por pasos.
```

## Cómo saber que quedó terminado

1. La página de resultado muestra bien los tres casos (primero con datos de prueba; cuando exista el pago de Pablo, con un pago real de prueba en Stripe).
2. Un Recepcionista que entra a `/panel/admin/canal-simulado` ve "Acceso denegado".
3. Con el endpoint de Hugo listo: el Administrador envía una reserva y ve 201 con el código; al reenviarla, ve 200 con la misma reserva.
4. En las herramientas del navegador, ninguna petición ni respuesta contiene la clave del canal.

## Al terminar

Cuando todo lo de "Cómo saber que quedó terminado" funcione, pega esto a la IA:

```text
Terminamos esta tarea. Muéstrame git status y confirma que no se sube ningún .env
ni claves. Luego haz commit, push y abre el pull request a main con un título que
EMPIECE con "OBJ-1E:" (por ejemplo "OBJ-1E: <resumen corto>"). En la descripción
pon qué se hizo, cómo se probó y la lista de tareas de "17 - Avance del Proyecto.md"
con código OBJ-1E que quedan completas.
```

Pide a un compañero que revise el PR. No marques el archivo 17: Josué lo actualiza una vez al día.
