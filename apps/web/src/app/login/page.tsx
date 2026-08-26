import { redirect } from "next/navigation";

export const metadata = { title: "Acceso" };

export default function LoginPage() {
  redirect("/auth/guest");
}
