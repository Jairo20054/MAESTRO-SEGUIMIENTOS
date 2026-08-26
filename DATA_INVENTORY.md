# Inventario de datos heredados

Este documento describe fuentes de datos, formatos y reglas de conservación. No contiene valores personales de los snapshots encontrados.

## Principios

1. Detectar y presentar antes de migrar.
2. Exportar un backup verificable antes de cualquier transformación.
3. No llamar `localStorage.removeItem()` sobre una fuente heredada durante la migración.
4. Validar cada payload con un esquema versionado y límites de tamaño.
5. Registrar huella SHA-256, conteos, advertencias y resultado.
6. Usar claves naturales heredadas más `user_id` y `source_key` para idempotencia.
7. Marcar como migrado solo después de reconciliar conteos y muestras.
8. Conservar campos desconocidos en un sobre de recuperación, sin convertirlos ciegamente en columnas canónicas.

## Claves actuales de `localStorage`

### Centro Maestro

| Clave                                   | Forma         | Contenido                                                                                         |
| --------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------- |
| `centro_maestro_unificado_v2_con_datos` | objeto        | Tema, meta semanal, nota, orden de módulos, progreso manual por módulo, sesiones y metas rápidas. |
| `centro_maestro_unificado_v1`           | objeto legado | Mismo dominio; el shell v2 lo usa como fallback.                                                  |
| `centro_maestro_timer_v1`               | objeto        | `running`, `startedAt`, `elapsed`, `moduleId`.                                                    |

Forma canónica aproximada del estado v2:

```text
theme
weeklyGoal
dashboardNote
lastModule
moduleOrder[]
modules[moduleId] = { progress, status, note, lastStudy }
sessions[] = { moduleId, minutes, date }
goals[] = { id, text, done, createdAt? }
```

### Micro Metas / NIDO CEO OS

| Clave            | Forma  | Contenido                                                                           |
| ---------------- | ------ | ----------------------------------------------------------------------------------- |
| `nido-ceo-os-v1` | objeto | Empresa, fases, tareas, objetivos/KRs, riesgos, decisiones, revisiones y actividad. |

```text
company = { vision, pilotCity, segment, northStar, commission }
phases[] = { id, approved, open }
tasks[] = { id, phaseId, title, owner, priority, description, status, dueDate, createdAt, updatedAt }
goals[] = { id, title, period, why, krs[] }
risks[] = { id, title, category, probability, impact, owner, mitigation, status }
decisions[] = { id, date, decision, reason, owner, status }
reviews[]
activity[]
```

Esta fuente se migra a un proyecto NIDO, no al módulo genérico de Micro Metas.

### Carácter y Cultura

| Clave                           | Forma  | Contenido                                                                         |
| ------------------------------- | ------ | --------------------------------------------------------------------------------- |
| `proyecto_caracter_integral_v1` | objeto | Días, hábitos, libros, promesas, checklists, configuración, notas y última vista. |

```text
version, startDate, selectedDate, theme, updatedAt, lastView
days[date] = {
  habits{}, pages, study, screen, sleep, energy,
  training, victory, saved
}
books[] = { id, title, author, current, total }
promises[] = { id, text, person, date, done }
checks[grupo.indice] = boolean
settings = {
  pagesGoal, studyGoal, screenGoal, screenBaseline,
  screenReduction, screenWindow1, screenWindow2,
  screenTrigger, screenReplacement
}
notes = { culture{}, feynman{}, presence{}, character{}, weekly{}, training{} }
```

Hábitos actuales: Biblia y oración, leer 10 páginas, estudio profundo, explicar lo aprendido, ejercicio, higiene/presencia, primera hora sin redes, meta de pantalla, última hora sin redes, tres prioridades, cumplir la palabra y reflexión diaria.

### Camino Bíblico

