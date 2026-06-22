# Admin Panel — Design & Build Spec

Status: Proposed (v1) · Owner: engineering · Audience: Codex + Cursor implementation agents
Stack budget: Supabase Free + Cloudflare Free only. No paid services in the default path.

This document is the single source of truth for the portfolio admin panel. Build to this
spec. Where a decision is marked **Decision**, it is the recommended default — change it
deliberately, not by accident. Code must satisfy the rules in [`AGENTS.md`](../AGENTS.md)
(feature isolation, ≤80-line authored files, Server Components by default, design tokens,
accessibility, and the `npm run check` / `build:pages` / `verify:pages` / `architecture:check`
gates).

---

## 1. TL;DR

We are adding an admin panel to a **statically exported** Next.js portfolio for a
photography + videography production agency. The site has **no server runtime**, so:

- **Auth** is client-side **Supabase Google OAuth**; a single allow-listed admin.
- The **real security boundary is Supabase Row Level Security (RLS)** plus a tiny
  serverless function — never the client route guard.
- **Originals live in Cloudflare R2** (zero egress). **Images are optimized on demand at
  Cloudflare's edge** via `/cdn-cgi/image/` transformation URLs — Next does _not_ optimize
  (it cannot, in static export). **Video** uses free external embeds (YouTube/Vimeo) by
  default, with R2-hosted pre-compressed clips as a secondary option; Cloudflare Stream is
  the documented _paid_ upgrade.
- The public site reads a published **`catalog.json`** from R2, so it never depends on
  Supabase being awake (Supabase free projects pause after 7 idle days) and needs **no
  rebuild** when the admin edits content.

### Three decisions to confirm with the client

1. **Hosting:** move the public site from GitHub Pages to **Cloudflare Pages** (free, same
   static export). This is required to get a Cloudflare zone for image transformations and a
   free serverless function for signed uploads. (Fallback in §5.)
2. **Video:** default to **embeds** (YouTube/Vimeo unlisted) because Stream is not free.
3. **Publishing:** default to **runtime `catalog.json`** (instant edits, no developer, no
   rebuild) over build-time baking (better SEO). See §14.

---

## 2. Requirements traceability

| #   | Requirement                                                         | Where addressed          |
| --- | ------------------------------------------------------------------- | ------------------------ |
| 1   | Private login route, single admin, role granted in Supabase         | §7 Auth, §8 Data model   |
| 2   | After login, redirect to dashboard                                  | §7.4 Redirect flow       |
| 3   | Upload images by category from dashboard                            | §13 Dashboard, §9 Upload |
| 4   | Manage categories                                                   | §12 Categories           |
| 5   | Upload to Cloudflare; image + video optimization, free              | §9–§11                   |
| 6   | Everything else the admin needs to run the site without a developer | §15                      |

---

## 3. The defining constraint: static export

`next.config.ts` sets `output: "export"` and `images.unoptimized: true`. The site is shipped
as static files (`out/`). That means **at runtime there is no Next.js server**: no API
routes, no middleware, no Server Actions, no `next/image` optimizer.

Consequences we design around:

- Authentication runs **in the browser** with the Supabase JS client (PKCE flow).
- A client route guard can only _hide UI_. Anyone can download the static JS. Therefore
  **authorization must be enforced server-side by Supabase RLS** and by the upload function
  verifying the caller's JWT.
- Anything needing a secret (R2 credentials, Cloudflare API tokens) must run in a **separate
  serverless function** (Cloudflare Pages Function / Worker), never in the bundle.
- Image optimization must come from **Cloudflare**, not Next.

---

## 4. Architecture overview

```text
                          ┌──────────────────────────────────────┐
   Visitor (public) ──────▶  Static site (Next export on CF Pages) │
                          │   reads catalog.json + media from R2   │
                          └───────────────┬──────────────────────┘
                                          │ image URLs via /cdn-cgi/image/ (edge optimize)
                                          ▼
                          ┌──────────────────────────────────────┐
                          │  Cloudflare R2 (originals + catalog)  │  zero egress
                          └───────────────▲──────────────────────┘
                                          │ presigned PUT (short-lived)
   Admin (browser) ──┬── Google OAuth ──▶ Supabase Auth (session, JWT w/ admin claim)
                     │                        │
                     │   read/write (RLS) ────┘
                     │
                     └── POST /api/uploads/sign ─▶ Pages Function
                            (verifies Supabase JWT + admin claim,
                             returns R2 presigned URL; holds secrets)
```

