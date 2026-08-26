-- Remote migration version: 20260826162834.
create index goal_steps_goal_user_idx on public.goal_steps (goal_id, user_id);
create index habit_logs_habit_user_idx on public.habit_logs (habit_id, user_id);
create index habit_schedules_habit_user_idx on public.habit_schedules (habit_id, user_id);
create index habit_schedules_user_idx on public.habit_schedules (user_id);
create index migration_items_run_user_idx on public.legacy_migration_items (run_id, user_id);
