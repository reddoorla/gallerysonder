/**
 * Canonical origin for absolute URLs (canonical links, og:url, sitemap, JSON-LD).
 * Prerendering can't read the real request host, so set VITE_SITE_URL in
 * Netlify; it defaults to the production domain. No trailing slash.
 *
 * Use the APEX (no www): the host serves on gallerysonder.com and 301-redirects
 * www -> apex, so pointing canonical/og at www made every shared URL eat a
 * redirect (~910ms, ~12 Lighthouse perf points). Keep this matched to the host.
 */
export const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://gallerysonder.com').replace(
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

/**
 * The gallery's real-world identity, kept here rather than inline in the schema
 * so the address/phone that Google reads sits next to the one the footer shows.
 * These MUST stay byte-identical to the Google Business Profile listing — a
 * mismatched address or phone is the usual reason Google declines to associate
 * a site with its business listing (no knowledge panel, no map result).
 */
const GALLERY = {
	name: 'Gallery Sonder',
	streetAddress: '3435 E Coast Highway',
	addressLocality: 'Corona del Mar',
	addressRegion: 'CA',
	postalCode: '92625',
	addressCountry: 'US',
	telephone: '+1-949-662-0077',
	email: 'info@gallerysonder.com'
} as const;

/**
 * Open Wednesday–Sunday, 11:00–18:00. Monday and Tuesday are absent on purpose:
 * schema.org has no "closed" value, so a day the gallery is shut is expressed by
 * omitting it. Listing them with equal opens/closes reads as "open 0 hours" and
 * is what trips the "opening hours are invalid" warning in Google's validator.
 */
const OPEN_DAYS = ['Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;

/**
 * Organization schema for the gallery, emitted site-wide.
 *
 * The address, telephone and opening hours are what a knowledge panel is built
 * from; without them this was a bare name+logo stub that gave Google nothing to
 * corroborate the Business Profile against. Schema alone does NOT create the
 * panel — the Business Profile does — but it is the on-site half of the pair.
 */
export const organizationJsonLd = () => ({
	'@context': 'https://schema.org',
	'@type': 'ArtGallery',
	// A stable @id lets the per-page Person/Breadcrumb graphs point at one
	// gallery entity instead of Google inferring a new one per page.
	'@id': `${SITE_URL}/#gallery`,
	name: GALLERY.name,
	url: SITE_URL,
	logo: `${SITE_URL}/android-chrome-512x512.png`,
	image: `${SITE_URL}/android-chrome-512x512.png`,
	telephone: GALLERY.telephone,
	email: GALLERY.email,
	address: {
		'@type': 'PostalAddress',
		streetAddress: GALLERY.streetAddress,
		addressLocality: GALLERY.addressLocality,
		addressRegion: GALLERY.addressRegion,
		postalCode: GALLERY.postalCode,
		addressCountry: GALLERY.addressCountry
	},
	openingHoursSpecification: OPEN_DAYS.map((day) => ({
		'@type': 'OpeningHoursSpecification',
		dayOfWeek: day,
		opens: '11:00',
		closes: '18:00'
	})),
	// Every profile listed here is a corroborating signal for the same entity.
	// Add the gallery's other real profiles (Artsy, Facebook, LinkedIn) as they
	// exist — only URLs the gallery actually controls belong here.
	sameAs: ['https://www.instagram.com/gallerysonder/']
});

/**
 * Guarantee a <title> names the gallery exactly once.
 *
 * Whether a search result named the gallery used to come down to whether someone
 * had filled the SEO field on that document — /artists/anthony-james read
 * "Anthony James | Contemporary Artist | Gallery Sonder" while
 * /artists/theo-hirschfield read a bare "Theo Hirschfield". That mix is most of
 * why the result set looked like a pile of unrelated pages rather than one site.
 *
 * Applied to EVERY title, editor-written or fallback. The first version trusted
 * an explicit meta_title to carry the branding ("they all end in | Gallery
 * Sonder") — within three weeks editors had written "About" and "Advisory", and
 * the smoke gate caught them. The words before the brand stay the editor's call;
 * naming the site is not. Titles that already name the gallery pass through
 * untouched rather than doubled.
 */
export const brandedTitle = (derived?: string | null): string => {
	const name = derived?.trim();
	if (!name) return 'Gallery Sonder';
	return /gallery sonder/i.test(name) ? name : `${name} | Gallery Sonder`;
};

/**
 * Sections that have a real index route, mapped to their breadcrumb label.
 *
 * Deliberately NOT derived from the URL: a breadcrumb item is a link Google
 * follows and displays, and /essays, /news and /rsvp have no index page (they
 * 404). Auto-splitting the path would have published `Home > Essays > …` with a
 * dead middle crumb. A section only earns a crumb once it has a page to land on.
 */
const BREADCRUMB_SECTIONS: Record<string, string> = {
	artists: 'Artists',
	exhibitions: 'Exhibitions'
};

/**
 * The page-specific head of an SEO title: "Interstitial | Sheng Lor | Gallery
 * Sonder" -> "Interstitial". A breadcrumb wants the page's NAME; feeding it the
 * full keyword-bearing <title> renders a crumb trail of paragraphs.
 */
const breadcrumbName = (metaTitle: string, pathname: string): string => {
	const head = metaTitle.split(/\s+[|—–]\s+/)[0].trim();
	if (head) return head;
	// Fall back to the slug so a page with no usable title still names itself.
	const slug = pathname.replace(/\/$/, '').split('/').filter(Boolean).pop() ?? '';
	return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
};

/**
 * BreadcrumbList schema for a page, or null on the homepage (a one-item trail
 * says nothing).
 *
 * This is an APPEARANCE feature, not a ranking one: it replaces the raw URL path
 * above a search result with a readable trail (gallerysonder.com › Artists ›
 * Theo Hirschfield). It is NOT what produces the indented sitelinks — Google's
 * sitelinks documentation says those are fully automated and does not mention
 * structured data at all. The levers it does name are informative page titles,
 * a logical site structure with good internal anchor text, and `noindex` to
 * remove a sitelink; see brandedTitle() above and the rsvp route for those two.
 */
export const breadcrumbJsonLd = (pathname: string, metaTitle: string) => {
	const segments = pathname
		.replace(/^\/|\/$/g, '')
		.split('/')
		.filter(Boolean);
	if (!segments.length) return null;

	const trail: { name: string; item: string }[] = [{ name: 'Home', item: SITE_URL }];
	const section = segments.length > 1 ? BREADCRUMB_SECTIONS[segments[0]] : undefined;
	if (section) trail.push({ name: section, item: `${SITE_URL}/${segments[0]}` });
	trail.push({ name: breadcrumbName(metaTitle, pathname), item: absoluteUrl(pathname) });

	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: trail.map((crumb, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: crumb.name,
			item: crumb.item
		}))
	};
};
