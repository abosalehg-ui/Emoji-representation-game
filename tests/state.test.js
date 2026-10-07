import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import {
    gameState, resetGameState, restoreSession, saveSession, loadSession, clearSession,
    saveHighScore, saveBestStreak, difficultyForLevel, activeDifficulty,
    getDailyStreak, recordDailyCompletion, loadDailyState, clearDailyState,
    setCurrentDailyDate, markDailyStarted, isDailyCompletedToday,
    SAVE_VERSION, HINTS_PER_ROUND, FREE_SKIPS_PER_ROUND, LEVELS_PER_STEP,
    MAX_STEPS_ABOVE_CHOICE, getCurrentDailyDate
} from '../js/state.js';
import { getItem, setItem, removeItem } from '../js/storage.js';

/**
 * لا localStorage في Node، فتسقط storage.js تلقائياً إلى خريطة في الذاكرة —
 * وهو نفس المسار الذي يسلكه Safari الخاص. اختبار هذي الوحدة يختبر ذلك المسار
 * أيضاً، وهو مقصود.
 */

const KEY_SESSION = 'emojiCharades_session';
const KEY_STREAK  = 'emojiCharades_dailyStreak';

function validSnapshot(over = {}) {
    return {
        v: SAVE_VERSION,
        score: 40, lives: 2, level: 3, correctAnswers: 7,
        difficulty: 'medium', category: 'proverbs',
        usedQuestions: [0, 4, 9],
        hintsRemaining: 3, skipsRemaining: 1,
        streak: 2, bestStreak: 5,
        timerEnabled: true, mode: 'classic',
        dailyIndex: 0, savedAt: Date.now(),
        ...over
    };
}

beforeEach(() => {
    ['emojiCharades_session', 'emojiCharades_dailyState', 'emojiCharades_dailyStreak',
     'emojiCharades_dailyDone', 'emojiCharades_highScore', 'emojiCharades_bestStreak']
        .forEach(removeItem);
    resetGameState();
    // resetGameState يحمل الأرقام القياسية من الذاكرة عمداً، فنُصفّرها صراحةً
    // حتى لا يتسرب اختبار إلى الذي يليه
    gameState.highScore = 0;
    gameState.bestStreakEver = 0;
});

describe('التحقق من ملف الحفظ', () => {
    test('الجلسة السليمة تُقبل وتعود كما حُفظت', () => {
        setItem(KEY_SESSION, JSON.stringify(validSnapshot()));
        const s = loadSession();
        assert.ok(s, 'كان يجب قبولها');
        assert.equal(s.score, 40);
        assert.deepEqual(s.usedQuestions, [0, 4, 9]);
    });

    test('إصدار حفظ مختلف يُرفض', () => {
        setItem(KEY_SESSION, JSON.stringify(validSnapshot({ v: SAVE_VERSION + 1 })));
        assert.equal(loadSession(), null);
    });

    test('الملف التالف يُرفض ويُمسح بدل أن يتكرر عطله', () => {
        setItem(KEY_SESSION, '}{ ليس JSON');
        assert.equal(loadSession(), null);
        assert.equal(getItem(KEY_SESSION), null, 'كان يجب أن يُمسح');
    });

    test('usedQuestions نصاً بدل مصفوفة يُرفض', () => {
        // هذي بالضبط الحالة التي كانت تترك اللعبة عالقة على شاشة التحميل
        setItem(KEY_SESSION, JSON.stringify(validSnapshot({ usedQuestions: 'اثنان' })));
        assert.equal(loadSession(), null);
    });

    test('القيم خارج المدى تُرفض', () => {
        const bad = [
            { lives: 0 }, { lives: 9 },
            { score: -1 }, { level: 0 },
            { hintsRemaining: HINTS_PER_ROUND + 1 },
            { skipsRemaining: FREE_SKIPS_PER_ROUND + 1 },
            { difficulty: 'مستحيل' }, { mode: 'خيالي' },
            { timerEnabled: 'نعم' }, { savedAt: 'أمس' },
            { usedQuestions: [1, -2] }
        ];
        for (const over of bad) {
            setItem(KEY_SESSION, JSON.stringify(validSnapshot(over)));
            assert.equal(loadSession(), null, `كان يجب رفض: ${JSON.stringify(over)}`);
        }
    });

    test('dailyIndex يُفحص كبقية الحقول', () => {
        // كان الحقل الوحيد الذي يمر بلا فحص، فيُمرَّر خاماً إلى resumeDaily
        for (const v of ['3', -1, 1.5, null, 9999]) {
            setItem(KEY_SESSION, JSON.stringify(validSnapshot({ dailyIndex: v })));
            assert.equal(loadSession(), null, `كان يجب رفض dailyIndex=${v}`);
        }
        setItem(KEY_SESSION, JSON.stringify(validSnapshot({ dailyIndex: 4 })));
        assert.ok(loadSession(), 'القيمة السليمة يجب أن تُقبل');
    });

    test('الجلسات الأقدم من أسبوع لا تُعرض', () => {
        const old = Date.now() - 8 * 24 * 60 * 60 * 1000;
        setItem(KEY_SESSION, JSON.stringify(validSnapshot({ savedAt: old })));
        assert.equal(loadSession(), null);
    });
});

