import {
  createGoal,
  createGoalStep,
  deleteGoal,
  setGoalStatus,
  toggleGoalStep,
} from "@/app/actions";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { requireUser } from "@/lib/auth";
import { getGoals } from "@/lib/repositories/maestro";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Micro Metas" };

export default async function MicroGoalsPage() {
  const user = await requireUser();
  const goals = await getGoals(await createClient(), user.id, "micro_goals");
  const stepCount = goals.reduce((sum, goal) => sum + goal.goal_steps.length, 0);
  const completedSteps = goals.reduce(
    (sum, goal) => sum + goal.goal_steps.filter((step) => step.status === "completed").length,
    0,
  );

  return (
    <div className="page-wrap">
      <PageHeader
        eyebrow="Sistema 02"
        title="Micro Metas"
        description="Convierte una intención grande en acciones pequeñas, visibles y terminables. NIDO permanece fuera de este módulo."
      />
      <section className="metric-grid compact">
        <article className="metric-card">
          <span>Metas activas</span>
          <strong>{goals.filter((g) => g.status === "active").length}</strong>
          <small>ciclos en marcha</small>
        </article>
        <article className="metric-card">
          <span>Acciones</span>
          <strong>{stepCount}</strong>
          <small>pasos definidos</small>
        </article>
        <article className="metric-card">
          <span>Completadas</span>
          <strong>{completedSteps}</strong>
          <small>acciones terminadas</small>
        </article>
      </section>
      <section className="two-column section-block">
        <article className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Nuevo ciclo</p>
              <h2>Crear micro meta</h2>
            </div>
          </div>
          <form className="data-form" action={createGoal}>
            <input type="hidden" name="systemKey" value="micro_goals" />
            <label>
              Meta
              <input name="title" required maxLength={200} placeholder="Un resultado concreto" />
            </label>
            <label>
              Por qué importa
              <textarea name="description" maxLength={2000} />
            </label>
            <div className="form-row">
              <label>
                Prioridad
                <select name="priority" defaultValue="3">
                  <option value="1">Muy baja</option>
                  <option value="2">Baja</option>
                  <option value="3">Media</option>
                  <option value="4">Alta</option>
                  <option value="5">Crítica</option>
                </select>
              </label>
              <label>
                Fecha objetivo
                <input type="date" name="dueOn" />
              </label>
            </div>
            <input type="hidden" name="metricName" value="acciones" />
            <input type="hidden" name="targetValue" value="1" />
            <button className="primary-button" type="submit">
              Crear micro meta
            </button>
          </form>
        </article>
        <article className="panel accent-panel">
          <p className="eyebrow">Método</p>
          <h2>Hazla suficientemente pequeña</h2>
          <p>
            Si una acción no cabe en una sesión breve, todavía es un proyecto. Divide hasta
            encontrar el siguiente movimiento observable.
          </p>
          <ol>
            <li>Define un resultado.</li>
            <li>Añade acciones de menos de una hora.</li>
            <li>Completa, revisa y ajusta.</li>
          </ol>
        </article>
      </section>
      <section className="section-block">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Ciclos activos</p>
            <h2>Metas y acciones</h2>
          </div>
        </div>
        {goals.length ? (
          <div className="goal-board">
            {goals.map((goal) => {
              const done = goal.goal_steps.filter((step) => step.status === "completed").length;
              const pct = goal.goal_steps.length
                ? Math.round((done / goal.goal_steps.length) * 100)
                : 0;
              return (
                <article className="goal-card" key={goal.id}>
                  <div className="goal-top">
                    <span className={`status ${goal.status}`}>{goal.status}</span>
                    <strong>{pct}%</strong>
                  </div>
                  <h3>{goal.title}</h3>
                  <p>{goal.description || "Sin descripción"}</p>
                  <div className="progress-bar">
                    <span style={{ width: `${pct}%` }} />
                  </div>
                  <div className="step-list">
                    {goal.goal_steps.map((step) => (
                      <form action={toggleGoalStep} key={step.id}>
                        <input type="hidden" name="id" value={step.id} />
                        <input
                          type="hidden"
                          name="completed"
                          value={String(step.status === "completed")}
                        />
                        <button
                          className={step.status === "completed" ? "step done" : "step"}
                          type="submit"
                        >
                          <span>{step.status === "completed" ? "✓" : "○"}</span>
                          {step.title}
                        </button>
                      </form>
                    ))}
                  </div>
                  <form className="inline-form" action={createGoalStep}>
                    <input type="hidden" name="goalId" value={goal.id} />
                    <input
                      name="title"
                      required
                      maxLength={200}
                      placeholder="Añadir siguiente acción"
                      aria-label="Nueva acción"
                    />
                    <button type="submit">+</button>
                  </form>
                  <div className="record-actions">
                    <form action={setGoalStatus}>
                      <input type="hidden" name="id" value={goal.id} />
                      <input type="hidden" name="systemKey" value="micro_goals" />
                      <input
                        type="hidden"
                        name="status"
                        value={goal.status === "completed" ? "active" : "completed"}
                      />
                      <button type="submit">
                        {goal.status === "completed" ? "Reabrir" : "Completar meta"}
                      </button>
                    </form>
                    <form action={deleteGoal}>
                      <input type="hidden" name="id" value={goal.id} />
                      <input type="hidden" name="systemKey" value="micro_goals" />
                      <button className="danger-button" type="submit">
                        Eliminar
                      </button>
                    </form>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <EmptyState>
            Aún no tienes micro metas. Crea un ciclo pequeño y empieza con una acción.
          </EmptyState>
        )}
      </section>
    </div>
  );
}
