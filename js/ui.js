import { gameState } from './state.js';
import { setTheme, getTheme } from './state.js';

export const elements = {};

const ELEMENT_IDS = [
    'startScreen','gameScreen','gameoverScreen',
    'playBtn','scoreDisplay','levelBadge','livesDisplay',
    'emojiDisplay','hintBtn','hintCount','hintDisplay',
    'answerInput','submitBtn','skipBtn',
    'finalScore','highscoreBadge','correctAnswers','highestLevel',
    'playAgainBtn','shareBtn','soundToggle','themeToggle',
    'toast','gameoverEmoji','gameoverSubtitle',
    'streakBadge','streakCount','timerBar','timerBarFill',
    'resumeBanner','resumeDifficulty','resumeScore','resumeClose',
    'dailyChip','classicChip','dailyDoneBadge',
    'categoryGrid','timerToggle','installBtn','soundIcon'
];

export function cacheElements() {
    ELEMENT_IDS.forEach(id => {
        const el = document.getElementById(id);
        if (el) elements[id] = el;
    });
}

export function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

let toastTimeout;
export function showToast(message) {
    if (!elements.toast) return;
    elements.toast.textContent = message;
    elements.toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => elements.toast.classList.remove('show'), 2500);
}

export function updateUI() {
    if (elements.scoreDisplay) elements.scoreDisplay.textContent = gameState.score;
    if (elements.levelBadge)   elements.levelBadge.textContent   = `المستوى ${gameState.level}`;
    if (elements.hintCount)    elements.hintCount.textContent    = gameState.hintsRemaining;

    if (elements.livesDisplay) {
        const hearts = elements.livesDisplay.querySelectorAll('.heart');
        hearts.forEach((heart, i) => {
            heart.classList.toggle('lost', i >= gameState.lives);
        });
    }

    if (elements.streakBadge) {
        if (gameState.streak >= 3) {
            elements.streakBadge.classList.add('visible');
            if (elements.streakCount) elements.streakCount.textContent = gameState.streak;
        } else {
            elements.streakBadge.classList.remove('visible');
        }
    }
}

export function flashCorrect() {
    if (!elements.emojiDisplay) return;
    elements.emojiDisplay.classList.add('correct-anim');
    setTimeout(() => elements.emojiDisplay.classList.remove('correct-anim'), 600);
    if (elements.answerInput) elements.answerInput.classList.add('correct');
}

export function flashWrong() {
    if (!elements.emojiDisplay) return;
    elements.emojiDisplay.classList.add('wrong-anim');
    setTimeout(() => elements.emojiDisplay.classList.remove('wrong-anim'), 500);
    if (elements.answerInput) elements.answerInput.classList.add('wrong');
}

export function clearAnswerStyles() {
    if (elements.answerInput) {
        elements.answerInput.classList.remove('correct', 'wrong');
    }
}

export function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    setTheme(theme);
    if (elements.themeToggle) {
        elements.themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
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
