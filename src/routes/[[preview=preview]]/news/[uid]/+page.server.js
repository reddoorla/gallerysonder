import { createClient } from '$lib/prismicio';
import { resolveGalleries, resolveNameLists } from '$lib/utils/gallery';
import { error } from '@sveltejs/kit';

export async function load({ params, fetch, cookies, depends }) {
	depends('page:' + params.uid);

	const client = createClient({ fetch, cookies });
	const page = await client.getByUID('news', params.uid).catch(() => {
		throw error(404, 'Article not found');
	});

	await Promise.all([
		resolveGalleries(client, page.data.slices),
		resolveNameLists(client, page.data.slices)
	]);

	// full_name is often empty on news docs (they carry title lines instead), which
	// left those pages colliding on the bare site name. Add the title lines to the
	// fallback chain so the <title> stays unique before reaching 'Gallery Sonder'.
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
		meta_image: page.data.meta_image.url
	};
}

export async function entries() {
	const client = createClient();
	const pages = await client.getAllByType('news');
	return pages.map((page) => {
		return { uid: page.uid };
	});
}
