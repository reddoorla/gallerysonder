# Morning brief — 2026-06-05

_First evening review for gallerysonder. Establishes the baseline. Read-only run: no commits, PRs, pushes, or live writes. All local gates were executed and pass (see "Self-healing status")._

> **Context you asked for:** you wanted to "leave this site in a good state and let the self-healing do its thing." The headline: **the build is green and the automation will run, but two pieces of the self-healing give false confidence** — the a11y gate tests a 404 page for one of its two routes, and Lighthouse/security/deps enforcement lives at the _fleet_ level (Airtable cron), not in this repo's CI. Separately, there are 3 real production-correctness bugs (consent/analytics, form failure-detection, missing-document 500s) that will silently sit there until a visitor or an editor trips them. None block walking away tonight; all are worth a morning.

---

## Top of stack (do this first)

1. **Fix the cookie-consent + GTM consent gap (~30 min).** Two bugs compound into a real GDPR/ePrivacy exposure for a gallery with EU visitors, and one is a literal typo. See CRITICAL-adjacent **HIGH-1** and **HIGH-2**. This is the highest-leverage 30 min because it's a production-risk item, it's one small area, and it's the kind of thing that just sits there forever once you walk away.
2. **Add `throw error(404)` guards to the Prismic loaders (~30 min).** Right now any unpublished/renamed/typo'd CMS slug returns a **500, not a 404** — exactly the failure mode of an unattended CMS-driven site where an editor changes something. See **HIGH-3**.
3. **Verify the self-healing actually closes the loop on GitHub (~15 min, no code).** Confirm `RENOVATE_TOKEN` secret exists and branch protection requires the `ci` check before Renovate auto-merge. See **"Self-healing status" → Renovate**. Without this, a bad patch/minor bump could auto-merge and Netlify would deploy it.

---

## Self-healing status (your stated goal — read this section)

All four automations you named, graded for "will this run unattended and catch real problems?"

| Automation    | Wired?                           | Runs unattended?                                     | Catches real regressions?               | Verdict                                     |
| ------------- | -------------------------------- | ---------------------------------------------------- | --------------------------------------- | ------------------------------------------- |
| CI (`ci.yml`) | ✅ on push to main + PRs         | ✅                                                   | prettier/eslint/svelte-check/build/a11y | **Solid** — gates the deploy path           |
| Renovate      | ✅ `renovate.yml` cron Mon 07:00 | ⚠️ needs `RENOVATE_TOKEN` secret + branch protection | patch/minor auto-merge, major manual    | **Verify on GitHub** (see below)            |
| Lighthouse    | ✅ config present                | ❌ **not in this repo's CI**                         | runs at fleet level → Airtable          | **By design, but unverified for this site** |
| a11y (axe)    | ✅ in CI, `--fail-on-violations` | ✅                                                   | **only `/dev/a11y-fixtures` + a 404**   | **Green but hollow** (HIGH-4)               |

Local gate results tonight (all green):

- `pnpm lint` → exit 0
- `pnpm check` (svelte-check) → exit 0 (34 warnings, see LOW)
- `pnpm build` → exit 0, built in 17.6s, no prerender warnings, adapter-netlify done
- `pnpm exec reddoor-maint audit --only a11y` → **pass, 0 violations across 2 routes** ← but see HIGH-4 for why "2 routes" is misleading

