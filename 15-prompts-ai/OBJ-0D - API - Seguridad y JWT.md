# OBJ-0D — API: seguridad y JWT

| Dato | Valor |
|---|---|
| Objetivo | 0 — Base (documento 13) |
| Repositorio | `villa-serena-api` |
| Responsable inicial | Pablo |
| Horas estimadas | 4 h |
| Cubre | HU-EMP-01, HU-EMP-02; tareas técnicas: permisos por rol (ALC-TRA-02) y primer Administrador por variables de entorno (ALC-TRA-01) |
| Depende de | OBJ-0B (proyecto base). Las tablas `empleados` y `refresh_tokens` corresponden a OBJ-0C |
| Calendario | Vie 2 (2,5 h) y Lun 5 (1,5 h) |

> **Referencias de trabajo:** la guía 16 describe el entorno; la guía 00, sección 3, describe el flujo con issues, ramas y PR hacia `develop`.

## Referencias para la tarea

La lectura se limita a las secciones necesarias para la issue. AGENTS.md contiene los acuerdos de colaboración; estas referencias se amplían solo si hay una dependencia o discrepancia.

- `AGENTS.md`
- `14 - Tecnologias y Arquitectura.md` (secciones 6 y 6.1)
- `09 - Matriz de Permisos.md` (secciones 3.8, 4 y 7)
- `08 - Inventario Turnos y Personal.md` (sección 3)
- `04 - Historias de Usuario/HU - Personal del Hotel.md`

El agente presenta un plan breve y continúa con el trabajo autorizado. La implementación puede adaptarse a la estructura existente; el resultado cumple los criterios siguientes.

## Resultado esperado

```text
Contexto: repositorio villa-serena-api del proyecto Villa Serena (acuerdos en AGENTS.md
y referencias pertinentes de la tarea). Comunicación en español.

Objetivo: seguridad del personal con Spring Security + JWT (HU-EMP-01 y HU-EMP-02).
El acceso del huésped por código OTP NO va aquí (es del objetivo 3A, de Carlos),
la base permite incorporarlo después sin rehacer la seguridad.

Seguridad implementada en los paquetes config y auth:
1. JWT propio con OAuth2 Resource Server: firma con una clave del .env
   (JWT_SECRET o par de llaves; nunca en el código). Token de acceso de 15 min
   con: sub (id), tipo (EMPLEADO o HUESPED), rol, area (solo
   MANTENIMIENTO_LIMPIEZA) y debeCambiarContrasena. Sin datos personales.
2. Refresh token de 7 días, rotativo (cada uso emite otro e invalida el
   anterior), guardado solo como hash en la tabla refresh_tokens (OBJ-0C).
3. Endpoints (rutas en español, bajo /api/v1/auth):
   - POST /login: correo y contraseña (BCrypt). 5 intentos fallidos seguidos
     bloquean 15 min. Empleado INACTIVO no entra. Responde los tokens y los datos
     básicos del empleado (nombre, rol, área, debeCambiarContrasena).
   - POST /renovar: rota el refresh. Revisa aquí que el empleado siga ACTIVO.
   - POST /cerrar-sesion: revoca el refresh.
   - POST /cambiar-contrasena: contraseña actual y nueva (mínimo 8 caracteres,
     al menos una letra y un número, distinta de la actual). El cambio quita la marca de
     temporal y emite tokens nuevos.
   - GET /yo: datos del empleado autenticado.
4. Mientras debeCambiarContrasena sea verdadero, Spring rechaza cualquier
   petición excepto /cambiar-contrasena, /cerrar-sesion y /yo (documento 14,
   sección 6.1, punto 7).
5. Permisos por rol: @EnableMethodSecurity; roles ADMIN, RECEPCION, ROOM_SERVICE,
   MANTENIMIENTO_LIMPIEZA y HUESPED. La referencia incluye un ejemplo comentado de cómo aplicar
   cada símbolo de la matriz (documento 09, sección 7.2). Respuestas: 401 sin
   sesión, 403 sin permiso, con el formato de error del proyecto.
6. Rutas públicas según el documento 09 (sección 7.3): por ahora /api/v1/publico/**,
   el webhook de Stripe y la API del canal quedan permitidos (sus propias
   protecciones las agregan sus responsables), además de /actuator/health,
   /actuator/prometheus y Swagger. La configuración final sustituye la temporal de OBJ-0B.
7. Primer Administrador: al arrancar, si no existe un empleado con el correo
   ADMIN_EMAIL, se crea como ADMIN con ADMIN_EMAIL, ADMIN_NAME y ADMIN_PASSWORD
   del entorno, con contraseña temporal. Si las variables no están, no hace nada.
8. Pruebas con Spring Security Test: login correcto, contraseña incorrecta,
   bloqueo tras 5 intentos, renovación con rotación, cierre de sesión, bloqueo
   por contraseña temporal y un 403 por rol.

Fuera de alcance:
- El OTP y el ticket WebSocket corresponden a otros objetivos. "Olvidé mi
  contraseña" queda fuera del hito; el restablecimiento corresponde al Administrador.
- Los cambios de esquema se coordinan mediante issues y PR, conservando las migraciones ya aplicadas.
- Los tokens y contraseñas no aparecen en texto plano en almacenamiento ni logs.
```

## Cómo saber que quedó terminado

1. `./mvnw test` pasa las pruebas de seguridad.
2. En Swagger o con `curl`: un usuario de prueba hace login, llama a `/yo` con el token y recibe sus datos; sin token recibe 401.
3. Con 5 contraseñas incorrectas seguidas, el sexto intento queda bloqueado.
4. `/renovar` entrega un refresh nuevo y el anterior ya no sirve.
5. Al arrancar, se crea el Administrador del `.env` si su correo no existía, y debe cambiar su contraseña en el primer acceso.
6. Ninguna clave aparece en el código ni en los logs.

## Al terminar

Después de integrar la PR en `develop` y verificar el resultado, la issue queda actualizada o cerrada y la casilla correspondiente de `17 - Avance del Proyecto.md` incluye el número de PR (guía 00, sección 3). Si hay un bloqueo, Alex facilita su resolución; el avance puede actualizarlo quien completó la tarea.
