const CACHE_NAME = 'image-challenge-v3';

/**
 * كل ما تحتاجه اللعبة للعمل أوفلاين.
 *
 * كانت النسخة السابقة تخزّن الهيكل والأصوات فقط وتترك 204 ملف أيقونة خارج
 * المخزن، فيفتح التطبيق أوفلاين ببطاقة لغز فارغة تماماً. الآن الأيقونات كلها
 * في ملف sprite واحد (60KB) مع الخطوط المستضافة ذاتياً.
 */
const CORE_ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './css/styles.css',
    './css/fonts.css',
    './js/main.js',
    './js/game.js',
    './js/state.js',
    './js/storage.js',
    './js/questions.js',
    './js/arabic.js',
    './js/sounds.js',
    './js/ui.js',
    './js/icons.js',
    './js/timer.js',
    './js/daily.js',
    './js/confetti.js',
    './js/journal.js',
    './js/tutorial.js',
    './assets/sprite.svg',
    './assets/fonts/tajawal-arabic-400.woff2',
    './assets/fonts/tajawal-arabic-500.woff2',
    './assets/fonts/tajawal-arabic-700.woff2',
    './assets/fonts/tajawal-arabic-800.woff2',
    './assets/fonts/tajawal-arabic-900.woff2',
    './assets/fonts/tajawal-latin-400.woff2',
    './assets/fonts/tajawal-latin-500.woff2',
    './assets/fonts/tajawal-latin-700.woff2',
    './assets/fonts/tajawal-latin-800.woff2',
    './assets/fonts/tajawal-latin-900.woff2',
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
        caches.open(CACHE_NAME)
            // addAll ذرّية: أي ملف يفشل يُسقط التثبيت كله. نخزّن كلاً على حدة
            // حتى لا يُفقد الأوفلاين بسبب أصل واحد مفقود.
            .then(cache => Promise.all(
                CORE_ASSETS.map(url => cache.add(url).catch(() => {}))
            ))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(
                keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
            ))
            .then(() => self.clients.claim())
    );
});

/** طلبات التنقل: الشبكة أولاً حتى لا يعلق اللاعب على نسخة قديمة من التطبيق. */
async function handleNavigation(request) {
    try {
        const fresh = await fetch(request);
        const cache = await caches.open(CACHE_NAME);
        cache.put('./index.html', fresh.clone()).catch(() => {});
        return fresh;
    } catch {
        return (await caches.match('./index.html')) || Response.error();
    }
}

/** بقية الأصول: المخزن أولاً — كلها ثابتة ومُصدّرة مع اسم المخزن. */
async function handleAsset(request) {
    const cached = await caches.match(request);
    if (cached) return cached;

    try {
        const response = await fetch(request);
        if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then(c => c.put(request, copy)).catch(() => {});
        }
        return response;
    } catch {
        // كانت النسخة السابقة ترجّع index.html لأي طلب فاشل — فيتلقى وسم
        // <img> صفحة HTML ويفشل فك ترميزها بصمت. الخطأ الصريح أوضح.
        return Response.error();
    }
}

self.addEventListener('fetch', (event) => {
    const { request } = event;
    if (request.method !== 'GET') return;

    const url = new URL(request.url);
    if (url.origin !== self.location.origin) return;

    if (request.mode === 'navigate') {
        event.respondWith(handleNavigation(request));
        return;
    }
    event.respondWith(handleAsset(request));
});
