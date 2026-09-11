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

create index if not exists app_users_email_idx on public.app_users (email);
create index if not exists workspace_snapshots_updated_idx on public.workspace_snapshots (updated_at desc);

alter table public.app_users enable row level security;
alter table public.workspace_snapshots enable row level security;

-- Direct browser access is intentionally denied. The Express server verifies
-- Google credentials and talks to Supabase with the server-only service role.
create policy "no direct app user access"
  on public.app_users for all
  using (false)
  with check (false);

create policy "no direct workspace snapshot access"
  on public.workspace_snapshots for all
  using (false)
  with check (false);

comment on table public.workspace_snapshots is 'Versioned local-first workspace backup, scoped to one verified Google user.';
