import "server-only";

import type { Database } from "@maestro/database";
import type { SupabaseClient } from "@supabase/supabase-js";

type Client = SupabaseClient<Database>;

export async function getDashboardData(client: Client, userId: string) {
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 6);
  const since = weekStart.toISOString();

  const [goals, sessions, journals, habits, profile] = await Promise.all([
    client
      .from("goals")
      .select("id,title,status,system_key,current_value,target_value,updated_at")
      .eq("user_id", userId)
      .is("archived_at", null)
      .order("updated_at", { ascending: false }),
    client
      .from("focus_sessions")
      .select("id,title,system_key,duration_seconds,started_at,status")
      .eq("user_id", userId)
      .gte("started_at", since)
      .order("started_at", { ascending: false }),
    client
      .from("journal_entries")
      .select("id,title,system_key,entry_type,occurred_on,created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(8),
    client
      .from("habits")
      .select("id,title,system_key,active")
      .eq("user_id", userId)
      .eq("active", true),
    client.from("profiles").select("display_name,timezone").eq("id", userId).maybeSingle(),
  ]);

  const error = goals.error ?? sessions.error ?? journals.error ?? habits.error ?? profile.error;
  if (error) throw error;

  return {
    goals: goals.data ?? [],
    sessions: sessions.data ?? [],
    journals: journals.data ?? [],
    habits: habits.data ?? [],
    profile: profile.data,
  };
}

export async function getGoals(client: Client, userId: string, systemKey: string) {
  const { data, error } = await client
    .from("goals")
    .select("*,goal_steps(*)")
    .eq("user_id", userId)
    .eq("system_key", systemKey)
    .is("archived_at", null)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getSessions(client: Client, userId: string, systemKey?: string) {
  let query = client
    .from("focus_sessions")
    .select("*")
    .eq("user_id", userId)
    .order("started_at", { ascending: false })
    .limit(20);
  if (systemKey) query = query.eq("system_key", systemKey);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function getJournals(
  client: Client,
  userId: string,
  systemKey: string,
  entryType?: string,
) {
  let query = client
    .from("journal_entries")
    .select("*")
    .eq("user_id", userId)
    .eq("system_key", systemKey)
    .order("occurred_on", { ascending: false });
  if (entryType) query = query.eq("entry_type", entryType);
  const { data, error } = await query.limit(100);
  if (error) throw error;
  return data ?? [];
}

export async function getCharacterData(client: Client, userId: string) {
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Bogota" }).format(new Date());
  const [habits, logs, goals, journals] = await Promise.all([
    client
      .from("habits")
      .select("*")
      .eq("user_id", userId)
      .eq("system_key", "character")
      .is("archived_at", null)
      .order("created_at"),
    client.from("habit_logs").select("*").eq("user_id", userId).eq("occurred_on", today),
    getGoals(client, userId, "character"),
    getJournals(client, userId, "character"),
  ]);
  const error = habits.error ?? logs.error;
  if (error) throw error;
  return { today, habits: habits.data ?? [], logs: logs.data ?? [], goals, journals };
}
