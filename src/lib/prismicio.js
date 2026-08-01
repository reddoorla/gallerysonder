import * as prismic from '@prismicio/client';
import { enableAutoPreviews } from '@prismicio/svelte/kit';
import config from '../../slicemachine.config.json';

export const repositoryName = import.meta.env.VITE_PRISMIC_ENVIRONMENT || config.repositoryName;

const routes = [
	{
		type: 'page',
		uid: 'home',
		path: '/'
	},
	{
		type: 'page',
		path: '/:uid'
	},
	{
		type: 'artist',
		path: '/artists/:uid'
	},
	{
		type: 'exhibit',
		path: '/exhibitions/:uid'
	},
	{
		type: 'essay',
		path: '/essays/:uid'
	},
	// rsvp and news were missing here until 2026-08-01 even though both have had
	// SvelteKit routes and published documents for months. A link field pointing at
	// a document whose type has no route resolves with `url: undefined` while
	// `isFilled.link()` still returns true — so every "RSVP" call-to-action passed
	// href={undefined} to LinkArrowButton, which falls back to a <button> with a
	// no-op onclick. The control rendered perfectly and went nowhere, on the
	// homepage and on every exhibition page. Keep in sync with the route folders
	// under src/routes/[[preview=preview]]/ and with TYPE_PATHS in
	// src/routes/sitemap.xml/+server.js.
	{
		type: 'rsvp',
		path: '/rsvp/:uid'
	},
	{
		type: 'news',
		path: '/news/:uid'
	}
];

/**
 * @param {{ cookies?: import('@sveltejs/kit').Cookies } & import('@prismicio/client').ClientConfig} [options]
 */
export const createClient = ({ cookies, ...config } = {}) => {
	const client = prismic.createClient(repositoryName, {
		routes,
		...config
	});

	enableAutoPreviews({ client, cookies });

	return client;
};
