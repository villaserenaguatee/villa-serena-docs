# OBJ-4B — API: factura (PDF, correlativo y correo)

| Dato | Valor |
|---|---|
| Objetivo | 4 — Check-out (documento 13) |
| Repositorio | `villa-serena-api` |
| Responsable | Hugo |
| Horas estimadas | 2 h |
| Cubre | HU-REC-15 (lado API) y el PDF que imprime HU-REC-16 |
| Depende de | OBJ-0C (serie de la factura y datos fiscales en los datos iniciales), Outbox (OBJ-1C) y contrato parte 2. La llama el check-out de Pablo (OBJ-4A) |
| Calendario | Mié 7 (para que Pablo la tenga el jueves 8) |

> **Antes de empezar:** prepara tu computadora con la `16 - Guia de Arranque del Proyecto.md`. Para crear tu rama y subir tu trabajo con un pull request, sigue la sección 3 de `00 - Como usar los prompts.md`.

## Documentos que debes adjuntar a la IA

- `AGENTS.md`
- `openapi.yaml`
- `HU - Recepcionista.md` (HU-REC-15 y 16)
- `07 - Estados.md` (sección 5.4)
- `14 - Tecnologias y Arquitectura.md` (AD-14 y sección 4.1)

## Prompt

```text
Trabajas en el repositorio villa-serena-api del proyecto Villa Serena (lee AGENTS.md
y los documentos adjuntos). Responde en español. Paquete facturacion.

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
No crees migraciones: pídeselas a Josué.
Primero muéstrame el plan; después impleméntalo.
```

## Cómo saber que quedó terminado

1. Dos check-outs seguidos generan facturas con números consecutivos.
2. El PDF abre y muestra todo el contenido del criterio 4, sin los cargos anulados.
3. El correo con el PDF llega a Mailpit.

## Al terminar

Cuando todo lo de "Cómo saber que quedó terminado" funcione, pega esto a la IA:

```text
Terminamos esta tarea. Muéstrame git status y confirma que no se sube ningún .env
ni claves. Luego haz commit, push y abre el pull request a main con un título que
EMPIECE con "OBJ-4B:" (por ejemplo "OBJ-4B: <resumen corto>"). En la descripción
pon qué se hizo, cómo se probó y la lista de tareas de "17 - Avance del Proyecto.md"
con código OBJ-4B que quedan completas.
```

Pide a un compañero que revise el PR. No marques el archivo 17: Josué lo actualiza una vez al día.
