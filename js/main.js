import { CATEGORIES, countFor, isCategoryPlayable, MIN_POOL, totalQuestions } from './questions.js';
import {
    gameState, loadSession, clearSession, restoreSession,
    isDailyCompletedToday, loadDailyState, hasSeenIntro, getDailyStreak, DIFFICULTY_LABELS
} from './state.js';
import { isPersistent } from './storage.js';
import { todayKey, previousKey } from './daily.js';
import { loadSounds, playSound, isSoundEnabled, toggleSound, getVolume, setVolume } from './sounds.js';
import {
    cacheElements, elements, showScreen, showToast,
    initTheme, toggleTheme, setInputLocked
} from './ui.js';
import { loadSprite, iconMarkup, setIcon } from './icons.js';
import { initTimer, hideTimer } from './timer.js';
import {
    startGame, resumeGame, resumeDaily, submitAnswer, showHint, skipQuestion,
    shareScore, handleTimeout, lastRoundOptions, abandonRound
} from './game.js';
import { journalEntries, solvedCount } from './journal.js';
import { showIntro, submitIntro, skipIntro } from './tutorial.js';

/** أقصى ما نؤخّر به الإقلاع انتظاراً للـsprite قبل المضيّ بالأيقونات البديلة. */
const BOOT_SPRITE_WAIT_MS = 1200;

/* ------------------------------------------------------------------ */
/* الفئات                                                              */
/* ------------------------------------------------------------------ */

function buildCategoryGrid() {
    if (!elements.categoryGrid) return;

    elements.categoryGrid.innerHTML = CATEGORIES.map(c => `
        <button class="category-btn" data-category="${c.id}" type="button">
            <span class="category-icon-wrap">${iconMarkup(c.icon, 'category-icon')}</span>
            <p>${c.label}</p>
            <span class="category-count"></span>
        </button>
    `).join('');

    elements.categoryGrid.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.disabled) return;
            playSound('click');
            selectCategory(btn.dataset.category);
        });
    });

    refreshCategoryAvailability();
}

function selectCategory(id) {
    gameState.category = id;
    elements.categoryGrid?.querySelectorAll('.category-btn').forEach(b => {
        b.classList.toggle('selected', b.dataset.category === id);
        b.setAttribute('aria-pressed', String(b.dataset.category === id));
    });
}

/**
 * يعطّل الفئات التي لا تملك أسئلة كافية للصعوبة الحالية ويعرض العدد.
 *
 * سابقاً كان اختيار «شعر + سهل» يمر بصمت ثم تعود اللعبة إلى المجموعة الكاملة،
 * فيحصل اللاعب على أمثال وحكم بدل الشعر دون أي إشعار.
 */
function refreshCategoryAvailability() {
    if (!elements.categoryGrid) return;
    const diff = gameState.difficulty;
    let currentStillValid = false;

    elements.categoryGrid.querySelectorAll('.category-btn').forEach(btn => {
        const id = btn.dataset.category;
        const n = id === 'all'
            ? countFor(diff, 'all')
            : countFor(diff, id);
        const playable = id === 'all' || isCategoryPlayable(diff, id);

        btn.disabled = !playable;
        btn.classList.toggle('unavailable', !playable);
        btn.title = playable
            ? `${n} لغزاً على مستوى ${DIFFICULTY_LABELS[diff]}`
            : `تحتاج ${MIN_POOL} ألغاز على الأقل — متاح ${n} فقط على مستوى ${DIFFICULTY_LABELS[diff]}`;

        const count = btn.querySelector('.category-count');
        if (count) count.textContent = n;

        if (id === gameState.category && playable) currentStillValid = true;
    });

    if (!currentStillValid) selectCategory('all');
    else selectCategory(gameState.category);
}

/* ------------------------------------------------------------------ */
/* الشاشة الأولى                                                       */
/* ------------------------------------------------------------------ */

