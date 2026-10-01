-- ==============================================================
-- ScoopMatch: Supabase SQL Setup Script
-- Copy dan Paste script ini ke SQL Editor di dashboard Supabase Anda
-- ==============================================================

-- 1. Buat Tabel orders
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_code text not null unique,
  customer_name text not null,
  notes text default '',
  flavor_id text not null,
  flavor_name text not null,
  serving text not null default 'cone',
  size text not null default 'single',
  toppings jsonb default '[]'::jsonb,
  total_price numeric not null default 0,
  status text not null default 'pending', -- 'pending' | 'diproses' | 'selesai'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Aktifkan Row Level Security (RLS)
alter table public.orders enable row level security;

-- 3. Kebijakan RLS agar aplikasi kiosk & pelanggan bisa membaca dan menambah pesanan
create policy "Allow public read access"
  on public.orders for select
  using (true);

create policy "Allow public insert access"
  on public.orders for insert
  with check (true);

create policy "Allow public update access"
  on public.orders for update
  using (true);

-- 4. Aktifkan Fitur Realtime Replication untuk tabel orders
alter publication supabase_realtime add table public.orders;
