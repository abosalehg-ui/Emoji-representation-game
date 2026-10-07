const CACHE_NAME = 'image-challenge-v5';

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
    // الصوتان الصغيران فقط (16KB معاً).
    //
    // كانت الثمانية كلها هنا — 338 كيلوبايت تُجلب أثناء تثبيت الـService Worker
    // مع أول زيارة، فتُبطل التحميل الكسول في sounds.js تماماً: اللاعب يدفع ثمن
    // كل الأصوات قبل أن يرى لغزاً واحداً، من الطرف الآخر. البقية يخزّنها
    // handleRange عند أول طلب لها (warmSounds في sounds.js عند بدء الجولة).
    './assets/sounds/click.mp3',
    './assets/sounds/correct.mp3',
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

/**
 * يعيد جلب أي أصل أساسي غاب عن المخزن.
 *
 * cache.add في install يبتلع أخطاءه (عمداً، حتى لا يُسقط أصلٌ واحد الأوفلاين
 * كله) — لكن ذلك يفتح ثقباً: لو فشل جلب sprite.svg في أول زيارة، فلا هو في
 * المخزن ولا الأيقونات المنفردة، فتُفتح اللعبة أوفلاين بلا أي أيقونة إطلاقاً.
 * التحقق هنا يغلق الثقب في أول تفعيل تالٍ.
 */
async function healMissingCore() {
    const cache = await caches.open(CACHE_NAME);
    const missing = [];
    for (const url of CORE_ASSETS) {
        if (!(await cache.match(url))) missing.push(url);
    }
    await Promise.all(missing.map(url => cache.add(url).catch(() => {})));
}

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(
                keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
            ))
            .then(() => healMissingCore())
            .then(() => self.clients.claim())
    );
});

/** طلبات التنقل: الشبكة أولاً حتى لا يعلق اللاعب على نسخة قديمة من التطبيق. */
async function handleNavigation(request) {
    try {
        const fresh = await fetch(request);
        // فحص ok ضروري: Cache.put لا يرفض الاستجابات غير الناجحة (يرفض 206 فقط)،
        // فكانت صفحة 404 أو 502 — أو صفحة تسجيل دخول من بوابة شبكة عامة —
        // تُخزَّن مكان هيكل التطبيق وتُقدَّم أوفلاين إلى الأبد. وhandleAsset
        // أدناه كان يفحصها أصلاً، فالتناقض كان داخل ملف واحد.
        if (fresh.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put('./index.html', fresh.clone()).catch(() => {});
        }
        return fresh;
    } catch {
        return (await caches.match('./index.html')) || Response.error();
    }
}

/**
 * يقتطع رد 206 من نسخة كاملة.
 *
 * Safari لا يشغّل <audio> من رد 200 كامل على طلب Range، فلا يكفي أن نقدّم
 * النسخة المخزّنة كما هي.
 */
async function sliceRange(request, full) {
    const buf = await full.arrayBuffer();
    const size = buf.byteLength;
    const type = full.headers.get('Content-Type') || 'application/octet-stream';
    const m = /^bytes=(\d*)-(\d*)$/.exec(request.headers.get('Range') || '');

    let start = 0;
    let end = size - 1;
    if (m && m[1] !== '') {
        start = Number(m[1]);
        if (m[2] !== '') end = Math.min(Number(m[2]), size - 1);
    } else if (m && m[2] !== '') {
        start = Math.max(0, size - Number(m[2]));   // bytes=-N: آخر N بايت
    }
    if (!m || start > end || start >= size) {
        return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${size}` } });
    }

    return new Response(buf.slice(start, end + 1), {
        status: 206,
        headers: {
            'Content-Type': type,
            'Content-Length': String(end - start + 1),
            'Content-Range': `bytes ${start}-${end}/${size}`,
            'Accept-Ranges': 'bytes'
        }
    });
}

/**
 * طلبات Range — يرسلها <audio> و<video> دائماً تقريباً.
 *
 * كانت تمر عبر handleAsset، فيرد الخادم بـ206 و response.ok صحيحة، ثم يرفض
 * Cache.put كل رد 206 بلا استثناء — و .catch يبتلع الرفض. النتيجة: ستة أصوات
 * من ثمانية لم تدخل المخزن قط، والأوفلاين يتكئ على ذاكرة HTTP التي يمسحها
 * المتصفح متى شاء. هنا نجلب النسخة الكاملة مرة واحدة (بلا Range)، نخزّنها،
 * ونقتطع منها ما طُلب — الآن ومن المخزن في كل مرة لاحقة.
 */
async function handleRange(request) {
    const cached = await caches.match(request.url);
    if (cached) return sliceRange(request, cached);

    try {
        const full = await fetch(request.url, { credentials: 'same-origin' });
        if (full.status !== 200) return full;
        const cache = await caches.open(CACHE_NAME);
        await cache.put(request.url, full.clone()).catch(() => {});
        return sliceRange(request, full);
    } catch {
        return Response.error();
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
    if (request.headers.has('Range')) {
        event.respondWith(handleRange(request));
        return;
    }
    event.respondWith(handleAsset(request));
});
