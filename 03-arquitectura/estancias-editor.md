# Cinco estancias editoriales

Se conservan los IDs estancias.romantica, estancias.descanso, estancias.familiar, estancias.negocios y estancias.bienestar. texto sigue siendo la descripción. nombre opcional (1–80 caracteres) renombra el botón; ofertaSlugs opcional contiene cero a tres ofertas públicas únicas y ordenadas. No son habitaciones físicas, no se crean categorías ni cupos y no se modifica disponibilidad/precio/reservas.

Las asociaciones se guardan en el JSON editorial existente, con su revisión y publicación explícita. El API valida que las ofertas existan, estén publicadas y pertenezcan a categoría activa al guardar y publicar. Solo ADMIN escribe; publicación obsoleta sigue devolviendo conflicto. Los campos nuevos se rechazan fuera de los cinco IDs. No hay nuevas tablas, migraciones ni endpoints.

Compatibilidad: documentos sin nombre/ofertaSlugs conservan nombres y recomendaciones por preferencias actuales. Los elementos fotográficos antiguos siguen admitidos y almacenados; no se borran archivos ni asociaciones anteriores. Sin configuración nueva se conserva su render previo. Una estancia configurada usa únicamente fotografías actuales del catálogo para cada oferta seleccionada; futuras actualizaciones se reflejan sin copiar archivos. Si una oferta deja de estar en el catálogo público se omite esa oferta sin sustituirla por otra. Web anterior ignora los campos nuevos y conserva su representación previa; publicar requiere desplegar primero el API actualizado, con autorización.

Depende de Docs #70; coordinar con #68 para conservar fotoUrl al combinar revisiones. Después del squash fijar SHA combinado y regenerar tipos de consumidores, sin copiar el YAML. Sin integración ni despliegue autorizados.
