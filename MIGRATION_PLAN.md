# Plan de migración heredada

## Objetivo

Migrar datos de los HTML actuales y formatos históricos a una cuenta autenticada de Supabase sin borrar el origen, sin duplicar registros y con evidencia verificable de lo ocurrido.

## Componentes

```text
legacyMigrationService
├── detectorRegistry
├── schemaRegistry
├── previewBuilder
├── backupExporter
├── transformerRegistry
├── deduplicationEngine
├── supabaseWriter
├── reconciliationEngine
└── migrationReport
```

### Responsabilidades

- **Detectores**: identifican claves conocidas y familias dinámicas, sin modificarlas.
- **Esquemas**: validan versiones, tipos, tamaños, fechas y campos obligatorios.
- **Preview**: muestra fuentes, conteos, rango temporal, advertencias y destino propuesto.
- **Backup**: descarga los valores originales y un manifiesto con hashes antes de escribir al servidor.
- **Transformadores**: convierten cada formato a comandos canónicos.
- **Deduplicación**: asigna IDs estables e impide repetir una importación.
- **Writer**: aplica lotes pequeños bajo la sesión del usuario y RLS.
- **Reconciliación**: compara origen, comandos y filas persistidas.
- **Reporte**: conserva estado, errores y elementos omitidos sin copiar secretos a logs.

## Estados de una migración

```text
detected
validated
backup_created
ready
running
needs_review
completed
failed
```

`completed` solo se alcanza si todos los lotes aceptados son reconciliados. Un elemento inválido no se descarta silenciosamente: queda registrado con código de error y una representación redactada.

## Idempotencia

Cada elemento obtiene una identidad estable:

```text
source_fingerprint = SHA-256(payload original normalizado)
legacy_item_key = source_key + entity_type + legacy_id_or_natural_key
operation_id = UUID v5(user_id, source_fingerprint, legacy_item_key)
```

En Supabase se aplican restricciones únicas sobre:

```text
(user_id, operation_id)
(user_id, source_key, source_fingerprint, legacy_item_key)
```

Repetir la misma migración produce `already_applied`, no una fila duplicada. Un payload modificado crea una nueva huella y se muestra como una revisión de la fuente; no reemplaza datos anteriores sin una regla explícita.

## Flujo de usuario

1. Iniciar sesión.
2. Abrir **Configuración → Migrar datos antiguos**.
3. Escanear `localStorage` y, opcionalmente, seleccionar JSON/HTML/CSV.
4. Mostrar fuentes encontradas y conteos.
5. Descargar backup original y manifiesto.
6. Validar y presentar advertencias.
7. Elegir fuentes a migrar.
8. Transformar en memoria; no borrar ni sobrescribir claves.
9. Escribir lotes idempotentes en Supabase.
10. Releer conteos desde Supabase bajo RLS.
11. Mostrar informe final descargable.
12. Ofrecer “Marcar como archivado” solo en la UI. Las claves permanecen intactas.

## Orden de implementación de importadores

### Ola 1: fuentes estructurales y de mayor valor

1. Plan Maestro v4 y sus tres claves legadas.
2. Cultura.
3. Camino Bíblico unificado, luego sus copias `legacy`.
4. Claves bíblicas originales cuando no exista unificado o cuando aporten elementos nuevos.
5. Centro Maestro: metas, sesiones y progreso de módulos.

### Ola 2: aprendizaje y proyectos

6. Inglés.
7. Portugués.
8. Español y Matemáticas.
9. NIDO CEO OS.
10. NIDO Launch.
11. Finanzas.
12. VANN por fecha.

### Ola 3: fuentes históricas opcionales

13. PWA Raíz (`raiz_mobile_v1`).
14. Laboratorio de neurociencia (`neuro_habit_lab_v1`).

## Reglas de transformación por dominio

### Hábitos

- Crear una plantilla canónica por hábito normalizado.
- Conservar `source_system`, nombre original y clave original.
- No fusionar solo por nombre. Proponer coincidencias y usar equivalencias aprobadas:
  - lectura del Plan Maestro y lectura de Cultura pueden apuntar al mismo hábito si sus metas/unidades son compatibles;
  - Biblia de Cultura y Camino Bíblico pueden compartir un hábito, pero el estudio bíblico detallado continúa como entidad propia;
  - “redes máximo 30 minutos” conserva medición numérica además del check.
- Un check diario se transforma en `habit_log` con estado `completed`; un día explícitamente revisado sin check puede producir `missed`; la ausencia de registro queda como `unknown`, nunca como incumplimiento automático.

### Rachas

No se migran como verdad primaria. Se migran logs y reglas; las rachas se recalculan. El informe compara el resultado nuevo con el valor mostrado por el sistema antiguo y explica diferencias.

### Sesiones

- Centro Maestro, Inglés, Cultura y Camino Bíblico producen `focus_sessions` o `learning_sessions` según contexto.
- Mantener minutos originales y timestamp cuando exista.
- Si solo hay fecha, usar `occurred_on` y marcar precisión `date_only`; no inventar una hora.

