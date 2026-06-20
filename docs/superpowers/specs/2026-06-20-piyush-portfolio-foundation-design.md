# Piyush Portfolio Foundation Design

## Scope

Create a production-ready Next.js foundation for a portfolio hosted as a static GitHub Pages site.

## Architecture

- Use Next.js App Router with React, TypeScript, and Tailwind CSS.
- Export the application as static files into `out/`.
- Use a build-time `PAGES_BASE_PATH` so local builds work at `/` while GitHub project Pages works at `/piyush-portfolio`.
- Keep public routes fully static.
- Implement the private route as a client-side demonstration guard backed by `localStorage`. It must never contain secrets or genuinely private content because all static assets are publicly downloadable.

## Routes

- `/`: public starter page.
- `/about`: public route demonstrating normal static navigation.
- `/login`: public client-side demo login.
- `/private`: statically exported page whose visible content is gated in the browser.

## Quality Controls

- Strict TypeScript.
- ESLint with Next.js defaults.
- Prettier with Tailwind class sorting.
- Vitest and Testing Library for route-guard behavior.
- CI checks for formatting, linting, type safety, tests, and static export.

## Deployment

- Git remote: `https://github.com/rachit1994/piyush-portfolio.git`.
- GitHub Actions builds with `PAGES_BASE_PATH=/piyush-portfolio`.
- The workflow uploads `out/` with the official Pages artifact action and deploys with the official Pages deployment action.
- GitHub Pages source must be configured to **GitHub Actions** in repository settings.

## Security Boundary

The `/private` route is a user-experience guard only. GitHub Pages cannot enforce server-side authentication. Any sensitive content requires an external authenticated backend or a hosting platform with server-side middleware.
