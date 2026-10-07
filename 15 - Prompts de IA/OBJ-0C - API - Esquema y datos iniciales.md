# OBJ-0C — API: esquema y datos iniciales

| Dato | Valor |
|---|---|
| Objetivo | 0 — Base (documento 13) |
| Repositorio | `villa-serena-api` |
| Responsable | Josué (único que crea migraciones) |
| Horas estimadas | 5 h (esquema 3 h + datos iniciales 2 h) |
| Cubre | Tarea técnica: datos iniciales con Flyway (AD-18); restricciones de la base de datos (documento 14, sección 5) |
| Depende de | OBJ-0A (PostgreSQL) y OBJ-0B (proyecto base). Si OBJ-0B no está en `main`, parte de la rama de Hugo |
| Calendario | Vie 2: esquema (2,5 h). Lun 5: terminar esquema y datos iniciales (2,5 h) |

> **Antes de empezar:** prepara tu computadora con la `16 - Guia de Arranque del Proyecto.md` (instalar, `.env` y encender Docker). Para crear tu rama y subir tu trabajo con un pull request, sigue la sección 3 de `00 - Como usar los prompts.md`.

## Documentos que debes adjuntar a la IA

- `AGENTS.md`
- `14 - Tecnologias y Arquitectura.md` (secciones 2, 5 y 6)
- `07 - Estados.md` (completo: entidades, estados y campos)
- `08 - Inventario Turnos y Personal.md` (secciones 3, 4 y 5)
- `10 - Reglas de Negocio.md` (parámetros PAR y reglas citadas en la sección 5 del documento 14)
- `04 - Historias de Usuario/HU - Administrador.md` (campos de tipos de habitación, habitaciones, menú, temporadas, fin de semana y datos del hotel, que ahora van como datos iniciales)

## Prompt

