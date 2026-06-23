-- Public-read policies: anon can SELECT, admin can mutate (via existing policies)
-- This enables the /work page to query live Supabase data without auth.

create policy "public_read_categories"
  on categories for select
  to anon
  using (true);

create policy "public_read_projects"
  on projects for select
  to anon
  using (status = 'published');

create policy "public_read_project_categories"
  on project_categories for select
  to anon
  using (true);

create policy "public_read_media_assets"
  on media_assets for select
  to anon
  using (true);

create policy "public_read_project_media"
  on project_media for select
  to anon
  using (true);
