import {
    gameState, resetGameState, saveSession, clearSession, saveHighScore, saveBestStreak,
    markDailyStarted, loadDailyState, clearDailyState, setCurrentDailyDate,
    HINTS_PER_ROUND, FREE_SKIPS_PER_ROUND
} from './state.js';
import { questionsDB, filterByCategory } from './questions.js';
import { getDailyQuestions, todayKey } from './daily.js';
import { checkAnswer } from './arabic.js';
import { playSound } from './sounds.js';
import {
    elements, showScreen, showToast, revealAnswer, hideReveal, updateUI,
    flashCorrect, flashWrong, clearAnswerStyles, setInputLocked, renderPuzzle
} from './ui.js';
import { startTimer, stopTimer, hideTimer, elapsedSeconds } from './timer.js';
import { triggerConfetti } from './confetti.js';
import { preloadIcons } from './icons.js';
import { markSolved } from './journal.js';

const BASE_POINTS = { easy: 10, medium: 20, hard: 30 };
const HINT_PENALTY = 3;
const MIN_POINTS = 5;
const SPEED_BONUS = 5;
const SPEED_BONUS_WINDOW = 10;

/** كل تأخيرات اللعبة بالمللي ثانية في مكان واحد بدل أرقام مبعثرة. */
const TIMINGS = {
    afterCorrect: 900,
    afterWrong: 2200,
    afterSkip: 1400,
    beforeGameOver: 700,
    toast: 2600
};

/* ------------------------------------------------------------------ */
/* إدارة المؤقتات المعلّقة                                             */
/* ------------------------------------------------------------------ */

/**
 * كانت setTimeout تُستدعى بلا حفظ لمعرّفاتها، فمؤقت مجدول لتحميل السؤال التالي
 * قد ينفَّذ بعد انتهاء اللعبة ويعرض سؤالاً فوق شاشة النهاية.
 */
const pending = new Set();

function later(fn, ms) {
    const id = setTimeout(() => {
        pending.delete(id);
        fn();
    }, ms);
    pending.add(id);
    return id;
}

function cancelPending() {
    pending.forEach(clearTimeout);
    pending.clear();
}

/* ------------------------------------------------------------------ */
/* اختيار الأسئلة                                                      */
/* ------------------------------------------------------------------ */

