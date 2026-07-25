import { gameState, setTheme, getTheme, HINTS_PER_ROUND } from './state.js';
import { iconMarkup, setIcon } from './icons.js';

export const elements = {};

const ELEMENT_IDS = [
    'startScreen','gameScreen','gameoverScreen',
    'playBtn','scoreDisplay','levelBadge','livesDisplay',
    'emojiDisplay','hintBtn','hintCount','hintDisplay',
    'answerInput','submitBtn','skipBtn','skipCount',
    'answerReveal','answerRevealLabel','answerRevealText',
    'finalScore','highscoreBadge','correctAnswers','highestLevel','bestStreakStat',
    'playAgainBtn','changeSettingsBtn','shareBtn','soundToggle','themeToggle','themeIcon',
    'toast','gameoverEmoji','gameoverIcon','gameoverSubtitle',
    'streakBadge','streakCount','timerBar','timerBarFill',
    'resumeBanner','resumeDifficulty','resumeScore','resumeClose',
    'dailyChip','classicChip','dailyDoneBadge',
    'categoryGrid','timerToggle','installBtn','soundIcon',
    'volumeSlider','volumeRow','settingsToggle','settingsPanel',
    'journalBtn','journalScreen','journalGrid','journalProgress','journalCloseBtn',
    'introScreen','introPuzzle','introInput','introSubmit','introSkip','introHint','introFeedback',
    'storageWarning'
];

export function cacheElements() {
    ELEMENT_IDS.forEach(id => {
        const el = document.getElementById(id);
        if (el) elements[id] = el;
    });
}

export function showScreen(screenId) {
    const target = document.getElementById(screenId);
    if (!target) return;
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'auto' });
}

/* ------------------------------------------------------------------ */
/* اللغز                                                               */
/* ------------------------------------------------------------------ */

export function renderPuzzle(iconNames) {
    if (!elements.emojiDisplay) return;
    // alt/aria فارغة عمداً: نطق أسماء الأيقونات يكشف الإجابة.
    elements.emojiDisplay.innerHTML = iconNames
        .map(name => iconMarkup(name, 'puzzle-icon'))
        .join('');
}

export function showPuzzleLoading() {
    if (!elements.emojiDisplay) return;
    elements.emojiDisplay.innerHTML =
        '<div class="loading"><div class="loading-dot"></div><div class="loading-dot"></div><div class="loading-dot"></div></div>';
}

/* ------------------------------------------------------------------ */
/* الرسائل                                                             */
/* ------------------------------------------------------------------ */

let toastTimeout;
export function showToast(message) {
    if (!elements.toast) return;
    elements.toast.textContent = message;
    elements.toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => elements.toast.classList.remove('show'), 2600);
}

/**
 * يعرض الإجابة الصحيحة داخل بطاقة السؤال.
 *
 * كانت تُعرض في شريط Toast بـ white-space: nowrap و text-overflow: ellipsis،
 * فتُقصّ الإجابات الطويلة (503px داخل 351px) — واللحظة التعليمية الوحيدة في
 * اللعبة تضيع. هنا تُعرض كاملة وبأسطر متعددة.
 */
export function revealAnswer(label, answer) {
    if (!elements.answerReveal) {
        showToast(`${label}: ${answer}`);
        return;
    }
    if (elements.answerRevealLabel) elements.answerRevealLabel.textContent = label;
    if (elements.answerRevealText) elements.answerRevealText.textContent = answer;
    elements.answerReveal.hidden = false;
}

export function hideReveal() {
    if (elements.answerReveal) elements.answerReveal.hidden = true;
    if (elements.hintDisplay) elements.hintDisplay.hidden = true;
}

/* ------------------------------------------------------------------ */
/* قفل الإدخال                                                         */
/* ------------------------------------------------------------------ */

export function setInputLocked(locked) {
    if (elements.answerInput) {
        elements.answerInput.disabled = locked;
        elements.answerInput.setAttribute('aria-busy', String(locked));
    }
    if (elements.submitBtn) elements.submitBtn.disabled = locked;
    if (elements.skipBtn)   elements.skipBtn.disabled   = locked;
    if (elements.hintBtn)   elements.hintBtn.disabled   = locked || gameState.hintsRemaining <= 0;
}

/* ------------------------------------------------------------------ */
/* تحديث الواجهة                                                       */
/* ------------------------------------------------------------------ */

export function updateUI() {
    if (elements.scoreDisplay) elements.scoreDisplay.textContent = gameState.score;
    if (elements.levelBadge)   elements.levelBadge.textContent   = `المستوى ${gameState.level}`;

    if (elements.hintCount) elements.hintCount.textContent = gameState.hintsRemaining;
    if (elements.hintBtn) {
        elements.hintBtn.disabled = gameState.hintsRemaining <= 0;
        elements.hintBtn.setAttribute(
            'aria-label',
            `اظهر تلميح، متبقٍ ${gameState.hintsRemaining} من ${HINTS_PER_ROUND}`
        );
    }

    if (elements.skipCount) {
        const free = gameState.skipsRemaining;
        elements.skipCount.textContent = free > 0 ? `مجاني ×${free}` : 'يكلّف حياة';
        elements.skipCount.classList.toggle('costly', free <= 0);
    }

    if (elements.livesDisplay) {
        const hearts = elements.livesDisplay.querySelectorAll('.heart');
        hearts.forEach((heart, i) => {
            heart.classList.toggle('lost', i >= gameState.lives);
        });
        elements.livesDisplay.setAttribute('aria-label', `الحياة: ${gameState.lives} من 3`);
    }

    if (elements.streakBadge) {
        const on = gameState.streak >= 3;
        elements.streakBadge.classList.toggle('visible', on);
        if (on && elements.streakCount) elements.streakCount.textContent = gameState.streak;
    }
}

/* ------------------------------------------------------------------ */
/* التغذية الراجعة                                                     */
/* ------------------------------------------------------------------ */

export function flashCorrect() {
    if (elements.emojiDisplay) {
        elements.emojiDisplay.classList.add('correct-anim');
        setTimeout(() => elements.emojiDisplay.classList.remove('correct-anim'), 600);
    }
    elements.answerInput?.classList.add('correct');
    vibrate(30);
}

export function flashWrong() {
    if (elements.emojiDisplay) {
        elements.emojiDisplay.classList.add('wrong-anim');
        setTimeout(() => elements.emojiDisplay.classList.remove('wrong-anim'), 500);
    }
    elements.answerInput?.classList.add('wrong');
    vibrate([40, 60, 40]);
}

/** اهتزاز خفيف — يُحترم فيه تفضيل تقليل الحركة. */
function vibrate(pattern) {
    if (!navigator.vibrate) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    try {
        navigator.vibrate(pattern);
    } catch {
        /* غير مدعوم */
    }
}

export function clearAnswerStyles() {
    elements.answerInput?.classList.remove('correct', 'wrong');
}

/* ------------------------------------------------------------------ */
/* المظهر                                                              */
/* ------------------------------------------------------------------ */

export function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    setTheme(theme);

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#0F172A' : '#FACC15');

    if (elements.themeIcon) setIcon(elements.themeIcon, theme === 'dark' ? 'sun' : 'moon', 'ui-icon');
    if (elements.themeToggle) {
        elements.themeToggle.setAttribute('aria-label', theme === 'dark' ? 'الوضع الفاتح' : 'الوضع الليلي');
    }
}

export function initTheme() {
    applyTheme(getTheme());
}

export function toggleTheme() {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    return next;
}
