-- Product catalog in the database. Images live in Cloudflare R2;
-- product_images only stores their public URLs.

create table if not exists public.categories (
  id text primary key,                       -- url slug, e.g. 'phones'
  name text not null,
  blurb text not null default '',
  image text not null default '',
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  brand text not null default '',
  category_id text not null references public.categories (id) on update cascade on delete restrict,
  price integer not null check (price >= 0),  -- NGN, lowest option price
  tagline text not null default '',
  rating numeric(2,1) not null default 4.5 check (rating between 0 and 5),
  badge text,
  -- [{ "label": "256GB", "price": 1650000 }, ...]; empty array = single price
  options jsonb not null default '[]'::jsonb,
  colours text[] not null default '{}',
  specs jsonb not null default '{}'::jsonb,
  position integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_category_idx on public.products (category_id, position);
create index if not exists products_price_idx on public.products (price);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  image_url text not null,
  storage_key text,                           -- R2 object key, for deleting
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists product_images_product_idx on public.product_images (product_id, position);

drop trigger if exists products_touch on public.products;
create trigger products_touch before update on public.products
  for each row execute function public.touch_updated_at();

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;

-- Anyone can browse the shop.
drop policy if exists "categories: public read" on public.categories;
create policy "categories: public read" on public.categories for select using (true);

drop policy if exists "products: public read" on public.products;
create policy "products: public read" on public.products
  for select using (is_active or public.is_admin());

drop policy if exists "product_images: public read" on public.product_images;
create policy "product_images: public read" on public.product_images for select using (true);

-- Only admins change the catalog.
drop policy if exists "categories: admin write" on public.categories;
create policy "categories: admin write" on public.categories
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "products: admin write" on public.products;
create policy "products: admin write" on public.products
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "product_images: admin write" on public.product_images;
create policy "product_images: admin write" on public.product_images
  for all using (public.is_admin()) with check (public.is_admin());

-- Visitors who are not signed in must be able to evaluate the read policy.
grant execute on function public.is_admin() to anon;
