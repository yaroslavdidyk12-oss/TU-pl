const CACHE_NAME = 'urbanista-cache-v1';
const FILES_TO_CACHE = [
  './index.html',
  './manifest-pl.json',
  './icon-192.png',
  './icon-512.png'
];

// Додаткові файли: CSS, JS (якщо окремо)
const ADDITIONAL_FILES = [
  // './style.css',  // якщо зовнішній CSS
  // './game.js'     // якщо окремий JS
];

self.addEventListener('install', (event) => {
  console.log('[SW] Instalacja Service Worker');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Cacheowanie plików...');
      return cache.addAll(FILES_TO_CACHE.concat(ADDITIONAL_FILES));
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Aktywacja Service Worker');
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Usuwanie starego cache:', key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached;
      }
      return fetch(event.request).catch(() => {
        // fallback, якщо потрібно
        if (event.request.destination === 'document') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
