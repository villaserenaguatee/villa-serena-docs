# HU — Channel Manager

> **Rol:** Canal externo (actor no humano, por API), Administrador (`ADMIN`, canal simulado) y Recepción (`RECEPCION`, ve el canal de origen)
> **Plataforma:** API y Web privada
> **Prefijo:** `HU-CM`
> **Total de historias:** 3 (Nivel 1: 3 · Nivel 2: 0)
> **Referencias:** 01 — Alcance (sección D)

---

## Épica 1: Recepción de reservas externas

### HU-CM-01 — Recibir una reserva de un canal externo

| Plataforma | Épica | Alcance | Nivel | Tamaño | Estado |
|---|---|---|---|---|---|
| API | Recepción de reservas externas | ALC-CM-03 | 1 | M | Pendiente |

**Historia**
- **Como** canal externo (Booking o Expedia)
- **Quiero** enviar una reserva al hotel por la API
- **Para** que la reserva hecha en mi plataforma quede registrada en Villa Serena

**Criterios de aceptación**
1. La API recibe: identificador externo, tipo de habitación, fecha de entrada y de salida, número de huéspedes, datos del huésped principal y monto total en quetzales. Los datos del huésped son los mismos 6 de Recepción y de la web, todos obligatorios: nombre completo, correo, teléfono, nacionalidad, tipo de documento (DPI o pasaporte) y número de documento. Si ya existe un huésped con ese correo, la reserva se asocia a ese perfil sin cambiar sus datos.
2. Cada petición incluye el canal y su clave; el sistema compara la clave con la guardada con hash. Si el canal no existe o la clave es incorrecta, responde `401` y no crea nada.
3. Si faltan datos o no cumplen las reglas (estadía de 1 a 30 noches, sin fechas pasadas ni a más de 365 días, huéspedes dentro de la capacidad del tipo, tipo activo), responde `400` indicando el problema.
4. Valida la disponibilidad con las mismas reglas que la web pública; si no hay, responde `409` con un mensaje claro.
5. Si ya existe una reserva con el mismo identificador externo del mismo canal, responde `200` con la reserva existente y no crea otra.
6. Si todo es válido, crea la reserva `Confirmada` con su código propio (ej. `VS-7K2M9Q`), el canal de origen y el identificador externo; la cuenta se crea con un cargo por alojamiento igual al monto del canal y un pago `Aprobado` con método "Canal" por ese mismo monto. Responde `201` con el código.
7. Se envía al huésped el correo de confirmación con el código de reserva y el enlace de la app.
8. La API está documentada con OpenAPI, con ejemplos de cada respuesta.

**Depende de:** HU-REC-04
**Reglas relacionadas:** RN-CM-001, RN-CM-003, RN-CM-004, RN-NOT-005, RN-PAG-008, RN-PAG-009, RN-PAG-014, RN-RES-001, RN-RES-005, RN-RES-006, RN-RES-007, RN-RES-009, RN-RES-010, RN-RES-011, RN-RES-019, RN-TAR-008, RN-TAR-009, RN-TAR-010 (documento 10)
**Notas técnicas:** reutiliza la lógica de disponibilidad y creación de reservas. Las reservas del canal no se cancelan desde el sistema.

---

## Épica 2: Visibilidad del canal

### HU-CM-02 — Ver el canal de origen de las reservas

| Plataforma | Épica | Alcance | Nivel | Tamaño | Estado |
|---|---|---|---|---|---|
| Web privada | Visibilidad del canal | ALC-CM-02 | 1 | S | Pendiente |

**Historia**
- **Como** recepcionista
- **Quiero** saber por qué canal llegó cada reserva
- **Para** atender correctamente al huésped y conocer de dónde vienen las reservas

**Criterios de aceptación**
1. Toda reserva tiene un canal de origen: Directo web, Recepción, Booking o Expedia; se asigna automáticamente al crearla y no se puede editar.
2. El canal se muestra en el detalle de la reserva y en los resultados de búsqueda (HU-REC-06), y se puede filtrar la búsqueda por canal.
3. En el calendario Gantt (HU-REC-08), las reservas de canales externos se distinguen con un ícono o etiqueta.
4. Las reservas de Booking o Expedia muestran también su identificador externo.
5. Las reservas de un canal externo no muestran la opción de cancelar; si se intenta por otra vía, el sistema responde "Las reservas de canal no se cancelan desde el sistema".

**Depende de:** HU-CM-01, HU-REC-06, HU-REC-08
**Reglas relacionadas:** RN-CAN-012, RN-RES-010, RN-SEG-006 (documento 10)

---

## Épica 3: Canal simulado

### HU-CM-03 — Enviar reservas de prueba con el canal simulado

| Plataforma | Épica | Alcance | Nivel | Tamaño | Estado |
|---|---|---|---|---|---|
| Web privada | Canal simulado | ALC-CM-04 | 1 | M | Pendiente |

**Historia**
- **Como** administrador
- **Quiero** enviar reservas de prueba desde un canal simulado
- **Para** demostrar que el sistema está preparado para recibir reservas de Booking o Expedia

**Criterios de aceptación**
1. Existe una pantalla en el panel del Administrador; otros roles no la ven y reciben "Acceso denegado" si intentan entrar.
2. Se elige el canal (Booking o Expedia), el tipo de habitación, las fechas, el número de huéspedes, los 6 datos del huésped (HU-CM-01) y el monto, o se generan todos los datos de prueba al azar con un identificador externo nuevo.
3. La reserva se envía **a través de la API real** (HU-CM-01), con la clave del canal elegido.
4. Se muestra la respuesta de la API: código HTTP, resultado (aceptada o rechazada), motivo y, si se creó, el código de reserva.
5. Si la API rechaza la reserva (sin disponibilidad o datos inválidos), se muestra el motivo y no se crea nada.
6. Se puede reenviar la misma reserva (mismo identificador externo) para demostrar que no se duplica: la API responde con la reserva existente.
7. La reserva creada aparece en la búsqueda de Recepción y en el Gantt con su canal de origen.

**Depende de:** HU-CM-01
**Reglas relacionadas:** RN-CM-004, RN-CM-007, RN-CM-009 (documento 10)
**Notas técnicas:** el simulador lee las claves en texto plano de sus propias variables de entorno (la base de datos solo guarda el hash). No envía cancelaciones.

---

## Notas

- **ALC-CM-01** (documento de diseño de la integración: cómo se conectaría a Booking o Expedia en el futuro) es un entregable técnico, no una historia de usuario.
- Los canales (Booking y Expedia) y sus claves se cargan en la **configuración inicial** del sistema; no hay pantalla de administración de canales.
