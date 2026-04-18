import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			// Every unprerendered route falls back to the SPA shell. GitHub Pages
			// serves 404.html for anything it doesn't recognize, which means deep
			// links like /settings keep working after a hard refresh.
			fallback: '404.html',
			strict: false
		}),
		paths: {
			// When deploying to https://<user>.github.io/noteflashcards, all
			// URLs need the /noteflashcards prefix. The GH Actions workflow
			// sets BASE_PATH; locally it's empty so dev runs at "/".
			base: process.env.BASE_PATH ?? ''
		}
	}
};

export default config;
