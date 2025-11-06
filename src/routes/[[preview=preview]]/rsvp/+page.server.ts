import { createClient } from '$lib/prismicio';
import { filter } from '@prismicio/client';
import { redirect } from '@sveltejs/kit';

export async function load({ params, fetch, cookies, depends }) {

    const client = createClient({ fetch, cookies });
    const page = await client.getFirst({filters:[filter.at("document.type","rsvp")]});

    throw redirect(302, '/rsvp/'+page.uid)
}
