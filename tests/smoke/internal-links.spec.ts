import { test, expect } from '@playwright/test';

// Every top-level page must be reachable by a crawler that does not run JavaScript.
//
// The nav's links live inside `{#if showNav}`, so until a visitor clicks the
// hamburger the served HTML contains no <nav> and no anchor to /about or /advisory
// at all. Those pages are in the sitemap, so they get indexed — but with zero
// internal anchors they carry no internal link equity and no anchor text, and the
// crawlers that never execute JS (including most LLM crawlers) cannot reach them.
//
// Assertions are on the SERVED HTML via `request`, not the hydrated DOM: the whole
// point is what arrives before any script runs, and page.goto() would hide the bug.
//
// /news is deliberately absent — it is not in the nav document, and its content is
// still placeholder copy. It should not be linked until that is real.
const MUST_BE_LINKED = ['/about', '/advisory', '/contact', '/artists', '/exhibitions'];

// A representative page from each route family; the footer ships on all of them.
const PAGES = ['/', '/about', '/exhibitions/awakening', '/artists/theo-hirschfield'];

for (const path of PAGES) {
	test(`${path}: server-rendered HTML links to every top-level page`, async ({ request }) => {
		const res = await request.get(path);
		expect(res.status(), `${path} should load`).toBe(200);
		const html = await res.text();

		const missing = MUST_BE_LINKED.filter((target) => !new RegExp(`href="${target}"`).test(html));
		expect(missing, `${path} has no server-rendered link to these`).toEqual([]);
	});
}

test('the footer is where those links live, and they are real anchors', async ({ page }) => {
	await page.addInitScript(() => window.localStorage.setItem('cookieConsent', 'false'));
	await page.goto('/', { waitUntil: 'domcontentloaded' });

	const footer = page.locator('footer');
	for (const target of MUST_BE_LINKED) {
		await expect(
			footer.locator(`a[href="${target}"]`),
			`footer should link ${target} exactly once`
		).toHaveCount(1);
	}

	// The labels must be readable text, not an empty anchor — a link with no
	// accessible name is worth nothing to a crawler or a screen reader.
	const labels = await footer
		.locator('a[href^="/"]')
		.evaluateAll((els) => els.map((e) => (e.textContent ?? '').trim()).filter(Boolean));
	expect(labels.length, 'footer internal links should all carry text').toBeGreaterThanOrEqual(
		MUST_BE_LINKED.length
	);
});
