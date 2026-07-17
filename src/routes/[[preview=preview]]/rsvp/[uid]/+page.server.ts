import { createClient } from '$lib/prismicio';
import { error } from '@sveltejs/kit';

export async function load({ params, fetch, cookies, depends }) {
	depends('page:' + params.uid);

	const client = createClient({ fetch, cookies });
	const page = await client.getByUID('rsvp', params.uid).catch(() => {
		throw error(404, 'RSVP not found');
	});

	// Without a per-doc fallback, every rsvp with no meta_title rendered the bare
	// site name and the pages collided on the same <title>. Fall back to the
	// event's own fields for a unique, descriptive title + description. Two events
	// can share a name (e.g. "Opening Reception"), so fold in the event date to
	// keep each title unique — bounded to keep the <title> <= 70 chars.
	// `dates` is free-form and can span multiple lines (date + reception/reading
	// times); take just the first line so the title stays single-line and tidy.
	const eventName = page.data.name?.trim();
	const eventDate = page.data.dates?.split('\n')[0].trim();
	const nameWithDate = eventName && eventDate ? `${eventName} — ${eventDate}` : eventName;
	const rsvpTitle = nameWithDate && nameWithDate.length <= 70 ? nameWithDate : eventName;
	const rsvpDescription = eventName
		? `RSVP for ${eventName}${eventDate ? ` on ${eventDate}` : ''} at Gallery Sonder.`
		: undefined;

	return {
		page,
		meta_description: page.data.meta_description || rsvpDescription,
		meta_title: page.data.meta_title || rsvpTitle || 'Gallery Sonder',
		meta_image: page.data.meta_image.url
	};
}

export async function entries() {
	const client = createClient();
	const pages = await client.getAllByType('rsvp');
	return pages.map((page) => {
		return { uid: page.uid };
	});
}
