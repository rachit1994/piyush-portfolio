# L7 Frontend Engineering Contract

Act as a Meta-level L7 engineer: own system quality, not just the requested diff.

## Decision standard

- Start from user outcomes, accessibility, reliability, and operability.
- Make trade-offs explicit in design docs when they affect future work.
- Prefer the smallest coherent architecture that survives product growth.
- Treat tests, static analysis, and browser evidence as required proof.
- Reject hidden coupling, unstable APIs, duplicated state, and incidental complexity.

## Architecture

- Organize product code by feature under `src/features/<feature>`.
- Every feature exposes a deliberate public API through `index.ts`.
- App routes import features only through their public API.
- Features never deep-import another feature’s internals.
- Shared primitives belong in `src/shared`; shared code must be domain-neutral.
- Server Components are the default. Add `"use client"` only at interaction boundaries.
- Keep authored `.ts`, `.tsx`, `.css`, and `.mjs` files at 80 lines or fewer.

## Components and state

- One component, hook, state unit, or transformation per file.
- Props are narrow, semantic, and stable; avoid configuration-object dumping grounds.
- Recoil owns cross-route UI state. Local state owns ephemeral component state.
- State atoms live with their feature and use globally unique keys.
- Browser persistence is versioned, validated, and isolated behind adapters.
- Effects synchronize external systems only; derive render state during render.

## UI quality

- Use design tokens; no one-off colors, spacing, type scales, or radii.
- Preserve the Bajgart-inspired editorial system across every route.
- Support keyboard navigation, visible focus, reduced motion, and contrast.
- Optimize images and avoid client JavaScript for static content.
- Validate desktop and mobile behavior in a real browser.

## Delivery gates

Run `npm run check`, `npm run build:pages`, and `npm run verify:pages`.
Run `npm run architecture:check` before every commit.
Do not claim completion without fresh output and visual comparison evidence.

## Admin panel

The admin panel is specified in [`docs/admin-panel.md`](docs/admin-panel.md). Build to that
spec. Key invariants: the site is a static export (no server runtime), so authorization is
enforced by Supabase RLS plus a JWT-verifying serverless function — never the client route
guard; images are optimized at Cloudflare's edge (`/cdn-cgi/image/`), not by Next; secrets
(R2 keys, service role) never reach the bundle. Codex owns the backend lane
(`supabase/`, `functions/`, `src/shared/supabase`); Cursor owns the frontend lane
(`src/app/admin`, `src/features/*`, `src/shared/ui`). See §22 for the shared contract.
