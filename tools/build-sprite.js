#!/usr/bin/env node
/**
 * يبني assets/sprite.svg من كل ملفات assets/images/*.svg
 *
 * لماذا sprite بدل <img src="x.svg">؟
 * ملف SVG المحمّل عبر <img> هو مستند منفصل، فلا يرث currentColor من الصفحة —
 * يتحول إلى أسود دائماً، وكل قواعد color: في CSS تصبح بلا أثر. مع <use> داخل
 * نفس المستند يعمل currentColor طبيعياً، فيختفي الحاجة لحيل invert() في الوضع
 * الليلي، ويقل عدد الطلبات من 204 إلى 1.
 *
 * التشغيل: node tools/build-sprite.js
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(here, '..', 'assets', 'images');
const OUT = path.join(here, '..', 'assets', 'sprite.svg');

/**
 * أيقونات كانت تحمل ألواناً مثبتة تمنع التحكم بها من CSS.
 * نحولها إلى currentColor ليتولى CSS تلوينها (يصلح تباين شارة السلسلة،
 * وتوحيد ألوان القلوب، ووضوح الشعار في الوضع الليلي).
 */
const FORCE_CURRENT_COLOR = new Set([
    'fire-orange', 'heart-red', 'heart-gray'
]);

/** الشعار متعدد الألوان عمداً — نحوّل الحد فقط ليظهر في الوضع الليلي. */
const STROKE_ONLY_CURRENT_COLOR = new Set(['logo-color']);

function attr(svg, name) {
    const m = svg.match(new RegExp(`\\s${name}="([^"]*)"`));
    return m ? m[1] : null;
}

function build() {
    const files = fs.readdirSync(SRC).filter(f => f.endsWith('.svg')).sort();
    const symbols = [];

    for (const file of files) {
        const id = file.replace(/\.svg$/, '');
        const raw = fs.readFileSync(path.join(SRC, file), 'utf8');

        const open = raw.match(/<svg[^>]*>/);
        if (!open) {
            console.warn(`تخطي ${file}: لا يوجد وسم <svg>`);
            continue;
        }

        let inner = raw.slice(open.index + open[0].length).replace(/<\/svg>\s*$/, '').trim();

        // <title> داخل <symbol> يُقرأ من قارئات الشاشة عند الاستخدام المباشر،
        // لكن أيقونات الألغاز يجب ألا تُنطق (تكشف الإجابة). نزيلها هنا
        // ونترك التسمية لسمة aria على موضع الاستخدام.
        inner = inner.replace(/<title>[\s\S]*?<\/title>/g, '').trim();

        let stroke = attr(open[0], 'stroke') || 'currentColor';
        let fill = attr(open[0], 'fill') || 'none';
        const strokeWidth = attr(open[0], 'stroke-width') || '2';
        const viewBox = attr(open[0], 'viewBox') || '0 0 24 24';

        if (FORCE_CURRENT_COLOR.has(id)) {
            stroke = 'currentColor';
            fill = fill === 'none' ? 'none' : 'currentColor';
            inner = inner
                .replace(/fill="#[0-9A-Fa-f]{3,8}"/g, 'fill="currentColor"')
                .replace(/stroke="#[0-9A-Fa-f]{3,8}"/g, 'stroke="currentColor"');
        } else if (STROKE_ONLY_CURRENT_COLOR.has(id)) {
            stroke = 'currentColor';
            inner = inner.replace(/stroke="#[0-9A-Fa-f]{3,8}"/g, 'stroke="currentColor"');
        }

        symbols.push(
            `<symbol id="i-${id}" viewBox="${viewBox}" fill="${fill}" stroke="${stroke}" ` +
            `stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">` +
            `${inner}</symbol>`
        );
    }

    const sprite =
        `<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true">\n` +
        symbols.join('\n') +
        `\n</svg>\n`;

    fs.writeFileSync(OUT, sprite);
    const kb = (Buffer.byteLength(sprite) / 1024).toFixed(1);
    console.log(`تم بناء assets/sprite.svg — ${symbols.length} أيقونة، ${kb}KB`);
}

build();
