# OBJ-1D — Web: web pública, búsqueda y formulario de reserva

| Dato | Valor |
|---|---|
| Objetivo | 1 — Reservar (documento 13) |
| Repositorio | `villa-serena-web` |
| Responsable | Kim |
| Horas estimadas | 5,5 h (hotel y catálogo 1,5 h; búsqueda y precio 2 h; formulario y paso a Stripe 2 h) |
| Cubre | HU-HUE-01 a HU-HUE-05 y el envío a Stripe de HU-HUE-06 (lado web) |
| Depende de | OBJ-0E (proyecto, BFF y diseño base) y contrato parte 1 (OBJ-0G). Para conectar: API de Josué (OBJ-1A) y de Pablo (OBJ-1B) |
| Calendario | Lun 5: hotel, catálogo y búsqueda. Mar 6: terminar la reserva |

> **Antes de empezar:** prepara tu computadora con la `16 - Guia de Arranque del Proyecto.md`. Para crear tu rama y subir tu trabajo con un pull request, sigue la sección 3 de `00 - Como usar los prompts.md`.

## Documentos que debes adjuntar a la IA

- `AGENTS.md`
- `openapi.yaml` (contrato, parte 1)
- `HU - Cliente y Huesped.md` (HU-HUE-01 a HU-HUE-06)
- `14 - Tecnologias y Arquitectura.md` (secciones 4.2 y 6.1)

## Prompt

```text
Trabajas en el repositorio villa-serena-web del proyecto Villa Serena (lee AGENTS.md
y los documentos adjuntos). Responde en español. Copia openapi.yaml a la raíz y
regenera los tipos. Trabaja solo en app/(publico) y components/publico.

Objetivo: la web pública para que un cliente reserve. Todas las llamadas pasan por
el BFF (sin sesión). Mientras el API no esté listo, usa datos de prueba que sigan
exactamente los tipos de openapi.yaml, en lib/mocks/publico.ts.

1. Inicio (HU-HUE-01): nombre, descripción, fotos, ubicación, contacto, horas
   15:00 y 12:00, y acceso directo al buscador. Debe verse bien en teléfono.
2. Catálogo (HU-HUE-02): tipos activos con nombre, foto, descripción, capacidad y
   precio base por noche en quetzales (impuestos incluidos); detalle con todas las
   fotos y botón "Buscar disponibilidad de este tipo". Mensaje claro si no hay tipos.
3. Búsqueda (HU-HUE-03 y HU-HUE-04): calendario de rango (Calendar de shadcn/ui con
   react-day-picker) para entrada y salida, y número de huéspedes. Valida en
   pantalla 1 a 30 noches, sin fechas pasadas y entrada a no más de 365 días,
   mostrando el motivo. Resultados: tipos disponibles con el total y el desglose
   por noche (marca las noches con ajuste de temporada o fin de semana). El
   precio lo calcula el servidor; la web solo lo muestra. Mensaje claro si no
   hay disponibilidad.
4. Datos y resumen (HU-HUE-05): los 6 datos obligatorios (nombre completo, correo,
   teléfono, nacionalidad, tipo de documento DPI o pasaporte y número), con React
   Hook Form + Zod y el campo con error señalado. Resumen antes de pagar: tipo,
   fechas, noches, huéspedes y total. Aviso de que la reserva no se puede cambiar
   después.
5. Pagar (HU-HUE-06): al confirmar, crea la reserva e inicia el pago por el BFF y
   redirige a la URL de Stripe que devuelve el API. Si el API responde que ya no
   hay disponibilidad, muestra el mensaje y vuelve a la búsqueda.
   La página de regreso de Stripe la hace Alex (OBJ-1E).

No hagas: registro de usuarios, inicio de sesión del cliente, modificar reservas
ni cálculos de precio en el navegador.
Primero muéstrame el plan de archivos; después créalos por pasos.
```

## Cómo saber que quedó terminado

1. Con datos de prueba: se navega inicio → catálogo → búsqueda → datos → resumen, en computadora y en teléfono.
2. Las reglas de fechas muestran su motivo y no buscan.
3. Conectado al API: una reserva real llega a la página de Stripe; al pagar con la tarjeta de prueba, la página de Alex muestra "Confirmada".

## Al terminar

Cuando todo lo de "Cómo saber que quedó terminado" funcione, pega esto a la IA:

```text
Terminamos esta tarea. Muéstrame git status y confirma que no se sube ningún .env
ni claves. Luego haz commit, push y abre el pull request a main con un título que
EMPIECE con "OBJ-1D:" (por ejemplo "OBJ-1D: <resumen corto>"). En la descripción
pon qué se hizo, cómo se probó y la lista de tareas de "17 - Avance del Proyecto.md"
con código OBJ-1D que quedan completas.
```

Pide a un compañero que revise el PR. No marques el archivo 17: Josué lo actualiza una vez al día.
