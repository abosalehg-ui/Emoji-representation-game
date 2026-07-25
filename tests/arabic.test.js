import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { checkAnswer, normalizeArabic } from '../js/arabic.js';
import { questionsDB } from '../js/questions.js';

const stripTashkeel = s => s.replace(/[ً-ْٰـ]/g, '');

describe('normalizeArabic', () => {
    test('يحذف التشكيل', () => {
        assert.equal(normalizeArabic('بَعِيداً'), 'بعيدا');
        assert.equal(normalizeArabic('بكّر'), 'بكر');
        assert.equal(normalizeArabic('خيّالها'), 'خيالها');
    });

    test('يحذف التطويل', () => {
        assert.equal(normalizeArabic('صـــبر'), 'صبر');
    });

    test('يوحّد الألف بأشكالها', () => {
        assert.equal(normalizeArabic('أإآا'), 'اااا');
    });

    test('يوحّد الياء والألف المقصورة', () => {
        assert.equal(normalizeArabic('على'), normalizeArabic('علي'));
    });

    test('يوحّد التاء المربوطة والهاء', () => {
        assert.equal(normalizeArabic('قوة'), normalizeArabic('قوه'));
    });

    test('يوحّد الهمزات', () => {
        assert.equal(normalizeArabic('مؤمن'), normalizeArabic('مءمن'));
    });

    test('يحذف غير العربي ويطبّع المسافات', () => {
        assert.equal(normalizeArabic('  الوقت   من ذهب!!! 123  '), 'الوقت من ذهب');
    });

    test('يتحمّل المدخلات الفارغة والعدمية', () => {
        assert.equal(normalizeArabic(''), '');
        assert.equal(normalizeArabic(null), '');
        assert.equal(normalizeArabic(undefined), '');
    });
});

describe('checkAnswer — يقبل الصحيح', () => {
    test('التطابق الحرفي', () => {
        assert.ok(checkAnswer('الوقت من ذهب', 'الوقت من ذهب'));
    });

    test('الكتابة بلا تشكيل تُقبل', () => {
        // هاتان الحالتان كانتا تُرفضان: الشدّة لم تكن تُحذف قبل المقارنة
        assert.ok(checkAnswer('من بكر طار', 'من بكّر طار'));
        assert.ok(checkAnswer('الخيل من خيالها', 'الخيل من خيّالها'));
    });

    test('اختلاف الهمزة والتاء المربوطة يُتسامح معه', () => {
        assert.ok(checkAnswer(
            'التفاحه لا تسقط بعيدا عن الشجره',
            'التفاحة لا تسقط بعيداً عن الشجرة'
        ));
    });

    test('حذف كلمة واحدة من عبارة طويلة يُقبل', () => {
        assert.ok(checkAnswer('التفاحة لا تسقط عن الشجرة', 'التفاحة لا تسقط بعيداً عن الشجرة'));
    });

    test('كل إجابة في قاعدة الأسئلة تُقبل حرفياً وبلا تشكيل', () => {
        for (const diff of ['easy', 'medium', 'hard']) {
            for (const q of questionsDB[diff]) {
                assert.ok(checkAnswer(q.answer, q.answer), `حرفياً: ${q.answer}`);
                assert.ok(checkAnswer(stripTashkeel(q.answer), q.answer), `بلا تشكيل: ${q.answer}`);
            }
        }
    });
});

describe('checkAnswer — يرفض الخاطئ', () => {
    test('تكرار كلمة صحيحة لا يُقبل', () => {
        // الثغرة القديمة: العدّاد كان يحسب كلمات اللاعب ويقسم على كلمات الإجابة،
        // فتكرار كلمة واحدة يرفع النسبة فوق العتبة
        assert.ok(!checkAnswer('الماء الماء الماء', 'قطرة الماء تثقب الحجر'));
        assert.ok(!checkAnswer('الشجرة الشجرة الشجرة', 'التفاحة لا تسقط بعيداً عن الشجرة'));
        assert.ok(!checkAnswer('العين العين العين العين', 'بعيد عن العين بعيد عن القلب'));
    });

    test('كلمة واحدة صحيحة لا تكفي', () => {
        assert.ok(!checkAnswer('الحجر', 'قطرة الماء تثقب الحجر'));
    });

    test('نصف الإجابة القصيرة يُرفض', () => {
        assert.ok(!checkAnswer('الوقت', 'الوقت من ذهب'));
    });

    test('كلام لا صلة له يُرفض', () => {
        assert.ok(!checkAnswer('سيارة طائرة كمبيوتر', 'قطرة الماء تثقب الحجر'));
        assert.ok(!checkAnswer('xxxxx', 'الوقت من ذهب'));
    });

    test('الفراغ يُرفض', () => {
        assert.ok(!checkAnswer('', 'الوقت من ذهب'));
        assert.ok(!checkAnswer('   ', 'الوقت من ذهب'));
    });

    test('حشو كلمات صحيحة داخل هراء يُرفض', () => {
        assert.ok(!checkAnswer(
            'الماء الحجر سيارة طائرة قطار مدرسة حاسوب',
            'قطرة الماء تثقب الحجر'
        ));
    });
});