| Clave                         | Estado            | Contenido                                                                 |
| ----------------------------- | ----------------- | ------------------------------------------------------------------------- |
| `maestro_biblia_unificada_v1` | canónica actual   | Perfil, diario, biblioteca, plan, copias legacy e historial de migración. |
| `camino_biblico_rvr1960_v1`   | legado; no borrar | Diario SOIA, estudios, reflexiones, versículos, plan y temporizador.      |
| `raices-estudio-biblico-v1`   | legado; no borrar | Perfil, preferencias, logs, plan, estudios y oraciones.                   |

Estado unificado:

```text
version, theme
profile = { name, weeklyGoal, sessionGoal }
daily[date]
studies[], reflections[], verses[], prayers[]
plan = { start, done{} }
legacy = { camino, raices }
migration = { createdAt, camino, raices, lastImport }
```

Campos del diario aceptados por el unificado: `verse`, `minutes`, `mood`, `notes`, `summary`, `observation`, `interpretation`, `application`, `prayer`, `gratitude`, `reading`, `reflection`, `prayerCheck`, `applicationCheck`, `completed`, `checks`, `words` y timestamps heredados.

Diferencias que requieren tratamiento explícito:

- `camino.timerSeconds` no se promueve al modelo unificado.
- `raices.plan` no se promueve a `plan.done`.
- `raices.profile.preferredTime` no se promueve.
- `raices.settings.theme` y `fontSize` no se promueven de forma completa.
- La copia íntegra sigue disponible dentro de `legacy`, por lo que se debe recuperar desde allí al migrar a Supabase.

### Módulos embebidos en `maestro.html`

#### VANN CASTILLO

| Clave                      | Forma                                  |
| -------------------------- | -------------------------------------- |
| `vann-castillo-YYYY-MM-DD` | familia diaria con checks y `mission`. |

El detector debe enumerar únicamente claves que cumplan el patrón estricto y validar la fecha.

#### Español

| Clave                      | Forma                           |
| -------------------------- | ------------------------------- |
| `guia-espanol-progreso-v1` | mapa de 15 secciones a boolean. |

#### Inglés

| Clave                      | Forma                          |
| -------------------------- | ------------------------------ |
| `englishSpeakingTrackerV1` | arreglo de prácticas diarias.  |
| `englishSpeakingGoalsV1`   | metas/configuración del plan.  |
| `englishSpeakingWeeksV1`   | progreso de 26 semanas.        |
| `englishSpeakingRitualV1`  | respuestas del cierre semanal. |

Una práctica puede contener fecha, minutos, tema, palabras, escucha, fluidez, pronunciación, confianza, vocabulario, gramática, frase y notas.

#### Portugués

| Clave        | Forma                                    |
| ------------ | ---------------------------------------- |
| `pt_records` | registros diarios por habilidad y score. |
| `pt_weeks`   | mapa de semanas completadas.             |
| `pt_theme`   | preferencia de tema.                     |

Los registros incluyen minutos de vocabulario, gramática, escucha, speaking y escritura; palabras, verbos, autoevaluaciones, checklist y nota.

#### Matemáticas

| Clave              | Forma                                      |
| ------------------ | ------------------------------------------ |
| `mathCorrectCount` | contador numérico de respuestas correctas. |

#### Plan Maestro 6 Meses

| Clave                                     | Estado               |
| ----------------------------------------- | -------------------- |
| `plan_maestro_habitos_6_meses_v4`         | canónica del módulo. |
| `dashboard_habitos_90_dias_v3_definitivo` | legado.              |
| `dashboard_habitos_90_dias_v2`            | legado.              |
| `dashboard_habitos_90_dias_v1`            | legado.              |

```text
version, startDate, selectedDate, reviewTime, theme, lastSavedAt
entries[date] = {
  habits{}, fields{}, energy, mood, weight,
  bankAction, trafficAction, reflection,
  reviewedAt, touchedAt, schemaVersion
}
milestones{}, checks{}, areaNotes{}, weeklyReviews{}
```

Hábitos: lectura, Biblia, ejercicio, control de azúcar, higiene, redes, contenido edificante, presentación personal y detalle consciente.

