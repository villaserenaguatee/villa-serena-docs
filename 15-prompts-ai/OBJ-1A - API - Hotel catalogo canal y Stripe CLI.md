# OBJ-1A — API: hotel, catálogo, diseño del canal y guía de Stripe CLI

| Dato | Valor |
|---|---|
| Objetivo | 1 — Reservar (documento 13) |
| Repositorios | `villa-serena-api` (API del hotel y catálogo) y `villa-serena-docs` (diseño del canal y guía de Stripe CLI) |
| Responsable inicial | Josué |
| Horas estimadas | 2,5 h (guía de Stripe CLI 0,5 h; API del hotel y catálogo 1 h; diseño del canal 1 h) |
| Cubre | HU-HUE-01 y HU-HUE-02 (lado API); tarea técnica ALC-CM-01 |
| Depende de | OBJ-0C (datos iniciales del hotel y de los tipos de habitación) y contrato parte 1 (OBJ-0G) |
| Calendario | Mar 6: **primero la guía de Stripe CLI** (Pablo la necesita ese día), luego el API del hotel y el catálogo. Jue 8: diseño del canal |

> **Referencias de trabajo:** la guía 16 describe el entorno; la guía 00, sección 3, describe el flujo con issues, ramas y PR hacia `develop`.

> **Avance (1 de octubre):** la guía de Stripe CLI (prompt 1) y el diseño del canal (prompt 3) ya están hechos: `18 - Guia de Stripe CLI.md` y `19 - Diseno de Integracion con Canales.md`. Solo falta el **prompt 2** (API del hotel y del catálogo).

## Referencias para la tarea

La lectura se limita a las secciones necesarias para la issue. AGENTS.md contiene los acuerdos de colaboración; estas referencias se amplían solo si hay una dependencia o discrepancia.

- `AGENTS.md`
- `openapi.yaml` (contrato, parte 1)
- `HU - Cliente y Huesped.md` (HU-HUE-01 y HU-HUE-02) y `HU - Channel Manager.md`
- `14 - Tecnologias y Arquitectura.md` (secciones 2, 4.4, 6 y 8)
- `01 - Alcance del Proyecto.md` (ALC-CM-01 a ALC-CM-04)

El agente presenta un plan breve y continúa con el trabajo autorizado. La implementación puede adaptarse a la estructura existente; el resultado cumple los criterios siguientes.

## Resultado esperado 1 — Guía de Stripe CLI (en `villa-serena-docs`)

```text
Contexto: repositorio villa-serena-docs del proyecto Villa Serena. Responde en
español.

Entregable: guía 18 de Stripe CLI, corta y para principiantes en Windows, macOS y Linux, de
cómo probar los pagos de Stripe en local (modo prueba):
1. Crear una cuenta de Stripe y quedarse en modo prueba (sin datos bancarios).
2. Dónde copiar la clave secreta de prueba (sk_test_...) y en qué variable del .env
   del API ponerla. Recordar: nunca subirla a Git ni pegarla en un chat de IA.
3. Stripe CLI disponible en Windows, macOS o Linux, con inicio de sesión (stripe login).
4. Reenviar los avisos al API local con stripe listen --forward-to
   localhost:8080/api/v1/pagos/stripe/webhook (usa la ruta de openapi.yaml) y
   copiar la clave de firma del webhook (whsec_...) al .env. Cada integrante tiene
   la suya.
5. Tarjetas de prueba: una aprobada y una rechazada.
6. Errores comunes (firma inválida, puerto equivocado, CLI cerrado).
```

## Resultado esperado 2 — API del hotel y del catálogo (en `villa-serena-api`)

```text
Contexto: repositorio villa-serena-api del proyecto Villa Serena (acuerdos en AGENTS.md
y referencias pertinentes de la tarea). Comunicación en español.

Objetivo: los endpoints públicos (sin sesión) de HU-HUE-01 y HU-HUE-02, tal como
están en openapi.yaml, en los paquetes catalogos y config.

1. Información del hotel: nombre, descripción, ubicación, fotos, contacto y horas
   fijas 15:00 y 12:00, leídos de configuracion_hotel (datos iniciales).
2. Catálogo: solo tipos de habitación ACTIVO, con nombre, descripción, capacidad,
   precio base por noche en quetzales y fotos. Detalle de un tipo con todas sus
   fotos. Un tipo INACTIVO responde 404.
3. Fotos: URL públicas del bucket público de MinIO (variables del .env). Si un tipo
   no tiene fotos, lista vacía (la web pone una imagen genérica).
4. DTO públicos: nunca devuelvas la entidad completa.
5. Pruebas: tipos inactivos no aparecen; el detalle de un tipo inactivo da 404.

Las pantallas de administración están fuera del hito; los catálogos vienen en Flyway.
```

## Resultado esperado 3 — Diseño breve de la integración con canales (en `villa-serena-docs`)

```text
Contexto: repositorio villa-serena-docs. Comunicación en español.

Entregable: guía 19 de integración con canales (ALC-CM-01), un documento de 2 a 3
páginas que explique, en lenguaje simple:
1. Qué hace hoy el sistema: canal simulado, API REST/JSON con clave por canal (hash),
   sin duplicados por identificador externo, misma disponibilidad que la web
   (documento 14, AD-13; HU-CM-01 a 03).
2. Qué faltaría para conectarse de verdad a Booking o Expedia: formatos OTA,
   firmas, cancelaciones y modificaciones, sincronización de disponibilidad y
   tarifas, y pruebas de certificación. Solo como diseño; nada de esto se programa.
3. Un diagrama sencillo en texto (o Mermaid) del flujo de una reserva de canal.
4. Limitaciones aceptadas (por ejemplo, las reservas de canal no se cancelan desde
   el sistema).
```

## Cómo saber que quedó terminado

1. Pablo pudo seguir la guía de Stripe CLI y recibir un webhook de prueba en su API.
2. `GET` del hotel y del catálogo responden según `openapi.yaml`; un tipo inactivo no aparece y su detalle da 404.
3. El documento de diseño del canal está en `villa-serena-docs`.

## Al terminar

Después de integrar la PR en `develop` y verificar el resultado, la issue queda actualizada o cerrada y la casilla correspondiente de `17 - Avance del Proyecto.md` incluye el número de PR (guía 00, sección 3).
