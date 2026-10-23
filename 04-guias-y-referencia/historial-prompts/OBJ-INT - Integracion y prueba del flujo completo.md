# OBJ-INT — Integración y prueba del flujo completo (referencia histórica)

> **Guion histórico sustituido para el MVP (`v0.1.0`):** este documento conserva los 18 pasos originales del plan inicial (que combinaban capacidades de `v0.1.0`, `v0.2.0` y `v0.3.0`, usaban Stripe y fijaban las fechas vencidas del 9 y 10 de octubre). Para validar el flujo vigente de `v0.1.0` con **Recurrente**, consulta el **[Guion de Validación del Flujo MVP (`v0.1.0`) con Recurrente](../validacion-mvp-v0-1-0.md)** y el **[Roadmap por versiones](../../01-metodologia/roadmap-versiones.md)**.

| Dato | Valor |
|---|---|
| Objetivo | Integración (documento 13, sección 7) |
| Repositorios | Todos |
| Responsables iniciales | Los 6 integrantes (el compromiso antiguo de 3 h por persona fue retirado en #13) |
| Calendario | **Histórico (vencido):** viernes 9 y sábado 10 de octubre. La fecha del ensayo vigente la acuerda el equipo según disponibilidad |
| Depende de | Que los objetivos del MVP (`v0.1.0`) estén integrados |

> **Contexto de integración:** los repositorios necesarios se sincronizan con su rama de integración, preservando los cambios locales según AGENTS.md. La [guía de arranque local](../arranque-local.md) describe el encendido del entorno.

## 1. Cómo se organiza el viernes 9

| Persona | Qué revisa primero |
|---|---|
| Josué | Docker, base de datos y que todo arranque desde cero (`down -v` y `up -d`); Alex facilita la resolución de bloqueos y el equipo mantiene las issues de errores |
| Pablo | Reservas, pagos con Stripe y check-out |
| Hugo | Room Service, tiempo real, limpieza, incidencias y factura |
| Kim | Web pública, Recepción (Gantt, reserva y check-in), limpieza y check-out |
| Alex | BFF, sesión del personal, búsqueda, habitaciones, Room Service e incidencias |
| Carlos | App: acceso, estadía, pedidos, solicitudes, cuenta, check-out y push |

**Alcance:** la integración comprueba el flujo acordado y corrige sus defectos. Las propuestas de nuevas funcionalidades se registran como issues para su valoración por el equipo y Kimberly.

## 2. Guion de la prueba del flujo completo

Hacerlo en una sola computadora (la que se usará en la demostración), con Docker, API, web, Stripe CLI y la app en el teléfono en la misma red Wi-Fi. Marcar cada paso.

**Reservar**
- [ ] 1. En la web pública: ver el hotel y el catálogo, buscar fechas y ver el precio con su desglose.
- [ ] 2. Llenar los 6 datos, ir a Stripe y pagar con la tarjeta de prueba → página "Confirmada".
- [ ] 3. Llega el correo de confirmación a Mailpit.
- [ ] 4. Canal simulado (Administrador): enviar una reserva → 201; reenviarla → 200 sin duplicar.

**Recepción**
- [ ] 5. Iniciar sesión como Recepcionista. Ver ambas reservas en la búsqueda y en el Gantt con su canal.
- [ ] 6. Crear una reserva desde Recepción y cancelar otra pagada con 48 h o más → reembolso en Stripe.
- [ ] 7. Asignar habitación, hacer el check-in → `EN_ESTADIA` y habitación `OCUPADA` (se ve en vivo en el tablero).

**Estadía (app)**
- [ ] 8. En la app: entrar con el correo y el código que llega a Mailpit.
- [ ] 9. Pedir room service → aparece en vivo en la pantalla de Room Service.
- [ ] 10. Avanzar el pedido hasta `ENTREGADO` → la app cambia sola, llega el push y aparece el cargo en la cuenta.
- [ ] 11. Pedir limpieza y artículos → aparecen en vivo en Limpieza; atender una → push.

**Operación**
- [ ] 12. Limpieza: iniciar y terminar una habitación sucia → Recepción lo ve en vivo.
- [ ] 13. Reportar un daño con foto que impide el uso de una habitación libre → `FUERA_DE_SERVICIO`; tomarlo y resolverlo → `SUCIA`.

**Check-out**
- [ ] 14. Recepción: agregar un cargo, anular otro y ver el saldo correcto.
- [ ] 15. Check-out con pago único (o desde la app con Stripe) → factura emitida, impresa en 80 mm o carta, y PDF en Mailpit.
- [ ] 16. Reserva `FINALIZADA` y habitación `LIBRE` + `SUCIA`.

**Tecnologías obligatorias**
- [ ] 17. Grafana (http://localhost:3001) muestra el estado y las peticiones del API.
- [ ] 18. En las herramientas del navegador, el JWT no aparece (cookies httpOnly).

## 3. Registro de errores

Cada fallo se registra como issue con este contexto; Alex facilita la resolución de bloqueos y el equipo coordina quién lo atiende:

```text
Paso N — reproducción — resultado observado — resultado esperado — componente afectado
```

Si al final del viernes un paso no funciona, se decide si se omite en la demostración o se aplica un recorte de reserva (documento 13, sección 9.2).

## 4. Ensayo del sábado 10

1. Arrancar todo desde cero 1 hora antes (`down -v`, `up -d`, API, web y app).
2. Recorrer el guion de la sección 2 una vez completo, cronometrado.
3. Repartir quién muestra cada parte.
4. Tener a mano: usuarios de prueba, tarjeta de prueba de Stripe y el correo del huésped de prueba.

## Contexto para investigar un fallo de integración

```text
Estoy integrando el proyecto Villa Serena (acuerdos en AGENTS.md). Comunicación en español.
El paso "<número y nombre del paso>" del guion de integración falla.
Qué hice: <pasos>. Qué pasó: <mensaje o pantalla>. Qué esperaba: <resultado>.
Errores en consola o en los registros: <pégalos, SIN claves ni contraseñas>.
Resultado esperado: causa identificada y corrección acotada al fallo, con
verificación del paso afectado y las versiones acordadas. El agente presenta
un plan breve y continúa con la reparación autorizada. Las decisiones de
alcance se registran como issues y se consultan.
```

## Al terminar

Marcar en `17 - Avance del Proyecto.md` las casillas de integración y del ensayo.
