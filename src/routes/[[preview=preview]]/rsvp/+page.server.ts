import { createClient } from '$lib/prismicio';
import { filter } from '@prismicio/client';
import { redirect, error } from '@sveltejs/kit';

export async function load({ fetch, cookies }) {
	const client = createClient({ fetch, cookies });
	const page = await client
		.getFirst({
			filters: [filter.at('document.type', 'rsvp')],
			orderings: {
				field: 'document.last_publication_date',
				direction: 'desc'
			}
		})
		.catch(() => null);

	if (!page) {
		throw error(404, 'No RSVP events found');
	}

	throw redirect(302, '/rsvp/' + page.uid);
}