function refreshDailyChip() {
    const done = isDailyCompletedToday(todayKey());
    const resumable = !!loadDailyState(todayKey());

    if (elements.dailyDoneBadge) elements.dailyDoneBadge.hidden = !done || resumable;
    elements.dailyChip?.classList.toggle('done', done && !resumable);
    if (elements.dailyChip) {
        elements.dailyChip.dataset.resumable = String(resumable);
    }

    // السلسلة معروضة على الشريحة نفسها: سلسلة لا يراها اللاعب لا تحفّزه
    if (elements.dailyStreakBadge) {
        const { count, lastDate } = getDailyStreak();
        // تنكسر السلسلة إن فات يوم كامل — لا نعرض رقماً لم يعد صحيحاً
        const alive = count > 0 && (lastDate === todayKey() || lastDate === previousKey(todayKey()));
        elements.dailyStreakBadge.hidden = !alive;
        if (alive) elements.dailyStreakBadge.textContent = `🔥 ${count}`;
    }
}

function maybeShowResumeBanner() {
    if (!elements.resumeBanner) return;

    const saved = loadSession();
    if (!saved || saved.mode !== 'classic') {
        elements.resumeBanner.hidden = true;
        return;
    }

    elements.resumeBanner.hidden = false;
    if (elements.resumeDifficulty) {
        elements.resumeDifficulty.textContent = DIFFICULTY_LABELS[saved.difficulty] || '';
    }
    if (elements.resumeScore) elements.resumeScore.textContent = saved.score;

    elements.resumeBanner.onclick = (e) => {
        if (e.target.closest('#resumeClose')) return;
        playSound('click');
        restoreSession(saved);
        resumeGame();
    };
    if (elements.resumeClose) {
        elements.resumeClose.onclick = (e) => {
            e.stopPropagation();
            playSound('click');
            clearSession();
            elements.resumeBanner.hidden = true;
        };
    }
}

function setupModeChips() {
    const select = (mode) => {
        gameState.mode = mode;
        elements.classicChip?.classList.toggle('selected', mode === 'classic');
        elements.dailyChip?.classList.toggle('selected', mode === 'daily');
        elements.classicChip?.setAttribute('aria-pressed', String(mode === 'classic'));
        elements.dailyChip?.setAttribute('aria-pressed', String(mode === 'daily'));
    };

    elements.classicChip?.addEventListener('click', () => {
        playSound('click');
        select('classic');
    });

    elements.dailyChip?.addEventListener('click', () => {
        const key = todayKey();
        if (isDailyCompletedToday(key) && !loadDailyState(key)) {
            showToast('أكملت تحدي اليوم! عُد غداً لتحدٍ جديد');
            return;
        }
        playSound('click');
        select('daily');
    });

    select('classic');
}

function setupDifficultyButtons() {
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            playSound('click');
            document.querySelectorAll('.difficulty-btn').forEach(b => {
                b.classList.remove('selected');
                b.setAttribute('aria-pressed', 'false');
            });
            btn.classList.add('selected');
            btn.setAttribute('aria-pressed', 'true');
            gameState.difficulty = btn.dataset.level;
            refreshCategoryAvailability();
        });
    });
}

function setupTimerToggle() {
    if (!elements.timerToggle) return;
    const sync = () => {
        elements.timerToggle.classList.toggle('on', gameState.timerEnabled);
        elements.timerToggle.setAttribute('aria-pressed', String(gameState.timerEnabled));
    };
    sync();
    elements.timerToggle.addEventListener('click', () => {
        playSound('click');
        gameState.timerEnabled = !gameState.timerEnabled;
        sync();
    });
}

/** الإعدادات المتقدمة خلف زر، فلا تزاحم الهدف في أول شاشة. */
function setupSettingsDisclosure() {
    if (!elements.settingsToggle || !elements.settingsPanel) return;
    const sync = (open) => {
        elements.settingsPanel.hidden = !open;
        elements.settingsToggle.setAttribute('aria-expanded', String(open));
        elements.settingsToggle.classList.toggle('open', open);
    };
    // تُفتح تلقائياً لمن جرّب اللعبة من قبل
    sync(hasSeenIntro());
    elements.settingsToggle.addEventListener('click', () => {
        playSound('click');
        sync(elements.settingsPanel.hidden);
    });
}

/* ------------------------------------------------------------------ */
/* الصوت                                                               */
/* ------------------------------------------------------------------ */

