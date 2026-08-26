import { createJournal, deleteJournal } from "@/app/actions";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { requireUser } from "@/lib/auth";
import { getJournals } from "@/lib/repositories/maestro";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Camino Bíblico" };

function localDate() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Bogota" }).format(new Date());
}

function metadataValue(metadata: unknown, key: string) {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) return null;
  const value = (metadata as Record<string, unknown>)[key];
  return typeof value === "string" ? value : null;
}

export default async function BiblePage() {
  const user = await requireUser();
  const journals = await getJournals(await createClient(), user.id, "bible");
  const daily = journals.filter((entry) => entry.entry_type === "bible_daily");
  const library = journals.filter((entry) => entry.entry_type === "bible_library");
  const minutes = daily.reduce(
    (sum, entry) => sum + Number(metadataValue(entry.metadata, "minutes") ?? 0),
    0,
  );
  const applications = daily.filter((entry) => metadataValue(entry.metadata, "application")).length;
  const activeDates = new Set(daily.map((entry) => entry.occurred_on));

  return (
    <div className="page-wrap">
      <PageHeader
        eyebrow="Sistema 04"
        title="Camino Bíblico"
        description="Lee, comprende y aplica. Diario, biblioteca y progreso espiritual bajo una sola cuenta."
      />
      <section className="metric-grid compact">
        <article className="metric-card">
          <span>Días activos</span>
          <strong>{activeDates.size}</strong>
          <small>históricos</small>
        </article>
        <article className="metric-card">
          <span>Minutos</span>
          <strong>{minutes}</strong>
          <small>acumulados</small>
        </article>
        <article className="metric-card">
          <span>Aplicaciones</span>
          <strong>{applications}</strong>
          <small>decisiones concretas</small>
        </article>
      </section>
      <section className="two-column section-block">
        <article className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Diario de estudio</p>
              <h2>Registrar hoy</h2>
            </div>
          </div>
          <form className="data-form" action={createJournal}>
            <input type="hidden" name="systemKey" value="bible" />
            <input type="hidden" name="entryType" value="bible_daily" />
            <div className="form-row">
              <label>
                Fecha
                <input type="date" name="occurredOn" defaultValue={localDate()} required />
              </label>
              <label>
                Minutos
                <input type="number" name="minutes" min="0" />
              </label>
            </div>
            <label>
              Pasaje / tema
              <input name="title" maxLength={200} placeholder="Ej. Mateo 6:25-34" />
            </label>
            <label>
              Resumen / notas
              <textarea name="content" required maxLength={10000} />
            </label>
            <div className="form-row">
              <label>
                Observación
                <textarea name="observation" />
              </label>
              <label>
                Aplicación concreta
                <textarea name="application" />
              </label>
            </div>
            <div className="form-row">
              <label>
                Oración
                <textarea name="prayer" />
              </label>
              <label>
                Gratitud
                <textarea name="gratitude" />
              </label>
            </div>
            <button className="primary-button" type="submit">
              Guardar estudio
            </button>
          </form>
        </article>
        <article className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Biblioteca personal</p>
              <h2>Guardar recurso</h2>
            </div>
          </div>
          <form className="data-form" action={createJournal}>
            <input type="hidden" name="systemKey" value="bible" />
            <input type="hidden" name="entryType" value="bible_library" />
            <input type="hidden" name="occurredOn" value={localDate()} />
            <label>
              Tipo
              <select name="kind" defaultValue="study">
                <option value="study">Estudio</option>
                <option value="reflection">Reflexión</option>
                <option value="verse">Versículo</option>
                <option value="prayer">Oración</option>
              </select>
            </label>
            <label>
              Título / pasaje
              <input name="title" required maxLength={200} />
            </label>
            <label>
              Contenido
              <textarea name="content" required maxLength={10000} />
            </label>
            <button className="primary-button" type="submit">
              Añadir a biblioteca
            </button>
          </form>
          <div className="info-box">
            <strong>Regla 1–1–1</strong>
            <span>
              Una verdad, una acción y una oración pueden convertir una sesión breve en una práctica
              valiosa.
            </span>
          </div>
        </article>
      </section>
      <section className="two-column section-block">
        <article className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Historia</p>
              <h2>Estudios recientes</h2>
            </div>
          </div>
          {daily.length ? (
            <div className="record-list">
              {daily.slice(0, 12).map((entry) => (
                <article className="record-card mini" key={entry.id}>
                  <div>
                    <h3>{entry.title || "Estudio bíblico"}</h3>
                    <p>{entry.content}</p>
                    <small>
                      {entry.occurred_on}
                      {metadataValue(entry.metadata, "minutes")
                        ? ` · ${metadataValue(entry.metadata, "minutes")} min`
                        : ""}
                    </small>
                  </div>
                  <form action={deleteJournal}>
                    <input type="hidden" name="id" value={entry.id} />
                    <input type="hidden" name="systemKey" value="bible" />
                    <button className="danger-button" type="submit">
                      Eliminar
                    </button>
                  </form>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState>Guarda tu primer estudio bíblico.</EmptyState>
          )}
        </article>
        <article className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Consulta</p>
              <h2>Biblioteca</h2>
            </div>
            <span>{library.length}</span>
          </div>
          {library.length ? (
            <div className="record-list">
              {library.slice(0, 12).map((entry) => (
                <article className="record-card mini" key={entry.id}>
                  <div>
                    <span className="status active">
                      {metadataValue(entry.metadata, "kind") || "recurso"}
                    </span>
                    <h3>{entry.title}</h3>
                    <p>{entry.content}</p>
                  </div>
                  <form action={deleteJournal}>
                    <input type="hidden" name="id" value={entry.id} />
                    <input type="hidden" name="systemKey" value="bible" />
                    <button className="danger-button" type="submit">
                      Eliminar
                    </button>
                  </form>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState>
              Tu biblioteca está lista para recibir estudios, reflexiones, versículos y oraciones.
            </EmptyState>
          )}
        </article>
      </section>
    </div>
  );
}
