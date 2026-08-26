"use client";

import { useEffect, useState } from "react";

const legacySources = [
  ["centro_maestro_unificado_v2_con_datos", "Centro Maestro"],
  ["centro_maestro_unificado_v1", "Centro Maestro v1"],
  ["centro_maestro_timer_v1", "Temporizador Maestro"],
  ["proyecto_caracter_integral_v1", "Proyecto Carácter"],
  ["camino_biblico_unificado_v1", "Camino Bíblico Unificado"],
  ["nido-ceo-os-v1", "NIDO CEO OS (proyecto separado)"],
] as const;

type Detected = { key: string; label: string; bytes: number };

export function LegacyMigration() {
  const [detected, setDetected] = useState<Detected[]>([]);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDetected(
        legacySources.flatMap(([key, label]) => {
          const value = window.localStorage.getItem(key);
          return value ? [{ key, label, bytes: new Blob([value]).size }] : [];
        }),
      );
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  function downloadLocalBackup() {
    const sources = Object.fromEntries(
      detected.map((source) => [source.key, window.localStorage.getItem(source.key)]),
    );
    const blob = new Blob(
      [
        JSON.stringify(
          {
            format: "maestro-legacy-backup",
            version: 1,
            exportedAt: new Date().toISOString(),
            sources,
          },
          null,
          2,
        ),
      ],
      { type: "application/json" },
    );
    const href = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = href;
    anchor.download = `maestro-respaldo-local-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(href);
  }

  return (
    <section className="panel section-block">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Migración local</p>
          <h2>Datos encontrados en este navegador</h2>
        </div>
        <span>{detected.length} fuentes</span>
      </div>
      {detected.length ? (
        <>
          <div className="record-list">
            {detected.map((source) => (
              <div className="record-card mini" key={source.key}>
                <div>
                  <h3>{source.label}</h3>
                  <small>
                    {source.key} · {(source.bytes / 1024).toFixed(1)} KB
                  </small>
                </div>
                <span className="status active">Detectado</span>
              </div>
            ))}
          </div>
          <div className="info-box">
            <strong>Primero, conserva una copia verificable</strong>
            <span>
              Las claves originales no se eliminarán. La importación canónica a Supabase se
              habilitará después de validar cada formato y reconciliar conteos.
            </span>
          </div>
          <button className="primary-button" type="button" onClick={downloadLocalBackup}>
            Descargar respaldo local
          </button>
        </>
      ) : (
        <div className="empty-state">
          No se detectaron claves heredadas conocidas en este origen.
        </div>
      )}
    </section>
  );
}