function setSoundIcon() {
    if (elements.soundIcon) {
        setIcon(elements.soundIcon, isSoundEnabled() ? 'sound-on' : 'sound-off', 'ui-icon');
    }
    elements.soundToggle?.classList.toggle('muted', !isSoundEnabled());
    elements.soundToggle?.setAttribute('aria-pressed', String(isSoundEnabled()));
    if (elements.volumeRow) elements.volumeRow.hidden = !isSoundEnabled();
}

function setupVolume() {
    if (!elements.volumeSlider) return;
    elements.volumeSlider.value = String(Math.round(getVolume() * 100));
    elements.volumeSlider.addEventListener('input', () => {
        setVolume(Number(elements.volumeSlider.value) / 100);
    });
    elements.volumeSlider.addEventListener('change', () => playSound('click'));
}

/* ------------------------------------------------------------------ */
/* دفتر الأمثال                                                        */
/* ------------------------------------------------------------------ */

/** الفئة المعروضة حالياً في الدفتر. */
let journalFilter = 'all';

/**
 * يرسم دفتر الأمثال.
 *
 * كان 143 خلية متطابقة بلا تجميع ولا مرشِّح — تسع شاشات من علامات استفهام —
 * ونص الإجابة فيها بحجم 10 بكسل، ولا تُعرض إلا أول أيقونتين من أربع فتظهر
 * ألغاز الأربع مبتورةً ومضلّلة.
 */
function renderJournal() {
    if (!elements.journalGrid) return;

    const entries = journalEntries();
    const total = totalQuestions();
    const found = solvedCount();

    if (elements.journalProgress) {
        elements.journalProgress.textContent = `${found} من ${total}`;
    }

    renderJournalFilters(entries);

    const shown = journalFilter === 'all'
        ? entries
        : entries.filter(e => e.category === journalFilter);

    elements.journalGrid.innerHTML = shown.map((e, i) => {
        if (!e.unlocked) {
            return `<li class="journal-cell locked" aria-label="لغز ${i + 1}: لم يُكتشف بعد">؟</li>`;
        }
        // كل الأيقونات لا أول اثنتين: اللغز جملة رمزية، وبترها يشوّهها
        return `<li class="journal-cell unlocked">
            <span class="journal-icons">${e.icons.map(n => iconMarkup(n, 'journal-icon')).join('')}</span>
            <span class="journal-text">${escapeHtml(e.answer)}</span>
        </li>`;
    }).join('');
}

/** شريط تصفية بالفئة، وفي كل فئة عدد ما اكتُشف من مجموعها. */
function renderJournalFilters(entries) {
    if (!elements.journalFilters) return;

    const stat = (id) => {
        const set = id === 'all' ? entries : entries.filter(e => e.category === id);
        return { found: set.filter(e => e.unlocked).length, total: set.length };
    };

    elements.journalFilters.innerHTML = CATEGORIES.map(c => {
        const { found, total } = stat(c.id);
        const on = c.id === journalFilter;
        return `<button class="journal-filter${on ? ' selected' : ''}" type="button"
                        data-category="${c.id}" aria-pressed="${on}">
            ${c.label} <span class="journal-filter-count">${found}/${total}</span>
        </button>`;
    }).join('');

    elements.journalFilters.querySelectorAll('.journal-filter').forEach(btn => {
        btn.addEventListener('click', () => {
            playSound('click');
            journalFilter = btn.dataset.category;
            renderJournal();
        });
    });
}

function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c =>
        ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

/* ------------------------------------------------------------------ */
/* PWA                                                                 */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/* الإقلاع                                                             */
/* ------------------------------------------------------------------ */

function isActiveScreen(id) {
    return !!document.getElementById(id)?.classList.contains('active');
}

function goToStart() {
    hideTimer();
    refreshDailyChip();
    maybeShowResumeBanner();
    refreshCategoryAvailability();
    showScreen('startScreen');
}

/** يترك الجولة الجارية ويعود للقائمة — التقدّم محفوظ ويظهر في شريط الاستكمال. */
function leaveRound() {
    // false = الأرواح كانت قد نفدت فانتهت الجولة وظهرت شاشة النهاية
    if (!abandonRound()) return;
    goToStart();
    showToast('حُفظ تقدّمك — تقدر تكمل من الشاشة الأولى');
}

