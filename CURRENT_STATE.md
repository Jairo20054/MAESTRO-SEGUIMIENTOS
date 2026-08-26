# Estado actual de MAESTRO-SEGUIMIENTOS

Fecha de auditoría: 2026-08-26  
Commit auditado: `b92d76c` (`main`)  
Rama de trabajo: `feature/maestro-platform`

## Resumen ejecutivo

MAESTRO-SEGUIMIENTOS es hoy una colección de aplicaciones web estáticas, autónomas y orientadas a un único navegador. No existe backend, autenticación, base de datos compartida, sincronización, aplicación React Native ni proceso de compilación. El valor principal sí existe: hay flujos de seguimiento útiles, contenido formativo amplio, formatos de respaldo y datos históricos que deben conservarse.

La arquitectura aparente de cinco HTML oculta una arquitectura real de al menos doce aplicaciones: `maestro.html` contiene ocho documentos HTML completos codificados en Base64 y los ejecuta como módulos embebidos. Esto explica su tamaño y también la fragmentación de datos.

La transformación debe ser incremental. El sistema heredado debe permanecer ejecutable y recuperable hasta que cada equivalente moderno haya pasado pruebas de migración y paridad funcional.

## Repositorio y GitHub

- Repositorio: `Jairo20054/MAESTRO-SEGUIMIENTOS`.
- Visibilidad: pública.
- Rama por defecto: `main`.
- El clon local estaba limpio al iniciar la auditoría.
- No hay issues abiertos.
- PR #2, “Refactor: unificar seguimientos y conservar progreso”, fue integrado.
- PR #1, “Crear app móvil de seguimiento y estudio bíblico”, sigue abierto como borrador. Contiene una PWA histórica llamada Raíz; debe revisarse y rescatarse de forma selectiva, no mezclarse ni cerrarse automáticamente.
- Ramas remotas observadas: `main`, `refactor/unificacion-seguimientos`, `agent/app-movil-seguimiento-biblico` y `guardar-cambios-2026-07-27`.

## Archivos actuales

| Archivo                           | Tamaño aproximado | Responsabilidad actual                                                              |
| --------------------------------- | ----------------: | ----------------------------------------------------------------------------------- |
| `index.html`                      |            4.7 KB | Centro de acceso a cuatro sistemas.                                                 |
| `maestro.html`                    |            649 KB | Dashboard, sesiones, metas rápidas y ocho aplicaciones embebidas.                   |
| `micro-metas.html`                |             90 KB | NIDO CEO OS; no es un gestor genérico de micro metas personales.                    |
| `cultura.html`                    |             73 KB | Proyecto Carácter: hábitos, lectura, presencia, pantalla, compromisos y revisiones. |
| `estudio-biblico-unificado.html`  |             30 KB | Camino Bíblico consolidado y migración desde dos sistemas anteriores.               |
| `README.md`                       |              2 KB | Descripción y apertura mediante Live Server.                                        |
| `.vscode/*`                       |        2 archivos | Configuración exclusiva para Live Server en puerto 5500.                            |
| `.devcontainer/devcontainer.json` |         1 archivo | Reenvío del puerto 5500 y extensión Live Server.                                    |

No existen `package.json`, gestor de workspaces, TypeScript, lint, tests, CI, `.gitignore`, PWA actual, Supabase, Vercel o Expo en la rama principal.

## Arquitectura de ejecución actual

```text
index.html
├── maestro.html
│   ├── dashboard y temporizador del Centro Maestro
│   └── 8 HTML Base64 cargados bajo demanda en iframes/srcdoc
│       ├── VANN CASTILLO
│       ├── Español
│       ├── Inglés
│       ├── Portugués
│       ├── Matemáticas
│       ├── Plan Maestro 6 Meses
│       ├── NIDO Launch OS
│       └── Educación financiera
├── micro-metas.html
│   └── NIDO CEO OS
├── cultura.html
│   └── Proyecto Carácter
└── estudio-biblico-unificado.html
    ├── datos unificados
    ├── legado Camino Bíblico
    └── legado Raíces
```

Cada aplicación administra su propio estado en `localStorage`. No hay identidad común, relaciones entre sistemas ni una fuente de verdad global.

## Inventario funcional

### Centro Maestro

- Dashboard con progreso medio de módulos, minutos de la semana, racha y metas rápidas.
- Temporizador general asociado a un módulo y registro de sesiones.
- Progreso manual por módulo: porcentaje, estado, nota y última sesión.
- Orden de módulos, búsqueda, impresión, pantalla completa y apertura separada.
- Exportación/importación JSON del estado del Centro Maestro.
- Migración automática de la clave v1 del propio dashboard a la v2.
- Semilla de cuatro metas personales.

