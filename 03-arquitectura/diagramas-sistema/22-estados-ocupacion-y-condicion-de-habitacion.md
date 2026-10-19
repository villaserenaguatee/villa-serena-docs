# 22 — Estados: ocupación y condición de habitación

**Vista:** Estados · **Alcance del plan:** Hito.

LIBRE no significa LIMPIA; la habitación tiene ocupación, condición y activación de catálogo.

```mermaid
flowchart TB
  subgraph OC[Dimensión 1 · ocupación]
    LI[LIBRE] -->|Check-in| OO[OCUPADA]
    OO -->|Check-out| LI
  end
  subgraph CON[Dimensión 2 · condición]
    L[LIMPIA] -->|Recepción solo si LIBRE| S[SUCIA]
    S -->|Limpieza toma| EL[EN_LIMPIEZA]
    EL -->|Mismo empleado termina| L
    EL -->|Mismo empleado interrumpe| S
    L & S & EL -->|Incidencia impide uso y habitación LIBRE| FS[FUERA_DE_SERVICIO]
    FS -->|Resuelta última incidencia bloqueante| S
  end
  CO[Check-out sin daño bloqueante] --> S
  DA[Check-out con daño bloqueante] --> FS
  IN[Daño bloqueante durante ocupación] --> IND[Incidencia pendiente · sin cambiar habitación]
  subgraph CAT[Dimensión 3 · catálogo / Administración pospuesta]
    AC[ACTIVO] <-->|ADMIN; desactivar solo sin ocupación ni reservas activas asignadas| IA[INACTIVO]
  end
```

## Reglas y límites

- La nueva habitación nace LIBRE + LIMPIA y activa.
- Una incidencia bloqueante en OCUPADA muestra un indicador; cambia a FUERA_DE_SERVICIO al salir si sigue abierta.
- La solicitud del huésped no cambia la condición; el flujo de limpieza libre es independiente.

## Referencias

- [07 §4](../07%20-%20Estados.md)
- [10 RN-HAB](../10%20-%20Reglas%20de%20Negocio.md)
- [10 RN-LIM-001,002](../10%20-%20Reglas%20de%20Negocio.md)

[Índice de diagramas](README.md) · [Cobertura de historias](COBERTURA.md) · [Anterior](21-estados-reserva-cuenta-pago-cargo-y-factura.md) · [Siguiente](23-estados-pedidos-solicitudes-e-incidencias.md)
