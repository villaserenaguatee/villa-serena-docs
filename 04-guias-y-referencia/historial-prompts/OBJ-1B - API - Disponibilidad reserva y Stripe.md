# OBJ-1B — API: disponibilidad, reserva, cargos y Stripe

| Dato | Valor |
|---|---|
| Objetivo | 1 — Reservar (documento 13) |
| Repositorio | `villa-serena-api` |
| Responsable inicial | Pablo |
| Horas estimadas | 5,5 h (disponibilidad y precio 1,5 h; reserva y registro de cargos 1,5 h; Stripe y cancelación a los 30 min 2,5 h) |
| Cubre | HU-HUE-03, HU-HUE-04, HU-HUE-05, HU-HUE-06 (lado API) |
| Depende de | OBJ-0C (tablas), OBJ-0D (seguridad), contrato parte 1 (OBJ-0G), guía de Stripe CLI de Josué (OBJ-1A) y el aviso de confirmación de Hugo (OBJ-1C) |
| Calendario | Lun 5: disponibilidad y precio. Mar 6: reserva, registro de cargos y Stripe. Mié 7: terminar Stripe |

> **Referencias de trabajo:** la guía 16 describe el entorno; la guía 00, sección 3, describe el flujo con issues, ramas y PR hacia `develop`.

**Este es el corazón del sistema:** Recepción (objetivo 2) y el canal (Hugo) reutilizan tu servicio de disponibilidad y de creación de reservas. Diséñalo para que lo puedan llamar sin copiar código.

## Referencias para la tarea

La lectura se limita a las secciones necesarias para la issue. AGENTS.md contiene los acuerdos de colaboración; estas referencias se amplían solo si hay una dependencia o discrepancia.

- `AGENTS.md`
- `openapi.yaml` (contrato, parte 1)
- `HU - Cliente y Huesped.md` (HU-HUE-03 a HU-HUE-07), `HU - Recepcionista.md` (HU-REC-04 y HU-REC-05) y `HU - Channel Manager.md` (HU-CM-01)
- `HU - Administrador.md` (HU-ADM-06 y HU-ADM-07: temporadas y fin de semana)
- `07 - Estados.md` (secciones 3 y 5)
- `10 - Reglas de Negocio.md` (reglas RN-RES, RN-TAR, RN-PAG y RN-CAN, y los parámetros PAR)
- `14 - Tecnologias y Arquitectura.md` (secciones 2, 5 y 6)

El agente presenta un plan breve y continúa con el trabajo autorizado. La implementación puede adaptarse a la estructura existente; el resultado cumple los criterios siguientes.

## Resultado esperado

```text
Contexto: repositorio villa-serena-api del proyecto Villa Serena (acuerdos en AGENTS.md
y referencias pertinentes de la tarea). Comunicación en español.

Objetivo: el flujo de reserva web de principio a fin, en el paquete reservas.

Resultado esperado — Disponibilidad y precio (HU-HUE-03 y HU-HUE-04)
- DisponibilidadService: por tipo y noche = habitaciones activas del tipo que no
  están FUERA_DE_SERVICIO − reservas del tipo en PENDIENTE_PAGO, CONFIRMADA o
  EN_ESTADIA (con o sin habitación asignada). Un tipo solo aparece si tiene cupo
  en TODAS las noches. Valida 1 a 30 noches, sin fechas pasadas, salida después
  de la entrada, entrada a no más de 365 días y capacidad del tipo.
- TarifaService: noche = precio base × (1 + % temporada vigente) × (1 + % fin de
  semana si es viernes o sábado), redondeado a 2 decimales; total = suma. Devuelve
  el desglose por noche. "Hoy" y las noches se calculan en America/Guatemala.
- Endpoint público de búsqueda según openapi.yaml.

Resultado esperado — Crear la reserva (HU-HUE-05)
- ReservaService.crearReserva(datos, canalOrigen): busca el huésped por correo (si
  existe, usa ese perfil sin cambiar sus datos), vuelve a validar la
  disponibilidad DENTRO de la transacción (con bloqueo), crea la reserva con
  código único no secuencial (ej. VS-7K2M9Q), precio fijo, y la cuenta ABIERTA con
  el cargo por alojamiento.
- Web: estado PENDIENTE_PAGO, canal "Directo web". El método permite que
  Recepción (CONFIRMADA, canal Recepción) y el canal de Hugo (CONFIRMADA, con pago
  APROBADO método CANAL) lo reutilicen. El nombre y la firma se coordinan en la issue y la PR.
- CargoService.registrarCargo(cuentaId, concepto, cantidad, precioUnitario,
  responsable): registro común de cargos que Hugo usará desde Room Service.
- Cada cambio de estado queda registrado con HistorialEstadoService.

Resultado esperado — Pago con Stripe (HU-HUE-06)
- Iniciar pago: crea UNA sesión de Stripe Checkout por el 100 % del total (o
  devuelve la misma si ya existe y sigue abierta), con success_url y cancel_url
  hacia la página de resultado de la web. El pago queda PENDIENTE.
- Webhook (ruta de openapi.yaml): verifica la firma (STRIPE_WEBHOOK_SECRET),
  idempotente por id del evento. Solo 2 eventos: sesión pagada → pago APROBADO y
  reserva CONFIRMADA, y llama a ConfirmacionReservaNotifier.notificar (de Hugo);
  sesión vencida → pago FALLIDO.
- @Scheduled: reservas PENDIENTE_PAGO con más de 30 minutos. Antes de cancelar,
  consulta la sesión en Stripe: si ya estaba pagada, la reserva queda confirmada. Si no, CANCELADA,
  cuenta CERRADA y cupo libre.
- Endpoint público de estado de la reserva para la página de resultado.
- Claves de Stripe solo en el .env (STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET).

Pruebas: disponibilidad con reservas que se cruzan, precio con temporada y fin de
semana, webhook repetido (un solo pago) y cancelación a los 30 minutos.
Los cambios de esquema necesarios se coordinan mediante issues y PR, conservando las migraciones ya aplicadas.
```

## Cómo saber que quedó terminado

1. La búsqueda devuelve solo tipos con cupo en todas las noches y el precio con su desglose.
2. Con Stripe CLI encendido: crear una reserva, pagar con la tarjeta de prueba aprobada → la reserva queda `CONFIRMADA` y el correo llega a Mailpit.
3. Reenviar el mismo webhook no crea un segundo pago.
4. Una reserva sin pagar se cancela sola a los 30 minutos (para probar, puedes bajar el tiempo en tu `.env` local).
5. Las pruebas del API pasan con el Maven Wrapper de la terminal (guía 16, sección 1.1).

## Al terminar

Después de integrar la PR en `develop` y verificar el resultado, la issue queda actualizada o cerrada y la casilla correspondiente de `17 - Avance del Proyecto.md` incluye el número de PR (guía 00, sección 3).
