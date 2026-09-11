# Reglas del proyecto LectoriaWeb

## Producto

- La web pública presenta Lectoria; el lector vive en las apps móviles.
- `/admin` es exclusivamente para administradores y muestra métricas agregadas de uso de iOS y Android.
- Los planes canónicos son `free` (USD 0), `annual` (USD 5/año) y `lifetime` (USD 20, pago único). No crear planes “Estudiante”, “Premium” o “Pro”.

## Autenticación y autorización

- El panel usa Supabase Auth con código OTP numérico enviado por correo.
- No reintroducir contraseña simulada, Magic Link ni sesiones en `localStorage`.
- `shouldCreateUser` permanece en `false` para el login administrativo.
- Una sesión autenticada no basta: `/admin` exige `app_metadata.role === "admin"`.
- La autorización definitiva también debe aplicarse en RLS/RPC; nunca confiar solo en React.
- No colocar secret keys ni `service_role` en Vite, el navegador o archivos versionados.

## Analítica y privacidad

- El dashboard consume `admin_dashboard_summary(range_days)`; no debe usar cifras simuladas como reemplazo silencioso.
- Las apps móviles registran telemetría mediante `ingest_analytics_event`.
- Nunca registrar contenido o nombre de documentos, texto seleccionado, notas, resaltados, búsquedas, prompts/respuestas de IA, correos, tokens o códigos OTP.
- Compras y cancelaciones se escriben desde validación de servidor/App Store/Play Store, no desde el cliente móvil.

## Flujo de trabajo

- No versionar `.env`, secretos, `node_modules`, reportes de Playwright ni bundles generados.
- `dist` es generado por Vite y debe retirarse del índice en un cambio de infraestructura separado mientras siga heredado del historial.
- Antes de entregar cambios ejecutar: `npm ci`, `npm run lint`, `npm test`, `npm run build` y `npm run test:e2e` cuando Chromium esté instalado.
- No ejecutar `npm audit fix --force` ni aplicar migraciones remotas sin aprobación explícita.
