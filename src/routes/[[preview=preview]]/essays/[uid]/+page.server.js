import { createClient } from '$lib/prismicio';
import { resolveGalleries, resolveNameLists } from '$lib/utils/gallery';
import { error } from '@sveltejs/kit';

export async function load({ params, fetch, cookies, depends }) {
	depends('page:' + params.uid);

	const client = createClient({ fetch, cookies });
	const page = await client.getByUID('essay', params.uid).catch(() => {
		throw error(404, 'Essay not found');
	});

	await Promise.all([
		resolveGalleries(client, page.data.slices),
		resolveNameLists(client, page.data.slices)
	]);

	// Without a per-doc fallback, every essay with no meta_title rendered the bare
	// site name and the pages collided on the same <title>. Build a unique title
	// (and description) from the essay's own title lines, mirroring the exhibit and
	// generic [uid] loads.
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
		meta_description:
			page.data.meta_description ||
			(titleLines ? `${titleLines} — an essay from Gallery Sonder.` : undefined),
		meta_title: page.data.meta_title || titleLines || 'Gallery Sonder',
		meta_image: page.data.meta_image.url
	};
}

export async function entries() {
	const client = createClient();
	const pages = await client.getAllByType('essay');
	return pages.map((page) => {
		return { uid: page.uid };
	});
}
