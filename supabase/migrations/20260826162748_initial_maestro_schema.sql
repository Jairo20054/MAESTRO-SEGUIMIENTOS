-- Remote migration version: 20260826162748.
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create or replace function private.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  timezone text not null default 'America/Bogota',
  locale text not null default 'es-CO',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_settings (
  user_id uuid not null references auth.users(id) on delete cascade,
  namespace text not null,
  value jsonb not null default '{}'::jsonb,
  revision bigint not null default 0 check (revision >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, namespace),
  constraint user_settings_namespace_format check (namespace ~ '^[a-z][a-z0-9_.-]{1,63}$')
);

create table public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  system_key text not null default 'maestro' check (system_key in ('maestro', 'micro_goals', 'character', 'bible', 'finance', 'learning', 'nido')),
  title text not null check (char_length(btrim(title)) between 1 and 160),
  description text,
  category text,
  unit text,
  target_value numeric check (target_value is null or target_value >= 0),
  priority smallint not null default 3 check (priority between 1 and 5),
  color text,
  icon text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz,
  unique (id, user_id)
);

create table public.habit_schedules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  habit_id uuid not null,
  frequency text not null default 'daily' check (frequency in ('daily', 'weekdays', 'weekly_target', 'custom')),
  weekdays smallint[] not null default '{}'::smallint[],
  times_per_week smallint check (times_per_week is null or times_per_week between 1 and 7),
  preferred_time time,
  timezone text not null default 'America/Bogota',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (habit_id, user_id) references public.habits(id, user_id) on delete cascade,
  unique (habit_id),
  constraint habit_schedules_weekdays_valid check (weekdays <@ array[0,1,2,3,4,5,6]::smallint[])
);

create table public.habit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  habit_id uuid not null,
  occurred_on date not null,
  occurrence_index smallint not null default 0 check (occurrence_index >= 0),
  status text not null check (status in ('completed', 'missed', 'excused')),
  value numeric check (value is null or value >= 0),
  note text,
  operation_id uuid not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (habit_id, user_id) references public.habits(id, user_id) on delete cascade,
  unique (user_id, habit_id, occurred_on, occurrence_index),
  unique (user_id, operation_id)
);

create table public.daily_priorities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  occurred_on date not null,
  title text not null check (char_length(btrim(title)) between 1 and 240),
  completed boolean not null default false,
  completed_at timestamptz,
  operation_id uuid not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, occurred_on),
  unique (user_id, operation_id)
);

create table public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  system_key text not null default 'maestro' check (system_key in ('maestro', 'micro_goals', 'character', 'bible', 'finance', 'learning', 'nido')),
  title text not null check (char_length(btrim(title)) between 1 and 200),
  description text,
  status text not null default 'active' check (status in ('draft', 'active', 'paused', 'completed', 'cancelled')),
  priority smallint not null default 3 check (priority between 1 and 5),
  starts_on date,
  due_on date,
  metric_name text,
  target_value numeric,
  current_value numeric,
  operation_id uuid not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz,
  archived_at timestamptz,
  unique (id, user_id),
  unique (user_id, operation_id),
  constraint goals_date_order check (starts_on is null or due_on is null or due_on >= starts_on)
);

create table public.goal_steps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  goal_id uuid not null,
  title text not null check (char_length(btrim(title)) between 1 and 200),
  status text not null default 'pending' check (status in ('pending', 'in_progress', 'completed', 'cancelled')),
  position integer not null default 0 check (position >= 0),
  due_on date,
  target_value numeric,
  current_value numeric,
  operation_id uuid not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz,
  foreign key (goal_id, user_id) references public.goals(id, user_id) on delete cascade,
  unique (user_id, operation_id)
);

create table public.focus_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  system_key text not null default 'maestro' check (system_key in ('maestro', 'micro_goals', 'character', 'bible', 'finance', 'learning', 'nido')),
  session_type text not null,
  title text,
  started_at timestamptz not null,
  ended_at timestamptz,
  duration_seconds integer check (duration_seconds is null or duration_seconds >= 0),
  status text not null default 'running' check (status in ('running', 'completed', 'cancelled')),
  reference_type text,
  reference_id uuid,
  note text,
  operation_id uuid not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, operation_id),
  constraint focus_sessions_time_order check (ended_at is null or ended_at >= started_at)
);

create table public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  system_key text not null default 'maestro' check (system_key in ('maestro', 'micro_goals', 'character', 'bible', 'finance', 'learning', 'nido')),
  occurred_on date not null,
  entry_type text not null default 'note',
  title text,
  content text not null,
  mood smallint check (mood is null or mood between 1 and 5),
  metadata jsonb not null default '{}'::jsonb,
  operation_id uuid not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, operation_id)
);

create table public.score_configs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  version integer not null default 1 check (version > 0),
  weights jsonb not null,
  rules jsonb not null default '{}'::jsonb,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, version)
);

create table public.score_snapshots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  occurred_on date not null,
  formula_version integer not null check (formula_version > 0),
  components jsonb not null,
  total smallint not null check (total between 0 and 100),
  created_at timestamptz not null default now(),
  unique (user_id, occurred_on, formula_version)
);

create table public.legacy_migration_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  migration_key text not null,
  status text not null default 'detected' check (status in ('detected', 'backed_up', 'confirmed', 'running', 'completed', 'failed', 'cancelled')),
  source_summary jsonb not null default '{}'::jsonb,
  result_summary jsonb not null default '{}'::jsonb,
  backup_hash text,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, migration_key),
  unique (id, user_id)
);

