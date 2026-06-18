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

	return {
		page,
		meta_description: page.data.meta_description,
		meta_title: page.data.meta_title || page.data.full_name || 'Gallery Sonder',
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
