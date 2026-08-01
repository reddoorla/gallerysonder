# Gallery Sonder

The gallerysonder.com website. SvelteKit 2 + Svelte 5, content from [Prismic][prismic],
deployed to Netlify, part of the Red Door fleet (shared CI, lint, a11y and forms
tooling live in [`@reddoorla/maintenance`][maintenance]).

Production: <https://gallerysonder.com> — the apex is canonical; `www` 301-redirects to it.

## Running it

```sh
pnpm install
pnpm dev          # vite + Slice Machine together
pnpm vite:dev     # vite alone (what the test suite starts)
```

Copy `.env.example` to `.env` first — it documents every variable the code reads and
which ones fail silently when unset.

## Scripts

| script            | what it does                                |
| ----------------- | ------------------------------------------- |
| `pnpm dev`        | Vite dev server + Slice Machine             |
| `pnpm build`      | Production build (`adapter-netlify`)        |
| `pnpm check`      | `svelte-check` against `tsconfig.json`      |
| `pnpm lint`       | Prettier check + ESLint                     |
| `pnpm format`     | Prettier write                              |
| `pnpm test:smoke` | Playwright smoke suite against a dev server |

There is deliberately **no** `test` script: the shared CI workflow runs a "Test (if
present)" step and a separate "Smoke test (if present)" step, so aliasing the two made
every pull request run the same Playwright suite twice.

Run the suite on its own port when other Vite servers are around — Playwright reuses
whatever is already listening on 5173, which will silently test the wrong site:

```sh
REDDOOR_SMOKE_PORT=5399 pnpm test:smoke
```

## Layout

```
src/lib/slices/       Prismic slices (Slice Machine owns these folders)
src/lib/components/   Shared UI (Nav, Footer, Gallery, Lightbox, …)
src/lib/utils/        Pure helpers — the ones with tests worth reading
src/routes/[[preview=preview]]/   Every content route, preview-aware
src/routes/sitemap.xml/           Prerendered sitemap
tests/smoke/          Playwright specs; `routes.ts` is the per-site route manifest
```

Two places must stay in sync when a Prismic document type gains a public route: the
route resolver in [`src/lib/prismicio.js`](src/lib/prismicio.js) and `TYPE_PATHS` in
[`src/routes/sitemap.xml/+server.js`](src/routes/sitemap.xml/+server.js). A type missing
from the resolver still passes `isFilled.link()` but resolves to `url: undefined`, which
renders links as dead buttons rather than failing.

## CI

[`.github/workflows/ci.yml`](.github/workflows/ci.yml) calls the pinned shared workflow
(Prettier, ESLint, `svelte-check`, build, a11y audit, smoke). Lighthouse, dependency and
security checks run fleet-wide from the maintenance dashboard, not here.

[prismic]: https://prismic.io/
[maintenance]: https://github.com/reddoorla/reddoor-maintenance
