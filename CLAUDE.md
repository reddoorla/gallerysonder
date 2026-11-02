# CLAUDE.md

Session rules for AI agents working on **Gallery Sonder** — the
gallerysonder.com website. SvelteKit 3 / Svelte 5, content from Prismic,
deployed to Netlify, part of the Red Door fleet (shared CI, lint, a11y and forms
tooling come from `@reddoorla/maintenance`).

[README.md](README.md) is the operating manual — how to run it, every script,
and the repo layout. Read it before changing anything. Three things from it are
worth repeating because they are easy to get wrong:

- **`pnpm test` must never run the smoke suite.** Shared CI runs a "Test (if
  present)" step and a separate "Smoke test (if present)" step, so aliasing the
  two made every pull request run the same Playwright suite twice. `pnpm test`
  is `node --test` over `scripts/`, the kit 3 config and env-declaration gate
  (SvelteKit 3 exposes only the variables `src/env.ts` declares; an undeclared
  read is silently `undefined`), then `vitest run` over `src/**/*.test.ts`.
  Use `pnpm test:smoke` for Playwright.
- **Run the smoke suite on its own port** when other Vite servers are around —
  Playwright reuses whatever is already listening on 5173, which silently tests
  the wrong site. `REDDOOR_SMOKE_PORT=5399 pnpm test:smoke`.
- **A new public Prismic document type must be added in two places**: the route
  resolver in `src/lib/prismicio.js` and `TYPE_PATHS` in
  `src/routes/sitemap.xml/+server.js`. A type missing from the resolver still
  passes `isFilled.link()` but resolves to `url: undefined`, so links render as
  dead buttons rather than failing.

`prismicio-types.d.ts` (at the project root) and `src/lib/slices/index.ts` are
**generated** by the Prismic CLI (`pnpm prismic:gen`; Slice Machine is gone,
deprecated by Prismic 2026-09-18). Models live in `customtypes/<id>/index.json`
and `src/lib/slices/<Slice>/model.json`: edit one, regenerate, commit both. The
`prismic-codegen` job fails a PR whose generated files are stale, and both are in
`.prettierignore`. Code imports the types by relative path to the root file
(`'../../../prismicio-types'` from `src/lib/<dir>/`). Run by an agent, the CLI
refuses without `--task-id` and `--user-intent`, so an agent runs
`pnpm exec prismic task-id` once, then
`pnpm exec prismic gen types --task-id <id> --user-intent "<the ask>"` and the
same for `gen slice-index`. Never `prismic push` or `prismic pull`: both delete
to match. `/slice-simulator` is server-rendered on purpose: `src/hooks.server.ts`
gives it the Type Builder's framing policy, which netlify.toml's static `/*`
header would otherwise replace.

## Tests build; they don't freeze

