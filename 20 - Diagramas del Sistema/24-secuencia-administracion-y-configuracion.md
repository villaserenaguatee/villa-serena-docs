# 24 — Secuencia: Administración y configuración

**Vista:** Secuencia · **Alcance del plan:** Pospuesto.

El objetivo 5 está en la especificación, pero el plan lo reemplaza por datos iniciales para el hito.

```mermaid
sequenceDiagram
  actor A as ADMIN
  participant B as Panel / BFF
  participant S as API administración
  participant D as PostgreSQL
  participant F as Archivos públicos
  actor P as Empleado
  Note over A,D: Funcionalidad documentada, objetivo 5 pospuesto del hito
  A->>B: Crear o editar personal, rol y área
  B->>S: Operación exclusiva ADMIN
  S->>D: Correo único, activo/inactivo, no auto-desactivación ni auto-cambio de rol
  S-->>A: Contraseña temporal visible una vez
  A->>P: Entregar contraseña personalmente, no por correo
  P->>S: Cambiar temporal antes de operar, vía BFF
  A->>B: Tipos, habitaciones y menú
  B->>S: Validar capacidad, precio, referencias y activación
  S->>D: Guardar catálogo, no alterar reservas/pedidos ya creados
  opt Fotos
    S->>F: Guardar JPG/PNG hasta 5 MB en bucket público
  end
  A->>B: Temporadas y fin de semana
  B->>S: Ajustes mayores que menos 100 por ciento y sin traslapes
  S->>D: Guardar, afectan solo reservas nuevas
  A->>B: Hotel y datos fiscales
  B->>S: Validar NIT y datos obligatorios
  S->>D: Guardar sin modificar facturas anteriores
  A->>B: Indicadores o consulta de incidencias
  B->>S: GET exclusivo ADMIN
  S-->>B: Ocupación de hoy, ingresos y canales por rango, incidencias solo lectura
```

## Reglas y límites

- En el hito: personal, catálogos, temporadas, menú, hotel y serie se precargan con Flyway; primer ADMIN por entorno.
- La serie y el correlativo inicial no se editan; cambios del hotel no alteran facturas antiguas.
- Ingreso = pagos aprobados del rango; ocupación de hoy = ocupadas/activas; reservas por canal incluyen canceladas.

## Referencias

- [04 HU Administrador](../04%20-%20Historias%20de%20Usuario/HU%20-%20Administrador.md)
- [10 RN-PER,RN-TAR,RN-HAB,RN-IND,RN-FAC](../10%20-%20Reglas%20de%20Negocio.md)
- [13 §9.1](../13%20-%20Plan%20de%20Trabajo.md)

**Historias vinculadas:** `HU-ADM-01`, `HU-ADM-02`, `HU-ADM-03`, `HU-ADM-04`, `HU-ADM-05`, `HU-ADM-06`, `HU-ADM-07`, `HU-ADM-08`, `HU-ADM-09`, `HU-ADM-10`.

[Índice de diagramas](README.md) · [Cobertura de historias](COBERTURA.md) · [Anterior](23-estados-pedidos-solicitudes-e-incidencias.md) · [Siguiente](25-actividad-las-cinco-historias-opcionales.md)