Source of truth for editing = Supabase. Published artifact for the public site =
`catalog.json` in R2. Binary media = R2, optimized at the edge.

---

## 5. Hosting

**Decision: deploy the public site and the upload function on Cloudflare Pages.**

Why:

- Free, unlimited bandwidth, serves the existing static export unchanged.
- Puts the site on a **Cloudflare zone**, which is required for `/cdn-cgi/image/`
  transformations and for a custom media domain in front of R2.
- **Pages Functions** (Workers runtime, ~100k requests/day free) give us the one tiny
  server endpoint we need (signed uploads + publish) without a separate service.

Migration is low-risk: keep `output: "export"`; point Cloudflare Pages at the repo with
build command `npm run build` and output dir `out`. Remove the GitHub-Pages `basePath` for
the Cloudflare deploy (serve at root domain) — keep `PAGES_BASE_PATH` only if GitHub Pages
remains a mirror.

**Fallback (stay on GitHub Pages):** keep public hosting on GitHub Pages, but you still need
(a) a Cloudflare zone in front of the media domain for image transforms and (b) a standalone
**Cloudflare Worker** for the signed-upload + publish endpoints. More moving parts, same
cost. Not recommended.

---

## 6. Free-tier budget (verified June 2026)

| Service                  | Free allowance                                             | How we stay inside it                                                                            |
| ------------------------ | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Supabase DB              | 500 MB Postgres                                            | Only metadata (text rows), never binaries.                                                       |
| Supabase Storage         | 1 GB                                                       | Not used for media (R2 is). Reserve for tiny avatars if needed.                                  |
| Supabase Auth            | 50,000 MAU                                                 | Single admin. Trivial.                                                                           |
| Supabase projects        | Pause after 7 idle days                                    | Public site reads R2, not Supabase, so a pause never breaks the live site. Admin login wakes it. |
| Cloudflare R2            | 10 GB, 1M writes, 10M reads/mo, **$0 egress**              | Store originals + `catalog.json`. Generous for a portfolio.                                      |
| CF Image Transformations | **5,000 unique transforms/mo**, then HTTP 9422 (no charge) | Cache hits don't recount; limited responsive widths; `format=auto`. See §10.                     |
| CF Pages / Workers       | ~100k requests/day                                         | Upload-sign + publish endpoints only; files never pass through the function.                     |
| CF Stream (video)        | **No free tier** ($5/mo min)                               | Avoided by default — use embeds (§11).                                                           |

