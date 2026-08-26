import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { requireUser } from "@/lib/auth";
import { getDashboardData } from "@/lib/repositories/maestro";
import { createClient } from "@/lib/supabase/server";

const systems = [
  {
    key: "maestro",
    href: "/maestro",
    icon: "◎",
    name: "Centro Maestro",
    copy: "Metas, sesiones y dirección semanal",
  },
  {
    key: "micro_goals",
    href: "/micro-metas",
    icon: "◇",
    name: "Micro Metas",
    copy: "Avances pequeños con acciones claras",
  },
  {
    key: "character",
    href: "/caracter",
    icon: "◆",
    name: "Proyecto Carácter",
    copy: "Hábitos, lectura y compromisos",
  },
  {
    key: "bible",
    href: "/camino-biblico",
    icon: "✦",
    name: "Camino Bíblico",
    copy: "Estudio, reflexión y aplicación",
  },
] as const;

function progress(
  goals: { status: string; current_value: number | null; target_value: number | null }[],
) {
  if (!goals.length) return 0;
  const values = goals.map((goal) =>
    goal.status === "completed"
      ? 100
      : goal.target_value && goal.current_value !== null
        ? Math.min(100, Math.round((goal.current_value / goal.target_value) * 100))
        : 0,
  );
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

export default async function DashboardPage() {
  const user = await requireUser();
  const supabase = await createClient();
  const data = await getDashboardData(supabase, user.id);
  const totalMinutes = Math.round(
    data.sessions.reduce((sum, session) => sum + (session.duration_seconds ?? 0), 0) / 60,
  );
  const completed = data.goals.filter((goal) => goal.status === "completed").length;
  const displayName = data.profile?.display_name || user.email?.split("@")[0] || "Maestro";
  const hour = Number(
    new Intl.DateTimeFormat("es-CO", {
      hour: "numeric",
      hour12: false,
      timeZone: data.profile?.timezone ?? "America/Bogota",
    }).format(new Date()),
  );
  const greeting = hour < 12 ? "Buenos días" : hour < 19 ? "Buenas tardes" : "Buenas noches";

  return (
    <div className="page-wrap">
      <PageHeader
        eyebrow="MAESTRO · SEGUIMIENTOS"
        title={`${greeting}, ${displayName}`}
        description="Tu progreso real, reunido en un solo lugar."
      />
      <section className="metric-grid" aria-label="Resumen">
        <article className="metric-card">
          <span>Progreso global</span>
          <strong>{progress(data.goals)}%</strong>
          <small>promedio de metas</small>
        </article>
        <article className="metric-card">
          <span>Tiempo esta semana</span>
          <strong>{totalMinutes}</strong>
          <small>minutos registrados</small>
        </article>
        <article className="metric-card">
          <span>Acciones completadas</span>
          <strong>{completed}</strong>
          <small>metas terminadas</small>
        </article>
        <article className="metric-card">
          <span>Hábitos activos</span>
          <strong>{data.habits.length}</strong>
          <small>en todos los sistemas</small>
        </article>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Mis sistemas</p>
            <h2>Continúa donde importa</h2>
          </div>
        </div>
        <div className="system-grid">
          {systems.map((system) => {
            const goals = data.goals.filter((goal) => goal.system_key === system.key);
            return (
              <Link className="system-card" href={system.href} key={system.key}>
                <span className="module-icon">{system.icon}</span>
                <div>
                  <h3>{system.name}</h3>
                  <p>{system.copy}</p>
                </div>
                <strong>{progress(goals)}%</strong>
                <span className="open-label">Abrir →</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="two-column section-block">
        <article className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Actividad reciente</p>
              <h2>Últimos registros</h2>
            </div>
          </div>
          {data.journals.length ? (
            <div className="activity-list">
              {data.journals.map((item) => (
                <div className="activity-item" key={item.id}>
                  <span>✓</span>
                  <div>
                    <strong>{item.title || item.entry_type}</strong>
                    <small>
                      {item.system_key} · {item.occurred_on}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState>
              Aún no hay actividad. Abre un sistema y guarda tu primer registro.
            </EmptyState>
          )}
        </article>
        <article className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Metas activas</p>
              <h2>Próximo movimiento</h2>
            </div>
          </div>
          {data.goals
            .filter((goal) => goal.status === "active")
            .slice(0, 5)
            .map((goal) => (
              <div className="goal-line" key={goal.id}>
                <div>
                  <strong>{goal.title}</strong>
                  <small>{goal.system_key}</small>
                </div>
                <span>→</span>
              </div>
            ))}
          {!data.goals.some((goal) => goal.status === "active") ? (
            <EmptyState>No tienes metas activas.</EmptyState>
          ) : null}
        </article>
      </section>
    </div>
  );
}
