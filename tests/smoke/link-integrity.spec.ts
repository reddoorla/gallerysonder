import { test, expect, type Page } from '@playwright/test';

// Link integrity. Every case here shipped to production at least once, and none of
// them showed up as an error anywhere: a dead call-to-action, an anchor with an
// empty href and an image with no alt all render perfectly happily. The only way
// they get caught is by asserting on the markup.

/** Routes that render CMS-driven links and are stable enough to assert against. */
const LINKED_ROUTES = [
	'/',
	'/about',
	'/advisory',
	'/contact',
	'/exhibitions',
	'/exhibitions/awakening'
];

async function goto(page: Page, path: string) {
	const res = await page.goto(path, { waitUntil: 'domcontentloaded' });
	expect(res?.status(), `${path} should load`).toBe(200);
}

/** Every control labelled exactly "RSVP", anchor or button, on the given page. */
function rsvpControls(page: Page) {
	return page.locator('a, button').filter({ hasText: /^\s*RSVP\s*$/i });
}

// Which pages carry an RSVP call-to-action is editorial and rotates: the homepage
// hero pointed at an RSVP until the gallery swapped it for "EXPLORE NOW" on the
// incoming show. So this asserts on every route rather than on a hand-kept list of
// the pages that happen to have one today — a page with no RSVP passes, a page with
// a BROKEN one fails wherever it appears. Pinning the list instead meant the
// homepage silently left the check the day its CTA changed, which is precisely when
// a fresh CMS link is most likely to be wrong.
for (const path of LINKED_ROUTES) {
	test(`${path}: every RSVP call-to-action is a link, not a dead button`, async ({ page }) => {
		await goto(page, path);

		// LinkArrowButton falls back to a <button> with a no-op onclick when `href`
		// is empty — which is what a Prismic link to a document type missing from the
		// route resolver produces (isFilled() is true, but .url is undefined). The
		// result looks exactly like the working control and goes nowhere.
		const ctas = rsvpControls(page);
		const count = await ctas.count();

		for (let i = 0; i < count; i++) {
			const cta = ctas.nth(i);
			const tag = await cta.evaluate((el) => el.tagName.toLowerCase());
			expect(tag, `RSVP control ${i} on ${path} must be an anchor`).toBe('a');
			const href = await cta.getAttribute('href');
			expect(href, `RSVP link ${i} on ${path} must have an href`).toBeTruthy();
			expect(href, `RSVP link ${i} on ${path} should point at an RSVP page`).toContain('/rsvp/');
		}
	});
}

// The per-route check above passes on a page with no RSVP at all, so on its own it
// would go quiet if RSVPs disappeared site-wide. This is the content guard: it does
// not care WHICH page hosts the CTA, only that the gallery is still offering one
// somewhere, so routine editorial rotation stays green and a real regression does not.
test('the site still offers an RSVP somewhere', async ({ page }) => {
	const found: string[] = [];
	for (const path of LINKED_ROUTES) {
		await goto(page, path);
		if ((await rsvpControls(page).count()) > 0) found.push(path);
	}
	expect(found, `no RSVP call-to-action on any of ${LINKED_ROUTES.join(', ')}`).not.toEqual([]);
});

for (const path of LINKED_ROUTES) {
	test(`${path}: no anchor is rendered with an empty or placeholder href`, async ({ page }) => {
		await goto(page, path);

		// href="" resolves to the current page, so an unfilled CMS link becomes a
		// focusable control that silently reloads. href="#" is the same problem with
		// a jump to the top. Both come from `isFilled(x) ? x.url : ''` fallbacks.
		const bad = await page.evaluate(() =>
			Array.from(document.querySelectorAll('a[href=""], a[href="#"]')).map(
				(a) => `<a href="${a.getAttribute('href')}"> text=${JSON.stringify(a.textContent?.trim())}`
			)
		);
		expect(bad, `${path} renders anchors with a dead href`).toEqual([]);
	});
}

test('rsvp event pages give every image an alt attribute', async ({ page }) => {
	await goto(page, '/rsvp/euphorbia');

	// PrismicImage emits NO alt attribute at all when the CMS alt is null unless the
	// call site passes fallbackAlt — axe rates a missing alt critical, and most of
	// the rsvp documents have no alt set.
	const missing = await page.evaluate(() =>
		Array.from(document.querySelectorAll('img'))
			.filter((img) => !img.hasAttribute('alt'))
			.map((img) => img.getAttribute('src') ?? '(no src)')
	);
	expect(missing, 'images with no alt attribute').toEqual([]);
});

test('robots.txt advertises the canonical apex sitemap', async ({ request }) => {
	const res = await request.get('/robots.txt');
	expect(res.status()).toBe(200);
	const body = await res.text();

	// The apex migration moved canonical/og/JSON-LD and the sitemap itself to the
	// apex, but robots.txt kept pointing crawlers at the www host, which 301s.
	expect(body).toContain('Sitemap: https://gallerysonder.com/sitemap.xml');
	expect(body).not.toContain('www.gallerysonder.com');
});

test('the footer contact details are tappable', async ({ page }) => {
	await goto(page, '/');

	// The phone number and email address were plain text inside a <div>, so on a
	// phone neither could be tapped and no crawler read them as contact points.
	const footer = page.locator('footer');
	await expect(footer.locator('a[href^="tel:"]')).toHaveCount(1);
	await expect(footer.locator('a[href^="mailto:"]')).toHaveCount(1);

	const tel = await footer.locator('a[href^="tel:"]').getAttribute('href');
	expect(tel?.replace(/[^\d+]/g, '')).toContain('9496620077');
	const mail = await footer.locator('a[href^="mailto:"]').getAttribute('href');
	expect(mail).toBe('mailto:info@gallerysonder.com');
});
