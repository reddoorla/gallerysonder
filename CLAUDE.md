# CLAUDE.md

Session rules for AI agents working on **Gallery Sonder** — the
gallerysonder.com website. SvelteKit 2 / Svelte 5, content from Prismic,
deployed to Netlify, part of the Red Door fleet (shared CI, lint, a11y and forms
tooling come from `@reddoorla/maintenance`).

[README.md](README.md) is the operating manual — how to run it, every script,
and the repo layout. Read it before changing anything. Three things from it are
worth repeating because they are easy to get wrong:

- **There is deliberately no `test` script.** Shared CI runs a "Test (if
  present)" step and a separate "Smoke test (if present)" step, so aliasing the
  two made every pull request run the same Playwright suite twice. Use
  `pnpm test:smoke`.
- **Run the smoke suite on its own port** when other Vite servers are around —
  Playwright reuses whatever is already listening on 5173, which silently tests
  the wrong site. `REDDOOR_SMOKE_PORT=5399 pnpm test:smoke`.
- **A new public Prismic document type must be added in two places**: the route
  resolver in `src/lib/prismicio.js` and `TYPE_PATHS` in
  `src/routes/sitemap.xml/+server.js`. A type missing from the resolver still
  passes `isFilled.link()` but resolves to `url: undefined`, so links render as
  dead buttons rather than failing.

Slice Machine owns the folders under `src/lib/slices/`, and `customtypes/` is
its model directory — regenerating overwrites what is in them.

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

If a session produced nothing worth an entry, that is itself worth one line.
