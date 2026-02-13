const CACHE_NAME = 'urbanist-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/index_pl.html',
  '/style.css', // якщо стилі окремо
  '/main.js',   // якщо JS окремо
  '/icon-192.png',
  '/icon-512.png'
];

// Встановлення SW і кешування
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Активація SW
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => 
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
});

// Перехоплення запитів та повернення кешу
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});