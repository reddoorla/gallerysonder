// Guards the sitemap against advertising pages that aren't there.
//
// Roughly half the artist documents are roster stubs — `full_name`, `first_name`
// and `last_name` and nothing else, created so the artist exists as a
// relationship target. Nothing on the site links to them (checked across every
// published document), but the sitemap listed all of them, so the only things
// that ever reached those URLs were crawlers and the fleet uptime audit, which
// samples its routes from this file. Each one rendered a hero with three empty
// <h1>s over a blank screen.
//
// Now the route 404s for a stub and the sitemap leaves it out. This test asserts
// the two stay consistent with each other rather than hardcoding which artists
// happen to be stubs today — the list changes as the gallery builds pages out.

import { test, expect, type APIRequestContext } from '@playwright/test';

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
