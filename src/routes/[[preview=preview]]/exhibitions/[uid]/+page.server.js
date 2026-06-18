import { createClient } from '$lib/prismicio';
import { resolveGalleries } from '$lib/utils/gallery';
import { error } from '@sveltejs/kit';

export async function load({ params, fetch, cookies, depends }) {
	depends('page:' + params.uid);

	const client = createClient({ fetch, cookies });
	const page = await client.getByUID('exhibit', params.uid).catch(() => {
		throw error(404, 'Exhibition not found');
	});

	await resolveGalleries(client, page.data.slices);

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
		meta_title: page.data.meta_title || titleLines || 'Gallery Sonder',
		meta_image: page.data.meta_image.url
	};
}

export async function entries() {
	const client = createClient();
	const pages = await client.getAllByType('exhibit');
	return pages.map((page) => {
		return { uid: page.uid };
	});
}
