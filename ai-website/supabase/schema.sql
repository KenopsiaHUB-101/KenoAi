-- KenoAi Supabase schema
-- Run this in Supabase SQL Editor. The server uses the service role only;
-- never expose SUPABASE_SERVICE_ROLE_KEY to the browser.

create extension if not exists pgcrypto;

create table if not exists public.app_users (
  id uuid primary key default gen_random_uuid(),
  google_sub text unique not null,
  email text not null,
  display_name text not null default '',
  avatar_url text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workspace_snapshots (
  user_id uuid primary key references public.app_users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb,
  version integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.github_connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.app_users(id) on delete cascade,
  owner text not null,
  repo text not null,
  branch text not null default 'main',
  encrypted_access_token text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, owner, repo)
);

create index if not exists app_users_email_idx on public.app_users (email);
create index if not exists workspace_snapshots_updated_idx on public.workspace_snapshots (updated_at desc);
create index if not exists github_connections_user_idx on public.github_connections (user_id, updated_at desc);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists app_users_touch_updated_at on public.app_users;
create trigger app_users_touch_updated_at before update on public.app_users
for each row execute function public.touch_updated_at();

drop trigger if exists workspace_snapshots_touch_updated_at on public.workspace_snapshots;
create trigger workspace_snapshots_touch_updated_at before update on public.workspace_snapshots
for each row execute function public.touch_updated_at();

drop trigger if exists github_connections_touch_updated_at on public.github_connections;
create trigger github_connections_touch_updated_at before update on public.github_connections
for each row execute function public.touch_updated_at();

alter table public.app_users enable row level security;
alter table public.workspace_snapshots enable row level security;
alter table public.github_connections enable row level security;

-- Direct browser access is intentionally denied. The Express server verifies
-- Google credentials and talks to Supabase with the server-only service role.
drop policy if exists "no direct app user access" on public.app_users;
create policy "no direct app user access"
  on public.app_users for all
  using (false)
  with check (false);

drop policy if exists "no direct workspace snapshot access" on public.workspace_snapshots;
create policy "no direct workspace snapshot access"
  on public.workspace_snapshots for all
  using (false)
  with check (false);

drop policy if exists "no direct github connection access" on public.github_connections;
create policy "no direct github connection access"
  on public.github_connections for all
  using (false)
  with check (false);

comment on table public.workspace_snapshots is 'Versioned local-first workspace backup, scoped to one verified Google user.';
comment on table public.github_connections is 'Per-user GitHub connection metadata. Access tokens must be encrypted before storage.';
