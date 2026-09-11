# Supabase de Lectoria

Esta carpeta contiene la base local propuesta para que las apps iOS/Android registren telemetría y el panel web administrativo lea agregados reales.

## Antes de aplicar la migración

1. Revisa los nombres de productos de App Store y Play Store y conserva los códigos internos `free`, `annual` y `lifetime`.
2. Configura la plantilla de correo de Supabase con `{{ .Token }}`. Si la plantilla utiliza `{{ .ConfirmationURL }}`, Supabase enviará Magic Link en lugar del código OTP de seis dígitos.
3. Asigna `app_metadata.role = "admin"` únicamente desde un proceso de servidor o desde el panel seguro de Supabase. `user_metadata` nunca debe autorizar el acceso administrativo.
4. Aplica la migración primero en un proyecto de desarrollo y prueba las políticas con un usuario normal y un administrador.
5. Registra compras, renovaciones, cancelaciones y reembolsos desde validación de servidor/App Store/Play Store; el cliente móvil no recibe permisos para escribir esas tablas.

## Contrato de la app móvil

La app autenticada invoca `ingest_analytics_event` con un `p_event_id` UUID estable. Reenviar el mismo evento es idempotente. Los parámetros del RPC usan el prefijo `p_` (`p_event_name`, `p_platform`, `p_app_version`, etc.) y los nombres permitidos están definidos por `analytics_event_name`.

Campos de privacidad prohibidos en `properties`:

- Contenido o nombre del documento.
- Texto seleccionado, notas, resaltados o búsquedas.
- Prompts y respuestas de inteligencia artificial.
- Correo, nombre, tokens, códigos OTP u otras credenciales.

El dashboard web invoca `admin_dashboard_summary` con `range_days` igual a `7`, `30` o `90`. La función y las políticas rechazan cualquier sesión que no tenga el rol `admin` en `app_metadata`.

La migración está versionada, pero no se aplica automáticamente ni modifica ningún proyecto Supabase remoto.
