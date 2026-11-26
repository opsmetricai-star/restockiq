-- RestockIQ schema. Run in Supabase SQL editor (or `supabase db push`).
create extension if not exists "pgcrypto";

-- Profiles ---------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  email text,
  full_name text,
  org_name text,
  created_at timestamptz not null default now()
);

-- Subscriptions: written ONLY by the service role (admin verification) ----
create table if not exists public.subscriptions (
  user_id uuid primary key references auth.users on delete cascade,
  plan text not null default 'free' check (plan in ('free','starter','growth','scale')),
  status text not null default 'active',
  current_period_end timestamptz,
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  sku text not null,
  name text not null,
  category text,
  supplier text,
  unit_cost numeric(12,2) not null default 0,
  price numeric(12,2) not null default 0,
  on_hand integer not null default 0,
  on_order integer not null default 0,
  lead_time_days integer not null default 7,
  service_level numeric(4,3) not null default 0.95,
  min_order_qty integer not null default 1,
  created_at timestamptz not null default now(),
  unique (user_id, sku)
);

create table if not exists public.sales (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users on delete cascade,
  sku text not null,
  sold_on date not null,
  qty integer not null check (qty >= 0),
  unique (user_id, sku, sold_on)
);
create index if not exists sales_user_sku_date on public.sales (user_id, sku, sold_on);

create table if not exists public.forecasts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  sku text not null,
  horizon_days integer not null,
  method text not null,
  daily_forecast numeric(12,3) not null,
  total_forecast numeric(12,2) not null,
  wape numeric(8,4),
  bias numeric(8,4),
  sigma numeric(12,3) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.purchase_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  supplier text not null,
  status text not null default 'draft' check (status in ('draft','sent','received','cancelled')),
  notes text,
  created_at timestamptz not null default now()
);
create table if not exists public.purchase_order_lines (
  id uuid primary key default gen_random_uuid(),
  po_id uuid not null references public.purchase_orders on delete cascade,
  user_id uuid not null references auth.users on delete cascade,
  sku text not null,
  qty integer not null check (qty > 0),
  unit_cost numeric(12,2) not null default 0
);

create table if not exists public.ai_insights (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  kind text not null,
  prompt text,
  response jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.usage_counters (
  user_id uuid not null references auth.users on delete cascade,
  period text not null, -- YYYY-MM
  forecasts integer not null default 0,
  ai integer not null default 0,
  uploads integer not null default 0,
  primary key (user_id, period)
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  title text not null,
  body text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.payment_claims (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  plan text not null check (plan in ('starter','growth','scale')),
  reference text not null,
  payer_email text,
  status text not null default 'pending' check (status in ('pending','verified','rejected')),
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create table if not exists public.demo_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null, email text not null, company text, role text, message text,
  created_at timestamptz not null default now()
);

-- Row Level Security -------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.subscriptions enable row level security;
alter table public.products enable row level security;
alter table public.sales enable row level security;
alter table public.forecasts enable row level security;
alter table public.purchase_orders enable row level security;
alter table public.purchase_order_lines enable row level security;
alter table public.ai_insights enable row level security;
alter table public.usage_counters enable row level security;
alter table public.notifications enable row level security;
alter table public.payment_claims enable row level security;
alter table public.demo_requests enable row level security; -- no policies: service role only

create policy "own profile read" on public.profiles for select using (auth.uid() = id);
create policy "own profile update" on public.profiles for update using (auth.uid() = id);
create policy "own subscription read" on public.subscriptions for select using (auth.uid() = user_id);

do $$
declare t text;
begin
  foreach t in array array['products','sales','forecasts','purchase_orders','purchase_order_lines','ai_insights','notifications'] loop
    execute format('create policy "own rows select" on public.%I for select using (auth.uid() = user_id)', t);
    execute format('create policy "own rows insert" on public.%I for insert with check (auth.uid() = user_id)', t);
    execute format('create policy "own rows update" on public.%I for update using (auth.uid() = user_id)', t);
    execute format('create policy "own rows delete" on public.%I for delete using (auth.uid() = user_id)', t);
  end loop;
end $$;

create policy "own usage read" on public.usage_counters for select using (auth.uid() = user_id);
-- usage is written server-side only (service role)
create policy "own claims read" on public.payment_claims for select using (auth.uid() = user_id);
create policy "own claims insert" on public.payment_claims for insert with check (auth.uid() = user_id and status = 'pending');

-- New-user bootstrap --------------------------------------------------------
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, org_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'org_name');
  insert into public.subscriptions (user_id) values (new.id);
  insert into public.notifications (user_id, title, body)
  values (new.id, 'Welcome to RestockIQ', 'Import your products and sales history to run your first forecast.');
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- Storage -------------------------------------------------------------------
insert into storage.buckets (id, name, public) values ('uploads', 'uploads', false) on conflict do nothing;
create policy "own uploads read" on storage.objects for select using (bucket_id = 'uploads' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "own uploads write" on storage.objects for insert with check (bucket_id = 'uploads' and (storage.foldername(name))[1] = auth.uid()::text);
