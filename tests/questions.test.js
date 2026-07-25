import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
    questionsDB, CATEGORIES, filterByCategory,
    isCategoryPlayable, countFor, MIN_POOL, allQuestions
} from '../js/questions.js';
import { checkAnswer, normalizeArabic } from '../js/arabic.js';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIFFICULTIES = ['easy', 'medium', 'hard'];
const CATEGORY_IDS = CATEGORIES.map(c => c.id).filter(id => id !== 'all');

const sprite = fs.readFileSync(path.join(ROOT, 'assets/sprite.svg'), 'utf8');
const spriteIds = new Set([...sprite.matchAll(/id="i-([^"]+)"/g)].map(m => m[1]));

describe('سلامة قاعدة الأسئلة', () => {
    test('كل لغز يحمل الحقول المطلوبة', () => {
        for (const diff of DIFFICULTIES) {
            for (const q of questionsDB[diff]) {
                assert.ok(Array.isArray(q.icons) && q.icons.length >= 2, `أيقونات: ${q.answer}`);
                assert.ok(typeof q.answer === 'string' && q.answer.trim(), 'إجابة غير فارغة');
                assert.equal(q.hints.length, 3, `ثلاثة تلميحات: ${q.answer}`);
                assert.ok(CATEGORY_IDS.includes(q.category), `فئة صالحة: ${q.answer}`);
            }
        }
    });

    test('كل أيقونة مذكورة موجودة في الـsprite وكملف منفصل', () => {
        for (const q of allQuestions()) {
            for (const icon of q.icons) {
                assert.ok(spriteIds.has(icon), `مفقودة من الـsprite: ${icon} (${q.answer})`);
                assert.ok(
                    fs.existsSync(path.join(ROOT, 'assets/images', `${icon}.svg`)),
                    `ملف مفقود (بديل <img>): ${icon}.svg`
                );
            }
        }
    });

    test('لا توجد إجابات مكررة', () => {
        const seen = new Map();
        for (const q of allQuestions()) {
            const key = normalizeArabic(q.answer);
            assert.ok(!seen.has(key), `تكرار: "${q.answer}" مع "${seen.get(key)}"`);
            seen.set(key, q.answer);
        }
    });

    /**
     * إجابتان تقبل إحداهما الأخرى تعني أن اللاعب قد يجيب على اللغز الخطأ.
     * هذا الفحص هو ما كان سيمنع «اسأل مجرب ولا تسأل طبيب/حكيم» من التعايش.
     */
    test('لا تتصادم أي إجابتين عبر المطابق', () => {
        const all = allQuestions();
        const collisions = [];
        for (let i = 0; i < all.length; i++) {
            for (let j = i + 1; j < all.length; j++) {
                if (checkAnswer(all[i].answer, all[j].answer) ||
                    checkAnswer(all[j].answer, all[i].answer)) {
                    collisions.push(`"${all[i].answer}" ⇄ "${all[j].answer}"`);
                }
            }
        }
        assert.deepEqual(collisions, [], `تصادمات:\n${collisions.join('\n')}`);
    });

    test('لا يكشف التلميح الثالث كلمات الإجابة', () => {
        const leaks = [];
        for (const q of allQuestions()) {
            const answerWords = new Set(
                normalizeArabic(q.answer).split(' ').filter(w => w.length > 3)
            );
            const hintWords = normalizeArabic(q.hints[2]).split(' ').filter(w => w.length > 3);
            const shared = hintWords.filter(h => [...answerWords].some(a => a.includes(h) || h.includes(a)));
            if (shared.length >= 2) leaks.push(`${q.answer} → ${q.hints[2]}`);
        }
        assert.deepEqual(leaks, [], `تلميحات كاشفة:\n${leaks.join('\n')}`);
    });
});

describe('توفّر الفئات', () => {
    test('كل فئة صالحة للعب على كل صعوبة', () => {
        // الفئة غير الصالحة كانت تعود بصمت إلى المجموعة الكاملة فيحصل اللاعب
        // على غير ما اختار
        const gaps = [];
        for (const diff of DIFFICULTIES) {
            for (const cat of CATEGORY_IDS) {
                if (!isCategoryPlayable(diff, cat)) {
                    gaps.push(`${diff}/${cat} = ${countFor(diff, cat)} (الحد ${MIN_POOL})`);
                }
            }
        }
        assert.deepEqual(gaps, [], `فئات غير صالحة:\n${gaps.join('\n')}`);
    });

    test('filterByCategory يرجّع الفئة المطلوبة فقط', () => {
        const out = filterByCategory(questionsDB.hard, 'poetry');
        assert.ok(out.length > 0);
        assert.ok(out.every(q => q.category === 'poetry'));
    });

    test('"all" يرجّع كل شيء', () => {
        assert.equal(filterByCategory(questionsDB.easy, 'all').length, questionsDB.easy.length);
    });
});
