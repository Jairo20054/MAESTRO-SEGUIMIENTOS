import Link from "next/link";

export const metadata = { title: "Activar acceso automático" };

export default async function NoAccessPage({ searchParams }: PageProps<"/sin-acceso">) {
  const params = await searchParams;
  const providerDisabled = params.reason === "provider";

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <div className="auth-brand" aria-hidden="true">
          M
        </div>
        <p className="eyebrow">Acceso sin cuenta</p>
        <h1>{providerDisabled ? "Falta activar una opción" : "No pudimos abrir Maestro"}</h1>
        <p className="auth-copy">
          {providerDisabled
            ? "En Supabase abre Authentication → Providers → Anonymous Sign-Ins y actívalo. No necesitas configurar correo ni contraseña."
            : "Supabase no pudo crear la sesión automática. Intenta nuevamente en unos segundos."}
        </p>
        <div className="auth-actions single-action">
          {providerDisabled ? (
            <a
              className="auth-action-link"
              href="https://supabase.com/dashboard/project/cmhjtunltkitethifgyv/auth/providers"
              target="_blank"
              rel="noreferrer"
            >
              Abrir configuración de Supabase
            </a>
          ) : null}
          <Link className="auth-action-link secondary" href="/auth/guest">
            Intentar de nuevo
          </Link>
        </div>
      </section>
    </main>
  );
}
