# Inventario: contrato reconciliado con API y web

La [issue docs #21](https://github.com/villaserenaguatee/villa-serena-docs/issues/21) conserva el comportamiento actual de API y web y actualiza el acuerdo documental. **Inventario, compras y repuestos de mantenimiento comparten las mismas existencias de insumos.** La reconciliación no agrega funcionalidades ni modifica consumidores.

## Flujo y permisos

| Operación | Rol | Efecto |
|---|---|---|
| Crear insumo | ADMIN | Registra stock inicial no negativo, mínimo y costo unitario; no exige nombre único |
| Actualizar insumo | ADMIN | Exige versión actual y todos los datos requeridos; no permite cambiar directamente stock |
| Consultar insumos | ADMIN o MANTENIMIENTO_LIMPIEZA del área MANTENIMIENTO o AMBAS | Consulta existencias compartidas |
| Entrada manual | ADMIN | Suma cantidad positiva |
| Salida o merma manual | ADMIN | Resta cantidad positiva; rechaza existencias insuficientes |
| Registrar compra | ADMIN | Suma existencias tanto con estado `pagada` como `pendiente`; no actualiza el costo unitario del insumo |
| Cambiar repuestos de una orden | ADMIN o técnico a cargo, con área de mantenimiento | Con la orden previamente en `en-proceso`, aplica la diferencia entre consumo anterior y nuevo; rechaza existencias insuficientes |

Ejemplo: crear un insumo con 0 focos, comprar 10, usar 2 en una orden y registrar una merma de 1 deja 7 focos. La compra ya suma las existencias; registrar además una entrada manual sumaría de nuevo.

Los repuestos `manual-…` de las órdenes no corresponden al catálogo y no modifican existencias. Reducir el consumo de un repuesto del catálogo devuelve la diferencia. Room Service, limpieza y solicitudes de huéspedes no descuentan automáticamente. No existe desactivación de insumos.

## HTTP y compatibilidad

El único YAML canónico sigue siendo [openapi.yaml](../openapi.yaml). Sustituye las rutas propuestas `/api/v1/admin/inventario/productos…` por las operaciones usadas por los consumidores:

| Ruta | GET | POST |
|---|---|---|
| `/api/v1/gestion/insumos` | Lista completa; permite consulta a Mantenimiento | Crea o actualiza insumo; solo ADMIN |
| `/api/v1/gestion/movimientos` | Lista completa de movimientos manuales; solo ADMIN | Registra entrada, salida o merma; solo ADMIN |
| `/api/v1/gestion/compras` | Lista completa de compras; solo ADMIN | Registra compra; solo ADMIN |

Se autentican con JWT. La web pasa por el BFF y mantiene sus tokens en cookies httpOnly. Las listas se ordenan por creación e id; no hay filtros de servidor ni paginación. La web relaciona movimientos por `insumoId`, ordena por `fecha`, calcula `stock <= stockMinimo` y aplica filtros en memoria.

POST recibe `{id, version, datos}`. `id` es UUID generado por el cliente; `version` vale 0 al crear (también es su valor si se omite). Para actualizar un insumo se usa su versión actual. La respuesta es plana, con los datos más `id` y `version`; responde **200**, incluso al crear. El registro nuevo tiene versión 1.

```json
{
  "id": "d10b41f7-370a-4c02-a254-f653b39c069f",
  "version": 0,
  "datos": {
    "insumoId": "7f81edc9-cdbc-48f2-8c6a-52b9301117ac",
    "tipo": "salida",
    "cantidad": 2,
    "motivo": "Entrega a un área"
  }
}
```

La respuesta conserva esos campos de `datos` y añade `id`, `version: 1` y `fecha` UTC generada por el servidor. Los tipos son exactamente `entrada`, `salida` y `merma`. Cantidad debe ser positiva y no superar 99999999; motivo no puede estar vacío ni superar 500 caracteres. Los campos numéricos admiten números o representaciones decimales en texto por compatibilidad; se conservan en su forma original. `datos` serializado admite hasta 64000 caracteres. Los campos adicionales se conservan; `id` y `version` internos se ignoran y `fecha` del movimiento se sobrescribe.

Las compras calculan subtotal, impuesto del 12 % y total. Con `ivaIncluido: true` extraen el impuesto del importe; en otro caso lo agregan. La fecha de compra es una fecha sin hora.

### Reenvíos, errores y transacciones

- Reenviar el mismo UUID, `version: 0` y los mismos datos originales devuelve el registro existente sin repetir sus efectos. La web conserva el UUID del intento fallido para permitir ese reenvío.
- UUID existente con otros datos y versión 0, o una versión distinta de la actual: **409 `VERSION_CAMBIADA`**.
- Intentar modificar un movimiento o una compra con la versión actual: **400 `DATOS_INVALIDOS`**. Ambos son inmutables.
- Salida, merma o consumo de repuestos sin stock suficiente: **409 `STOCK_INSUFICIENTE`**.
- Datos inválidos o insumo inexistente en el movimiento/compra: **400 `DATOS_INVALIDOS`**; no se promete 404 para esa referencia.
- Sin autenticación: **401**; sin permiso: **403**.

Movimiento, cambio de stock y auditoría se confirman en una transacción. Los bloqueos sobre insumos se comparten con compras y repuestos; cada cambio de existencias incrementa también la versión del insumo.

### Historial y límites actuales

GET movimientos contiene **solo movimientos manuales**. Compras y repuestos cambian existencias y dejan auditoría, pero no crean registros en esa lista. El responsable se obtiene del usuario autenticado y queda en auditoría; la respuesta no genera `responsable` ni `stockResultante`. Los campos adicionales enviados por un cliente no sustituyen esa auditoría.

Por tanto, esta reconciliación no promete un historial único de todas las variaciones ni mostrar el responsable en la web. Tampoco agrega unicidad de nombres, desactivación o un endpoint por producto. Esas capacidades requerirían cambios funcionales aparte.

## Evidencia y adopción

- API: [PR #65 integrada en dev](https://github.com/villaserenaguatee/villa-serena-api/pull/65), que conserva la interfaz y aporta pruebas de caracterización. Revisión contrastada: [`e29021596414d19c97739bc6a7adc93d56b47b74`](https://github.com/villaserenaguatee/villa-serena-api/tree/e29021596414d19c97739bc6a7adc93d56b47b74/src/main/java/com/villaserena/api). Fuentes: `inventario` y `piso/GestionOperativaController.java` para compras, insumos y repuestos.
- Web: [`f8edf6eda266a48fdba22042e53124f62918134e`](https://github.com/villaserenaguatee/villa-serena-web/tree/f8edf6eda266a48fdba22042e53124f62918134e/src). Fuentes: `features/admin/pages/GestionAdmin.tsx`, `Inventario.tsx`, `ComprasInventario.tsx`, `lib/pms/types.ts` y el BFF `app/api/[...ruta]/route.ts`.
- API debe adoptar la revisión completa de docs que quede integrada y contrastar rutas, DTO, validación y autorización en [API #58](https://github.com/villaserenaguatee/villa-serena-api/issues/58). Actualizar este documento no cierra esa tarea ni acredita conformidad integral.
- Web debe actualizar su revisión fija de docs y regenerar `schema.d.ts` mediante la [guía de adopción](contrato-api.md). No se cambian sus llamadas ni se copian YAML. Los tipos generados anteriores con rutas por producto quedan obsoletos tras adoptar esta revisión.
- El detalle HTTP completo de las órdenes operativas sigue fuera de esta reconciliación de inventario; aquí queda documentado su efecto existente sobre insumos. No se declara conformidad del módulo completo de mantenimiento.

Verificación de docs: `pnpm check` valida el contrato y la generación TypeScript, además de las pruebas de herramientas. Las comprobaciones de rutas no sustituyen las pruebas de DTO, permisos, concurrencia y persistencia de los consumidores.
