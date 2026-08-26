# Despliegue de MAESTRO

MAESTRO usa recursos propios. No comparte base de datos, autenticación, variables ni proyecto de despliegue con NIDO.

```text
                 SUPABASE: MAESTRO-SEGUIMIENTOS
                       Base + Auth
                            │
                  ┌─────────┴─────────┐
                  │                   │
              WEB / PWA            MOBILE
               Next.js               Expo
                  │                   │
     Vercel: maestro-seguimientos   Expo EAS
                  │                   │
              navegador         Android / iOS
```

## Recursos creados

- Supabase: `MAESTRO-SEGUIMIENTOS`, referencia `cmhjtunltkitethifgyv`, región `us-east-1`.
- Vercel: `maestro-seguimientos`, enlazado al repositorio y con raíz `apps/web`.
- Expo: configuración EAS preparada en `apps/mobile/eas.json`; falta iniciar sesión con una cuenta Expo para crear el proyecto remoto.

## Variables

Web (`apps/web/.env.local`, además de Vercel):

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
NEXT_PUBLIC_SITE_URL
```

Mobile (`apps/mobile/.env.local` y secretos/variables EAS al crear el proyecto):

```text
EXPO_PUBLIC_SUPABASE_URL
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

Sólo se usan valores públicos en clientes. Nunca se debe añadir `service_role` ni una clave secreta de Supabase a Next.js cliente, Expo o Git.

## Orden seguro

1. Ejecutar `git status --short --branch`, `git fetch --all --prune` y comparar `HEAD` con `origin/<rama>`.
2. Ejecutar `pnpm lint`, `pnpm typecheck`, `pnpm test` y `pnpm build`.
3. Aplicar migraciones versionadas y revisar asesores de seguridad y rendimiento.
4. Crear y comprobar una vista previa de Vercel.
5. Configurar las URL permitidas de Supabase Auth.
6. Promover a producción sólo después de validar login, RLS, recuperación de contraseña y migración reversible.

## EAS

Después de autenticar Expo:

```bash
cd apps/mobile
npx eas-cli init
npx eas-cli build --profile preview --platform android
```

No se inicia ninguna compilación de pago sin confirmación previa.
