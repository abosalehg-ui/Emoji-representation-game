import { test, describe, beforeEach, afterEach, mock } from 'node:test';
import assert from 'node:assert/strict';

/**
 * تسلسلات اللعب نفسها — لا الدوال الخالصة.
 *
 * الخطآن البرتقاليان في مراجعة مِحَك الثانية كانا كلاهما هنا: الخروج بعد آخر
 * حياة يلغي endGame، وعلامات التحدي اليومي تضيع مع الاستئناف. الدوال الخالصة
 * كانت مختبرة كلها والتدفق لا — فمرّ الخطآن من 80 اختباراً ناجحاً.
 *
 * game.js لا يلمس DOM إلا عبر elements و document.getElementById و Audio،
 * فتكفي بدائل صغيرة بدل بيئة DOM كاملة.
 */

class FakeAudio {
    constructor() { this.volume = 1; this.preload = 'none'; this.currentTime = 0; }
    play() { return Promise.resolve(); }
}
globalThis.Audio = FakeAudio;
globalThis.Image = class { set src(_) {} };
globalThis.window = globalThis.window || {};
globalThis.document = globalThis.document || {
    getElementById: () => null,
    querySelectorAll: () => []
};
globalThis.scrollTo = () => {};

// نمسك الوحدة لا الحقل: gameState يُعاد إسناده في resetGameState، والتفكيك
// من import() الديناميكي يأخذ نسخة لا ربطاً حياً
const state = await import('../js/state.js');
const { resetGameState, setCurrentDailyDate, loadDailyState, getDailyStreak } = state;
const { elements } = await import('../js/ui.js');
const { getItem, removeItem, setJSON } = await import('../js/storage.js');
const { todayKey } = await import('../js/daily.js');
const game = await import('../js/game.js');

function fakeEl() {
    return {
        value: '', innerHTML: '', textContent: '', hidden: false, disabled: false,
        classList: { add() {}, remove() {}, toggle() {}, contains: () => false },
        setAttribute() {}, getAttribute: () => null, focus() {},
        querySelectorAll: () => []
    };
}

const KEYS = ['emojiCharades_session', 'emojiCharades_dailyState', 'emojiCharades_dailyStreak',
              'emojiCharades_dailyDone', 'emojiCharades_highScore', 'emojiCharades_bestStreak',
              'emojiCharades_journal'];

beforeEach(() => {
    KEYS.forEach(removeItem);
    resetGameState();
    state.gameState.highScore = 0;
    state.gameState.bestStreakEver = 0;
    for (const k of Object.keys(elements)) delete elements[k];
    elements.answerInput = fakeEl();
    elements.emojiDisplay = fakeEl();
    elements.exitRoundBtn = fakeEl();
    mock.timers.enable({ apis: ['setTimeout'] });
});

afterEach(() => mock.timers.reset());

function answer(text) {
    elements.answerInput.value = text;
    game.submitAnswer();
}

describe('الخروج بعد آخر حياة', () => {
    test('ينهي الجولة ويحفظ الرقم القياسي بدل أن يمحوها', () => {
        game.startGame({ mode: 'classic', difficulty: 'easy' });
        state.gameState.score = 20;
        state.gameState.lives = 1;

        answer('إجابة خاطئة تماماً');
        assert.equal(state.gameState.lives, 0);
        assert.equal(elements.exitRoundBtn.disabled, true, 'زر الخروج يتعطل حين تنفد الأرواح');

        // Escape قبل أن ينقضي مؤقت شاشة النهاية (700ms)
        const abandoned = game.abandonRound();

        assert.equal(abandoned, false, 'الجولة انتهت ولم تُترك');
        assert.equal(getItem('emojiCharades_highScore'), '20', 'الرقم القياسي محفوظ');
        assert.equal(getItem('emojiCharades_session'), null, 'لا جلسة معلّقة بأرواح صفر');
    });

    test('الخروج العادي يحفظ الجلسة ويبقي الزر متاحاً', () => {
        game.startGame({ mode: 'classic', difficulty: 'easy' });
        answer('إجابة خاطئة تماماً');
        assert.equal(elements.exitRoundBtn.disabled, false, 'نافذة التغذية الراجعة لا تعطّل الخروج');
        assert.equal(game.abandonRound(), true);
        assert.ok(getItem('emojiCharades_session'), 'الجلسة محفوظة للاستكمال');
    });
});

describe('التحدي اليومي: حفظ ثم استئناف ثم مشاركة', () => {
    test('الشبكة تحمل علامة لكل سؤال بعد الاستئناف', () => {
        game.startGame({ mode: 'daily' });
        for (let i = 0; i < 4; i++) {
            answer(state.gameState.currentQuestion.answer);
            mock.timers.tick(1000);
        }
        answer('إجابة خاطئة تماماً');
        mock.timers.tick(2500);

        const saved = loadDailyState(todayKey());
        assert.deepEqual(saved.dailyMarks, ['correct', 'correct', 'correct', 'correct', 'wrong']);

        // «إعادة تحميل»: الذاكرة تُمسح والاستئناف يقرأ من التخزين وحده
        resetGameState();
        assert.equal(game.resumeDaily(), true);

        // الخمسة الباقية؛ بعد العاشر يستدعي loadQuestion نفسه endGame
        for (let i = 0; i < 5; i++) {
            answer(state.gameState.currentQuestion.answer);
            mock.timers.tick(1000);
        }

        const grid = game.buildShareText().split('\n')[2];
        assert.equal([...grid].length, 10, `عشر علامات لا ${[...grid].length}: ${grid}`);
        assert.ok(game.buildShareText().includes('9/10'));
    });

    test('ملف حفظ قديم بلا علامات يبقى قابلاً للاستئناف', () => {
        game.startGame({ mode: 'daily' });
        answer(state.gameState.currentQuestion.answer);
        mock.timers.tick(1000);

        // يُكتب كما كان يكتبه الإصدار السابق
        const raw = JSON.parse(getItem('emojiCharades_dailyState'));
        delete raw.dailyMarks;
        setJSON('emojiCharades_dailyState', raw);

        assert.ok(loadDailyState(todayKey()), 'لم يُمسح التحدي الجاري بسبب التحديث');
    });
});

describe('سلسلة الأيام تتبع تاريخ التحدي', () => {
    test('إنهاء تحدي الثلاثاء بعد منتصف الليل يُحسب للثلاثاء', () => {
        game.startGame({ mode: 'daily' });
        // التحدي بدأ «أمس» وانتهى اليوم
        setCurrentDailyDate('2026-01-06');
        game.endGame();
        assert.equal(getDailyStreak().lastDate, '2026-01-06');
        assert.ok(game.buildShareText().startsWith('تحدي الصور · 2026-01-06'));
    });
});
