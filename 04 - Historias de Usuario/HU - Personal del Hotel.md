# HU — Personal del Hotel

> **Rol:** Todo el personal: Administrador (`ADMIN`), Recepcionista (`RECEPCION`), Room Service (`ROOM_SERVICE`) y Mantenimiento/Limpieza (`MANTENIMIENTO_LIMPIEZA`)
> **Plataforma:** Web privada
> **Prefijo:** `HU-EMP`
> **Total de historias:** 2 (Nivel 1: 2 · Nivel 2: 0)
> **Referencias:** 01 — Alcance (secciones 5.C y 5.H)

Estas historias son **comunes a todos los empleados** del hotel, sin importar su rol: todos entran a la web privada con correo y contraseña, y todos deben cambiar la contraseña temporal que les entrega el Administrador. Por eso se escriben una sola vez aquí y no se repiten en el archivo de cada rol.

El acceso del huésped (correo + código en la app) está en "HU - Cliente y Huesped". El primer Administrador se crea al arrancar el sistema con variables de entorno (tarea técnica, no historia).

---

## Épica 1: Acceso del personal

### HU-EMP-01 — Iniciar y cerrar sesión en la web privada

| Plataforma | Épica | Alcance | Nivel | Tamaño | Estado |
|---|---|---|---|---|---|
| Web privada | Acceso del personal | ALC-TRA-01 | 1 | M | Pendiente |

**Historia**
- **Como** empleado del hotel
- **Quiero** iniciar sesión con mi correo y contraseña, y cerrarla al terminar
- **Para** usar las funciones de mi rol de forma segura

**Criterios de aceptación**
1. El empleado ingresa correo y contraseña. Si son correctos, entra directamente a la sección de su rol (Administrador, Recepción, Room Service o Mantenimiento/Limpieza).
2. Si el correo o la contraseña son incorrectos, se muestra un mensaje genérico ("Correo o contraseña incorrectos") que no revela si el correo existe.
3. Tras **5 intentos fallidos** seguidos, la cuenta se bloquea **15 minutos**: durante ese tiempo no puede entrar aunque escriba la contraseña correcta. El contador se reinicia al entrar correctamente.
4. Un empleado `Inactivo` no puede entrar.
5. Si el empleado tiene una contraseña temporal, antes de usar el sistema debe cambiarla (HU-EMP-02).
6. Sin sesión, cualquier página privada lleva al inicio de sesión; con sesión, un empleado no puede entrar a secciones de otro rol (acceso denegado).
7. El empleado puede cerrar sesión desde cualquier pantalla; después, las páginas privadas vuelven a pedir inicio de sesión.

**Depende de:** Ninguna
**Reglas relacionadas:** RN-PER-011, RN-PER-013, RN-PER-014, RN-PER-015, RN-SEG-005 (documento 10)
**Notas técnicas:** Spring Security + JWT; los permisos por rol se validan en el backend, no solo en la interfaz.

---

### HU-EMP-02 — Cambiar mi contraseña temporal

| Plataforma | Épica | Alcance | Nivel | Tamaño | Estado |
|---|---|---|---|---|---|
| Web privada | Acceso del personal | ALC-TRA-01, ALC-ADM-01 | 1 | S | Pendiente |

**Historia**
- **Como** empleado del hotel
- **Quiero** cambiar la contraseña temporal que me dio el Administrador por una propia
- **Para** que solo yo conozca mi contraseña

**Criterios de aceptación**
1. En el primer acceso, o después de que el Administrador restablece la contraseña (HU-ADM-02), el sistema muestra obligatoriamente la pantalla de cambio; el empleado no puede usar ninguna otra sección hasta completarlo.
2. Se piden la contraseña actual, la nueva contraseña y su confirmación.
3. La nueva contraseña debe tener al menos 8 caracteres, con al menos una letra y un número, y ser distinta de la actual. Si no cumple, se muestra qué regla falta y no se guarda.
4. Si la contraseña actual es incorrecta o la confirmación no coincide, se muestra un error y no se guarda.
5. Al guardar, la contraseña anterior deja de funcionar y el empleado entra a la sección de su rol.
6. El empleado también puede cambiar su contraseña cuando quiera desde su cuenta, con las mismas reglas.

**Depende de:** HU-EMP-01, HU-ADM-01
**Reglas relacionadas:** RN-PER-011, RN-PER-012 (documento 10)
