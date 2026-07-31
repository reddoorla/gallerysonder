// Guards against pointing anyone — crawler or visitor — at an artist page that
// isn't there.
//
// Roughly half the artist documents are roster stubs: `full_name`, `first_name`
// and `last_name` and nothing else, created so the artist exists as a
// relationship target for their artworks. Their route still resolved, rendering
// a hero of three empty <h1>s over a blank screen, and the sitemap advertised
// every one of them.
//
// They are NOT unreachable. 198 artwork documents carry an `artist`
// relationship, and every stub is the target of at least one, so opening such an
// artwork in a gallery lightbox shows the artist's name — as a link to their
// page. Making the stub route 404 without also dropping that link would just
// convert an empty page into a broken one, which is why the two tests below come
// as a pair: the route must 404, AND nothing may link to it.

import { test, expect, type APIRequestContext, type Page } from '@playwright/test';

// An exhibition whose gallery mixes built-out artists with roster stubs, so
// opening its artworks exercises both branches of the lightbox's artist link.
// If the content changes so it holds no stubs, this degrades to the weaker (but
// still valid) check that no artist link it does render is dead.
const MIXED_EXHIBITION = '/exhibitions/keeping-things-whole';

async function sitemapPaths(request: APIRequestContext): Promise<string[]> {
	const res = await request.get('/sitemap.xml');
	expect(res.status(), 'GET /sitemap.xml').toBe(200);
	const xml = await res.text();
	return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
}

test.describe('sitemap', () => {
	test('lists no URL that 404s', async ({ request }) => {
		const paths = await sitemapPaths(request);
		expect(paths.length, 'sitemap should not be empty').toBeGreaterThan(5);

		const statuses = await Promise.all(
			paths.map(async (path) => ({
				path,
				status: (await request.get(path, { maxRedirects: 0 })).status()
			}))
		);

		const dead = statuses.filter((s) => s.status >= 400);
		expect(dead, `sitemap advertises ${dead.length} dead URL(s) of ${paths.length}`).toEqual([]);
	});

	test('lists the artists that do have a page', async ({ request }) => {
		// The complement of the check above: make sure the stub filter didn't go too
		// far and drop the real artist pages along with the empty ones.
		const artists = (await sitemapPaths(request)).filter((p) => p.startsWith('/artists/'));
		expect(artists.length, 'no artist pages left in the sitemap').toBeGreaterThan(5);

		for (const path of artists) {
			const res = await request.get(path);
			expect(res.status(), `${path} is in the sitemap`).toBe(200);
			// A real artist page renders its title in the hero; a stub renders three
			// empty headings, which is what got these URLs pulled in the first place.
			const html = await res.text();
			const heroHeadings = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)]
				.map((m) =>
					m[1]
						.replace(/<!---->/g, '')
						.replace(/<[^>]+>/g, '')
						.trim()
				)
				.filter(Boolean);
			expect(heroHeadings.length, `${path} renders no heading text`).toBeGreaterThan(0);
		}
	});
});

