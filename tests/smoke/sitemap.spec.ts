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
// The same predicate the route, the sitemap and the lightbox use. Imported rather
// than restated so a test can't quietly disagree with the code it guards.
import { artistHasPublicPage } from '../../src/lib/utils/prismic';

const PRISMIC_API = 'https://gallerysonder.cdn.prismic.io/api/v2';

/** Every published artist document, straight from the CMS. */
async function artistDocs(request: APIRequestContext) {
	const meta = await (await request.get(PRISMIC_API)).json();
	const ref = meta.refs.find((r: { isMasterRef: boolean }) => r.isMasterRef).ref;
	const q = encodeURIComponent('[[at(document.type,"artist")]]');
	const docs: { uid: string; data: Record<string, unknown> }[] = [];
	for (let page = 1; ; page++) {
		const res = await request.get(
			`${PRISMIC_API}/documents/search?ref=${encodeURIComponent(ref)}&q=${q}&pageSize=100&page=${page}`
		);
		const body = await res.json();
		docs.push(...body.results);
		if (page >= body.total_pages) break;
	}
	return docs;
}

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

test.describe('rendered links', () => {
	test('no page links to an artist page that 404s', async ({ request }) => {
		// The broadest net, and the one that would have caught the original miss.
		// Artist URLs reach the HTML through four channels — the lightbox credit,
		// the NameList slice, gallery item links, and Prismic's route resolver
		// turning any content relationship into /artists/<uid>. Reading the rendered
		// markup covers all four at once without having to enumerate them, which is
		// exactly the enumeration that went wrong before.
		test.setTimeout(120_000);
		const pages = await sitemapPaths(request);
		expect(pages.length, 'sitemap should not be empty').toBeGreaterThan(5);

		const found = new Map<string, string[]>();
		for (const path of pages) {
			const res = await request.get(path);
			if (res.status() !== 200) continue;
			const html = await res.text();
			for (const m of html.matchAll(/href="(\/artists\/[^"#?]+)"/g)) {
				const href = m[1].replace(/\/$/, '');
				if (!found.has(href)) found.set(href, []);
				found.get(href)!.push(path);
			}
		}

		expect(
			found.size,
			`no /artists/ links found across ${pages.length} pages — the crawl is not seeing them`
		).toBeGreaterThan(0);

		const dead: string[] = [];
		for (const [href, sources] of found) {
			const status = (await request.get(href)).status();
			if (status >= 400) dead.push(`${href} (${status}) linked from ${sources.join(', ')}`);
		}
		expect(
			dead,
			`${dead.length} dead artist link(s) of ${found.size} across ${pages.length} pages:\n${dead.join('\n')}`
		).toEqual([]);
	});
});

test.describe('artist routes', () => {
	test('serve exactly the artists with a page, and 404 the rest', async ({ request }) => {
		// Nothing pinned the route guard itself: deleting the `throw error(404)`
		// left the whole suite green. Derived from the CMS rather than a hardcoded
		// uid list, which would go stale the first time an editor fills a stub in
		// and fail for the wrong reason.
		test.setTimeout(120_000);
		const docs = await artistDocs(request);
		expect(docs.length, 'no artist documents came back from Prismic').toBeGreaterThan(10);

		const wrong: string[] = [];
		for (const doc of docs) {
			const expected = artistHasPublicPage(doc.data) ? 200 : 404;
			const status = (await request.get(`/artists/${doc.uid}`)).status();
			if (status !== expected)
				wrong.push(`/artists/${doc.uid}: expected ${expected}, got ${status}`);
		}
		expect(
			wrong,
			`${wrong.length} of ${docs.length} artist routes disagree with the predicate`
		).toEqual([]);
	});

	test('are listed in the sitemap if and only if they are served', async ({ request }) => {
		const docs = await artistDocs(request);
		const listed = new Set((await sitemapPaths(request)).filter((p) => p.startsWith('/artists/')));
		const mismatched = docs
			.filter((doc) => artistHasPublicPage(doc.data) !== listed.has(`/artists/${doc.uid}`))
			.map((doc) => `/artists/${doc.uid}`);
		expect(
			mismatched,
			`the sitemap and the route guard disagree about ${mismatched.length} artist(s)`
		).toEqual([]);
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

	// A gallery with `show_more_button` renders only its first FOUR tiles —
	// Gallery.svelte gates on the loop index (`{#if !isTruncated || i < 4}`), not
	// on scroll, so no amount of wheeling reveals the rest. Skipping this made the
	// whole test vacuous: on this exhibition the first four artworks all credit
	// roster stubs, so `linked` came back empty and the dead-link assertion ran
	// over nothing. The two artworks whose artists DO get a link sit at index 4
	// and 5, behind the button.
	const showMore = page.getByRole('button', { name: /show more/i });
	for (let i = 0; i < (await showMore.count()); i++) {
		await showMore
			.nth(i)
			.click({ timeout: 3000 })
			.catch(() => {});
		await page.waitForTimeout(400);
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

		// This test has gone vacuous on me twice — first when no lightbox opened at
		// all, then when the gallery's Show More truncation hid every artwork whose
		// artist gets a link. Each guard below is one of those failures; without
		// them the dead-link assertion asserts over an empty array and passes while
		// the page is broken.
		expect(tileCount, `no artwork tiles on ${MIXED_EXHIBITION}`).toBeGreaterThan(0);
		expect(opened, `no lightbox opened across ${tileCount} artwork tile(s)`).toBeGreaterThan(0);
		expect(
			linked.length + unlinked.length,
			`${opened} lightbox(es) opened but none credited an artist`
		).toBeGreaterThan(0);
		expect(
			linked.length,
			`no artwork on ${MIXED_EXHIBITION} rendered a LINKED artist, so the assertion below ` +
				`has nothing to check. Either the gallery is still truncated, or every artist on ` +
				`this exhibition is now a roster stub — point MIXED_EXHIBITION at one that mixes both.`
		).toBeGreaterThan(0);
		expect(
			unlinked.length,
			`no artwork on ${MIXED_EXHIBITION} rendered an UNLINKED artist, so the stub branch of ` +
				`the lightbox is not being exercised — point MIXED_EXHIBITION at one that mixes both.`
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
