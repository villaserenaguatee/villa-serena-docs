# Requisitos No Funcionales (RNF)

Este documento define los requisitos de calidad, seguridad, rendimiento y mantenibilidad para el ecosistema **Villa Serena**.

---

## 1. Seguridad (RNF-SEC)

| ID | Requisito | Descripción |
|---|---|---|
| **RNF-SEC-001** | Autenticación Centralizada | Spring Security es el único mecanismo de autenticación y autorización; emite y valida tokens JWT. |
| **RNF-SEC-002** | Expiración de Tokens | Tokens de acceso de corta duración (15 minutos) y tokens de renovación (*refresh tokens*) de 7 días, rotativos y revocables. |
| **RNF-SEC-003** | Control de Acceso Basado en Roles | La autorización valida la matriz de permisos en cada endpoint y comprueba la titularidad del recurso (*ownership*). |
| **RNF-SEC-004** | Aislamiento de Red | Servidores en la nube no exponen puertos de base de datos directamente a Internet. |
| **RNF-SEC-005** | Protección Perimetral | Aplicación de SSL/TLS, WAF y límites de tasa (*rate limiting*) en endpoints críticos (login, OTP, webhooks). |
| **RNF-SEC-006** | Sesión Segura en Navegador | En la web privada, los JWT solo residen en cookies seguras `httpOnly` gestionadas por el BFF (Next.js). |
| **RNF-SEC-007** | Política CORS Estricta | CORS restringido exclusivamente a los dominios y orígenes autorizados del ecosistema. |
| **RNF-SEC-008** | Cifrado de Credenciales | Contraseñas, códigos OTP y tokens de canales externos almacenados siempre con algoritmos de hashing seguros (BCrypt / SHA-256). |
| **RNF-SEC-009** | Cumplimiento PCI Básico | El sistema nunca recibe, procesa ni almacena datos de tarjetas de crédito; todo el flujo se delega a Stripe Checkout y los webhooks validan la firma criptográfica. |
| **RNF-SEC-010** | Acceso a Archivos Privados | Facturas en PDF y fotos de incidencias se sirven mediante URLs prefirmadas de corta duración. |
| **RNF-SEC-011** | Gestión de Secretos | Ningún secreto se versiona en Git; se inyectan mediante variables de entorno locales (`.env`) o GitHub Secrets en CI/CD. |

---

## 2. Gestión de Datos y Disponibilidad (RNF-DAT)

| ID | Requisito | Descripción |
|---|---|---|
| **RNF-DAT-001** | Versionamiento de Base de Datos | PostgreSQL 17 es la única base de datos relacional; toda modificación de esquema se versiona exclusivamente a través de migraciones Flyway. |
| **RNF-DAT-002** | Recuperación y Respaldos | Estrategia de respaldo periódico con capacidad de restauración probada (RPO $\le$ 24 h, RTO $\le$ 2 h). |
| **RNF-DAT-003** | Resiliencia de Contenedores | Los servicios en Docker cuentan con políticas de reinicio automático (`restart: unless-stopped`) y sondas de salud (*health checks*). |
| **RNF-DAT-004** | Estandarización Temporal | Todas las fechas y marcas de tiempo se almacenan en UTC en la base de datos, y se proyectan en la zona horaria `America/Guatemala` para cálculos del negocio y visualización. |

---

## 3. Rendimiento (RNF-REN)

| ID | Requisito | Descripción |
|---|---|---|
| **RNF-REN-001** | Escala del Sistema | Diseñado para operar de forma óptima en un hotel boutique pequeño (12 a 30 habitaciones) con concurrencia moderada. |
| **RNF-REN-002** | Latencia de Consulta de Cupo | Las búsquedas de disponibilidad y cálculo de tarifas responden en menos de 2 segundos bajo condiciones normales. |
| **RNF-REN-003** | Latencia en Tiempo Real | Las notificaciones de eventos vía WebSocket (pedidos, solicitudes, estados de habitación) se entregan en menos de 3 segundos a los clientes conectados. |

---

## 4. Observabilidad y Monitoreo (RNF-OBS)

| ID | Requisito | Descripción |
|---|---|---|
| **RNF-OBS-001** | Métricas del Sistema | Métricas de rendimiento, peticiones HTTP, tasa de errores, uso de CPU y memoria recolectadas por Prometheus y visualizadas en Grafana. |
| **RNF-OBS-002** | Registro de Auditoría | Trazabilidad de cambios de estado en reservas, pagos, habitaciones y emisión de facturas. |

---

## 5. Compatibilidad y Usabilidad (RNF-USA)

| ID | Requisito | Descripción |
|---|---|---|
| **RNF-USA-001** | Diseño Responsivo | La web pública y el panel de piso (Limpieza y Mantenimiento) se adaptan fluidamente a pantallas de escritorio y dispositivos móviles. |
| **RNF-USA-002** | Compatibilidad Móvil | La app de conserjería se ejecuta en dispositivos Android 7.0 o superior (compilada como APK independiente). |
| **RNF-USA-003** | Localización | Interfaz de usuario completamente en español y moneda fijada en Quetzales guatemaltecos (GTQ). |
| **RNF-USA-004** | Formato de Facturación | La factura de demostración se genera en PDF compatible con impresión en formato estándar carta y tiras de impresora térmica de 80 mm. |
