// Network-first service worker — always fetches fresh, falls back to cache offline.
// Bump CACHE version any time you want to wipe the old cache entirely.
const CACHE = 'myth-wiki-v4';

// On install: take over immediately, no waiting
self.addEventListener('install', e => {
  self.skipWaiting();
});

// On activate: delete every old cache, claim all tabs instantly
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Fetch: try network first, fall back to cache for offline
self.addEventListener('fetch', e => {
  // Only handle GET requests for same-origin resources
  if (e.request.method !== 'GET') return;

  e.respondWith(
    fetch(e.request)
      .then(response => {
        // Cache a copy for offline fallback
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE).then(cache => cache.put(e.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(e.request))
  );
});
