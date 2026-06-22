-- Admin foundations: schema, RLS, and the admin-role token hook.
-- Apply in the Supabase SQL editor or via the CLI. See docs/admin-panel.md.

-- Admin allow-list. Managed only from the SQL editor (no policies => not
-- readable or writable by clients). Insert the owner's auth.users id here.
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  added_at timestamptz not null default now()
);
alter table public.admins enable row level security;

-- Stamp user_role=admin into every access token for allow-listed users.
create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb language plpgsql stable as $$
declare
  claims jsonb := event -> 'claims';
begin
  if exists (
    select 1 from public.admins a
    where a.user_id = (event ->> 'user_id')::uuid
  ) then
    claims := jsonb_set(claims, '{user_role}', '"admin"');
  end if;
  return jsonb_set(event, '{claims}', claims);
end;
$$;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  kind text not null default 'photography',
  accent text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  client text,
  year int,
  summary text,
  cover_asset_id uuid,
  status text not null default 'draft',
  featured boolean not null default false,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.project_categories (
  project_id uuid references public.projects (id) on delete cascade,
  category_id uuid references public.categories (id) on delete cascade,
  primary key (project_id, category_id)
);

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  kind text not null,
  r2_key text,
  provider text,
  provider_id text,
  width int,
  height int,
  duration_seconds int,
  alt text,
  focal_x real default 0.5,
  focal_y real default 0.5,
  byte_size bigint,
  created_at timestamptz not null default now()
);

create table if not exists public.project_media (
  project_id uuid references public.projects (id) on delete cascade,
  asset_id uuid references public.media_assets (id) on delete cascade,
  sort_order int not null default 0,
  primary key (project_id, asset_id)
);

create table if not exists public.site_settings (
  id int primary key default 1 check (id = 1),
  agency_name text,
  tagline text,
  logo_asset_id uuid,
  contact_email text,
  phone text,
  whatsapp text,
  location text,
  instagram text,
  youtube text,
  vimeo text,
  behance text,
  seo_title text,
  seo_description text,
  og_asset_id uuid
);

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text,
  message text,
  source text,
  created_at timestamptz not null default now(),
  handled boolean not null default false
);

-- Enable RLS everywhere.
alter table public.categories enable row level security;
alter table public.projects enable row level security;
alter table public.project_categories enable row level security;
alter table public.media_assets enable row level security;
alter table public.project_media enable row level security;
alter table public.site_settings enable row level security;
alter table public.inquiries enable row level security;

-- Admin-only writes; the admin claim comes from the token hook above.
-- (Public reads are intentionally omitted: the public site reads catalog.json
-- from R2, not Supabase. Add explicit select policies only if you serve
-- content from Supabase at runtime.)
do $$
declare t text;
begin
  foreach t in array array[
    'categories','projects','project_categories',
    'media_assets','project_media','site_settings'
  ] loop
    execute format(
      'create policy %I on public.%I for all to authenticated '
      'using (auth.jwt() ->> ''user_role'' = ''admin'') '
      'with check (auth.jwt() ->> ''user_role'' = ''admin'');',
      t || '_admin_write', t
    );
  end loop;
end $$;

-- Inquiries: anyone may submit; only the admin may read/update.
create policy inquiries_public_insert on public.inquiries
  for insert to anon, authenticated with check (true);
create policy inquiries_admin_read on public.inquiries
  for select to authenticated using (auth.jwt() ->> 'user_role' = 'admin');
create policy inquiries_admin_update on public.inquiries
  for update to authenticated using (auth.jwt() ->> 'user_role' = 'admin');