describe('حفظ الجلسة واستعادتها', () => {
    test('دورة كاملة: حفظ ثم تحميل ثم استعادة', () => {
        resetGameState({ score: 88, lives: 1, level: 4, correctAnswers: 12,
                         difficulty: 'hard', category: 'wisdom', usedQuestions: [2, 3],
                         streak: 4, bestStreak: 6, timerEnabled: true });
        saveSession();

        const saved = loadSession();
        assert.ok(saved);
        resetGameState();
        restoreSession(saved);

        assert.equal(gameState.score, 88);
        assert.equal(gameState.level, 4);
        assert.equal(gameState.difficulty, 'hard');
        assert.deepEqual(gameState.usedQuestions, [2, 3]);
    });

    test('restoreSession ينسخ usedQuestions ولا يشاركها', () => {
        const saved = validSnapshot();
        restoreSession(saved);
        gameState.usedQuestions.push(999);
        assert.deepEqual(saved.usedQuestions, [0, 4, 9], 'لا يجوز تعديل ملف الحفظ');
    });

    test('clearSession يمحو الجلسة', () => {
        resetGameState({ score: 10 });
        saveSession();
        clearSession();
        assert.equal(loadSession(), null);
    });

    test('resetGameState يبقي الأرقام القياسية عبر الجولات', () => {
        // الرقم القياسي في الذاكرة هو المرجع بعد التحميل الأول، فيُحمَل عبر
        // الجولات بدل أن يُقرأ من التخزين في كل مرة
        saveHighScore(250);
        saveBestStreak(9);
        resetGameState({ score: 5 });
        assert.equal(gameState.highScore, 250, 'الرقم القياسي لا يُصفَّر ببدء جولة');
        assert.equal(gameState.bestStreakEver, 9, 'وأفضل سلسلة كذلك');
        assert.equal(gameState.score, 5, 'أما نقاط الجولة فتبدأ من جديد');
    });
});

describe('الأرقام القياسية', () => {
    test('لا تُسجَّل إلا عند التجاوز', () => {
        resetGameState();
        assert.equal(saveHighScore(100), true);
        assert.equal(saveHighScore(90), false, 'الأقل لا يُسجَّل');
        assert.equal(saveHighScore(101), true);
        assert.equal(gameState.highScore, 101);
    });

    test('أفضل سلسلة تُحفظ عبر الجلسات', () => {
        resetGameState();
        assert.equal(saveBestStreak(7), true);
        assert.equal(saveBestStreak(3), false);
        assert.equal(gameState.bestStreakEver, 7);
    });
});

describe('تصعيد الصعوبة مع المستوى', () => {
    test('كل مستوى يرفع درجة حتى السقف', () => {
        assert.equal(LEVELS_PER_STEP, 1);
        assert.equal(difficultyForLevel('easy', 1), 'easy');
        assert.equal(difficultyForLevel('easy', 2), 'medium');
        assert.equal(difficultyForLevel('medium', 2), 'hard');
    });

    test('درجة واحدة فوق اختيار اللاعب لا أكثر', () => {
        // بلا سقف كان «سهل» يصير «صعب» بعد عشر إجابات بمؤقت 20 ثانية
        assert.equal(MAX_STEPS_ABOVE_CHOICE, 1);
        assert.equal(difficultyForLevel('easy', 3), 'medium');
        assert.equal(difficultyForLevel('easy', 99), 'medium');
        assert.equal(difficultyForLevel('medium', 99), 'hard');
    });

    test('التصعيد يقع داخل جولة واقعية لا بعدها', () => {
        // ثلاث أرواح فقط؛ لو لزم عشر إجابات صحيحة لصعود درجة لما شعر به أحد
        const CORRECT_PER_LEVEL = 5;
        const levelAfter = n => Math.floor(n / CORRECT_PER_LEVEL) + 1;
        assert.equal(difficultyForLevel('medium', levelAfter(5)), 'hard',
                     'خمس إجابات صحيحة يجب أن ترفع الصعوبة');
    });

    test('لا تتجاوز «صعب» مهما علا المستوى', () => {
        assert.equal(difficultyForLevel('hard', 1), 'hard');
        assert.equal(difficultyForLevel('hard', 50), 'hard');
    });

    test('لا تنزل أبداً عن اختيار اللاعب', () => {
        for (const base of ['easy', 'medium', 'hard']) {
            const order = ['easy', 'medium', 'hard'];
            for (let lvl = 1; lvl <= 12; lvl++) {
                assert.ok(order.indexOf(difficultyForLevel(base, lvl)) >= order.indexOf(base),
                          `${base} @${lvl} نزل عن اختيار اللاعب`);
            }
        }
    });

    test('المستويات غير الصالحة لا تُسقط الدالة', () => {
        assert.equal(difficultyForLevel('medium', 0), 'medium');
        assert.equal(difficultyForLevel('medium', -5), 'medium');
        assert.equal(difficultyForLevel('لا شيء', 3), 'لا شيء');
    });

    test('التحدي اليومي صعوبته ثابتة لا تتصاعد', () => {
        resetGameState({ mode: 'daily', difficulty: 'medium', level: 9 });
        assert.equal(activeDifficulty(), 'medium');
        resetGameState({ mode: 'classic', difficulty: 'medium', level: 9 });
        assert.equal(activeDifficulty(), 'hard');
    });
});