```text
Trabajas en el repositorio villa-serena-api del proyecto Villa Serena (lee AGENTS.md
y los documentos adjuntos). Responde en español.

Objetivo: crear con Flyway el esquema completo de Nivel 1 en PostgreSQL 17 y los
datos iniciales de la demostración. Solo SQL de migraciones en
src/main/resources/db/migration/; no crees entidades JPA ni servicios (cada
responsable crea las suyas).

PASO 1 — Propuesta (no escribas SQL todavía)
Lee los documentos 07, 08, 10 y 14 y muéstrame una tabla con: nombre de cada tabla,
sus columnas principales, sus claves foráneas y de qué documento sale. Como guía,
debería incluir al menos: empleados, refresh_tokens, huespedes, codigos_otp,
dispositivos_push, huespedes_adicionales, tipos_habitacion, habitaciones,
temporadas, configuracion_hotel (datos del hotel, fiscales y ajuste de fin de
semana), series_factura, canales, reservas, cuentas, cargos, pagos, facturas,
items_menu, pedidos, pedido_items, articulos, solicitudes, solicitud_items,
incidencias, outbox e historial_estados.
NO incluyas tablas de Nivel 2: turnos, inventario, amenidades ni Wi-Fi.
Espera mi aprobación antes del paso 2.

PASO 2 — Esquema (V1__esquema.sql y las que hagan falta)
- CREATE EXTENSION IF NOT EXISTS btree_gist.
- Estados como VARCHAR con CHECK de los valores exactos del documento 07
  (por ejemplo, reserva: PENDIENTE_PAGO, CONFIRMADA, EN_ESTADIA, FINALIZADA,
  CANCELADA). Métodos de pago: STRIPE, CANAL, EFECTIVO, TARJETA, OTRO.
- Fechas con hora en TIMESTAMPTZ; fechas de estadía en DATE.
- Montos en NUMERIC(12,2), en quetzales.
- Restricciones de la sección 5 del documento 14:
  * EXCLUDE USING gist (habitacion_id WITH =, daterange(fecha_entrada,
    fecha_salida) WITH &&) en reservas que ocupan habitación (excluye
    CANCELADA y FINALIZADA con WHERE).
  * Únicos: número de habitación; correo de empleado; correo de huésped;
    (canal, identificador externo) en reservas; un cargo por pedido; una factura
    por cuenta; correlativo único por serie.
  * Índice único parcial: una sola solicitud de limpieza activa por habitación.
- historial_estados: tipo_entidad, id_entidad, estado_anterior, estado_nuevo,
  id_responsable (nulo si fue el SISTEMA), tipo_responsable, fecha.
- refresh_tokens y codigos_otp guardan solo el hash, nunca el valor.

PASO 3 — Datos iniciales (V2__datos_iniciales.sql)
Valores ficticios y realistas para Guatemala, en español:
- configuracion_hotel: nombre "Villa Serena", dirección, teléfono, correo,
  descripción, NIT y razón social ficticios, horas fijas 15:00 y 12:00, y ajuste
  de fin de semana (según HU-ADM-07).
- series_factura: una serie fija con su número inicial.
- 3 o 4 tipos de habitación con precio base y capacidad, y unas 10 habitaciones.
- 2 temporadas (alta y baja) con su ajuste, según HU-ADM-06.
- Menú de room service: unos 10 ítems en 3 categorías, DISPONIBLE.
- Catálogo de artículos (documento 08, sección 5): unos 6, con su cantidad
  máxima por solicitud.
- 2 canales (por ejemplo, "Booking simulado" y "Expedia simulado") con el hash
  de su clave tomado de placeholders de Flyway: ${canal1_key_hash} y
  ${canal2_key_hash} (SHA-256 en hexadecimal).
- Empleados de prueba: 2 ADMIN, 1 RECEPCION, 1 ROOM_SERVICE y 3
  MANTENIMIENTO_LIMPIEZA (uno por área: LIMPIEZA, MANTENIMIENTO y AMBAS), todos
  ACTIVO y sin contraseña temporal. La contraseña es un hash BCrypt tomado del
  placeholder ${demo_password_hash}; nunca escribas una contraseña ni un hash
  real en el SQL.
- Configura en application.yml: spring.flyway.placeholders.* leyendo
  DEMO_PASSWORD_HASH, CANAL1_KEY_HASH y CANAL2_KEY_HASH del entorno, y agrégalos
  a .env.example con una nota de cómo generarlos.

No hagas:
- No crees reservas de prueba todavía (van en el objetivo 2).
- No agregues columnas o tablas que no salgan de los documentos. Si dudas, pregunta.
- No guardes secretos ni contraseñas en texto plano.
```

## Cómo saber que quedó terminado

1. Con PostgreSQL vacío, `./mvnw spring-boot:run` ejecuta las migraciones sin errores.
2. En `psql` (o DBeaver): existen todas las tablas aprobadas y los datos iniciales (`SELECT count(*)` en habitaciones, ítems del menú, artículos y empleados).
3. Insertar a mano dos reservas `CONFIRMADA` en la misma habitación con fechas que se cruzan falla por la restricción `EXCLUDE`.
4. Insertar un segundo empleado con el mismo correo falla por el índice único.
5. Ningún archivo del repositorio contiene contraseñas, hashes ni claves reales.

## Al terminar

Cuando todo lo de "Cómo saber que quedó terminado" funcione, pega esto a la IA:

```text
Terminamos esta tarea. Muéstrame git status y confirma que no se sube ningún .env
ni claves. Luego haz commit, push y abre el pull request a main con un título que
EMPIECE con "OBJ-0C:" (por ejemplo "OBJ-0C: <resumen corto>"). En la descripción
pon qué se hizo, cómo se probó y la lista de tareas de "17 - Avance del Proyecto.md"
con código OBJ-0C que quedan completas.
```

Pide a un compañero que revise el PR. No marques el archivo 17: Josué lo actualiza una vez al día.
