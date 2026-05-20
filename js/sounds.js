const sounds = {};
let soundEnabled = true;

const soundFiles = {
    correct: 'assets/sounds/correct.mp3',
    wrong: 'assets/sounds/wrong.mp3',
    hint: 'assets/sounds/hint.mp3',
    levelup: 'assets/sounds/levelup.mp3',
    gameover: 'assets/sounds/gameover.mp3',
    highscore: 'assets/sounds/highscore.mp3',
    click: 'assets/sounds/click.mp3',
    start: 'assets/sounds/start.mp3'
};

export function loadSounds() {
    for (const [key, path] of Object.entries(soundFiles)) {
        sounds[key] = new Audio(path);
        sounds[key].preload = 'auto';
    }
    const stored = localStorage.getItem('emojiCharades_soundEnabled');
    if (stored !== null) soundEnabled = stored === 'true';
}

export function playSound(soundName) {
    if (soundEnabled && sounds[soundName]) {
        sounds[soundName].currentTime = 0;
        sounds[soundName].play().catch(() => {});
    }
}

export function isSoundEnabled() {
    return soundEnabled;
}

export function setSoundEnabled(enabled) {
    soundEnabled = enabled;
    localStorage.setItem('emojiCharades_soundEnabled', enabled);
}

export function toggleSound() {
    setSoundEnabled(!soundEnabled);
    return soundEnabled;
}