Limitación: el progreso detallado de cada aplicación embebida no alimenta automáticamente el dashboard. El usuario mantiene un porcentaje manual separado del progreso real guardado dentro del módulo.

### Aplicaciones embebidas en Centro Maestro

1. **VANN CASTILLO**: misión diaria, checklist de activación, personalidad, conducta, comunicación e identidad. Estado diario por fecha.
2. **Español**: guía extensa con 15 bloques marcables y porcentaje de lectura.
3. **Inglés**: prácticas diarias, minutos, vocabulario, rúbricas de speaking, calendario de 28 días, semanas, ritual semanal, grabación mediante APIs del navegador y backup.
4. **Portugués**: registros diarios, minutos por habilidad, puntuación, racha, 26 semanas, vocabulario, gramática, pronunciación, examen y exportación CSV.
5. **Matemáticas**: contenido práctico, calculadoras, tablas, ejercicios y contador de respuestas correctas.
6. **Plan Maestro 6 Meses**: nueve hábitos, cuatro áreas vitales, plan de 180 días, 5S, revisiones diarias/semanales, score, calendario, notificaciones y respaldos JSON/HTML.
7. **NIDO Launch OS**: guía de lanzamiento orgánico y checklist de diez acciones.
8. **Educación financiera**: diagnóstico, presupuesto, deuda, fondo de emergencia, inversión, riesgo, reto de hábitos y metas de 30/60/90 días.

### Micro Metas

El nombre del archivo y su posición en la navegación no coinciden con su contenido. La aplicación implementa dirección ejecutiva para NIDO:

- nueve fases con puertas de aprobación;
- tareas, prioridades, responsables, estados y fechas;
- objetivos y resultados clave;
- riesgos con probabilidad e impacto;
- decisiones, revisiones CEO y actividad;
- búsqueda, filtros, exportación e importación.

Debe conservarse como un proyecto avanzado dentro de **Proyectos**, no usarse como implementación base de Micro Metas. El nuevo módulo Micro Metas necesita ciclos, acciones pequeñas y retrospectivas genéricas.

### Carácter y Cultura

- Doce hábitos diarios y score porcentual.
- Lectura, páginas, estudio, pantalla, sueño, energía, entrenamiento y victoria del día.
- Racha de días con score mínimo de 80 %.
- Biblioteca y progreso de libros.
- Notas culturales y técnica Feynman.
- Presencia, pensamiento crítico, disciplina digital, carácter y vitalidad.
- Compromisos/promesas con persona, fecha y estado.
- Revisión semanal y configuración de metas.
- Temporizador local de 45 minutos.
- Respaldo JSON y HTML con estado embebido.

Hay duplicidad directa con el motor de hábitos, lectura, sesiones, notas, compromisos y revisiones que se pide para MAESTRO. El contenido editorial y los ejercicios especializados sí deben conservarse como contexto del sistema Carácter.

### Camino Bíblico Unificado

- Resumen con sesiones, minutos, aplicaciones y rachas.
- Diario por fecha: pasaje, minutos, estado de ánimo, notas, observación, aplicación, oración, gratitud y cuatro checks.
- Biblioteca unificada de estudios, reflexiones, versículos y oraciones.
- Búsqueda y filtros.
- Heatmap de 168 días y plan de 90 días.
- Perfil con nombre y metas.
- Exportación/importación JSON.
- Reconstrucción no destructiva desde las dos claves bíblicas anteriores.

La consolidación preserva una copia completa de ambos estados heredados dentro de `legacy`, pero no promueve todos sus campos a la experiencia activa. En particular, el plan de Raíces, `preferredTime`, `fontSize` y el temporizador histórico de Camino no se convierten a campos canónicos. No están destruidos, pero quedarían invisibles sin una migración más completa.

## Datos históricos ya incluidos en el repositorio

El módulo Plan Maestro contiene un snapshot JSON embebido con cuatro registros diarios, del 1 al 4 de junio de 2026. Incluye hábitos y reflexiones personales. Como `maestro.html` está en un repositorio público, esos datos son recuperables aunque estén codificados en Base64.

Esto es un riesgo de privacidad de prioridad alta. En Fase 1 se debe retirar el dato personal del artefacto público únicamente después de generar y verificar un backup privado, conservar su huella y dejar una migración reproducible. No se debe copiar su texto personal a documentación, fixtures o seeds públicos.

## Cálculos existentes que aportan valor