Sources: [R2 pricing](https://developers.cloudflare.com/r2/pricing/),
[Image transforms pricing](https://developers.cloudflare.com/images/pricing/),
[Stream pricing](https://developers.cloudflare.com/stream/pricing/),
[Supabase pricing](https://supabase.com/pricing).

---

## 7. Authentication (requirements 1 & 2)

### 7.1 Provider

Supabase Auth with **Google** as the only enabled OAuth provider, **PKCE** flow (correct for
a no-backend SPA). Use `@supabase/supabase-js` with a single browser client created from
`NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`. The anon key is public by
design; it is safe **only because RLS is enabled** on every table.

**Important:** Google sign-in is open to _any_ Google account — Supabase will happily mint a
valid session for a stranger. Authentication is not authorization here. A non-admin gets a
real JWT **without** the `user_role = 'admin'` claim, so RLS rejects every write and the
upload function refuses to issue presigned URLs. The admin allow-list (§7.2) is the only
thing that grants power. Do not gate anything on "is logged in"; gate on the admin claim.

### 7.2 Single-admin model

We do not build user management. Instead:

1. The owner signs in with Google once to create their `auth.users` row.
2. You (developer) mark that user as admin **in Supabase** — either by inserting their `uid`
   into an `admins` table, or by setting `app_metadata.role = 'admin'`.
3. A **Custom Access Token Hook** copies the admin role into the JWT as a `user_role` claim
   on every token issue, so RLS and the upload function can check it cheaply.

```sql
-- admins allow-list (simplest, auditable)
create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  added_at timestamptz not null default now()
);
alter table public.admins enable row level security;
-- no policies => not client-readable/writable; managed only from the SQL editor.

-- Custom Access Token Hook: stamp role into the JWT
create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb language plpgsql stable as $$
declare claims jsonb := event->'claims';
begin
  if exists (select 1 from public.admins a
             where a.user_id = (event->>'user_id')::uuid) then
    claims := jsonb_set(claims, '{user_role}', '"admin"');
  end if;
  return jsonb_set(event, '{claims}', claims);
end;$$;
```

Enable the hook in **Authentication → Hooks → Custom Access Token**. Reference:
[RBAC custom claims](https://supabase.com/docs/guides/database/postgres/custom-claims-and-role-based-access-control-rbac),
[Custom Access Token Hook](https://supabase.com/docs/guides/auth/auth-hooks/custom-access-token-hook).

### 7.3 Client route guard (UX only)

`AdminRoute` mirrors the existing `PrivateRoute` pattern but checks a real Supabase session +
the `user_role === 'admin'` claim, redirecting to `/admin/login` otherwise. **This is a UX
convenience, not security** — restate this in code comments. The data is protected by RLS.

### 7.4 Redirect flow (requirement 2)

`/admin/login` → "Continue with Google" → Supabase OAuth → redirect back to
`/admin/auth/callback` (a client page that calls `supabase.auth.exchangeCodeForSession`) →
on admin session, `router.replace('/admin')` which renders the dashboard. Non-admins get a
clear "not authorized" state and a sign-out button.

### 7.5 Retire the demo guard

The current `src/features/access` demo (localStorage flag, `/login`, `/private`) is a
placeholder. Replace it with `src/features/auth`. Keep the route paths sensible:
`/admin/login`, `/admin` (dashboard), `/admin/...`. Remove `/private` + `/login` demo or
redirect them to `/admin`.

---

## 8. Data model

All tables get `enable row level security`. Public read is allowed only on published content;
**all writes require the admin claim**. (If you adopt the `catalog.json` publish model in §14,
you may even keep public read off entirely and let the public site read only R2.)

```sql
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  kind text not null default 'photography',   -- photography | videography | both
  accent text,                                 -- token-aligned hex, optional
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.projects (                 -- a body of work / shoot / client
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  client text,
  year int,
  summary text,
  cover_asset_id uuid,
  status text not null default 'draft',         -- draft | published
  featured boolean not null default false,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

create table public.project_categories (
  project_id uuid references public.projects (id) on delete cascade,
  category_id uuid references public.categories (id) on delete cascade,
  primary key (project_id, category_id)
);

create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  kind text not null,                           -- image | video_embed | video_file
  r2_key text,                                  -- for image/video_file
  provider text, provider_id text,              -- for video_embed (youtube|vimeo)
  width int, height int, duration_seconds int,
  alt text,                                      -- required for images (a11y)
  focal_x real default 0.5, focal_y real default 0.5,
  byte_size bigint,
  created_at timestamptz not null default now()
);

create table public.project_media (
  project_id uuid references public.projects (id) on delete cascade,
  asset_id uuid references public.media_assets (id) on delete cascade,
  sort_order int not null default 0,
  primary key (project_id, asset_id)
);

create table public.site_settings (            -- single row, key/value or typed columns
  id int primary key default 1 check (id = 1),
  agency_name text, tagline text, logo_asset_id uuid,
  contact_email text, phone text, whatsapp text, location text,
  instagram text, youtube text, vimeo text, behance text,
  seo_title text, seo_description text, og_asset_id uuid
);

create table public.inquiries (                 -- contact form leads (§15)
  id uuid primary key default gen_random_uuid(),
  name text, email text, message text, source text,
  created_at timestamptz not null default now(),
  handled boolean not null default false
);
```

**RLS template** (apply per table):

```sql
alter table public.categories enable row level security;

-- public can read published content (only if you serve content from Supabase at runtime)
create policy "read published" on public.categories
  for select to anon, authenticated using (true);

-- only admins write
create policy "admin writes" on public.categories
  for all to authenticated
  using (auth.jwt()->>'user_role' = 'admin')
  with check (auth.jwt()->>'user_role' = 'admin');
```

`inquiries`: allow `insert` to `anon` (public contact form), but **no `select`** for anon;
only admin can read. Never expose emails publicly.

---

## 9. Media upload & storage (requirement 5, part 1)

**Files never pass through our function** (keeps us inside Workers CPU/time limits and costs
nothing). Flow:

1. Admin picks a file in the dashboard. Client validates type/size/dimensions locally.
2. Client calls `POST /api/uploads/sign` with the Supabase access token in `Authorization`.
3. The **Pages Function** verifies the JWT against Supabase JWKS and checks
   `user_role === 'admin'`. If valid, it returns a **short-lived (e.g. 60s) R2 presigned
   PUT URL** (S3-compatible, signed with R2 credentials held as function secrets) plus the
   final `r2_key` (e.g. `originals/<uuid>.<ext>`).
4. Client `PUT`s the file directly to R2 using that URL (with progress UI).
5. Client inserts a `media_assets` row (RLS-checked) with `r2_key`, dimensions, `alt`, etc.,
   then links it to a project/category via `project_media`.

R2 setup: one bucket (e.g. `portfolio-media`), CORS allowing `PUT`/`GET` from the site
origin, and a **public custom domain** (e.g. `media.example.com`) bound to the bucket for
read access. Keep the account ID / access keys as **function secrets only**.

`/api/uploads/sign` responsibilities (keep it tiny, secrets server-side):

- Verify Supabase JWT (issuer, audience, signature, expiry) + admin claim.
- Enforce content-type allow-list and a max-size hint.
- Generate `r2_key`, return presigned URL + key. No file handling.

---

## 10. Image optimization — where and how, for free (requirement 5)

**Where:** at Cloudflare's edge, _not_ in Next (static export can't optimize; `next/image`
is `unoptimized`). The admin uploads **one high-quality original**; all derivatives are
generated on demand and cached.

**How:** build URLs in the shape
`https://media.example.com/cdn-cgi/image/<options>/<path-to-original>` where options are
e.g. `width=1200,quality=80,format=auto`. `format=auto` serves AVIF/WebP to supporting
browsers. The media domain must be a **Cloudflare-proxied zone** with **Transformations
enabled** (Images → Transformations) and the bucket origin allow-listed.
Ref: [transform via URL](https://developers.cloudflare.com/images/transform-images/transform-via-url/).

Build a small shared primitive `CloudflareImage` (domain-neutral → `src/shared/ui`):

- Inputs: `src` (r2 key or absolute), `alt` (required), `sizes`, `width`/`height` or aspect.
- Emits a `srcset` across a **small fixed set of widths** (e.g. 480/768/1200/1920) so we stay
  well under 5,000 unique transforms/month. Lazy-load below the fold, set `width`/`height`
  to prevent layout shift, respect `prefers-reduced-motion` for any transitions.
- A pure `buildTransformUrl(key, opts)` helper (its own file, unit-tested) keeps the
  component thin and the line-count rule satisfied.

Staying under the free 5,000 transforms: limit the responsive width set, reuse the same
quality, cache aggressively (cache hits are free and don't recount), and generate a single
small `blurhash`/LQIP at upload time if you want placeholders (store on the asset row).

---

## 11. Video optimization — free strategy (requirement 5)

Cloudflare Stream has **no free tier**. So:

- **Default (recommended): external embeds.** Admin pastes a YouTube or Vimeo (unlisted) URL.
  We store `provider` + `provider_id` only. The public site renders a **lite, click-to-play
  facade** (poster image + play button; load the iframe only on interaction) so the embed
  costs nothing until played and doesn't tank performance. Providers handle transcoding,
  adaptive bitrate, and global delivery for free. This is the right fit for showreels.
- **Secondary: self-hosted short clips on R2.** Admin uploads an **already web-optimized**
  MP4 (H.264/AAC, ≤1080p) and optional WebM. Served from R2 (zero egress) with
  `preload="none"`, a poster frame, and `playsinline`. We **cannot transcode for free**, so
  the dashboard must enforce limits (duration, resolution, byte size) and clearly tell the
  admin to export web-ready files. Optional enhancement: client-side transcode via
  `ffmpeg.wasm` (heavy; treat as P2).
- **Paid upgrade path (documented, not built): Cloudflare Stream** for automatic adaptive
  streaming + thumbnails when budget allows.

`media_assets.kind` distinguishes `video_embed` vs `video_file` so the renderer picks the
right player.

---

## 12. Categories management (requirement 4)

CRUD on `categories`: create/rename, set `kind` (photography/videography/both), optional
accent (must be a design token, not a one-off color), **drag-to-reorder** (`sort_order`),
and delete with a guard ("N projects use this category — reassign or confirm"). Slugs are
auto-generated from the title and stable once published (changing a slug breaks links —
warn). All writes go through RLS-protected Supabase calls.

---

## 13. Dashboard & uploads by category (requirements 2 & 3)

Landing route `/admin` after login. Layout: left nav (Projects, Categories, Media,
Homepage, Pages, Inquiries, Settings), main content area, design-token styling matching the
Bajgart-inspired editorial system, fully keyboard navigable with visible focus.

Upload-by-category UX:

- From a category or project, "Add media" opens an uploader (drag-drop + file picker,
  multi-file, per-file progress, retry).
- Each upload: presign → PUT to R2 → create `media_assets` → attach to the project/category.
- Require `alt` text for images before publish (a11y gate).
- Grid of existing media with reorder, replace, delete, and "set as cover".

Dashboard home shows quick stats (counts, drafts, recent inquiries) and a **Publish** button
(§14) with last-published timestamp.

---

## 14. Publishing model

**Decision: runtime `catalog.json` (no rebuilds).**

- Admin edits write to Supabase (drafts included).
- **Publish** calls a Pages Function (admin-JWT-verified) that reads the published rows,
  composes a versioned `catalog.json` (categories, projects, media, settings — only
  `status = 'published'`), and writes it to R2 at a stable public path
  (`catalog/latest.json`, plus a timestamped copy for rollback).
- The **public static site fetches `catalog/latest.json` at runtime** and renders galleries.
  No rebuild, instant updates, and the live site never touches Supabase (survives the 7-day
  pause). R2 has zero egress so reads are free.

Trade-off: gallery content isn't in the initial static HTML, so it's weaker for SEO/LCP than
baked HTML. Mitigate with prerendered page shells, `<link rel="preconnect">` to the media
domain, an edge-cached `catalog.json`, and server-rendered `<title>`/meta per static route.

**Alternative (document, optionally add later): rebuild on publish.** Publish triggers a
Cloudflare Pages deploy hook → Next rebuilds with content baked into HTML (best SEO).
Costs a 1–2 min delay and a build pipeline. Offer as an SEO-max upgrade.

Either way, ship a `catalog.json` **schema + version field** and validate it on read with a
typed adapter (versioned, isolated — matches the persistence rule in `AGENTS.md`).

---

## 15. What else the admin needs (requirement 6)

For a photography/videography agency to run the site **without a developer**, prioritize:

**P0 — this build**

- Projects/collections CRUD with ordered mixed media (images + videos), draft/publish,
  featured flag, client/year/credits, cover selection.
- Categories (§12). Media library with alt text, reorder, replace, delete, "where used".
- **Homepage curation:** choose hero media, featured reel, and which projects/order appear.
- **Site settings:** agency name, tagline, logo, contact email/phone/WhatsApp, location,
  social links (Instagram/YouTube/Vimeo/Behance).
- **Contact/inquiry capture:** public contact form → Pages Function → `inquiries` row +
  email notification (e.g. Resend free tier or a Supabase function). Admin "Inbox" to read
  and mark handled. This turns the portfolio into a lead source.
- **Per-page SEO & social sharing:** title, description, Open Graph image, favicon.
- **Publish + last-published timestamp; preview drafts before publishing.**

**P1 — next**

- About page editor: bio, team members (name/role/photo), clients/brand logos, awards.
- Testimonials. Services/packages descriptions.
- **Cloudflare Web Analytics** (free, privacy-friendly) toggle.
- Audit log of admin changes; `catalog.json` version history + one-click rollback.
- Export/backup (download current `catalog.json`).

**P2 — future**

- Navigation/menu editing, multi-admin + roles, scheduled publishing, client-share private
  galleries, `ffmpeg.wasm` transcoding, Cloudflare Stream integration, multi-language.

---

## 16. Repository architecture mapping

Follow `AGENTS.md` exactly: feature folders with a deliberate `index.ts` public API, routes
import only via `@/features/<name>`, shared code is domain-neutral, **authored
`.ts/.tsx/.css/.mjs` ≤ 80 lines**, one unit per file, Server Components default with
`"use client"` only at interaction boundaries, design tokens only.

```text
src/
  app/
    admin/
      layout.tsx                 (server shell; mounts AdminProvider + AdminRoute)
      page.tsx                   (dashboard)
      login/page.tsx
      auth/callback/page.tsx
      categories/page.tsx
      projects/page.tsx
      ...
  features/
    auth/                        Supabase session + AdminRoute + Google sign-in/out
      index.ts
      state/session-state.ts     (Recoil atom: session + admin claim)
      components/admin-route.tsx
      components/google-sign-in.tsx
      lib/...
    media/                       upload, media library, CloudflareImage usage
      lib/build-transform-url.ts (+ test)
      lib/presign-client.ts
      components/uploader.tsx
    categories/                  category CRUD + reorder
    projects/                    project CRUD + gallery ordering + publish
    settings/                    site settings + SEO
    inquiries/                   admin inbox
    catalog/                     catalog.json schema, typed read adapter (public site)
  shared/
    supabase/                    browser client factory (domain-neutral infra)
    ui/                          CloudflareImage + existing primitives
functions/                       Cloudflare Pages Functions (outside src)
  api/uploads/sign.ts            (presign; verifies JWT + admin claim)
  api/publish.ts                 (compose + write catalog.json to R2)
  _lib/                          JWT verify, R2 S3 signer (shared by functions)
supabase/
  migrations/*.sql               schema + RLS + hook
  seed.sql
```

Recoil owns cross-route admin/session UI state (per `AGENTS.md`); ephemeral form state is
local. Browser persistence (Supabase session, any cached catalog) goes through a versioned,
validated adapter. **Functions live outside `src`** and run on the Workers runtime; still
keep them small and put shared logic (JWT verify, S3 signing) in `_lib` modules.

---

## 17. Environment & secrets

Public (in bundle — safe only with RLS):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_MEDIA_BASE_URL` (e.g. `https://media.example.com`)

Function secrets (Cloudflare Pages project settings — never in the bundle):

- `SUPABASE_JWKS_URL` (or project ref) for JWT verification
- `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`
- `R2_PUBLIC_BASE_URL`
- `RESEND_API_KEY` (optional, inquiry emails)

Ship a committed `.env.example` documenting the public vars. Add a runtime check that fails
fast (with a friendly admin message) if Supabase env is missing.

---

## 18. Security model (explicit)

- **Boundary = RLS + JWT-verifying function.** The client route guard only hides UI.
- Single admin via `admins` allow-list + JWT `user_role` claim; every write policy checks it.
- Upload function verifies JWT signature/expiry/claim before issuing a **short-lived**
  presigned URL; enforces content-type + size; secrets stay server-side.
- R2 bucket: originals private at the API level, served read-only through the public media
  domain; CORS limited to the site origin for `PUT`.
- `inquiries`: anon `insert` only, admin `select` only. No public read of leads.
- Rate-limit `/api/uploads/sign` and `/api/publish` (per-IP / per-user) to avoid abuse.
- Never expose service-role keys or R2 keys to the browser. Anon key is fine (RLS-gated).

---

## 19. UI quality & accessibility

- Use existing **design tokens** (`src/styles/tokens.css`); no one-off colors/spacing/radii.
- Preserve the Bajgart-inspired editorial system across the admin too (it's the client's
  brand surface).
- Full keyboard navigation, visible focus rings, `prefers-reduced-motion` honored, adequate
  contrast in light and dark themes.
- Uploader, drag-reorder, and dialogs must be operable without a mouse and announced to
  screen readers.
- Validate desktop + mobile in a real browser; capture evidence (per `AGENTS.md`).

---

## 20. Testing & delivery gates

Non-negotiable before claiming done (from `AGENTS.md`):

- `npm run check` (format, architecture, lint, typecheck, tests)
- `npm run build:pages` and `npm run verify:pages`
- `npm run architecture:check`

Add tests for: `buildTransformUrl`, the `catalog.json` schema adapter (version + validation),
the session/admin-claim selector, and `AdminRoute` redirect behavior (mirror the existing
`private-route.test.tsx`). Document RLS expectations and include a SQL smoke note. Manual
browser verification on desktop + mobile with screenshots.

---

## 21. Build phases (milestones)

1. **Foundations:** Supabase project, Google OAuth, schema + RLS + token hook; `src/shared/supabase` client; `src/features/auth` (session atom, Google sign-in, `AdminRoute`); `/admin/login` → dashboard redirect. Retire demo guard.
2. **Media pipeline:** R2 bucket + custom domain + transformations; `functions/api/uploads/sign`; `media` feature (uploader + `CloudflareImage` + `buildTransformUrl`).
3. **Content management:** categories + projects CRUD, gallery ordering, video embeds, drafts.
4. **Publish + public read:** `functions/api/publish` → `catalog.json` in R2; `catalog` read adapter; wire public pages to the catalog.
5. **Run-the-business:** site settings, SEO, homepage curation, inquiries inbox + contact form.
6. **Polish:** analytics, audit log, rollback, export, a11y pass, perf pass, evidence.

---

## 22. Work split for implementation agents

To let **Codex** and **Cursor** work in parallel without collisions, split by lane:

**Codex lane — backend & platform** (`supabase/`, `functions/`, `src/shared/supabase`, env,
hosting config):

- Supabase migrations: schema, RLS policies, custom access token hook, seed.
- `functions/api/uploads/sign` and `functions/api/publish` (+ `_lib` JWT verify & R2 S3 signer).
- `.env.example`, Cloudflare Pages config notes, R2/CORS/custom-domain runbook (§23).
- Tests for signing/JWT logic where feasible; document RLS smoke checks.

**Cursor lane — frontend & UX** (`src/app/admin`, `src/features/auth|media|categories|projects|settings|inquiries|catalog`, `src/shared/ui`):

- `auth` feature + `AdminRoute` + login/callback + redirect-to-dashboard.
- `CloudflareImage` + `buildTransformUrl` + uploader UI (consuming Codex's sign endpoint).
- Categories + projects CRUD UI, gallery ordering, video-embed input.
- `catalog` read adapter + wiring public pages; settings/SEO/homepage/inquiries UI.

**Shared contract (both must honor):** the `sign` endpoint request/response shape, the
`media_assets`/`catalog.json` schemas, env var names (§17), and the `AGENTS.md` rules.
Define these types in `src/features/catalog` (or a shared `types` module) **first** and treat
them as the integration seam. Neither lane edits the other's folders without coordinating.

---

## 23. Setup runbook (one-time, by the developer)

1. **Supabase:** create project; enable Google provider (add Google OAuth client ID/secret;
   set authorized redirect to the Supabase callback URL); run migrations; enable the Custom
   Access Token hook; insert the owner's `uid` into `admins`.
2. **Google Cloud:** create OAuth consent screen + Web client; authorized redirect URI =
   `https://<project>.supabase.co/auth/v1/callback`; add the site origin to authorized
   origins.
3. **Cloudflare:** add the domain (zone); create R2 bucket; bind a public custom domain
   (`media.…`); enable Images → Transformations; set R2 CORS for the site origin.
4. **Cloudflare Pages:** connect repo; build `npm run build`, output `out`; set public env
   vars + function secrets (§17); add the upload/publish functions.
5. **DNS/zone:** ensure the media domain is **proxied** (orange cloud) so `/cdn-cgi/image/`
   works.
6. Sign in once as the owner, confirm the admin claim appears in the JWT, upload a test
   image, publish, and verify the public site renders it through the transform URL.

---

## 24. Acceptance criteria

- [ ] Only the allow-listed Google account can reach `/admin`; everyone else is redirected.
- [ ] After login the admin lands on the dashboard automatically.
- [ ] Admin can create/rename/reorder/delete categories.
- [ ] Admin can upload images by category; files go **directly to R2**; metadata in Supabase.
- [ ] Public images are served optimized via `/cdn-cgi/image/` with `format=auto` + `srcset`,
      and the project stays within the free transform budget.
- [ ] Video works via embeds (and optional R2 clips) with a performant click-to-play facade.
- [ ] Admin can edit site settings, homepage curation, SEO, and read contact inquiries.
- [ ] Publishing updates the live site with **no developer and no rebuild** (catalog.json).
- [ ] Public site keeps working even if the Supabase project is paused.
- [ ] No secret (R2 keys, service role) is present in the client bundle.
- [ ] `npm run check`, `build:pages`, `verify:pages`, `architecture:check` all pass; files
      ≤80 lines; features expose clean `index.ts` APIs; a11y verified on desktop + mobile.

---

## 25. Design-review hardening (read before building)

Findings from an adversarial review of this spec. Fold the [P1] items into the relevant
phases — they are build-blockers or security gaps, not nice-to-haves.

**[P1] A custom domain on Cloudflare is a prerequisite, not optional.** `/cdn-cgi/image/`
transformations and the R2 media domain require a Cloudflare-proxied **zone**. They do **not**
work on a bare `*.pages.dev` URL. The agency must point a real domain at Cloudflare before
images can be optimized. Put this first in the runbook (§23) and treat "no domain yet" as a
blocker for §10.

**[P1] Spam-protect the public contact form.** The `inquiries` endpoint is a public,
unauthenticated Pages Function. Bots will find it and burn the ~100k/day request budget and
flood the table. Add **Cloudflare Turnstile** (free) to the form and verify the token inside
the function before inserting. Without this, "manage without a developer" breaks the first
time a scraper hits it.

**[P1] Migrate existing content as an explicit step.** The live site renders hardcoded
`src/features/home/home-data.ts` (5 categories, 4 projects). Phase 4 must (a) seed those rows
into Supabase, (b) publish the first `catalog.json`, and (c) switch the public pages to the
catalog adapter **in one change**, so the live site never shows empty galleries mid-migration.
Add a seed script and a before/after visual check.

**[P1] Verify Supabase JWTs with asymmetric keys, not the legacy shared secret.** Enable
Supabase's **asymmetric JWT signing keys** and verify in the function against the project
**JWKS endpoint** (`/.well-known/jwks.json`), checking `iss`, `aud`, `exp`, and allowing small
clock skew. Never ship the legacy HS256 `JWT_SECRET` anywhere near the client, and prefer not
to depend on it server-side either. Cache JWKS; handle key rotation.

**[P2] Lock down the presigned PUT.** The function (not the client) generates the `r2_key`
(prevents overwriting arbitrary objects), pins `Content-Type`, and uses a short TTL (≤60s).
Presigned PUT cannot hard-enforce max size, so also: validate size/type client-side, set a
sane declared-size check, and **verify the object server-side** (HEAD for size, decode for
dimensions) before the `media_assets` row is trusted/published. Restrict R2 CORS `PUT` to the
admin origin only.

**[P2] Per-project link previews need static HTML.** With the runtime-`catalog.json` default,
gallery content isn't in the crawled HTML, so per-project Open Graph/Twitter cards won't render
when the agency shares a project link on Instagram/WhatsApp/LinkedIn. If link previews matter
(they usually do for an agency), **pre-render known project slugs at build** and hydrate fresh
data at runtime (hybrid), or adopt rebuild-on-publish for project pages. Keep site-level OG as
the floor.

**[P2] Make `catalog.json` reads cheap and fresh.** Serve it with
`Cache-Control: max-age=60, stale-while-revalidate=86400` on the media domain and include a
`version` + `publishedAt` field. Edits appear within ~a minute; reads stay edge-cached and
free. The typed read adapter must validate `version` and fail soft (render last-good) on a
malformed catalog.

**[P2] Images must fail open, not blank.** When the monthly transform budget is exhausted,
Cloudflare returns HTTP 9422 and the transformed URL breaks. `CloudflareImage` must fall back
to the original R2 object on transform error so the site degrades to unoptimized images
instead of broken ones. Keep the responsive width set small (4–5 widths) to stay under 5,000
unique transforms/month.

**[P2] Sync auth state through one effect into Recoil.** Subscribe to
`supabase.auth.onAuthStateChange` in a single effect that writes the session + admin claim
into the Recoil atom (effects synchronize external systems; render derives from the atom —
per `AGENTS.md`). Don't read the session ad hoc in components.

**[P2] Rate-limiting on free tier is limited.** True per-IP limiting needs Workers KV/Durable
Objects (KV free tier is small; DO is paid). For one admin, lean on the admin-claim gate +
short presign TTL; for the public form, Turnstile is the practical free defense. Document this
rather than pretending we have full rate limiting.

**Note:** An independent Codex CLI review was attempted (`codex exec`, read-only) but Codex
returned a usage-limit error before producing findings; re-run after the quota resets for a
second opinion. The items above are from a manual L7 review.

```

```
