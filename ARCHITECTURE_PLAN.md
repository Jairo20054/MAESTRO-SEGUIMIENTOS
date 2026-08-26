# Plan de arquitectura

## Decisión principal

Construir una plataforma nueva en paralelo al legado dentro de un monorepo, compartiendo tipos, validación y reglas de negocio entre web y móvil. Supabase será la fuente remota de verdad; IndexedDB/almacenamiento móvil mantendrá cache y cola offline. Los HTML actuales siguen disponibles hasta completar la migración de cada dominio.

## Estructura propuesta

```text
MAESTRO-SEGUIMIENTOS/
├── apps/
│   ├── web/                 # Next.js App Router + PWA
│   └── mobile/              # Expo + Expo Router
├── packages/
│   ├── core/                # rachas, score, recurrencia, insights
│   ├── database/            # clientes Supabase y tipos generados
│   ├── types/               # contratos de dominio
│   ├── validation/          # esquemas Zod y formatos de backup
│   ├── sync/                # operaciones offline e idempotencia
│   ├── content/             # guías estáticas y catálogos
│   ├── ui/                  # tokens y primitivas compartibles, no DOM/RN
│   └── test-fixtures/       # fixtures anonimizados
├── supabase/
│   ├── migrations/
│   ├── tests/
│   └── seed.sql
├── docs/
├── legacy/                 # solo tras paridad comprobada
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

Se propone pnpm workspaces con Turborepo para ejecutar tareas y cachear builds. Expo tiene soporte de monorepo mediante workspaces, pero la configuración final se validará con la versión instalada antes de generarla.

## Límites de dominio

```text
Identidad y configuración
├── perfil
├── preferencias
└── dispositivos/sincronización

Ejecución diaria
├── hábitos
├── prioridad del día
├── sesiones
├── notas rápidas
└── compromisos

Dirección
├── metas y pasos
├── micro metas y ciclos
├── proyectos y tareas
└── revisiones

Conocimiento
├── rutas de aprendizaje
├── progreso de contenido
├── notas
└── lectura

Sistemas especializados
├── Carácter y Cultura
├── Camino Bíblico
├── Finanzas
└── NIDO

