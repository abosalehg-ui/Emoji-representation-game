/**
 * دفتر الأمثال — سجل دائم للألغاز التي حلّها اللاعب.
 *
 * كان الوحيد الباقي بين الجلسات هو الرقم القياسي، فلا سبب للعودة بعد إتقان
 * المحتوى. الدفتر يحوّل الـ143 لغزاً إلى هدف طويل المدى مرئي وقابل للتتبع.
 *
 * نخزّن بصمة مختصرة للإجابة لا نصها: حتى لا يستطيع اللاعب قراءة الإجابات
 * مباشرةً من localStorage، ولأن البصمة ثابتة مهما تغيّر ترتيب الأسئلة.
 */

import { getJSON, setJSON } from './storage.js';
import { normalizeArabic } from './arabic.js';
import { allQuestions } from './questions.js';

const KEY = 'emojiCharades_journal';

/** بصمة FNV-1a قصيرة وثابتة عبر الجلسات. */
export function questionKey(answer) {
    const s = normalizeArabic(answer);
    let h = 0x811c9dc5;
    for (let i = 0; i < s.length; i++) {
        h ^= s.charCodeAt(i);
        h = Math.imul(h, 0x01000193);
    }
    return (h >>> 0).toString(36);
}

const isValid = v => Array.isArray(v) && v.every(x => typeof x === 'string');

let solved = null;

function load() {
    if (solved) return solved;
    solved = new Set(getJSON(KEY, isValid) || []);
    return solved;
}

/** يسجّل لغزاً محلولاً. يعيد true إن كان اكتشافاً جديداً. */
export function markSolved(answer) {
    const set = load();
    const k = questionKey(answer);
    if (set.has(k)) return false;
    set.add(k);
    setJSON(KEY, [...set]);
    return true;
}

export function isSolved(answer) {
    return load().has(questionKey(answer));
}

export function solvedCount() {
    return load().size;
}

/** حالة كل الألغاز للعرض في الدفتر — بلا كشف الإجابات غير المحلولة. */
export function journalEntries() {
    const set = load();
    return allQuestions().map(q => {
        const unlocked = set.has(questionKey(q.answer));
        return {
            unlocked,
            difficulty: q._diff,
            category: q.category,
            answer: unlocked ? q.answer : null,
            icons: unlocked ? q.icons : null
        };
    });
}

export function resetJournal() {
    solved = new Set();
    setJSON(KEY, []);
}
