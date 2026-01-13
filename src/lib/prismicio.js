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
	}
];

export const createClient = ({ cookies, ...config } = {}) => {
	const client = prismic.createClient(repositoryName, {
		routes,
		...config
	});

	enableAutoPreviews({ client, cookies });

	return client;
};