### Metas y micro metas

- Metas rápidas del Centro y metas de 30/60/90 días de Finanzas pasan a `goals` con origen.
- Objetivos/KRs de NIDO permanecen vinculados al proyecto NIDO.
- Los checks de NIDO Launch se transforman en tareas del proyecto.
- No se inventan ciclos de Micro Metas a partir de NIDO CEO. El módulo nuevo empieza vacío o con plantillas explícitas.

### Carácter y Cultura

- Libros → `reading_entries`/libros del usuario.
- Promesas → `commitments`.
- Notas Feynman/cultura/presencia/carácter → `learning_notes` o `journal_entries` con subtipo y origen.
- Revisiones semanales → `reviews` de tipo `weekly`.
- Configuración → `user_settings` namespaced.

### Camino Bíblico

- El diario se migra por fecha con todos los campos conocidos.
- Estudios, reflexiones, versículos y oraciones conservan ID original y `source`.
- `legacy.camino` y `legacy.raices` se inspeccionan incluso cuando las banderas actuales indiquen migración completa.
- Recuperar explícitamente `raices.plan`, `preferredTime`, `fontSize` y `camino.timerSeconds`.
- Si el mismo estudio aparece en el unificado y el legado, usar ID/origen y huella de contenido; no deduplicar solo por título.

### Progreso de contenido educativo

- Español, Matemáticas, Inglés, Portugués y Neurociencia usan un catálogo estable de unidades.
- Los checks se guardan como `learning_progress` contra IDs de catálogo versionados.
- Si cambia una guía, un mapa de alias conserva la relación con IDs anteriores.

### Finanzas

- Tratar el contenido como información sensible.
- El estado de diagnóstico y metas se migra bajo RLS.
- No registrar montos completos en logs de migración.
- Las calculadoras no persistidas no pueden recuperarse y se documentan como “sin fuente”.

## Prevención de conflictos

Cada entidad mutable incorpora:

```text
id
user_id
created_at
updated_at
revision
source
source_id
deleted_at (solo cuando haga falta papelera)
```

Para operaciones offline:

- el cliente genera `operation_id` y `entity_id` antes de desconectarse;
- IndexedDB conserva una cola cifrada cuando la plataforma lo permita;
- el servidor acepta cada `operation_id` una sola vez;
- cambios no conflictivos se combinan por entidad/campo;
- conflictos sobre el mismo campo no se resuelven silenciosamente por “último escritor”; se muestra una comparación si ambos lados cambiaron desde la revisión conocida;
- checks diarios pueden usar upsert sobre `(user_id, habit_id, occurred_on)` con revisión optimista.

## Seguridad

- Nunca usar una clave secreta o `service_role` en web o móvil.
- Todas las escrituras usan la sesión del usuario y políticas RLS.
- Validar en cliente y servidor/base de datos.
- Limitar archivos, profundidad JSON, número de filas y longitud de texto.
- Rechazar claves de objeto peligrosas y payloads que intenten contaminación de prototipos.
- Escapar contenido al renderizar previews.
- Los errores no incluyen payloads completos.
- Los snapshots originales se descargan al usuario; no se suben como JSONB completo por defecto.
- Si el usuario elige conservar un snapshot remoto, debe cifrarse y tener política de retención explícita.

## Pruebas obligatorias

### Fixtures

- Un fixture anonimizado por versión conocida.
- Payload vacío, parcialmente corrupto, sobredimensionado y con campos desconocidos.
- Colisiones de IDs entre Camino y Raíces.
- Fechas UTC/local cerca de medianoche.
- Importación repetida.
- Fuente modificada después de una migración anterior.

### Aserciones

- Cero eliminación de claves heredadas.
- Conteos reconciliados.
- IDs estables entre ejecuciones.
- Ningún registro cruza usuarios.
- RLS permite al propietario y deniega a otro usuario/anónimo para SELECT, INSERT, UPDATE y DELETE.
- Las copias JSON históricas siguen siendo importables.
- Un fallo a mitad de lote se puede reanudar sin duplicar.

## Criterios para mover HTML a `legacy/`

Un archivo se mueve solo cuando:

1. existe importador para todas sus claves;
2. sus fixtures pasan;
3. la nueva UI cubre las acciones valiosas;
4. backup e importación se verifican;
5. hay comparación de conteos con datos reales;
6. existe una ruta documentada para abrir el archivo anterior;
7. el usuario aprueba cualquier pérdida funcional deliberada.

Mover no significa eliminar. La eliminación definitiva requiere otra decisión y un release posterior.

## Rollback

La migración no modifica la fuente, por lo que el rollback de usuario consiste en dejar de usar los registros importados y volver al HTML/backup. En Supabase, una migración se revierte por `migration_run_id` mediante una operación administrativa autenticada que marca registros como revertidos o los elimina de forma transaccional cuando no tengan modificaciones posteriores. Nunca se hace rollback masivo por rango de fechas sin verificar la propiedad y el origen.
