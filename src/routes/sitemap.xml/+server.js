import { createClient } from '$lib/prismicio';
// Single source of truth for the canonical origin (apex, no www). Previously this
// route duplicated the SITE_URL constant with a stale `www` default, so the
// sitemap kept emitting www after the apex migration moved site.ts to the apex.
// Importing it here keeps the sitemap in lockstep with canonical/og/JSON-LD.
import { SITE_URL } from '$lib/site';
import { artistHasPublicPage } from '$lib/utils/prismic';

// Prerendered alongside the rest of the site, so it's a static file Netlify serves.
export const prerender = true;

// Internal demo/scratch docs that must NOT be advertised to crawlers — or to the
// fleet uptime audit, which samples its routes from this sitemap. 2026-07-16:
// /cms-demo carries an intentional dead demo link (`artist_page` override →
// /artists/link-override, no such artist) that the nightly browser audit flagged as
// a broken link every run. The pages stay reachable at their URLs for anyone with
// the link; they're just no longer advertised as canonical content.
//
// Keyed by document type, because the same scratch uid means different things in
// different types. Until 2026-07-31 this only filtered `page`, so `essay:test`
// (/essays/test) and `news:test-one` (/news/test-one) were both being indexed as
// real content. Unpublishing them in Prismic is the better cure — this only stops
// us advertising them.
/** @type {Record<string, Set<string>>} */
const INTERNAL_UIDS_BY_TYPE = {
	page: new Set(['cms-demo', 'vimeo-demo', 'test']),
	essay: new Set(['test']),
	news: new Set(['test-one'])
};

// Prismic document type -> public path. Keep in sync with the route folders under
// src/routes/[[preview=preview]]/ (note: type 'exhibit' lives at /exhibitions).
//
// `rsvp` is deliberately ABSENT. Those are single-event landing pages reached
// from an invite: one <section>, no nav, no footer, no way back into the site
// (see tests/smoke/routes.ts). Seven of them were being advertised here and were
// indexed under titles like "Opening Reception: Euphorbia" — dead-end results for
// events that have already happened, sitting next to the real pages in search.
// Dropping them here only stops us ADVERTISING them; the `noindex` in
// rsvp/[uid]/+page.svelte is what actually removes them from the index. Both are
// needed, and they must be changed together.
/** @type {Record<string, (uid: string) => string>} */
const TYPE_PATHS = {
	page: (uid) => (uid === 'home' ? '/' : `/${uid}`),
	artist: (uid) => `/artists/${uid}`,
	exhibit: (uid) => `/exhibitions/${uid}`,
	essay: (uid) => `/essays/${uid}`,
	news: (uid) => `/news/${uid}`
};

export async function GET({ fetch }) {
	const client = createClient({ fetch });
	const docs = await client.dangerouslyGetAll().catch(() => []);

	const urls = [];
	for (const doc of docs) {
		const build = TYPE_PATHS[doc.type];
		if (!build || !doc.uid) continue;
		if (INTERNAL_UIDS_BY_TYPE[doc.type]?.has(doc.uid)) continue;
		// Roster stubs — an artist doc with a name and nothing else. Their route
		// 404s (see artists/[uid]/+page.server.js), so advertising them would point
		// crawlers, and the fleet uptime audit, at dead URLs.
		if (doc.type === 'artist' && !artistHasPublicPage(doc.data)) continue;
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
