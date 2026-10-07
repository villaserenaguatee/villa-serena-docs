# OBJ-4A — API: cuenta, check-out y pago desde la app

| Dato | Valor |
|---|---|
| Objetivo | 4 — Check-out (documento 13) |
| Repositorio | `villa-serena-api` |
| Responsable | Pablo |
| Horas estimadas | 3,5 h (cuenta y anulación 1 h; check-out en una sola operación 1,5 h; pago del saldo desde la app 1 h) |
| Cubre | HU-REC-13, HU-REC-14, HU-HUE-15 y HU-HUE-16 (lado API) |
| Depende de | OBJ-1B (cuenta, cargos y Stripe), OBJ-4B (factura de Hugo), OBJ-3B-1 (incidencias de Hugo) y contrato parte 2 |
| Calendario | Jue 8. Si no alcanza, el pago desde la app es el primer recorte de reserva (documento 13, sección 9.2) |

> **Antes de empezar:** prepara tu computadora con la `16 - Guia de Arranque del Proyecto.md`. Para crear tu rama y subir tu trabajo con un pull request, sigue la sección 3 de `00 - Como usar los prompts.md`.

## Documentos que debes adjuntar a la IA

- `AGENTS.md`
- `openapi.yaml`
- `HU - Recepcionista.md` (HU-REC-13 a 15) y `HU - Cliente y Huesped.md` (HU-HUE-15 y 16)
- `07 - Estados.md` (secciones 3 a 7 y 11)
- `10 - Reglas de Negocio.md` (reglas RN-PAG, RN-FAC y RN-RES)

## Prompt

```text
Trabajas en el repositorio villa-serena-api del proyecto Villa Serena (lee AGENTS.md
y los documentos adjuntos). Responde en español. Reutiliza tu CargoService y tu
integración con Stripe de OBJ-1B.

1. Cuenta (HU-REC-13 y HU-HUE-15): cargo por alojamiento con detalle por noche (o
   una línea si es de canal), cargos adicionales, pagos con estado y saldo =
   cargos VIGENTE − pagos APROBADO. La cuenta se ve en cualquier estado. El
   huésped solo ve las suyas (ajena = 404).
   - Agregar cargo (Recepción): solo reserva EN_ESTADIA y cuenta ABIERTA; concepto,
     cantidad y precio unitario mayores que 0; total calculado; responsable.
   - Anular cargo: motivo obligatorio, solo cargos adicionales y cuenta ABIERTA.
2. CheckoutService.hacerCheckout(reserva, pagoOpcional, nit, nombreComprador,
   responsable): EL MISMO servicio para Recepción y para la app.
   - Solo EN_ESTADIA. Rechaza si hay un pedido EN_CAMINO.
   - Recepción: si hay saldo, UN solo pago por el total (EFECTIVO, TARJETA u OTRO,
     referencia opcional). App: el saldo debe estar en 0 (pagado por Stripe).
   - Valida el NIT de Guatemala con su dígito verificador (puede terminar en K) o
     acepta "CF".
   - En UNA transacción: factura (llama al FacturaService de Hugo), reserva
     FINALIZADA, cuenta CERRADA, habitación LIBRE + SUCIA (o FUERA_DE_SERVICIO si
     tiene una incidencia que impide su uso; pregúntale a Hugo el método), pedidos
     NUEVO o EN_PREPARACION → CANCELADO sin cargo, solicitudes PENDIENTE o
     EN_PROCESO → CANCELADA, borrar tokens de push del huésped, historial.
     Si algo falla (por ejemplo, la factura), no cambia NADA y se informa el motivo.
     Los pagos aprobados antes se conservan.
   - Publica el cambio de habitación (evento 4) después de confirmar.
3. Pago del saldo desde la app (HU-HUE-16): solo EN_ESTADIA, desde las 00:00 del
   día de salida hasta las 12:00 (America/Guatemala). Crea una sesión de Stripe
   Checkout por el saldo completo; el webhook existente (sesión pagada) registra el
   pago APROBADO. Si el saldo ya es 0, no crea sesión. El check-out de la app solo
   se confirma con saldo 0 y se puede reintentar sin volver a cobrar.
4. Pruebas: saldo con cargos anulados, check-out con pedido EN_CAMINO, fallo de la
   factura (no cambia nada), NIT inválido y ventana de horario de la app.
No crees migraciones: pídeselas a Josué.
Primero muéstrame el plan; después impleméntalo.
```

## Cómo saber que quedó terminado

1. El saldo es correcto con cargos anulados y pagos de distintos estados.
2. Un check-out de Recepción con pago en efectivo deja la reserva `FINALIZADA`, la habitación `LIBRE` + `SUCIA` y la factura emitida.
3. Si la factura falla, la reserva sigue `EN_ESTADIA` y no se registra el pago.
4. Desde la app, pagar el saldo con la tarjeta de prueba lo deja en Q 0.00 y permite el check-out.

## Al terminar

Cuando todo lo de "Cómo saber que quedó terminado" funcione, pega esto a la IA:

```text
Terminamos esta tarea. Muéstrame git status y confirma que no se sube ningún .env
ni claves. Luego haz commit, push y abre el pull request a main con un título que
EMPIECE con "OBJ-4A:" (por ejemplo "OBJ-4A: <resumen corto>"). En la descripción
pon qué se hizo, cómo se probó y la lista de tareas de "17 - Avance del Proyecto.md"
con código OBJ-4A que quedan completas.
```

Pide a un compañero que revise el PR. No marques el archivo 17: Josué lo actualiza una vez al día.
