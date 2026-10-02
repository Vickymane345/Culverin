-- Culverin Quantum Systems: initial schema.
-- Run once in the Supabase SQL editor (or `supabase db push`).
-- Products live in lib/catalog.ts; the database stores people, orders,
-- wishlists, repair bookings and enquiries.

-- ---------------------------------------------------------------------------
-- Profiles (one row per auth user)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  email text,
  phone text,
  address text,
  city text,
  state text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, phone)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'phone'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((select is_admin from public.profiles where id = auth.uid()), false);
$$;

-- ---------------------------------------------------------------------------
-- Orders
-- ---------------------------------------------------------------------------
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  user_id uuid references auth.users (id) on delete set null,
  email text not null,
  full_name text not null,
  phone text not null,
  address text not null,
  city text not null,
  state text not null,
  notes text,
  subtotal integer not null check (subtotal >= 0),
  delivery_fee integer not null default 0 check (delivery_fee >= 0),
  total integer not null check (total >= 0),
  status text not null default 'pending_payment' check (
    status in ('pending_payment', 'paid', 'processing', 'shipped', 'delivered', 'cancelled')
  ),
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_user_id_idx on public.orders (user_id, created_at desc);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_slug text not null,
  product_name text not null,
  category text not null,
  option text,
  colour text,
  image text,
  unit_price integer not null check (unit_price >= 0),
  quantity integer not null check (quantity > 0)
);

create index if not exists order_items_order_id_idx on public.order_items (order_id);

-- ---------------------------------------------------------------------------
-- Wishlist
-- ---------------------------------------------------------------------------
create table if not exists public.wishlist (
  user_id uuid not null references auth.users (id) on delete cascade,
  product_slug text not null,
  category text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, product_slug)
);

-- ---------------------------------------------------------------------------
-- Repair bookings
-- ---------------------------------------------------------------------------
create table if not exists public.repair_requests (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  user_id uuid references auth.users (id) on delete set null,
  name text not null,
  email text not null,
  phone text not null,
  device text not null,
  serial text,
  issue text not null,
  status text not null default 'Received' check (
    status in ('Received', 'Diagnosing', 'Awaiting Parts', 'In Repair', 'Ready for Pickup', 'Collected')
  ),
  eta date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists repair_requests_user_id_idx on public.repair_requests (user_id, created_at desc);

-- ---------------------------------------------------------------------------
-- Contact / service enquiries
-- ---------------------------------------------------------------------------
create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  topic text not null,
  message text not null,
  handled boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- updated_at
-- ---------------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists orders_touch on public.orders;
create trigger orders_touch before update on public.orders
  for each row execute function public.touch_updated_at();

drop trigger if exists repairs_touch on public.repair_requests;
create trigger repairs_touch before update on public.repair_requests
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- Row level security
-- Orders, repairs and enquiries are created by the server with the service
-- role key, after it has validated input and priced the cart itself.
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.wishlist enable row level security;
alter table public.repair_requests enable row level security;
alter table public.enquiries enable row level security;

-- profiles
drop policy if exists "profiles: read own" on public.profiles;
create policy "profiles: read own" on public.profiles
  for select using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles: update own" on public.profiles;
create policy "profiles: update own" on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

-- Customers may edit contact details but never their admin flag.
revoke update on public.profiles from authenticated, anon;
grant update (full_name, phone, address, city, state) on public.profiles to authenticated;

-- orders
drop policy if exists "orders: read own" on public.orders;
create policy "orders: read own" on public.orders
  for select using (user_id = auth.uid() or public.is_admin());

drop policy if exists "orders: admin update" on public.orders;
create policy "orders: admin update" on public.orders
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "order_items: read own" on public.order_items;
create policy "order_items: read own" on public.order_items
  for select using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and (o.user_id = auth.uid() or public.is_admin())
    )
  );

-- wishlist
drop policy if exists "wishlist: own rows" on public.wishlist;
create policy "wishlist: own rows" on public.wishlist
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- repairs
drop policy if exists "repairs: read own" on public.repair_requests;
create policy "repairs: read own" on public.repair_requests
  for select using (user_id = auth.uid() or public.is_admin());

drop policy if exists "repairs: admin update" on public.repair_requests;
create policy "repairs: admin update" on public.repair_requests
  for update using (public.is_admin()) with check (public.is_admin());

-- enquiries
drop policy if exists "enquiries: admin read" on public.enquiries;
create policy "enquiries: admin read" on public.enquiries
  for select using (public.is_admin());

drop policy if exists "enquiries: admin update" on public.enquiries;
create policy "enquiries: admin update" on public.enquiries
  for update using (public.is_admin()) with check (public.is_admin());
