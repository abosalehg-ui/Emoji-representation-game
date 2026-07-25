/**
 * تحميل وعرض الأيقونات.
 *
 * كانت الأيقونات تُعرض عبر <img src="x.svg">، وهذا يجعل كل ملف مستنداً منفصلاً
 * لا يرث currentColor من الصفحة — فتتحول كل الأيقونات إلى الأسود وتصبح قواعد
 * color: في CSS بلا أثر (أيقونة شاشة النهاية كانت سوداء على خلفية سوداء في
 * الوضع الليلي، وأيقونة اللهب برتقالية على شارة برتقالية).
 *
 * الحل: sprite واحد يُحقن في المستند، ثم <use href="#i-name">. عندها يعمل
 * currentColor طبيعياً، وينخفض عدد الطلبات من 204 إلى 1.
 *
 * ملاحظة توافق: الإشارة إلى ملف خارجي عبر <use href="file.svg#id"> غير مدعومة
 * في WebKit، لذا نجلب الـsprite ونحقنه في DOM بدل الإشارة إليه — يعمل في كل
 * المتصفحات بما فيها Safari على iOS.
 */

const SPRITE_URL = 'assets/sprite.svg';
let spriteReady = false;

/**
 * يجلب الـsprite ويحقنه. عند الفشل نبقى على <img> كبديل حتى لا تصبح اللعبة
 * بلا أيقونات إطلاقاً — الملفات المنفردة ما زالت في المستودع.
 */
export async function loadSprite() {
    if (spriteReady) return true;
    try {
        const res = await fetch(SPRITE_URL, { cache: 'force-cache' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const text = await res.text();
        if (!text.includes('<symbol')) throw new Error('sprite غير صالح');

        const holder = document.createElement('div');
        holder.setAttribute('aria-hidden', 'true');
        holder.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
        holder.innerHTML = text;
        document.body.prepend(holder);
        spriteReady = true;

        // عناصر <use> المكتوبة في HTML أُنشئت قبل وصول الـsprite. إعادة كتابة
        // href تجبر المتصفح على إعادة الربط — بعض محركات WebKit لا تحدّث
        // المرجع تلقائياً حين يُضاف الهدف لاحقاً.
        document.querySelectorAll('use[href^="#i-"]').forEach(u => {
            const href = u.getAttribute('href');
            u.setAttribute('href', href);
        });
        return true;
    } catch {
        spriteReady = false;
        fallbackStaticIcons();
        return false;
    }
}

/**
 * بديل عند تعذّر تحميل الـsprite: نحوّل كل <svg><use href="#i-x"> المكتوبة في
 * HTML إلى <img src="assets/images/x.svg">. الملفات المنفردة ما زالت في
 * المستودع، فلا تبقى الواجهة بلا أيقونات إطلاقاً.
 */
function fallbackStaticIcons() {
    document.querySelectorAll('use[href^="#i-"]').forEach(use => {
        const svg = use.closest('svg');
        if (!svg) return;
        const name = use.getAttribute('href').slice(3);
        const img = document.createElement('img');
        img.src = `assets/images/${name}.svg`;
        img.className = `${svg.getAttribute('class') || ''} icon-img`.trim();
        img.alt = svg.getAttribute('aria-label') || '';
        if (!img.alt) img.setAttribute('aria-hidden', 'true');
        img.decoding = 'async';
        svg.replaceWith(img);
    });
}

export function isSpriteReady() {
    return spriteReady;
}

/**
 * يبني وسم أيقونة.
 * @param {string} name   اسم الأيقونة بدون الامتداد
 * @param {string} cls    أصناف CSS
 * @param {string} label  نص لقارئ الشاشة؛ الفراغ يعني أيقونة زخرفية
 */
export function iconMarkup(name, cls = 'icon', label = '') {
    const a11y = label
        ? `role="img" aria-label="${escapeAttr(label)}"`
        : 'aria-hidden="true" focusable="false"';

    if (spriteReady) {
        return `<svg class="${cls}" ${a11y}><use href="#i-${name}"></use></svg>`;
    }
    return `<img src="assets/images/${name}.svg" class="${cls} icon-img" alt="${escapeAttr(label)}" ${label ? '' : 'aria-hidden="true"'} decoding="async">`;
}

/** يستبدل محتوى عنصر بأيقونة واحدة. */
export function setIcon(el, name, cls = 'icon', label = '') {
    if (!el) return;
    el.innerHTML = iconMarkup(name, cls, label);
}

function escapeAttr(s) {
    return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

/**
 * يحمّل أيقونات لغز مسبقاً.
 * بلا sprite تكون هذه طلبات شبكة حقيقية؛ مع sprite لا عمل مطلوب أصلاً.
 */
export function preloadIcons(names) {
    if (spriteReady || !Array.isArray(names)) return;
    names.forEach(n => { new Image().src = `assets/images/${n}.svg`; });
}
