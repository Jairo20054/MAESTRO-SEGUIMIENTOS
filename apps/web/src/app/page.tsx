import { calculateMaestroScore } from "@maestro/core";

const todayItems = [
  { time: "06:30", title: "Lectura y reflexión", meta: "Crecimiento · 25 min", state: "Lista" },
  { time: "09:00", title: "Inglés: conversación", meta: "Idiomas · 40 min", state: "Siguiente" },
  { time: "14:30", title: "Bloque de creación", meta: "NIDO · 90 min", state: "Después" },
] as const;

const systems = [
  {
    title: "Centro Maestro",
    description: "Tu punto de partida para revisar prioridades, ritmo y enfoque.",
    href: "/sistemas/maestro.html",
    icon: "M",
    tone: "green",
  },
  {
    title: "Proyecto Carácter y Cultura",
    description: "Decisiones diarias para vivir tus valores con intención.",
    href: "/sistemas/cultura.html",
    icon: "C",
    tone: "amber",
  },
  {
    title: "Micro Metas",
    description: "Pequeños pasos claros que convierten tus metas en acción.",
    href: "/sistemas/micro-metas.html",
    icon: "µ",
    tone: "blue",
  },
  {
    title: "Camino Bíblico",
    description: "Lectura, reflexión y aplicación para caminar con propósito.",
    href: "/sistemas/camino-biblico.html",
    icon: "✦",
    tone: "green",
  },
  {
    title: "Neurociencia práctica",
    description: "Herramientas sencillas para enfocar, aprender y descansar mejor.",
    href: "/sistemas/neurociencia.html",
    icon: "N",
    tone: "purple",
  },
  {
    title: "Neurociencia 2",
    description: "Profundiza en hábitos, emoción y toma de decisiones.",
    href: "/sistemas/neurociencia-2.html",
    icon: "N2",
    tone: "rose",
  },
] as const;

const score = calculateMaestroScore(
  [
    { key: "habits", label: "Hábitos", score: 82 },
    { key: "sessions", label: "Aprendizaje", score: 76 },
    { key: "goals", label: "Metas", score: 68 },
    { key: "consistency", label: "Consistencia", score: 91 },
  ],
  [
    { key: "habits", weight: 35 },
    { key: "sessions", weight: 25 },
    { key: "goals", weight: 25 },
    { key: "consistency", weight: 15 },
  ],
);

export default function Home() {
  return (
    <div className="app-frame">
      <aside className="rail" aria-label="Navegación principal">
        <a className="brand" href="#hoy" aria-label="Maestro, ir a Hoy">
          M
        </a>
        <nav className="rail-nav">
          <a className="rail-link active" href="#hoy">
            <span aria-hidden="true">◉</span>
            <span>Hoy</span>
          </a>
          <a className="rail-link" href="#progreso">
            <span aria-hidden="true">↗</span>
            <span>Progreso</span>
          </a>
          <a className="rail-link" href="#sistemas">
            <span aria-hidden="true">▦</span>
            <span>Sistemas</span>
          </a>
          <a className="rail-link" href="#metas">
            <span aria-hidden="true">◇</span>
            <span>Metas</span>
          </a>
        </nav>
        <a className="profile-link" href="#perfil" aria-label="Abrir perfil">
          AC
        </a>
      </aside>

      <main id="hoy" className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Miércoles, 26 de agosto</p>
            <h1>Tu día, con intención.</h1>
          </div>
          <div className="sync-state">
            <span aria-hidden="true" />
            Guardado localmente
          </div>
        </header>

        <section className="hero-grid" aria-label="Resumen del día">
          <article className="focus-card">
            <div className="card-heading">
              <div>
                <p className="eyebrow">Enfoque de hoy</p>
                <h2>Avanzar con calma</h2>
              </div>
              <span className="day-chip">Día 47</span>
            </div>
            <p className="focus-copy">
              Completa lo esencial. Cada bloque terminado alimenta un sistema de progreso que podrás
              revisar, entender y mejorar.
            </p>
            <div className="progress-track" aria-label="Progreso diario: 62%">
              <span style={{ width: "62%" }} />
            </div>
            <div className="progress-meta">
              <strong>5 de 8</strong>
              <span>acciones esenciales</span>
            </div>
          </article>

          <article id="progreso" className="score-card">
            <div
              className="score-ring"
              style={{ "--score": `${score.total * 3.6}deg` } as React.CSSProperties}
            >
              <div>
                <strong>{score.total}</strong>
                <span>/ 100</span>
              </div>
            </div>
            <div>
              <p className="eyebrow">Maestro Score</p>
              <h2>Ritmo sólido</h2>
              <p>+4 puntos esta semana</p>
            </div>
          </article>
        </section>

        <section id="sistemas" className="systems-section" aria-labelledby="systems-heading">
          <div className="section-title">
            <div>
              <p className="eyebrow">Centro de sistemas</p>
              <h2 id="systems-heading">Tus sistemas</h2>
            </div>
            <span>6 espacios para avanzar</span>
          </div>
          <div className="systems-grid">
            {systems.map((system) => (
              <a className="system-tab" href={system.href} key={system.href}>
                <span className={`system-tab-icon ${system.tone}`} aria-hidden="true">
                  {system.icon}
                </span>
                <span>
                  <strong>{system.title}</strong>
                  <small>{system.description}</small>
                </span>
                <span className="system-tab-arrow" aria-hidden="true">→</span>
              </a>
            ))}
          </div>
        </section>

        <section className="content-grid">
          <div>
            <div className="section-title">
              <div>
                <p className="eyebrow">Agenda esencial</p>
                <h2>Lo que sigue</h2>
              </div>
              <span>3 bloques</span>
            </div>
            <div className="timeline">
              {todayItems.map((item, index) => (
                <article className="timeline-item" key={item.time}>
                  <time>{item.time}</time>
                  <div className="timeline-marker" aria-hidden="true">
                    <span />
                    {index < todayItems.length - 1 && <i />}
                  </div>
                  <div className="timeline-card">
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.meta}</p>
                    </div>
                    <span>{item.state}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="side-panel" aria-label="Sistemas activos">
            <div className="section-title">
              <div>
                <p className="eyebrow">Vista rápida</p>
                <h2>Sistemas</h2>
              </div>
            </div>
            <a className="system-row" href="#aprendizaje">
              <span className="system-icon amber">Aa</span>
              <span>
                <strong>Aprendizaje</strong>
                <small>4 rutas activas</small>
              </span>
              <b>72%</b>
            </a>
            <a className="system-row" href="#habitos">
              <span className="system-icon green">✓</span>
              <span>
                <strong>Hábitos</strong>
                <small>12 días de racha</small>
              </span>
              <b>86%</b>
            </a>
            <a className="system-row" href="#nido">
              <span className="system-icon blue">N</span>
              <span>
                <strong>NIDO</strong>
                <small>Ciclo 2 de 10</small>
              </span>
              <b>20%</b>
            </a>
            <div id="metas" className="quote-card">
              <p>“No busques hacer más. Busca que lo importante tenga un lugar claro.”</p>
              <span>Reflexión de hoy</span>
            </div>
          </aside>
        </section>

        <footer id="perfil">
          <span>Maestro v0.1 · Fundación local-first</span>
          <span>Los datos privados aún no salen de este dispositivo.</span>
        </footer>
      </main>
    </div>
  );
}
