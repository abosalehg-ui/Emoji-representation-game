import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { gameState, resetGameState } from '../js/state.js';
import { awardPoints, buildShareText, activeDifficulty } from '../js/game.js';

/**
 * game.js يستورد ui.js، لكن ui.js لا يلمس document إلا داخل دوالّه — فالوحدة
 * تُستورد في Node بلا DOM ما دمنا نختبر المنطق الخالص (النقاط والمشاركة).
 */

beforeEach(() => resetGameState());

describe('احتساب النقاط', () => {
    test('النقاط الأساسية تتبع الصعوبة', () => {
        resetGameState({ difficulty: 'easy' });
        assert.equal(awardPoints(), 10);
        resetGameState({ difficulty: 'medium' });
        assert.equal(awardPoints(), 20);
        resetGameState({ difficulty: 'hard' });
        assert.equal(awardPoints(), 30);
    });

    test('كل تلميح يخصم ثلاثاً', () => {
        resetGameState({ difficulty: 'medium', hintsUsedOnCurrent: 1 });
        assert.equal(awardPoints(), 17);
        resetGameState({ difficulty: 'medium', hintsUsedOnCurrent: 2 });
        assert.equal(awardPoints(), 14);
    });

    test('الخصم لا ينزل تحت الحد الأدنى', () => {
        resetGameState({ difficulty: 'easy', hintsUsedOnCurrent: 5 });
        assert.equal(awardPoints(), 5, 'الحد الأدنى خمس نقاط مهما كثرت التلميحات');
    });

    test('سلسلة 3 تضاعف بـ1.5 و5 تضاعف بـ2', () => {
        resetGameState({ difficulty: 'medium', streak: 2 });
        assert.equal(awardPoints(), 20, 'أقل من ثلاثة: بلا مضاعفة');
        resetGameState({ difficulty: 'medium', streak: 3 });
        assert.equal(awardPoints(), 30);
        resetGameState({ difficulty: 'medium', streak: 4 });
        assert.equal(awardPoints(), 30);
        resetGameState({ difficulty: 'medium', streak: 5 });
        assert.equal(awardPoints(), 40);
        resetGameState({ difficulty: 'medium', streak: 12 });
        assert.equal(awardPoints(), 40, 'لا مضاعفة ثالثة فوق الخمس');
    });

    test('المضاعفة تُطبَّق بعد خصم التلميحات لا قبله', () => {
        resetGameState({ difficulty: 'medium', hintsUsedOnCurrent: 2, streak: 5 });
        assert.equal(awardPoints(), 28, '(20 − 6) × 2');
    });

    test('صعوبة السؤال نفسه تسبق صعوبة الجولة', () => {
        // أسئلة التحدي اليومي تحمل _diff الخاص بها
        resetGameState({ mode: 'daily', difficulty: 'medium',
                         currentQuestion: { _diff: 'hard', answer: 'س' } });
        assert.equal(awardPoints(), 30);
    });

    test('النقاط تتبع الصعوبة المتصاعدة لا المختارة', () => {
        // مستوى 3 من «سهل» يصل إلى «صعب»، فيجب أن تعطي نقاط الصعب
        resetGameState({ difficulty: 'easy', level: 3 });
        assert.equal(activeDifficulty(), 'hard');
        assert.equal(awardPoints(), 30);
    });

    test('لا مكافأة سرعة والمؤقت مطفأ', () => {
        resetGameState({ difficulty: 'medium', timerEnabled: false });
        assert.equal(awardPoints(), 20, 'المؤقت مطفأ فلا سرعة تُقاس');
    });

    test('النقاط عدد صحيح دائماً', () => {
        for (const streak of [0, 3, 5]) {
            for (const hints of [0, 1, 2, 3]) {
                resetGameState({ difficulty: 'medium', streak, hintsUsedOnCurrent: hints });
                assert.ok(Number.isInteger(awardPoints()), `${streak}/${hints} أعطت كسراً`);
            }
        }
    });
});

describe('نص المشاركة', () => {
    test('النمط الكلاسيكي: نص بلا شبكة', () => {
        resetGameState({ mode: 'classic', score: 145, correctAnswers: 11,
                         bestStreak: 6, difficulty: 'medium', level: 1 });
        const text = buildShareText();
        assert.match(text, /145 نقطة/);
        assert.match(text, /11 إجابة صحيحة/);
        assert.doesNotMatch(text, /[🟩🟥🟨⬜]/, 'الشبكة للتحدي اليومي وحده');
    });

    test('التحدي اليومي: شبكة رمزية بعدد الأسئلة', () => {
        resetGameState({
            mode: 'daily', correctAnswers: 8, dailyQuestions: new Array(10),
            dailyMarks: ['correct', 'correct', 'wrong', 'hint', 'correct',
                         'correct', 'skip', 'correct', 'correct', 'correct']
        });
        const text = buildShareText();
        const grid = text.split('\n').find(l => /[🟩🟥🟨⬜]/.test(l));
        assert.ok(grid, 'لا شبكة في النص');
        assert.equal([...grid].length, 10, 'رمز لكل سؤال');
        assert.match(text, /8\/10/);
    });

    test('الشبكة لا تكشف أي إجابة', () => {
        resetGameState({
            mode: 'daily', correctAnswers: 2, dailyQuestions: new Array(3),
            dailyMarks: ['correct', 'wrong', 'correct']
        });
        const text = buildShareText();
        // لا حروف عربية إلا في العنوان والسلسلة — ولا شيء من نص الألغاز
        assert.doesNotMatch(text, /مثل|حكمة|بيت|آية/);
        assert.match(text, /تحدي الصور/);
    });

    test('الشبكة تتحمّل جولة بلا علامات مسجّلة', () => {
        resetGameState({ mode: 'daily', correctAnswers: 0, dailyQuestions: new Array(10) });
        assert.doesNotThrow(() => buildShareText());
    });
});
