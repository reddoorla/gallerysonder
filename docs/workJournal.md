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

## 2026-09-10 — Form submissions announce themselves on the dataLayer, on success only

Carlo Valentino (Gallery Sonder's part-time digital marketer) finally has
publish rights on `GTM-5FVCTMK7` — Josh granted them 2026-09-03 — and today he
shipped the first conversion tag and asked whether it looked right before
building the other three. It does not, and the reason is worth writing down
because the tag looks completely healthy in the GTM UI.

**What he built.** A GA4 Event tag, `rsvp_submit`, measurement ID
`G-KF2C19YMQX`, firing on _Click - All Elements_ where _Click Text contains
"Submit RSVP"_. Verified live rather than taken from the screenshots: fetching
`gtm.js?id=GTM-5FVCTMK7` returns 460,815 bytes containing both
`"vtp_eventName":"rsvp_submit"` and the predicate
`{"function":"_cn","arg0":["macro",2],"arg1":"Submit RSVP"}`, so it is published
in the served container, not sitting in his workspace.

**Why a click trigger is the wrong instrument here.** The button at
`src/routes/[[preview=preview]]/rsvp/[uid]/+page.svelte:146` is
`onclick={triggerSubmitButton}`, and the POST is _awaited inside_ that handler.
GTM fires on the press — ahead of Turnstile, ahead of the network, ahead of any
knowledge of the outcome. Failed posts, spam-blocked posts and double-taps all
became conversions.

The sharper edge, and the thing nobody would find by reading the container:
**the visible RSVP inputs are not inside a `<form>`.** That page has zero
`<form>` tags; the real one is the hidden `#netlifyRsvpForm` in
`+layout.svelte:300`, populated field-by-field at submit time. So the `required`
attributes on `#rsvp-name` / `#rsvp-email` are decorative — nothing validates
them — and a visitor landing on the page and mashing Submit RSVP with three
empty fields registered a GA4 conversion and no database row. The net effect is
that GA4 reads _above_ the truth, in the opposite direction from the
consent-gating undercount everyone on the thread was braced for.

**The fix, and where it went.** All four forms — rsvp, inquiry, contact,
newsletter — funnel through `submitForm()` in `src/lib/utils/forms.ts`, which
already knows the formType, the field entries and the folded UTM string, and is
the only place that knows whether the ingest endpoint returned 2xx. One push
site there covers all four; four call-site edits were never necessary.

**The footgun that nearly shipped.** The RSVP form's own field for the
exhibition title is named `event` — and `event` is the reserved dataLayer key
that names the custom event to GTM. An allow-list that copied field names
through verbatim would have overwritten `rsvp_submitted` with
"Live at Gallery Sonder: Taji" and silently unhooked the trigger it was built
to feed. `ANALYTICS_FIELDS` therefore maps field → parameter explicitly
(`event` → `exhibition`, `event_uid` → `exhibition_uid`) rather than listing
bare names, and both the code comment and a test assertion say why, because the
map reads like pointless indirection right up until it doesn't.

The map is also an allow-list rather than a spread of `entries` on purpose:
those entries carry name, email, phone and the free-text message, and GA4 must
not receive PII. `guests` is coerced to a number so GA4 can sum expected heads
instead of grouping the string "3".

**Consent.** The push is unconditional. GTM is injected only after the visitor
accepts (`CookieConsent.svelte:13`), so for anyone who declined the dataLayer is
an inert in-memory array nothing ever reads, and for anyone who accepts later
GTM replays the queue — standard buffering. GA4 will still undercount against
the database; that remains true and still needs saying before anyone compares
the two numbers.

**Tests.** `tests/smoke/form-analytics.spec.ts`, four cases. The load-bearing
pair is "a successful RSVP announces rsvp_submitted" and "a failed RSVP
announces nothing" — a click trigger cannot tell those two apart, which is
precisely the defect. Consent is pre-answered `'false'` in an init script, which
both dismisses the 3s modal and leaves GTM uninjected, so `window.dataLayer`
holds exactly what the site pushed and nothing a container replayed. Full suite
green: 86 passed, 3 skipped.

**Also found in the live container, not fixed here** (Carlo's to change, and
told to him rather than done for him): the `Inquire PDF Click` tag is hardcoded
to the Euphorbia PDF in both its trigger URL and its `file_name` parameter, so
it dies the day the show rotates; and its `link_url` parameter value was pasted
as markdown, so GA4 is recording the literal string
`[https://…pdf](https://…pdf)`, brackets included. Hotjar is still firing on All
Pages, and the 2026-09-02 proposal to remove it is still unanswered.

**Note on lint.** `pnpm lint` is red on `.vscode/settings.json`, which is
untracked and predates this work — the known fleet `sync-configs` artefact, not
anything here. Both changed files pass prettier and eslint individually;
`svelte-check` is 0 errors, 2 pre-existing warnings.