function startFromControls() {
    if (gameState.mode === 'daily') {
        if (loadDailyState(todayKey())) {
            if (resumeDaily()) return;
        }
        startGame({ mode: 'daily' });
        return;
    }
    startGame({
        mode: 'classic',
        difficulty: gameState.difficulty,
        category: gameState.category,
        timerEnabled: gameState.timerEnabled
    });
}

async function boot() {
    cacheElements();
    initTheme();
    loadSounds();

    // الـsprite تحسين لا شرط للإقلاع.
    //
    // كان هنا `await loadSprite()` مجرّداً، فطلب معلّق — لا فاشل، معلّق، وهو
    // الأشيع على شبكات الجوال — يوقف بقية boot() إلى الأبد: تظهر الشاشة الأولى
    // مرسومةً بالكامل ولا يُربط أي مستمع حدث، فتبدو اللعبة سليمة وكل أزرارها
    // ميتة بلا رسالة خطأ.
    //
    // ننتظره مدة قصيرة فقط: على شبكة سريعة يصل قبل الرسم فلا وميض، وعلى شبكة
    // متعثرة نُقلع بدونه بالأيقونات البديلة ثم نرقّيها حين يصل (promoteStaticIcons).
    await Promise.race([
        loadSprite(),
        new Promise(resolve => setTimeout(resolve, BOOT_SPRITE_WAIT_MS))
    ]);

    setSoundIcon();
    setupVolume();

    initTimer({
        bar: elements.timerBar,
        fill: elements.timerBarFill,
        onExpire: handleTimeout
    });

    buildCategoryGrid();
    setupModeChips();
    setupDifficultyButtons();
    setupTimerToggle();
    setupSettingsDisclosure();
    refreshDailyChip();
    maybeShowResumeBanner();
    registerServiceWorker();
    setupInstallButton();

    if (elements.storageWarning) elements.storageWarning.hidden = isPersistent();

    /* --- أزرار اللعب --- */
    elements.playBtn?.addEventListener('click', startFromControls);
    elements.submitBtn?.addEventListener('click', submitAnswer);

    // keypress مهجور وسلوكه مع Enter غير موثوق على بعض محررات الإدخال العربية
    elements.answerInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.isComposing) {
            e.preventDefault();
            submitAnswer();
        }
    });

    elements.hintBtn?.addEventListener('click', showHint);
    elements.skipBtn?.addEventListener('click', skipQuestion);

    /* --- شاشة النهاية --- */
    elements.playAgainBtn?.addEventListener('click', () => {
        playSound('click');
        // كان يعود إلى شاشة الإعدادات فيعيد اللاعب اختيار كل شيء في كل مرة
        startGame(lastRoundOptions());
    });
    elements.changeSettingsBtn?.addEventListener('click', () => {
        playSound('click');
        goToStart();
    });
    elements.shareBtn?.addEventListener('click', shareScore);

    /* --- دفتر الأمثال --- */
    elements.journalBtn?.addEventListener('click', () => {
        playSound('click');
        renderJournal();
        showScreen('journalScreen');
    });
    elements.journalCloseBtn?.addEventListener('click', () => {
        playSound('click');
        goToStart();
    });

    /* --- التعريف --- */
    elements.introSubmit?.addEventListener('click', submitIntro);
    elements.introInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.isComposing) {
            e.preventDefault();
            submitIntro();
        }
    });
    elements.introSkip?.addEventListener('click', skipIntro);

    /* --- أزرار عامة --- */
    elements.soundToggle?.addEventListener('click', () => {
        toggleSound();
        setSoundIcon();
        playSound('click');
    });
    elements.themeToggle?.addEventListener('click', () => {
        playSound('click');
        toggleTheme();
    });

    /* --- الخروج من الجولة --- */
    elements.exitRoundBtn?.addEventListener('click', () => {
        playSound('click');
        leaveRound();
    });

    // الهروب يخرج من الشاشة الحالية إلى الأولى — وكان يعالج شاشة الدفتر فقط،
    // فلا مخرج من الجولة إطلاقاً لا بزر ولا بمفتاح.
    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;
        if (isActiveScreen('journalScreen')) goToStart();
        else if (isActiveScreen('gameScreen')) leaveRound();
    });

    setInputLocked(false);

    if (!hasSeenIntro()) {
        showIntro(goToStart);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
} else {
    boot();
}
