import { getItem, setItem } from './storage.js';

const KEY_ENABLED = 'emojiCharades_soundEnabled';
const KEY_VOLUME  = 'emojiCharades_volume';

const sounds = {};
let soundEnabled = true;

/** الافتراضي أقل من الأقصى: النقر بمستوى كامل مزعج مع التكرار. */
let volume = 0.6;

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

export function loadSounds() {
    const storedEnabled = getItem(KEY_ENABLED);
    if (storedEnabled !== null) soundEnabled = storedEnabled === 'true';

    const storedVolume = parseFloat(getItem(KEY_VOLUME));
    if (Number.isFinite(storedVolume)) volume = clamp(storedVolume);

    for (const [key, path] of Object.entries(soundFiles)) {
        const audio = new Audio(path);
        audio.preload = 'auto';
        sounds[key] = audio;
    }
    applyVolume();
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
    const audio = sounds[name];
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
