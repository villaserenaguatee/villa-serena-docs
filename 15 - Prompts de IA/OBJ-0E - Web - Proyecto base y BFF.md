# OBJ-0E — Web: proyecto base y BFF

| Dato | Valor |
|---|---|
| Objetivo | 0 — Base (documento 13) |
| Repositorio | `villa-serena-web` |
| Responsables | Alex (proyecto y BFF, 3,5 h) · Kim (diseño base de la web pública, 1 h) |
| Cubre | HU-EMP-01 y HU-EMP-02 (lado web); patrón BFF (documento 14, sección 6.1) |
| Depende de | Repositorio creado. Para probar el login de punta a punta: OBJ-0D (Pablo) |
| Calendario | Alex: Jue 1 (opcional, proyecto Next.js) y Vie 2 (BFF). Kim: Vie 2 |

> **Antes de empezar:** prepara tu computadora con la `16 - Guia de Arranque del Proyecto.md` (instalar, `.env` y encender Docker). Para crear tu rama y subir tu trabajo con un pull request, sigue la sección 3 de `00 - Como usar los prompts.md`.

## Documentos que debes adjuntar a la IA

- `AGENTS.md`
- `14 - Tecnologias y Arquitectura.md` (secciones 4.2, 6 y 6.1)
- `09 - Matriz de Permisos.md` (sección 3.8)
- `02 - Definicion de Roles.md` (sección 5, regla R-ROL-08: cada rol usa solo sus pantallas)
- `04 - Historias de Usuario/HU - Personal del Hotel.md`

## Prompt para Alex (proyecto base y BFF)

```text
Trabajas en el repositorio villa-serena-web del proyecto Villa Serena (lee AGENTS.md
y los documentos adjuntos). Responde en español.

Objetivo: proyecto Next.js y BFF para la sesión del personal (HU-EMP-01, HU-EMP-02).

PASO 1 — Proyecto
- Next.js 15 (App Router) con TypeScript, pnpm, Tailwind CSS 4, shadcn/ui,
  lucide-react y TanStack Query. ESLint + Prettier.
- Estructura: app/(publico)/ para la web pública (la llena Kim) y app/panel/ para
  el personal. Componentes en components/ui (shadcn), components/publico y
  components/panel.
- API_URL de Spring (http://localhost:8080) solo en variables del servidor
  (.env.local, sin el prefijo NEXT_PUBLIC_).
- Script "tipos": openapi-typescript desde ./openapi.yaml (copia del contrato que
  vive en villa-serena-api) hacia lib/api/schema.d.ts, y un cliente con
  openapi-fetch que solo se use en el servidor. Mientras no exista el contrato,
  deja el script listo y usa tipos mínimos escritos a mano para auth.

PASO 2 — BFF (Route Handlers en app/api/)
- POST /api/auth/login: llama a POST {API_URL}/api/v1/auth/login. Guarda el token
  de acceso y el refresh en cookies httpOnly, SameSite=Lax, path=/, Secure fuera
  de localhost. Nunca devuelve los tokens al navegador: solo nombre, rol, área y
  debeCambiarContrasena.
- POST /api/auth/logout: llama a /api/v1/auth/cerrar-sesion y borra las cookies.
- POST /api/auth/cambiar-contrasena y GET /api/auth/yo: reenvían a Spring y, al
  cambiar la contraseña, guardan los tokens nuevos.
- /api/[...ruta]: reenviador genérico a {API_URL}/api/v1/[...ruta] con el token de
  la cookie. Bloquea las rutas del webhook de Stripe y de la API del canal.
- Renovación: si Spring responde 401, intenta UNA vez con
  /api/v1/auth/renovar, guarda los tokens rotados y repite la petición; si falla,
  borra las cookies y responde 401.
- CSRF: rechaza POST, PUT, PATCH y DELETE si el encabezado Origin no es el propio.

PASO 3 — Protección y pantallas del panel
- middleware.ts: si no hay cookie de sesión en /panel/**, redirige a /panel/login.
- Layout de /panel (servidor): consulta /api/v1/auth/yo; si
  debeCambiarContrasena es verdadero, lleva a /panel/cambiar-contrasena.
- Pantallas: /panel/login (correo y contraseña, mensajes de error en español,
  incluido el bloqueo de 15 min), /panel/cambiar-contrasena (actual, nueva y
  confirmación; mínimo 8 caracteres, una letra y un número) y un menú lateral
  según el rol con páginas vacías ("En construcción"):
  ADMIN: Canal simulado. RECEPCION: Calendario, Reservas, Habitaciones.
  ROOM_SERVICE: Pedidos, Menú. MANTENIMIENTO_LIMPIEZA: Limpieza, Solicitudes,
  Incidencias. Botón "Cerrar sesión".
- Si un rol entra a una sección que no es suya: "Acceso denegado" (cada rol usa
  solo sus pantallas).

No hagas:
- No guardes tokens en localStorage ni los expongas al navegador.
- No crees pantallas de negocio (reservas, Gantt, pedidos...): son de otros
  objetivos.
- No agregues registro de usuarios ni "olvidé mi contraseña".

Primero muéstrame el plan de archivos; después créalos por pasos.
```

