const CACHE_NAME = 'image-challenge-v2';
const CORE_ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './css/styles.css',
    './js/main.js',
    './js/game.js',
    './js/state.js',
    './js/questions.js',
    './js/arabic.js',
    './js/sounds.js',
    './js/ui.js',
    './js/timer.js',
    './js/daily.js',
    './js/confetti.js',
    './assets/sounds/correct.mp3',
    './assets/sounds/wrong.mp3',
    './assets/sounds/hint.mp3',
    './assets/sounds/levelup.mp3',
    './assets/sounds/gameover.mp3',
    './assets/sounds/highscore.mp3',
    './assets/sounds/click.mp3',
    './assets/sounds/start.mp3',
    './assets/icons/icon-192.svg',
    './assets/icons/icon-512.svg',
    './assets/icons/icon-maskable.svg'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS).catch(() => {}))
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    const req = event.request;
    if (req.method !== 'GET') return;
    const url = new URL(req.url);
    if (url.origin !== self.location.origin && !url.host.includes('fonts.g')) return;

    event.respondWith(
        caches.match(req).then(cached => {
            if (cached) return cached;
            return fetch(req).then(resp => {
                const copy = resp.clone();
                if (resp.ok && (url.origin === self.location.origin || url.host.includes('fonts.g'))) {
                    caches.open(CACHE_NAME).then(cache => cache.put(req, copy)).catch(() => {});
                }
                return resp;
            }).catch(() => caches.match('./index.html'));
        })
    );
});
