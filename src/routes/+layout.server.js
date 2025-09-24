import { createClient } from '$lib/prismicio';
export const prerender = true;

export async function load({ params, fetch, cookies }) {
	const client = createClient({ fetch, cookies });

	const nav = await client.getSingle('nav');

	return {
		nav,

	};
}
