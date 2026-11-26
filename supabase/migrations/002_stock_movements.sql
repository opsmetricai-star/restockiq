-- Stock history: one row per change to on-hand stock. Run in the Supabase SQL editor.
create table if not exists public.stock_movements (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users on delete cascade,
  sku text not null,
  delta integer not null,
  balance integer not null,
  reason text not null check (reason in ('sale','adjustment','receipt','edit')),
  note text,
  created_at timestamptz not null default now()
);
create index if not exists stock_movements_user_created on public.stock_movements (user_id, created_at desc);
create index if not exists stock_movements_user_sku on public.stock_movements (user_id, sku, created_at desc);

alter table public.stock_movements enable row level security;
create policy "own movements select" on public.stock_movements for select using (auth.uid() = user_id);
create policy "own movements insert" on public.stock_movements for insert with check (auth.uid() = user_id);
