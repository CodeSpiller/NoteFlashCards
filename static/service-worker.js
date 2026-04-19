// Minimal service worker — exists so Chrome treats the site as installable.
// We intentionally do NOT cache anything: the app is tiny and served from a
// CDN (GitHub Pages), so the browser's HTTP cache already does the right
// thing and there's no stale-content risk.
//
// If you later want offline support, add a proper cache-first strategy here
// and bump the CACHE_VERSION below to invalidate old caches.

const CACHE_VERSION = 'v1';

self.addEventListener('install', (event) => {
	// Take over immediately on first install so the page it was registered
	// from doesn't need a reload to be controlled.
	self.skipWaiting();
});

self.addEventListener('activate', (event) => {
	event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
	// Pass-through. The presence of a fetch handler is what Chrome looks for
	// when deciding whether to offer "Install app"; we don't need to change
	// the response.
});
