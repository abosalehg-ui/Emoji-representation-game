import {
    gameState, resetGameState, saveSession, clearSession, saveHighScore, saveBestStreak,
    markDailyStarted, loadDailyState, clearDailyState, setCurrentDailyDate,
    HINTS_PER_ROUND, FREE_SKIPS_PER_ROUND, CORRECT_PER_LEVEL,
    activeDifficulty, difficultyForLevel, recordDailyCompletion, getDailyStreak
} from './state.js';
import { questionsDB, filterByCategory } from './questions.js';
import { getDailyQuestions, todayKey, previousKey } from './daily.js';
import { checkAnswer } from './arabic.js';
import { playSound, warmSounds } from './sounds.js';
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

const DIFFICULTY_LABELS = { easy: 'سهل', medium: 'متوسط', hard: 'صعب' };

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
    const diff = activeDifficulty();
    const byDifficulty = questionsDB[diff] || questionsDB.medium;
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

    // الأيقونات تُعرض بترتيبها المؤلَّف، لا مخلوطة.
    //
    // اللغز هنا من نوع rebus: معناه في تسلسل الرموز لا في مجموعتها. «بعيد عن
    // العين بعيد عن القلب» مؤلَّف كـ[عين، عين، ×، قلب] — وخلطه يحوّله إلى كيس
    // رموز بلا نحو، فيضطر اللاعب للتخمين بدل القراءة. الخلط كان يلغي الآلية
    // الأساسية للعبة.
    //
    // كان هنا أيضاً setTimeout(..., 400) يعرض نقاط تحميل وهمية: كل الأسئلة في
    // الذاكرة منذ التحميل الأول، فلا شيء يُنتظر. وكان currentQuestion يُسنَد قبل
    // عرض الأيقونات، فيمكن الإجابة على سؤال لم يُعرض بعد.
    renderPuzzle(question.icons);
    setInputLocked(false);
    updateUI();

    if (gameState.timerEnabled && gameState.mode !== 'daily') {
        startTimer(question._diff || activeDifficulty());
    }

    preloadIcons(peekNextIcons());
    elements.answerInput?.focus({ preventScroll: true });
}

/* ------------------------------------------------------------------ */
/* بدء اللعب                                                           */
/* ------------------------------------------------------------------ */

