// Guards the structured data and indexing rules that decide what a Google result
// for this gallery looks like.
//
// None of this is visible in the UI, which is exactly why it needs a gate: the
// Organization schema sat as a name+logo stub for months without anything going
// red, and seven rsvp landing pages were indexed the whole time. A broken JSON-LD
// blob or a lost `noindex` fails silently and is only noticed weeks later, in a
// search result, by the client.

import { test, expect, type APIRequestContext } from '@playwright/test';

const PRISMIC_API = 'https://gallerysonder.cdn.prismic.io/api/v2';

/** Only the parts of the emitted schema these tests actually assert on. */
type OpeningHours = { dayOfWeek?: string; opens?: string; closes?: string };
type ListItem = { position?: number; name?: string; item?: string };
type JsonLdBlock = {
	'@type'?: string;
	address?: Record<string, unknown>;
	telephone?: string;
	url?: string;
	openingHoursSpecification?: OpeningHours[];
	itemListElement?: ListItem[];
};

/** Every JSON-LD object embedded in a page, parsed. */
async function jsonLd(request: APIRequestContext, path: string): Promise<JsonLdBlock[]> {
	const res = await request.get(path);
	expect(res.status(), `GET ${path}`).toBe(200);
	const html = await res.text();
	const blocks = [
		...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)
	].map((m) => m[1]);
	// A malformed blob is invisible on the page and silently ignored by crawlers,
	// so parse failures must be loud here rather than swallowed into an empty list.
	return blocks.map((raw, i) => {
		try {
			return JSON.parse(raw) as JsonLdBlock;
		} catch (err) {
			throw new Error(`JSON-LD block ${i + 1} on ${path} is not valid JSON:\n${raw}`, {
				cause: err
			});
		}
	});
}

const ofType = (blocks: JsonLdBlock[], type: string) =>
	blocks.find((block) => block['@type'] === type);

test.describe('organization schema', () => {
	test('carries the address, phone and hours a knowledge panel is built from', async ({
		request
	}) => {
		const org = ofType(await jsonLd(request, '/'), 'ArtGallery');
		expect(org, 'no ArtGallery JSON-LD on the homepage').toBeTruthy();

		// These must match the Google Business Profile listing exactly; a mismatch
		// is the usual reason Google won't associate the site with the business.
		expect(org!.address).toMatchObject({
			'@type': 'PostalAddress',
			streetAddress: '3435 E Coast Highway',
			addressLocality: 'Corona del Mar',
			addressRegion: 'CA',
			postalCode: '92625'
		});
		expect(org!.telephone, 'telephone missing').toBeTruthy();
		expect(org!.url).toBe('https://gallerysonder.com');
	});

	test('opens Wednesday to Sunday and says nothing about the closed days', async ({ request }) => {
		const org = ofType(await jsonLd(request, '/'), 'ArtGallery')!;
		const hours = org.openingHoursSpecification ?? [];
		expect(hours.length, 'no openingHoursSpecification').toBeGreaterThan(0);

		const byDay = Object.fromEntries(hours.map((h) => [h.dayOfWeek ?? '', h]));
		for (const day of ['Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']) {
			expect(byDay[day], `${day} missing from opening hours`).toMatchObject({
				opens: '11:00',
				closes: '18:00'
			});
		}
		// schema.org has no "closed" value. A closed day is expressed by ABSENCE;
		// emitting it with equal opens/closes reads as "open zero hours" and is
		// what trips the invalid-hours warning in Google's validator.
		for (const day of ['Monday', 'Tuesday']) {
			expect(byDay[day], `${day} is a closed day and must be omitted, not listed`).toBeUndefined();
		}
	});
});

test.describe('breadcrumb schema', () => {
	test('is absent on the homepage', async ({ request }) => {
		// A one-item trail ("Home") carries no information and is the kind of empty
		// markup that earns a structured-data warning rather than a sitelink.
		expect(ofType(await jsonLd(request, '/'), 'BreadcrumbList')).toBeUndefined();
	});

	test('names the page rather than repeating its whole SEO title', async ({ request }) => {
		const crumbs = ofType(await jsonLd(request, '/artists/theo-hirschfield'), 'BreadcrumbList');
		expect(crumbs, 'no BreadcrumbList on an artist page').toBeTruthy();

		const names = (crumbs!.itemListElement ?? []).map((i) => i.name ?? '');
		expect(names[0]).toBe('Home');
		expect(names).toContain('Artists');
		// The <title> is "Theo Hirschfield | Contemporary Artist | Gallery Sonder";
		// the crumb must be the leading name, not the full keyword string.
		expect(names.at(-1), 'the last crumb should be the page name alone').not.toContain('|');
	});

	test('never links to a crumb that 404s', async ({ request }) => {
		// The failure this exists for: /essays, /news and /rsvp have no index route,
		// so a breadcrumb built by naively splitting the path publishes a dead middle
		// crumb. Checked on an essay precisely because that is the path that breaks.
		const paths = [
			'/about',
			'/exhibitions/awakening',
			'/artists/theo-hirschfield',
			'/essays/interstitial-essay'
		];
		const dead: string[] = [];

		for (const path of paths) {
			const crumbs = ofType(await jsonLd(request, path), 'BreadcrumbList');
			expect(crumbs, `no BreadcrumbList on ${path}`).toBeTruthy();

			const items = crumbs!.itemListElement ?? [];
			expect(items.length, `${path} has an empty breadcrumb trail`).toBeGreaterThan(1);
			// Positions must be 1..n in order, or the trail renders out of sequence.
			expect(items.map((i) => i.position)).toEqual(items.map((_, i) => i + 1));

			for (const item of items) {
				const url = new URL(item.item!);
				expect(url.origin, `${path}: crumb points off-site`).toBe('https://gallerysonder.com');
				const status = (await request.get(url.pathname)).status();
				if (status >= 400)
					dead.push(`${path}: crumb "${item.name}" -> ${url.pathname} (${status})`);
			}
		}

		expect(
			dead,
			`${dead.length} breadcrumb crumb(s) point at a dead URL:\n${dead.join('\n')}`
		).toEqual([]);
	});
});

