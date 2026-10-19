# ADR-017: Sustitución de Stripe por Recurrente como Pasarela de Pagos

* **Estado:** Aceptado / En proceso de migración
* **Fecha:** 18 de octubre de 2026
* **Decisores:** Alex (Scrum Master), Kimberly (Product Owner), Josué (Arquitectura)
* **Reemplaza a:** AD-17 (Stripe Checkout en modo prueba)

---

## 1. Contexto y Problema

En la fase inicial de concepción del PMS **Villa Serena**, se seleccionó **Stripe Checkout** (`AD-17`) como pasarela de demostración por ser una convención académica común en cursos de desarrollo web.

Sin embargo, el hotel boutique ficticio opera con moneda oficial en **Quetzales guatemaltecos (GTQ)** (`D-02`, `AD-19`). En el entorno real:
1. **Falta de soporte local de Stripe:** Stripe no ofrece adquirencia bancaria directa en Guatemala ni liquidación en cuentas bancarias locales en GTQ.
2. **Coherencia del modelo de negocio:** Un hotel boutique en Guatemala procesa cobros a través de pasarelas locales que aceptan tarjetas de crédito/débito nacionales e internacionales con liquidación en bancos del sistema guatemalteco.
3. **Alternativa local consolidada:** **Recurrente** ([recurrente.com](https://recurrente.com)) es la pasarela de pagos líder en Guatemala y Centroamérica. Proporciona una API REST moderna para generación de Checkouts alojados (*Hosted Checkout*), cobro directo en GTQ y USD, y notificaciones webhook seguras mediante firmas criptográficas.

---

## 2. Decisión

Se aprueba **sustituir Stripe por Recurrente** como la pasarela de pagos oficial del sistema Villa Serena:

1. **Abstracción de la Pasarela en el Backend (`villa-serena-api`):**
   * Refactorizar la interfaz `com.villaserena.api.reservas.stripe.PasarelaStripe` para generalizarla a un contrato agnóstico: `PasarelaPagos`.
   * Implementar `PasarelaRecurrenteSdk` / `PasarelaRecurrenteClient` consumiendo la API pública de Recurrente (`POST https://app.recurrente.com/api/checkouts`).
   * Configurar el controlador de webhooks (`/api/pagos/recurrente/webhook`) para recibir y verificar eventos de checkout completado (`checkout.succeeded` / `payment.succeeded`).
   * Mantener la cancelación automática a los 30 minutos mediante `@Scheduled` para reservas no pagadas.

2. **Adaptación en el Frontend (`villa-serena-web`):**
   * El flujo de reserva pública continuará recibiendo la URL del checkout alojado (`checkout_url`) generada por el backend y redirigiendo al cliente.
   * La página de retorno (`/reservas/resultado` o `/reservas/confirmacion`) procesará los parámetros de confirmación emitidos por Recurrente tras el pago exitoso.

3. **Variables de Entorno y Secretos:**
   * Sustituir las variables `STRIPE_API_KEY`, `STRIPE_WEBHOOK_SECRET` por:
     * `RECURRENTE_PUBLIC_KEY` (clave pública para inicialización o front)
     * `RECURRENTE_SECRET_KEY` (clave privada para peticiones de checkout desde el API)
     * `RECURRENTE_WEBHOOK_SECRET` (secreto para verificar la autenticidad de los webhooks)

---

## 3. Consecuencias y Beneficios

### Positivas
* **Coherencia absoluta con la moneda (GTQ):** Cobros directamente tasados y procesados en Quetzales, eliminando discrepancias de divisas.
* **Integración realista para Guatemala:** Empleo de una solución de pagos real y ampliamente utilizada en la industria hotelera y de comercio electrónico nacional.
* **Mantenimiento del desacoplamiento:** Dado que la lógica de reservas interactúa con una interfaz de pasarela, el impacto en las entidades `Reserva`, `Cuenta` y `Pago` es nulo.

### Negativas / Esfuerzo de Adaptación
* **Refactorización en `villa-serena-api`:** Modificar el paquete de reservas/pagos, adaptar el DTO del webhook y actualizar las suites de pruebas de integración (`ReservaWebIntegrationTest`).
* **Actualización en `villa-serena-web`:** Actualizar los tipos generados de OpenAPI y adaptar la redirección del BFF.
* **Depreciación de herramientas de Stripe:** Sustituir la dependencia de `stripe-java` y el uso de `stripe-cli` por pruebas con payloads JSON de Recurrente o túneles de desarrollo.
