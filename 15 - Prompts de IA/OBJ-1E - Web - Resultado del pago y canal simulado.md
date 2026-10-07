# OBJ-1E — Web: resultado del pago y canal simulado

| Dato | Valor |
|---|---|
| Objetivo | 1 — Reservar (documento 13) |
| Repositorio | `villa-serena-web` |
| Responsable inicial | Alex |
| Horas estimadas | 2,5 h (resultado del pago 1 h; canal simulado 1,5 h) |
| Cubre | HU-HUE-06 (criterio 6, página al volver de Stripe) y HU-CM-03 |
| Depende de | OBJ-0E (proyecto web y BFF) y contrato parte 1 (OBJ-0G). Para probar de punta a punta: el pago de Pablo (OBJ-1B) y el endpoint del canal de Hugo (OBJ-1C) |
| Calendario | Vie 2 (resultado del pago, 0,5 h) y Lun 5 (resto) |

> **Referencias de trabajo:** la guía 16 describe el entorno; la guía 00, sección 3, describe el flujo con issues, ramas y PR hacia `develop`.

## Referencias para la tarea

La lectura se limita a las secciones necesarias para la issue. AGENTS.md contiene los acuerdos de colaboración; estas referencias se amplían solo si hay una dependencia o discrepancia.

- `AGENTS.md`
- `openapi.yaml` (contrato, parte 1; copia del repositorio `villa-serena-api`)
- `HU - Cliente y Huesped.md` (HU-HUE-06) y `HU - Channel Manager.md` (HU-CM-01 y HU-CM-03)
- `14 - Tecnologias y Arquitectura.md` (sección 6.1)

El agente presenta un plan breve y continúa con el trabajo autorizado. La implementación puede adaptarse a la estructura existente; el resultado cumple los criterios siguientes.

## Resultado esperado

```text
Contexto: repositorio villa-serena-web del proyecto Villa Serena (acuerdos en AGENTS.md
y referencias pertinentes de la tarea). Comunicación en español. Los tipos se generan desde la copia local de
openapi.yaml mediante el script "tipos".

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
3. La página reutiliza el diseño público (components/publico). Mientras falta
   el API, los tres casos se comprueban con datos de prueba.

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

Fuera de alcance: cancelaciones y pantallas de administración de canales.
Las claves permanecen fuera del código.
```

## Cómo saber que quedó terminado

1. La página de resultado muestra bien los tres casos (primero con datos de prueba; cuando exista el pago de Pablo, con un pago real de prueba en Stripe).
2. Un Recepcionista que entra a `/panel/admin/canal-simulado` ve "Acceso denegado".
3. Con el endpoint de Hugo listo: el Administrador envía una reserva y ve 201 con el código; al reenviarla, ve 200 con la misma reserva.
4. En las herramientas del navegador, ninguna petición ni respuesta contiene la clave del canal.

## Al terminar

Después de integrar la PR en `develop` y verificar el resultado, la issue queda actualizada o cerrada y la casilla correspondiente de `17 - Avance del Proyecto.md` incluye el número de PR (guía 00, sección 3). Si hay un bloqueo, Alex facilita su resolución; el avance puede actualizarlo quien completó la tarea.
