# 02 — Participantes y responsabilidades

**Vista:** Participantes · **Alcance del plan:** Mixto.

Cliente y huésped pueden ser la misma persona; sus accesos y permisos son diferentes.

```mermaid
flowchart LR
  C[Cliente · sin cuenta] --> PUB[Hotel / catálogo / disponibilidad / reserva / Stripe]
  H[Huésped principal · OTP] --> APP[Sus reservas / cuenta / pedidos / solicitudes / check-out / factura]
  R[RECEPCION] --> REC[Huéspedes / búsqueda / Gantt / asignación / check-in / cargos / cancelación / salida]
  RS[ROOM_SERVICE] --> ROOM[Cola / detalle / avance / cancelación / marcar agotado]
  MY[MYL · LIMPIEZA o AMBAS] --> LIM[Habitaciones pendientes / tomar y atender solicitudes]
  MT[MYL · MANTENIMIENTO o AMBAS] --> MAN[Tomar y resolver incidencias]
  R & MY & MT --> DAN[Reportar daños]
  AD[ADMIN] --> SIM[Canal simulado · activo en el hito]
  AD -.-> ADM[Personal / catálogos / tarifas / hotel / indicadores / consulta incidencias · pospuesto]
  AD -.-> N2[Amenidades / Wi-Fi / turnos / inventario · Nivel 2]
  SYS[SISTEMA] --> AUTO[Caducidad / efectos transaccionales / Outbox / historial]
  ST[STRIPE] --> PAG[Webhook pagado o vencido]
  CAN[CANAL] --> EXT[Crear reserva externa · sin consultar ni cancelar]
```

## Reglas y límites

- MYL es un rol con áreas LIMPIEZA, MANTENIMIENTO o AMBAS.
- ADMIN no hereda permisos de Recepción, Room Service ni piso.
- Administración está documentada como Nivel 1, pero pospuesta del hito por el plan.

## Referencias

- [02](../02%20-%20Definicion%20de%20Roles.md)
- [09 §§3–6](../09%20-%20Matriz%20de%20Permisos.md)
- [12 §2](../12%20-%20Casos%20de%20Uso.md)
- [13 §9](../13%20-%20Plan%20de%20Trabajo.md)

[Índice de diagramas](README.md) · [Cobertura de historias](COBERTURA.md) · [Anterior](01-componentes-y-conexiones.md) · [Siguiente](03-actividad-general-de-la-reserva-a-la-siguiente-llegada.md)
