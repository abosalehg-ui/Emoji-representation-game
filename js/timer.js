const TIMES = { easy: 30, medium: 25, hard: 20 };

let intervalId = null;
let onTimeout = null;
let remaining = 0;
let total = 0;
let active = false;
let barEl = null;
let fillEl = null;

export function initTimer({ bar, fill, onExpire }) {
    barEl = bar;
    fillEl = fill;
    onTimeout = onExpire;
}

export function startTimer(difficulty) {
    stopTimer();
    total = TIMES[difficulty] || 25;
    remaining = total;
    active = true;
    if (barEl) barEl.classList.add('active');
    paint();
    intervalId = setInterval(() => {
        remaining -= 0.1;
        if (remaining <= 0) {
            stopTimer();
            if (onTimeout) onTimeout();
            return;
        }
        paint();
    }, 100);
}

export function stopTimer() {
    if (intervalId) clearInterval(intervalId);
    intervalId = null;
    active = false;
    if (barEl) barEl.classList.remove('low');
}

export function hideTimer() {
    stopTimer();
    if (barEl) barEl.classList.remove('active');
}

export function elapsedSeconds() {
    return total - remaining;
}

export function isActive() {
    return active;
}

function paint() {
    if (!fillEl) return;
    const pct = Math.max(0, (remaining / total) * 100);
    fillEl.style.width = `${pct}%`;
    if (barEl) {
        if (remaining <= 5) barEl.classList.add('low');
        else barEl.classList.remove('low');
    }
}
