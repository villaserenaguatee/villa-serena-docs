# Contenido editorial del sitio

Docs #57 → API #114 → Web #100. Depende de inicialización #55/#112 y referencias HOTEL de #56/#113. Trabajo local, sin publicaciones ni datos de producción.

## Inventario y propiedad

`editorial-elementos.json` enumera los identificadores estables. Cada elemento corresponde a un texto, botón o imagen de PublicHome/PublicAbout; no es un bloque HTML ni el texto concatenado de una sección.

| Sección Web | Elementos editoriales | Fuente que se conserva fuera del documento |
| --- | --- | --- |
| Inicio | Título, descripción, texto/destino del botón | Nombre y carrusel: configuración/galería del hotel |
| Habitaciones | Subtítulo, título, botón del catálogo | Habitaciones, fotografías, capacidades y precios: catálogo comercial |
| Tipos de estancia | Introducción y descripción de las cinco preferencias | Identificadores de preferencias y selección/recomendaciones: lógica existente |
| Servicios | Encabezado | Servicios, horarios e imágenes operativas: amenidades/menú; conectar sus tarjetas sin crear otra copia editorial |
| Acerca de nosotros | Introducción y botón | Fotografía compartida: galería del hotel |
| Página Nosotros | Introducción, imagen, llamada final | Imagen: referencia HOTEL existente |
| Historia | Subtítulo, título, descripción, imagen | Imagen: referencia HOTEL existente |
| Misión y visión | Subtítulo, título y descripción de cada una | No contienen reglas de reservas |
| Valores | Encabezado y cinco pares título/descripción | Orden estable de los elementos existentes |
| ¿Por qué elegirnos? | Encabezado y cuatro pares título/descripción | No convierte afirmaciones comerciales en reglas operativas |
| Galería | Título | Fotografías y orden: hotel, sin duplicar el carrusel |
| Contacto y ayuda | Encabezados | Dirección/teléfono/correo: hotel; condiciones, políticas y enlaces legales: sus fuentes vigentes |
| Pie | Descripción | Identidad, contacto y enlaces legales compartidos, sin duplicarlos |

La navegación pública, el buscador de disponibilidad y el bloque «Tu estancia, también digital» mantienen sus rutas y comportamiento existentes. No se convierten acciones de reserva, filtros o accesos autenticados en contenido libre. Las preguntas de ayuda que explican cancelación, pagos o estancia siguen vinculadas a sus reglas vigentes; este documento no permite reescribirlas como política legal.

## Guardar y publicar

GET/PUT `/api/v1/admin/hotel/editorial/{idioma}` consultan/guardan el borrador ADMIN. GET sin borrador devuelve revisión 0 y elementos vacíos, sin insertar textos. PUT envía el documento completo y su revisión consultada; incrementa la revisión dentro de una transacción. No modifica la versión pública. Identificadores omitidos usan el contenido fijo anterior cuando Web #100 adopte la respuesta.

POST `/api/v1/admin/hotel/editorial/{idioma}/publicacion` exige la revisión vigente mayor que cero. La interfaz debe solicitar confirmación independiente de «Guardar borrador». Publicar copia el borrador a una versión inmutable con autor y fecha UTC; repetir la publicación de esa misma revisión no duplica versiones. Un error revierte toda la operación y conserva lo publicado anteriormente.

GET `/api/v1/publico/hotel/editorial/{idioma}` devuelve exclusivamente la última versión publicada. Si no existe, 404 `CONTENIDO_NO_PUBLICADO`; Web conserva su contenido existente del idioma, sin presentar un borrador como público. ES/EN son independientes, sin traducción automática ni sustitución por el otro idioma. La fachada Web actual necesita adaptación antes de afirmar soporte bilingüe conectado.

La revisión es por idioma. Dos administradores que guardan una misma revisión no se sobrescriben: uno guarda y el otro recibe 409 `CONTENIDO_CAMBIADO`. Debe volver a consultar y revisar sus cambios. Guardar no reintenta silenciosamente ni combina documentos. Publicar una revisión antigua también se rechaza.

## Validaciones y compatibilidad

- Solo `es` y `en`, identificadores enumerados y únicos; documento no vacío, limitado al catálogo de elementos.
- Texto plano no vacío de hasta 4000 caracteres; título, subtítulo y texto de botón hasta 200. Sin etiquetas HTML, caracteres de control ni scripts ejecutables.
- Imágenes: únicamente referencias HOTEL UUID ya asociadas a la galería y existentes en almacenamiento. Nunca URL externa, ruta privada ni copia de fotografías de habitaciones/servicios. Consultar devuelve además `fotografias`, un mapa clave → URL pública calculada por el servidor; no se persiste otra copia del archivo.
- Botones: texto y destino de la lista cerrada de rutas existentes. No acepta `javascript:`, URL externa, redirección ni rutas administrativas.
- Cada tipo admite únicamente sus campos: texto, imagen o botón. No acepta campos desconocidos.
- No edita horarios fijos, cancelaciones, privacidad o términos definitivos. Sus cambios requieren acuerdos y funcionalidades independientes.
- Guardados/publicaciones requieren hotel configurado; no inicializan ni inventan sus datos. Un fallo al comprobar almacenamiento no modifica el documento.

La migración crea solamente tablas editoriales de borrador y versiones publicadas, sin semillas. No actualiza reservas, pagos, facturas, series, correos, cuentas ni fotografías. La versión Flyway debe coordinarse con la migración local de correo personal V33 antes de integrar/desplegar; no modificar migraciones ya aplicadas.

## Verificación y adopción

Pruebas con PostgreSQL temporal: persistencia tras nueva consulta, ES/EN aislados, borrador privado, publicación explícita, historial inmutable, conflictos entre guardados/publicaciones, repetición de publicación, validaciones, ADMIN/401/403 y fallo de almacenamiento sin perder versión pública. Las lecturas existentes de hotel/catálogo permanecen intactas.

Web #100 debe fijar este contrato, generar tipos, consumir los nuevos endpoints mediante BFF, mantener cambios sin guardar, previsualizar el borrador y solicitar confirmación antes de publicar. El backend por sí solo no conecta los textos actuales ni acredita una publicación en Vercel.
