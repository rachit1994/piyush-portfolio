# Frontend Architecture

Routes are thin composition adapters. Features own content, behavior, tests, and state.

```text
src/
  app/                 Next.js route adapters and global styles
  features/
    access/            Demo-access flow
    about/             About page
    home/              Landing page and portfolio data
    navigation/        Global header and navigation
    theme/             Recoil theme state and persistence
  shared/
    ui/                Domain-neutral visual primitives
```

Every feature exports only supported consumers from `index.ts`. Internal folders may
change without affecting routes or other features. Cross-feature usage must import
from `@/features/<name>`, never from an internal path.

Recoil is retained because it is a product requirement. Recoil 0.7.7 reads a React
internal removed in React 19, so `patch-package` applies a minimal compatibility patch
that checks the public `useSyncExternalStore` API instead. A smoke test protects this
integration during dependency upgrades.
