import { createClient } from '$lib/prismicio';
// Single source of truth for the canonical origin (apex, no www). Previously this
// route duplicated the SITE_URL constant with a stale `www` default, so the
// sitemap kept emitting www after the apex migration moved site.ts to the apex.
// Importing it here keeps the sitemap in lockstep with canonical/og/JSON-LD.
import { SITE_URL } from '$lib/site';

// Prerendered alongside the rest of the site, so it's a static file Netlify serves.
export const prerender = true;

// Internal demo/scratch `page` docs that must NOT be advertised to crawlers — or to
// the fleet uptime audit, which samples its routes from this sitemap. 2026-07-16:
// /cms-demo carries an intentional dead demo link (`artist_page` override →
// /artists/link-override, no such artist) that the nightly browser audit flagged as
// a broken link every run. The pages stay reachable at their URLs for anyone with
// the link; they're just no longer advertised as canonical content.
const INTERNAL_PAGE_UIDS = new Set(['cms-demo', 'vimeo-demo', 'test']);

// Prismic document type -> public path. Keep in sync with the route folders under
// src/routes/[[preview=preview]]/ (note: type 'exhibit' lives at /exhibitions).
/** @type {Record<string, (uid: string) => string>} */
const TYPE_PATHS = {
	page: (uid) => (uid === 'home' ? '/' : `/${uid}`),
	artist: (uid) => `/artists/${uid}`,
	exhibit: (uid) => `/exhibitions/${uid}`,
	essay: (uid) => `/essays/${uid}`,
	news: (uid) => `/news/${uid}`,
	rsvp: (uid) => `/rsvp/${uid}`
};

export async function GET({ fetch }) {
	const client = createClient({ fetch });
	const docs = await client.dangerouslyGetAll().catch(() => []);

	const urls = [];
	for (const doc of docs) {
		const build = TYPE_PATHS[doc.type];
		if (!build || !doc.uid) continue;
		if (doc.type === 'page' && INTERNAL_PAGE_UIDS.has(doc.uid)) continue;
		const loc = SITE_URL + build(doc.uid);
		const lastmod = doc.last_publication_date?.slice(0, 10);
		urls.push(
			`	<url>\n		<loc>${loc}</loc>${lastmod ? `\n		<lastmod>${lastmod}</lastmod>` : ''}\n	</url>`
		);
	}

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

	return new Response(body, {
		headers: { 'Content-Type': 'application/xml' }
	});
}
