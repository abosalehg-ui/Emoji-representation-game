import { CATEGORIES } from './questions.js';
import { gameState, loadSession, clearSession, restoreSession, isDailyCompletedToday } from './state.js';
import { todayKey } from './daily.js';
import { loadSounds, playSound, isSoundEnabled, toggleSound } from './sounds.js';
import { cacheElements, elements, showScreen, showToast, updateUI, initTheme, toggleTheme } from './ui.js';
import { initTimer, hideTimer } from './timer.js';
import { startGame, resumeGame, submitAnswer, showHint, skipQuestion, shareScore, handleTimeout } from './game.js';

const SOUND_ON_SVG  = '<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>';
const SOUND_OFF_SVG = '<path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>';

function buildCategoryGrid() {
    if (!elements.categoryGrid) return;
    elements.categoryGrid.innerHTML = CATEGORIES.map(c => `
        <button class="category-btn ${c.id === 'all' ? 'selected' : ''}" data-category="${c.id}" type="button">
            <span class="category-icon-wrap"><img src="assets/images/${c.icon}.svg" alt="" class="category-icon"></span>
            <p>${c.label}</p>
        </button>
    `).join('');

    elements.categoryGrid.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            playSound('click');
            elements.categoryGrid.querySelectorAll('.category-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            gameState.category = btn.dataset.category;
        });
    });
}

function refreshDailyDoneBadge() {
    if (!elements.dailyDoneBadge) return;
    if (isDailyCompletedToday(todayKey())) {
        elements.dailyDoneBadge.style.display = 'inline-block';
        elements.dailyChip?.classList.add('done');
    } else {
        elements.dailyDoneBadge.style.display = 'none';
        elements.dailyChip?.classList.remove('done');
    }
}

function maybeShowResumeBanner() {
    if (!elements.resumeBanner) return;
    const saved = loadSession();
    if (saved && saved.lives > 0 && saved.mode === 'classic') {
        elements.resumeBanner.style.display = 'flex';
        if (elements.resumeDifficulty) elements.resumeDifficulty.textContent = ({
            easy: 'سهل', medium: 'متوسط', hard: 'صعب'
        })[saved.difficulty] || '';
        if (elements.resumeScore) elements.resumeScore.textContent = saved.score;

        elements.resumeBanner.onclick = (e) => {
            if (e.target.id === 'resumeClose') return;
            restoreSession(saved);
            resumeGame();
        };
        if (elements.resumeClose) {
            elements.resumeClose.onclick = (e) => {
                e.stopPropagation();
                clearSession();
                elements.resumeBanner.style.display = 'none';
            };
        }
    } else {
        elements.resumeBanner.style.display = 'none';
    }
}

function setSoundIcon() {
    if (!elements.soundIcon) return;
    elements.soundIcon.innerHTML = isSoundEnabled() ? SOUND_ON_SVG : SOUND_OFF_SVG;
    if (elements.soundToggle) elements.soundToggle.classList.toggle('muted', !isSoundEnabled());
}

function setupModeChips() {
    if (elements.classicChip) {
        elements.classicChip.classList.add('selected');
        elements.classicChip.addEventListener('click', () => {
            playSound('click');
            elements.classicChip.classList.add('selected');
            elements.dailyChip?.classList.remove('selected');
            gameState.mode = 'classic';
        });
    }
    if (elements.dailyChip) {
        elements.dailyChip.addEventListener('click', () => {
            if (isDailyCompletedToday(todayKey())) {
                showToast('لقد أكملت تحدي اليوم! عُد غداً لتحدي جديد');
                return;
            }
            playSound('click');
            elements.dailyChip.classList.add('selected');
            elements.classicChip?.classList.remove('selected');
            gameState.mode = 'daily';
        });
    }
}

function setupTimerToggle() {
    if (!elements.timerToggle) return;
    elements.timerToggle.classList.toggle('on', gameState.timerEnabled);
    elements.timerToggle.addEventListener('click', () => {
        playSound('click');
        gameState.timerEnabled = !gameState.timerEnabled;
        elements.timerToggle.classList.toggle('on', gameState.timerEnabled);
    });
}

function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return;
    if (location.protocol === 'file:') return;
    navigator.serviceWorker.register('sw.js').catch(() => {});
}

function setupInstallButton() {
    if (!elements.installBtn) return;
    let deferred = null;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferred = e;
        elements.installBtn.classList.add('visible');
    });
    elements.installBtn.addEventListener('click', async () => {
        if (!deferred) return;
        deferred.prompt();
        await deferred.userChoice;
        deferred = null;
        elements.installBtn.classList.remove('visible');
    });
    window.addEventListener('appinstalled', () => {
        elements.installBtn.classList.remove('visible');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    cacheElements();
    initTheme();
    loadSounds();
    setSoundIcon();

    initTimer({
        bar: elements.timerBar,
        fill: elements.timerBarFill,
        onExpire: handleTimeout
    });

    buildCategoryGrid();
    setupModeChips();
    setupTimerToggle();
    refreshDailyDoneBadge();
    maybeShowResumeBanner();
    registerServiceWorker();
    setupInstallButton();

    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            playSound('click');
            document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            gameState.difficulty = btn.dataset.level;
        });
    });

    elements.playBtn?.addEventListener('click', () => {
        const opts = gameState.mode === 'daily'
            ? { mode: 'daily' }
            : {
                mode: 'classic',
                difficulty: gameState.difficulty,
                category: gameState.category,
                timerEnabled: gameState.timerEnabled
              };
        startGame(opts);
    });

    elements.submitBtn?.addEventListener('click', submitAnswer);
    elements.answerInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') submitAnswer();
    });
    elements.hintBtn?.addEventListener('click', showHint);
    elements.skipBtn?.addEventListener('click', skipQuestion);

    elements.playAgainBtn?.addEventListener('click', () => {
        playSound('click');
        hideTimer();
        refreshDailyDoneBadge();
        maybeShowResumeBanner();
        showScreen('startScreen');
    });

    elements.shareBtn?.addEventListener('click', shareScore);

    elements.soundToggle?.addEventListener('click', () => {
        toggleSound();
        setSoundIcon();
    });

    elements.themeToggle?.addEventListener('click', () => {
        playSound('click');
        toggleTheme();
    });
});
