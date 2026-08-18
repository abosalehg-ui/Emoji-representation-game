import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { getDailyQuestions, todayKey, previousKey } from '../js/daily.js';
import { allQuestions } from '../js/questions.js';

describe('مفتاح اليوم', () => {
    test('بصيغة YYYY-MM-DD', () => {
        assert.match(todayKey(), /^\d{4}-\d{2}-\d{2}$/);
    });
});

describe('اليوم السابق', () => {
    test('داخل الشهر', () => {
        assert.equal(previousKey('2026-08-18'), '2026-08-17');
    });

    test('عبور بداية الشهر', () => {
        assert.equal(previousKey('2026-08-01'), '2026-07-31');
        assert.equal(previousKey('2026-03-01'), '2026-02-28');
    });

    test('عبور بداية السنة', () => {
        assert.equal(previousKey('2026-01-01'), '2025-12-31');
    });

    test('السنة الكبيسة', () => {
        assert.equal(previousKey('2028-03-01'), '2028-02-29');
    });

    test('المدخل التالف لا يُسقط الدالة', () => {
        assert.equal(previousKey('ليس تاريخاً'), '');
        assert.equal(previousKey(''), '');
        assert.equal(previousKey(null), '');
    });

    test('السلسلة تتماسك عبر شهر كامل', () => {
        // كل يوم يجب أن يكون «سابقاً» لليوم الذي يليه، بلا ثقوب ولا تكرار
        let key = '2026-03-15';
        const seen = new Set([key]);
        for (let i = 0; i < 40; i++) {
            const prev = previousKey(key);
            assert.match(prev, /^\d{4}-\d{2}-\d{2}$/);
            assert.ok(!seen.has(prev), `تكرر ${prev}`);
            seen.add(prev);
            key = prev;
        }
        assert.equal(seen.size, 41);
    });
});

describe('ثبات التحدي اليومي', () => {
    test('نفس اليوم يعطي نفس الأسئلة في كل استدعاء', () => {
        const a = getDailyQuestions(10).map(q => q.answer);
        const b = getDailyQuestions(10).map(q => q.answer);
        assert.deepEqual(a, b, 'لولا الثبات لاختلف التحدي بين لاعب وآخر');
    });

    test('عشرة أسئلة بلا تكرار', () => {
        const qs = getDailyQuestions(10);
        assert.equal(qs.length, 10);
        assert.equal(new Set(qs.map(q => q.answer)).size, 10, 'لا يتكرر لغز في نفس اليوم');
    });

    test('كل سؤال موجود فعلاً في قاعدة الأسئلة', () => {
        const known = new Set(allQuestions().map(q => q.answer));
        for (const q of getDailyQuestions(10)) {
            assert.ok(known.has(q.answer), `لغز غريب: ${q.answer}`);
            assert.ok(Array.isArray(q.icons) && q.icons.length > 0);
            assert.ok(['easy', 'medium', 'hard'].includes(q._diff));
        }
    });

    test('المنحنى صاعد: 4 سهلة ثم 4 متوسطة ثم 2 صعبة', () => {
        const diffs = getDailyQuestions(10).map(q => q._diff);
        assert.deepEqual(diffs, [
            'easy', 'easy', 'easy', 'easy',
            'medium', 'medium', 'medium', 'medium',
            'hard', 'hard'
        ]);
    });

    test('طلب عدد أقل يقتطع من البداية', () => {
        const five = getDailyQuestions(5);
        const ten = getDailyQuestions(10);
        assert.equal(five.length, 5);
        assert.deepEqual(five.map(q => q.answer), ten.slice(0, 5).map(q => q.answer));
    });
});
