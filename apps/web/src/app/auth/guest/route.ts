import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) return NextResponse.redirect(new URL("/", request.url));

  const { error } = await supabase.auth.signInAnonymously();
  if (error) {
    const reason = error.code === "anonymous_provider_disabled" ? "provider" : "service";
    return NextResponse.redirect(new URL(`/sin-acceso?reason=${reason}`, request.url));
  }

  return NextResponse.redirect(new URL("/", request.url));
}