create table public.legacy_migration_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  run_id uuid not null,
  source_key text not null,
  source_fingerprint text not null,
  destination_type text,
  destination_id uuid,
  operation_id uuid not null,
  status text not null default 'pending' check (status in ('pending', 'applied', 'skipped', 'failed')),
  error_code text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (run_id, user_id) references public.legacy_migration_runs(id, user_id) on delete cascade,
  unique (user_id, source_key, source_fingerprint),
  unique (user_id, operation_id)
);

create table public.sync_operations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  operation_id uuid not null,
  device_id text not null,
  entity_type text not null,
  entity_id uuid not null,
  action text not null check (action in ('create', 'update', 'delete')),
  base_revision bigint check (base_revision is null or base_revision >= 0),
  applied_at timestamptz not null default now(),
  unique (user_id, operation_id)
);

create index habits_user_active_idx on public.habits (user_id, active) where archived_at is null;
create index habit_logs_user_date_idx on public.habit_logs (user_id, occurred_on desc);
create index goals_user_status_idx on public.goals (user_id, status) where archived_at is null;
create index focus_sessions_user_started_idx on public.focus_sessions (user_id, started_at desc);
create index journal_entries_user_date_idx on public.journal_entries (user_id, occurred_on desc);
create index migration_items_run_idx on public.legacy_migration_items (run_id, status);

create trigger profiles_set_updated_at before update on public.profiles for each row execute function private.set_updated_at();
create trigger user_settings_set_updated_at before update on public.user_settings for each row execute function private.set_updated_at();
create trigger habits_set_updated_at before update on public.habits for each row execute function private.set_updated_at();
create trigger habit_schedules_set_updated_at before update on public.habit_schedules for each row execute function private.set_updated_at();
create trigger habit_logs_set_updated_at before update on public.habit_logs for each row execute function private.set_updated_at();
create trigger daily_priorities_set_updated_at before update on public.daily_priorities for each row execute function private.set_updated_at();
create trigger goals_set_updated_at before update on public.goals for each row execute function private.set_updated_at();
create trigger goal_steps_set_updated_at before update on public.goal_steps for each row execute function private.set_updated_at();
create trigger focus_sessions_set_updated_at before update on public.focus_sessions for each row execute function private.set_updated_at();
create trigger journal_entries_set_updated_at before update on public.journal_entries for each row execute function private.set_updated_at();
create trigger score_configs_set_updated_at before update on public.score_configs for each row execute function private.set_updated_at();
create trigger legacy_migration_runs_set_updated_at before update on public.legacy_migration_runs for each row execute function private.set_updated_at();
create trigger legacy_migration_items_set_updated_at before update on public.legacy_migration_items for each row execute function private.set_updated_at();

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, nullif(btrim(new.raw_user_meta_data ->> 'display_name'), ''));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user();

alter table public.profiles enable row level security;
alter table public.user_settings enable row level security;
alter table public.habits enable row level security;
alter table public.habit_schedules enable row level security;
alter table public.habit_logs enable row level security;
alter table public.daily_priorities enable row level security;
alter table public.goals enable row level security;
alter table public.goal_steps enable row level security;
alter table public.focus_sessions enable row level security;
alter table public.journal_entries enable row level security;
alter table public.score_configs enable row level security;
alter table public.score_snapshots enable row level security;
alter table public.legacy_migration_runs enable row level security;
alter table public.legacy_migration_items enable row level security;
alter table public.sync_operations enable row level security;

revoke all on all tables in schema public from anon;
grant select, insert, update, delete on table
  public.profiles,
  public.user_settings,
  public.habits,
  public.habit_schedules,
  public.habit_logs,
  public.daily_priorities,
  public.goals,
  public.goal_steps,
  public.focus_sessions,
  public.journal_entries,
  public.score_configs,
  public.score_snapshots,
  public.legacy_migration_runs,
  public.legacy_migration_items,
  public.sync_operations
to authenticated;

create policy profiles_select_own on public.profiles for select to authenticated using ((select auth.uid()) = id);
create policy profiles_insert_own on public.profiles for insert to authenticated with check ((select auth.uid()) = id);
create policy profiles_update_own on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy profiles_delete_own on public.profiles for delete to authenticated using ((select auth.uid()) = id);

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'user_settings', 'habits', 'habit_schedules', 'habit_logs', 'daily_priorities',
    'goals', 'goal_steps', 'focus_sessions', 'journal_entries', 'score_configs',
    'score_snapshots', 'legacy_migration_runs', 'legacy_migration_items', 'sync_operations'
  ]
  loop
    execute format(
      'create policy %I on public.%I for select to authenticated using ((select auth.uid()) = user_id)',
      table_name || '_select_own', table_name
    );
    execute format(
      'create policy %I on public.%I for insert to authenticated with check ((select auth.uid()) = user_id)',
      table_name || '_insert_own', table_name
    );
    execute format(
      'create policy %I on public.%I for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id)',
      table_name || '_update_own', table_name
    );
    execute format(
      'create policy %I on public.%I for delete to authenticated using ((select auth.uid()) = user_id)',
      table_name || '_delete_own', table_name
    );
  end loop;
end;
$$;
