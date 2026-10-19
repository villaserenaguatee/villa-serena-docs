# OBJ-4D — App: cuenta y pago del saldo

| Dato | Valor |
|---|---|
| Objetivo | 4 — Check-out (documento 13) |
| Repositorio | `villa-serena-movil` |
| Responsable inicial | Carlos |
| Horas estimadas | 3 h (ver mi cuenta 0,5 h; pagar el saldo y check-out 2,5 h) |
| Cubre | HU-HUE-15, HU-HUE-16 |
| Depende de | OBJ-0F (proyecto Expo). Para conectar: contrato parte 2 (lunes 5), acceso del huésped (OBJ-3A-2) y cuenta y pago desde la app de Pablo (OBJ-4A) |
| Calendario | **Vie 2: pantallas con datos de prueba** (2 h, adelanto). **Jue 8: conectar al API** (1 h) |

> **Referencias de trabajo:** la guía 16 describe el entorno; la guía 00, sección 3, describe el flujo con issues, ramas y PR hacia `develop`.

## Referencias para la tarea

La lectura se limita a las secciones necesarias para la issue. AGENTS.md contiene los acuerdos de colaboración; estas referencias se amplían solo si hay una dependencia o discrepancia.

- `AGENTS.md`
- `HU - Cliente y Huesped.md` (HU-HUE-15 y HU-HUE-16)
- `07 - Estados.md` (sección 5: cuenta, cargos, pagos y factura)
- `openapi.yaml` (desde el lunes 5, con la parte 2)

El agente presenta un plan breve y continúa con el trabajo autorizado. La implementación puede adaptarse a la estructura existente; el resultado cumple los criterios siguientes.

## Resultado esperado — Viernes 2: pantallas con datos de prueba

```text
Contexto: repositorio villa-serena-movil del proyecto Villa Serena (acuerdos en
AGENTS.md y referencias pertinentes de la tarea). Comunicación en español. Expo SDK 54 y Expo
Router, manteniendo SDK 54.

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

Esta etapa usa datos de prueba; la siguiente conecta al API. La app permanece
libre de datos de tarjeta y los pagos parciales están fuera de alcance.
```

## Resultado esperado — Jueves 8: conectar al API

```text
Contexto: villa-serena-movil. Comunicación en español. Los tipos se generan desde la copia local actualizada
de openapi.yaml.

La pantalla sustituye los datos de lib/mocks/cuenta.ts por llamadas reales al
API (con el JWT del huésped) para la cuenta, iniciar el pago del saldo, el
check-out y la factura, según openapi.yaml. Los errores del API se muestran con su
mensaje en español; el archivo de datos de prueba deja de formar parte de la solución.
El diseño y el alcance funcional se conservan al conectar el API.
```

## Cómo saber que quedó terminado

1. Con datos de prueba, en Expo Go: la cuenta muestra los cargos, los anulados marcados, los pagos y el saldo correcto.
2. Fuera de la ventana de check-out aparece el aviso de ir a Recepción; con un pedido `EN_CAMINO`, no deja continuar.
3. Un NIT inválido muestra el mensaje; "Consumidor Final" sí deja continuar.
4. Conectado al API (jueves 8): un pago de prueba en Stripe deja el saldo en Q 0.00 y el check-out muestra la factura.

## Al terminar

Después de integrar la PR en `develop` y verificar el resultado, la issue queda actualizada o cerrada y la casilla correspondiente de `17 - Avance del Proyecto.md` incluye el número de PR (guía 00, sección 3). Si hay un bloqueo, Alex facilita su resolución; el avance puede actualizarlo quien completó la tarea.
