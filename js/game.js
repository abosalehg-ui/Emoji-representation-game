import { gameState, resetGameState, saveSession, clearSession, saveHighScore, markDailyCompleted } from './state.js';
import { questionsDB, filterByCategory } from './questions.js';
import { getDailyQuestions, todayKey } from './daily.js';
import { checkAnswer } from './arabic.js';
import { playSound } from './sounds.js';
import { elements, showScreen, showToast, updateUI, flashCorrect, flashWrong, clearAnswerStyles } from './ui.js';
import { startTimer, stopTimer, hideTimer, elapsedSeconds } from './timer.js';
import { triggerConfetti } from './confetti.js';

const BASE_POINTS = { easy: 10, medium: 20, hard: 30 };

function shuffleIcons(icons) {
    const arr = [...icons];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function renderIcons(icons) {
    return icons
        .map(key => `<img src="assets/images/${key}.svg" alt="" class="puzzle-icon" loading="eager" decoding="async">`)
        .join('');
}

function pickFromPool(pool) {
    const available = pool.filter((_, i) => !gameState.usedQuestions.includes(i));
    if (available.length === 0) {
        gameState.usedQuestions = [];
        return pool[Math.floor(Math.random() * pool.length)];
    }
    const idx = Math.floor(Math.random() * available.length);
    const originalIndex = pool.indexOf(available[idx]);
    gameState.usedQuestions.push(originalIndex);
    return available[idx];
}

function getNextQuestion() {
    if (gameState.mode === 'daily' && gameState.dailyQuestions) {
        const q = gameState.dailyQuestions[gameState.dailyIndex];
        gameState.dailyIndex++;
        return q;
    }
    const pool = filterByCategory(questionsDB[gameState.difficulty], gameState.category);
    return pickFromPool(pool.length > 0 ? pool : questionsDB[gameState.difficulty]);
}

export function loadQuestion() {
    if (!elements.emojiDisplay) return;

    if (gameState.mode === 'daily' && gameState.dailyIndex >= (gameState.dailyQuestions?.length || 0)) {
        endGame();
        return;
    }

    elements.emojiDisplay.innerHTML = `
        <div class="loading">
            <div class="loading-dot"></div>
            <div class="loading-dot"></div>
            <div class="loading-dot"></div>
        </div>
    `;
    if (elements.hintDisplay) elements.hintDisplay.style.display = 'none';
    if (elements.answerInput) elements.answerInput.value = '';
    clearAnswerStyles();
    gameState.hintsUsed = 0;
    gameState.hintsRemaining = 3;
    if (elements.hintCount) elements.hintCount.textContent = '3';
    if (elements.hintBtn) elements.hintBtn.disabled = false;

    const question = getNextQuestion();
    gameState.currentQuestion = question;

    setTimeout(() => {
        elements.emojiDisplay.innerHTML = renderIcons(shuffleIcons(question.icons));
        if (gameState.timerEnabled && gameState.mode !== 'daily') {
            const diff = question._diff || gameState.difficulty;
            startTimer(diff);
        }
    }, 400);
}

export function startGame(opts = {}) {
    playSound('start');
    const { mode = 'classic', difficulty, category, timerEnabled } = opts;

    if (mode === 'daily') {
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
    updateUI();
    showScreen('gameScreen');
    loadQuestion();
}

function awardPoints() {
    const diff = gameState.currentQuestion?._diff || gameState.difficulty;
    const base = BASE_POINTS[diff] || 20;
    const hintPenalty = gameState.hintsUsed * 3;
    let points = Math.max(base - hintPenalty, 5);

    const seconds = elapsedSeconds();
    if (gameState.timerEnabled && seconds > 0 && seconds <= 10) {
        points += 5;
    }

    if (gameState.streak >= 5) points = Math.round(points * 2);
    else if (gameState.streak >= 3) points = Math.round(points * 1.5);

    return points;
}

export function submitAnswer() {
    const answer = elements.answerInput?.value.trim();
    if (!answer || !gameState.currentQuestion) return;

    playSound('click');
    stopTimer();

    if (checkAnswer(answer, gameState.currentQuestion.answer)) {
        playSound('correct');
        flashCorrect();
        gameState.streak++;
        if (gameState.streak > gameState.bestStreak) gameState.bestStreak = gameState.streak;

        const points = awardPoints();
        gameState.score += points;
        gameState.correctAnswers++;

        if (gameState.streak === 3) showToast('سلسلة من 3! نقاط مضاعفة');
        else if (gameState.streak === 5) showToast('سلسلة من 5! نقاط مضاعفة x2');
        else if (gameState.correctAnswers % 5 === 0 && gameState.mode !== 'daily') {
            gameState.level++;
            playSound('levelup');
            showToast(`أحسنت! انتقلت للمستوى ${gameState.level}`);
        } else {
            showToast(`+${points} نقطة`);
        }

        updateUI();
        saveSession();
        setTimeout(() => {
            clearAnswerStyles();
            loadQuestion();
        }, 900);
    } else {
        playSound('wrong');
        flashWrong();
        gameState.streak = 0;
        gameState.lives--;
        updateUI();

        if (gameState.lives <= 0) {
            setTimeout(() => endGame(), 600);
        } else {
            showToast(`حاول مرة أخرى! الإجابة: ${gameState.currentQuestion.answer}`);
            saveSession();
            setTimeout(() => {
                clearAnswerStyles();
                if (elements.answerInput) elements.answerInput.value = '';
                loadQuestion();
            }, 1900);
        }
    }
}

export function handleTimeout() {
    if (!gameState.currentQuestion) return;
    playSound('wrong');
    flashWrong();
    gameState.streak = 0;
    gameState.lives--;
    updateUI();
    showToast(`انتهى الوقت! الإجابة: ${gameState.currentQuestion.answer}`);

    if (gameState.lives <= 0) {
        setTimeout(() => endGame(), 700);
    } else {
        saveSession();
        setTimeout(() => {
            clearAnswerStyles();
            loadQuestion();
        }, 1900);
    }
}

export function showHint() {
    if (gameState.hintsRemaining <= 0 || !gameState.currentQuestion) return;
    playSound('hint');
    const hint = gameState.currentQuestion.hints[gameState.hintsUsed];
    gameState.hintsUsed++;
    gameState.hintsRemaining--;

    if (elements.hintDisplay) {
        elements.hintDisplay.innerHTML = `<img src="assets/images/lightbulb.svg" alt="" class="ui-icon ui-icon-inline"> ${hint}`;
        elements.hintDisplay.style.display = 'block';
    }
    if (elements.hintCount) elements.hintCount.textContent = gameState.hintsRemaining;
    if (gameState.hintsRemaining <= 0 && elements.hintBtn) elements.hintBtn.disabled = true;
}

export function skipQuestion() {
    playSound('click');
    stopTimer();
    gameState.streak = 0;
    gameState.lives--;
    updateUI();

    if (gameState.lives <= 0) {
        endGame();
    } else {
        showToast(`تخطي! الإجابة كانت: ${gameState.currentQuestion?.answer || ''}`);
        saveSession();
        setTimeout(() => loadQuestion(), 1400);
    }
}

export function endGame() {
    playSound('gameover');
    hideTimer();
    clearSession();

    if (gameState.mode === 'daily') markDailyCompleted(todayKey());

    const isNewHighScore = saveHighScore(gameState.score);
    if (isNewHighScore) {
        playSound('highscore');
        triggerConfetti();
    }

    if (elements.finalScore)     elements.finalScore.textContent     = gameState.score;
    if (elements.correctAnswers) elements.correctAnswers.textContent = gameState.correctAnswers;
    if (elements.highestLevel)   elements.highestLevel.textContent   = gameState.level;
    if (elements.highscoreBadge) elements.highscoreBadge.style.display = isNewHighScore ? 'inline-block' : 'none';

    const setGameoverIcon = (file) => {
        if (elements.gameoverIcon) elements.gameoverIcon.src = `assets/images/${file}.svg`;
    };

    if (gameState.score >= 100) {
        setGameoverIcon('trophy');
        elements.gameoverSubtitle.textContent = 'أداء مذهل! أنت بطل حقيقي!';
    } else if (gameState.score >= 50) {
        setGameoverIcon('glowing-star');
        elements.gameoverSubtitle.textContent = 'عمل رائع! استمر في التحسن!';
    } else {
        setGameoverIcon('muscle');
        elements.gameoverSubtitle.textContent = 'لا تستسلم! حاول مرة أخرى!';
    }

    showScreen('gameoverScreen');
}

export function shareScore() {
    const text = `🖼️ تحدي الصور\n\n🏆 حققت ${gameState.score} نقطة!\n✅ ${gameState.correctAnswers} إجابة صحيحة\n🔥 أفضل سلسلة: ${gameState.bestStreak}\n📊 المستوى ${gameState.level}\n\nهل تستطيع التغلب على نتيجتي؟`;
    if (navigator.share) {
        navigator.share({ title: 'تحدي الصور', text }).catch(() => {});
    } else if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
        showToast('تم نسخ النتيجة!');
    }
}
