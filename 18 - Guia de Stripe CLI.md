# 18 — Guía de Stripe CLI (pagos de prueba en local)

> **Para qué sirve:** probar los pagos con Stripe en tu computadora, en **modo prueba** (sin dinero real).
> **Para quién:** quien programe o pruebe pagos (Pablo, y en la integración, todos). No hace falta experiencia previa.
> **Relacionado:** prompt OBJ-1B (pagos), documento 14 (AD-17) y guía 16 (`.env`).

---

## 1. Cómo funciona (en palabras simples)

1. La web crea la reserva y el API pide a Stripe una **página de pago** (Stripe Checkout).
2. El cliente paga en esa página de Stripe. Nuestro sistema **nunca ve los datos de la tarjeta**.
3. Stripe avisa al API que el pago se hizo, con un mensaje llamado **webhook**. Solo con ese aviso la reserva pasa a `CONFIRMADA`.

**El problema en local:** Stripe está en Internet y no puede llegar a `localhost` de tu computadora. **Stripe CLI** resuelve esto: es un programa que recibe los avisos de Stripe y los **reenvía** a tu API local.

---

## 2. Crear tu cuenta de Stripe (una sola vez)

1. Crea una cuenta en https://dashboard.stripe.com/register con tu correo.
2. **No actives la cuenta** ni pongas datos bancarios: solo usaremos el **modo prueba** ("Test mode" o "Sandbox").
3. Cada integrante usa **su propia cuenta**. Así nadie comparte claves.

### Copiar la clave secreta de prueba

1. En el panel de Stripe, ve a **Developers → API keys** (asegúrate de estar en modo prueba).
2. Copia la **Secret key**. Empieza con `sk_test_`.
3. Pégala en el `.env` de `villa-serena-api`:
   ```env
   STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxx
   ```

> **Nunca subas esta clave a Git ni la pegues en un chat de IA.** Si la IA necesita saber cómo se llama la variable, muéstrale el `.env.example`.

---

## 3. Stripe CLI en Windows, macOS y Linux

La instalación se adapta al sistema, sin rutas locales prescritas. La [referencia oficial de Stripe CLI](https://github.com/stripe/stripe-cli#installation) ofrece gestores de paquetes y binarios para cada plataforma.

| Sistema | Integrantes | Instalación de referencia |
|---|---|---|
| Windows | Kimberly y Josué | `winget install Stripe.StripeCLI`, o la alternativa oficial apropiada al equipo. |
| macOS | Pablo, Carlos y Hugo | `brew install stripe` si se utiliza Homebrew. |
| Linux | Alex | Paquete oficial según la distribución; la referencia incluye apt y yum/dnf. |

Con Node.js 18 o superior, `npm install -g @stripe/cli` es otra opción oficial común a los tres sistemas. La terminal debe reconocer `stripe --version` antes de continuar.

### Iniciar sesión

```bat
stripe login
```

Se abre el navegador para autorizar el acceso a tu cuenta. Acepta y vuelve a la terminal.

---

## 4. Reenviar los avisos a tu API (cada vez que pruebes pagos)

Con el API encendido mediante el Maven Wrapper correspondiente a tu terminal (guía 16, sección 1.1), abre **otra terminal** y ejecuta:

```bat
stripe listen --forward-to localhost:8080/api/v1/pagos/stripe/webhook
```

La primera vez muestra algo así:

```text
Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxxxxxx
```

Copia ese valor al `.env` de `villa-serena-api` y **reinicia el API**:

```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxx
```

- Esa clave es **de tu computadora y tu cuenta**: cada integrante tiene la suya.
- **Deja esa terminal abierta** mientras pruebas. Si la cierras, los pagos se quedan en "pago en proceso".
- En esa terminal verás cada aviso que llega y la respuesta del API (por ejemplo `[200]`).

---

## 5. Hacer un pago de prueba

1. En la web (`http://localhost:3000`), haz una reserva y continúa al pago.
2. En la página de Stripe, usa una tarjeta de prueba:

| Tarjeta | Resultado |
|---|---|
| `4242 4242 4242 4242` | Pago aprobado |
| `4000 0000 0000 0002` | Pago rechazado |

   - **Fecha:** cualquier fecha futura (por ejemplo `12/30`).
   - **CVC:** cualquier número de 3 dígitos.
   - **Nombre y código postal:** cualquier valor.
3. Al pagar, en la terminal de Stripe CLI debe aparecer el aviso `checkout.session.completed` con `[200]`.
4. La página de resultado muestra "Confirmada" y el correo llega a Mailpit (http://localhost:8025).

### Probar el reembolso (cancelación)

Al cancelar desde Recepción una reserva pagada con 48 h o más de anticipación, el reembolso se ve en el panel de Stripe: **Payments** → el pago aparece como "Refunded".

---

## 6. Errores comunes

| Mensaje o situación | Qué significa | Qué hacer |
|---|---|---|
| En la terminal de Stripe CLI aparece `[400]` | La firma del aviso no coincide | Revisa que `STRIPE_WEBHOOK_SECRET` sea el `whsec_` que mostró **tu** `stripe listen`, y reinicia el API |
| En la terminal aparece `connect: connection refused` | El API está apagado o en otro puerto | Enciende el API y revisa que use el puerto 8080 |
| `[404]` | La ruta del webhook es otra | Usa la ruta exacta de `openapi.yaml`: `/api/v1/pagos/stripe/webhook` |
| La reserva se queda en "pago en proceso" | Stripe CLI está cerrado o no llega el aviso | Abre otra vez `stripe listen ...` y repite el pago |
| `Invalid API Key provided` | La clave `sk_test_` está mal o es de otra cuenta | Cópiala otra vez desde Developers → API keys, en modo prueba |
| `stripe` no se reconoce como comando | No está en el PATH | Repite el paso 4 de la sección 3 y abre una terminal nueva |
| `stripe login` pide iniciar sesión otra vez | La sesión del CLI venció | Vuelve a ejecutar `stripe login` |

---

## 7. Para la demostración

- En la computadora de la demostración deben estar encendidos: Docker, el API, la web, **y `stripe listen`**.
- Ten a mano la tarjeta `4242 4242 4242 4242`.
- Antes de empezar, haz un pago de prueba para confirmar que llegan los avisos.
