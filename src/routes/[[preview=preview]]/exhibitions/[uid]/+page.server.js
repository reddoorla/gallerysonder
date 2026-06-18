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

	return {
		page,
		title: page.data.meta_title,
		meta_description: page.data.meta_description,
		meta_title: page.data.meta_title,
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
