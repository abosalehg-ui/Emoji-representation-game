const STORAGE_KEYS = {
    highScore: 'emojiCharades_highScore',
    session:   'emojiCharades_session',
    theme:     'emojiCharades_theme',
    dailyDone: 'emojiCharades_dailyDone'
};

function defaultState() {
    return {
        score: 0,
        lives: 3,
        level: 1,
        correctAnswers: 0,
        difficulty: 'medium',
        category: 'all',
        currentQuestion: null,
        hintsUsed: 0,
        hintsRemaining: 3,
        usedQuestions: [],
        streak: 0,
        bestStreak: 0,
        timerEnabled: false,
        mode: 'classic',
        dailyIndex: 0,
        dailyQuestions: null,
        highScore: parseInt(localStorage.getItem(STORAGE_KEYS.highScore)) || 0
    };
}

export let gameState = defaultState();

export function resetGameState(overrides = {}) {
    const high = gameState.highScore;
    gameState = { ...defaultState(), highScore: high, ...overrides };
    return gameState;
}

export function saveSession() {
    if (gameState.mode === 'daily') return;
    const snapshot = {
        score: gameState.score,
        lives: gameState.lives,
        level: gameState.level,
        correctAnswers: gameState.correctAnswers,
        difficulty: gameState.difficulty,
        category: gameState.category,
        usedQuestions: gameState.usedQuestions,
        streak: gameState.streak,
        bestStreak: gameState.bestStreak,
        timerEnabled: gameState.timerEnabled,
        mode: gameState.mode,
        savedAt: Date.now()
    };
    localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(snapshot));
}

export function loadSession() {
    try {
        const raw = localStorage.getItem(STORAGE_KEYS.session);
        if (!raw) return null;
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

export function clearSession() {
    localStorage.removeItem(STORAGE_KEYS.session);
}

export function restoreSession(saved) {
    Object.assign(gameState, saved);
    gameState.currentQuestion = null;
    gameState.hintsUsed = 0;
    gameState.hintsRemaining = 3;
}

export function saveHighScore(score) {
    if (score > gameState.highScore) {
        gameState.highScore = score;
        localStorage.setItem(STORAGE_KEYS.highScore, score);
        return true;
    }
    return false;
}

export function getTheme() {
    return localStorage.getItem(STORAGE_KEYS.theme) || 'light';
}

export function setTheme(theme) {
    localStorage.setItem(STORAGE_KEYS.theme, theme);
}

export function isDailyCompletedToday(dateKey) {
    return localStorage.getItem(STORAGE_KEYS.dailyDone) === dateKey;
}

export function markDailyCompleted(dateKey) {
    localStorage.setItem(STORAGE_KEYS.dailyDone, dateKey);
}