Tests are how an agent builds against a comp without a human watching: a
geometry spec that measures a band against the Figma frame is exactly the
instrument that gets the band right. Once the slice ships, the same spec
becomes a fence around a design decision a human is entitled to change, and it
turns a one-line tweak into a CI round trip. On roalson-interests a taller
masthead, a back button and an arrow on a button cost the developer five gutted
tests (roalson-interests#251), and not one of the five reds was a bug. The suite
is tiered by what a red _means_ (the tiers come from reddoor-starter#180):

| Tier                | Command                                     | Runs                                          | Holds                                                                                                                                      |
| ------------------- | ------------------------------------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **Gate** (contract) | `pnpm test:smoke` (Playwright `@smoke`)     | every PR, in the shared workflow's smoke step | what a client would call a bug: links and their targets, the forms and their payloads, keyboard and focus, no-JS, data, SEO, the axe scans |
| **Nightly**         | `pnpm test:nightly` (Playwright `@nightly`) | `nightly.yml`, never blocks a merge           | the scroll-lock specs, the name-list hover and the lightbox-link crawl: real behaviour, but they wait on a clock                           |
| **Scaffold**        | `pnpm test:scaffold` (`pnpm test:e2e`: all) | on demand, while building                     | comp geometry, pixel and computed-style pins: the hero baseline, the form button typeface and the Subscribe arrow                          |

`pnpm test` (node --test and vitest) is unchanged and still never runs
Playwright. Unit tests run in the shared "Test (if present)" step, and
`test:smoke` in its separate "Smoke test (if present)" step, so what blocks a
merge is the `@smoke` tier and nothing else from Playwright, apart from the
shared workflow's own a11y audit step, which is also Playwright plus axe but
scans only the two synthetic `/dev` fixture routes (`/dev/a11y-fixtures` and
`/dev/animate-in`), so it is not coverage of any real page.

- **A human's design change wins.** When a size, spacing, colour that still
  passes AA, duration, border, or an added button or link turns a test red,
  the test is what is wrong: update it or delete it in the same PR. Never revert
  the change to satisfy the test, and never argue for the pinned value.
- **Design values never enter the gate.** A gate test asserts what a user or a
  caller observes, never a Tailwind class list, a px, a ms, an opacity, or a
  recorded contrast ratio to four places (assert `>= 4.5`). Exact-list equality
  over things a designer may add to is a pin: assert the item that matters is
  _in_ the list.
- **Never assert on source as text.** A test that reads a `.svelte` or `.css`
  file and regexes a class out of it restates the implementation, so every
  edit is two edits.
- **Build against the comp freely.** New geometry and timing specs are welcome
  while a slice is being built; leave them untagged and they land in the
  scaffold tier, where they are allowed to go stale once a human takes over the
  design.
- **`@smoke` is earned.** A test tagged `{ tag: '@smoke' }` has no fixed
  sleeps, no frame counting, no animation windows, no `boundingBox`, no
  computed-style colour or size, and no element count a new button would
  change.
- **A flaky timing test leaves the gate; its window does not widen.** Tag it
  `{ tag: '@nightly' }` instead of `@smoke`, or delete it if it guards nothing
  a client would notice. A nightly test whose sleep is replaced by a wait on a
  real signal can be promoted to `@smoke`.

## The work journal

**Every working session appends a dated entry to `docs/workJournal.md`** — what
was done and **why**, newest at the bottom, never corrected in place. Write it
as the last act of the session, not the first act of the next one.

The journal is the history of executing the build. Code says what the system
does now; the journal says what it used to do, what it cost to change, and
which beliefs turned out to be wrong. Nearly everything expensive to rediscover
lives there and nowhere else.

An entry is headed with the date, a short title, and where it landed:

```markdown
## 2026-09-04 — Both runway stages render their final frame without JS (#51, `ce46ae0`)
```

Then prose — not a bullet list of file names, which the diff already tells you.
What to put in, in rough order of value:

- **Why, over what.** The reason a thing was done survives; the diff does not
  need restating.
- **Measured numbers, exactly.** "The comp's open mask is 2696×2352 on an 860px
  band — 2.735× the band's height, so a 390×664 phone needs ~534%" is worth
  keeping. "Fixed the hero on mobile" is not.
- **Defects, named.** What broke, what it looked like, and what made it
  invisible until it wasn't.
- **What was tried and abandoned**, and what it would take to revive it. A dead
  end nobody wrote down gets walked twice.
- **Beliefs corrected on contact.** The design assumption that turned out false
  is usually the most valuable line in the entry.
- **Honest accounting.** If a win came from somewhere other than the change
  that claimed it, say so — that is exactly what someone will otherwise
  over-invest in next.

**History is never edited to be right.** An entry that stops being true is not
rewritten; a later entry corrects it, and says which one it corrects. The
journal is a record of what was believed at the time, and that record is most
useful precisely where it was wrong. Fixing the past in place destroys the only
evidence of how the mistake was made.

The one edit an old entry may take is a **forward pointer**: one line directly
under its heading naming the entry that overturned it — `> Superseded in part by
2026-10-14 — <that entry's title>.` It asserts nothing new and retracts nothing,
so the record of what was believed survives whole; it only stops a reader who
lands on the old paragraph from leaving with the old answer. Without it the rule
above is half a mechanism: the correction exists at the bottom of the file, and
nothing points to it from where a reader actually arrives.

If a session produced nothing worth an entry, that is itself worth one line.
