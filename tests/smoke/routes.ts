// Committed per-site smoke manifest. `tests/smoke/pages.spec.ts` iterates this
// list, asserting each route returns its expected status and paints a hydration
// marker with no console errors. This ships the SAFE DEFAULT every reddoor-starter
// clone inherits; each site's figma-slices build grows the list as real routes
// land (add `{ path, name, hydrationMarker }` entries).
//
// NOTE on the default `/` entry: it expects 200, which holds once the clone is
// wired to a real Prismic repo (getByUID("page","home") resolves). On the bare
// placeholder starter, `/` returns 404 (the Prismic lookup throws → error(404)),
// so the `/` case only goes green after Prismic is wired — by design, since the
// gate is about real site health. The hydration marker `footer` is the shared
// layout footer, present on every page including the error page.

export type SmokeRoute = {
	/** Route path to visit, e.g. "/" or "/about". */
	path: string;
	/** Human-readable label used in the test title. */
	name: string;
	/** CSS selector asserted visible after load (hydration proof). Default: skip. */
	hydrationMarker?: string;
	/** Expected HTTP status. Default: 200. */
	expectStatus?: number;
};

// One route per family. Both `pages.spec.ts` (status + hydration + console) and
// `a11y.spec.ts` (axe) iterate this list, so an entry added here strengthens two
// gates at once. It stayed at the starter default of a single `/` entry for a long
// time, which is part of why a critical axe violation shipped on the rsvp pages:
// CI's a11y audit only ever scanned two synthetic fixture routes, and the only real
// page under any gate was the homepage.
//
// Paths are deliberately concrete rather than sampled from the sitemap: a fixed
// list fails loudly when a page is renamed, where a sampled one would quietly test
// something else. Content-dependent, so a Prismic rename reds CI — that is the same
// bargain sitemap.spec.ts already makes.
export const smokeRoutes: SmokeRoute[] = [
	{ path: '/', name: 'home', hydrationMarker: 'footer' },
	{ path: '/about', name: 'about', hydrationMarker: 'footer' },
	{ path: '/advisory', name: 'advisory', hydrationMarker: 'footer' },
	{ path: '/contact', name: 'contact', hydrationMarker: 'footer' },
	{ path: '/artists', name: 'artists index', hydrationMarker: 'footer' },
	{ path: '/exhibitions', name: 'exhibitions index', hydrationMarker: 'footer' },
	{ path: '/exhibitions/awakening', name: 'exhibition', hydrationMarker: 'footer' },
	{ path: '/artists/theo-hirschfield', name: 'artist', hydrationMarker: 'footer' },
	{ path: '/essays/interstitial-essay', name: 'essay', hydrationMarker: 'footer' },
	// The rsvp pages are standalone landing pages — one <section>, no nav and no
	// footer — so `footer` is not a valid marker here. Its email field is. Worth
	// knowing: a visitor arriving from an invite has no link into the rest of the
	// site from this page. That is a design decision, not a bug, and it is why the
	// footer link list added alongside this does not reach these pages.
	// Scoped to #main-content: the layout also ships several hidden Netlify forms,
	// each with its own email input, so a bare input[type=email] matches five things.
	{
		path: '/rsvp/euphorbia',
		name: 'rsvp event',
		hydrationMarker: '#main-content input[type="email"]'
	}
];
