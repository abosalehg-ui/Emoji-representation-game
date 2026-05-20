export function normalizeArabic(text) {
    return text
        .replace(/[أإآا]/g, 'ا')
        .replace(/[ىي]/g, 'ي')
        .replace(/ة/g, 'ه')
        .replace(/[^؀-ۿ\s]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

export function checkAnswer(userAnswer, correctAnswer) {
    const normalizedUser = normalizeArabic(userAnswer.toLowerCase());
    const normalizedCorrect = normalizeArabic(correctAnswer.toLowerCase());

    if (normalizedUser === normalizedCorrect) return true;

    const words1 = normalizedUser.split(' ').filter(w => w.length > 2);
    const words2 = normalizedCorrect.split(' ').filter(w => w.length > 2);

    if (words2.length === 0) return false;

    let matchCount = 0;
    for (const word of words1) {
        if (words2.some(w => w.includes(word) || word.includes(w))) {
            matchCount++;
        }
    }

    const matchRatio = matchCount / words2.length;
    return matchRatio >= 0.6;
}
