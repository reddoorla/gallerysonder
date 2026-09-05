# Gallery Sonder — Work Journal

Running log of build work: what was done, why, and where it landed.
Chronological — newest entry at the bottom. [README.md](../README.md) says how to
run the site; this is the history of getting it here.

The convention is in [CLAUDE.md](../CLAUDE.md) under "The work journal". In
short: every working session appends a dated entry, prose over bullets, why over
what, and history is never edited to be right — a later entry corrects an
earlier one and says so.

---

## 2026-09-05 — Journal opened, and 452 commits summarised rather than reconstructed (`chore/work-journal`)

The journal starts today, so this first entry is a **backfill**: a deliberately
coarse summary written from the commit log, not from memory. Detail below this
line is trustworthy; detail above it is not, and nothing here should be cited as
though someone recorded it at the time. For anything before 2026-09-05 the
commit log is the record.

**What this repo is.** The gallerysonder.com website — an art gallery, on the
evidence of its content model. SvelteKit 2 / Svelte 5, content from Prismic,
deployed to Netlify, and now part of the Red Door fleet, which supplies the
shared CI, lint, a11y and forms tooling through `@reddoorla/maintenance`. Ten
Prismic custom types (artist, artwork, essay, exhibit, news, page, rsvp, nav,
intro_images, form_replies), six slices, and a set of components that are the
site's real character: an animated "sonder" alphabet intro built from SVG paths
and clip paths, a rotating logo, name-to-clip-path reveals, a gallery grid with
a lightbox.

**The eras, roughly.** 452 commits from `initial commit` on 2024-03-22 to here,
in three clearly separated bursts with long quiet stretches between them.

_2024 — 120 commits, almost all of them March through May._ The original build,
and it reads like one: `switched to E`, `clip is bound to O`, `favicon pt 2`,
`big sonder`. Most of the effort went into the letterform animation before
anything resembling a CMS existed; Prismic arrived on the `prismic-impl` branch
and merged in May. Then the repo went dark — two commits in the whole second
half of the year.

_2025 — 212 commits, the largest year, still hand-driven._ January through May
built the content surfaces: artists and exhibitions, the gallery grid, the
slideshow, the inner-page nav. September was a 50-commit run on forms and email
(the newsletter signup, GTM and UTMs), visible in the log as a debugging
session rather than a design one (`couldn't send email`, `response log`,
`don't touch`). RSVP landed in November as the repo's first pull request. In
December a first pass at Svelte 5 went in, explicitly noted as incomplete.

_2026 — 120 commits, and a different repo._ After five quiet months, June
carries 70 of them: onboarding onto `@reddoorla/maintenance ^0.27.0` on
2026-06-04, then config synced wholesale from the fleet — eslint, prettier,
playwright-a11y, CI, netlify, renovate — plus the move to pnpm and Node 24.
Commit messages become conventional and every change starts going through a
numbered PR. What follows through September is fleet-shaped maintenance rather
than feature work: security advisories, a Vite 8 / rolldown stack bump, an
external site audit whose findings became half a dozen fixes (dead RSVP
call-to-action, empty hrefs, missing alt text, the cookie-consent gate made a
real dialog), an a11y gate over real routes, and an SEO pass. The most recent
feature is Prismic-authored RSVP confirmation emails with Add to Calendar
(#92, #93, 2026-09-03).

**State as of this entry.** `main` at `1ef7b7c`, working tree clean, no open
pull requests. There is a second worktree at `.worktrees/rsvp-cta-guard` holding
`fix/rsvp-cta-content-guard` at `2c58c50` — that is the pre-squash version of
#94, which is already merged, so nothing is in flight there; it is leftover, not
work in progress.

**What changed today.** `CLAUDE.md` did not exist in this repo; it does now, and
it carries the work-journal convention along with the handful of things the
README already establishes about running the place. This file exists so the next
expensive discovery has somewhere chronological to live instead of being
rediscovered from the log the way this entry just was.
