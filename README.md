# Piyush Portfolio

A statically exported Next.js portfolio foundation configured for GitHub Pages.

## Requirements

- Node.js 26.0.0 or newer compatible release
- npm 11.12.1

## Local development

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Routes

- `/` and `/about/` are public static routes.
- `/login/` enables a browser-only demo access flag.
- `/private/` demonstrates a client-side guarded route.

The private route is not a security boundary. Every exported HTML and JavaScript
file is publicly downloadable from GitHub Pages. Use an authenticated backend
and server-capable hosting before placing sensitive content behind a route.

## Quality and build commands

```bash
npm run check
npm run build
npm run verify:export
```

To reproduce the GitHub Pages project-path build:

```bash
npm run build:pages
npm run verify:pages
npm run preview
```

The production files are generated in `out/`.

## GitHub Pages deployment

The workflow at `.github/workflows/deploy-pages.yml` runs on every push to
`main`. It installs locked dependencies, runs formatting/lint/type/test checks,
builds with `/piyush-portfolio` as the base path, verifies the export, and
deploys `out/` using the official GitHub Pages actions.

In the GitHub repository:

1. Open **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Push to `main` or run **Deploy to GitHub Pages** from the Actions tab.

The expected site URL is
<https://rachit1994.github.io/piyush-portfolio/>.
