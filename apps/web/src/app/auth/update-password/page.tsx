import { updatePassword } from "../actions";
import Link from "next/link";

export default async function UpdatePasswordPage({
  searchParams,
}: PageProps<"/auth/update-password">) {
  const params = await searchParams;

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <Link className="auth-brand" href="/">
          M
        </Link>
        <p className="eyebrow">Cuenta Maestro</p>
        <h1>Nueva contraseña</h1>
        {typeof params.error === "string" && <p className="auth-message error">{params.error}</p>}
        <form action={updatePassword} className="auth-form">
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            name="password"
            type="password"
            minLength={8}
            required
            autoComplete="new-password"
          />
          <button type="submit">Guardar contraseña</button>
        </form>
      </section>
    </main>
  );
}
