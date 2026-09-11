# LectoriaWeb

Landing pública y panel administrativo de Lectoria, desarrollados con React 18, TypeScript y Vite.

## Requisitos

- Node.js 22.23.1 (`.nvmrc`)
- npm 10.x

## Desarrollo local

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Completa `.env.local` con el Project URL y la anon/publishable key de Supabase. Nunca utilices una secret key o `service_role` en variables `VITE_*`.

## Autenticación administrativa

El acceso usa un OTP numérico de seis dígitos por correo y no crea usuarios durante el login. En Supabase:

1. Configura la plantilla de correo para utilizar `{{ .Token }}`.
2. Crea o invita previamente a los administradores.
3. Asigna `app_metadata.role = "admin"` desde un entorno de servidor o desde la consola segura.

Una sesión de usuario sin ese rol no puede renderizar `/admin`. Las funciones y políticas de base de datos vuelven a comprobar el rol.

## Datos del dashboard

El frontend no contiene KPIs ficticios. Consulta el RPC `admin_dashboard_summary` con rangos de 7, 30 o 90 días. La migración local propuesta está en `supabase/migrations` y documentada en `supabase/README.md`; no se aplica automáticamente.

Las apps móviles deben enviar eventos operativos idempotentes a `ingest_analytics_event`. El contenido privado de lectura nunca forma parte de la telemetría.

Planes canónicos:

| Código | Nombre | Precio |
| --- | --- | --- |
| `free` | Free | USD 0 |
| `annual` | Anual | USD 5/año |
| `lifetime` | De por vida | USD 20, pago único |

## Verificación

```bash
npm run lint
npm test
npm run build
npm run test:e2e
```

`dist` es un artefacto generado. Aunque todavía existen archivos heredados en el historial, no deben incluirse cambios de `dist` en ramas de funcionalidad.
