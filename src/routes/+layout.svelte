<script>
	import '../app.css';
	import { onMount } from 'svelte';
	import { base } from '$app/paths';

	onMount(() => {
		// Register the service worker so Chrome offers "Install app" and the
		// launched PWA runs without browser chrome (no address bar).
		// We serve the worker from the site root (or its base-path prefix on
		// GitHub Pages) so its scope covers the whole app.
		if ('serviceWorker' in navigator && typeof window !== 'undefined') {
			const swUrl = `${base}/service-worker.js`;
			navigator.serviceWorker.register(swUrl).catch((err) => {
				// Non-fatal: PWA install prompt just won't show. Keep the app
				// working either way.
				console.warn('Service worker registration failed:', err);
			});
		}
	});
</script>

<div class="app-shell">
	<slot />
</div>

<style>
	.app-shell {
		min-height: 100dvh;
		padding-top: var(--safe-top);
		padding-bottom: var(--safe-bottom);
		display: flex;
		flex-direction: column;
		max-width: 560px;
		margin: 0 auto;
	}
</style>
