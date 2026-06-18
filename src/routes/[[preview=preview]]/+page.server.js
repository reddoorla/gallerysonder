import { createClient } from '$lib/prismicio';
import { resolveGalleries } from '$lib/utils/gallery';

export async function load({ fetch, cookies }) {
	const client = createClient({ fetch, cookies });

	const page = await client.getByUID('page', 'home');
	const nav = await client.getSingle('nav');

	// Resolve image_gallery relationships server-side so the grid is SSR'd
	// (kills the spinner->grid CLS and the slow client-fetched gallery LCP).
	await resolveGalleries(client, page.data.slices);

	return {
		page,
		nav,
		title: 'Sonder',
		meta_description: page.data.meta_description,
		meta_title: page.data.meta_title,
		meta_image: page.data.meta_image.url
	};
}

export function entries() {
	return [{}];
}
