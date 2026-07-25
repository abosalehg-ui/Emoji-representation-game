import { allQuestions } from './questions.js';

export function todayKey() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

/** مولّد أرقام شبه عشوائي ببذرة ثابتة — نفس اليوم يعطي نفس الأسئلة لكل اللاعبين. */
function hashSeed(str) {
    let h = 1779033703 ^ str.length;
    for (let i = 0; i < str.length; i++) {
        h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
        h = (h << 13) | (h >>> 19);
    }
    return () => {
        h = Math.imul(h ^ (h >>> 16), 2246822507);
        h = Math.imul(h ^ (h >>> 13), 3266489909);
        h ^= h >>> 16;
        return (h >>> 0) / 4294967296;
    };
}

function seededShuffle(arr, rand) {
    const out = [...arr];
    for (let i = out.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
}

/** خليط ثابت لليوم: 4 سهلة، 4 متوسطة، 2 صعبة — بمنحنى صاعد. */
export function getDailyQuestions(count = 10) {
    const rand = hashSeed(todayKey());
    const shuffled = seededShuffle(allQuestions(), rand);

    const take = (diff, n) => shuffled.filter(q => q._diff === diff).slice(0, n);
    const mix = [...take('easy', 4), ...take('medium', 4), ...take('hard', 2)];

    return mix.slice(0, count);
}
