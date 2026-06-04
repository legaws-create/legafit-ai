-- BodyFit AI — Supabase schema
-- Run in the Supabase SQL editor (or `supabase db push`).
-- Every table is owner-scoped via Row Level Security against auth.uid().

-- =========================================================
-- profiles
-- =========================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  sex text check (sex in ('male','female')),
  birth_year int,
  height_cm numeric,
  weight_kg numeric,
  activity_level text not null default 'moderate'
    check (activity_level in ('sedentary','light','moderate','active','athlete')),
  goal text not null default 'maintain' check (goal in ('lose','maintain','gain')),
  created_at timestamptz not null default now()
);

-- =========================================================
-- workouts (gym tracker)
-- =========================================================
create table if not exists public.workouts (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  performed_at timestamptz not null default now(),
  title text not null,
  -- exercises stored as JSONB: [{ name, sets: [{ reps, weightKg, rpe }] }]
  exercises jsonb not null default '[]'::jsonb,
  duration_min int,
  notes text,
  created_at timestamptz not null default now()
);
create index if not exists workouts_owner_idx on public.workouts(owner_id, performed_at desc);

-- =========================================================
-- meal_plans (AI meal planner)
-- =========================================================
create table if not exists public.meal_plans (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  targets jsonb not null,         -- { calories, proteinG, carbsG, fatG }
  days jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists meal_plans_owner_idx on public.meal_plans(owner_id, created_at desc);

-- =========================================================
-- progress_logs (progress tracker)
-- =========================================================
create table if not exists public.progress_logs (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  logged_at date not null default current_date,
  weight_kg numeric,
  body_fat_pct numeric,
  waist_cm numeric,
  created_at timestamptz not null default now()
);
create index if not exists progress_owner_idx on public.progress_logs(owner_id, logged_at desc);

-- =========================================================
-- nutrition_chats (AI coach history)
-- =========================================================
create table if not exists public.nutrition_chats (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user','assistant','system')),
  content text not null,
  created_at timestamptz not null default now()
);
create index if not exists chats_owner_idx on public.nutrition_chats(owner_id, created_at);

-- =========================================================
-- strava_tokens (one row per user)
-- =========================================================
create table if not exists public.strava_tokens (
  owner_id uuid primary key references auth.users(id) on delete cascade,
  athlete_id bigint,
  access_token text not null,
  refresh_token text not null,
  expires_at bigint not null,
  updated_at timestamptz not null default now()
);

-- =========================================================
-- Row Level Security
-- =========================================================
alter table public.profiles        enable row level security;
alter table public.workouts        enable row level security;
alter table public.meal_plans      enable row level security;
alter table public.progress_logs   enable row level security;
alter table public.nutrition_chats enable row level security;
alter table public.strava_tokens   enable row level security;

-- profiles: a user can read/update only their own row
drop policy if exists "profiles_self_select" on public.profiles;
create policy "profiles_self_select" on public.profiles
  for select using (auth.uid() = id);
drop policy if exists "profiles_self_modify" on public.profiles;
create policy "profiles_self_modify" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

-- generic owner policies for the rest
do $$
declare t text;
begin
  foreach t in array array['workouts','meal_plans','progress_logs','nutrition_chats','strava_tokens']
  loop
    execute format('drop policy if exists "%1$s_owner_all" on public.%1$s;', t);
    execute format($f$
      create policy "%1$s_owner_all" on public.%1$s
        for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
    $f$, t);
  end loop;
end $$;

-- =========================================================
-- Auto-create a profile row when a new auth user signs up
-- =========================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', null))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
