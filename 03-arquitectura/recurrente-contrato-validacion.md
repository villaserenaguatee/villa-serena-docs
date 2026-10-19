# Recurrente: reconciliación del bloque de pagos (docs #23)

Propuesta local en `docs/issue-23-contrato-recurrente`, desde docs `main`
`f30ff74fe939d467728c51c31d7aca157b3be34e`. Sin commit, push, PR ni merge.
No modifica frontend, backend ni worktrees anteriores.

## Fuente y alcance

- [Docs #23](https://github.com/villaserenaguatee/villa-serena-docs/issues/23): este cambio cubre solamente pagos. No resuelve sus demás áreas.
- [API #54](https://github.com/villaserenaguatee/villa-serena-api/issues/54) y [API PR #61](https://github.com/villaserenaguatee/villa-serena-api/pull/61), integradas en `dev`.
- Código inspeccionado: API `414220894184143f6416693d67b8ffbb7df37698`.
- Consumidor pendiente: [Web #61](https://github.com/villaserenaguatee/villa-serena-web/issues/61), utilizando la adopción de [Web PR #64](https://github.com/villaserenaguatee/villa-serena-web/pull/64).

El YAML de pagos del backend se contrastó con Java; no se copió completo ni se
revirtieron el encabezado canónico o Nacionalidad opcional. Las pruebas conservan
los otros endpoints y DTO de huésped. No se declara conformidad global de Spring.

## Archivos y comportamiento

`openapi.yaml`:

- Mantiene `POST /api/v1/publico/reservas/{codigo}/pago`,
  `GET /api/v1/publico/reservas/{codigo}/estado` y
  `POST /api/v1/app/reservas/{codigo}/pago-saldo`.
- `PagoIniciado` conserva `urlPago` y `expiraEn`; no inventa `checkout_url` en la
  respuesta de Villa Serena. Ese nombre corresponde al proveedor y se transforma
  en `PasarelaRecurrenteClient`. `expiraEn` admite null en saldo cuando el proveedor
  no informa vencimiento, como permite `PagoSaldoAppService`; en reserva web se
  calcula desde su plazo.
- Pagos nuevos en GTQ con método `RECURRENTE`; mantiene `STRIPE` para lectura y
  auditoría históricas. Ejemplos activos y descripciones usan Recurrente.
- Sustituye únicamente el webhook HTTP anterior por
  `POST /api/v1/pagos/recurrente/webhook`, según el controlador integrado.
  No conserva una ruta Stripe que ya no existe en la implementación.
- Requiere conjuntamente `svix-id`, `svix-timestamp` y `svix-signature`, sin JWT.
  Firma HMAC SHA-256 del cuerpo original y ventana de cinco minutos; idempotencia
  por `svix-id`. Describe errores reales 400, 409 y 502.
- `EventoRecurrente` acepta `event_type`, o `type` si el primero falta/es null.
  No exige el id del cuerpo ni los tres campos obligatorios del YAML antiguo del
  API, porque Java no los exige. `checkout.id` es obligatorio solo para
  `intent.succeeded` y `checkout.expired`; otros eventos no vacíos se ignoran con 200.
- Antes de aprobar se consulta Recurrente y se concilian monto, GTQ e identificador
  del pago. El evento o el retorno no sustituyen esa consulta. El job de vencimiento
  también puede conciliar un pago ya confirmado y no libera cupo en proceso.
- Éxito y cancelación de reserva regresan a
  `{WEB_URL}/reserva/resultado?codigo={codigo}`. El estado lo determina el backend,
  nunca parámetros como `success` o `paid`. El saldo retorna a `APP_URL_RETORNO`
  con `codigo`. Sesiones abiertas se reutilizan; pagadas/en proceso producen
  `409 PAGO_EN_VERIFICACION` antes de crear otro intento.
- Para un reembolso histórico que corresponde a Stripe, documenta
  `409 PAGO_LEGADO_REQUIERE_CONCILIACION`: no reembolsa por Recurrente ni cancela
  la reserva. Conserva los registros; no cambia su proveedor.
- Actualiza las extensiones de permisos/integraciones del mismo bloque.

`scripts/contrato-api.test.mjs`: añade cuatro regresiones de contrato para el
cambio único de ruta, DTO/métodos históricos, encabezados Svix conjuntos y forma
del evento. Las tres pruebas anteriores de herramientas permanecen.

## Verificación

- `pnpm install --frozen-lockfile`: pasa, sin cambios de dependencias o lockfile.
- `pnpm check`: pasa validación del contrato, resolución de referencias,
  generación TypeScript y 7/7 pruebas, sin omitidas.
- Generación a un `.d.ts` temporal y `--check`: pasan; el generado queda fuera de Git.
- `git diff --check`: pasa. TypeScript del generado (`tsc --noEmit --skipLibCheck`): pasa.

La primera ejecución detectó una indentación YAML incorrecta en el texto de
revisión; se corrigió y la validación posterior pasó. El mensaje de referencia
inexistente durante la prueba negativa de herramientas es esperado, no un fallo.
Estas son pruebas de contrato: no se ejecutaron Spring, pagos, webhooks ni correos.

## Límites y adopción pendiente

1. Revisar e integrar esta propuesta en `main` de docs. Después fijar su SHA
   completo integrado en web #61 y regenerar tipos mediante las herramientas de
   #63. No se inventa un SHA antes del commit ni se cambia el frontend hoy.
2. `PagoOnlineService.estadoPublico` consulta actualmente solo pagos RECURRENTE.
   Una reserva histórica pagada con Stripe puede devolver `estadoPago: null`.
   El contrato refleja esta implementación; conservar la base no garantiza que
   el resumen público anterior interprete ese caso. Alex y web deben acordar su
   tratamiento antes de dar por validada la compatibilidad del recorrido histórico.
3. La prueba completa con credenciales Sandbox, webhook firmado, retornos y saldo
   sigue pendiente. La PR del API informa pruebas técnicas, no ese recorrido real.
4. ADR-017 usa nombres orientativos anteriores (`checkout_url`, eventos y rutas).
   Los nombres precisos para consumidores quedan en este contrato y se justifican
   por los DTO/controladores citados. No se implementa lo que solo sugiere el ADR.
5. Las demás diferencias de docs #23 (reservas/ofertas, autenticación, chat,
   documentos, administración, laboral, etc.) permanecen fuera de este bloque.
