# OBJ-0C — API: esquema y datos iniciales

| Dato | Valor |
|---|---|
| Objetivo | 0 — Base (documento 13) |
| Repositorio | `villa-serena-api` |
| Responsable inicial | Josué (reparto inicial; las migraciones se coordinan en equipo) |
| Horas estimadas | 5 h (esquema 3 h + datos iniciales 2 h) |
| Cubre | Tarea técnica: datos iniciales con Flyway (AD-18); restricciones de la base de datos (documento 14, sección 5) |
| Depende de | OBJ-0B (base mínima y configuración) y OBJ-0A (PostgreSQL para verificar). La base se integra en `develop` o se coordina desde la PR de OBJ-0B; el esquema no es un requisito previo de OBJ-0B. |
| Calendario | Vie 2: esquema (2,5 h). Lun 5: terminar esquema y datos iniciales (2,5 h) |

> **Referencias de trabajo:** la guía 16 describe el entorno; la guía 00, sección 3, describe el flujo con issues, ramas y PR hacia `develop`.

## Referencias para la tarea

La lectura se limita a las secciones necesarias para la issue. AGENTS.md contiene los acuerdos de colaboración; estas referencias se amplían solo si hay una dependencia o discrepancia.

- `AGENTS.md`
- `14 - Tecnologias y Arquitectura.md` (secciones 2, 5 y 6)
- `07 - Estados.md` (completo: entidades, estados y campos)
- `08 - Inventario Turnos y Personal.md` (secciones 3, 4 y 5)
- `10 - Reglas de Negocio.md` (parámetros PAR y reglas citadas en la sección 5 del documento 14)
- `04 - Historias de Usuario/HU - Administrador.md` (campos de tipos de habitación, habitaciones, menú, temporadas, fin de semana y datos del hotel, que ahora van como datos iniciales)

El agente presenta un plan breve y continúa con el trabajo autorizado. La implementación puede adaptarse a la estructura existente; el resultado cumple los criterios siguientes.

## Resultado esperado

```text
Contexto: repositorio villa-serena-api del proyecto Villa Serena (acuerdos en AGENTS.md
y referencias pertinentes de la tarea). Comunicación en español.

Objetivo: crear con Flyway el esquema completo de Nivel 1 en PostgreSQL 17 y los
datos iniciales de la demostración. Esquema y datos iniciales en
src/main/resources/db/migration/; las entidades JPA y servicios pertenecen a
los objetivos que consumen el esquema.

Diseño esperado del esquema
El diseño identifica cada tabla, sus columnas principales, claves foráneas y
la referencia pertinente de los documentos 07, 08, 10 y 14. Como guía,
debería incluir al menos: empleados, refresh_tokens, huespedes, codigos_otp,
dispositivos_push, huespedes_adicionales, tipos_habitacion, habitaciones,
temporadas, configuracion_hotel (datos del hotel, fiscales y ajuste de fin de
semana), series_factura, canales, reservas, cuentas, cargos, pagos, facturas,
items_menu, pedidos, pedido_items, articulos, solicitudes, solicitud_items,
incidencias, outbox e historial_estados.
Fuera de este objetivo: tablas de Nivel 2, turnos, inventario, amenidades y Wi-Fi.
El esquema se implementa dentro del alcance autorizado; las discrepancias de impacto se registran como issues.

Resultado esperado — Esquema (V1__esquema.sql y las que hagan falta)
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

Resultado esperado — Datos iniciales (V2__datos_iniciales.sql)
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
- Los perfiles local, dev y prod aprovechan la configuración existente.
  spring.flyway.placeholders.* lee DEMO_PASSWORD_HASH, CANAL1_KEY_HASH y
  CANAL2_KEY_HASH del entorno; .env.example explica cómo generarlos.

Fuera de alcance:
- Las reservas de prueba corresponden al objetivo 2.
- El esquema cubre las historias y restricciones acordadas. Una discrepancia
  de alcance se registra como issue; los detalles técnicos se resuelven dentro de la tarea.
- Los datos iniciales están libres de secretos y contraseñas en texto plano.
```

## Cómo saber que quedó terminado

1. Con PostgreSQL vacío, `./mvnw spring-boot:run` ejecuta las migraciones sin errores.
2. En `psql` (o DBeaver): existen todas las tablas aprobadas y los datos iniciales (`SELECT count(*)` en habitaciones, ítems del menú, artículos y empleados).
3. Insertar a mano dos reservas `CONFIRMADA` en la misma habitación con fechas que se cruzan falla por la restricción `EXCLUDE`.
4. Insertar un segundo empleado con el mismo correo falla por el índice único.
5. Ningún archivo del repositorio contiene contraseñas, hashes ni claves reales.

## Al terminar

Después de integrar la PR en `develop` y verificar el resultado, la issue queda actualizada o cerrada y la casilla correspondiente de `17 - Avance del Proyecto.md` incluye el número de PR (guía 00, sección 3). Si hay un bloqueo, Alex facilita su resolución; el avance puede actualizarlo quien completó la tarea.
