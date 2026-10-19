# OBJ-4B — API: factura (PDF, correlativo y correo)

| Dato | Valor |
|---|---|
| Objetivo | 4 — Check-out (documento 13) |
| Repositorio | `villa-serena-api` |
| Responsable inicial | Hugo |
| Horas estimadas | 2 h |
| Cubre | HU-REC-15 (lado API) y el PDF que imprime HU-REC-16 |
| Depende de | OBJ-0C (serie de la factura y datos fiscales en los datos iniciales), Outbox (OBJ-1C) y contrato parte 2. La llama el check-out de Pablo (OBJ-4A) |
| Calendario | Mié 7 (para que Pablo la tenga el jueves 8) |

> **Referencias de trabajo:** la guía 16 describe el entorno; la guía 00, sección 3, describe el flujo con issues, ramas y PR hacia `develop`.

## Referencias para la tarea

La lectura se limita a las secciones necesarias para la issue. AGENTS.md contiene los acuerdos de colaboración; estas referencias se amplían solo si hay una dependencia o discrepancia.

- `AGENTS.md`
- `openapi.yaml`
- `HU - Recepcionista.md` (HU-REC-15 y 16)
- `07 - Estados.md` (sección 5.4)
- `14 - Tecnologias y Arquitectura.md` (AD-14 y sección 4.1)

El agente presenta un plan breve y continúa con el trabajo autorizado. La implementación puede adaptarse a la estructura existente; el resultado cumple los criterios siguientes.

## Resultado esperado

```text
Contexto: repositorio villa-serena-api del proyecto Villa Serena (acuerdos en AGENTS.md
y referencias pertinentes de la tarea). Comunicación en español. Paquete facturacion.

1. FacturaService.emitir(cuenta, nit, nombreComprador): lo llama el check-out de
   Pablo DENTRO de su transacción. Si lanza un error, el check-out completo se
   deshace.
   - Una sola factura por cuenta (409 si ya existe).
   - Número: siguiente correlativo de la serie fija (datos iniciales), sin saltos:
     bloquea la fila de la serie (SELECT ... FOR UPDATE) al tomar el número.
   - Estado EMITIDA; no se modifica ni se anula.
2. Contenido (HU-REC-15, criterio 4): datos del hotel y fiscales, serie y número,
   fecha y hora (America/Guatemala), NIT o "CF" y nombre del comprador, código de
   reserva, cargos sin los anulados, total con la leyenda "IVA incluido" (sin
   desglose), pagos (método y monto) y la leyenda "Factura de demostración — no
   válida ante la SAT".
3. PDF con OpenPDF, guardado en el bucket privado de MinIO. Endpoint para
   descargarlo con URL firmada de corta duración (Recepción y el huésped dueño).
4. Endpoint del detalle de la factura en JSON (la web imprime desde HTML en 80 mm
   y carta; el PDF es para el correo y la app).
5. Correo "factura" con el PDF adjunto, encolado en el Outbox DESPUÉS de que el
   check-out se confirme (si el correo falla, el check-out sigue válido).
6. Pruebas: correlativo consecutivo con dos emisiones seguidas, segunda factura de
   la misma cuenta (409) y cargos anulados fuera del PDF.
Los cambios de esquema necesarios se coordinan mediante issues y PR, conservando las migraciones ya aplicadas.
```

## Cómo saber que quedó terminado

1. Dos check-outs seguidos generan facturas con números consecutivos.
2. El PDF abre y muestra todo el contenido del criterio 4, sin los cargos anulados.
3. El correo con el PDF llega a Mailpit.

## Al terminar

Después de integrar la PR en `develop` y verificar el resultado, la issue queda actualizada o cerrada y la casilla correspondiente de `17 - Avance del Proyecto.md` incluye el número de PR (guía 00, sección 3).
