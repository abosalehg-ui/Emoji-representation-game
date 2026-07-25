import { getItem, setItem, removeItem, getJSON, setJSON } from './storage.js';

const STORAGE_KEYS = {
    highScore:  'emojiCharades_highScore',
    bestStreak: 'emojiCharades_bestStreak',
    session:    'emojiCharades_session',
    theme:      'emojiCharades_theme',
    dailyDone:  'emojiCharades_dailyDone',
    dailyState: 'emojiCharades_dailyState',
    seenIntro:  'emojiCharades_seenIntro'
};

export const SAVE_VERSION = 2;

/** ميزانية التلميحات للجولة كاملة — لا لكل سؤال. */
export const HINTS_PER_ROUND = 5;

/** تخطيات مجانية للجولة، بعدها يكلّف التخطي حياة. */
export const FREE_SKIPS_PER_ROUND = 2;

const DIFFICULTIES = ['easy', 'medium', 'hard'];
const MODES = ['classic', 'daily'];

function toInt(v, fallback = 0) {
    const n = parseInt(v, 10);
    return Number.isFinite(n) ? n : fallback;
}

function defaultState() {
    return {
        score: 0,
        lives: 3,
        level: 1,
        correctAnswers: 0,
        difficulty: 'medium',
        category: 'all',
        currentQuestion: null,
        hintsUsedOnCurrent: 0,
        hintsRemaining: HINTS_PER_ROUND,
        skipsRemaining: FREE_SKIPS_PER_ROUND,
        usedQuestions: [],
        streak: 0,
        bestStreak: 0,
        timerEnabled: false,
        mode: 'classic',
        dailyIndex: 0,
        dailyQuestions: null,
        highScore: toInt(getItem(STORAGE_KEYS.highScore), 0),
        bestStreakEver: toInt(getItem(STORAGE_KEYS.bestStreak), 0)
    };
}

export let gameState = defaultState();

export function resetGameState(overrides = {}) {
    const { highScore, bestStreakEver } = gameState;
    gameState = { ...defaultState(), highScore, bestStreakEver, ...overrides };
    return gameState;
}

/* ------------------------------------------------------------------ */
/* حفظ الجلسة                                                          */
/* ------------------------------------------------------------------ */

export function saveSession() {
    const snapshot = {
        v: SAVE_VERSION,
        score: gameState.score,
        lives: gameState.lives,
        level: gameState.level,
        correctAnswers: gameState.correctAnswers,
        difficulty: gameState.difficulty,
        category: gameState.category,
        usedQuestions: gameState.usedQuestions,
        hintsRemaining: gameState.hintsRemaining,
        skipsRemaining: gameState.skipsRemaining,
        streak: gameState.streak,
        bestStreak: gameState.bestStreak,
        timerEnabled: gameState.timerEnabled,
        mode: gameState.mode,
        dailyIndex: gameState.dailyIndex,
        savedAt: Date.now()
    };

    if (gameState.mode === 'daily') {
        // التحدي اليومي يُحفظ منفصلاً: مرتبط بيوم بعينه ولا يظهر في شريط
        // الاستكمال العادي، لكنه يجب أن ينجو من إغلاق التبويب.
        setJSON(STORAGE_KEYS.dailyState, { ...snapshot, dateKey: currentDailyDate });
        return;
    }
    setJSON(STORAGE_KEYS.session, snapshot);
}

/**
 * تحقق كامل من بنية ملف الحفظ.
 *
 * كانت restoreSession تمرّر محتوى localStorage مباشرة إلى Object.assign، فأي
 * ملف تالف (usedQuestions نصاً مثلاً) يرمي استثناءً يترك اللعبة عالقة على شاشة
 * التحميل — والملف التالف يبقى مخزّناً فيتكرر العطل عند كل محاولة استكمال.
 */
