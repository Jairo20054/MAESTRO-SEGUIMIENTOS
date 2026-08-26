import { AppShell } from "@/components/app-shell";
import { requireUser } from "@/lib/auth";

export default async function ProtectedLayout({ children }: LayoutProps<"/">) {
  const user = await requireUser();
  return (
    <AppShell label={user.is_anonymous ? "Datos de este navegador" : (user.email ?? "Maestro")}>
      {children}
    </AppShell>
  );
}
