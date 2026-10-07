# OBJ-0D — API: seguridad y JWT

| Dato | Valor |
|---|---|
| Objetivo | 0 — Base (documento 13) |
| Repositorio | `villa-serena-api` |
| Responsable | Pablo |
| Horas estimadas | 4 h |
| Cubre | HU-EMP-01, HU-EMP-02; tareas técnicas: permisos por rol (ALC-TRA-02) y primer Administrador por variables de entorno (ALC-TRA-01) |
| Depende de | OBJ-0B (proyecto base). Las tablas `empleados` y `refresh_tokens` las crea Josué (OBJ-0C) |
| Calendario | Vie 2 (2,5 h) y Lun 5 (1,5 h) |

> **Antes de empezar:** prepara tu computadora con la `16 - Guia de Arranque del Proyecto.md` (instalar, `.env` y encender Docker). Para crear tu rama y subir tu trabajo con un pull request, sigue la sección 3 de `00 - Como usar los prompts.md`.

## Documentos que debes adjuntar a la IA

- `AGENTS.md`
- `14 - Tecnologias y Arquitectura.md` (secciones 6 y 6.1)
- `09 - Matriz de Permisos.md` (secciones 3.8, 4 y 7)
- `08 - Inventario Turnos y Personal.md` (sección 3)
- `04 - Historias de Usuario/HU - Personal del Hotel.md`

## Prompt

```text
Trabajas en el repositorio villa-serena-api del proyecto Villa Serena (lee AGENTS.md
y los documentos adjuntos). Responde en español.

Objetivo: seguridad del personal con Spring Security + JWT (HU-EMP-01 y HU-EMP-02).
El acceso del huésped por código OTP NO va aquí (es del objetivo 3A, de Carlos),
pero deja el diseño listo para agregarlo sin rehacer nada.

Implementa en los paquetes config y auth:
1. JWT propio con OAuth2 Resource Server: firma con una clave del .env
   (JWT_SECRET o par de llaves; nunca en el código). Token de acceso de 15 min
   con: sub (id), tipo (EMPLEADO o HUESPED), rol, area (solo
   MANTENIMIENTO_LIMPIEZA) y debeCambiarContrasena. Sin datos personales.
2. Refresh token de 7 días, rotativo (cada uso emite otro e invalida el
   anterior), guardado solo como hash en la tabla refresh_tokens (la crea Josué).
3. Endpoints (rutas en español, bajo /api/v1/auth):
   - POST /login: correo y contraseña (BCrypt). 5 intentos fallidos seguidos
     bloquean 15 min. Empleado INACTIVO no entra. Responde los tokens y los datos
     básicos del empleado (nombre, rol, área, debeCambiarContrasena).
   - POST /renovar: rota el refresh. Revisa aquí que el empleado siga ACTIVO.
   - POST /cerrar-sesion: revoca el refresh.
   - POST /cambiar-contrasena: contraseña actual y nueva (mínimo 8 caracteres,
     al menos una letra y un número, distinta de la actual). Quita la marca de
     temporal y emite tokens nuevos.
   - GET /yo: datos del empleado autenticado.
4. Mientras debeCambiarContrasena sea verdadero, Spring rechaza cualquier
   petición excepto /cambiar-contrasena, /cerrar-sesion y /yo (documento 14,
   sección 6.1, punto 7).
5. Permisos por rol: @EnableMethodSecurity; roles ADMIN, RECEPCION, ROOM_SERVICE,
   MANTENIMIENTO_LIMPIEZA y HUESPED. Deja un ejemplo comentado de cómo aplicar
   cada símbolo de la matriz (documento 09, sección 7.2). Respuestas: 401 sin
   sesión, 403 sin permiso, con el formato de error del proyecto.
6. Rutas públicas según el documento 09 (sección 7.3): por ahora /api/v1/publico/**,
   el webhook de Stripe y la API del canal quedan permitidos (sus propias
   protecciones las agregan sus responsables), además de /actuator/health,
   /actuator/prometheus y Swagger. Quita la configuración temporal de Hugo.
7. Primer Administrador: al arrancar, si no existe un empleado con el correo
   ADMIN_EMAIL, se crea como ADMIN con ADMIN_EMAIL, ADMIN_NAME y ADMIN_PASSWORD
   del entorno, con contraseña temporal. Si las variables no están, no hace nada.
8. Pruebas con Spring Security Test: login correcto, contraseña incorrecta,
   bloqueo tras 5 intentos, renovación con rotación, cierre de sesión, bloqueo
   por contraseña temporal y un 403 por rol.

No hagas:
- No implementes el OTP del huésped, el ticket del WebSocket ni "olvidé mi
  contraseña" (no existe; el Administrador la restablece, fuera del hito).
- No crees migraciones (pídeselas a Josué si falta una columna).
- No guardes tokens ni contraseñas en texto plano ni en los logs.

Primero muéstrame el plan de clases y endpoints; después impleméntalo por pasos.
```

## Cómo saber que quedó terminado

1. `./mvnw test` pasa las pruebas de seguridad.
2. En Swagger o con `curl`: un usuario de prueba hace login, llama a `/yo` con el token y recibe sus datos; sin token recibe 401.
3. Con 5 contraseñas incorrectas seguidas, el sexto intento queda bloqueado.
4. `/renovar` entrega un refresh nuevo y el anterior ya no sirve.
5. Al arrancar, se crea el Administrador del `.env` si su correo no existía, y debe cambiar su contraseña en el primer acceso.
6. Ninguna clave aparece en el código ni en los logs.

## Al terminar

Cuando todo lo de "Cómo saber que quedó terminado" funcione, pega esto a la IA:

```text
Terminamos esta tarea. Muéstrame git status y confirma que no se sube ningún .env
ni claves. Luego haz commit, push y abre el pull request a main con un título que
EMPIECE con "OBJ-0D:" (por ejemplo "OBJ-0D: <resumen corto>"). En la descripción
pon qué se hizo, cómo se probó y la lista de tareas de "17 - Avance del Proyecto.md"
con código OBJ-0D que quedan completas.
```

Pide a un compañero que revise el PR. No marques el archivo 17: Josué lo actualiza una vez al día.
