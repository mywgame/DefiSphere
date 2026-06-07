import { motion } from "framer-motion";
import { useMemo } from "react";

// Fibonacci-sphere point distribution -> projected to 2D
function spherePoints(n: number) {
    const pts: { x: number; y: number; z: number }[] = [];
    const phi = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < n; i++) {
        const y = 1 - (i / (n - 1)) * 2;
        const r = Math.sqrt(1 - y * y);
        const t = phi * i;
        pts.push({ x: Math.cos(t) * r, y, z: Math.sin(t) * r });
    }
    return pts;
}

export function BlockchainSphere({ size = 420 }: { size?: number }) {
    const pts = useMemo(() => spherePoints(42), []);
    const R = size / 2 - 20;
    const cx = size / 2;
    const cy = size / 2;

    // edges between close points
    const edges = useMemo(() => {
        const e: [number, number][] = [];
        for (let i = 0; i < pts.length; i++) {
            for (let j = i + 1; j < pts.length; j++) {
                const a = pts[i], b = pts[j];
                const d = Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
                if (d < 0.55) e.push([i, j]);
            }
        }
        return e;
    }, [pts]);

    return (
        <div className="relative" style={{ width: size, height: size }}>
            {/* glow halo */}
            <div
                className="absolute inset-0 rounded-full animate-pulse-glow"
                style={{
                    background:
                        "radial-gradient(circle, rgba(120,180,255,0.35), rgba(160,100,255,0.18) 45%, transparent 70%)",
                    filter: "blur(20px)",
                }}
            />
            {/* orbits */}
            <div className="absolute inset-0 animate-spin-slow">
                <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full">
                    <defs>
                        <linearGradient id="orbit" x1="0" x2="1">
                            <stop offset="0%" stopColor="#7ad7ff" stopOpacity="0.0" />
                            <stop offset="50%" stopColor="#7ad7ff" stopOpacity="0.9" />
                            <stop offset="100%" stopColor="#b08bff" stopOpacity="0.0" />
                        </linearGradient>
                    </defs>
                    <ellipse cx={cx} cy={cy} rx={R} ry={R * 0.35} fill="none" stroke="url(#orbit)" strokeWidth="1" />
                    <ellipse cx={cx} cy={cy} rx={R * 0.7} ry={R * 0.95} fill="none" stroke="url(#orbit)" strokeWidth="1" opacity="0.6" />
                </svg>
            </div>

            {/* rotating sphere */}
            <motion.div
                className="absolute inset-0"
                animate={{ rotate: 360 }}
                transition={{ duration: 50, ease: "linear", repeat: Infinity }}
            >
                <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full">
                    <defs>
                        <radialGradient id="node" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#e8f6ff" />
                            <stop offset="60%" stopColor="#7ad7ff" />
                            <stop offset="100%" stopColor="#b08bff" />
                        </radialGradient>
                        <linearGradient id="edge" x1="0" x2="1">
                            <stop offset="0%" stopColor="#7ad7ff" stopOpacity="0.55" />
                            <stop offset="100%" stopColor="#b08bff" stopOpacity="0.55" />
                        </linearGradient>
                    </defs>
                    {edges.map(([i, j], k) => {
                        const a = pts[i], b = pts[j];
                        const za = (a.z + 1) / 2, zb = (b.z + 1) / 2;
                        return (
                            <line
                                key={k}
                                x1={cx + a.x * R}
                                y1={cy + a.y * R}
                                x2={cx + b.x * R}
                                y2={cy + b.y * R}
                                stroke="url(#edge)"
                                strokeWidth={0.6 + (za + zb) * 0.4}
                                opacity={0.35 + ((za + zb) / 2) * 0.55}
                            />
                        );
                    })}
                    {pts.map((p, i) => {
                        const z = (p.z + 1) / 2;
                        return (
                            <circle
                                key={i}
                                cx={cx + p.x * R}
                                cy={cy + p.y * R}
                                r={1.6 + z * 2.4}
                                fill="url(#node)"
                                opacity={0.5 + z * 0.5}
                            />
                        );
                    })}
                </svg>
            </motion.div>

            {/* core */}
            <div
                className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full animate-pulse-glow"
                style={{
                    background: "radial-gradient(circle, #fff, #7ad7ff 40%, #6a3bff 80%, transparent)",
                    filter: "blur(2px)",
                }}
            />
        </div>
    );
}