Analítica
├── métricas derivadas
├── Maestro Score
└── insights determinísticos
```

Los sistemas especializados reutilizan entidades comunes. Por ejemplo, Carácter no crea su propia tabla de hábitos; asigna hábitos comunes a su `system_id` y conserva notas/configuración específica.

## Web

- Next.js App Router y TypeScript estricto.
- Rutas públicas: acceso, registro, recuperación y privacidad.
- Rutas autenticadas dinámicas; evitar cachear respuestas que refresquen sesiones.
- Tailwind CSS y primitivas accesibles con tokens de diseño compartidos.
- Server Components para shells y lecturas apropiadas; interactividad mínima en cliente.
- TanStack Query únicamente donde sincronización, optimistic updates o cache de cliente lo justifique.
- Manifest mediante `app/manifest.ts`.
- Service worker con estrategia explícita; nunca cachear tokens, respuestas privadas compartidas o páginas autenticadas como contenido público.
- IndexedDB para cache de entidades y `pending_sync`.
- Headers de seguridad, CSP ajustada, `nosniff`, referrer policy y protección contra framing.

## Móvil

- Expo, React Native, TypeScript y Expo Router.
- Bottom navigation: Hoy, Progreso, acción rápida, Metas y Perfil.
- Navegación secundaria para sistemas especializados.
- Sesión almacenada mediante adaptador seguro compatible con Supabase; no reutilizar almacenamiento web por conveniencia.
- Cache local y cola de operaciones con los mismos contratos de `packages/sync`.
- EAS profiles: development, preview y production.
- La PR #1 se usa como referencia de UX y de fuentes históricas, no como base técnica automática.

## Autenticación

- Supabase Auth con email/contraseña, recuperación y cierre de sesión global/local según capacidad del SDK.
- Web SSR mediante el paquete oficial recomendado para cookies en la versión instalada.
- Mobile mediante `supabase-js` y adaptador de almacenamiento seguro.
- Preparar proveedores Google y Apple sin activarlos hasta disponer de credenciales y decisiones de producto.
- `profiles.id` referencia la PK de `auth.users` con `on delete cascade`.
- No usar `user_metadata` para autorización.

## Esquema inicial de Supabase

El esquema se confirmará con fixtures antes de generar SQL. Esta propuesta prioriza el MVP y evita una tabla por cada pantalla.

### Identidad y configuración

| Tabla           | Campos esenciales                                                                  |
| --------------- | ---------------------------------------------------------------------------------- |
| `profiles`      | `id`, `display_name`, `timezone`, `locale`, timestamps.                            |
| `user_settings` | `user_id`, `namespace`, `value jsonb`, `revision`, timestamps.                     |
| `systems`       | catálogo estable: maestro, micro_goals, character, bible, finance, learning, nido. |
| `user_systems`  | `id`, `user_id`, `system_id`, `enabled`, `position`, configuración.                |

### Hábitos y ejecución diaria

| Tabla              | Campos esenciales                                                                                                        |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| `habits`           | `id`, `user_id`, `system_id`, nombre, descripción, categoría, unidad, objetivo, prioridad, color, icono, fechas, activo. |
| `habit_schedules`  | `id`, `habit_id`, tipo de frecuencia, días, veces/semana, hora y timezone.                                               |
| `habit_logs`       | `id`, `user_id`, `habit_id`, `occurred_on`, estado, valor, unidad, justificación, nota, `operation_id`.                  |
| `daily_priorities` | `id`, `user_id`, `occurred_on`, texto, estado y referencia opcional.                                                     |
| `focus_sessions`   | `id`, `user_id`, `system_id`, tipo, inicio/fin, duración, estado, referencia y precisión temporal.                       |
| `commitments`      | `id`, `user_id`, `system_id`, texto, persona, vencimiento, estado, completado_en.                                        |

Restricción clave: un log por `(user_id, habit_id, occurred_on)` salvo que una frecuencia requiera múltiples ocurrencias; en ese caso se usa `occurrence_index`.

Estados de hábito:

```text
completed
missed
excused
```

La ausencia de fila significa `unknown`, no `missed`.

### Metas, micro metas y proyectos

| Tabla                | Campos esenciales                                                                                                           |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `goals`              | `id`, `user_id`, `system_id`, título, descripción, estado, prioridad, fechas, métrica, objetivo y progreso manual opcional. |
| `goal_steps`         | `id`, `goal_id`, título, estado, posición, vencimiento, valor objetivo/actual.                                              |
| `micro_goal_cycles`  | `id`, `user_id`, título, objetivo, fechas, estado y retrospectiva.                                                          |
| `micro_goals`        | `id`, `cycle_id`, título, dificultad, prioridad, estado, porcentaje, resultado y notas.                                     |
| `micro_goal_actions` | `id`, `micro_goal_id`, acción, fecha, estado, posición.                                                                     |
| `projects`           | `id`, `user_id`, `system_id`, título, descripción, estado, prioridad y fechas.                                              |
| `project_tasks`      | `id`, `project_id`, fase, título, descripción, responsable textual, prioridad, estado, fechas y posición.                   |
| `project_risks`      | `id`, `project_id`, título, categoría, probabilidad, impacto, mitigación, estado.                                           |
| `project_decisions`  | `id`, `project_id`, fecha, decisión, razón, responsable textual y estado.                                                   |
| `project_phases`     | `id`, `project_id`, título, orden, objetivo, entregable, gate y aprobado.                                                   |

Estas extensiones de proyecto son necesarias para conservar NIDO CEO sin deformar el modelo de Micro Metas.

### Aprendizaje, lectura y diario

| Tabla               | Campos esenciales                                                                          |
| ------------------- | ------------------------------------------------------------------------------------------ |
| `learning_tracks`   | catálogo o track del usuario, sistema, título, versión.                                    |
| `learning_units`    | `track_id`, clave estable, título, posición y metadatos de contenido.                      |
| `learning_progress` | `user_id`, `unit_id`, estado, porcentaje, completado_en.                                   |
| `learning_sessions` | extensión/referencia a `focus_sessions`, track/unidad, métricas específicas.               |
| `learning_notes`    | `id`, `user_id`, track/unidad opcional, subtipo, título y contenido.                       |
| `books`             | `id`, `user_id`, título, autor, total, estado.                                             |
| `reading_entries`   | `id`, `book_id`, fecha, página inicial/final, minutos y nota.                              |
| `journal_entries`   | `id`, `user_id`, `system_id`, fecha, tipo, título, contenido, estado de ánimo y metadatos. |

El contenido editorial vive en `packages/content`; solo catálogos que necesiten consulta relacional se sincronizan a `learning_tracks/units`.

### Camino Bíblico

| Tabla                 | Campos esenciales                                                                                                                      |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `bible_daily_entries` | `id`, `user_id`, fecha, pasaje, minutos, mood, resumen, observación, interpretación, aplicación, oración, gratitud, palabras y checks. |
| `bible_studies`       | `id`, `user_id`, título, pasaje, contenido, estado, fuente y fechas.                                                                   |
| `bible_reflections`   | `id`, `user_id`, fecha, título, contenido, referencia.                                                                                 |
| `bible_verses`        | `id`, `user_id`, referencia, texto/notas, estado de memorización.                                                                      |
| `bible_prayers`       | `id`, `user_id`, texto, fecha, respondida y fecha de respuesta.                                                                        |
| `bible_plan_progress` | `id`, `user_id`, plan_key, unit_key, estado y completado_en.                                                                           |

No se almacenará texto bíblico con restricciones de licencia sin revisar la fuente; referencias y contenido escrito por el usuario sí se preservan.

### Finanzas

| Tabla               | Campos esenciales                                                             |
| ------------------- | ----------------------------------------------------------------------------- |
| `finance_entries`   | `id`, `user_id`, fecha, tipo, categoría, monto, moneda, descripción y origen. |
| `finance_snapshots` | `id`, `user_id`, fecha, métricas del diagnóstico y metadatos.                 |

Se empieza con lo que realmente existe. No se crea un sistema contable complejo hasta que haya requisitos y datos que lo justifiquen.

### Revisiones, score e insights

| Tabla             | Campos esenciales                                                                         |
| ----------------- | ----------------------------------------------------------------------------------------- |
| `reviews`         | `id`, `user_id`, tipo diario/semanal/mensual, inicio/fin, respuestas y métricas snapshot. |
| `score_configs`   | `id`, `user_id`, versión, pesos y reglas visibles.                                        |
| `score_snapshots` | `id`, `user_id`, fecha/rango, versión de fórmula, componentes y total.                    |
| `insights`        | opcional en fase avanzada; tipo, periodo, evidencia, severidad y leído.                   |

Los insights iniciales se calculan determinísticamente. Persistirlos es opcional; primero pueden generarse bajo demanda.

### Tags y migración

| Tabla                    | Campos esenciales                                                                                       |
| ------------------------ | ------------------------------------------------------------------------------------------------------- |
| `tags`                   | `id`, `user_id`, nombre, color; único por usuario/nombre normalizado.                                   |
| `tag_assignments`        | `id`, `user_id`, `tag_id`, `entity_type`, `entity_id`; validación de tipos permitidos.                  |
| `legacy_migration_runs`  | `id`, `user_id`, estado, fuentes, conteos, hashes, timestamps y reporte.                                |
| `legacy_migration_items` | `run_id`, `user_id`, fuente, clave heredada, huella, `operation_id`, destino, estado y error redactado. |
| `sync_operations`        | `user_id`, `operation_id`, dispositivo, tipo, entidad y aplicado_en.                                    |

## Convenciones de base de datos

- UUID generados por cliente para entidades offline y por base cuando corresponda.
- `timestamptz` para instantes; `date` para seguimiento diario.
- `timezone` IANA del usuario, por defecto `America/Bogota` solo al crear perfil.
- `created_at`/`updated_at`; `revision` para control optimista.
- Checks y enums mediante constraints o tipos cuando sean estables.
- JSONB solo para configuración flexible, snapshots y campos heredados; no como sustituto general del modelo.
- Índices en `user_id`, FKs, fechas y filtros principales.
- Uniques con `user_id` para idempotencia y claves naturales.

## RLS

Todas las tablas de usuario tendrán RLS habilitado y grants mínimos. Patrón base:

```text
TO authenticated
USING ((select auth.uid()) is not null and (select auth.uid()) = user_id)
WITH CHECK ((select auth.uid()) is not null and (select auth.uid()) = user_id)
```

No se copiará la misma policy sin revisar ownership indirecto. Tablas hijas que no tengan `user_id` necesitarían joins costosos y policies más difíciles; por eso las tablas sensibles incluirán `user_id` además de la FK y una restricción/trigger que mantenga coherencia.

Pruebas pgTAP cubrirán SELECT, INSERT, UPDATE y DELETE para propietario, segundo usuario y anónimo. Las vistas serán `security_invoker = true`. Las funciones privilegiadas vivirán en un esquema no expuesto, con `search_path` fijado y grants explícitos.

Referencias de diseño:

- [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Supabase database migrations](https://supabase.com/docs/guides/local-development/database-migrations)
- [Supabase local development workflow](https://supabase.com/docs/guides/local-development/cli-workflows)
- [Supabase SSR client](https://supabase.com/docs/guides/auth/server-side/creating-a-client?framework=nextjs)
- [Expo monorepos](https://docs.expo.dev/guides/monorepos/)
- [Next.js PWA guide](https://nextjs.org/docs/app/guides/progressive-web-apps)

## Maestro Score

Primera fórmula propuesta, totalmente configurable y documentada:

```text
score =
  hábitos 40 % +
  metas 20 % +
  constancia 15 % +
  sesiones 15 % +
  compromisos 10 %
