import { questionsDB } from './questions.js';

export function todayKey() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

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

export function getDailyQuestions(count = 10) {
    const seed = hashSeed(todayKey());
    const all = [
        ...questionsDB.easy.map(q => ({ ...q, _diff: 'easy' })),
        ...questionsDB.medium.map(q => ({ ...q, _diff: 'medium' })),
        ...questionsDB.hard.map(q => ({ ...q, _diff: 'hard' }))
    ];
    const shuffled = [...all];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(seed() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const mix = [];
    const easyPool = shuffled.filter(q => q._diff === 'easy').slice(0, 4);
    const medPool = shuffled.filter(q => q._diff === 'medium').slice(0, 4);
    const hardPool = shuffled.filter(q => q._diff === 'hard').slice(0, 2);
    mix.push(...easyPool, ...medPool, ...hardPool);
    return mix.slice(0, count);
}
