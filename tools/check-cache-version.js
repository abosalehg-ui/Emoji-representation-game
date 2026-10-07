/**
 * يتحقق أن CACHE_NAME في sw.js تغيّر كلما تغيّر أصل يُنشر.
 *
 * sw.js يخدم JS و CSS والأصول من المخزن أولاً، والتنقل من الشبكة أولاً. فلو
 * عُدّل game.js دون رفع CACHE_NAME يحصل اللاعب العائد على index.html جديد
 * فوق JS قديم — خلط إصدارين لا يظهر في أي اختبار. كان رفع الرقم يعتمد على
 * الذاكرة وحدها.
 *
 * الاستعمال: node tools/check-cache-version.js <base-ref>
 */
import { execFileSync } from 'node:child_process';

const DEPLOYED = [/^assets\//, /^css\//, /^js\//, /^index\.html$/, /^manifest\.json$/];

const base = process.argv[2];
if (!base) {
    console.error('الاستعمال: node tools/check-cache-version.js <base-ref>');
    process.exit(2);
}

const git = (...args) => execFileSync('git', args, { encoding: 'utf8' });

try {
    git('rev-parse', '--verify', '--quiet', `${base}^{commit}`);
} catch {
    // دفعة أولى لفرع جديد أو تاريخ ناقص: لا أساس نقارن به
    console.log(`لا يوجد أساس ${base} — تخطّي الفحص`);
    process.exit(0);
}

const changed = git('diff', '--name-only', base, 'HEAD')
    .split('\n')
    .filter(f => DEPLOYED.some(re => re.test(f)));

if (changed.length === 0) {
    console.log('لا أصول منشورة تغيّرت — لا حاجة لرفع CACHE_NAME');
    process.exit(0);
}

const cacheName = (src) => /const CACHE_NAME = '([^']+)'/.exec(src)?.[1] ?? null;
let before = null;
try {
    before = cacheName(git('show', `${base}:sw.js`));
} catch {
    /* sw.js لم يكن موجوداً في الأساس */
}
const after = cacheName(git('show', 'HEAD:sw.js'));

if (before && before === after) {
    console.error(`::error file=sw.js::تغيّرت أصول منشورة و CACHE_NAME ما زال '${after}' — ارفعه.`);
    console.error(changed.map(f => `  - ${f}`).join('\n'));
    process.exit(1);
}

console.log(`CACHE_NAME: '${before}' → '${after}' (${changed.length} أصلاً تغيّر)`);
