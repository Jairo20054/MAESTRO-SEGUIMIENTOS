import { updateProfile } from "@/app/actions";
import { signOut } from "@/app/auth/actions";
import { PageHeader } from "@/components/page-header";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Configuración" };

export default async function SettingsPage() {
  const user = await requireUser();
  const { data: profile } = await (
    await createClient()
  )
    .from("profiles")
    .select("display_name,timezone,locale")
    .eq("id", user.id)
    .maybeSingle();
  return (
    <div className="page-wrap narrow-page">
      <PageHeader
        eyebrow="Cuenta"
        title="Configuración"
        description="Perfil, zona horaria, preferencias y acceso a tus datos."
      />
      <section className="panel section-block">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Perfil</p>
            <h2>Información personal</h2>
          </div>
        </div>
        <form className="data-form" action={updateProfile}>
          <label>
            Nombre visible
            <input
              name="displayName"
              required
              maxLength={120}
              defaultValue={profile?.display_name ?? user.email?.split("@")[0] ?? ""}
            />
          </label>
          <label>
            Correo
            <input value={user.email ?? ""} disabled aria-label="Correo de la cuenta" />
          </label>
          <label>
            Zona horaria
            <select name="timezone" defaultValue={profile?.timezone ?? "America/Bogota"}>
              <option value="America/Bogota">Bogotá (America/Bogota)</option>
              <option value="America/Mexico_City">Ciudad de México</option>
              <option value="America/New_York">Nueva York</option>
              <option value="Europe/Madrid">Madrid</option>
              <option value="UTC">UTC</option>
            </select>
          </label>
          <button className="primary-button" type="submit">
            Guardar perfil
          </button>
        </form>
      </section>
      <section className="panel danger-zone">
        <div>
          <p className="eyebrow">Sesión</p>
          <h2>Cerrar sesión</h2>
          <p>Los datos permanecen en Supabase y volverán a aparecer al iniciar sesión.</p>
        </div>
        <form action={signOut}>
          <button className="danger-button" type="submit">
            Cerrar sesión
          </button>
        </form>
      </section>
    </div>
  );
}
