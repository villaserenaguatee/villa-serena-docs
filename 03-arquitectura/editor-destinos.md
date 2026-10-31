# Destino de búsqueda del editor

Se añade /#buscar a los destinos permitidos de ElementoEditorial: apunta al formulario existente de disponibilidad de Inicio. Permite cambiar el texto de inicio.boton sin sustituir su navegación actual #buscar por otra ruta. No añade endpoints ni permite URLs arbitrarias. Texto e identificador/destino permanecen independientes. Se conservan revisiones, publicación explícita y permisos.

API y Web deben actualizar sus listas desde este contrato. Requiere coordinación con el cambio opcional fotoUrl de Docs #68: ambas PR son independientes; al integrarlas actualizar el SHA de cada consumidor y regenerar tipos desde el contrato combinado, sin perder campos. No integrar ni desplegar sin autorización.
