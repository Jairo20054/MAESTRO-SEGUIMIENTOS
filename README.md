# Maestro Seguimientos

Maestro es la evolución del conjunto original de seguimientos personales hacia una plataforma web y móvil unificada, local-first, explicable y preparada para sincronización segura.

La modernización es incremental: los HTML legados y sus datos permanecen intactos mientras cada dominio se migra con respaldo, validación e idempotencia.

## Estado del proyecto

- **Fase 0 — Auditoría:** completada y documentada.
- **Fase 1 — Fundación:** monorepo, aplicaciones base y dominio compartido en construcción.
- **Datos actuales:** siguen viviendo en `localStorage`; todavía no se envían a un backend.
- **Supabase:** arquitectura propuesta, aún no provisionada ni conectada.

Consulta antes de migrar datos:

- [Estado actual](./CURRENT_STATE.md)
- [Inventario de datos](./DATA_INVENTORY.md)
- [Plan de migración](./MIGRATION_PLAN.md)
- [Plan de arquitectura](./ARCHITECTURE_PLAN.md)

## Arquitectura

```text
apps/
  web/          Next.js App Router + PWA
  mobile/       Expo + React Native + Expo Router
packages/
  core/         reglas de progreso, rachas y Maestro Score
  types/        contratos compartidos
  validation/   validación de respaldos y límites de confianza
  database/     frontera de persistencia
  sync/         operaciones idempotentes de sincronización
*.html          sistemas legados conservados durante la migración
```

## Desarrollo

Requisitos: Node.js 22.13 o superior y Corepack habilitado.

```bash
corepack enable
pnpm install
pnpm dev:web
```

Para abrir Expo:

```bash
pnpm dev:mobile
```

Validación completa:

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Configuración

Copia `.env.example` a `.env.local` sólo cuando exista un proyecto Supabase configurado. Las claves públicas nunca reemplazan RLS y una clave `service_role` no debe entrar en clientes web o móvil.

## Legado y privacidad

El punto de entrada histórico sigue siendo `index.html` y puede ejecutarse con Live Server en el puerto 5500. No borres claves antiguas del navegador: primero exporta un respaldo, migra sobre una copia y verifica conteos y hashes. La auditoría también identificó contenido personal incrustado en un snapshot público; debe respaldarse de forma privada antes de retirarlo del historial activo.
