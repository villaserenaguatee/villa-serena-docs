# OBJ-4C — Web: cuenta, check-out e impresión de la factura

| Dato | Valor |
|---|---|
| Objetivo | 4 — Check-out (documento 13) |
| Repositorio | `villa-serena-web` |
| Responsable | Kim |
| Horas estimadas | 3 h (cuenta y cargos 1 h; check-out, factura e impresión 2 h) |
| Cubre | HU-REC-13, HU-REC-14, HU-REC-15 (vista) y HU-REC-16 |
| Depende de | OBJ-0E (proyecto web y BFF). Para conectar: contrato parte 2 (lunes 5), cuenta y check-out de Pablo (OBJ-4A) y factura de Hugo (OBJ-4B) |
| Calendario | **Vie 2: pantallas con datos de prueba** (2 h, adelanto). **Jue 8: conectar al API** (1 h) |

> **Antes de empezar:** prepara tu computadora con la `16 - Guia de Arranque del Proyecto.md`. Para crear tu rama y subir tu trabajo con un pull request, sigue la sección 3 de `00 - Como usar los prompts.md`.

## Documentos que debes adjuntar a la IA

- `AGENTS.md`
- `HU - Recepcionista.md` (HU-REC-13 a HU-REC-16)
- `07 - Estados.md` (sección 5: cuenta, cargos, pagos y factura)
- `openapi.yaml` (desde el lunes 5, con la parte 2)

## Prompt — Viernes 2: pantallas con datos de prueba

```text
Trabajas en el repositorio villa-serena-web del proyecto Villa Serena (lee AGENTS.md
y los documentos adjuntos). Responde en español.

Objetivo: las pantallas de Recepción para la cuenta, el check-out y la factura,
CON DATOS DE PRUEBA. El contrato de estos endpoints se congela el lunes; por eso
los datos van en un solo archivo (lib/mocks/cuenta.ts) con tipos propios, fáciles
de sustituir después.

1. Cuenta (HU-REC-13) en app/panel/recepcion/reservas/[codigo]/cuenta:
   - Cargo por alojamiento con detalle por noche (o una línea si es de canal),
     cargos adicionales con fecha, concepto y monto, pagos con método y estado,
     y saldo en quetzales (Q 0.00). Saldo = cargos VIGENTE − pagos APROBADO.
   - Cargos ANULADO visibles, tachados, con motivo y responsable.
   - "Agregar cargo" (concepto: restaurante, lavandería, estacionamiento u otro;
     cantidad y precio unitario mayores que 0; total calculado). Solo si la
     reserva está EN_ESTADIA y la cuenta ABIERTA.
   - "Anular" con motivo obligatorio, solo en cargos adicionales y con la cuenta
     ABIERTA. El cargo por alojamiento no se anula.
2. Check-out (HU-REC-14), en un diálogo desde la cuenta:
   - Si hay un pedido EN_CAMINO: mensaje de esperar la entrega y botón bloqueado.
   - Si hay saldo: un solo pago por el saldo total con método (Efectivo, Tarjeta u
     Otro) y referencia opcional. Si el saldo es 0, no se pide pago.
   - NIT o "Consumidor Final" y nombre del comprador (por defecto, el del
     huésped). Valida el NIT de Guatemala con su dígito verificador (el último
     carácter puede ser "K"); si no es válido, no deja continuar.
   - Aviso de que se cancelarán sin cargo los pedidos y solicitudes pendientes.
3. Factura (HU-REC-15, solo vista) en app/panel/recepcion/facturas/[id]: datos del
   hotel, serie y número, fecha y hora, NIT y nombre, código de reserva, cargos
   sin los anulados, total con "IVA incluido", pagos (método y monto) y la
   leyenda "Factura de demostración — no válida ante la SAT".
4. Impresión (HU-REC-16): botón "Imprimir" con dos formatos, ticket de 80 mm y
   hoja carta. Usa CSS de impresión (@media print y @page) para que solo se
   imprima la factura, sin menús; en 80 mm los montos quedan alineados y nada se
   corta. Al terminar el check-out se ofrece imprimir de inmediato.

No hagas: no conectes todavía al API, no agregues abonos, descuentos ni
anulación de facturas. Trabaja solo dentro de app/panel/recepcion y
components/panel.

Primero muéstrame el plan de archivos; después créalos por pasos.
```

## Prompt — Jueves 8: conectar al API

```text
Seguimos en villa-serena-web. Responde en español. Copia el openapi.yaml más
reciente y regenera los tipos.

Sustituye los datos de prueba de lib/mocks/cuenta.ts por las llamadas reales al
API (a través del BFF) para la cuenta, agregar y anular cargos, el check-out y el
detalle de la factura, según openapi.yaml. Muestra los errores del API con su
mensaje en español. Al terminar, borra el archivo de datos de prueba.
No cambies el diseño ni agregues funciones.
```

## Cómo saber que quedó terminado

1. Con datos de prueba: la cuenta muestra los cargos, los anulados tachados, los pagos y el saldo correcto.
2. Un NIT inválido no deja continuar; "Consumidor Final" sí.
3. La vista de impresión de 80 mm cabe en el ancho del ticket (vista previa del navegador) y la de carta se ve completa, sin menús.
4. Conectado al API (jueves 8): un check-out real deja la reserva `FINALIZADA`, muestra la factura y la imprime.

## Al terminar

Cuando tu pull request se fusione, abre `17 - Avance del Proyecto.md` (repositorio `villa-serena-docs`), cambia tu casilla de `[ ]` a `[x]` y agrega el número del PR. Si no sabes cómo, avisa en el grupo y Josué la marca.
