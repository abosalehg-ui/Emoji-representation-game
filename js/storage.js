/**
 * محوِّل آمن حول localStorage.
 *
 * الوصول المباشر إلى localStorage يرمي استثناءً في Safari الخاص، وفي بعض
 * الـ WebViews المضمّنة، ومع إعدادات كوكيز صارمة. وبما أن الحالة كانت تُقرأ
 * وقت تحميل الوحدة، كان الاستثناء يمنع تحميل الوحدة كلها فتظهر شاشة بيضاء.
 * هنا نتحمّل الفشل ونرجع إلى خريطة في الذاكرة تعمل للجلسة الحالية.
 */

const memory = new Map();
let usable = null;

function probe() {
    if (usable !== null) return usable;
    try {
        const k = '__probe__';
        localStorage.setItem(k, '1');
        localStorage.removeItem(k);
        usable = true;
    } catch {
        usable = false;
    }
    return usable;
}

/** هل التخزين الدائم متاح؟ تستخدمه الواجهة لتنبيه اللاعب أن التقدّم لن يُحفظ. */
export function isPersistent() {
    return probe();
}

export function getItem(key) {
    if (probe()) {
        try {
            return localStorage.getItem(key);
        } catch {
            /* يسقط إلى الذاكرة */
        }
    }
    return memory.has(key) ? memory.get(key) : null;
}

export function setItem(key, value) {
    const v = String(value);
    memory.set(key, v);
    if (!probe()) return false;
    try {
        localStorage.setItem(key, v);
        return true;
    } catch {
        // ممتلئ أو محجوب — الذاكرة تكفي للجلسة الحالية
        return false;
    }
}

export function removeItem(key) {
    memory.delete(key);
    if (!probe()) return;
    try {
        localStorage.removeItem(key);
    } catch {
        /* تُتجاهل */
    }
}

/** قراءة JSON مع تحقق. يعيد null ويُنظّف المفتاح عند أي فساد. */
export function getJSON(key, validate) {
    const raw = getItem(key);
    if (!raw) return null;
    let parsed;
    try {
        parsed = JSON.parse(raw);
    } catch {
        removeItem(key);
        return null;
    }
    if (typeof validate === 'function' && !validate(parsed)) {
        removeItem(key);
        return null;
    }
    return parsed;
}

export function setJSON(key, value) {
    try {
        return setItem(key, JSON.stringify(value));
    } catch {
        return false;
    }
}
