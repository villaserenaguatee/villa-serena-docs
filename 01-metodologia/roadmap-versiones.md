# Roadmap por Versiones Incrementales

Para evitar el agotamiento y la parálisis por exceso de alcance, el desarrollo de **Villa Serena** se divide en **tres fases incrementales**. Cada fase produce una versión funcional completa que incrementa el valor del producto de manera controlada, de lo indispensable a lo avanzado.

---

## 1. Resumen de Fases

| Versión | Nombre | Enfoque | Complejidad | Estado |
|---|---|---|---|---|
| **`v0.1.0`** | **MVP Crítico** | El flujo principal de punta a punta (Reserva $\rightarrow$ Check-in $\rightarrow$ Check-out) | Baja - Media | **En curso** |
| **`v0.2.0`** | **Operativa & Móvil** | App del huésped y personal operativo, Room Service en vivo y gestión de piso (Docs #63) | Media - Alta | Planificada |
| **`v0.3.0`** | **Integral & Analítica** | Turnos, inventario compartido, canales externos y métricas | Alta (Opcional) | Futura |

---

## 2. Detalle de Versiones

### Fase 1: `v0.1.0` — Mínimo Producto Viable (MVP)
> **Meta:** Garantizar que un cliente ficticio pueda reservar, pagar, ingresar al hotel y salir con su factura, sin bloqueos técnicos.

* **Flujo cubierto:**
  1. **Catálogo y Disponibilidad:** Visualización pública de tipos de habitación y consulta de disponibilidad para fechas seleccionadas.
  2. **Reserva Web con Pago Único:** Formulario básico de datos del cliente (nombre, correo, teléfono, documento) y procesamiento de pago mediante el checkout alojado de Recurrente en Sandbox, en GTQ (100% de la estadía), según el [contrato vigente](../03-arquitectura/contrato-api.md).
  3. **Check-in en Recepción:** El personal de recepción busca la reserva por código o apellido, confirma los datos y asigna una habitación libre y limpia.
  4. **Cuentas y Consumos:** Registro básico de cargos a la habitación y verificación del balance de la cuenta.
  5. **Check-out y Factura:** Cierre de la cuenta en recepción con saldo pagado y generación de factura PDF de demostración. La habitación pasa automáticamente al estado `Libre + Sucia`.

* **Criterios de simplificación deliberada (Issue `#60` de Web):**
  * Sin inicio de sesión federado (Google/Facebook): datos ingresados manualmente.
  * Sin módulo de traducción multiidioma (todo en español).
  * Sin soporte para pasaportes complejos: formulario simple con cédula/DPI o documento universal.
  * Sin abonos, anticipos ni pagos parciales (pago único total).
  * Sin modificación de reservas existentes (se cancela y crea una nueva).
* **Guion reproducible de integración:** consulta el [Guion de Validación del Flujo MVP (`v0.1.0`) con Recurrente](../04-guias-y-referencia/validacion-mvp-v0-1-0.md).

---

### Fase 2: `v0.2.0` — Versión Operativa & Experiencia del Huésped
> **Meta:** Digitalizar la interacción del huésped en el hotel y la operación interna del personal en tiempo real.

* **Flujo cubierto:**
  1. **Conserjería Móvil (App Android):**
     * Acceso del huésped a la app mediante código de un solo uso (OTP de 6 dígitos) enviado por correo electrónico.
     * Consulta del detalle de la reserva y número de habitación asignada.
     * Envío de solicitudes de limpieza y artículos adicionales (toallas, almohadas).
  2. **Room Service en Tiempo Real:**
     * Catálogo de alimentos y bebidas en la app móvil.
     * Creación de pedidos cargados directamente a la cuenta de la habitación.
     * Actualización instantánea en la cocina/recepción vía WebSocket (STOMP).
     * Notificación de estado del pedido (`En preparación` $\rightarrow$ `En camino` $\rightarrow$ `Entregado`).
  3. **Mantenimiento y Pisos (web y Android del personal, Docs #63):**
     * Módulo de limpieza para el personal (habitaciones por limpiar, en limpieza, limpias).
     * Reporte de incidencias y averías con fotografía subida a almacenamiento de objetos (R2 dev / S3 prod).
  4. **Recepción Visual:**
     * Vista de calendario interactivo tipo Gantt para supervisión rápida de ocupación.

---

### Fase 3: `v0.3.0` — Versión Integral & Analítica
> **Meta:** Robustecer la gestión administrativa del hotel con módulos complementarios y observabilidad.

* **Flujo cubierto:**
  1. **Gestión de Personal y Turnos:** Planificación básica de turnos de trabajo para los empleados del hotel.
  2. **Inventario Compartido:** Control de existencias de insumos mediante entradas, salidas y mermas manuales, compartido con compras y repuestos de mantenimiento, según el [acuerdo de inventario](../02-producto/inventario-turnos-personal.md#7-inventario-compartido-nivel-2).
  3. **Canales de Venta Externos:** Simulación de recepción de reservas externas a través de endpoints de Channel Manager.
  4. **Métricas y Observabilidad:** Dashboards de monitoreo en Prometheus y Grafana (latencia del API, tasas de error y transacciones de reservas).

---

## 3. Trazabilidad con el Catálogo de Alcance (`ALC-*`)

La asignación detallada de las **58 funcionalidades de Nivel 1** y las **6 de Nivel 2** a cada una de estas tres versiones (`v0.1.0`, `v0.2.0` y `v0.3.0`), junto con el estado de los supuestos técnicos `S-01` a `S-04` y las confirmaciones académicas, se consulta en [Alcance del Proyecto y Decisiones Generales (§§5, 8 y 9)](../02-producto/alcance-y-decisiones.md#5-alcance-del-sistema-y-conciliación-por-versión).
