import { createClient } from '$lib/prismicio';
import { resolveGalleries, resolveNameLists } from '$lib/utils/gallery';
import { artistHasPublicPage } from '$lib/utils/prismic';
import { brandedTitle } from '$lib/site';
import { error } from '@sveltejs/kit';

export async function load({ params, fetch, cookies, depends }) {
	depends('page:' + params.uid);

	const client = createClient({ fetch, cookies });
	const page = await client.getByUID('artist', params.uid).catch(() => {
		throw error(404, 'Artist not found');
	});

	// Roster stubs (a name and nothing else) have no page to show — serving one
	// renders an empty hero over a blank screen. Treat them as not-yet-published.
	//
	// Deliberately NOT exempted for Prismic preview sessions. An earlier revision
	// skipped this when the `io.prismic.preview` cookie was present, which bought
	// nothing and cost three things:
	//   - it keyed off the cookie's mere presence, so any stale or hand-set value
	//     served the blank page with a 200 to a scripted client;
	//   - in a browser the toolbar mounts on that same cookie, finds no live
	//     session, deletes it and reloads — so the page painted and then rewrote
	//     itself as "Page not found" a second later, URL unchanged;
	//   - the cookie is SameSite=Lax, so it is withheld when Prismic frames the
	//     site (netlify.toml allows `frame-ancestors https://*.prismic.io`), and
	//     the exemption would not have applied in the editor's iframe anyway.
	// It bought nothing because a LIVE preview session already queries the preview
	// ref: a draft with any slice, hero image or title line passes the check on its
	// own content and renders. The only case the exemption covered was previewing a
	// draft that is still completely empty — which has nothing to show either way.
	if (!artistHasPublicPage(page.data)) {
		throw error(404, 'Artist not found');
	}

	await Promise.all([
		resolveGalleries(client, page.data.slices),
		resolveNameLists(client, page.data.slices)
	]);

	// full_name is the artist's name and normally set, but guard the case where it
	// is empty by adding the title lines before the bare site name so the <title>
	// never collides across artist pages.
	const titleLines = [
		page.data.title_line_one,
		page.data.title_line_two,
		page.data.title_line_three
	]
		.filter(Boolean)
		.join(' ')
		.trim();

	return {
		page,
		meta_description: page.data.meta_description,
		meta_title: brandedTitle(page.data.meta_title || page.data.full_name || titleLines),
		meta_image: page.data.meta_image.url || page.data.background_image?.url
	};
}

export async function entries() {
	const client = createClient();
	const pages = await client.getAllByType('artist');
	// Skip the stubs the load throws 404 for, so prerendering doesn't spend a pass
	// on pages that will never be served.
	return pages.filter((page) => artistHasPublicPage(page.data)).map((page) => ({ uid: page.uid }));
}