function shuffleIcons(icons) {
    const arr = [...icons];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function pickFromPool(pool) {
    const availableIdx = pool
        .map((_, i) => i)
        .filter(i => !gameState.usedQuestions.includes(i));

    if (availableIdx.length === 0) {
        // استُنفدت المجموعة: نبدأ دورة جديدة. كان السؤال المُعاد هنا لا يُسجَّل
        // في usedQuestions، فيمكن أن يتكرر مباشرةً في الدور التالي.
        gameState.usedQuestions = [];
        const idx = Math.floor(Math.random() * pool.length);
        gameState.usedQuestions.push(idx);
        return pool[idx];
    }

    const idx = availableIdx[Math.floor(Math.random() * availableIdx.length)];
    gameState.usedQuestions.push(idx);
    return pool[idx];
}

function currentPool() {
    const byDifficulty = questionsDB[gameState.difficulty] || questionsDB.medium;
    const filtered = filterByCategory(byDifficulty, gameState.category);
    return filtered.length > 0 ? filtered : byDifficulty;
}

function getNextQuestion() {
    if (gameState.mode === 'daily' && gameState.dailyQuestions) {
        const q = gameState.dailyQuestions[gameState.dailyIndex];
        gameState.dailyIndex++;
        return q;
    }
    return pickFromPool(currentPool());
}

function peekNextIcons() {
    if (gameState.mode === 'daily' && gameState.dailyQuestions) {
        return gameState.dailyQuestions[gameState.dailyIndex]?.icons || [];
    }
    return [];
}

/* ------------------------------------------------------------------ */
/* دورة السؤال                                                         */
/* ------------------------------------------------------------------ */

export function loadQuestion() {
    if (!elements.emojiDisplay) return;

    if (gameState.mode === 'daily' && gameState.dailyIndex >= (gameState.dailyQuestions?.length || 0)) {
        endGame();
        return;
    }

    hideReveal();
    clearAnswerStyles();
    if (elements.answerInput) elements.answerInput.value = '';
    gameState.hintsUsedOnCurrent = 0;

    const question = getNextQuestion();
    if (!question) {
        endGame();
        return;
    }
    gameState.currentQuestion = question;

    // كان هنا setTimeout(..., 400) يعرض نقاط تحميل وهمية: كل الأسئلة في الذاكرة
    // منذ التحميل الأول، فلا شيء يُنتظر. وكان currentQuestion يُسنَد قبل عرض
    // الأيقونات، فيمكن الإجابة على سؤال لم يُعرض بعد.
    renderPuzzle(shuffleIcons(question.icons));
    setInputLocked(false);
    updateUI();

    if (gameState.timerEnabled && gameState.mode !== 'daily') {
        startTimer(question._diff || gameState.difficulty);
    }

    preloadIcons(peekNextIcons());
    elements.answerInput?.focus({ preventScroll: true });
}

/* ------------------------------------------------------------------ */
/* بدء اللعب                                                           */
/* ------------------------------------------------------------------ */

export function startGame(opts = {}) {
    playSound('start');
    cancelPending();
    const { mode = 'classic', difficulty, category, timerEnabled } = opts;

    if (mode === 'daily') {
        const key = todayKey();
        // يُسجَّل البدء الآن لا عند الانتهاء: كان إغلاق التبويب في المنتصف
        // يترك التحدي غير مسجّل، فيُعاد بلا حد ويفقد معناه.
        markDailyStarted(key);
        setCurrentDailyDate(key);
        resetGameState({
            mode: 'daily',
            difficulty: 'medium',
            dailyQuestions: getDailyQuestions(10),
            dailyIndex: 0,
            timerEnabled: false
        });
    } else {
        resetGameState({
            mode: 'classic',
            difficulty: difficulty || gameState.difficulty,
            category: category || gameState.category,
            timerEnabled: timerEnabled ?? gameState.timerEnabled
        });
    }

    updateUI();
    showScreen('gameScreen');
    saveSession();
    loadQuestion();
}

export function resumeGame() {
    playSound('start');
    cancelPending();
    updateUI();
    showScreen('gameScreen');
    loadQuestion();
}

/** يستأنف تحدي اليوم من حيث توقّف اللاعب. */
export function resumeDaily() {
    const key = todayKey();
    const saved = loadDailyState(key);
    if (!saved) return false;

    setCurrentDailyDate(key);
    resetGameState({
        mode: 'daily',
        difficulty: 'medium',
        dailyQuestions: getDailyQuestions(10),
        dailyIndex: saved.dailyIndex,
        timerEnabled: false,
        score: saved.score,
        lives: saved.lives,
        level: saved.level,
        correctAnswers: saved.correctAnswers,
        hintsRemaining: saved.hintsRemaining,
        skipsRemaining: saved.skipsRemaining,
        streak: saved.streak,
        bestStreak: saved.bestStreak
    });
    resumeGame();
    return true;
}

/* ------------------------------------------------------------------ */
/* النقاط                                                              */
/* ------------------------------------------------------------------ */

function awardPoints() {
    const diff = gameState.currentQuestion?._diff || gameState.difficulty;
    const base = BASE_POINTS[diff] || BASE_POINTS.medium;
    let points = Math.max(base - gameState.hintsUsedOnCurrent * HINT_PENALTY, MIN_POINTS);

    const seconds = elapsedSeconds();
    if (gameState.timerEnabled && seconds > 0 && seconds <= SPEED_BONUS_WINDOW) {
        points += SPEED_BONUS;
    }

    if (gameState.streak >= 5) points = Math.round(points * 2);
    else if (gameState.streak >= 3) points = Math.round(points * 1.5);

    return points;
}

/* ------------------------------------------------------------------ */
/* الإجابة                                                             */
/* ------------------------------------------------------------------ */

/**
 * قفل الإرسال.
 *
 * بدونه كان الضغط المتكرر خلال نافذة التغذية الراجعة يعيد تنفيذ submitAnswer
 * على نفس السؤال — الحقل لا يُمسح والزر لا يُعطَّل — فتُمنح النقاط والسلسلة
 * مراراً (إجابة واحدة أُرسلت 8 مرات أعطت 180 نقطة بدل 20).
 */
let submitting = false;

export function submitAnswer() {
    if (submitting) return;

    const answer = elements.answerInput?.value.trim();
    if (!answer || !gameState.currentQuestion) return;

    submitting = true;
    setInputLocked(true);
    playSound('click');
    stopTimer();

    const question = gameState.currentQuestion;

    if (checkAnswer(answer, question.answer)) {
        onCorrect(question);
    } else {
        onWrong(question);
    }
}

function unlock() {
    submitting = false;
    setInputLocked(false);
}

function onCorrect(question) {
    playSound('correct');
    flashCorrect();

    gameState.streak++;
    if (gameState.streak > gameState.bestStreak) gameState.bestStreak = gameState.streak;

    const gained = awardPoints();
    gameState.score += gained;
    gameState.correctAnswers++;

    const isNewDiscovery = markSolved(question.answer);

    // ترقية المستوى كانت داخل سلسلة else-if بعد فحوص السلسلة، فتُتخطى كلما
    // تزامنت الإجابة الخامسة مع سلسلة من 5 — أي دائماً للاعب لا يخطئ.
    let leveledUp = false;
    if (gameState.correctAnswers % 5 === 0 && gameState.mode !== 'daily') {
        gameState.level++;
        leveledUp = true;
    }

    if (leveledUp) {
        playSound('levelup');
        showToast(`أحسنت! انتقلت للمستوى ${gameState.level}`);
    } else if (gameState.streak === 3) {
        showToast('سلسلة من 3! النقاط ×1.5');
    } else if (gameState.streak === 5) {
        showToast('سلسلة من 5! النقاط ×2');
    } else if (isNewDiscovery) {
        showToast(`+${gained} نقطة · لغز جديد في دفترك`);
    } else {
        showToast(`+${gained} نقطة`);
    }

    updateUI();
    saveSession();

    later(() => {
        clearAnswerStyles();
        unlock();
        loadQuestion();
    }, TIMINGS.afterCorrect);
}

function onWrong(question) {
    playSound('wrong');
    flashWrong();
    gameState.streak = 0;
    gameState.lives--;
    updateUI();

    if (gameState.lives <= 0) {
        later(endGame, TIMINGS.beforeGameOver);
        return;
    }

    revealAnswer('الإجابة الصحيحة', question.answer);
    saveSession();

    later(() => {
        clearAnswerStyles();
        if (elements.answerInput) elements.answerInput.value = '';
        unlock();
        loadQuestion();
    }, TIMINGS.afterWrong);
}

export function handleTimeout() {
    if (!gameState.currentQuestion || submitting) return;

    submitting = true;
    setInputLocked(true);
    playSound('wrong');
    flashWrong();
    gameState.streak = 0;
    gameState.lives--;
    updateUI();

    if (gameState.lives <= 0) {
        later(endGame, TIMINGS.beforeGameOver);
        return;
    }

    revealAnswer('انتهى الوقت! الإجابة', gameState.currentQuestion.answer);
    saveSession();

    later(() => {
        clearAnswerStyles();
        unlock();
        loadQuestion();
    }, TIMINGS.afterWrong);
}

/* ------------------------------------------------------------------ */
/* التلميحات والتخطي                                                   */
/* ------------------------------------------------------------------ */

export function showHint() {
    if (gameState.hintsRemaining <= 0 || !gameState.currentQuestion || submitting) return;

    const hints = gameState.currentQuestion.hints || [];
    if (gameState.hintsUsedOnCurrent >= hints.length) {
        showToast('لا مزيد من التلميحات لهذا اللغز');
        return;
    }

    playSound('hint');
    const hint = hints[gameState.hintsUsedOnCurrent];
    gameState.hintsUsedOnCurrent++;
    gameState.hintsRemaining--;

    if (elements.hintDisplay) {
        // نص التلميح من قاعدة الأسئلة الثابتة، لكن textContent يبقيه آمناً
        // مهما تغيّر مصدر المحتوى لاحقاً.
        elements.hintDisplay.textContent = hint;
        elements.hintDisplay.hidden = false;
    }
    updateUI();
    saveSession();
}

export function skipQuestion() {
    if (submitting || !gameState.currentQuestion) return;

    submitting = true;
    setInputLocked(true);
    playSound('click');
    stopTimer();
    gameState.streak = 0;

    // كان التخطي يكلّف حياة كاملة كالإجابة الخاطئة تماماً، فلا معنى له إطلاقاً:
    // التخمين العشوائي أفضل دائماً لأنه قد يصيب.
    const wasFree = gameState.skipsRemaining > 0;
    if (wasFree) {
        gameState.skipsRemaining--;
    } else {
        gameState.lives--;
    }
    updateUI();

    if (gameState.lives <= 0) {
        later(endGame, TIMINGS.beforeGameOver);
        return;
    }

    revealAnswer(wasFree ? 'تخطيت! الإجابة' : 'تخطي بخسارة حياة! الإجابة',
                 gameState.currentQuestion.answer);
    saveSession();

    later(() => {
        unlock();
        loadQuestion();
    }, TIMINGS.afterSkip);
}

/* ------------------------------------------------------------------ */
/* النهاية                                                             */
/* ------------------------------------------------------------------ */

export function endGame() {
    cancelPending();
    submitting = false;
    playSound('gameover');
    hideTimer();
    hideReveal();
    clearSession();
    if (gameState.mode === 'daily') clearDailyState();

    const isNewHighScore = saveHighScore(gameState.score);
    saveBestStreak(gameState.bestStreak);

    if (isNewHighScore) {
        playSound('highscore');
        triggerConfetti();
    }

    if (elements.finalScore)     elements.finalScore.textContent     = gameState.score;
    if (elements.correctAnswers) elements.correctAnswers.textContent = gameState.correctAnswers;
    if (elements.highestLevel)   elements.highestLevel.textContent   = gameState.level;
    if (elements.bestStreakStat) elements.bestStreakStat.textContent = gameState.bestStreak;
    if (elements.highscoreBadge) elements.highscoreBadge.hidden      = !isNewHighScore;

    let icon = 'muscle';
    let subtitle = 'لا تستسلم! حاول مرة أخرى';
    if (gameState.score >= 100) {
        icon = 'trophy';
        subtitle = 'أداء مذهل! أنت بطل حقيقي';
    } else if (gameState.score >= 50) {
        icon = 'glowing-star';
        subtitle = 'عمل رائع! استمر في التحسن';
    }

    if (elements.gameoverSubtitle) elements.gameoverSubtitle.textContent = subtitle;
    if (elements.gameoverIcon) {
        import('./icons.js').then(({ setIcon }) => setIcon(elements.gameoverIcon, icon, 'gameover-svg'));
    }

    showScreen('gameoverScreen');
}

/** إعدادات آخر جولة — يستخدمها زر «العب مرة أخرى» ليبدأ فوراً. */
export function lastRoundOptions() {
    return {
        mode: gameState.mode === 'daily' ? 'classic' : gameState.mode,
        difficulty: gameState.difficulty,
        category: gameState.category,
        timerEnabled: gameState.timerEnabled
    };
}

export function shareScore() {
    const text =
        `تحدي الصور\n\n` +
        `حققت ${gameState.score} نقطة\n` +
        `${gameState.correctAnswers} إجابة صحيحة\n` +
        `أفضل سلسلة: ${gameState.bestStreak}\n` +
        `المستوى ${gameState.level}\n\n` +
        `هل تستطيع التغلب على نتيجتي؟`;

    if (navigator.share) {
        navigator.share({ title: 'تحدي الصور', text }).catch(() => {});
    } else if (navigator.clipboard) {
        navigator.clipboard.writeText(text)
            .then(() => showToast('تم نسخ النتيجة'))
            .catch(() => showToast('تعذّر نسخ النتيجة'));
    } else {
        showToast('المشاركة غير مدعومة في هذا المتصفح');
    }
}

export { HINTS_PER_ROUND, FREE_SKIPS_PER_ROUND, TIMINGS };