function isValidSession(s) {
    if (!s || typeof s !== 'object' || Array.isArray(s)) return false;
    if (s.v !== SAVE_VERSION) return false;

    const int = (v, min, max) => Number.isInteger(v) && v >= min && v <= max;

    return int(s.score, 0, 10_000_000)
        && int(s.lives, 1, 3)
        && int(s.level, 1, 10_000)
        && int(s.correctAnswers, 0, 10_000_000)
        && int(s.hintsRemaining, 0, HINTS_PER_ROUND)
        && int(s.skipsRemaining, 0, FREE_SKIPS_PER_ROUND)
        && int(s.streak, 0, 10_000_000)
        && int(s.bestStreak, 0, 10_000_000)
        && DIFFICULTIES.includes(s.difficulty)
        && typeof s.category === 'string'
        && MODES.includes(s.mode)
        && typeof s.timerEnabled === 'boolean'
        && Array.isArray(s.usedQuestions)
        && s.usedQuestions.every(i => Number.isInteger(i) && i >= 0)
        && Number.isFinite(s.savedAt);
}

/** الجلسات الأقدم من أسبوع لا تُعرض — استئنافها بعد أيام بلا معنى. */
const MAX_SESSION_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export function loadSession() {
    const s = getJSON(STORAGE_KEYS.session, isValidSession);
    if (!s) return null;
    if (Date.now() - s.savedAt > MAX_SESSION_AGE_MS) {
        clearSession();
        return null;
    }
    return s;
}

export function clearSession() {
    removeItem(STORAGE_KEYS.session);
}

/** يطبّق جلسة تحققنا من صحتها مسبقاً — لا يُستدعى ببيانات خام أبداً. */
export function restoreSession(saved) {
    resetGameState({
        score: saved.score,
        lives: saved.lives,
        level: saved.level,
        correctAnswers: saved.correctAnswers,
        difficulty: saved.difficulty,
        category: saved.category,
        usedQuestions: [...saved.usedQuestions],
        hintsRemaining: saved.hintsRemaining,
        skipsRemaining: saved.skipsRemaining,
        streak: saved.streak,
        bestStreak: saved.bestStreak,
        timerEnabled: saved.timerEnabled,
        mode: saved.mode
    });
}

/* ------------------------------------------------------------------ */
/* أرقام قياسية                                                        */
/* ------------------------------------------------------------------ */

export function saveHighScore(score) {
    if (score > gameState.highScore) {
        gameState.highScore = score;
        setItem(STORAGE_KEYS.highScore, score);
        return true;
    }
    return false;
}

/** أفضل سلسلة عبر كل الجلسات — لم تكن تُحفظ إطلاقاً من قبل. */
export function saveBestStreak(streak) {
    if (streak > gameState.bestStreakEver) {
        gameState.bestStreakEver = streak;
        setItem(STORAGE_KEYS.bestStreak, streak);
        return true;
    }
    return false;
}

/* ------------------------------------------------------------------ */
/* المظهر                                                              */
/* ------------------------------------------------------------------ */

export function getTheme() {
    const stored = getItem(STORAGE_KEYS.theme);
    if (stored === 'dark' || stored === 'light') return stored;
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function setTheme(theme) {
    setItem(STORAGE_KEYS.theme, theme);
}

/* ------------------------------------------------------------------ */
/* التحدي اليومي                                                       */
/* ------------------------------------------------------------------ */

let currentDailyDate = null;

/** يسجّل أن اللاعب بدأ تحدي اليوم — عند البدء لا عند الانتهاء. */
export function markDailyStarted(dateKey) {
    currentDailyDate = dateKey;
    setItem(STORAGE_KEYS.dailyDone, dateKey);
}

export function isDailyCompletedToday(dateKey) {
    return getItem(STORAGE_KEYS.dailyDone) === dateKey;
}

export function loadDailyState(dateKey) {
    const s = getJSON(STORAGE_KEYS.dailyState, v => isValidSession(v) && typeof v.dateKey === 'string');
    if (!s || s.dateKey !== dateKey) {
        removeItem(STORAGE_KEYS.dailyState);
        return null;
    }
    return s;
}

export function clearDailyState() {
    removeItem(STORAGE_KEYS.dailyState);
}

export function setCurrentDailyDate(dateKey) {
    currentDailyDate = dateKey;
}

/* ------------------------------------------------------------------ */
/* التعريف باللعبة                                                     */
/* ------------------------------------------------------------------ */

export function hasSeenIntro() {
    return getItem(STORAGE_KEYS.seenIntro) === '1';
}

export function markIntroSeen() {
    setItem(STORAGE_KEYS.seenIntro, '1');
}
