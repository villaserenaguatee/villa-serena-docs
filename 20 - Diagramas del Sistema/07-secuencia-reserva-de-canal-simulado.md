# 07 — Secuencia: reserva de canal simulado

**Vista:** Secuencia · **Alcance del plan:** Hito.

Booking y Expedia son orígenes simulados, no integraciones comerciales reales.

```mermaid
sequenceDiagram
  actor A as ADMIN
  participant B as Canal simulado / BFF
  participant S as API canal
  participant R as Disponibilidad compartida
  participant D as PostgreSQL
  participant O as Outbox
  A->>B: Elegir canal y datos de prueba
  B->>S: POST reserva con X-Canal-Codigo y X-Canal-Clave
  S->>D: Validar hash de clave, buscar canal e identificador externo
  alt Clave incorrecta
    S-->>B: 401 · no crear nada
  else Identificador ya recibido
    S-->>B: 200 · devolver la misma reserva
  else Nueva petición
    S->>S: Validar principal, fechas, capacidad, tipo y monto
    S->>R: Revalidar cupo por cada noche
    alt Datos inválidos o sin cupo
      S-->>B: 400 o 409 · explicar motivo
    else Válida
      S->>D: CONFIRMADA + código hotel + identificador externo
      S->>D: Cuenta + cargo por monto externo + pago CANAL APROBADO
      S->>O: Correo de confirmación en misma transacción
      S-->>B: 201 · código y resultado
    end
  end
  B-->>A: Mostrar resultado y permitir reenviar para probar idempotencia
  Note over S,D: Recepción ve origen e identificador en búsqueda, detalle y Gantt
```

## Reglas y límites

- La clave del canal permanece en el servidor; se compara su hash en Spring.
- No se recalcula el monto externo ni se permiten cancelaciones de esas reservas.

## Referencias

- [19 §§2–4](../19%20-%20Diseno%20de%20Integracion%20con%20Canales.md)
- [10 RN-CM](../10%20-%20Reglas%20de%20Negocio.md)
- [07 R3,P5](../07%20-%20Estados.md)

**Historias vinculadas:** `HU-CM-01`, `HU-CM-02`, `HU-CM-03`.

[Índice de diagramas](README.md) · [Cobertura de historias](COBERTURA.md) · [Anterior](06-secuencia-reserva-web-stripe-y-vencimiento.md) · [Siguiente](08-secuencia-recepcion-asignacion-y-check-in.md)
