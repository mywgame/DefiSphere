import { useEffect, useRef } from "react";

export function ParticleField() {
    const ref = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = ref.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let raf = 0;
        let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
        type P = { x: number; y: number; vx: number; vy: number };
        let pts: P[] = [];

        const resize = () => {
            w = canvas.clientWidth; h = canvas.clientHeight;
            canvas.width = w * dpr; canvas.height = h * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            const count = Math.min(90, Math.floor((w * h) / 18000));
            pts = Array.from({ length: count }, () => ({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.25,
                vy: (Math.random() - 0.5) * 0.25,
            }));
        };
        resize();
        const ro = new ResizeObserver(resize); ro.observe(canvas);

        const draw = () => {
            ctx.clearRect(0, 0, w, h);
            for (const p of pts) {
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0 || p.x > w) p.vx *= -1;
                if (p.y < 0 || p.y > h) p.vy *= -1;
            }
            // links
            for (let i = 0; i < pts.length; i++) {
                for (let j = i + 1; j < pts.length; j++) {
                    const a = pts[i], b = pts[j];
                    const dx = a.x - b.x, dy = a.y - b.y;
                    const d2 = dx * dx + dy * dy;
                    if (d2 < 130 * 130) {
                        const alpha = 1 - Math.sqrt(d2) / 130;
                        ctx.strokeStyle = `rgba(140, 200, 255, ${alpha * 0.18})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.stroke();
                    }
                }
            }
            // dots
            for (const p of pts) {
                ctx.fillStyle = "rgba(180, 220, 255, 0.7)";
                ctx.beginPath();
                ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2);
                ctx.fill();
            }
            raf = requestAnimationFrame(draw);
        };
        raf = requestAnimationFrame(draw);
        return () => { cancelAnimationFrame(raf); ro.disconnect(); };
    }, []);

    return <canvas ref={ref} className="absolute inset-0 h-full w-full" aria-hidden />;
}
