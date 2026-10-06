const CACHE_NAME = 'atlas-copco-v2';
const OFFLINE_URL = '/offline';

const ASSETS_TO_CACHE = [
  OFFLINE_URL,
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/favicon.ico'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  // Exclude API calls from service worker caching completely
  if (event.request.url.includes('/api/')) return;

  event.respondWith(
    fetch(event.request).catch(async (error) => {
      const cache = await caches.open(CACHE_NAME);
      const cachedResponse = await cache.match(event.request);
      
      if (cachedResponse) {
        return cachedResponse;
      }
      
      // If it's a navigation request and it fails, return the offline page
      if (event.request.mode === 'navigate') {
        const offlinePage = await cache.match(OFFLINE_URL);
        if (offlinePage) {
          return offlinePage;
        }
      }
      
      throw error;
    })
  );
});