test.describe('rsvp pages', () => {
	/** Every published rsvp document, straight from the CMS. */
	async function rsvpUids(request: APIRequestContext): Promise<string[]> {
		const meta = await (await request.get(PRISMIC_API)).json();
		const ref = meta.refs.find((r: { isMasterRef: boolean }) => r.isMasterRef).ref;
		const q = encodeURIComponent('[[at(document.type,"rsvp")]]');
		const res = await request.get(
			`${PRISMIC_API}/documents/search?ref=${encodeURIComponent(ref)}&q=${q}&pageSize=100`
		);
		return (await res.json()).results.map((doc: { uid: string }) => doc.uid);
	}

	test('are withheld from search but still crawlable', async ({ request }) => {
		const uids = await rsvpUids(request);
		expect(uids.length, 'no rsvp documents came back from Prismic').toBeGreaterThan(0);

		const missing: string[] = [];
		for (const uid of uids) {
			const res = await request.get(`/rsvp/${uid}`);
			// The page must stay REACHABLE. Deindexing works by Google recrawling the
			// page and reading the tag; 404ing or redirecting it instead leaves the
			// old result in the index with nothing to replace it.
			expect(res.status(), `/rsvp/${uid} must stay reachable for the tag to be read`).toBe(200);

			const robots = (await res.text()).match(/<meta\s+name="robots"\s+content="([^"]*)"/i)?.[1];
			if (!robots?.includes('noindex')) missing.push(`/rsvp/${uid} (robots: ${robots ?? 'none'})`);
			// `follow` is deliberate: these pages are linked from real CMS content,
			// so their outbound links should still be crawled.
			else expect(robots, `/rsvp/${uid} should still be followed`).toContain('follow');
		}

		expect(
			missing,
			`${missing.length} of ${uids.length} rsvp page(s) are still indexable:\n${missing.join('\n')}`
		).toEqual([]);
	});

	test('are not advertised in the sitemap', async ({ request }) => {
		// The other half of the pair. Removing them here does not deindex anything
		// on its own — the `noindex` above does that — but leaving them listed keeps
		// asking Google to come back for pages we have asked it to drop.
		const res = await request.get('/sitemap.xml');
		expect(res.status(), 'GET /sitemap.xml').toBe(200);
		const paths = [...(await res.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map(
			(m) => new URL(m[1]).pathname
		);

		expect(paths.length, 'sitemap should not be empty').toBeGreaterThan(5);
		expect(paths.filter((p) => p.startsWith('/rsvp/'))).toEqual([]);
	});
});

test.describe('titles', () => {
	test('every indexed page names the gallery, and none of them twice', async ({ request }) => {
		// The cleanup this whole change is about. Whether a result named the gallery
		// used to depend on whether an editor had filled meta_title on that document:
		// /artists/anthony-james read "Anthony James | Contemporary Artist | Gallery
		// Sonder" while /artists/theo-hirschfield read a bare "Theo Hirschfield".
		//
		// Driven off the sitemap rather than a fixed sample precisely because the
		// gap was per-DOCUMENT, not per-route — a sample of six pages happened to
		// catch it, but the next unbranded page would be whichever one an editor
		// publishes next.
		test.setTimeout(120_000);
		const res = await request.get('/sitemap.xml');
		expect(res.status(), 'GET /sitemap.xml').toBe(200);
		const paths = [...(await res.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map(
			(m) => new URL(m[1]).pathname
		);
		expect(paths.length, 'sitemap should not be empty').toBeGreaterThan(5);

		const unbranded: string[] = [];
		const doubled: string[] = [];
		for (const path of paths) {
			const page = await request.get(path);
			if (page.status() !== 200) continue; // sitemap.spec.ts owns dead-URL duty
			const title = (await page.text()).match(/<title>([^<]*)<\/title>/)?.[1] ?? '';
			expect(title.trim(), `${path} has no <title>`).not.toBe('');
			if (!/Gallery Sonder/i.test(title)) unbranded.push(`${path}: "${title}"`);
			// The other side of the same coin: branding a title that already said
			// "Gallery Sonder" would produce "… | Gallery Sonder | Gallery Sonder",
			// which is the exact kind of sloppy result this change exists to remove.
			if ((title.match(/Gallery Sonder/gi) ?? []).length > 1) doubled.push(`${path}: "${title}"`);
		}

		expect(
			unbranded,
			`${unbranded.length} of ${paths.length} page(s) omit the gallery name:\n${unbranded.join('\n')}`
		).toEqual([]);
		expect(
			doubled,
			`${doubled.length} page(s) name the gallery more than once:\n${doubled.join('\n')}`
		).toEqual([]);
	});
});
