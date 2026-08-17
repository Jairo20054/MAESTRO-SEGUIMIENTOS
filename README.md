# MAESTRO-SEGUIMIENTOS

Repositorio personal de seguimiento organizado alrededor de **cuatro sistemas principales**, cada uno con una responsabilidad clara. La estructura fue consolidada para reducir duplicidad y mantener información más útil para el seguimiento.

## Sistemas principales

| Sistema | Archivo | Propósito |
| --- | --- | --- |
| Centro Maestro de Crecimiento | `maestro.html` | Visión general, aprendizaje, hábitos, finanzas, proyectos y seguimiento personal. |
| Micro Metas | `micro-metas.html` | Ciclos cortos, acciones medibles, historial y avance sostenido. |
| Carácter y Cultura | `cultura.html` | Hábitos, lectura, compromisos, notas y desarrollo cultural. |
| Camino Bíblico Unificado | `estudio-biblico-unificado.html` | Diario, estudios, reflexiones, versículos, oraciones, progreso y respaldo. |

`index.html` funciona como centro de acceso a los cuatro sistemas.

## Consolidación del estudio bíblico

Los antiguos `estudio-biblico.html` y `estudio-biblico-2.html` fueron reemplazados por `estudio-biblico-unificado.html`.

La versión unificada conserva el progreso mediante migración desde las claves de almacenamiento anteriores:

- `camino_biblico_rvr1960_v1`
- `raices-estudio-biblico-v1`

La aplicación crea una nueva fuente consolidada (`maestro_biblia_unificada_v1`) y **no elimina las claves antiguas del navegador**, de modo que siguen funcionando como respaldo de recuperación. También permite exportar e importar respaldos JSON.

## Abrir con Live Server

1. Abre el repositorio en VS Code o GitHub Codespaces.
2. Confirma que **Live Server** esté instalado.
3. Abre `index.html` con **Open with Live Server**.
4. Selecciona desde el centro el sistema que quieras utilizar.

El puerto configurado es el **5500**.

> Recomendación: usa `index.html` como punto de entrada habitual para evitar trabajar accidentalmente sobre rutas antiguas o archivos de historial.