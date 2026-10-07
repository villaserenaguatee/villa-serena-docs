# OBJ-1B — API: disponibilidad, reserva, cargos y Stripe

| Dato | Valor |
|---|---|
| Objetivo | 1 — Reservar (documento 13) |
| Repositorio | `villa-serena-api` |
| Responsable | Pablo |
| Horas estimadas | 5,5 h (disponibilidad y precio 1,5 h; reserva y registro de cargos 1,5 h; Stripe y cancelación a los 30 min 2,5 h) |
| Cubre | HU-HUE-03, HU-HUE-04, HU-HUE-05, HU-HUE-06 (lado API) |
| Depende de | OBJ-0C (tablas), OBJ-0D (seguridad), contrato parte 1 (OBJ-0G), guía de Stripe CLI de Josué (OBJ-1A) y el aviso de confirmación de Hugo (OBJ-1C) |
| Calendario | Lun 5: disponibilidad y precio. Mar 6: reserva, registro de cargos y Stripe. Mié 7: terminar Stripe |

> **Antes de empezar:** prepara tu computadora con la `16 - Guia de Arranque del Proyecto.md`. Para crear tu rama y subir tu trabajo con un pull request, sigue la sección 3 de `00 - Como usar los prompts.md`.

**Este es el corazón del sistema:** Recepción (objetivo 2) y el canal (Hugo) reutilizan tu servicio de disponibilidad y de creación de reservas. Diséñalo para que lo puedan llamar sin copiar código.

## Documentos que debes adjuntar a la IA

- `AGENTS.md`
- `openapi.yaml` (contrato, parte 1)
- `HU - Cliente y Huesped.md` (HU-HUE-03 a HU-HUE-07), `HU - Recepcionista.md` (HU-REC-04 y HU-REC-05) y `HU - Channel Manager.md` (HU-CM-01)
- `HU - Administrador.md` (HU-ADM-06 y HU-ADM-07: temporadas y fin de semana)
- `07 - Estados.md` (secciones 3 y 5)
- `10 - Reglas de Negocio.md` (reglas RN-RES, RN-TAR, RN-PAG y RN-CAN, y los parámetros PAR)
- `14 - Tecnologias y Arquitectura.md` (secciones 2, 5 y 6)

## Prompt

```text
Trabajas en el repositorio villa-serena-api del proyecto Villa Serena (lee AGENTS.md
y los documentos adjuntos). Responde en español.

Objetivo: el flujo de reserva web de principio a fin, en el paquete reservas.

PASO 1 — Disponibilidad y precio (HU-HUE-03 y HU-HUE-04)
- DisponibilidadService: por tipo y noche = habitaciones activas del tipo que no
  están FUERA_DE_SERVICIO − reservas del tipo en PENDIENTE_PAGO, CONFIRMADA o
  EN_ESTADIA (con o sin habitación asignada). Un tipo solo aparece si tiene cupo
  en TODAS las noches. Valida 1 a 30 noches, sin fechas pasadas, salida después
  de la entrada, entrada a no más de 365 días y capacidad del tipo.
- TarifaService: noche = precio base × (1 + % temporada vigente) × (1 + % fin de
  semana si es viernes o sábado), redondeado a 2 decimales; total = suma. Devuelve
  el desglose por noche. "Hoy" y las noches se calculan en America/Guatemala.
- Endpoint público de búsqueda según openapi.yaml.

PASO 2 — Crear la reserva (HU-HUE-05)
- ReservaService.crearReserva(datos, canalOrigen): busca el huésped por correo (si
  existe, usa ese perfil sin cambiar sus datos), vuelve a validar la
  disponibilidad DENTRO de la transacción (con bloqueo), crea la reserva con
  código único no secuencial (ej. VS-7K2M9Q), precio fijo, y la cuenta ABIERTA con
  el cargo por alojamiento.
- Web: estado PENDIENTE_PAGO, canal "Directo web". Deja el método listo para que
  Recepción (CONFIRMADA, canal Recepción) y el canal de Hugo (CONFIRMADA, con pago
  APROBADO método CANAL) lo reutilicen. Acuerda con Hugo el nombre exacto.
- CargoService.registrarCargo(cuentaId, concepto, cantidad, precioUnitario,
  responsable): registro común de cargos que Hugo usará desde Room Service.
- Registra cada cambio de estado con HistorialEstadoService.

PASO 3 — Pago con Stripe (HU-HUE-06)
- Iniciar pago: crea UNA sesión de Stripe Checkout por el 100 % del total (o
  devuelve la misma si ya existe y sigue abierta), con success_url y cancel_url
  hacia la página de resultado de la web. El pago queda PENDIENTE.
- Webhook (ruta de openapi.yaml): verifica la firma (STRIPE_WEBHOOK_SECRET),
  idempotente por id del evento. Solo 2 eventos: sesión pagada → pago APROBADO y
  reserva CONFIRMADA, y llama a ConfirmacionReservaNotifier.notificar (de Hugo);
  sesión vencida → pago FALLIDO.
- @Scheduled: reservas PENDIENTE_PAGO con más de 30 minutos. Antes de cancelar,
  consulta la sesión en Stripe: si ya estaba pagada, confírmala. Si no, CANCELADA,
  cuenta CERRADA y cupo libre.
- Endpoint público de estado de la reserva para la página de resultado.
- Claves de Stripe solo en el .env (STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET).

Pruebas: disponibilidad con reservas que se cruzan, precio con temporada y fin de
semana, webhook repetido (un solo pago) y cancelación a los 30 minutos.
No crees migraciones: pídeselas a Josué.

Primero muéstrame el plan de clases; después impleméntalo por pasos, empezando por
el paso 1.
```

## Cómo saber que quedó terminado

1. La búsqueda devuelve solo tipos con cupo en todas las noches y el precio con su desglose.
2. Con Stripe CLI encendido: crear una reserva, pagar con la tarjeta de prueba aprobada → la reserva queda `CONFIRMADA` y el correo llega a Mailpit.
3. Reenviar el mismo webhook no crea un segundo pago.
4. Una reserva sin pagar se cancela sola a los 30 minutos (para probar, puedes bajar el tiempo en tu `.env` local).
5. `mvnw.cmd test` pasa.

## Al terminar

Cuando todo lo de "Cómo saber que quedó terminado" funcione, pega esto a la IA:

```text
Terminamos esta tarea. Muéstrame git status y confirma que no se sube ningún .env
ni claves. Luego haz commit, push y abre el pull request a main con un título que
EMPIECE con "OBJ-1B:" (por ejemplo "OBJ-1B: <resumen corto>"). En la descripción
pon qué se hizo, cómo se probó y la lista de tareas de "17 - Avance del Proyecto.md"
con código OBJ-1B que quedan completas.
```

Pide a un compañero que revise el PR. No marques el archivo 17: Josué lo actualiza una vez al día.