- Rachas por días consecutivos en Centro Maestro, Inglés, Portugués, Plan Maestro, Cultura y Camino Bíblico.
- Cumplimiento porcentual de hábitos en Plan Maestro y Cultura.
- Minutos semanales y totales de sesiones.
- Progreso de módulos, planes, semanas y material educativo.
- Score de riesgo NIDO como `probabilidad × impacto`.
- Progreso de objetivos NIDO como promedio de KRs.
- Evaluaciones de idiomas y matemáticas.
- Diagnóstico de constancia bíblica y heatmap.

No hay una definición común para “racha”, “día cumplido” o “porcentaje”. La nueva plataforma debe formalizar estas reglas en `packages/core`, versionarlas y probarlas.

## Duplicidades y conflictos de concepto

| Capacidad               | Implementaciones actuales                                                       | Decisión                                                                                |
| ----------------------- | ------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Hábitos                 | Plan Maestro, Cultura, VANN, Raíz histórica, Inglés/Portugués y checklists NIDO | Un motor compartido; los sistemas aportan categorías, plantillas y contexto.            |
| Sesiones/temporizadores | Centro Maestro, Inglés, Plan Maestro, Cultura, Camino Bíblico                   | Un servicio de sesiones con tipo, duración y referencia opcional.                       |
| Metas                   | Centro Maestro, Plan Maestro, NIDO CEO, Finanzas                                | Modelo común de metas; proyectos y micro metas conservan extensiones propias.           |
| Notas/reflexiones       | Centro, Plan Maestro, Cultura, Camino Bíblico, Raíz                             | Diario/notas común con enlaces al sistema y entidad de origen.                          |
| Progreso                | Porcentaje manual, checks, días, KRs, semanas y planes                          | Métricas específicas sobre eventos canónicos; no forzar una única semántica.            |
| Backup                  | Varias formas JSON, CSV y HTML                                                  | Importadores por formato y exportación canónica versionada.                             |
| NIDO                    | `micro-metas.html` y módulo NIDO Launch                                         | Un proyecto NIDO con estrategia, ejecución y lanzamiento; no confundir con Micro Metas. |
| Biblia                  | Camino, Raíces y unificado                                                      | Mantener el unificado como referencia, completar la migración y conservar fuentes.      |

## Problemas técnicos y de seguridad

### Prioridad crítica/alta

- Datos personales embebidos en un archivo de un repositorio público.
- Estado fragmentado en 40 claves exactas actuales más familias dinámicas; no existe inventario ejecutable ni migrador general.
- Importadores aceptan objetos JSON con validación superficial y sin límite de tamaño, versión estricta o informe previo.
- Acciones de reinicio eliminan o sobrescriben datos del navegador; no todas obligan a crear backup.
- No hay autenticación, aislamiento por usuario ni RLS.
- No hay CSP, headers de seguridad o política central de dependencias.
- Toda la persistencia depende del navegador, el origen y el dispositivo.

### Prioridad media

- `maestro.html` es un contenedor monolítico con 447 KB de HTML Base64 y lógica duplicada.
- Los módulos en `srcdoc` comparten el contexto de origen y almacenamiento, dificultando aislamiento, depuración y políticas de seguridad.
- No hay tipos, esquemas, pruebas ni control automático de regresiones.
- Diferentes funciones usan UTC o fecha local de manera inconsistente; puede cambiar el día cerca de medianoche en Bogotá.
- Las métricas de racha y cumplimiento tienen reglas incompatibles.
- Búsqueda limitada a títulos de módulos o al módulo bíblico; no existe índice global.
- Responsive y accesibilidad dependen de cada HTML, sin auditoría común.
- Live Server es la única experiencia de desarrollo documentada.

## Activos que deben preservarse

- Los cuatro sistemas conceptuales y su identidad visual oscura/premium.
- Los ocho módulos formativos embebidos, separando contenido estático de progreso del usuario.
- El proyecto NIDO, sus fases, riesgos, decisiones, tareas y guía de lanzamiento.
- Los formatos de backup existentes y compatibilidad de importación.
- Las cuatro fechas históricas del Plan Maestro, mediante una migración privada verificada.
- Las claves bíblicas antiguas y sus payloads completos.
- La PWA Raíz y el laboratorio de neurociencia recuperables desde el historial, después de decidir su encaje funcional.

## Conclusión de Fase 0

La reescritura directa sería insegura. La secuencia correcta es: congelar formatos heredados, crear fixtures anonimizados, probar detectores/importadores, establecer el monorepo en paralelo, implementar el backend con RLS y migrar por módulo con reconciliación visible. Los HTML actuales pasan a `legacy/` solo cuando exista paridad comprobada y nunca como primer movimiento.
