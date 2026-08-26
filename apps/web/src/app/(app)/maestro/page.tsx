import { createGoal, createSession, deleteGoal, setGoalStatus } from "@/app/actions";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { requireUser } from "@/lib/auth";
import { getGoals, getSessions } from "@/lib/repositories/maestro";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Centro Maestro" };

export default async function MaestroPage() {
  const user = await requireUser();
  const supabase = await createClient();
  const [goals, sessions] = await Promise.all([
    getGoals(supabase, user.id, "maestro"),
    getSessions(supabase, user.id, "maestro"),
  ]);
  const minutes = Math.round(
    sessions.reduce((sum, session) => sum + (session.duration_seconds ?? 0), 0) / 60,
  );

  return (
    <div className="page-wrap">
      <PageHeader
        eyebrow="Sistema 01"
        title="Centro Maestro"
        description="Define prioridades, registra enfoque y revisa el avance sin separar tu historia en distintos navegadores."
      />
      <section className="metric-grid compact">
        <article className="metric-card">
          <span>Metas activas</span>
          <strong>{goals.filter((g) => g.status === "active").length}</strong>
          <small>prioridades abiertas</small>
        </article>
        <article className="metric-card">
          <span>Completadas</span>
          <strong>{goals.filter((g) => g.status === "completed").length}</strong>
          <small>resultados cerrados</small>
        </article>
        <article className="metric-card">
          <span>Tiempo total</span>
          <strong>{minutes}</strong>
          <small>minutos guardados</small>
        </article>
      </section>
      <section className="two-column section-block">
        <article className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Dirección</p>
              <h2>Nueva meta</h2>
            </div>
          </div>
          <form className="data-form" action={createGoal}>
            <input type="hidden" name="systemKey" value="maestro" />
            <input type="hidden" name="priority" value="3" />
            <label>
              Título
              <input
                name="title"
                maxLength={200}
                required
                placeholder="Ej. Completar módulo de inglés"
              />
            </label>
            <label>
              Descripción
              <textarea
                name="description"
                maxLength={2000}
                placeholder="Resultado esperado y siguiente paso"
              />
            </label>
            <div className="form-row">
              <label>
                Fecha objetivo
                <input type="date" name="dueOn" />
              </label>
              <label>
                Meta numérica
                <input type="number" min="0" name="targetValue" />
              </label>
            </div>
            <input type="hidden" name="metricName" value="progreso" />
            <button className="primary-button" type="submit">
              Guardar meta
            </button>
          </form>
        </article>
        <article className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Temporizador compartido</p>
              <h2>Registrar sesión</h2>
            </div>
          </div>
          <form className="data-form" action={createSession}>
            <input type="hidden" name="systemKey" value="maestro" />
            <label>
              Actividad
              <input name="title" required maxLength={160} placeholder="¿En qué trabajaste?" />
            </label>
            <label>
              Minutos
              <input name="minutes" type="number" min="1" max="1440" defaultValue="25" required />
            </label>
            <button className="primary-button" type="submit">
              Guardar sesión terminada
            </button>
          </form>
          <p className="form-hint">Cada sesión alimenta el resumen semanal del inicio.</p>
        </article>
      </section>
      <section className="section-block panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Seguimiento</p>
            <h2>Metas del Centro</h2>
          </div>
          <span>{goals.length} registros</span>
        </div>
        {goals.length ? (
          <div className="record-list">
            {goals.map((goal) => (
              <article className="record-card" key={goal.id}>
                <div>
                  <span className={`status ${goal.status}`}>{goal.status}</span>
                  <h3>{goal.title}</h3>
                  <p>{goal.description || "Sin descripción"}</p>
                  <small>
                    {goal.due_on ? `Fecha objetivo: ${goal.due_on}` : "Sin fecha límite"}
                  </small>
                </div>
                <div className="record-actions">
                  <form action={setGoalStatus}>
                    <input type="hidden" name="id" value={goal.id} />
                    <input type="hidden" name="systemKey" value="maestro" />
                    <input
                      type="hidden"
                      name="status"
                      value={goal.status === "completed" ? "active" : "completed"}
                    />
                    <button type="submit">
                      {goal.status === "completed" ? "Reabrir" : "Completar"}
                    </button>
                  </form>
                  <form action={deleteGoal}>
                    <input type="hidden" name="id" value={goal.id} />
                    <input type="hidden" name="systemKey" value="maestro" />
                    <button className="danger-button" type="submit">
                      Eliminar
                    </button>
                  </form>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState>Crea tu primera meta para comenzar.</EmptyState>
        )}
      </section>
    </div>
  );
}
