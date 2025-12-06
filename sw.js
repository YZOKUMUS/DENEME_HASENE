// ============================================
// SERVICE WORKER - PWA ve Offline Desteği
// ============================================

const CACHE_NAME = 'hasene-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/js/config.js',
    '/js/constants.js',
    '/js/utils.js',
    '/js/indexeddb-cache.js',
    '/js/data-loader.js',
    '/js/badge-visualization.js',
    '/js/game-core.js',
    '/js/detailed-stats.js',
    '/js/notifications.js',
    '/js/onboarding.js',
    '/js/error-handler.js',
    '/manifest.json',
    '/assets/images/icon-192.png',
    '/assets/images/icon-512.png'
];

// Install event
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Cache açıldı');
                return cache.addAll(urlsToCache);
            })
            .catch((error) => {
                console.error('Cache hatası:', error);
            })
    );
});

// Activate event
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Eski cache siliniyor:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetch event - Network first strategy
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Response'u cache'e ekle
                const responseToCache = response.clone();
                caches.open(CACHE_NAME)
                    .then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                return response;
            })
            .catch(() => {
                // Network hatası durumunda cache'den döndür
                return caches.match(event.request)
                    .then((response) => {
                        if (response) {
                            return response;
                        }
                        // Cache'de de yoksa offline sayfası göster
                        if (event.request.destination === 'document') {
                            return caches.match('/index.html');
                        }
                    });
            })
    );
});


