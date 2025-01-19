const CACHE_NAME = 'blog-cache-v1';
const urlsToCache = [
    './',
    './index.html',
    './css/style.css',
    './js/main.js',
    './images/professional-bg.jpg',
    './images/favicon-16x16.png',
    './images/favicon-32x32.png',
    './images/apple-touch-icon.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
}); 