describe('سلسلة الأيام', () => {
    test('تبدأ من الصفر', () => {
        assert.deepEqual(getDailyStreak(), { count: 0, lastDate: '' });
    });

    test('يوم يتلو يوماً يزيدها', () => {
        recordDailyCompletion('2026-08-17', '2026-08-16');
        const after = recordDailyCompletion('2026-08-18', '2026-08-17');
        assert.equal(after.count, 2);
    });

    test('نفس اليوم مرتين لا يزيدها', () => {
        recordDailyCompletion('2026-08-17', '2026-08-16');
        const again = recordDailyCompletion('2026-08-17', '2026-08-16');
        assert.equal(again.count, 1);
    });

    test('انقطاع يوم يعيدها إلى واحد', () => {
        recordDailyCompletion('2026-08-17', '2026-08-16');
        recordDailyCompletion('2026-08-18', '2026-08-17');
        const broken = recordDailyCompletion('2026-08-25', '2026-08-24');
        assert.equal(broken.count, 1);
    });

    test('سجل تالف يُتجاهل بدل أن ينهار', () => {
        setItem(KEY_STREAK, JSON.stringify({ count: 'كثير', lastDate: 5 }));
        assert.deepEqual(getDailyStreak(), { count: 0, lastDate: '' });
    });
});

describe('حالة التحدي اليومي', () => {
    test('حالة يوم آخر لا تُستأنف اليوم', () => {
        setCurrentDailyDate('2026-01-01');
        resetGameState({ mode: 'daily', score: 30, dailyIndex: 3 });
        saveSession();
        assert.equal(loadDailyState('2026-08-17'), null, 'يوم مختلف لا يُستأنف');
    });

    test('حالة نفس اليوم تُستأنف', () => {
        setCurrentDailyDate('2026-08-17');
        resetGameState({ mode: 'daily', score: 30, dailyIndex: 3, lives: 2 });
        saveSession();
        const s = loadDailyState('2026-08-17');
        assert.ok(s);
        assert.equal(s.dailyIndex, 3);
        assert.equal(s.score, 30);
    });

    test('يُسجَّل البدء لا الانتهاء، فلا يُعاد التحدي بلا حد', () => {
        markDailyStarted('2026-08-17');
        assert.equal(isDailyCompletedToday('2026-08-17'), true);
        assert.equal(isDailyCompletedToday('2026-08-18'), false);
    });

    test('علامات تالفة تُرفض، والسليمة تُستعاد كما هي', () => {
        setCurrentDailyDate('2026-08-17');
        resetGameState({ mode: 'daily', dailyIndex: 3, dailyMarks: ['correct', 'hint', 'skip'] });
        saveSession();
        assert.deepEqual(loadDailyState('2026-08-17').dailyMarks, ['correct', 'hint', 'skip']);

        resetGameState({ mode: 'daily', dailyIndex: 1, dailyMarks: ['correct', 'wrong'] });
        saveSession();
        assert.equal(loadDailyState('2026-08-17'), null, 'علامات أكثر من الأسئلة المعروضة');

        resetGameState({ mode: 'daily', dailyIndex: 2, dailyMarks: ['correct', '<b>'] });
        saveSession();
        assert.equal(loadDailyState('2026-08-17'), null, 'علامة غير معروفة');
    });

    test('تاريخ التحدي الجاري محفوظ للسلسلة والمشاركة', () => {
        setCurrentDailyDate('2026-08-17');
        assert.equal(getCurrentDailyDate(), '2026-08-17');
    });

    test('clearDailyState يمحوها', () => {
        setCurrentDailyDate('2026-08-17');
        resetGameState({ mode: 'daily', dailyIndex: 2 });
        saveSession();
        clearDailyState();
        assert.equal(loadDailyState('2026-08-17'), null);
    });
});
