// Minimal service worker — exists so the site qualifies as an installable
// PWA (standalone launch, no address bar).
//
// We intentionally do NOT register a `fetch` handler. Modern Chrome only
// needs any active service worker to satisfy the install criteria; a no-op
// `fetch` listener just wakes the SW on every request for no benefit and
// adds latency. If/when we want offline support, add a cache-first
// `fetch` handler and bump CACHE_VERSION to invalidate old caches.

self.addEventListener('install', () => {
	// Take over immediately on first install so the page it was registered
	// from doesn't need a reload to be controlled.
	self.skipWaiting();
});

self.addEventListener('activate', (event) => {
	event.waitUntil(self.clients.claim());
});
