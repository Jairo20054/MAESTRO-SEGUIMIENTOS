import { AppShell } from "@/components/app-shell";
import { requireUser } from "@/lib/auth";

export default async function ProtectedLayout({ children }: LayoutProps<"/">) {
  const user = await requireUser();
  return <AppShell email={user.email ?? "Cuenta Maestro"}>{children}</AppShell>;
}
