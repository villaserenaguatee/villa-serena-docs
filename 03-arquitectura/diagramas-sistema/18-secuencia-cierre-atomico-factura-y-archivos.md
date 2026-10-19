# 18 — Secuencia: cierre atómico, factura y archivos

**Vista:** Secuencia · **Alcance del plan:** Hito.

Distingue el pago Stripe previo del cierre transaccional y del envío posterior de correo.

```mermaid
sequenceDiagram
  participant U as App o panel + BFF
  participant S as API check-out
  participant D as PostgreSQL
  participant F as Facturación / PDF
  participant M as MinIO privado
  participant O as Outbox / correo
  U->>S: Confirmar salida, NIT/CF y nombre
  S->>D: Revalidar dueño/rol, estadía, pedidos y saldo
  Note over U,D: App: Stripe ya confirmó el saldo por webhook, no volver a cobrar
  rect rgb(234, 245, 239)
    Note over S,D: Unidad transaccional del cierre de negocio
    opt Recepción con saldo positivo
      S->>D: Registrar pago completo con método y referencia
    end
    S->>F: Emitir única factura de la cuenta con saldo cero
    F->>D: Bloquear serie y reservar siguiente correlativo sin saltos
    F->>F: Datos fiscales y cargos/pagos congelados, generar PDF
    F->>M: Guardar archivo privado y referencia
    S->>D: Factura EMITIDA + FINALIZADA + CERRADA
    S->>D: LIBRE + SUCIA o FUERA_DE_SERVICIO
    S->>D: Cancelar pedidos/solicitudes pendientes, eliminar tokens push
    S->>O: Registrar correo pendiente e historial
    alt Falla una parte del cierre
      S->>D: Rollback, no cerrar ni registrar pago de Recepción
      S-->>U: Motivo, puede reintentar
    else Todo correcto
      S->>D: Commit
      S-->>U: Factura y resultado final
    end
  end
  opt Cierre confirmado
    O-->>U: Correo al huésped, si falla se reintenta sin deshacer cierre
    U->>S: Consultar PDF autorizado
    S->>S: Verificar Recepción o huésped dueño
    S-->>U: URL firmada de corta duración
    U->>M: Abrir PDF privado
    opt Recepción imprime
      U->>U: Vista de navegador 80 mm o carta, imprimir o reimprimir
    end
  end
  Note over U,F: Imprimir no cambia estados ni crea otra factura ni marca COPIA
```

## Reglas y límites

- Una factura por cuenta, correlativo consecutivo de serie fija, NIT con verificador o CF.
- Factura de demostración, IVA incluido sin desglose, inmutable y sin anulación.
- La transacción descrita garantiza los cambios de negocio en BD; correo es posterior y los archivos requieren coordinación, no una transacción distribuida implícita.

## Referencias

- [07 R8,F1,K2,C1,C7,Q5,S6](../07%20-%20Estados.md)
- [10 RN-FAC](../10%20-%20Reglas%20de%20Negocio.md)
- [09 §7.5](../09%20-%20Matriz%20de%20Permisos.md)
- [12 UC-04,20](../12%20-%20Casos%20de%20Uso.md)

**Historias vinculadas:** `HU-REC-15`, `HU-REC-16`.

[Índice de diagramas](README.md) · [Cobertura de historias](COBERTURA.md) · [Anterior](17-actividad-decisiones-del-check-out.md) · [Siguiente](19-secuencia-conexiones-y-cuatro-eventos-en-vivo.md)
