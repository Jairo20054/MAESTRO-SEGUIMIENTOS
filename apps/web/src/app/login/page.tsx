import { requestPasswordReset, signIn, signUp } from "../auth/actions";
import Link from "next/link";

export const metadata = { title: "Acceso" };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const params = await searchParams;
  const error = typeof params.error === "string" ? params.error : null;
  const notice = typeof params.notice === "string" ? params.notice : null;

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <Link className="auth-brand" href="/" aria-label="Volver a Maestro">
          M
        </Link>
        <p className="eyebrow">Tu progreso, sincronizado</p>
        <h1>Entrar a Maestro</h1>
        <p className="auth-copy">La cuenta es exclusiva de MAESTRO y no se conecta con NIDO.</p>
        {error && <p className="auth-message error">{error}</p>}
        {notice && <p className="auth-message success">{notice}</p>}

        <form className="auth-form">
          <label htmlFor="email">Correo</label>
          <input id="email" name="email" type="email" required autoComplete="email" />
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            name="password"
            type="password"
            minLength={8}
            required
            autoComplete="current-password"
          />
          <div className="auth-actions">
            <button formAction={signIn}>Entrar</button>
            <button className="secondary" formAction={signUp}>
              Crear cuenta
            </button>
          </div>
          <button className="text-button" formAction={requestPasswordReset} formNoValidate>
            Recuperar contraseña
          </button>
        </form>
      </section>
    </main>
  );
}
