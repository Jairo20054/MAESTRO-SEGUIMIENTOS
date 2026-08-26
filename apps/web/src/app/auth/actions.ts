"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const emailSchema = z.email("Escribe un correo válido.");
const credentialsSchema = z.object({
  email: emailSchema,
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres."),
});

function value(formData: FormData, field: string) {
  const entry = formData.get(field);
  return typeof entry === "string" ? entry : "";
}

function goToLogin(kind: "error" | "notice", message: string): never {
  redirect(`/login?${kind}=${encodeURIComponent(message)}`);
}

async function siteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (configured) return configured;
  return (await headers()).get("origin") ?? "http://localhost:3000";
}

export async function signIn(formData: FormData) {
  const parsed = credentialsSchema.safeParse({
    email: value(formData, "email"),
    password: value(formData, "password"),
  });
  if (!parsed.success) goToLogin("error", parsed.error.issues[0].message);

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) goToLogin("error", "No pudimos iniciar sesión. Revisa tus datos.");
  redirect("/");
}

export async function signUp(formData: FormData) {
  const parsed = credentialsSchema.safeParse({
    email: value(formData, "email"),
    password: value(formData, "password"),
  });
  if (!parsed.success) goToLogin("error", parsed.error.issues[0].message);

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    ...parsed.data,
    options: { emailRedirectTo: `${await siteUrl()}/auth/callback` },
  });
  if (error) goToLogin("error", "No pudimos crear la cuenta.");
  if (data.session) redirect("/");
  goToLogin("notice", "Revisa tu correo para confirmar la cuenta.");
}

export async function requestPasswordReset(formData: FormData) {
  const parsed = emailSchema.safeParse(value(formData, "email"));
  if (!parsed.success) goToLogin("error", parsed.error.issues[0].message);

  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(parsed.data, {
    redirectTo: `${await siteUrl()}/auth/update-password`,
  });
  goToLogin("notice", "Si la cuenta existe, recibirás un enlace de recuperación.");
}

export async function updatePassword(formData: FormData) {
  const parsed = z.string().min(8).safeParse(value(formData, "password"));
  if (!parsed.success) redirect("/auth/update-password?error=La+contraseña+es+muy+corta.");

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data });
  if (error) redirect("/auth/update-password?error=El+enlace+no+es+válido+o+expiró.");
  goToLogin("notice", "Contraseña actualizada. Ya puedes iniciar sesión.");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
