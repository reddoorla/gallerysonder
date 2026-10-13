import { sveltekit } from '@sveltejs/kit/vite';
import kitConfig from './sveltekit.config.js';
import { defineConfig } from 'vite';
import { imagetools } from '@zerodevx/svelte-img/vite';
import tailwindcss from '@tailwindcss/vite';
import { prismicBarrel } from './scripts/prismic-barrel';

export default defineConfig({
	plugins: [sveltekit(kitConfig), imagetools(), tailwindcss(), prismicBarrel()],
	server: {
		fs: {
			// Allow access to files from the project root.
			allow: ['..']
		}
	}
});
