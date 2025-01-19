const CACHE_NAME = 'blog-cache-v1';
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

const urlsToCache = [
    '/',
    '/index.html',
    '/css/style.css',
    '/js/main.js',
    '/images/hero-bg.webp',
    '/images/favicon-16x16.png',
    '/images/favicon-32x32.png',
    '/images/apple-touch-icon.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    // Check if cache is expired
                    const cacheDate = new Date(response.headers.get('date'));
                    if ((new Date() - cacheDate) > CACHE_DURATION) {
                        return fetchAndCache(event.request);
                    }
                    return response;
                }
                return fetchAndCache(event.request);
            })
    );
});

function fetchAndCache(request) {
    return fetch(request)
        .then(response => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
            }

            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
                .then(cache => {
                    cache.put(request, responseToCache);
                });

            return response;
        });
} 