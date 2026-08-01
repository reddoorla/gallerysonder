import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { smokeRoutes } from './routes';

// Accessibility gate over REAL routes.
//
// CI already runs an a11y audit, but its route list is two synthetic fixture pages
// (/dev/a11y-fixtures and /dev/animate-in). Those are worth keeping — they exercise
// design-system components in isolation — but they meant no real page was ever
// scanned, which is how five /rsvp/* pages shipped a hero <img> with no alt
// attribute at all (axe: critical/image-alt) with CI green the whole time.
//
// This was green on every route the day it was added, so it gates from a clean
// baseline rather than freezing an existing backlog.
//
// Scope: axe catches roughly a third of WCAG issues, so a green run here is "no
// machine-detectable violations", not "accessible". Notably it does NOT fail on
// axe's `incomplete` (needs-review) bucket — those are reported below for a human
// to read, because the dead-focus-stop problem on the old gallery cards lived there
// and a violations-only gate would have sailed past it.

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

for (const route of smokeRoutes) {
	test(`${route.path} (${route.name}) has no axe violations`, async ({ page }) => {
		// Consent is pre-answered: the modal is a focus trap over the whole page, so
		// scanning with it up measures the modal instead of the page. It has its own
		// coverage in cookie-consent.spec.ts.
		await page.addInitScript(() => window.localStorage.setItem('cookieConsent', 'false'));
		const res = await page.goto(route.path, { waitUntil: 'load' });
		expect(res?.status(), `${route.path} should load`).toBe(route.expectStatus ?? 200);
		// Let hero transitions and lazy images settle; axe reads computed styles, and
		// mid-animation opacity produces phantom contrast findings.
		await page.waitForTimeout(1500);

		const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();

		if (results.incomplete.length > 0) {
			// Reported, never failed — see the header note.
			console.log(
				`[a11y] ${route.path} needs-review: ${results.incomplete
					.map((r) => `${r.id}×${r.nodes.length}`)
					.join(', ')}`
			);
		}

		const violations = results.violations.map(
			(v) =>
				`${v.impact}/${v.id} ×${v.nodes.length} — ${v.help}\n    ${v.nodes[0]?.target.join(' ')}`
		);
		expect(violations, `axe violations on ${route.path}`).toEqual([]);
	});
}
