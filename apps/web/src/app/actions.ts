"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

const systemSchema = z.enum([
  "maestro",
  "micro_goals",
  "character",
  "bible",
  "finance",
  "learning",
  "nido",
]);
const idSchema = z.uuid();
const text = (max: number) => z.string().trim().min(1).max(max);

function field(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

function optional(formData: FormData, name: string) {
  const value = field(formData, name).trim();
  return value || null;
}

function pathFor(system: z.infer<typeof systemSchema>) {
  return {
    maestro: "/maestro",
    micro_goals: "/micro-metas",
    character: "/caracter",
    bible: "/camino-biblico",
    finance: "/",
    learning: "/",
    nido: "/",
  }[system];
}

export async function createGoal(formData: FormData) {
  const user = await requireUser();
  const parsed = z
    .object({
      title: text(200),
      description: z.string().trim().max(2_000).nullable(),
      systemKey: systemSchema,
      priority: z.coerce.number().int().min(1).max(5),
      dueOn: z.iso.date().nullable(),
      metricName: z.string().trim().max(60).nullable(),
      targetValue: z.coerce.number().nonnegative().nullable(),
    })
    .parse({
      title: field(formData, "title"),
      description: optional(formData, "description"),
      systemKey: field(formData, "systemKey"),
      priority: field(formData, "priority") || "3",
      dueOn: optional(formData, "dueOn"),
      metricName: optional(formData, "metricName"),
      targetValue: optional(formData, "targetValue"),
    });
  const supabase = await createClient();
  const { error } = await supabase.from("goals").insert({
    user_id: user.id,
    title: parsed.title,
    description: parsed.description,
    system_key: parsed.systemKey,
    priority: parsed.priority,
    due_on: parsed.dueOn,
    metric_name: parsed.metricName,
    target_value: parsed.targetValue,
    current_value: 0,
    operation_id: crypto.randomUUID(),
  });
  if (error) throw new Error("No se pudo guardar la meta.");
  revalidatePath(pathFor(parsed.systemKey));
  revalidatePath("/");
}

export async function setGoalStatus(formData: FormData) {
  const user = await requireUser();
  const id = idSchema.parse(field(formData, "id"));
  const status = z
    .enum(["active", "paused", "completed", "cancelled"])
    .parse(field(formData, "status"));
  const systemKey = systemSchema.parse(field(formData, "systemKey"));
  const supabase = await createClient();
  const { error } = await supabase
    .from("goals")
    .update({ status, completed_at: status === "completed" ? new Date().toISOString() : null })
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) throw new Error("No se pudo actualizar la meta.");
  revalidatePath(pathFor(systemKey));
  revalidatePath("/");
}

export async function deleteGoal(formData: FormData) {
  const user = await requireUser();
  const id = idSchema.parse(field(formData, "id"));
  const systemKey = systemSchema.parse(field(formData, "systemKey"));
  const supabase = await createClient();
  const { error } = await supabase.from("goals").delete().eq("id", id).eq("user_id", user.id);
  if (error) throw new Error("No se pudo eliminar la meta.");
  revalidatePath(pathFor(systemKey));
  revalidatePath("/");
}

export async function createGoalStep(formData: FormData) {
  const user = await requireUser();
  const goalId = idSchema.parse(field(formData, "goalId"));
  const title = text(200).parse(field(formData, "title"));
  const supabase = await createClient();
  const { error } = await supabase.from("goal_steps").insert({
    user_id: user.id,
    goal_id: goalId,
    title,
    operation_id: crypto.randomUUID(),
  });
  if (error) throw new Error("No se pudo guardar la acción.");
  revalidatePath("/micro-metas");
}

