const CACHE = 'myth-wiki-v1';

const PRECACHE = [
  '/',
  '/index.html',
  '/games.html',
  '/math.html',
  '/quest.html',
  '/profile.html',
  '/stats.html',
  '/story.html',
  '/family-tree.html',
  '/compare.html',
  '/map.html',
  '/secret-challenge.html',
  '/trophy-room.html',
  '/styles.css',
  '/script.js',
  '/games.js',
  '/math.js',
  '/quest.js',
  '/profile.js',
  '/stats.js',
  '/stats-page.js',
  '/story.js',
  '/family-tree.js',
  '/compare.js',
  '/map.js',
  '/secret-challenge.js',
  '/trophy-room.js',
  '/data.js',
  '/quest-data.js',
  '/nav.js',
  '/manifest.json',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