**Renovate — what to verify on GitHub (can't check from here):**

- `RENOVATE_TOKEN` repo secret is set (the workflow no-ops silently without it).
- Repo Settings → "Allow auto-merge" is **on**, AND branch protection on `main` requires the `ci` status check. `renovate.json` sets `platformAutomerge: true` for patch/minor — GitHub auto-merge only waits for CI if a required check is configured. **If no required check is set, a patch/minor bump that breaks the build can still auto-merge and Netlify will deploy it.** Major updates are correctly `automerge: false`.

**Lighthouse / security / deps — fleet-level, not in this repo:**
The `reddoor-maint audit` command has 5 audits (deps/lint/security/lighthouse/a11y), but this repo's CI only runs `--only a11y`. Lighthouse (perf/a11y/best-practices/SEO budgets) and the security/deps audits are designed to run from your maintenance box against the Airtable "Websites" fleet and write scores back to Airtable. **That means none of those gate this repo's deploys.** To confirm this site is actually covered: verify gallerysonder has a row in the Airtable `Websites` table with `maintenance freq`/`testing freq` ≠ "None", and that the maintenance cron is running. I can't see Airtable from here — flagged under "Decisions deferred."

---

## Findings — CRITICAL

None. No data-loss risk, no committed secrets (`.env` holds only `VITE_USE_INTRO`/`VITE_DISABLE_COOKIE_CONSENT` and is gitignored), no active security incident. The consent/analytics issue below is a genuine compliance exposure but is HIGH, not CRITICAL, because it's governable and not leaking data destructively.

---

## Findings — HIGH

**HIGH-1 — Analytics (GTM) fires on every page with no consent gating at all.**
[app.html:19-31](src/app.html#L19-L31) loads Google Tag Manager (`GTM-5FVCTMK7`) unconditionally in `<head>`, before any consent UI exists. [CookieConsent.svelte](src/lib/components/CookieConsent.svelte) only gates the **Facebook Pixel**, not GTM. So GA/GTM tracking runs for every visitor regardless of consent — a GDPR/ePrivacy exposure for a gallery with EU/UK traffic. Compounding it: [Analytics.svelte](src/lib/components/Analytics.svelte) is a **0-byte empty component** that's imported and rendered at [+layout.svelte:16,83](src/routes/+layout.svelte#L83) but does nothing — it looks like consent-gated analytics was planned and never finished.
**Fix sketch:** Put GTM behind Google Consent Mode (default `denied`), update consent on accept; or move GTM injection into `Analytics.svelte` and fire only after consent. Decide whether FB Pixel is even still in use.

**HIGH-2 — The cookie-consent disable flag is a dead typo (wrong env prefix).**
[+layout.svelte:19](src/routes/+layout.svelte#L19) reads `import.meta.env.DISABLE_COOKIE_CONSENT`, but `.env` defines `VITE_DISABLE_COOKIE_CONSENT`. Vite only exposes `VITE_`-prefixed vars to client code, so this is **always `undefined` → always `false`**, and the `{#if !DISABLE_COOKIE_CONSENT}` block at [+layout.svelte:81](src/routes/+layout.svelte#L81) always renders. Whatever you intended by setting the flag `true` is silently not happening. (Verified: the non-prefixed name cannot reach the client.)
**Fix sketch:** Read `import.meta.env.VITE_DISABLE_COOKIE_CONSENT`. One-character-class change; do it alongside HIGH-1 since it's the same file/feature.

**HIGH-3 — No 404 handling on any Prismic document load → missing docs return 500.**
Every `[uid]` loader calls `client.getByUID(...)` / `getFirst(...)` with no try/catch. `@prismicio/client` **throws** on a missing UID, which SvelteKit renders as a **500, not a 404**. Affected:

- [[uid]/+page.server.js:7](src/routes/[[preview=preview]]/[uid]/+page.server.js#L7)
- [artists/[uid]/+page.server.js:7](src/routes/[[preview=preview]]/artists/[uid]/+page.server.js#L7)
- [news/[uid]/+page.server.js:7](src/routes/[[preview=preview]]/news/[uid]/+page.server.js#L7)
- [exhibitions/[uid]/+page.server.js:7](src/routes/[[preview=preview]]/exhibitions/[uid]/+page.server.js#L7)
- [essays/[uid]/+page.server.js:7](src/routes/[[preview=preview]]/essays/[uid]/+page.server.js#L7)
- [rsvp/[uid]/+page.server.ts:7](src/routes/[[preview=preview]]/rsvp/[uid]/+page.server.ts#L7)
- **RSVP index** [rsvp/+page.server.ts:7-15](src/routes/[[preview=preview]]/rsvp/+page.server.ts#L7-L15): `getFirst({...})` can return `undefined` with zero `rsvp` docs, then line 15 builds `'/rsvp/' + page.uid` → `/rsvp/undefined` or an unhandled throw.
  For a self-healing site you walk away from, this is the realistic failure: an editor unpublishes/renames a doc and visitors hit server errors instead of a clean 404.
  **Fix sketch:** Wrap each in try/catch and `throw error(404)` (standard Prismic+SvelteKit pattern); guard the RSVP redirect with `if (!page) throw error(404)`.

**HIGH-4 — The a11y gate is green but tests a 404 page for one of its two routes (false confidence).**
The `reddoor-maint` a11y audit scans a hardcoded route list: `/dev/a11y-fixtures` **and `/dev/animate-in`**. This repo only has [src/routes/dev/a11y-fixtures](src/routes/dev/a11y-fixtures) — `/dev/animate-in` **does not exist** (verified). Playwright's `page.goto` doesn't throw on 404, so route #2 silently scans the SvelteKit error page (which is clean) and the audit reports **"0 violations across 2 routes"** — exactly what it printed tonight. Net effect: your a11y self-healing asserts on a fixtures page + a 404, and **never tests the real Prismic-driven pages** (home, artists, exhibitions, essays, news). The MEDIUM a11y bugs below (no focus trap in Lightbox/Nav) live on those untested pages.
**Fix sketch:** Add a `/dev/animate-in` fixtures route (mirrors what the maintenance package expects), and/or add the real page routes to the audit's coverage. At minimum, know that "a11y: pass" currently means "the fixtures page is clean," not "the site is accessible."

**HIGH-5 — Form submissions always report success; failure detection is effectively dead.**
[forms.ts:11-20](src/lib/utils/forms.ts#L11-L20) POSTs to `/forms` and returns `success: response.status === 200`. `/forms` is a real static page ([static/forms.html](static/forms.html) → `build/forms.html`) that returns **200 to any POST**, so `success` is essentially always `true` and the `{:else if error}` fallbacks in RSVP / Lightbox / NewsletterSignup are dead code. A genuinely failed submission still shows "Thank you." The forms _do_ reach Netlify Forms when working (they're the 4 hidden `data-netlify` forms in [+layout.svelte:104-295](src/routes/+layout.svelte#L104-L295)) — but you'll have no signal when they stop. For a site whose primary purpose is collector inquiries and RSVPs, silently-lost leads is a real business risk.
**Fix sketch:** POST to `/` (Netlify's documented endpoint) and treat a non-redirect/opaque response as failure; or detect the Netlify success redirect rather than a bare 200.

---

## Findings — MEDIUM

**MED-1 — `og:image` is broken on essentially every page (double `.url`).**
All loaders return `meta_image: page.data.meta_image.url` (a **string**), e.g. [rsvp/[uid]/+page.server.ts:14](src/routes/[[preview=preview]]/rsvp/[uid]/+page.server.ts#L14), but [+layout.svelte:75](src/routes/+layout.svelte#L75) renders `content={$page.data.meta_image.url}` — calling `.url` on a string yields `undefined`, so `og:image` is empty. Because `meta_image` is a truthy string, the `{#if}` at line 74 still fires, emitting an empty tag. The `artists` loader additionally mixes shapes ([artists/[uid]/+page.server.js:14](src/routes/[[preview=preview]]/artists/[uid]/+page.server.js#L14)). Bad social-share previews everywhere.
**Fix:** Return one consistent shape (the image object, or a resolved URL string) and have the layout consume it.

**MED-2 — Gallery content is fetched client-side via an N+1 loop; invisible to SSR/SEO.**
[Gallery.svelte:99-220](src/lib/components/Gallery.svelte#L99-L220) fetches artwork→artist relationships in `onMount`/`onNavigate`, sequentially (N+1). Cards aren't in prerendered HTML (bad for SEO, spinner on first paint), and it uses the singleton client in [prismic.ts:13](src/lib/utils/prismic.ts#L13) which hardcodes the repo, has **no `routes` config and no preview cookie** — so links resolve differently than SSR and previews won't reflect here.
**Fix:** Move relationship fetching into the page `+page.server.js` load (`fetchLinks`/`graphQuery`) and pass resolved items as props.

**MED-3 — `ScaleTextToContainer`: resize never re-scales and font size compounds.**
[ScaleTextToContainer.svelte](src/lib/components/ScaleTextToContainer.svelte): `windowWidth` (line 31) is a plain `let`, not `$state`, so the `$effect` reading it (line 55) never re-runs on resize. And line 66 sets `fontSize = getFontSizeInPixels(node) * scale` from the _already-scaled_ size, so repeated runs multiply — sizes drift. Also a `console.log(nodes)` every tick (line 58).
**Fix:** Make `windowWidth` `$state`; cache the original font size per node and always scale from the original.

**MED-4 — `Intro` core state isn't reactive (latent landmine behind `VITE_USE_INTRO=false`).**
[Intro.svelte:12-14](src/lib/components/Intro.svelte#L12-L14): `isVideoLoaded`/`isPlaying`/`isVideoDone` are plain `let`, read in the template and reassigned in handlers, plus `bind:isPlaying` to a non-state var (line 76). In runes mode these won't drive updates. Dead today (intro disabled, they init `true`), but the `with-intro` branch suggests re-enabling is planned — the moment it is, the loading screen won't hide.
**Fix:** Declare all three with `$state(...)` before re-enabling the intro.

**MED-5 — Lightbox modal: no focus trap, no Escape, no body-scroll lock.**
[Lightbox.svelte:66-256](src/lib/components/Lightbox.svelte#L66-L256). The full-screen lightbox/inquiry overlay never moves focus into itself, doesn't trap Tab, has no Escape handler, and the close button is only reachable by tabbing through the whole page behind it. This is on a **real** page the a11y gate never tests (see HIGH-4).
**Fix:** On open: focus the close button, `role="dialog" aria-modal="true"`, trap focus, Escape→close, lock body scroll.

**MED-6 — Nav overlay: no `aria-expanded`, no Escape, no scroll lock, focus unmanaged.**
[Nav.svelte:36-125](src/lib/components/Nav.svelte#L36-L125). Hamburger toggle lacks `aria-expanded`; opening the full-screen menu doesn't lock scroll or move focus, and Escape doesn't close it. Same untested-page caveat as MED-5.
**Fix:** `aria-expanded={showNav}`, Escape handler, lock body scroll on open, focus the close button.

**MED-7 — Scroll listeners leak (no cleanup) in two components.**
[NameToClipPath.svelte:51](src/lib/components/NameToClipPath.svelte#L51) and [NewsletterSignup.svelte:64](src/lib/components/NewsletterSignup.svelte#L64) add `window` scroll listeners in `onMount` with no teardown (unlike GridImage/InnerPageNav/AnimateIn, which clean up). `NameToClipPath` renders once per nav link, so listeners accumulate across navigations.
**Fix:** Return a cleanup that `removeEventListener`s, or move into `$effect`.

---

## Findings — LOW (you asked for these)

- **No `sitemap.xml`.** [static/](static/) has `robots.txt` but no sitemap. The whole site is prerendered from Prismic — a generated sitemap would be cheap SEO. Consider `@sveltejs/kit`-style `sitemap.xml` endpoint or a build step.
- **PII / debug logging in production.** 8 `console.log`s remain, incl. [NewsletterSignup.svelte:75](src/lib/components/NewsletterSignup.svelte#L75) `console.log('email: ' + emailValue)` (logs visitor email), [Nav.svelte:104](src/lib/components/Nav.svelte#L104) (logs on every hover), plus ScaleTextToContainer:58, Lightbox:50, rsvp/[uid]/+page.svelte:41. Strip these.
- **Mislabeled inquiry option (data-quality bug).** [Lightbox.svelte:216](src/lib/components/Lightbox.svelte#L216): `<option value="Experienced Collector">Art Advisor</option>` — submitted value doesn't match the visible label, so the inquiry payload mislabels respondents.
- **`@html` usage — investigated, low risk.** [GridImage.svelte:129-273](src/lib/components/GridImage.svelte#L129-L273) and [SplitRichTextAccordian.svelte:73-83](src/lib/components/SplitRichTextAccordian.svelte#L73-L83) render `@html`. Traced: all content is Prismic CMS-authored (KeyText / rich-text / hardcoded `<br/>`), no visitor input — only a Prismic editor could inject markup. Acceptable. The interpolated `<i>${...}</i>` strings in Gallery (~334-340) are needless `@html`; prefer real elements.
- **svelte-check: 34 warnings**, mostly Svelte-4→5 migration residue: `non_reactive_update` ([+layout.svelte:26](src/routes/+layout.svelte#L26) `currentUtmParams`), `state_referenced_locally` (exhibitions/[uid] and news/[uid] capture `data` at init → meta won't update on client-side nav between same-type docs), deprecated `<slot>` (use `{@render}`) and `on:scroll` (use `onscroll`). None break the build; worth a cleanup pass.
- **`netlify.toml:4`** declares `functions = "functions/"` but no `functions/` dir exists. Harmless but misleading — drop the line or create the dir.
- **`Lightbox.svelte:64`** `bind:innerHeight={viewportWidth}` — misnamed and `viewportWidth` is never read. Dead binding.
- **3 audit vulns rated "high" are all dev-only and unshippable to the browser:** `html-minifier` (REDoS, via `@reddoorla/maintenance`→mjml, _no patch available_), `tmp` ×2 (path traversal, via `@lhci/cli`). None are in production runtime deps. Renovate may not be able to fix the transitive/no-patch ones; not worth chasing. (Full: 3 low / 4 moderate / 3 high, all transitive dev deps.)

---

## Open loops / cleanup carried forward

**Branches (archaeology):**

- **Safe to delete** (0 commits ahead of main, fully merged): `adding-rsvp`, `svelte5`, `onboard/canonical-tooling`, `origin/revert-for-weekend`, `origin/stop-over`. These are done work — deleting them de-clutters and removes the temptation to mine them.
- **Has unmerged work, decide keep-or-kill:** `with-intro` (3 ahead: preloader/"putting intro back"/spacing — the parked intro feature, matches `VITE_USE_INTRO=false`), `extracting-intro-logic` (1 ahead: "hide title on exhibition"), `prismic-impl` (1 ahead: "video opens"). `landing-placeholder` is 17 ahead but 364 behind — almost certainly abandoned.
- **Two stashes, cryptically named, intro-experiment leftovers:** `stash@{0}` (On `with-intro`: clip-path/gradient-logo styles for +layout) and `stash@{1}` (On `main`: edits to `src/routes/intro-test/+page.svelte`, a route that no longer exists on main). I did **not** pop them. They'll rot — inspect and drop or fold into the intro branch when you next touch the intro.

**Intentionally NOT addressed tonight** (read-only review; these are tomorrow's decisions): all code fixes above, the branch/stash cleanup, and the GitHub/Airtable settings verification (can't reach those surfaces from a local read-only run).

---

## Decisions deferred (needed you, couldn't ask)

1. **Is the FB Pixel still in use?** It affects how you fix HIGH-1 (gate both GTM + Pixel, or rip Pixel out). Provisional: gate both behind consent.
2. **Is gallerysonder in the Airtable `Websites` fleet** with maintenance/testing freq set, and is the maintenance cron running? This determines whether Lighthouse/security/deps self-healing actually covers this site. Provisional: assume yes since the tooling is fully onboarded, but **verify** — if not, this site has _no_ perf/security gating at all.
3. **Re-enabling the intro** (`with-intro` branch): MED-4 must be fixed first (the `$state` reactivity), or the loading screen won't dismiss. Provisional: don't merge `with-intro` until those three vars are `$state`.

---

## What I did NOT do tonight

Read-only exercise. No commits, no PRs, no pushes, no live-service writes, no stash pops, no branch deletions, no live form submissions. I ran only local gates (`lint`, `check`, `build`, `pnpm audit`, the `reddoor-maint` a11y audit) — none mutate shared state. The repo is exactly as you left it (working tree clean, on `main` at `b0a318e`). The only file I created is this brief plus `.claude/settings.local.json` (the read-only permission allowlist you approved).
