# OBJ-0F — Móvil: proyecto base

| Dato | Valor |
|---|---|
| Objetivo | 0 — Base (documento 13); la parte 2 adelanta la tarea de push del objetivo 3A (T-03) |
| Repositorio | `villa-serena-movil` |
| Responsable | Carlos |
| Horas estimadas | Parte 1: 1 h (objetivo 0). Parte 2: 1 h (objetivo 3A, HU-HUE-17) |
| Depende de | Nada para la parte 1. Para la parte 2: cuenta de Expo y proyecto de Firebase |
| Calendario | Parte 1: Jue 1 (opcional) o Vie 2. Parte 2: Vie 2 |

> **Antes de empezar:** prepara tu computadora con la `16 - Guia de Arranque del Proyecto.md` (instalar, `.env` y encender Docker). Para crear tu rama y subir tu trabajo con un pull request, sigue la sección 3 de `00 - Como usar los prompts.md`.

## Documentos que debes adjuntar a la IA

- `AGENTS.md`
- `14 - Tecnologias y Arquitectura.md` (secciones 4.3, 6.1 punto 8 y 8)

## Prompt — Parte 1: proyecto base

```text
Trabajas en el repositorio villa-serena-movil del proyecto Villa Serena (lee
AGENTS.md y el documento 14 adjunto). Responde en español.

Objetivo: proyecto base de la app Android del huésped.

Crea:
1. Proyecto con Expo SDK 54 (no la última versión): usa la plantilla del SDK 54 y
   confirma en package.json que expo sea ~54. Expo Router, TypeScript y pnpm o
   npm (el que recomiende Expo para SDK 54).
2. Dependencias: expo-secure-store, @tanstack/react-query, NativeWind (estilos con
   clases de Tailwind), react-hook-form y zod.
3. app.json/app.config.ts: nombre "Villa Serena", esquema villaserena, paquete
   Android gt.villaserena.app.
4. Configuración: EXPO_PUBLIC_API_URL con la URL del API en la red local (por
   ejemplo http://192.168.x.x:8080). Es la única variable pública; nunca pongas
   claves en variables EXPO_PUBLIC_ (quedan dentro de la app).
5. lib/api: cliente HTTP con la URL base, que agrega el token de acceso y, ante un
   401, intenta UNA vez renovar con /api/v1/auth/renovar, guarda los tokens
   rotados y repite la petición; si falla, borra los tokens y vuelve al inicio.
6. lib/sesion: guardar, leer y borrar el token de acceso y el refresh en
   expo-secure-store.
7. Pantalla inicial: logo de texto "Villa Serena", bienvenida y botón "Entrar con
   mi correo" que lleva a una pantalla vacía ("En construcción"). El acceso con
   código es del objetivo 3A.
8. .env.example, .gitignore (con .env) y README.md con cómo probar en Expo Go de
   SDK 54 (descargado desde expo.dev/go) en la misma red Wi-Fi.

No hagas:
- No implementes el acceso con código, reservas ni room service (objetivo 3A).
- No uses AsyncStorage para los tokens.
- No actualices a otro SDK aunque la herramienta lo sugiera.

Primero muéstrame el plan de archivos; después créalos.
```

## Prompt — Parte 2: configuración de push (viernes 2)

```text
Seguimos en villa-serena-movil (Expo SDK 54). Responde en español.

Objetivo: dejar listo el development build para probar notificaciones push más
adelante (HU-HUE-17). Solo configuración; el registro del token con el API va en
el objetivo 3A.

Guíame paso a paso para:
1. Instalar expo-dev-client y expo-notifications compatibles con SDK 54.
2. Crear eas.json con un perfil "development" (developmentClient, distribución
   interna, APK para Android) y uno "preview" que genere APK.
3. Crear el proyecto en Firebase, agregar la app Android con el paquete
   gt.villaserena.app y colocar google-services.json según la documentación de
   Expo para SDK 54.
4. Subir la credencial de FCM (cuenta de servicio, API v1) a las credenciales de
   EAS con eas credentials. Esa llave es SECRETA: nunca se sube a Git ni se pega
   en un chat de IA.
5. Ejecutar eas build --profile development --platform android e instalar el APK.
6. Una pantalla de prueba que pida permiso de notificaciones y muestre el Expo
   push token en la consola, para comprobar que todo funciona.

Mientras EAS compila (puede tardar en la cola gratuita), no esperes: sigue con
otras tareas.
```

## Cómo saber que quedó terminado

1. **Parte 1:** `npx expo start` abre la app en Expo Go de SDK 54 en un teléfono Android de la misma red, con la pantalla inicial.
2. **Parte 1:** la app lee `EXPO_PUBLIC_API_URL` y una petición de prueba a `/actuator/health` del API responde (cuando el API esté corriendo).
3. **Parte 2:** el development build se instala en el teléfono y muestra el Expo push token.
4. **Parte 2:** una notificación de prueba enviada desde https://expo.dev/notifications con ese token llega al teléfono.
5. Ni la llave de FCM ni otros secretos están en el repositorio.

## Al terminar

Cuando todo lo de "Cómo saber que quedó terminado" funcione, pega esto a la IA:

```text
Terminamos esta tarea. Muéstrame git status y confirma que no se sube ningún .env
ni claves. Luego haz commit, push y abre el pull request a main con un título que
EMPIECE con "OBJ-0F:" (por ejemplo "OBJ-0F: <resumen corto>"). En la descripción
pon qué se hizo, cómo se probó y la lista de tareas de "17 - Avance del Proyecto.md"
con código OBJ-0F que quedan completas.
```

Pide a un compañero que revise el PR. No marques el archivo 17: Josué lo actualiza una vez al día.
