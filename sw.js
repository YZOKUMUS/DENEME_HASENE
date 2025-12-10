// ============================================
// SERVICE WORKER - PWA ve Offline Desteği
// ============================================

const CACHE_NAME = 'hasene-v2';
const DATA_CACHE_NAME = 'hasene-data-v2';
const urlsToCache = [
    './',
    './index.html',
    './style.css',
    './js/config.js',
    './js/constants.js',
    './js/utils.js',
    './js/indexeddb-cache.js',
    './js/data-loader.js',
    './js/error-handler.js',
    './js/audio-manager.js',
    './js/points-manager.js',
    './js/word-stats-manager.js',
    './js/favorites-manager.js',
    './js/badge-visualization.js',
    './js/game-core.js',
    './js/detailed-stats.js',
    './js/notifications.js',
    './js/onboarding.js',
    './manifest.json',
    './assets/images/icon-192.png',
    './assets/images/icon-512.png'
];

// JSON dosyaları için ayrı cache
const dataUrlsToCache = [
    './data/kelimebul.json',
    './data/ayetoku.json',
    './data/duaet.json',
    './data/hadisoku.json'
];

// Install event
self.addEventListener('install', (event) => {
    event.waitUntil(
        Promise.all([
            // App dosyalarını cache'le
            caches.open(CACHE_NAME).then((cache) => {
                return cache.addAll(urlsToCache);
            }),
            // JSON dosyalarını cache'le (background'da, hata olsa bile devam et)
            caches.open(DATA_CACHE_NAME).then((cache) => {
                // Her dosyayı ayrı ayrı ekle, biri başarısız olsa bile diğerleri yüklensin
                return Promise.allSettled(
                    dataUrlsToCache.map(url => 
                        cache.add(url).catch(() => {
                            // Sessizce devam et
                        })
                    )
                );
            })
        ]).catch(() => {
            // Sessizce devam et
        })
    );
    // Yeni Service Worker'ı hemen aktif et
    self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    // Yeni cache isimlerini koru, eski olanları sil
                    if (cacheName !== CACHE_NAME && cacheName !== DATA_CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            // Tüm client'lara yeni Service Worker'ı bildir
            return self.clients.claim();
        })
    );
});

// Fetch event - Strateji: JSON dosyaları için Cache First, diğerleri için Network First
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    const isDataFile = url.pathname.includes('/data/') && url.pathname.endsWith('.json');
    
    if (isDataFile) {
        // JSON dosyaları için: Cache First (hızlı yükleme)
        event.respondWith(
            caches.match(event.request)
                .then((cachedResponse) => {
                    if (cachedResponse) {
                        // Cache'den döndür ve arka planda güncelle
                        fetch(event.request)
                            .then((networkResponse) => {
                                if (networkResponse.ok) {
                                    const responseToCache = networkResponse.clone();
                                    caches.open(DATA_CACHE_NAME)
                                        .then((cache) => {
                                            cache.put(event.request, responseToCache);
                                        });
                                }
                            })
                            .catch(() => {
                                // Network hatası, cache'den devam et
                            });
                        return cachedResponse;
                    }
                    
                    // Cache'de yoksa network'ten yükle
                    return fetch(event.request)
                        .then((response) => {
                            if (response.ok) {
                                const responseToCache = response.clone();
                                caches.open(DATA_CACHE_NAME)
                                    .then((cache) => {
                                        cache.put(event.request, responseToCache);
                                    });
                            }
                            return response;
                        })
                        .catch(() => {
                            // Network hatası
                            return new Response(JSON.stringify([]), {
                                headers: { 'Content-Type': 'application/json' }
                            });
                        });
                })
        );
    } else {
        // POST, PUT, DELETE gibi non-GET isteklerini cache'leme (Supabase API çağrıları dahil)
        const isNonGetRequest = event.request.method !== 'GET';
        const isSupabaseAPI = url.hostname.includes('supabase.co');
        
        if (isNonGetRequest || isSupabaseAPI) {
            // API çağrılarını direkt network'ten yap, cache'leme
            event.respondWith(fetch(event.request));
            return;
        }
        
        // Diğer GET istekleri için: Network First
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    // Sadece başarılı GET isteklerini cache'e ekle
                    if (response.ok && event.request.method === 'GET') {
                        const responseToCache = response.clone();
                        const cacheName = url.pathname.includes('/data/') ? DATA_CACHE_NAME : CACHE_NAME;
                        caches.open(cacheName)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            })
                            .catch(() => {
                                // Cache hatası, sessizce devam et
                            });
                    }
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
                                return caches.match('./index.html');
                            }
                        });
                })
        );
    }
});


