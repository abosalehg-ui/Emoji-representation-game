const COLORS = ['#FACC15', '#EAB308', '#FEF08A', '#22C55E', '#3B82F6', '#EC4899'];
const COUNT = 150;

let rafId = null;

/**
 * احتفال قصير عند تحقيق رقم قياسي.
 *
 * السرعات بالبكسل/ثانية لا بالبكسل/إطار: الحركة لكل إطار تجعل الكونفيتي يسقط
 * بسرعة مضاعفة على شاشة 120Hz مقارنةً بـ60Hz.
 */
export function triggerConfetti() {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (rafId !== null) cancelAnimationFrame(rafId);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const w = window.innerWidth;
    const h = window.innerHeight;

    const particles = Array.from({ length: COUNT }, () => ({
        x: Math.random() * w,
        y: Math.random() * h - h,
        size: Math.random() * 8 + 4,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        vx: (Math.random() * 4 - 2) * 60,
        vy: (Math.random() * 4 + 2) * 60,
        rotation: Math.random() * 360,
        vr: 300
    }));

    let last = performance.now();

    const animate = (now) => {
        // نحدّ الخطوة حتى لا يقفز كل شيء بعد عودة التبويب من الخلفية
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;

        ctx.clearRect(0, 0, w, h);
        let alive = 0;

        for (const p of particles) {
            if (p.y >= h) continue;
            alive++;
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.rotation += p.vr * dt;

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation * Math.PI / 180);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            ctx.restore();
        }

        if (alive > 0) {
            rafId = requestAnimationFrame(animate);
        } else {
            ctx.clearRect(0, 0, w, h);
            rafId = null;
        }
    };

    rafId = requestAnimationFrame(animate);
}

export function stopConfetti() {
    if (rafId !== null) cancelAnimationFrame(rafId);
    rafId = null;
    const canvas = document.getElementById('confetti-canvas');
    canvas?.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
}
