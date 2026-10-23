# 24 — Secuencia: Administración y configuración

> Reconciliación 22/10/2026: [flujos y decisiones actuales](../../02-producto/reconciliacion-frontend-20261022.md). El nombre histórico del archivo se conserva. El portal web complementa Android; el retorno no confirma pagos y subir documentos no realiza check-in.

**Vista:** Secuencia · **Alcance del plan:** Operativa (`v0.2.0`) / Integral (`v0.3.0`) — implementación parcial y operaciones documentadas pendientes de API; no acredita integración real.

**Antecedente histórico:** el plan del hito pospuso el objetivo 5 y lo reemplazó por datos iniciales. **Estado actual:** cuentas oficiales de Personal y gestión básica de categorías (`room_types`) y habitaciones físicas (`rooms`) tienen integración existente; hotel, menú, temporadas, turnos e indicadores disponen de interfaces/consumidores preparados y dependen de las operaciones pendientes del API. Fotografías en S3/CloudFront y publicación integral de ofertas comerciales (`catalog_offers`) conservan las dependencias API #82/#83. Véase el [estado por módulo](../../02-producto/reconciliacion-frontend-20261022.md#estado-por-módulo).

```mermaid
sequenceDiagram
  actor A as ADMIN
  participant B as Panel / BFF
  participant S as API administración
  participant D as PostgreSQL
  participant F as S3 / CloudFront (archivos públicos)
  actor P as Empleado
  Note over A,D: Flujo funcional; Personal y catálogo básico (room_types/rooms) existentes, demás operaciones con dependencias
  Note over S,D: Hotel, menú, temporadas, turnos e indicadores: API pendiente, no guardados acreditados
  A->>B: Crear o editar personal, rol y área
  B->>S: Operación exclusiva ADMIN
  S->>D: Correo único, activo/inactivo, no auto-desactivación ni auto-cambio de rol
  S-->>A: Contraseña temporal visible una vez
  A->>P: Entregar contraseña personalmente, no por correo
  P->>S: Cambiar temporal antes de operar, vía BFF
  A->>B: Tipos (room_types), habitaciones físicas (rooms) y menú
  B->>S: Validar capacidad, precio base, número único y activación
  S->>D: Guardar en room_types / rooms / menu_items + administration_audit (no altera reservas ni ofertas catalog_offers)
  opt Fotos de tipos de habitación
    B->>S: POST /api/v1/archivos/imagenes (uso=TIPO_HABITACION)
    S->>F: Subir JPG/PNG hasta 5 MB en tipos/* y devolver URL de CloudFront
    B->>S: PUT /api/v1/admin/tipos-habitacion/{id}/fotos
    S->>D: Reemplazar room_type_photos (is_primary, sort_order)
  end
  A->>B: Temporadas y fin de semana
  B->>S: Ajustes mayores que menos 100 por ciento y sin traslapes
  S->>D: Guardar, afectan solo reservas nuevas cotizadas por tipo
  A->>B: Hotel y datos fiscales
  B->>S: Validar NIT y datos obligatorios
  S->>D: Guardar sin modificar facturas anteriores
  A->>B: Indicadores o consulta de incidencias
  B->>S: GET exclusivo ADMIN
  S-->>B: Ocupación de hoy, ingresos y canales por rango, incidencias solo lectura
```

## Reglas y límites

- `room_types` define la categoría y su `base_price` para cotizaciones por tipo; `rooms` registra las unidades físicas (de donde se deriva el conteo por tipo). Las ofertas comerciales (`catalog_offers`, `catalog_offer_rooms`) mantienen su propio `base_price` y lista de habitaciones elegibles hasta completar `API #83` y `web #69`.
- **Antecedente histórico, sustituido:** en el hito se propuso precargar personal, catálogos, temporadas, menú, hotel y serie con Flyway, con un primer ADMIN por entorno.
- **Procedimiento vigente:** Flyway administra las migraciones del esquema, no la carga automática de catálogos ni usuarios de demostración. Los fixtures se cargan explícitamente después del arranque, solo en una instancia local con tablas de negocio vacías. El primer ADMIN requiere habilitar el bootstrap; este no sustituye cuentas ni genera administradores adicionales. El bootstrap debe permanecer apagado al cargar fixtures sobre tablas vacías. Véanse [ADR-007](../adr/ADR-007-almacenamiento-r2-s3.md) y el [arranque documentado](../../04-guias-y-referencia/arranque-local.md). La documentación no acredita operaciones ejecutadas.
- La serie y el correlativo inicial no se editan; cambios del hotel no alteran facturas antiguas.
- Ingreso = pagos aprobados del rango; ocupación de hoy = ocupadas/activas; reservas por canal incluyen canceladas.

## Referencias

- [04 HU Administrador](../../02-producto/historias-de-usuario/HU%20-%20Administrador.md)
- [10 RN-PER,RN-TAR,RN-HAB,RN-IND,RN-FAC](../../02-producto/reglas-de-negocio.md#4-habitaciones--rn-hab)
- [Manual de habitaciones, ofertas y tipos](../../04-guias-y-referencia/admin-habitaciones-ofertas-tipos.md)
- [Roadmap por versiones](../../01-metodologia/roadmap-versiones.md#2-detalle-de-versiones) (vigente) y [13 §9.1 del plan original archivado](../../04-guias-y-referencia/historico/plan-de-trabajo-original.md#91-recortes-ya-aplicados-en-este-plan)

**Historias vinculadas:** `HU-ADM-01`, `HU-ADM-02`, `HU-ADM-03`, `HU-ADM-04`, `HU-ADM-05`, `HU-ADM-06`, `HU-ADM-07`, `HU-ADM-08`, `HU-ADM-09`, `HU-ADM-10`.

[Índice de diagramas](README.md) · [Cobertura de historias](COBERTURA.md) · [Anterior](23-estados-pedidos-solicitudes-e-incidencias.md) · [Siguiente](25-actividad-las-cinco-historias-opcionales.md)
