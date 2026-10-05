# OBJ-4D — App: cuenta y pago del saldo

| Dato | Valor |
|---|---|
| Objetivo | 4 — Check-out (documento 13) |
| Repositorio | `villa-serena-movil` |
| Responsable | Carlos |
| Horas estimadas | 3 h (ver mi cuenta 0,5 h; pagar el saldo y check-out 2,5 h) |
| Cubre | HU-HUE-15, HU-HUE-16 |
| Depende de | OBJ-0F (proyecto Expo). Para conectar: contrato parte 2 (lunes 5), acceso del huésped (OBJ-3A-2) y cuenta y pago desde la app de Pablo (OBJ-4A) |
| Calendario | **Vie 2: pantallas con datos de prueba** (2 h, adelanto). **Jue 8: conectar al API** (1 h) |

> **Antes de empezar:** prepara tu computadora con la `16 - Guia de Arranque del Proyecto.md`. Para crear tu rama y subir tu trabajo con un pull request, sigue la sección 3 de `00 - Como usar los prompts.md`.

## Documentos que debes adjuntar a la IA

- `AGENTS.md`
- `HU - Cliente y Huesped.md` (HU-HUE-15 y HU-HUE-16)
- `07 - Estados.md` (sección 5: cuenta, cargos, pagos y factura)
- `openapi.yaml` (desde el lunes 5, con la parte 2)

## Prompt — Viernes 2: pantallas con datos de prueba

```text
Trabajas en el repositorio villa-serena-movil del proyecto Villa Serena (lee
AGENTS.md y los documentos adjuntos). Responde en español. Expo SDK 54 y Expo
Router; no cambies de SDK.

Objetivo: las pantallas de la cuenta y del check-out del huésped CON DATOS DE
PRUEBA. El contrato de estos endpoints se congela el lunes; por eso los datos van
en un solo archivo (lib/mocks/cuenta.ts) con tipos propios, fáciles de sustituir.

1. Mi cuenta (HU-HUE-15), pantalla de solo lectura:
   - Cargo por alojamiento y cargos adicionales con fecha, concepto y monto.
   - Cargos ANULADO marcados como anulados y fuera del saldo.
   - Pagos con fecha, método, monto y estado.
   - Saldo en quetzales (Q 0.00). Saldo = cargos VIGENTE − pagos APROBADO.
   - Se recarga al abrir la pantalla y al deslizar hacia abajo.
2. Check-out desde la app (HU-HUE-16):
   - Solo con la reserva EN_ESTADIA, desde las 00:00 del día de salida hasta las
     12:00 (hora de Guatemala, America/Guatemala). Fuera de esa ventana: aviso de
     hacer el check-out en Recepción.
   - Si hay un pedido EN_CAMINO: aviso de esperar la entrega y no deja seguir. Si
     hay pedidos NUEVO o EN_PREPARACION: avisa que se cancelarán sin cargo y el
     huésped debe aceptar.
   - Si el saldo es mayor que 0: botón "Pagar saldo" que abre la página de Stripe
     con expo-web-browser (openAuthSessionAsync) y vuelve a la app con el
     esquema villaserena://. Al volver, consulta la cuenta hasta que el saldo sea
     Q 0.00 (el pago solo cuenta cuando llega el webhook). Si ya es 0, salta este
     paso.
   - NIT o "Consumidor Final" y nombre del comprador (por defecto, el del
     huésped). Valida el NIT de Guatemala con su dígito verificador (el último
     carácter puede ser "K"); un NIT inválido muestra un mensaje claro.
   - "Confirmar check-out" solo con saldo Q 0.00.
   - Pantalla final con la factura (botón para abrir el PDF) y sin opciones de
     pedidos ni solicitudes.
   - Si el check-out falla, muestra el motivo y permite reintentar sin volver a
     cobrar.

No hagas: no conectes todavía al API, no guardes datos de tarjeta, no agregues
pagos parciales.

Primero muéstrame el plan de archivos; después créalos por pasos.
```

## Prompt — Jueves 8: conectar al API

```text
Seguimos en villa-serena-movil. Responde en español. Copia el openapi.yaml más
reciente y regenera los tipos.

Sustituye los datos de prueba de lib/mocks/cuenta.ts por las llamadas reales al
API (con el JWT del huésped) para la cuenta, iniciar el pago del saldo, el
check-out y la factura, según openapi.yaml. Muestra los errores del API con su
mensaje en español. Al terminar, borra el archivo de datos de prueba.
No cambies el diseño ni agregues funciones.
```

## Cómo saber que quedó terminado

1. Con datos de prueba, en Expo Go: la cuenta muestra los cargos, los anulados marcados, los pagos y el saldo correcto.
2. Fuera de la ventana de check-out aparece el aviso de ir a Recepción; con un pedido `EN_CAMINO`, no deja continuar.
3. Un NIT inválido muestra el mensaje; "Consumidor Final" sí deja continuar.
4. Conectado al API (jueves 8): un pago de prueba en Stripe deja el saldo en Q 0.00 y el check-out muestra la factura.

## Al terminar

Cuando tu pull request se fusione, abre `17 - Avance del Proyecto.md` (repositorio `villa-serena-docs`), cambia tu casilla de `[ ]` a `[x]` y agrega el número del PR. Si no sabes cómo, avisa en el grupo y Josué la marca.
