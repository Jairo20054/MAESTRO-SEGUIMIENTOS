import {
  createGoal,
  createHabit,
  createJournal,
  deleteGoal,
  deleteJournal,
  setGoalStatus,
  toggleHabit,
} from "@/app/actions";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { requireUser } from "@/lib/auth";
import { getCharacterData } from "@/lib/repositories/maestro";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Proyecto Carácter" };

export default async function CharacterPage() {
  const user = await requireUser();
  const data = await getCharacterData(await createClient(), user.id);
  const completedIds = new Set(
    data.logs.filter((log) => log.status === "completed").map((log) => log.habit_id),
  );
  const score = data.habits.length ? Math.round((completedIds.size / data.habits.length) * 100) : 0;
  const books = data.goals.filter((goal) => goal.metric_name === "pages");
  const promises = data.goals.filter((goal) => goal.metric_name === "commitment");

  return (
    <div className="page-wrap">
      <PageHeader
        eyebrow="Sistema 03"
        title="Proyecto Carácter"
        description="Hábitos, lectura, estudio, disciplina digital y compromisos sostenidos con evidencia diaria."
      />
      <section className="character-hero panel">
        <div
          className="score-circle"
          style={{ "--score": `${score * 3.6}deg` } as React.CSSProperties}
        >
          <div>
            <strong>{score}%</strong>
            <span>hoy</span>
          </div>
        </div>
        <div>
          <p className="eyebrow">Día de identidad · {data.today}</p>
          <h2>
            {score >= 80
              ? "Buen trabajo. Cierra con reflexión."
              : "Elige una acción esencial y complétala."}
          </h2>
          <p>La constancia se construye con registros honestos, no con días perfectos.</p>
        </div>
      </section>
      <section className="two-column section-block">
        <article className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Hábitos de hoy</p>
              <h2>Acciones esenciales</h2>
            </div>
          </div>
          <form className="inline-form" action={createHabit}>
            <input
              name="title"
              required
              maxLength={160}
              placeholder="Añadir hábito"
              aria-label="Nombre del hábito"
            />
            <button type="submit">+</button>
          </form>
          <div className="habit-list">
            {data.habits.map((habit) => {
              const completed = completedIds.has(habit.id);
              return (
                <form action={toggleHabit} key={habit.id}>
                  <input type="hidden" name="habitId" value={habit.id} />
                  <input type="hidden" name="occurredOn" value={data.today} />
                  <input type="hidden" name="completed" value={String(completed)} />
                  <button className={completed ? "habit completed" : "habit"} type="submit">
                    <span>{completed ? "✓" : "○"}</span>
                    {habit.title}
                  </button>
                </form>
              );
            })}
          </div>
          {!data.habits.length ? (
            <EmptyState>
              Añade los hábitos que representan la persona que quieres construir.
            </EmptyState>
          ) : null}
        </article>
        <article className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Registro diario</p>
              <h2>Evidencia del día</h2>
            </div>
          </div>
          <form className="data-form" action={createJournal}>
            <input type="hidden" name="systemKey" value="character" />
            <input type="hidden" name="entryType" value="character_daily" />
            <input type="hidden" name="occurredOn" value={data.today} />
            <label>
              Victoria del día
              <input name="title" required maxLength={200} />
            </label>
            <div className="form-row">
              <label>
                Páginas
                <input name="currentPage" type="number" min="0" />
              </label>
              <label>
                Minutos de estudio
                <input name="minutes" type="number" min="0" />
              </label>
            </div>
            <label>
              Reflexión
              <textarea
                name="content"
                required
                maxLength={10000}
                placeholder="Qué funcionó, qué ajustarás mañana"
              />
            </label>
            <button className="primary-button" type="submit">
              Guardar día
            </button>
          </form>
        </article>
      </section>
      <section className="two-column section-block">
        <article className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Biblioteca</p>
              <h2>Lecturas</h2>
            </div>
          </div>
          <form className="data-form compact-form" action={createGoal}>
            <input type="hidden" name="systemKey" value="character" />
            <input type="hidden" name="priority" value="3" />
            <input type="hidden" name="metricName" value="pages" />
            <label>
              Libro
              <input name="title" required maxLength={200} />
            </label>
            <label>
              Autor
              <input name="description" maxLength={2000} />
            </label>
            <label>
              Total de páginas
              <input name="targetValue" type="number" min="1" required />
            </label>
            <button className="primary-button" type="submit">
              Añadir libro
            </button>
          </form>
          <div className="record-list">
            {books.map((book) => (
              <article className="record-card mini" key={book.id}>
                <div>
                  <h3>{book.title}</h3>
                  <p>{book.description || "Autor sin registrar"}</p>
                  <small>
                    {book.current_value ?? 0} / {book.target_value ?? 0} páginas
                  </small>
                </div>
                <form action={deleteGoal}>
                  <input type="hidden" name="id" value={book.id} />
                  <input type="hidden" name="systemKey" value="character" />
                  <button className="danger-button" type="submit">
                    Eliminar
                  </button>
                </form>
              </article>
            ))}
          </div>
        </article>
        <article className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Integridad</p>
              <h2>Compromisos</h2>
            </div>
          </div>
          <form className="data-form compact-form" action={createGoal}>
            <input type="hidden" name="systemKey" value="character" />
            <input type="hidden" name="priority" value="4" />
            <input type="hidden" name="metricName" value="commitment" />
            <input type="hidden" name="targetValue" value="1" />
            <label>
              Promesa
              <input name="title" required maxLength={200} />
            </label>
            <label>
              Persona / contexto
              <input name="description" maxLength={2000} />
            </label>
            <label>
              Fecha
              <input type="date" name="dueOn" />
            </label>
            <button className="primary-button" type="submit">
              Registrar compromiso
            </button>
          </form>
          <div className="record-list">
            {promises.map((promise) => (
              <article className="record-card mini" key={promise.id}>
                <div>
                  <span className={`status ${promise.status}`}>{promise.status}</span>
                  <h3>{promise.title}</h3>
                  <small>{promise.due_on || "Sin fecha"}</small>
                </div>
                <div className="record-actions">
                  <form action={setGoalStatus}>
                    <input type="hidden" name="id" value={promise.id} />
                    <input type="hidden" name="systemKey" value="character" />
                    <input
                      type="hidden"
                      name="status"
                      value={promise.status === "completed" ? "active" : "completed"}
                    />
                    <button type="submit">
                      {promise.status === "completed" ? "Reabrir" : "Cumplir"}
                    </button>
                  </form>
                  <form action={deleteGoal}>
                    <input type="hidden" name="id" value={promise.id} />
                    <input type="hidden" name="systemKey" value="character" />
                    <button className="danger-button" type="submit">
                      Eliminar
                    </button>
                  </form>
                </div>
              </article>
            ))}
          </div>
        </article>
      </section>
      <section className="section-block panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Historial</p>
            <h2>Reflexiones recientes</h2>
          </div>
        </div>
        <div className="record-list">
          {data.journals.slice(0, 10).map((entry) => (
            <article className="record-card mini" key={entry.id}>
              <div>
                <h3>{entry.title || "Reflexión"}</h3>
                <p>{entry.content}</p>
                <small>{entry.occurred_on}</small>
              </div>
              <form action={deleteJournal}>
                <input type="hidden" name="id" value={entry.id} />
                <input type="hidden" name="systemKey" value="character" />
                <button className="danger-button" type="submit">
                  Eliminar
                </button>
              </form>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
