import Link from "next/link";
import { signOut } from "@/app/auth/actions";

const links = [
  ["/", "◈", "Inicio"],
  ["/maestro", "◎", "Centro Maestro"],
  ["/micro-metas", "◇", "Micro Metas"],
  ["/caracter", "◆", "Carácter"],
  ["/camino-biblico", "✦", "Camino Bíblico"],
] as const;

export function AppShell({ children, email }: { children: React.ReactNode; email: string }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link className="wordmark" href="/" aria-label="Ir al inicio">
          <span>M</span>
          <strong>MAESTRO</strong>
        </Link>
        <p className="nav-label">Sistemas</p>
        <nav aria-label="Navegación principal">
          {links.map(([href, icon, label]) => (
            <Link className="nav-item" href={href} key={href}>
              <span aria-hidden="true">{icon}</span>
              {label}
            </Link>
          ))}
        </nav>
        <p className="nav-label account-label">Cuenta</p>
        <nav aria-label="Cuenta">
          <Link className="nav-item" href="/configuracion">
            <span aria-hidden="true">⚙</span>Configuración
          </Link>
          <Link className="nav-item" href="/respaldo">
            <span aria-hidden="true">⇩</span>Respaldo
          </Link>
        </nav>
        <div className="sidebar-user">
          <small title={email}>{email}</small>
          <form action={signOut}>
            <button type="submit">Cerrar sesión</button>
          </form>
        </div>
      </aside>
      <main className="app-main">{children}</main>
    </div>
  );
}