## Prompt para Kim (diseño base de la web pública)

```text
Trabajas en el repositorio villa-serena-web del proyecto Villa Serena (lee
AGENTS.md). Responde en español. Alex ya creó el proyecto Next.js 15 con
Tailwind 4 y shadcn/ui.

Objetivo: diseño base de la web pública del hotel boutique ficticio "Villa Serena",
solo dentro de app/(publico)/ y components/publico/.

Crea:
1. Layout público con encabezado (logo de texto "Villa Serena", enlaces: Inicio,
   Habitaciones, Reservar) y pie de página (dirección, teléfono y correo
   ficticios de Guatemala, año).
2. Paleta y tipografía en las variables de Tailwind/shadcn: estilo boutique,
   cálido y sobrio, legible en celular y escritorio.
3. Página de inicio con una sección principal (imagen de marcador y botón
   "Reservar") y espacios vacíos para las secciones del objetivo 1 (información
   del hotel y catálogo de habitaciones), sin datos reales todavía.

No hagas:
- No toques app/panel/, app/api/ ni la configuración del BFF (son de Alex).
- No crees la búsqueda, el formulario ni el pago (objetivo 1).
- No uses imágenes con derechos de autor: solo marcadores o imágenes libres.
```

## Cómo saber que quedó terminado

1. `pnpm dev` abre http://localhost:3000 con la página de inicio pública.
2. Con el API de Pablo corriendo, un usuario de prueba inicia sesión en `/panel/login` y ve solo el menú de su rol.
3. En las herramientas del navegador, las cookies son `HttpOnly` y ninguna respuesta del BFF trae los tokens.
4. Un usuario con contraseña temporal es llevado a cambiarla y no puede abrir otra sección hasta hacerlo.
5. "Cerrar sesión" borra las cookies y `/panel` vuelve a pedir inicio de sesión.
6. Un `POST` al BFF con un `Origin` distinto es rechazado.

## Al terminar

Cuando todo lo de "Cómo saber que quedó terminado" funcione, pega esto a la IA:

```text
Terminamos esta tarea. Muéstrame git status y confirma que no se sube ningún .env
ni claves. Luego haz commit, push y abre el pull request a main con un título que
EMPIECE con "OBJ-0E:" (por ejemplo "OBJ-0E: <resumen corto>"). En la descripción
pon qué se hizo, cómo se probó y la lista de tareas de "17 - Avance del Proyecto.md"
con código OBJ-0E que quedan completas.
```

Pide a un compañero que revise el PR. No marques el archivo 17: Josué lo actualiza una vez al día.