```

Cada componente se limita a 0–100 y conserva evidencia de entradas, periodo y versión de regla. No se implementa hasta validar cómo tratar días sin plan, hábitos excusados y metas sin fecha. El usuario podrá ajustar pesos, que siempre deben sumar 100.

## GitHub y CI

En cada PR:

```text
install --frozen-lockfile
format:check
lint
typecheck
unit tests
database tests
build web
Expo/React Native static checks
```

E2E web se añade al estabilizar el MVP. Migraciones se prueban con `supabase db reset` local; el proyecto remoto no se modifica desde PRs sin un entorno aislado y secretos configurados.

## Plan por fases y gates

### Fase 0 — Auditoría

Entregables: estos cuatro documentos. Gate: inventario aprobado y riesgo de datos públicos tratado con un plan de backup.

### Fase 1 — Fundación

Monorepo, web, mobile, paquetes, lint, tests, CI y legado intacto. Gate: builds mínimos verdes y ningún secreto.

### Fase 2 — Datos y autenticación

Proyecto Supabase exclusivo, migraciones, RLS, Auth y tipos. Gate: tests de aislamiento y asesores sin hallazgos críticos.

### Fase 3 — Migración heredada

Detectores, fixtures, preview, backup, importación idempotente y reconciliación. Gate: repetir cada fixture no duplica y nunca elimina origen.

### Fase 4 — MVP web

Login, Hoy, hábitos, metas, sesiones, historial, configuración, dashboard y PWA básica. Gate: E2E crítico y preview estable.

### Fase 5 — Sistemas avanzados

Micro Metas real, NIDO/proyectos, aprendizaje, Carácter, Camino Bíblico, finanzas, revisiones e insights.

### Fase 6 — Mobile

Experiencia Expo nativa sobre los mismos contratos y backend. Gate: flujos críticos en development/preview builds.

### Fase 7 — Producción

Auditoría, rendimiento, accesibilidad, backups, smoke tests y despliegue controlado.

## Decisiones pendientes que requieren al usuario

- Creación de un proyecto Supabase exclusivo y cualquier costo asociado.
- Credenciales y organización de Vercel/Expo.
- Retirada del snapshot personal ya público, después de confirmar backup privado.
- Dominio y nombre final de producto.
- Activación futura de Google/Apple.

Ninguna de estas decisiones bloquea la Fundación local ni los fixtures anonimizados.