/** Open every artwork tile on the page and record how each credits its artist. */
async function artistCreditsFromGallery(page: Page) {
	const lightbox = page.getByRole('dialog', { name: 'Artwork details' });
	const close = page.getByRole('button', { name: 'Close modal' });
	// Scrolling to the foot of the page pops the newsletter overlay, which then
	// covers the gallery and eats every tile click.
	const newsletter = page.getByRole('dialog', { name: 'Newsletter signup' });
	const dismissOverlays = async () => {
		if (await newsletter.isVisible().catch(() => false)) {
			await page.keyboard.press('Escape');
			await newsletter.waitFor({ state: 'hidden', timeout: 2000 }).catch(() => {});
		}
	};

	// GridImage lays a whole-card overlay button labelled "View <artwork>" over
	// each tile. Exclude the ContentWidthMedia "View full size" control, which
	// shares the prefix but opens a different modal that then blocks everything
	// behind it.
	const tiles = page
		.locator('button[aria-label^="View "]')
		.and(page.locator('button:not([aria-label="View full size"])'));

	// Galleries mount as you scroll, so walk down until the tile count stops
	// growing — and no further. Scrolling to the foot of the page pops the
	// newsletter overlay, which cost half the tiles when this scrolled blindly.
	let previous = -1;
	let steady = 0;
	for (let i = 0; i < 30 && steady < 3; i++) {
		const seen = await tiles.count();
		steady = seen === previous ? steady + 1 : 0;
		previous = seen;
		await page.mouse.wheel(0, 600);
		await page.waitForTimeout(250);
	}
	await dismissOverlays();
	const tileCount = await tiles.count();

	const linked: string[] = [];
	const unlinked: string[] = [];
	let opened = 0;

	for (let i = 0; i < tileCount; i++) {
		const tile = tiles.nth(i);
		await dismissOverlays();
		// Playwright's own scroll handles the page's inner scroll container;
		// element.scrollIntoView() does not.
		await tile.scrollIntoViewIfNeeded().catch(() => {});
		await tile.click({ timeout: 4000, force: true }).catch(() => {});

		const didOpen = await lightbox
			.waitFor({ state: 'visible', timeout: 5000 })
			.then(() => true)
			.catch(() => false);
		if (!didOpen) continue;
		opened++;

		// The artwork (and its artist) are fetched after the modal opens.
		const link = lightbox.locator('a[href^="/artists/"]');
		const credit = lightbox.locator('h5 b').first();
		await Promise.race([
			link
				.first()
				.waitFor({ state: 'attached', timeout: 4000 })
				.catch(() => {}),
			credit.waitFor({ state: 'attached', timeout: 4000 }).catch(() => {})
		]);

		if (await link.count()) {
			const href = await link.first().getAttribute('href');
			if (href && !linked.includes(href)) linked.push(href);
		} else {
			const text = (await credit.count()) ? (await credit.innerText()).trim() : '';
			if (text && !unlinked.includes(text)) unlinked.push(text);
		}

		await close.click({ timeout: 3000 }).catch(() => page.keyboard.press('Escape'));
		await lightbox.waitFor({ state: 'hidden', timeout: 4000 }).catch(() => {});
	}
	return { tileCount, opened, linked, unlinked };
}

test.describe('gallery lightbox', () => {
	test('never links an artwork to an artist page that 404s', async ({ page, request }) => {
		// Opens every artwork on the page one at a time; well past the 30s default.
		test.setTimeout(120_000);
		// CI has no `.env`, so the consent gate is live there and would swallow the
		// tile clicks. Answer it up front the way the other specs do.
		await page.addInitScript(() => window.localStorage.setItem('cookieConsent', 'false'));
		await page.goto(MIXED_EXHIBITION, { waitUntil: 'networkidle' });

		const { tileCount, opened, linked, unlinked } = await artistCreditsFromGallery(page);

		// Without this the test passes vacuously when no lightbox ever opens — which
		// it did on the first attempt, hiding four dead links.
		expect(tileCount, `no artwork tiles on ${MIXED_EXHIBITION}`).toBeGreaterThan(0);
		expect(opened, `no lightbox opened across ${tileCount} artwork tile(s)`).toBeGreaterThan(0);
		expect(
			linked.length + unlinked.length,
			`${opened} lightbox(es) opened but none credited an artist`
		).toBeGreaterThan(0);

		const statuses = await Promise.all(
			linked.map(async (href) => ({ href, status: (await request.get(href)).status() }))
		);
		const dead = statuses.filter((s) => s.status >= 400);
		expect(
			dead,
			`the lightbox links to ${dead.length} artist page(s) that 404 ` +
				`(${linked.length} linked, ${unlinked.length} shown as plain text, across ${opened} artwork(s))`
		).toEqual([]);
	});
});
