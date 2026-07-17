import { createClient } from '$lib/prismicio';
import { resolveGalleries, resolveNameLists } from '$lib/utils/gallery';
import { error } from '@sveltejs/kit';

export async function load({ params, fetch, cookies, depends }) {
	depends('page:' + params.uid);

	const client = createClient({ fetch, cookies });
	const page = await client.getByUID('artist', params.uid).catch(() => {
		throw error(404, 'Artist not found');
	});

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
		meta_title: page.data.meta_title || page.data.full_name || titleLines || 'Gallery Sonder',
		meta_image: page.data.meta_image.url || page.data.background_image?.url
	};
}

export async function entries() {
	const client = createClient();
	const pages = await client.getAllByType('artist');
	return pages.map((page) => {
		return { uid: page.uid };
	});
}
