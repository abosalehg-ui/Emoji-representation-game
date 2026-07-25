/**
 * تعريف تفاعلي يظهر مرة واحدة عند أول زيارة.
 *
 * كان اللاعب يواجه ستة قرارات (نمط، صعوبة، فئة، مؤقت، صوت، مظهر) قبل أن يرى
 * لغزاً واحداً — وهو لا يعرف بعد ما آلية اللعبة أصلاً. هنا يحلّ لغزاً واحداً
 * سهلاً ومضموناً أولاً، فيتعلّم الآلية بالممارسة لا بالقراءة.
 */

import { checkAnswer } from './arabic.js';
import { playSound } from './sounds.js';
import { elements, showScreen, renderPuzzle } from './ui.js';
import { markIntroSeen } from './state.js';

/** لغز ثابت مختار ليكون أوضح ما في اللعبة. */
const INTRO_PUZZLE = {
    icons: ['apple', 'tree'],
    answer: 'التفاحة لا تسقط بعيداً عن الشجرة',
    hint: 'مثل يقال عن الشبه بين الأبناء وآبائهم'
};

let onDone = null;
let attempts = 0;

export function showIntro(done) {
    onDone = done;
    attempts = 0;

    if (!elements.introScreen) {
        finish();
        return;
    }

    if (elements.introPuzzle) {
        elements.introPuzzle.innerHTML = '';
        const saved = elements.emojiDisplay;
        // نعيد استخدام نفس دالة الرسم لضمان تطابق المظهر مع اللعب الفعلي
        elements.emojiDisplay = elements.introPuzzle;
        renderPuzzle(INTRO_PUZZLE.icons);
        elements.emojiDisplay = saved;
    }

    setFeedback('اكتب المثل الذي تدل عليه الصورتان', '');
    if (elements.introInput) {
        elements.introInput.value = '';
        elements.introInput.disabled = false;
    }
    if (elements.introHint) elements.introHint.hidden = true;

    showScreen('introScreen');
    elements.introInput?.focus({ preventScroll: true });
}

function setFeedback(text, kind) {
    if (!elements.introFeedback) return;
    elements.introFeedback.textContent = text;
    elements.introFeedback.className = `intro-feedback ${kind}`;
}

export function submitIntro() {
    const value = elements.introInput?.value.trim();
    if (!value) return;

    if (checkAnswer(value, INTRO_PUZZLE.answer)) {
        playSound('correct');
        setFeedback('بالضبط! هكذا تُلعب — اجمع معاني الصور في عبارة واحدة', 'ok');
        if (elements.introInput) elements.introInput.disabled = true;
        setTimeout(finish, 1600);
        return;
    }

    attempts++;
    playSound('wrong');

    if (attempts === 1) {
        setFeedback('ليست بعد. جرّب مرة أخرى — أو استعن بالتلميح', 'bad');
        if (elements.introHint) {
            elements.introHint.textContent = INTRO_PUZZLE.hint;
            elements.introHint.hidden = false;
        }
        return;
    }

    // لا نحبس اللاعب في التعريف: نكشف الإجابة ونمضي
    setFeedback(`الإجابة: ${INTRO_PUZZLE.answer} — لا بأس، هكذا تعمل اللعبة`, 'bad');
    if (elements.introInput) elements.introInput.disabled = true;
    setTimeout(finish, 2400);
}

export function skipIntro() {
    playSound('click');
    finish();
}

function finish() {
    markIntroSeen();
    const cb = onDone;
    onDone = null;
    cb?.();
}