export async function toggleGoalStep(formData: FormData) {
  const user = await requireUser();
  const id = idSchema.parse(field(formData, "id"));
  const completed = field(formData, "completed") === "true";
  const supabase = await createClient();
  const { error } = await supabase
    .from("goal_steps")
    .update({
      status: completed ? "pending" : "completed",
      completed_at: completed ? null : new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) throw new Error("No se pudo actualizar la acción.");
  revalidatePath("/micro-metas");
  revalidatePath("/");
}

export async function createSession(formData: FormData) {
  const user = await requireUser();
  const parsed = z
    .object({
      systemKey: systemSchema,
      minutes: z.coerce.number().int().min(1).max(1_440),
      title: text(160),
    })
    .parse({
      systemKey: field(formData, "systemKey"),
      minutes: field(formData, "minutes"),
      title: field(formData, "title"),
    });
  const endedAt = new Date();
  const startedAt = new Date(endedAt.getTime() - parsed.minutes * 60_000);
  const supabase = await createClient();
  const { error } = await supabase.from("focus_sessions").insert({
    user_id: user.id,
    system_key: parsed.systemKey,
    session_type: "focus",
    title: parsed.title,
    started_at: startedAt.toISOString(),
    ended_at: endedAt.toISOString(),
    duration_seconds: parsed.minutes * 60,
    status: "completed",
    operation_id: crypto.randomUUID(),
  });
  if (error) throw new Error("No se pudo guardar la sesión.");
  revalidatePath(pathFor(parsed.systemKey));
  revalidatePath("/");
}

export async function createJournal(formData: FormData) {
  const user = await requireUser();
  const parsed = z
    .object({
      systemKey: systemSchema,
      entryType: text(60),
      occurredOn: z.iso.date(),
      title: z.string().trim().max(200).nullable(),
      content: text(10_000),
    })
    .parse({
      systemKey: field(formData, "systemKey"),
      entryType: field(formData, "entryType"),
      occurredOn: field(formData, "occurredOn"),
      title: optional(formData, "title"),
      content: field(formData, "content"),
    });
  const metadataEntries = [
    "minutes",
    "mood",
    "observation",
    "application",
    "prayer",
    "gratitude",
    "kind",
    "author",
    "currentPage",
    "totalPages",
  ]
    .map((key) => [key, optional(formData, key)] as const)
    .filter(([, value]) => value !== null);
  const supabase = await createClient();
  const { error } = await supabase.from("journal_entries").insert({
    user_id: user.id,
    system_key: parsed.systemKey,
    entry_type: parsed.entryType,
    occurred_on: parsed.occurredOn,
    title: parsed.title,
    content: parsed.content,
    metadata: Object.fromEntries(metadataEntries),
    operation_id: crypto.randomUUID(),
  });
  if (error) throw new Error("No se pudo guardar el registro.");
  revalidatePath(pathFor(parsed.systemKey));
  revalidatePath("/");
}

export async function deleteJournal(formData: FormData) {
  const user = await requireUser();
  const id = idSchema.parse(field(formData, "id"));
  const systemKey = systemSchema.parse(field(formData, "systemKey"));
  const supabase = await createClient();
  const { error } = await supabase
    .from("journal_entries")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) throw new Error("No se pudo eliminar el registro.");
  revalidatePath(pathFor(systemKey));
  revalidatePath("/");
}

export async function createHabit(formData: FormData) {
  const user = await requireUser();
  const title = text(160).parse(field(formData, "title"));
  const supabase = await createClient();
  const { error } = await supabase
    .from("habits")
    .insert({ user_id: user.id, system_key: "character", title });
  if (error) throw new Error("No se pudo crear el hábito.");
  revalidatePath("/caracter");
}

export async function toggleHabit(formData: FormData) {
  const user = await requireUser();
  const habitId = idSchema.parse(field(formData, "habitId"));
  const occurredOn = z.iso.date().parse(field(formData, "occurredOn"));
  const completed = field(formData, "completed") === "true";
  const supabase = await createClient();
  if (completed) {
    const { error } = await supabase
      .from("habit_logs")
      .delete()
      .eq("user_id", user.id)
      .eq("habit_id", habitId)
      .eq("occurred_on", occurredOn);
    if (error) throw new Error("No se pudo actualizar el hábito.");
  } else {
    const { error } = await supabase.from("habit_logs").upsert(
      {
        user_id: user.id,
        habit_id: habitId,
        occurred_on: occurredOn,
        status: "completed",
        operation_id: crypto.randomUUID(),
      },
      { onConflict: "user_id,habit_id,occurred_on,occurrence_index" },
    );
    if (error) throw new Error("No se pudo actualizar el hábito.");
  }
  revalidatePath("/caracter");
  revalidatePath("/");
}

export async function updateProfile(formData: FormData) {
  const user = await requireUser();
  const parsed = z.object({ displayName: text(120), timezone: text(80) }).parse({
    displayName: field(formData, "displayName"),
    timezone: field(formData, "timezone"),
  });
  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .upsert({ id: user.id, display_name: parsed.displayName, timezone: parsed.timezone });
  if (error) throw new Error("No se pudo actualizar el perfil.");
  revalidatePath("/configuracion");
  revalidatePath("/");
}
