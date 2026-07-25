const TIMES = { easy: 30, medium: 25, hard: 20 };

let rafId = null;
let onTimeout = null;
let startedAt = 0;
let total = 0;
let remaining = 0;
let active = false;
let barEl = null;
let fillEl = null;

export function initTimer({ bar, fill, onExpire }) {
    barEl = bar;
    fillEl = fill;
    onTimeout = onExpire;
}

/**
 * يبدأ المؤقت.
 *
 * كان مبنياً على setInterval(..., 100) مع خصم 0.1 ثابت في كل نبضة — أي أنه
 * يقيس عدد النبضات لا الزمن. النتيجة انحراف ~7% في تبويب نشط، وتوقف شبه كامل
 * في تبويب خلفي حيث يخنق المتصفح المؤقتات إلى ثانية واحدة (تسريع وقت مجاني).
 * الآن نقيس الفارق الحقيقي من performance.now()، فيبقى المؤقت صادقاً مهما
 * تأخّر تنفيذ الإطار.
 */
export function startTimer(difficulty) {
    stopTimer();
    total = TIMES[difficulty] || 25;
    remaining = total;
    startedAt = performance.now();
    active = true;
    if (barEl) barEl.classList.add('active');
    paint();

    const tick = () => {
        if (!active) return;
        remaining = total - (performance.now() - startedAt) / 1000;
        if (remaining <= 0) {
            remaining = 0;
            paint();
            stopTimer();
            onTimeout?.();
            return;
        }
        paint();
        rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
}

export function stopTimer() {
    if (rafId !== null) cancelAnimationFrame(rafId);
    rafId = null;
    active = false;
    if (barEl) barEl.classList.remove('low');
}

export function hideTimer() {
    stopTimer();
    if (barEl) barEl.classList.remove('active');
}

/** الثواني المنقضية فعلياً منذ بدء السؤال — تستخدمها مكافأة السرعة. */
export function elapsedSeconds() {
    if (!total) return 0;
    return Math.max(0, total - remaining);
}

export function isActive() {
    return active;
}

function paint() {
    if (!fillEl) return;
    const pct = Math.max(0, Math.min(100, (remaining / total) * 100));
    fillEl.style.width = `${pct}%`;
    if (barEl) barEl.classList.toggle('low', remaining <= 5);
}