El HTML contiene un snapshot embebido con cuatro fechas históricas. Se debe extraer una sola vez a un backup privado, calcular su huella y migrarlo usando identificadores derivados de fecha y origen. Nunca debe convertirse en seed público.

#### NIDO Launch OS

| Claves                               | Forma                                        |
| ------------------------------------ | -------------------------------------------- |
| `nido-launch-c1` … `nido-launch-c10` | diez strings booleanos (`"true"`/`"false"`). |

#### Educación financiera

Todas usan el prefijo `fin_`:

| Clave                                    | Contenido                        |
| ---------------------------------------- | -------------------------------- |
| `fin_theme`                              | tema.                            |
| `fin_progress`                           | secciones completadas.           |
| `fin_health`                             | diagnóstico financiero.          |
| `fin_risk`                               | checklist/perfil de riesgo.      |
| `fin_habits`                             | reto de 30 días.                 |
| `fin_goal30`, `fin_goal60`, `fin_goal90` | metas escritas.                  |
| `fin_moneyContract`                      | contrato personal con el dinero. |

Los valores introducidos en varias calculadoras no se persisten actualmente y, por tanto, no son migrables desde `localStorage`.

## Fuentes recuperables desde el historial Git

Estas claves no son leídas por la rama principal, pero pueden existir en navegadores que usaron versiones anteriores:

| Clave                | Fuente histórica      | Contenido                                                            |
| -------------------- | --------------------- | -------------------------------------------------------------------- |
| `raiz_mobile_v1`     | PR #1 / PWA Raíz      | Hábitos configurables, checks por fecha, estudios bíblicos y diario. |
| `neuro_habit_lab_v1` | Neurociencia práctica | Plan y progreso de 66 días.                                          |
| `neuro_theme`        | Neurociencia práctica | Tema visual.                                                         |

El migrador debe detectarlas como “fuentes históricas opcionales”, mostrar conteos y pedir confirmación antes de integrarlas.

## Datos estáticos frente a datos del usuario

No todo lo existente pertenece a la base de datos:

- Las guías de Español, Matemáticas, Neurociencia, Finanzas y NIDO Launch son principalmente contenido editorial estático. Deben extraerse a archivos de contenido versionados o seeds de catálogo, no duplicarse por usuario.
- El progreso, checks, sesiones, notas, respuestas, metas y preferencias sí pertenecen al usuario.
- Las plantillas de hábitos, planes bíblicos y fases NIDO pueden existir como catálogos; la activación/progreso crea registros del usuario.

## Formatos de exportación existentes

| Origen         | Formato                                                                         |
| -------------- | ------------------------------------------------------------------------------- |
| Centro Maestro | `{ app, version, exportedAt, state }`.                                          |
| Cultura        | `{ app, exportedAt, data }` y HTML con `embeddedState`.                         |
| Camino Bíblico | `{ app, version, exportedAt, state }`; también acepta payloads Camino o Raíces. |
| Plan Maestro   | `{ exportedAt, app, data }` y HTML con `embeddedProgress`.                      |
| Inglés         | JSON propio que reúne varias claves.                                            |
| Portugués      | CSV de registros; no representa toda la configuración.                          |
| NIDO CEO       | objeto de estado directo.                                                       |
| Raíz histórica | objeto de estado directo.                                                       |

La nueva exportación de cuenta usará un sobre versionado, sin invalidar estos importadores:

```text
format: "maestro-account-backup"
version: 1
exported_at
schema_version
user
entities{}
source_manifests[]
checksums{}
```

## Reglas de reconciliación

Después de cada migración se comparan:

- número de fuentes detectadas;
- número de registros válidos, omitidos y con advertencia;
- fechas mínima y máxima;
- conteos por tipo;
- suma de minutos cuando aplique;
- IDs heredados y huellas;
- una muestra presentada al usuario;
- conteo final en Supabase bajo el mismo `user_id`.

Un resultado con discrepancias no se marca como completado. Se conserva como `needs_review` y se permite exportar el informe.
