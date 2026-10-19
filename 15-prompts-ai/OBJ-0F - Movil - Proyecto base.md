# OBJ-0F — Móvil: proyecto base

| Dato | Valor |
|---|---|
| Objetivo | 0 — Base (documento 13); la parte 2 adelanta la tarea de push del objetivo 3A (T-03) |
| Repositorio | `villa-serena-movil` |
| Responsable inicial | Carlos |
| Horas estimadas | Parte 1: 1 h (objetivo 0). Parte 2: 1 h (objetivo 3A, HU-HUE-17) |
| Depende de | Nada para la parte 1. Para la parte 2: cuenta de Expo y proyecto de Firebase |
| Calendario | Parte 1: Jue 1 (opcional) o Vie 2. Parte 2: Vie 2 |

> **Referencias de trabajo:** la guía 16 describe el entorno; la guía 00, sección 3, describe el flujo con issues, ramas y PR hacia `develop`.

## Referencias para la tarea

La lectura se limita a las secciones necesarias para la issue. AGENTS.md contiene los acuerdos de colaboración; estas referencias se amplían solo si hay una dependencia o discrepancia.

- `AGENTS.md`
- `14 - Tecnologias y Arquitectura.md` (secciones 4.3, 6.1 punto 8 y 8)

El agente presenta un plan breve y continúa con el trabajo autorizado. La implementación puede adaptarse a la estructura existente; el resultado cumple los criterios siguientes.

## Resultado esperado — Parte 1: proyecto base

```text
Contexto: repositorio villa-serena-movil del proyecto Villa Serena (acuerdos en
AGENTS.md y secciones pertinentes del documento 14). Comunicación en español.

Objetivo: proyecto base de la app Android del huésped.

Entregables esperados:
1. Proyecto con Expo SDK 54, plantilla compatible y expo ~54 en package.json,
   Expo Router, TypeScript y pnpm como gestor acordado.
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

Fuera de alcance:
- El acceso con código, reservas y room service corresponden al objetivo 3A.
- Los tokens utilizan expo-secure-store, fuera de AsyncStorage.
- SDK 54 es la versión acordada; una actualización requiere su issue e impacto.
```

## Resultado esperado — Parte 2: configuración de push (viernes 2)

```text
Contexto: villa-serena-movil (Expo SDK 54). Comunicación en español.

Objetivo: dejar listo el development build para probar notificaciones push más
adelante (HU-HUE-17). Solo configuración; el registro del token con el API va en
el objetivo 3A.

La configuración permite:
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

La compilación de EAS puede tardar en la cola gratuita; otras tareas
independientes pueden avanzar mientras termina.
```

## Cómo saber que quedó terminado

1. **Parte 1:** `npx expo start` abre la app en Expo Go de SDK 54 en un teléfono Android de la misma red, con la pantalla inicial.
2. **Parte 1:** la app lee `EXPO_PUBLIC_API_URL` y una petición de prueba a `/actuator/health` del API responde (cuando el API esté corriendo).
3. **Parte 2:** el development build se instala en el teléfono y muestra el Expo push token.
4. **Parte 2:** una notificación de prueba enviada desde https://expo.dev/notifications con ese token llega al teléfono.
5. Ni la llave de FCM ni otros secretos están en el repositorio.

## Al terminar

Después de integrar la PR en `develop` y verificar el resultado, la issue queda actualizada o cerrada y la casilla correspondiente de `17 - Avance del Proyecto.md` incluye el número de PR (guía 00, sección 3). Si hay un bloqueo, Alex facilita su resolución; el avance puede actualizarlo quien completó la tarea.
