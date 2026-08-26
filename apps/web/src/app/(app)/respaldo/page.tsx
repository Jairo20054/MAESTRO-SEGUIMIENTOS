import { LegacyMigration } from "@/components/legacy-migration";
import { PageHeader } from "@/components/page-header";

export const metadata = { title: "Respaldo y migración" };

export default function BackupPage() {
  return (
    <div className="page-wrap narrow-page">
      <PageHeader
        eyebrow="Cuenta"
        title="Respaldo y migración"
        description="Detecta datos históricos sin borrarlos y conserva una copia antes de transformar cualquier registro."
      />
      <LegacyMigration />
      <section className="panel section-block">
        <p className="eyebrow">Fuente de verdad</p>
        <h2>Supabase PostgreSQL</h2>
        <p className="page-description">
          Los módulos nuevos leen y escriben en tu cuenta. El almacenamiento local se reserva para
          recuperación temporal y tolerancia offline; nunca contiene contraseñas, tokens ni claves
          privadas.
        </p>
      </section>
    </div>
  );
}
