# 09 — Secuencia: sesión del personal y BFF

**Vista:** Secuencia · **Alcance del plan:** Hito.

La cookie vive en el navegador; los tokens del personal permanecen fuera de JavaScript del navegador.

```mermaid
sequenceDiagram
  actor P as Personal
  participant W as Navegador
  participant B as BFF Next.js
  participant S as Spring Security / auth
  participant D as PostgreSQL
  P->>W: Correo y contraseña
  W->>B: Login
  B->>S: Autenticar personal
  S->>D: Comprobar activo, hash, intentos y bloqueo
  alt Incorrecto, inactivo o bloqueado
    S-->>B: Rechazar con mensaje permitido
    B-->>W: Error de acceso
  else Correcto
    S->>D: Guardar hash del refresh y reiniciar intentos
    S-->>B: JWT, refresh y datos de sesión
    B-->>W: Cookies httpOnly, datos del empleado sin tokens en JSON
    opt Contraseña temporal
      W->>B: Actual, nueva y confirmación
      B->>S: Cambiar contraseña
      S->>D: Validar reglas, guardar hash nuevo y quitar marca temporal
      S-->>B: Tokens nuevos sin marca temporal
      B-->>W: Actualizar cookies y abrir sección del rol
    end
  end
  W->>B: Petición privada con cookies
  B->>S: HTTP con JWT, validar rol, área y recurso
  opt API responde 401
    B->>S: Renovar una sola vez usando refresh
    S->>D: Consumir anterior y guardar refresh nuevo
    S-->>B: Tokens rotados o sesión vencida
    B->>S: Repetir petición si renovó
  end
  P->>W: Cerrar sesión
  W->>B: Logout
  B->>S: Revocar refresh
  S->>D: Guardar revocación
  B-->>W: Borrar cookies y regresar al login
  Note over W,B: SameSite=Lax, Secure fuera de localhost, Origin propio para mutaciones
```

## Reglas y límites

- JWT: 15 minutos; refresh rotativo: 7 días. Cinco fallos bloquean quince minutos.
- Mientras la contraseña sea temporal, cambiarla es obligatorio antes de operar.
- Un empleado inactivo no inicia ni renueva; un acceso ya emitido puede durar hasta vencer.

## Referencias

- [14 §§6,6.1](../14%20-%20Tecnologias%20y%20Arquitectura.md)
- [10 RN-PER-011–015](../10%20-%20Reglas%20de%20Negocio.md)
- [09 §§3.8,7](../09%20-%20Matriz%20de%20Permisos.md)

**Historias vinculadas:** `HU-EMP-01`, `HU-EMP-02`.

[Índice de diagramas](README.md) · [Cobertura de historias](COBERTURA.md) · [Anterior](08-secuencia-recepcion-asignacion-y-check-in.md) · [Siguiente](10-secuencia-otp-mis-reservas-y-sesion-de-la-app.md)
