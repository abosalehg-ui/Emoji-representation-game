import { getItem, setItem } from './storage.js';

const KEY_ENABLED = 'emojiCharades_soundEnabled';
const KEY_VOLUME  = 'emojiCharades_volume';

const sounds = {};
let soundEnabled = true;

/** الافتراضي أقل من الأقصى: النقر بمستوى كامل مزعج مع التكرار. */
let volume = 0.6;
let warmed = false;

const soundFiles = {
    correct:   'assets/sounds/correct.mp3',
    wrong:     'assets/sounds/wrong.mp3',
    hint:      'assets/sounds/hint.mp3',
    levelup:   'assets/sounds/levelup.mp3',
    gameover:  'assets/sounds/gameover.mp3',
    highscore: 'assets/sounds/highscore.mp3',
    click:     'assets/sounds/click.mp3',
    start:     'assets/sounds/start.mp3'
};

/** بعض الأصوات أخفت من غيرها بطبيعتها. */
const RELATIVE = { click: 0.45, hint: 0.7 };

/**
 * الأصوات الصغيرة فقط تُجلب في مسار الإقلاع.
 *
 * كانت الثمانية كلها تُنشأ بـ preload='auto' في أول سطور boot()، أي 346 كيلوبايت
 * — 57% من 610KB في أول تحميل — تُجلب قبل أن يرى اللاعب لغزاً واحداً، مقابل
 * أصوات قد لا يشغّل أياً منها. هذان الاثنان معاً 16 كيلوبايت.
 *
 * ملاحظة: wrong.mp3 وحده 105 كيلوبايت و hint.mp3 وحده 81، لأن الملفات مُرمَّزة
 * كلها بـ256–320 kbps ستيريو — وهي جودة ألبوم موسيقي لنغمات واجهة مدّتها ثوانٍ.
 * إعادة ترميزها إلى 64 kbps أحادي تختصرها إلى السدس تقريباً، وهي خطوة تحتاج
 * أداة ترميز (ffmpeg/lame) لا يغنّي عنها الكود.
 */
const EAGER = new Set(['click', 'correct']);

function ensureAudio(name, preload) {
    const path = soundFiles[name];
    if (!path) return null;

    let audio = sounds[name];
    if (!audio) {
        audio = new Audio(path);
        audio.volume = clamp(volume * (RELATIVE[name] ?? 1));
        sounds[name] = audio;
    }
    if (preload) audio.preload = preload;
    return audio;
}

/**
 * تُجهَّز بقية الأصوات عند بدء اللعب، لا عند الإقلاع.
 *
 * تحميلها كسولاً بالكامل يعني أن أول إجابة خاطئة قد تمر بلا صوت بينما تُجلب
 * الـ105 كيلوبايت. وتحميلها في الإقلاع — أو تسخينها بـrequestIdleCallback الذي
 * يُطلَق فور انتهاء boot — يزاحم الـsprite والخطوط على عرض النطاق في اللحظة
 * الوحيدة التي ينتظر فيها اللاعب.
 *
 * ربطها بـstartGame يعطي النافذة الطبيعية: اللاعب يحدّق في أول لغز بينما تُجلب.
 */
export function warmSounds() {
    if (!soundEnabled || warmed) return;
    warmed = true;
    Object.keys(soundFiles)
        .filter(name => !EAGER.has(name))
        .forEach(name => ensureAudio(name, 'auto'));
}

export function loadSounds() {
    const storedEnabled = getItem(KEY_ENABLED);
    if (storedEnabled !== null) soundEnabled = storedEnabled === 'true';

    const storedVolume = parseFloat(getItem(KEY_VOLUME));
    if (Number.isFinite(storedVolume)) volume = clamp(storedVolume);

    // الصوت مكتوم؟ لا تُجلب ولا نغمة واحدة.
    if (!soundEnabled) return;
    EAGER.forEach(name => ensureAudio(name, 'auto'));
}

function clamp(v) {
    return Math.max(0, Math.min(1, v));
}

function applyVolume() {
    for (const [key, audio] of Object.entries(sounds)) {
        audio.volume = clamp(volume * (RELATIVE[key] ?? 1));
    }
}

export function playSound(name) {
    if (!soundEnabled || volume === 0) return;
    // يُنشئ العنصر عند أول طلب إن لم يكن التسخين قد سبقه
    const audio = ensureAudio(name, 'auto');
    if (!audio) return;
    try {
        audio.currentTime = 0;
        audio.play().catch(() => {});
    } catch {
        /* الوسائط غير جاهزة بعد */
    }
}

export function isSoundEnabled() {
    return soundEnabled;
}

export function setSoundEnabled(enabled) {
    soundEnabled = enabled;
    setItem(KEY_ENABLED, enabled);
    // من أقلع مكتوماً ثم شغّل الصوت لم تُنشأ له أي عناصر بعد
    if (enabled) EAGER.forEach(name => ensureAudio(name, 'auto'));
}

export function toggleSound() {
    setSoundEnabled(!soundEnabled);
    return soundEnabled;
}

export function getVolume() {
    return volume;
}

export function setVolume(v) {
    volume = clamp(v);
    setItem(KEY_VOLUME, volume);
    applyVolume();
    return volume;
}
