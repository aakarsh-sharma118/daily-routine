const CACHE_NAME = "daily-routine-tracker-cache-v1";
const urlsToCache = [
  "/daily-routine/",
  "/daily-routine/index.html",
  "/daily-routine/manifest.json",
  "/daily-routine/icons/icon-192x192.png",
  "/daily-routine/icons/icon-512x512.png",
  "/daily-routine/icons/favicon-32x32.png",
  "/daily-routine/icons/favicon-16x16.png",
];

// Install event: cache all necessary files
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log("Opened cache");
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate event: cleanup old caches if any
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log("Service Worker: clearing old cache", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event: try cache first, then network
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cache if found
        if (response) {
          return response;
        }
        // Otherwise fetch from network
        return fetch(event.request);
      })
  );
});
