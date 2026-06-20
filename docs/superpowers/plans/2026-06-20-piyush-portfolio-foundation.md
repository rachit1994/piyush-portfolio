# Piyush Portfolio Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build and deploy a stable, statically exported Next.js portfolio foundation with public routes and a clearly scoped client-side private-route demonstration.

**Architecture:** Next.js App Router pages are exported to `out/`, with a build-time base path for GitHub project Pages. Authentication state is isolated in a small client module and guards only rendered UI; no sensitive data is included in the static bundle.

**Tech Stack:** Next.js, React, TypeScript, Tailwind CSS, ESLint, Prettier, Vitest, Testing Library, GitHub Actions, GitHub Pages

## Tasks

- [x] Scaffold current stable Next.js and pin current compatible direct dependencies.
- [x] Add formatting, linting, strict type checking, and browser-component tests.
- [x] Implement public routes and a tested client-side private-route guard.
- [x] Configure static export, trailing slashes, and a GitHub Pages base path.
- [x] Add export verification and a GitHub Pages deployment workflow.
- [x] Run final quality, root export, Pages export, and browser smoke checks.
- [ ] Commit, push, enable Pages, and verify the live URL.
