/**
 * Canonical origin for absolute URLs (canonical links, og:url, sitemap, JSON-LD).
 * Prerendering can't read the real request host, so set VITE_SITE_URL in
 * Netlify; it defaults to the production domain. No trailing slash.
 */
export const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://www.gallerysonder.com').replace(
	/\/$/,
	''
);

/** Absolute URL for a path (e.g. canonical/og:url) from the pathname. */
export const absoluteUrl = (pathname: string): string =>
	SITE_URL + (pathname.startsWith('/') ? pathname : '/' + pathname);

/**
 * Serialize an object as a JSON-LD <script> tag for {@html} in <svelte:head>.
 * Safe by construction: JSON.stringify escapes quotes and `<` is escaped to
 * < so CMS values can never break out of the script element.
 */
export const jsonLdScript = (data: unknown): string =>
	`<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;

/** Organization schema for the gallery, emitted site-wide. */
export const organizationJsonLd = () => ({
	'@context': 'https://schema.org',
	'@type': 'ArtGallery',
	name: 'Gallery Sonder',
	url: SITE_URL,
	logo: `${SITE_URL}/android-chrome-512x512.png`,
	sameAs: ['https://www.instagram.com/gallerysonder/']
});