export function startGame(opts = {}) {
    playSound('start');
    warmSounds();
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
    warmSounds();
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
/* علامات التحدي اليومي                                                */
/* ------------------------------------------------------------------ */

/**
 * علامة لكل سؤال في التحدي اليومي، تُبنى منها شبكة المشاركة.
 *
 * كانت المشاركة نصاً فيه رقم مجرد — والآلية التي جعلت هذي الفئة تنتشر أصلاً هي
 * الشبكة الرمزية الخالية من الحرق: تُري نتيجتك دون أن تكشف أي إجابة.
 */
const MARKS = { correct: '🟩', hint: '🟨', wrong: '🟥', skip: '⬜' };

function markDaily(kind) {
    if (gameState.mode !== 'daily') return;
    if (!Array.isArray(gameState.dailyMarks)) gameState.dailyMarks = [];
    gameState.dailyMarks.push(kind);
}

/* ------------------------------------------------------------------ */
/* النقاط                                                              */
/* ------------------------------------------------------------------ */

export function awardPoints() {
    const diff = gameState.currentQuestion?._diff || activeDifficulty();
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
    markDaily(gameState.hintsUsedOnCurrent > 0 ? 'hint' : 'correct');

    // ترقية المستوى كانت داخل سلسلة else-if بعد فحوص السلسلة، فتُتخطى كلما
    // تزامنت الإجابة الخامسة مع سلسلة من 5 — أي دائماً للاعب لا يخطئ.
    let leveledUp = false;
    let harderNow = false;
    if (gameState.correctAnswers % CORRECT_PER_LEVEL === 0 && gameState.mode !== 'daily') {
        const before = activeDifficulty();
        gameState.level++;
        leveledUp = true;

        const after = activeDifficulty();
        if (after !== before) {
            harderNow = true;
            // فهارس usedQuestions تشير إلى المجموعة القديمة؛ إبقاؤها بعد تبدّل
            // المجموعة يحجب أسئلة لم تُعرض ويعيد أخرى عُرضت.
            gameState.usedQuestions = [];
        }
    }

    if (harderNow) {
        playSound('levelup');
        showToast(`المستوى ${gameState.level} — ارتفعت الصعوبة إلى ${DIFFICULTY_LABELS[activeDifficulty()]}`);
    } else if (leveledUp) {
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
    markDaily('wrong');
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
    markDaily('wrong');
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
    markDaily('skip');
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

    let dailyStreak = null;
    if (gameState.mode === 'daily') {
        clearDailyState();
        // السلسلة تُسجَّل عند الإكمال لا عند البدء: من فتح التحدي ولم يُنهه
        // لا يستحق يوماً في سلسلته.
        const key = todayKey();
        dailyStreak = recordDailyCompletion(key, previousKey(key));
    }

    const isNewHighScore = saveHighScore(gameState.score);
    saveBestStreak(gameState.bestStreak);

    if (isNewHighScore) {
        playSound('highscore');
        triggerConfetti();
    }

    if (elements.finalScore)     elements.finalScore.textContent     = gameState.score;
    if (elements.correctAnswers) elements.correctAnswers.textContent = gameState.correctAnswers;
    // كان يعرض gameState.level، وهو حرفياً correctAnswers ÷ 5 — رقم مكرر لا
    // معلومة جديدة، ويقرأ 1 دائماً في التحدي اليومي حيث لا يزيد المستوى أصلاً.
    if (elements.highestLevel) {
        elements.highestLevel.textContent = gameState.mode === 'daily'
            ? '—'
            : DIFFICULTY_LABELS[activeDifficulty()] || '—';
    }
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

    if (gameState.mode === 'daily' && dailyStreak) {
        subtitle = dailyStreak.count > 1
            ? `تحدي اليوم اكتمل · سلسلة ${dailyStreak.count} أيام`
            : 'تحدي اليوم اكتمل · بداية سلسلة جديدة';
    }

    if (elements.gameoverSubtitle) elements.gameoverSubtitle.textContent = subtitle;
    if (elements.gameoverIcon) {
        import('./icons.js').then(({ setIcon }) => setIcon(elements.gameoverIcon, icon, 'gameover-svg'));
    }

    showScreen('gameoverScreen');
}

/**
 * يترك الجولة الجارية دون إنهائها.
 *
 * لم يكن في شاشة اللعب أي مخرج: ثلاثة أزرار (تلميح، إرسال، تخطي) و Escape
 * لا يعمل فيها — فمن اختار الصعب بالغلط يتحمّل ثلاث خسارات أو يعيد تحميل
 * الصفحة. الجلسة تُحفظ هنا فيظهر شريط الاستكمال في الشاشة الأولى.
 */
export function abandonRound() {
    cancelPending();
    stopTimer();
    hideTimer();
    hideReveal();
    submitting = false;
    setInputLocked(false);
    if (elements.answerInput) elements.answerInput.value = '';
    saveSession();
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

/**
 * نص المشاركة.
 *
 * في التحدي اليومي نبني شبكة رمزية خالية من الحرق — تُري أداءك سؤالاً سؤالاً
 * دون كشف أي إجابة، وهي الآلية التي تجعل نتيجة اليوم قابلة للمقارنة بين
 * اللاعبين أصلاً. وبدونها كانت المشاركة رقماً مجرداً لا يثير فضول أحد.
 */
export function buildShareText() {
    if (gameState.mode === 'daily') {
        const marks = (gameState.dailyMarks || []).map(k => MARKS[k] || MARKS.skip);
        const total = gameState.dailyQuestions?.length || marks.length;
        const streak = getDailyStreak();
        const lines = [
            `تحدي الصور · ${todayKey()}`,
            `${gameState.correctAnswers}/${total}`,
            marks.join('')
        ];
        if (streak.count > 1) lines.push(`🔥 سلسلة ${streak.count} أيام`);
        return lines.filter(Boolean).join('\n');
    }

    return [
        'تحدي الصور',
        '',
        `حققت ${gameState.score} نقطة`,
        `${gameState.correctAnswers} إجابة صحيحة`,
        `أفضل سلسلة: ${gameState.bestStreak}`,
        `أعلى صعوبة: ${DIFFICULTY_LABELS[activeDifficulty()] || '—'}`,
        '',
        'هل تستطيع التغلب على نتيجتي؟'
    ].join('\n');
}

export function shareScore() {
    const text = buildShareText();

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

export { HINTS_PER_ROUND, FREE_SKIPS_PER_ROUND, TIMINGS, activeDifficulty, difficultyForLevel };
