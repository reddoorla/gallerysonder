import { createClient } from '$lib/prismicio';

// Prerendered alongside the rest of the site, so it's a static file Netlify serves.
export const prerender = true;

// Absolute URLs require a known origin; prerendering can't read the real host.
// Override with VITE_SITE_URL in .env / Netlify if the canonical domain differs.
const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://www.gallerysonder.com').replace(
	/\/$/,
	''
);

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
