import { createClient } from '$lib/prismicio';

export async function load({ params, fetch, cookies, depends }) {
	depends('page:' + params.uid);

	const client = createClient({ fetch, cookies });
	const page = await client.getByUID('artist', params.uid);

	return {
		page,
		title: page.data.meta_title || "Gallery Sonder",
		meta_description: page.data.meta_description || "Gallery Sonder News",
		meta_title: page.data.meta_title || "Gallery Sonder News",
		meta_image: page.data.meta_image.url || page.data.background_image
	};
}

export async function entries() {
	const client = createClient();
	const pages = await client.getAllByType('artist');
	return pages.map((page) => {
		return { uid: page.uid };
	});
}
