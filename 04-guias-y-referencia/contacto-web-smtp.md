# Contacto web y configuración SMTP — Docs #58 / API #115

Esta propuesta contractual contrasta `ContactoPublicoController`, su prueba de
correo y el BFF/formulario `ContactForm` de web. Declara las dos operaciones ya
existentes en el [OpenAPI canónico](../openapi.yaml) y el comportamiento seguro que
debe implementar API #115. No acredita un despliegue ni la entrega a buzones reales.

## Cuatro valores independientes

| Concepto | Fuente | Uso |
| --- | --- | --- |
| Correo público del hotel | `hotel_configuration.email`, leído por el DTO público | Identidad/contacto visible. Editarlo no cambia SMTP. |
| Destinatario operativo | `villa-serena.contacto.destinatario`, configurado con `CONTACTO_DESTINATARIO` | Único buzón que recibe los mensajes del formulario. No se devuelve al navegador. |
| Remitente | `villaserena.notificaciones.remitente`, configurado con `MAIL_FROM` | Encabezado From, independiente del visitante y del correo público. |
| Transporte y credenciales | `MAIL_HOST`, `MAIL_PORT`, `MAIL_AUTH`, `MAIL_STARTTLS`, `MAIL_USER`, `MAIL_PASSWORD` | Conexión/autenticación SMTP; solo en el servidor y su configuración externa. |

El visitante proporciona `nombre`, `correo` y `mensaje`; su correo validado se usa
como **Reply-To**, nunca como destinatario, remitente o credencial. No se envía
acuse automático al visitante ni se añade gestión SMTP al editor del hotel.

## Configuración segura por entorno

Se elimina el fallback fijo a un buzón real. Ningún entorno hereda el correo
público, el remitente ni el usuario SMTP como destinatario. Se conserva la
propiedad existente para configuraciones externas que ya la establezcan.

| Entorno | Configuración | Ausente o inválida |
| --- | --- | --- |
| `local` | SMTP de pruebas y destinatario explícito ficticio; Mailpit solo cuando se use correo | Arranque permitido; envío deshabilitado. |
| `dev` | Mailpit o transporte de prueba autorizado, con destinatario explícito | Mismo estado seguro. No asumir permisos para buzones reales. |
| `prod` | Destinatario y SMTP aprobados, inyectados externamente por el operador | Mismo estado seguro, sin fallback y sin convertir salud general del API en fallo SMTP. |

El destinatario admite una única dirección de buzón válida, sin nombre visible,
listas, grupos ni CR/LF; se eliminan espacios exteriores y el máximo es 254
caracteres. La validación sintáctica no consulta DNS ni acredita existencia,
propiedad o entrega. Un diagnóstico al arrancar indica la propiedad que falta o
debe revisarse, sin registrar su valor ni credenciales.

Si un POST necesita iniciar SMTP y no hay destinatario válido, devuelve **503
`CONTACTO_NO_DISPONIBLE`** con mensaje genérico. No confirma una fila nueva ni
incrementa los intentos de un FALLIDO; cualquier cambio SQL se revierte. GET de
estado y los reenvíos de resultados no reenviables siguen disponibles. Corregir
la configuración requiere reiniciar el proceso según el procedimiento del entorno.

## Idempotencia, resultado y privacidad

- POST `/api/v1/publico/contacto` usa `Idempotency-Key` UUID. Nombre/correo hasta
  150 caracteres, mensaje hasta 5000, ninguno blanco; nombre/correo sin CR/LF.
  No se interpreta HTML del visitante: Thymeleaf escapa sus valores.
- La huella compara los tres textos tras `trim`, sin normalizar mayúsculas.
  Misma clave con otros datos: 409 `CONTACTO_DATOS_DISTINTOS`, sin otro envío.
- ENVIANDO se persiste antes de SMTP. ENVIADO acredita aceptación SMTP, no entrega.
  FALLIDO permite reintento explícito con la misma clave/datos. INCIERTO no se
  reenvía: consultar el resultado. Una excepción genérica durante SMTP se conserva
  como incierta; conexión o autenticación fallida antes de aceptación es FALLIDO.
- Un ENVIANDO de más de dos minutos se convierte a INCIERTO al consultar. Esta
  transición no vuelve a enviar ni certifica que el proceso anterior terminó.
- El contacto envía de forma síncrona; no usa ni amplía los reintentos del Outbox.
  Ante una respuesta perdida, consultar antes de repetir. Nunca generar otra clave
  automáticamente para sortear un intento incierto.
- GET `/api/v1/publico/contacto/{id}` es público y solo devuelve `{id, estado}`.
  UUID desconocido: 404 `NO_ENCONTRADO`. No hay listado, búsqueda ni exposición de
  contenido/direcciones/huella/diagnóstico interno. La referencia no es identidad:
  conservarla en el cliente y no publicarla ni añadirla a analítica de terceros.
- Mantener `Cache-Control: no-store` para estas respuestas y el BFF. El límite
  existente de POST es 3 solicitudes por IP remota cada 900 s (429 con Retry-After);
  no se confía en cabeceras de IP aportadas por el visitante. El cuerpo conserva
  el límite global de 8 MiB (413); los límites por campo son mucho menores.

## Comprobación aislada

1. Ejecutar las pruebas con transporte mock o Mailpit aislado. No usar el SMTP
   productivo ni buzones reales, aunque las credenciales estén disponibles.
2. Con destinatario ausente/inválido, probar 503, ausencia de envío y rollback;
   consultar estados anteriores. Confirmar que el arranque local sigue permitido.
3. Configurar un destinatario como `operacion@example.test`, remitente ficticio y
   SMTP de Mailpit local. Enviar una petición con UUID nuevo; inspeccionar To,
   From y Reply-To, sin adjuntar secretos ni cuerpos privados a informes.
4. Repetir la misma petición: un solo mensaje aceptado. Cambiar texto con la misma
   clave: 409. Comprobar fallos de conexión/autenticación y el reintento explícito
   de FALLIDO sin filas duplicadas; simular un resultado ambiguo y verificar que
   INCIERTO no vuelve a enviar.
5. Cambiar el correo público en una base aislada y comprobar que To/From y la
   configuración SMTP siguen iguales. Probar entradas inválidas, CR/LF, límites,
   consulta desconocida y que el seguimiento exponga solo referencia/estado.
6. Ejecutar `pnpm check` en docs y pruebas de contrato/HTTP/persistencia en API.
   Después de revisar e integrar esta PR, los consumidores adoptan el SHA completo.
   No editar tipos generados ni afirmar que el BFF presenta ya mensajes nuevos:
   actualmente conserva HTTP 503, muestra error genérico y consulta el UUID.

No se contrata proveedor, crean credenciales, modifican secretos ni ejecutan
escrituras productivas como parte de esta comprobación.
