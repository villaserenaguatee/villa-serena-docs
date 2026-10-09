# 10 — Secuencia: OTP, mis reservas y sesión de la app

**Vista:** Secuencia · **Alcance del plan:** Hito.

Solo el huésped principal se autentica; todas sus reservas se vinculan por correo.

```mermaid
sequenceDiagram
  actor H as Huésped principal
  participant A as App Android
  participant S as API auth / reservas
  participant D as PostgreSQL
  participant O as Outbox / correo
  H->>A: Correo y solicitar código
  A->>S: Solicitar OTP
  alt Tiene reservas y acceso permitido
    S->>D: OTP con hash, vencimiento y consumo único
    S->>O: Encolar correo con código
    O-->>H: Recibir OTP
  else Sin reservas o con bloqueo vigente
    Note over S,O: No revelar si el correo existe
  end
  S-->>A: Mensaje genérico
  H->>A: Introducir OTP
  A->>S: Verificar código
  S->>D: Comprobar vencimiento, uso, hash e intentos
  alt Incorrecto, vencido, usado o bloqueado
    S->>D: Conservar contador y bloqueo de fallos
    S-->>A: 401 sin tokens
  else Correcto
    S->>D: Consumir OTP y guardar hash de refresh
    S-->>A: JWT HUESPED 15 min y refresh 7 días
    A->>A: Guardar en SecureStore
    A->>S: Consultar solo mis reservas y cuenta
    S-->>A: Selector o abrir EN_ESTADIA, habitación o Por asignar
  end
  opt Permiso push concedido
    A->>S: Registrar token Expo como dispositivo propio
    S->>D: Guardar vínculo con huésped autenticado
  end
  opt JWT vencido
    A->>S: Renovar una vez y rotar refresh
    S-->>A: Nuevo par o volver a OTP
  end
  H->>A: Cerrar sesión
  A->>S: Revocar refresh y borrar registros push
  S->>D: Guardar efectos
  A->>A: Borrar SecureStore
```

## Reglas y límites

- OTP: seis dígitos, diez minutos y un solo uso; cinco verificaciones fallidas bloquean quince minutos.
- Sin reservas se responde el mismo mensaje genérico. Un recurso ajeno responde 404.
- Permiso push rechazado no impide usar la app; cerrar sesión o finalizar borra los dispositivos.

## Referencias

- [10 RN-APP-001–011](../10%20-%20Reglas%20de%20Negocio.md)
- [09 VIS-01,7.2](../09%20-%20Matriz%20de%20Permisos.md)
- [14 §6.1.8](../14%20-%20Tecnologias%20y%20Arquitectura.md)

**Historias vinculadas:** `HU-HUE-08`, `HU-HUE-09`, `HU-HUE-17`.

[Índice de diagramas](README.md) · [Cobertura de historias](COBERTURA.md) · [Anterior](09-secuencia-sesion-del-personal-y-bff.md) · [Siguiente](11-secuencia-pedido-entrega-cargo-y-push.md)
