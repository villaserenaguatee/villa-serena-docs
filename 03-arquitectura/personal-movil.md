# Android para personal operativo — Docs #63

Ampliación solicitada por Alex el 27/10/2026: Room Service, Limpieza y
Mantenimiento usan también la app Expo SDK 54. La web privada se mantiene y ya
estaba diseñada para operar desde un teléfono. Esta ampliación agrega el cliente
nativo, no exige que el personal trabaje desde una computadora ni cambia sus
permisos. Los cambios se preparan y revisan por PR; este documento no acredita
publicación, uso en un dispositivo ni despliegue.

## Primera entrega y trazabilidad

| Bloque | Historias / operaciones existentes | Seguimiento |
| --- | --- | --- |
| Acceso del personal | HU-EMP-01/02: `/auth/login`, `/auth/yo`, `/auth/renovar`, `/auth/cambiar-contrasena`, `/auth/cerrar-sesion` | [Móvil #23](https://github.com/villaserenaguatee/villa-serena-movil/issues/23) |
| Room Service | HU-RS-01 a 06: cola/detalle, historial de cada pedido, avance con estado esperado, cancelación motivada, menú y agotado | [Móvil #24](https://github.com/villaserenaguatee/villa-serena-movil/issues/24) |
| Limpieza | HU-MYL-01 a 05: habitaciones priorizadas, iniciar/interrumpir/terminar; solicitudes, tomar/atender | [Móvil #25](https://github.com/villaserenaguatee/villa-serena-movil/issues/25) |
| Mantenimiento | HU-MYL-06 a 08: reportar, consultar, tomar y resolver incidencias; foto privada opcional JPG/PNG de hasta 5 MiB | [Móvil #26](https://github.com/villaserenaguatee/villa-serena-movil/issues/26) |

No incluye ADMIN/RECEPCION en Android, creación de reservas nativas, historial
general de pedidos fuera de la cola activa, objetos olvidados, inventario,
activos, repuestos, preventivos u órdenes ampliadas. Se prioriza el núcleo
operativo de los tres módulos; no se retiran esas funciones de la web.

## Identidad, sesión y autorización

- Huésped: OTP y funciones de su propia reserva; personal: correo laboral y
  contraseña. La portada ofrece accesos diferenciados. Una sesión no habilita los
  dos contextos a la vez; cambiar de contexto requiere cerrar sesión.
- ROOM_SERVICE solo ve su módulo. MYL con LIMPIEZA ve limpieza/solicitudes; con
  MANTENIMIENTO ve la cola de incidencias; AMBAS ve ambos. Cualquier área MYL
  puede reportar una incidencia; eso no autoriza a LIMPIEZA a consultar/tomar o
  resolver la cola de mantenimiento.
- Rol/área/identidad se confirman mediante `/auth/yo` al restaurar la sesión y
  antes de operar. SecureStore conserva tokens y el perfil mínimo; las pantallas
  usan guardas y Spring vuelve a exigir permisos, estado y responsable real.
  Nunca se confía en decodificar un JWT local como prueba de autorización.
- Con contraseña temporal solo se permite cambiarla, consultar identidad o cerrar
  sesión. Los enlaces profundos a módulos y a pantallas del huésped no evitan la
  guarda. ADMIN/RECEPCION no se habilitan en esta entrega y sus tokens de acceso
  rechazados no se conservan.
- HTTP nativo va directo al API, sin BFF. La renovación rotativa conserva el
  contexto del empleado, comparte una renovación concurrente y borra sesión al
  rechazarse. Logout revoca el refresh y limpia datos locales incluso sin red.
  Ni contraseñas, tokens ni datos de huéspedes se imprimen o guardan en un `.env`.
- WebSocket mantiene el contrato existente: `/auth/ws-ticket` por HTTP con JWT;
  CONNECT lleva solo el ticket de un uso, de 60 segundos. Se solicita otro al
  reconectar. No se amplía la admisión de JWT de personal en el backend.
  `/topic/pedidos` es ROOM_SERVICE; habitaciones/solicitudes son LIMPIEZA/AMBAS.
  Mantenimiento no inventa un destino STOMP: consulta al enfocar/actualizar.

## Operaciones y recuperación

Se reutilizan rutas y DTO de [OpenAPI](../openapi.yaml). Los cargos, transiciones,
asignaciones e inventario siguen calculándose en servidor. Room Service no
reactiva agotados, modifica precios ni crea pedidos telefónicos; solo ve nombre
del huésped, habitación y piso. MYL no recibe datos personales del huésped.

Las acciones se bloquean mientras están en curso. Un conflicto vuelve a consultar
estado, sin repetir la escritura; un fallo no vacía los textos del formulario.
No se ofrece resolver/terminar/atender a nombre de otro empleado. La entrega y
la cancelación de pedidos requieren confirmación explícita.

Para reportar una incidencia, Android guarda en SecureStore una referencia UUID
y el cuerpo antes del POST. Un resultado incierto conserva los mismos datos y
clave, asociados al empleado; reiniciar o cerrar sesión no genera automáticamente
otra referencia. La pantalla permite confirmar ese reporte antes de crear otro.
Un rechazo 400 permite corregir los datos. No se agregan escrituras offline ni
sincronización automática.

La foto es opcional y se selecciona/toma únicamente por acción del empleado, con
permiso del sistema cuando corresponda. La subida con `uso=INCIDENCIA` es privada;
el servidor valida contenido/tamaño/clave. Subir y asociar no es una transacción
S3/SQL: un fallo antes de crear el reporte puede dejar un objeto huérfano; no se
borra físicamente desde la app ni se inventa una ruta de eliminación. URLs
firmadas se renuevan consultando de nuevo el detalle.

## Reservas y evidencia revisada

En móvil `main` **8aef9ee**, `app/reservas.tsx` y `lib/api/huesped.ts` consultan
reservas existentes. No se encontró pantalla ni llamada de creación de reservas
en el código de la app de esa revisión. La existencia de tipos generados para
reservar y de una web pública funcional no demuestra reserva nativa. F2-06 se
mantiene separada hasta revisar e implementar un flujo móvil de creación, sin
declararlo resuelto por este cambio.

## Comprobación y adopción

1. Validar Docs/OpenAPI, enlaces y generación reproducible de tipos.
2. Probar login operativo/OTP, contraseñas temporales, restauración, renovación,
   área AMBAS y denegación de áreas/roles/enlaces cruzados con servidor simulado.
3. Probar cuerpos/transiciones, doble toque, conflictos sin reenvío, recuperación
   del reporte incierto y reconexión con ticket nuevo. Regresión de los flujos del
   huésped y del aislamiento de notificaciones Expo Go.
4. Compilar Android y probar en teléfono con personal y huéspedes ficticios en
   entorno de pruebas autorizado; no usar producción para crear pedidos, cargos,
   limpiezas o incidencias como prueba automática.
5. Revisar e integrar el contrato y adoptar su SHA completo en móvil, regenerando
   tipos desde Docs. No mantener otra copia de OpenAPI ni editar tipos generados.

La preparación de código y sus pruebas simuladas no sustituyen la comprobación
de permisos/HTTP/STOMP, cámara y SecureStore en dispositivo ni autorizan publicar
un APK, crear cuentas o modificar credenciales del entorno.
