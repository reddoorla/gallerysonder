import { asText } from '@prismicio/client';

import { createClient } from '$lib/prismicio';

export async function load({ fetch, cookies }) {
	const client = createClient({ fetch, cookies });

	const page = await client.getByUID('page', 'home', {fetchLinks:['artist.data.full_name', 'artist.data.first_name', 'artist.data.last_name']});
	const intro = await client.getSingle('intro_images')
	const nav = await client.getSingle('nav')
	

	return {
		page,
		intro,
		nav,
		title: "Sonder",
		meta_description: page.data.meta_description,
		meta_title: page.data.meta_title,
		meta_image: page.data.meta_image.url
	};
}

export function entries() {
	return [{}];
}
