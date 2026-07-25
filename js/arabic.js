/**
 * التشكيل والتطويل — تُحذف قبل أي مقارنة.
 *
 * كُتبت النطاقات برموز \u الهروبية عمداً: كتابتها كمحارف عربية مباشرة تجعل
 * النطاق يبتلع الأرقام العربية U+0660-U+0669 بالخطأ، كما أن إعادة الترتيب
 * ثنائية الاتجاه تجعل مراجعة الكود شبه مستحيلة.
 *
 *   U+064B-U+065F  علامات التشكيل (الفتحتان .. الحركات المركّبة)
 *   U+0670         الألف الخنجرية
 *   U+06D6-U+06ED  علامات المصحف
 *   U+0640         التطويل
 */
const DIACRITICS = /[ً-ٰٟۖ-ۭـ]/g;

/** كل ما ليس حرف هجاء عربياً أو مسافة. */
const NON_ARABIC = /[^ء-غف-ي\s]/g;

/**
 * يوحّد النص العربي قبل المقارنة.
 *
 * ترتيب الخطوات مقصود: التشكيل يُحذف أولاً، وإلا بقيت الشدّة والتنوين داخل
 * الكلمات فتفشل المطابقة على إجابات صحيحة تماماً مثل «من بكّر طار».
 */
export function normalizeArabic(text) {
    return String(text ?? '')
        .replace(DIACRITICS, '')
        .replace(/[أإآٱا]/g, 'ا')  // أ إ آ ٱ ا  ->  ا
        .replace(/[ىي]/g, 'ي')                    // ى ي        ->  ي
        .replace(/[ؤئء]/g, 'ء')              // ؤ ئ ء      ->  ء
        .replace(/ة/g, 'ه')                            // ة          ->  ه
        .replace(NON_ARABIC, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

/** كلمات ربط شائعة لا تحمل معنى مميزاً، تُستبعد من المقارنة. */
const STOP_WORDS = new Set([
    'من',           // من
    'عن',           // عن
    'في',           // في
    'الي',     // الى (بعد التوحيد)
    'علي',     // على
    'ولا',     // ولا
    'الا',     // الا
    'ما',           // ما
    'لا',           // لا
    'ان',           // ان
    'اذا',     // اذا
    'مع',           // مع
    'او'            // او
]);

function contentWords(normalized) {
    return normalized
        .split(' ')
        .filter(w => w.length > 2 && !STOP_WORDS.has(w));
}

/** تطابق تقريبي على مستوى الكلمة: أحدهما يحتوي الآخر (يغطي أل التعريف واللواحق). */
function wordsMatch(a, b) {
    if (a === b) return true;
    const [short, long] = a.length <= b.length ? [a, b] : [b, a];
    return short.length >= 3 && long.includes(short);
}

/**
 * يقارن إجابة اللاعب بالإجابة الصحيحة.
 *
 * يقيس بُعدين معاً:
 *   - التغطية (coverage): كم من كلمات الإجابة الصحيحة ذكرها اللاعب.
 *   - الدقة (precision):  كم من كلمات اللاعب كانت في محلها.
 *
 * التغطية وحدها لا تكفي: النسخة السابقة كانت تعدّ كلمات اللاعب وتقسمها على عدد
 * كلمات الإجابة، فكان تكرار كلمة صحيحة واحدة («الماء الماء الماء») يرفع النسبة
 * فوق العتبة ويُقبل. إزالة التكرار + شرط الدقة يغلقان ذلك.
 */
export function checkAnswer(userAnswer, correctAnswer) {
    const user = normalizeArabic(userAnswer);
    const correct = normalizeArabic(correctAnswer);

    if (!user) return false;
    if (user === correct) return true;

    const userWords = [...new Set(contentWords(user))];
    const correctWords = [...new Set(contentWords(correct))];

    if (correctWords.length === 0 || userWords.length === 0) return user === correct;

    const matchedCorrect = correctWords.filter(c => userWords.some(u => wordsMatch(u, c)));
    const matchedUser = userWords.filter(u => correctWords.some(c => wordsMatch(u, c)));

    const coverage = matchedCorrect.length / correctWords.length;
    const precision = matchedUser.length / userWords.length;

    // إجابات قصيرة (كلمة أو كلمتان بعد التصفية) تحتاج تغطية كاملة —
    // أي تسامح فيها يقبل نصف الإجابة.
    if (correctWords.length <= 2) return coverage === 1 && precision >= 0.5;

    return coverage >= 0.7 && precision >= 0.6;
}
