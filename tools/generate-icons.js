#!/usr/bin/env node
/*
 * Icon generator for "تحدي الصور".
 * Generates separate SVG files in /assets/images/ from a central definition.
 *
 * Style: Lucide-inspired — viewBox 24x24, stroke="currentColor", fill="none",
 * stroke-width="2", stroke-linecap="round", stroke-linejoin="round".
 *
 * Each icon has an Arabic <title> for accessibility.
 *
 * Many path definitions are adapted from Lucide (ISC license, https://lucide.dev)
 * with custom additions for Arabic/Islamic/Bedouin heritage iconography.
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(__dirname, '..', 'assets', 'images');
mkdirSync(OUT_DIR, { recursive: true });

const HEADER = (titleAr, attrs = {}) => {
  const fill = attrs.fill ?? 'none';
  const stroke = attrs.stroke ?? 'currentColor';
  const sw = attrs.strokeWidth ?? 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="${titleAr}"><title>${titleAr}</title>`;
};
const FOOTER = `</svg>`;

const ICONS = {
  // ===== Animals =====
  'apple': { ar: 'تفاحة', body: `<path d="M12 7c0-3 2-5 5-5-1 3-2 5-5 5z"/><path d="M19 11.5C19 16 16 21 12 21s-7-5-7-9.5C5 8 8 7 10.5 7c1 0 1.5.5 1.5.5s.5-.5 1.5-.5C16 7 19 8 19 11.5z"/>` },
  'tree': { ar: 'شجرة', body: `<path d="M12 2L7 9h3l-4 6h4l-3 4h10l-3-4h4l-4-6h3z"/><path d="M12 19v3"/>` },
  'palm-tree': { ar: 'نخلة', body: `<path d="M12 22V11"/><path d="M12 11c-2-3-6-2-7 1"/><path d="M12 11c2-3 6-2 7 1"/><path d="M12 11c-3-1-5-5-3-8"/><path d="M12 11c3-1 5-5 3-8"/><path d="M12 11c-1-2-4-3-7-2"/><path d="M12 11c1-2 4-3 7-2"/>` },
  'bird': { ar: 'عصفور', body: `<path d="M16 7h.01"/><path d="M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.28-2.3L2 20"/><path d="M20 7l2 .5-2 .5"/><path d="M10 18v3"/><path d="M14 17.75V21"/><path d="M7 18a6 6 0 0 0 3.84-10.61"/>` },
  'falcon': { ar: 'صقر', body: `<path d="M2 12c3-1 5-3 6-6 1 4 4 6 8 6-1 2-3 3-5 3l3 5h-4l-2-3-2 3H2l3-5c-1 0-2-1-3-3z"/><circle cx="9" cy="9" r="0.5" fill="currentColor"/>` },
  'camel': { ar: 'جمل', body: `<path d="M3 18c0-4 3-6 6-6 1 0 2 .3 2.5 1L13 11c.5-2 2-3 4-3 0 0 1 .5 1 2v1c1.5.5 2 2 2 4l-1 5h-2l-1-4-1 4h-2l-.5-3-2 3H8l-1-3-1 3H4l-1-2z"/>` },
  'camel-loaded': { ar: 'جمل محمل', body: `<path d="M3 19c0-4 3-7 6-7 1 0 2 .3 3 1l2-2c1-2 2.5-2.5 4-2 0 0 1 .5 1 2v1c2 .5 2 2 2 4l-1 4h-2l-.5-3-1 3h-2l-1-3-2 3H8l-1-3-1 3H4z"/><rect x="9" y="7" width="6" height="4" rx="0.5"/><line x1="9" y1="9" x2="15" y2="9"/>` },
  'horse': { ar: 'حصان', body: `<path d="M3 19l2-5c1-3 4-5 7-5 2 0 4 1 5 3l3-2v3l-2 1 1 5h-2l-1-3-2 3h-2l-1-3-2 3H6l-1-3-1 3z"/><circle cx="14" cy="11" r="0.5" fill="currentColor"/>` },
  'horse-running': { ar: 'حصان يجري', body: `<path d="M2 18l3-4c2-3 5-4 8-3l3-1-1 3 2 1-1 4-2-1-1 3-2-1-1 3-2-2-2 1-1-2z"/>` },
  'dog': { ar: 'كلب', body: `<path d="M10 5l-2 4h-3l1 3-3 1 2 3v6h4v-3h6v3h4v-6l2-3-3-1 1-3h-3l-2-4z"/><circle cx="9" cy="13" r="0.5" fill="currentColor"/><circle cx="15" cy="13" r="0.5" fill="currentColor"/>` },
  'puppy': { ar: 'جرو', body: `<circle cx="12" cy="13" r="6"/><path d="M8 8l-1-3 3 1"/><path d="M16 8l1-3-3 1"/><circle cx="10" cy="13" r="0.5" fill="currentColor"/><circle cx="14" cy="13" r="0.5" fill="currentColor"/><path d="M11 16h2"/>` },
  'chicken': { ar: 'دجاجة', body: `<path d="M7 20c0-4 2-7 5-7s5 3 5 7"/><circle cx="12" cy="9" r="3"/><path d="M11 6V3M10 4l-2-1M14 4l2-1"/><circle cx="13" cy="9" r="0.5" fill="currentColor"/><path d="M14.5 11h2"/>` },
  'rooster': { ar: 'ديك', body: `<path d="M7 20c0-4 2-7 5-7s5 3 5 7"/><circle cx="12" cy="9" r="3"/><path d="M10 5c-1-1 0-3 1-3M11 4c0-1.5 1-2 2-2M13 5c1-1 2-1 2 0"/><circle cx="13" cy="9" r="0.5" fill="currentColor"/><path d="M14.5 11h2"/>` },
  'egg': { ar: 'بيضة', body: `<path d="M12 3c-3.5 0-6 5-6 9a6 6 0 0 0 12 0c0-4-2.5-9-6-9z"/>` },
  'sheep': { ar: 'خروف', body: `<circle cx="12" cy="12" r="5"/><circle cx="8" cy="9" r="2"/><circle cx="16" cy="9" r="2"/><circle cx="9" cy="14" r="1.5"/><circle cx="15" cy="14" r="1.5"/><path d="M12 17v3M10 19v2M14 19v2"/>` },
  'lion': { ar: 'أسد', body: `<circle cx="12" cy="12" r="4"/><path d="M12 4l-1 3M12 4l1 3M7 7l1.5 2M17 7l-1.5 2M5 12l2 .5M19 12l-2 .5M6 17l2-1M18 17l-2-1M12 20l-1-2M12 20l1-2"/><circle cx="10.5" cy="11.5" r="0.4" fill="currentColor"/><circle cx="13.5" cy="11.5" r="0.4" fill="currentColor"/><path d="M11 13l1 1 1-1"/>` },
  'wolf': { ar: 'ذئب', body: `<path d="M3 14l2-4 3-2h8l3 2 2 4-2 4-3 2H8l-3-2z"/><path d="M5 10l-1-4 3 2M19 10l1-4-3 2"/><circle cx="9.5" cy="13" r="0.5" fill="currentColor"/><circle cx="14.5" cy="13" r="0.5" fill="currentColor"/><path d="M11 16l1 1 1-1"/>` },
  'snake': { ar: 'ثعبان', body: `<path d="M3 6c2 0 2 3 4 3s2-3 4-3 2 3 4 3 2-3 4-3"/><path d="M3 12c2 0 2 3 4 3s2-3 4-3 2 3 4 3 2-3 4-3"/><path d="M3 18c2 0 2 3 4 3"/><circle cx="20" cy="6" r="0.5" fill="currentColor"/>` },
  'turtle': { ar: 'سلحفاة', body: `<ellipse cx="12" cy="13" rx="6" ry="5"/><path d="M12 13l-3-3M12 13l3-3M12 13l-3 3M12 13l3 3"/><circle cx="6" cy="13" r="1.5"/><circle cx="18" cy="13" r="1.5"/><path d="M9 18v2M15 18v2"/><circle cx="12" cy="7" r="2"/>` },
  'elephant': { ar: 'فيل', body: `<path d="M4 18v-6a5 5 0 0 1 5-5h6a5 5 0 0 1 5 5v6"/><path d="M8 18v2M16 18v2"/><circle cx="9" cy="11" r="0.5" fill="currentColor"/><path d="M14 11c1 2 0 5-2 6s-3-1-2-3"/>` },
  'ant': { ar: 'نملة', body: `<circle cx="6" cy="12" r="2"/><circle cx="12" cy="12" r="2.5"/><circle cx="18" cy="12" r="2"/><path d="M3 9l1 3M3 15l1-3M9 6l1 3M9 18l1-3M15 6l-1 3M15 18l-1-3M21 9l-1 3M21 15l-1-3"/>` },
  'fish': { ar: 'سمكة', body: `<path d="M3 12s2-5 9-5 9 5 9 5-2 5-9 5-9-5-9-5z"/><circle cx="16" cy="11" r="0.5" fill="currentColor"/><path d="M21 12l2-2v4z"/>` },
  'fox': { ar: 'ثعلب', body: `<path d="M4 8l3 5 5 5 5-5 3-5-3 1-2-3-3 2-3-2-2 3z"/><circle cx="9.5" cy="11" r="0.4" fill="currentColor"/><circle cx="14.5" cy="11" r="0.4" fill="currentColor"/>` },
  'butterfly': { ar: 'فراشة', body: `<line x1="12" y1="6" x2="12" y2="20"/><path d="M12 8C9 4 4 4 4 9c0 4 4 5 8 5"/><path d="M12 8c3-4 8-4 8 1 0 4-4 5-8 5"/><path d="M12 13c-2 3-6 4-8 1"/><path d="M12 13c2 3 6 4 8 1"/>` },
  'tooth': { ar: 'سن', body: `<path d="M6 4c0-1 1-2 3-2s2 1 3 1 1-1 3-1 3 1 3 2c0 4-1 5-2 7l-1 8h-2l-1-4h-2l-1 4H8l-1-8c-1-2-1-3-1-7z"/>` },
  'oyster': { ar: 'محار', body: `<path d="M3 14c0-5 4-10 9-10s9 5 9 10"/><path d="M3 14c0 3 4 5 9 5s9-2 9-5"/><circle cx="12" cy="13" r="2"/>` },
  'oud-instrument': { ar: 'عود', body: `<ellipse cx="12" cy="14" rx="6" ry="7"/><line x1="9" y1="2" x2="9" y2="9"/><line x1="15" y1="2" x2="15" y2="9"/><line x1="11" y1="3" x2="11" y2="9"/><line x1="13" y1="3" x2="13" y2="9"/><circle cx="12" cy="14" r="2"/>` },

  // ===== Nature =====
  'sunrise': { ar: 'شروق', body: `<path d="M4 18h16"/><path d="M12 4v4"/><path d="M5 11l2 2"/><path d="M19 11l-2 2"/><path d="M3 18l3-3a6 6 0 0 1 12 0l3 3"/><line x1="2" y1="22" x2="22" y2="22"/>` },
  'mountain-sunrise': { ar: 'فجر فوق الجبل', body: `<circle cx="12" cy="9" r="3"/><path d="M3 18l5-6 4 4 3-3 6 5z"/><line x1="2" y1="21" x2="22" y2="21"/>` },
  'sun': { ar: 'شمس', body: `<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M4.9 4.9l1.4 1.4"/><path d="M17.7 17.7l1.4 1.4"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="M4.9 19.1l1.4-1.4"/><path d="M17.7 6.3l1.4-1.4"/>` },
  'moon': { ar: 'هلال', body: `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>` },
  'crescent-moon': { ar: 'هلال', body: `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>` },
  'star': { ar: 'نجمة', body: `<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>` },
  'glowing-star': { ar: 'نجمة لامعة', body: `<polygon points="12 4 14 9.5 20 10 15.5 14 17 20 12 16.5 7 20 8.5 14 4 10 10 9.5 12 4"/><circle cx="20" cy="4" r="0.7" fill="currentColor"/><circle cx="4" cy="6" r="0.5" fill="currentColor"/><circle cx="6" cy="20" r="0.6" fill="currentColor"/>` },
  'rainbow': { ar: 'قوس قزح', body: `<path d="M3 18a9 9 0 0 1 18 0"/><path d="M5 18a7 7 0 0 1 14 0"/><path d="M7 18a5 5 0 0 1 10 0"/><path d="M9 18a3 3 0 0 1 6 0"/>` },
  'umbrella-rain': { ar: 'مطر ومظلة', body: `<path d="M12 2v2"/><path d="M3 12a9 9 0 0 1 18 0z"/><path d="M12 12v6a2 2 0 0 1-4 0"/><path d="M7 17l-1 3M11 17l-1 3M15 17l-1 3M19 17l-1 3"/>` },
  'rain': { ar: 'مطر', body: `<path d="M16 14c2 0 4-2 4-4s-2-4-4-4c-.5-2-2-3-4-3-3 0-5 2-5 5"/><path d="M3 11c0-1 1-2 3-2 0-2 2-3 4-3"/><line x1="8" y1="17" x2="6" y2="22"/><line x1="13" y1="17" x2="11" y2="22"/><line x1="18" y1="17" x2="16" y2="22"/>` },
  'cloud': { ar: 'سحابة', body: `<path d="M17.5 19a4.5 4.5 0 1 0-2-8.4A6 6 0 1 0 6 17h11.5z"/>` },
  'wave': { ar: 'موج', body: `<path d="M2 12c2-2 4-2 5 0s3 2 5 0 4-2 5 0 3 2 5 0"/><path d="M2 17c2-2 4-2 5 0s3 2 5 0 4-2 5 0 3 2 5 0"/><path d="M2 7c2-2 4-2 5 0s3 2 5 0 4-2 5 0 3 2 5 0"/>` },
  'sea': { ar: 'بحر', body: `<path d="M2 14c2-2 4-2 5 0s3 2 5 0 4-2 5 0 3 2 5 0"/><path d="M2 18c2-2 4-2 5 0s3 2 5 0 4-2 5 0 3 2 5 0"/><path d="M2 10c2-2 4-2 5 0s3 2 5 0 4-2 5 0 3 2 5 0"/>` },
  'water-drop': { ar: 'قطرة ماء', body: `<path d="M12 2.5l5 6a7 7 0 1 1-10 0z"/>` },
  'fire': { ar: 'نار', body: `<path d="M8 14a4 4 0 0 0 8 0c0-3-3-3-3-7 0-3-2-4-2-4S9 5 9 8c0 2-3 3-3 6 0 4 3 7 6 7"/>` },
  'wind': { ar: 'ريح', body: `<path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/><path d="M17.5 8a2.5 2.5 0 1 1 2 4H2"/>` },
  'rose': { ar: 'وردة', body: `<circle cx="12" cy="9" r="2"/><path d="M12 11c-3 0-4 2-3 4 1 1 3 1 3-1"/><path d="M12 11c3 0 4 2 3 4-1 1-3 1-3-1"/><path d="M12 7c-1-2 0-4 2-4 0 2-1 4-2 4z"/><path d="M12 7c1-2 0-4-2-4 0 2 1 4 2 4z"/><path d="M12 13v9"/><path d="M12 17l-3 1M12 19l3 1"/>` },
  'leaf': { ar: 'ورقة شجر', body: `<path d="M11 20A7 7 0 0 1 4 13L13 4a7 7 0 0 1 7 7l-9 9z"/><line x1="13" y1="9" x2="5" y2="17"/>` },
  'cherry-blossom': { ar: 'زهرة', body: `<circle cx="12" cy="12" r="2"/><ellipse cx="12" cy="6" rx="2" ry="3"/><ellipse cx="12" cy="18" rx="2" ry="3"/><ellipse cx="6" cy="12" rx="3" ry="2"/><ellipse cx="18" cy="12" rx="3" ry="2"/>` },
  'fallen-leaf': { ar: 'ورقة خريف', body: `<path d="M4 20l3-2 2 1 3-3 2 2 3-3 2 2 3-3"/><path d="M11 4l1 4-3 2 4 1-2 4 4-1 1 4 2-3 3 2"/>` },
  'snowflake': { ar: 'ثلج', body: `<line x1="12" y1="2" x2="12" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/><path d="M12 2l-2 2M12 2l2 2M12 22l-2-2M12 22l2-2M2 12l2-2M2 12l2 2M22 12l-2-2M22 12l-2 2"/>` },
  'rock': { ar: 'حجر', body: `<path d="M3 18l3-7 4-2 6 1 5 5-2 4-7 1z"/>` },
  'desert': { ar: 'صحراء', body: `<circle cx="18" cy="6" r="2.5"/><path d="M2 20c2-4 5-4 7 0M9 20c1-3 3-3 4 0M13 20c2-5 5-5 8 0"/><line x1="2" y1="22" x2="22" y2="22"/>` },
  'mountain': { ar: 'جبل', body: `<path d="M3 20l6-10 4 6 2-3 6 7z"/><line x1="2" y1="20" x2="22" y2="20"/>` },
  'tornado': { ar: 'إعصار', body: `<path d="M21 4H3M18 8H6M16 12H8M13 16h-2M12 20"/>` },
  'wheat': { ar: 'سنبلة', body: `<path d="M12 22V8"/><path d="M12 12c-2-2-4-2-5 0 1 2 3 2 5 0"/><path d="M12 12c2-2 4-2 5 0-1 2-3 2-5 0"/><path d="M12 8c-2-2-4-2-5 0 1 2 3 2 5 0"/><path d="M12 8c2-2 4-2 5 0-1 2-3 2-5 0"/><path d="M12 16c-2-2-4-2-5 0 1 2 3 2 5 0"/><path d="M12 16c2-2 4-2 5 0-1 2-3 2-5 0"/>` },
  'grapes': { ar: 'عنب', body: `<circle cx="12" cy="6" r="1.5"/><circle cx="9" cy="9" r="1.5"/><circle cx="15" cy="9" r="1.5"/><circle cx="6" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="18" cy="12" r="1.5"/><circle cx="9" cy="15" r="1.5"/><circle cx="15" cy="15" r="1.5"/><circle cx="12" cy="18" r="1.5"/><path d="M12 4V2"/><path d="M10 3l2-1 2 1"/>` },
  'wood-log': { ar: 'جذع خشب', body: `<rect x="3" y="9" width="18" height="6" rx="3"/><circle cx="6" cy="12" r="1.5"/><circle cx="6" cy="12" r="0.5"/>` },
  'seedling': { ar: 'نبتة', body: `<path d="M12 22V10"/><path d="M12 10c-3 0-5-2-5-5 3 0 5 2 5 5z"/><path d="M12 10c3 0 5-2 5-5-3 0-5 2-5 5z"/>` },

  // ===== Objects =====
  'key': { ar: 'مفتاح', body: `<circle cx="7" cy="14" r="4"/><path d="M11 11l9-9"/><path d="M16 6l3 3"/><path d="M18 4l3 3"/>` },
  'heart': { ar: 'قلب', body: `<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>` },
  'hearts': { ar: 'قلوب', body: `<path d="M9 13l-4-4a3 3 0 1 1 4-4 3 3 0 1 1 4 4z"/><path d="M16 21l-4-4a3 3 0 1 1 4-4 3 3 0 1 1 4 4z"/>` },
  'anatomical-heart': { ar: 'قلب', body: `<path d="M12 21s-7-4-9-9c-1-3 0-7 4-7 2 0 3 1 5 3 2-2 3-3 5-3 4 0 5 4 4 7-2 5-9 9-9 9z"/><path d="M9 8l2 3M14 6l2 4"/>` },
  'broken-heart': { ar: 'قلب مكسور', body: `<path d="M12 21l-7.5-7.5a5 5 0 0 1 7-7L12 7l.5-.5a5 5 0 0 1 7 7L12 21z"/><path d="M9 10l2 2-1 2 2 1-1 3"/>` },
  'gold-medal': { ar: 'ميدالية ذهبية', body: `<circle cx="12" cy="14" r="6"/><path d="M9 8L7 3h10l-2 5"/><text x="12" y="17" text-anchor="middle" font-size="6" font-weight="bold" stroke="none" fill="currentColor">1</text>` },
  'clock': { ar: 'ساعة', body: `<circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14"/>` },
  'hourglass': { ar: 'ساعة رملية', body: `<path d="M6 2h12"/><path d="M6 22h12"/><path d="M6 2c0 4 6 6 6 10s-6 6-6 10"/><path d="M18 2c0 4-6 6-6 10s6 6 6 10"/>` },
  'money-bag': { ar: 'كيس مال', body: `<path d="M9 4c-1 1-2 2-2 4 0 3 2 4 5 4s5-1 5-4c0-2-1-3-2-4"/><path d="M5 21c-1-4 1-9 7-9s8 5 7 9z"/><text x="12" y="19" text-anchor="middle" font-size="6" font-weight="bold" stroke="none" fill="currentColor">$</text>` },
  'books': { ar: 'كتب', body: `<path d="M5 3h6v18H5z"/><path d="M11 3h6v18h-6z"/><line x1="7" y1="7" x2="9" y2="7"/><line x1="13" y1="7" x2="15" y2="7"/>` },
  'open-book': { ar: 'كتاب مفتوح', body: `<path d="M2 5c3-1 7-1 10 1V21c-3-2-7-2-10-1z"/><path d="M22 5c-3-1-7-1-10 1V21c3-2 7-2 10-1z"/>` },
  'scroll': { ar: 'مخطوطة', body: `<path d="M5 4a2 2 0 1 1 0 4h10v10a2 2 0 1 1-4 0V8"/><path d="M5 4h14v10"/><path d="M19 18a2 2 0 0 1-4 0"/>` },
  'sword': { ar: 'سيف', body: `<polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" y1="19" x2="19" y2="13"/><line x1="16" y1="16" x2="20" y2="20"/><line x1="19" y1="21" x2="21" y2="19"/>` },
  'arabic-sword': { ar: 'سيف عربي', body: `<path d="M4 4c4 0 12 4 16 12l-2 2L4 8z"/><line x1="18" y1="18" x2="21" y2="21"/><path d="M16 18l2 2"/>` },
  'crossed-swords': { ar: 'سيفان متقاطعان', body: `<line x1="3" y1="3" x2="14" y2="14"/><polyline points="13 19 17 19 17 15"/><line x1="16" y1="16" x2="20" y2="20"/><line x1="21" y1="3" x2="10" y2="14"/><polyline points="11 19 7 19 7 15"/><line x1="8" y1="16" x2="4" y2="20"/>` },
  'shield': { ar: 'درع', body: `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>` },
  'spear': { ar: 'رمح', body: `<line x1="3" y1="21" x2="21" y2="3"/><path d="M16 3l5 0v5"/><path d="M19 3l-3 7-4-4z"/>` },
  'bow-arrow': { ar: 'قوس وسهم', body: `<path d="M5 19c0-7 5-12 12-12"/><line x1="3" y1="21" x2="21" y2="3"/><polyline points="17 3 21 3 21 7"/><line x1="18" y1="6" x2="14" y2="10"/>` },
  'target': { ar: 'هدف', body: `<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/>` },
  'pill': { ar: 'دواء', body: `<path d="M10.5 20.5a4.95 4.95 0 1 1-7-7l10-10a4.95 4.95 0 1 1 7 7l-10 10z"/><line x1="8.5" y1="8.5" x2="15.5" y2="15.5"/>` },
  'diamond': { ar: 'ألماس', body: `<path d="M6 4h12l3 5-9 11L3 9z"/><line x1="6" y1="4" x2="12" y2="20"/><line x1="18" y1="4" x2="12" y2="20"/><line x1="3" y1="9" x2="21" y2="9"/>` },
  'mirror': { ar: 'مرآة', body: `<ellipse cx="12" cy="9" rx="6" ry="7"/><line x1="12" y1="16" x2="12" y2="22"/><line x1="8" y1="22" x2="16" y2="22"/>` },
  'door': { ar: 'باب', body: `<rect x="5" y="3" width="14" height="18" rx="1"/><circle cx="15" cy="12" r="0.8" fill="currentColor"/>` },
  'hammer': { ar: 'مطرقة', body: `<path d="M15 12l-8.5 8.5a2.12 2.12 0 1 1-3-3L12 9"/><path d="M17.64 15L22 10.64"/><path d="M20.91 11.7l-1.25-1.25c-.6-.6-.93-1.4-.93-2.25v-.86L16.01 4.6a5.56 5.56 0 0 0-3.94-1.64h-.5l1.96 1.96c.39.39.39 1.02 0 1.41l-.78.78c-.39.39-1.02.39-1.41 0L9.38 5.15v.5c0 1.48.59 2.89 1.64 3.93l2.74 2.73h.84c.83 0 1.65.33 2.25.93l1.25 1.25"/>` },
  'axe': { ar: 'فأس', body: `<path d="M4 20l9-9"/><path d="M8 8l4 4"/><path d="M11 6c2-2 6-3 9-1-2 0-3 2-4 4l-3-1z"/>` },
  'flashlight': { ar: 'مصباح', body: `<path d="M9 3h6l-1 4-4 0z"/><path d="M10 7v12a2 2 0 0 0 4 0V7"/>` },
  'lantern': { ar: 'فانوس', body: `<rect x="7" y="6" width="10" height="12" rx="1"/><path d="M9 6V4h6v2"/><path d="M12 4V2"/><path d="M7 18v2h10v-2"/><line x1="10" y1="9" x2="10" y2="15"/><line x1="14" y1="9" x2="14" y2="15"/>` },
  'coin': { ar: 'عملة', body: `<circle cx="12" cy="12" r="9"/><text x="12" y="15" text-anchor="middle" font-size="8" font-weight="bold" stroke="none" fill="currentColor">د</text>` },
  'bandage': { ar: 'ضماد', body: `<path d="M8 8L3 13a3.5 3.5 0 1 0 5 5l5-5z"/><path d="M16 16l5-5a3.5 3.5 0 1 0-5-5l-5 5z"/><circle cx="10" cy="14" r="0.5" fill="currentColor"/><circle cx="12" cy="12" r="0.5" fill="currentColor"/><circle cx="14" cy="10" r="0.5" fill="currentColor"/>` },
  'sparkles': { ar: 'لمعان', body: `<path d="M12 3l1.5 4L18 8.5l-4.5 1.5L12 14l-1.5-4L6 8.5 10.5 7z"/><path d="M19 14l.5 1.5 1.5.5-1.5.5L19 18l-.5-1.5L17 16l1.5-.5z"/><path d="M5 16l.5 1.5L7 18l-1.5.5L5 20l-.5-1.5L3 18l1.5-.5z"/>` },
  'milk': { ar: 'حليب', body: `<path d="M8 2h8v3l1 2v13a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V7l1-2z"/><path d="M7 9h10"/>` },
  'fried-egg': { ar: 'بيض مقلي', body: `<ellipse cx="10" cy="12" rx="7" ry="6"/><circle cx="12" cy="11" r="3"/>` },
  'cooking-pan': { ar: 'مقلاة', body: `<ellipse cx="10" cy="14" rx="6" ry="2"/><path d="M4 14v3M16 14v3"/><line x1="17" y1="13" x2="22" y2="11"/>` },
  'scales': { ar: 'ميزان', body: `<line x1="12" y1="3" x2="12" y2="21"/><line x1="6" y1="21" x2="18" y2="21"/><path d="M3 9h6L6 16H3z"/><path d="M15 9h6l-3 7h-3z"/><path d="M3 9l9-3 9 3"/>` },
  'sailboat': { ar: 'مركب شراعي', body: `<path d="M12 2v15"/><path d="M12 5l-7 12h14z"/><path d="M3 19c2 1 4 1 6 0s4-1 6 0 4 1 6 0"/>` },
  'ship': { ar: 'سفينة', body: `<path d="M2 17l1 2h18l1-2"/><path d="M3 17l1-5h16l1 5"/><line x1="12" y1="3" x2="12" y2="12"/><line x1="6" y1="6" x2="18" y2="6"/>` },
  'compass': { ar: 'بوصلة', body: `<circle cx="12" cy="12" r="9"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>` },
  'nest': { ar: 'عش', body: `<path d="M3 17c0-2 1-3 3-3"/><path d="M21 17c0-2-1-3-3-3"/><path d="M3 17c3 2 15 2 18 0"/><path d="M5 14l1-2M9 13l1-2M13 13l1-2M17 13l1-2"/><ellipse cx="10" cy="14" rx="1.2" ry="1"/><ellipse cx="13" cy="14" rx="1.2" ry="1"/>` },
  'prayer-beads': { ar: 'سبحة', body: `<circle cx="12" cy="5" r="1.5"/><circle cx="6" cy="8" r="1.2"/><circle cx="4" cy="13" r="1.2"/><circle cx="6" cy="18" r="1.2"/><circle cx="12" cy="20" r="1.2"/><circle cx="18" cy="18" r="1.2"/><circle cx="20" cy="13" r="1.2"/><circle cx="18" cy="8" r="1.2"/>` },
  'mosque': { ar: 'مسجد', body: `<path d="M12 2c1 2 1 4 0 4s-1-2 0-4z"/><path d="M3 20V12c0-3 4-6 9-6s9 3 9 6v8"/><path d="M3 20h18"/><rect x="10" y="14" width="4" height="6" rx="2"/><circle cx="6" cy="11" r="1"/><circle cx="18" cy="11" r="1"/><path d="M12 6v2"/>` },
  'kaaba': { ar: 'كعبة', body: `<rect x="5" y="6" width="14" height="14"/><line x1="5" y1="11" x2="19" y2="11"/><path d="M8 11l1 2-1 2M11 11v4M16 11l-1 2 1 2"/>` },
  'quran': { ar: 'مصحف', body: `<rect x="5" y="3" width="14" height="18" rx="1"/><line x1="5" y1="7" x2="19" y2="7"/><path d="M9 12c1-1 2-1 3 0M12 12c1-1 2-1 3 0"/><path d="M10 16h4"/>` },
  'crescent-star': { ar: 'هلال ونجمة', body: `<path d="M18 12a7 7 0 1 1-7-7c-2 2-2 5 0 7s5 2 7 0z"/><polygon points="18 7 19 9.5 21.5 9.5 19.5 11 20 13.5 18 12 16 13.5 16.5 11 14.5 9.5 17 9.5" stroke="none" fill="currentColor"/>` },
  'minaret': { ar: 'مئذنة', body: `<path d="M11 22V8"/><path d="M13 22V8"/><path d="M9 11h6"/><path d="M10 14h4"/><path d="M9 17h6"/><circle cx="12" cy="5" r="2"/><line x1="12" y1="3" x2="12" y2="1"/>` },
  'castle': { ar: 'قلعة', body: `<path d="M3 21V8h2v3h2V8h2v3h2V8h2v3h2V8h2v3h2V8h2v13z"/><line x1="3" y1="14" x2="21" y2="14"/><rect x="10" y="16" width="4" height="5"/>` },
  'brick': { ar: 'طوبة', body: `<rect x="3" y="6" width="6" height="5"/><rect x="9" y="6" width="6" height="5"/><rect x="15" y="6" width="6" height="5"/><rect x="6" y="11" width="6" height="5"/><rect x="12" y="11" width="6" height="5"/><rect x="3" y="16" width="6" height="5"/><rect x="9" y="16" width="6" height="5"/><rect x="15" y="16" width="6" height="5"/>` },
  'crown': { ar: 'تاج', body: `<path d="M2 18l2-10 5 6 3-8 3 8 5-6 2 10z"/><line x1="2" y1="21" x2="22" y2="21"/>` },
  'skull': { ar: 'جمجمة', body: `<circle cx="12" cy="10" r="7"/><path d="M9 18h6"/><line x1="10" y1="19" x2="10" y2="22"/><line x1="14" y1="19" x2="14" y2="22"/><circle cx="9" cy="11" r="1.2" fill="currentColor"/><circle cx="15" cy="11" r="1.2" fill="currentColor"/><path d="M11 14l1 1 1-1"/>` },
  'headstone': { ar: 'قبر', body: `<path d="M5 20V11a7 7 0 0 1 14 0v9"/><line x1="3" y1="20" x2="21" y2="20"/><path d="M9 10l3-2 3 2"/>` },
  'theater-masks': { ar: 'أقنعة مسرح', body: `<path d="M3 8c0-2 2-3 4-3s4 1 5 4c1-3 3-4 5-4s4 1 4 3v4c0 4-3 7-7 7-2 0-3-1-4-2-1 1-2 2-4 2-4 0-7-3-7-7z"/><circle cx="6" cy="11" r="0.5" fill="currentColor"/><circle cx="10" cy="11" r="0.5" fill="currentColor"/><circle cx="14" cy="11" r="0.5" fill="currentColor"/><circle cx="18" cy="11" r="0.5" fill="currentColor"/>` },
  'circus-tent': { ar: 'خيمة سيرك', body: `<path d="M3 20l9-15 9 15z"/><path d="M3 20c3-3 6-3 9 0s6-3 9 0"/><line x1="12" y1="5" x2="12" y2="3"/>` },
  'bedouin-tent': { ar: 'خيمة بدوية', body: `<path d="M2 20l10-14 10 14"/><line x1="2" y1="20" x2="22" y2="20"/><path d="M9 20v-6h6v6"/><path d="M12 6V3"/>` },
  'globe': { ar: 'كرة أرضية', body: `<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="9" ry="4"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="12" y1="3" x2="12" y2="21"/>` },
  'crystal-ball': { ar: 'كرة بلورية', body: `<circle cx="12" cy="13" r="7"/><path d="M5 20h14"/><circle cx="10" cy="11" r="1.5"/>` },
  'writing-hand': { ar: 'يد تكتب', body: `<path d="M12 19l7-7 3 3-7 7H12v-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5z"/><line x1="2" y1="2" x2="7" y2="7"/>` },
  'blood-drop': { ar: 'قطرة دم', body: `<path d="M12 2.5l5 6a7 7 0 1 1-10 0z"/>` },
  'meat': { ar: 'لحم', body: `<path d="M14 4l4 4a4 4 0 0 1-6 6L8 18a2.83 2.83 0 1 1-4-4l4-4a4 4 0 0 1 6-6z"/><circle cx="17" cy="7" r="1" fill="currentColor"/>` },
  'luggage': { ar: 'حقيبة سفر', body: `<rect x="5" y="7" width="14" height="14" rx="2"/><path d="M9 7V4h6v3"/><line x1="9" y1="11" x2="9" y2="20"/><line x1="15" y1="11" x2="15" y2="20"/>` },
  'railway': { ar: 'سكة قطار', body: `<line x1="5" y1="3" x2="5" y2="21"/><line x1="19" y1="3" x2="19" y2="21"/><line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/>` },
  'bed': { ar: 'سرير', body: `<path d="M2 20v-8h20v8"/><path d="M2 16h20"/><path d="M7 12V8h10v4"/><line x1="2" y1="20" x2="2" y2="22"/><line x1="22" y1="20" x2="22" y2="22"/>` },
  'broom': { ar: 'مكنسة', body: `<path d="M19 3l-7 7"/><path d="M14 8l4-4"/><path d="M9 13l2 2"/><path d="M5 21l-2-2 4-4 4 4-2 2z"/><path d="M5 21l-1 1M7 19l-1 1M9 17l-1 1"/>` },
  'plate': { ar: 'صحن', body: `<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="6"/>` },
  'plate-utensils': { ar: 'صحن وأدوات', body: `<circle cx="12" cy="14" r="5"/><line x1="3" y1="3" x2="3" y2="14"/><path d="M3 3v6h2V3"/><path d="M21 3v18"/><path d="M21 8c0-3-2-5-3-5"/>` },
  'house': { ar: 'بيت', body: `<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>` },
  'cup': { ar: 'كأس', body: `<path d="M6 8h12l-1 11a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2z"/><line x1="6" y1="8" x2="6" y2="6"/><line x1="18" y1="8" x2="18" y2="6"/><path d="M6 7c0-3 12-3 12 0"/>` },
  'arabic-coffee-pot': { ar: 'دلة قهوة', body: `<path d="M10 6V4h4v2"/><path d="M8 6h8l-1 14a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z"/><path d="M16 9l4-3-1 3 1 3z"/><circle cx="12" cy="6" r="1"/>` },
  'agal-headband': { ar: 'عقال', body: `<ellipse cx="12" cy="12" rx="9" ry="5"/><ellipse cx="12" cy="12" rx="9" ry="3"/><circle cx="12" cy="12" r="1.5"/>` },
  'arabic-headscarf': { ar: 'غترة', body: `<path d="M4 8l8-4 8 4-2 12H6z"/><path d="M4 8l16 0"/><path d="M6 12l12 0"/><path d="M7 16l10 0"/>` },
  'turban': { ar: 'عمامة', body: `<path d="M4 16c0-5 4-9 8-9s8 4 8 9"/><path d="M3 16h18l-1 4H4z"/><path d="M5 13c2-1 4-1 5 0M9 11c2-1 4-1 6 0M13 13c2-1 4-1 5 0"/>` },
  'arabic-flag': { ar: 'راية', body: `<line x1="4" y1="3" x2="4" y2="22"/><path d="M4 4h14l-3 4 3 4H4"/>` },
  'wing': { ar: 'جناح', body: `<path d="M3 19c4-2 9-4 14-3-2 1-5 1-7 3-2 1-5 1-7 0z"/><path d="M3 19l5-7 2 4 4-5 1 4 4-5 2 4"/>` },
  'airplane': { ar: 'طائرة', body: `<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>` },
  'paper-plane': { ar: 'طائرة ورقية', body: `<path d="M22 2L2 11l8 3 3 8z"/><line x1="22" y1="2" x2="13" y2="22"/><line x1="22" y1="2" x2="10" y2="14"/>` },
  'thought-bubble': { ar: 'فقاعة فكر', body: `<path d="M21 12c0 4-3 7-7 7h-4l-3 3v-4c-2-1-4-3-4-6 0-4 3-7 7-7h4c4 0 7 3 7 7z"/><circle cx="3" cy="20" r="1"/><circle cx="2" cy="22" r="0.6"/>` },
  'calligraphy': { ar: 'خط عربي', body: `<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 8c2-1 5 0 6 2 1-3 5-3 5 0"/><path d="M7 12c4 2 8 2 11 0"/><path d="M7 16c2 1 5 1 7 0 2-1 3-1 4 0"/>` },

  // ===== People =====
  'hand': { ar: 'يد', body: `<path d="M9 11V5a2 2 0 1 1 4 0v6"/><path d="M13 11V4a2 2 0 1 1 4 0v9"/><path d="M5 13V8a2 2 0 1 1 4 0v3"/><path d="M5 13c0 6 3 9 7 9s7-3 7-9V8"/>` },
  'wave-hand': { ar: 'تلويح', body: `<path d="M7 11V6a2 2 0 1 1 4 0v6"/><path d="M11 7V4a2 2 0 1 1 4 0v8"/><path d="M15 9V6a2 2 0 1 1 4 0v8c0 4-3 7-7 7s-7-3-7-7v-2"/><path d="M5 4l-2 2M5 8H3"/>` },
  'ear': { ar: 'أذن', body: `<path d="M6 8a6 6 0 0 1 12 0c0 6-4 7-5 9s-2 4-5 4-3-2-3-4 1-3 1-5"/><path d="M9 11c0-2 1-3 3-3s3 1 3 3"/>` },
  'speaking-head': { ar: 'يتحدث', body: `<circle cx="9" cy="12" r="5"/><path d="M16 5c2 2 3 4 3 7s-1 5-3 7"/><path d="M18 3c3 2 4 5 4 9s-1 7-4 9"/>` },
  'mouth': { ar: 'فم', body: `<path d="M5 12c4-3 10-3 14 0"/><path d="M5 12c4 3 10 3 14 0"/><path d="M9 10c1-2 5-2 6 0"/><path d="M9 14c1 2 5 2 6 0"/>` },
  'eye': { ar: 'عين', body: `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>` },
  'eyes': { ar: 'عينان', body: `<path d="M1 12s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z"/><circle cx="8" cy="12" r="1.5"/><path d="M9 12s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z"/><circle cx="16" cy="12" r="1.5"/>` },
  'muscle': { ar: 'عضلة', body: `<path d="M3 16c2-4 6-6 10-6 2 0 3-1 4-3l3 2c-1 3-3 5-6 6-3 1-7 1-11 1z"/><path d="M14 7c-1 2-3 3-5 3"/>` },
  'brain': { ar: 'دماغ', body: `<path d="M12 5a3 3 0 1 0-5 2c-2 1-3 3-3 5s1 4 3 5a3 3 0 1 0 5 2 3 3 0 1 0 5-2c2-1 3-3 3-5s-1-4-3-5a3 3 0 1 0-5-2z"/><path d="M12 5v14"/><path d="M9 9c1-1 2 0 3 0M9 15c1 1 2 0 3 0"/>` },
  'smile': { ar: 'ابتسامة', body: `<circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><circle cx="9" cy="10" r="0.7" fill="currentColor"/><circle cx="15" cy="10" r="0.7" fill="currentColor"/>` },
  'handshake': { ar: 'مصافحة', body: `<path d="M11 17l2 2a2 2 0 1 0 3-3l-5-5"/><path d="M14 14l2-2 2 2 2-2-7-7"/><path d="M3 14l4-4 5 5-3 3a2 2 0 1 1-3-3z"/><path d="M3 14l-2-2 3-3 2 2"/>` },
  'cry': { ar: 'بكاء', body: `<circle cx="12" cy="12" r="9"/><path d="M8 16s1.5-2 4-2 4 2 4 2"/><circle cx="9" cy="10" r="0.7" fill="currentColor"/><circle cx="15" cy="10" r="0.7" fill="currentColor"/><path d="M7 12l1 4M17 12l-1 4" stroke-dasharray="1 1"/>` },
  'shush': { ar: 'صمت', body: `<circle cx="12" cy="12" r="9"/><path d="M9 14h6"/><circle cx="9" cy="10" r="0.7" fill="currentColor"/><circle cx="15" cy="10" r="0.7" fill="currentColor"/><line x1="12" y1="14" x2="12" y2="17"/>` },
  'open-hands': { ar: 'يدان مفتوحتان', body: `<path d="M9 11V5a2 2 0 1 0-4 0v7l-2-2-1 1 4 5h6"/><path d="M15 11V5a2 2 0 1 1 4 0v7l2-2 1 1-4 5h-3"/>` },
  'walking': { ar: 'يمشي', body: `<circle cx="13" cy="4" r="2"/><path d="M9 20l3-6-2-5h4l3 4"/><line x1="13" y1="9" x2="9" y2="13"/><line x1="14" y1="20" x2="11" y2="14"/>` },
  'running': { ar: 'يجري', body: `<circle cx="16" cy="4" r="2"/><path d="M5 21l5-3 1-5 5 1-2-4"/><line x1="15" y1="14" x2="19" y2="17"/><path d="M9 12l-3 2-2-3"/>` },
  'swimmer': { ar: 'سباح', body: `<circle cx="16" cy="6" r="2"/><path d="M19 10c-3 0-4-2-6-2s-3 2-6 2"/><path d="M2 16c2-2 4-2 6 0s4 2 6 0 4-2 6 0 2 1 2 1"/><path d="M2 20c2-2 4-2 6 0s4 2 6 0 4-2 6 0 2 1 2 1"/>` },
  'farmer': { ar: 'مزارع', body: `<circle cx="12" cy="6" r="3"/><path d="M5 4h14"/><path d="M3 5l9-1 9 1"/><path d="M7 20l1-7h8l1 7"/><line x1="7" y1="13" x2="17" y2="13"/>` },
  'pilot': { ar: 'ربان', body: `<circle cx="12" cy="6" r="3"/><path d="M7 6c-2-1-3 0-3 1l1 1 2 1"/><path d="M17 6c2-1 3 0 3 1l-1 1-2 1"/><path d="M6 20l2-8h8l2 8"/>` },
  'elderly': { ar: 'كبير سن', body: `<circle cx="12" cy="6" r="3"/><line x1="12" y1="9" x2="12" y2="20"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="6" y1="6" x2="18" y2="6" stroke-dasharray="1 1"/>` },
  'doctor': { ar: 'طبيب', body: `<circle cx="12" cy="6" r="3"/><path d="M7 20v-6a5 5 0 0 1 10 0v6"/><path d="M11 13h2v3h-2zM10 14h4"/>` },
  'baby': { ar: 'طفل', body: `<circle cx="12" cy="9" r="4"/><circle cx="10" cy="9" r="0.5" fill="currentColor"/><circle cx="14" cy="9" r="0.5" fill="currentColor"/><path d="M11 11s.5 1 1 1 1-1 1-1"/><path d="M7 20v-3a5 5 0 0 1 10 0v3"/>` },
  'hijab-woman': { ar: 'امرأة بحجاب', body: `<path d="M7 8a5 5 0 0 1 10 0v4c0 1-1 2-2 2h-1l-1 2H11l-1-2H9c-1 0-2-1-2-2z"/><circle cx="11" cy="10" r="0.5" fill="currentColor"/><circle cx="13" cy="10" r="0.5" fill="currentColor"/><path d="M5 22l2-6h10l2 6"/>` },
  'turban-man': { ar: 'رجل بعمامة', body: `<path d="M5 10c0-4 3-7 7-7s7 3 7 7"/><path d="M4 11h16l-1 3H5z"/><circle cx="12" cy="12" r="3"/><circle cx="11" cy="12" r="0.5" fill="currentColor"/><circle cx="13" cy="12" r="0.5" fill="currentColor"/><path d="M6 20l2-5h8l2 5"/>` },
  'man': { ar: 'رجل', body: `<circle cx="12" cy="6" r="3"/><path d="M7 20v-6a5 5 0 0 1 10 0v6"/>` },
  'silhouette': { ar: 'شخص', body: `<circle cx="12" cy="6" r="3"/><path d="M5 21v-2a7 7 0 0 1 14 0v2z"/>` },
  'silhouettes': { ar: 'مجموعة', body: `<circle cx="9" cy="6" r="2.5"/><circle cx="17" cy="7" r="2"/><path d="M3 20v-2a6 6 0 0 1 12 0v2z"/><path d="M14 17a5 5 0 0 1 8 3v.5"/>` },
  'father-son': { ar: 'أب وابن', body: `<circle cx="8" cy="5" r="2.5"/><path d="M3 20v-2a5 5 0 0 1 10 0v2z"/><circle cx="17" cy="9" r="2"/><path d="M13 20v-1a4 4 0 0 1 8 0v1z"/>` },
  'angry': { ar: 'غاضب', body: `<circle cx="12" cy="12" r="9"/><line x1="7" y1="9" x2="10" y2="11"/><line x1="14" y1="11" x2="17" y2="9"/><path d="M8 16c1-1 2-1 4-1s3 0 4 1"/><circle cx="9" cy="11.5" r="0.5" fill="currentColor"/><circle cx="15" cy="11.5" r="0.5" fill="currentColor"/>` },
  'dizzy': { ar: 'دائخ', body: `<circle cx="12" cy="12" r="9"/><path d="M8 9l2 2M10 9l-2 2"/><path d="M14 9l2 2M16 9l-2 2"/><path d="M8 15c1 1 3 1 4 0s3-1 4 0"/>` },
  'relieved': { ar: 'مرتاح', body: `<circle cx="12" cy="12" r="9"/><path d="M8 11s1-1 2-1 2 1 2 1"/><path d="M12 11s1-1 2-1 2 1 2 1"/><path d="M8 15c1 1 3 2 4 2s3-1 4-2"/>` },
  'anxious': { ar: 'قلق', body: `<circle cx="12" cy="12" r="9"/><circle cx="9" cy="11" r="0.7" fill="currentColor"/><circle cx="15" cy="11" r="0.7" fill="currentColor"/><line x1="7" y1="8" x2="10" y2="8"/><line x1="14" y1="8" x2="17" y2="8"/><path d="M8 16c1-1 2-1 4-1s3 0 4 1"/><path d="M16 14c1 0 2 1 2 2"/>` },
  'sweat': { ar: 'متعرق', body: `<circle cx="12" cy="12" r="9"/><circle cx="9" cy="11" r="0.7" fill="currentColor"/><circle cx="15" cy="11" r="0.7" fill="currentColor"/><path d="M8 16c1 1 3 1 4 0s3 0 4 1"/><path d="M18 6c.5 1 .5 2 0 3-1-1-1-2 0-3z"/>` },
  'thought': { ar: 'تفكير', body: `<path d="M21 12c0 4-3 7-7 7h-4l-3 3v-4c-2-1-4-3-4-6 0-4 3-7 7-7h4c4 0 7 3 7 7z"/><circle cx="3" cy="20" r="1"/><circle cx="2" cy="22" r="0.6"/>` },
  'nose': { ar: 'أنف', body: `<path d="M12 4v10"/><path d="M12 14c-2 0-3 1-3 2s1 2 3 2 3-1 3-2-1-2-3-2z"/><path d="M10 9c-1 0-2 1-2 2"/><path d="M14 9c1 0 2 1 2 2"/>` },

  // ===== Symbols =====
  'x-mark': { ar: 'علامة خطأ', body: `<line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/>` },
  'check-mark': { ar: 'علامة صح', body: `<polyline points="5 12 10 17 19 7"/>` },
  'warning': { ar: 'تحذير', body: `<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>` },
  'refresh': { ar: 'تجدد', body: `<path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10"/><path d="M20.49 15a9 9 0 0 1-14.85 3.36L1 14"/>` },
  'magnifier': { ar: 'عدسة', body: `<circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>` },
  'telescope': { ar: 'منظار', body: `<path d="M3 17l4-12 12 5-3 8z"/><line x1="6" y1="12" x2="14" y2="15"/><path d="M9 17v4M15 17v4"/><line x1="6" y1="21" x2="18" y2="21"/>` },
  'skull-crossbones': { ar: 'سم', body: `<circle cx="12" cy="9" r="5"/><circle cx="10" cy="9" r="0.7" fill="currentColor"/><circle cx="14" cy="9" r="0.7" fill="currentColor"/><path d="M9 12h6"/><line x1="6" y1="17" x2="18" y2="22"/><line x1="18" y1="17" x2="6" y2="22"/>` },
  'prohibited': { ar: 'ممنوع', body: `<circle cx="12" cy="12" r="9"/><line x1="6" y1="6" x2="18" y2="18"/>` },
  'play': { ar: 'تشغيل', body: `<polygon points="6 4 20 12 6 20 6 4"/>` },
  'arrow-left': { ar: 'سهم لليسار', body: `<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>` },
  'arrow-up': { ar: 'سهم لأعلى', body: `<line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>` },
  'arrow-down': { ar: 'سهم لأسفل', body: `<line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>` },
  'arrow-right': { ar: 'سهم لليمين', body: `<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>` },
  'lightbulb': { ar: 'فكرة', body: `<path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 13c1 1 2 2 2 4h4c0-2 1-3 2-4a7 7 0 0 0-4-13z"/>` },
  'trophy': { ar: 'كأس', body: `<line x1="6" y1="9" x2="18" y2="9"/><path d="M6 9V4h12v5a6 6 0 0 1-12 0z"/><path d="M6 5H4a2 2 0 0 0 2 4M18 5h2a2 2 0 0 1-2 4"/><line x1="12" y1="15" x2="12" y2="19"/><path d="M8 21h8l-1-2H9z"/>` },
  'religion-icon': { ar: 'إسلامية', body: `<path d="M18 12a7 7 0 1 1-7-7c-2 2-2 5 0 7s5 2 7 0z"/><polygon points="18 7 19 9 21 9 19.5 10.5 20 12.5 18 11.5 16 12.5 16.5 10.5 15 9 17 9" stroke="none" fill="currentColor"/>` },
  'poetry-icon': { ar: 'شعر', body: `<path d="M5 4a2 2 0 1 1 0 4h10v10a2 2 0 1 1-4 0V8"/><path d="M5 4h14v10"/><line x1="9" y1="11" x2="13" y2="11"/><line x1="9" y1="14" x2="13" y2="14"/>` },
  'proverbs-icon': { ar: 'أمثال', body: `<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>` },
  'wisdom-icon': { ar: 'حكمة', body: `<path d="M12 5a3 3 0 1 0-5 2c-2 1-3 3-3 5s1 4 3 5a3 3 0 1 0 5 2 3 3 0 1 0 5-2c2-1 3-3 3-5s-1-4-3-5a3 3 0 1 0-5-2z"/><path d="M12 5v14"/>` },
  'all-icon': { ar: 'الكل', body: `<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>` },
  'easy-icon': { ar: 'سهل', body: `<path d="M12 22V10"/><path d="M12 10c-3 0-5-2-5-5 3 0 5 2 5 5z"/><path d="M12 10c3 0 5-2 5-5-3 0-5 2-5 5z"/>` },
  'medium-icon': { ar: 'متوسط', body: `<path d="M8 14a4 4 0 0 0 8 0c0-3-3-3-3-7 0-3-2-4-2-4S9 5 9 8c0 2-3 3-3 6 0 4 3 7 6 7"/>` },
  'hard-icon': { ar: 'صعب', body: `<circle cx="12" cy="10" r="7"/><path d="M9 18h6"/><line x1="10" y1="19" x2="10" y2="22"/><line x1="14" y1="19" x2="14" y2="22"/><circle cx="9" cy="11" r="1.2" fill="currentColor"/><circle cx="15" cy="11" r="1.2" fill="currentColor"/>` },
  'timer-icon': { ar: 'مؤقت', body: `<circle cx="12" cy="13" r="8"/><path d="M9 3h6"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="13" x2="15" y2="15"/>` },
  'classic-icon': { ar: 'كلاسيكي', body: `<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/>` },
  'bone': { ar: 'عظمة', body: `<path d="M17 10c2 0 3-1 3-3s-1-3-3-3-3 1-3 3l-7 7c0 2-1 3-3 3s-3-1-3-3 1-3 3-3"/><path d="M14 10l-4 4"/>` },
  'bread': { ar: 'خبز', body: `<path d="M4 13c0-4 3-7 8-7s8 3 8 7v6H4z"/><path d="M4 13c0-2 1-3 3-3M20 13c0-2-1-3-3-3"/><path d="M7 16h10M8 19h8"/>` },
  'fog': { ar: 'ضباب', body: `<line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="13" x2="21" y2="13"/><line x1="3" y1="17" x2="21" y2="17"/><path d="M5 5c2-1 4-1 6 0s4 1 6 0"/>` },
  'landmark': { ar: 'صرح', body: `<line x1="3" y1="22" x2="21" y2="22"/><line x1="6" y1="18" x2="6" y2="11"/><line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/><line x1="18" y1="18" x2="18" y2="11"/><polygon points="12 2 20 11 4 11"/>` },
  'cooking-fire': { ar: 'طبخ على نار', body: `<ellipse cx="10" cy="14" rx="6" ry="2"/><path d="M4 14v3M16 14v3"/><line x1="17" y1="13" x2="22" y2="11"/><path d="M9 8c0-2 1-2 1-3s-1-1-1-2c1 0 2 1 2 2s-1 2 0 3z"/>` },
  'share-arrow': { ar: 'مشاركة', body: `<path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/>` },
  'download-arrow': { ar: 'تنزيل', body: `<path d="M4 14v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="3" x2="12" y2="15"/>` },
  'install-app': { ar: 'تثبيت', body: `<rect x="6" y="2" width="12" height="20" rx="2"/><line x1="11" y1="18" x2="13" y2="18"/><polyline points="9 9 12 12 15 9"/><line x1="12" y1="5" x2="12" y2="12"/>` },
  'logo-challenge': { ar: 'تحدي الصور', body: `<rect x="3" y="5" width="14" height="11" rx="1.5"/><circle cx="8" cy="9" r="1.3"/><polyline points="3 14 8 11 12 13 17 9"/><path d="M19 8l1 2 2 .3-1.5 1.4.4 2.1L19 13l-1.9 1 .4-2.1L16 10.3l2-.3z"/><path d="M9 19l1.5-1 1 1.5 1.5-1 1 1.5"/>` },
};

// Colored variants (preserved through dark-mode invert+hue-rotate filter)
const COLORED = {
  'heart-red': { ar: 'قلب', stroke: '#EF4444', fill: '#EF4444', body: `<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>` },
  'heart-gray': { ar: 'قلب باهت', stroke: '#94A3B8', fill: '#94A3B8', body: `<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>` },
  'fire-orange': { ar: 'لهب', stroke: '#F97316', fill: '#FB923C', strokeWidth: 1.5, body: `<path d="M8 14a4 4 0 0 0 8 0c0-3-3-3-3-7 0-3-2-4-2-4S9 5 9 8c0 2-3 3-3 6 0 4 3 7 6 7"/>` },
  'logo-color': { ar: 'تحدي الصور', stroke: '#1E293B', strokeWidth: 1.6, body: `<rect x="3" y="5" width="14" height="11" rx="1.5" fill="#FEF08A"/><circle cx="8" cy="9" r="1.3" fill="#EAB308" stroke="none"/><polyline points="3 14 8 11 12 13 17 9" fill="none"/><path d="M19 8l1 2 2 .3-1.5 1.4.4 2.1L19 13l-1.9 1 .4-2.1L16 10.3l2-.3z" fill="#FACC15" stroke="#EAB308"/><path d="M9 19l1.5-1 1 1.5 1.5-1 1 1.5" fill="none"/>` },
};

let count = 0;
for (const [key, { ar, body }] of Object.entries(ICONS)) {
  const svg = HEADER(ar) + body + FOOTER;
  writeFileSync(resolve(OUT_DIR, `${key}.svg`), svg + '\n');
  count++;
}
for (const [key, { ar, body, stroke, fill, strokeWidth }] of Object.entries(COLORED)) {
  const svg = HEADER(ar, { stroke, fill, strokeWidth }) + body + FOOTER;
  writeFileSync(resolve(OUT_DIR, `${key}.svg`), svg + '\n');
  count++;
}
console.log(`Generated ${count} SVG icons in ${OUT_DIR}`);
