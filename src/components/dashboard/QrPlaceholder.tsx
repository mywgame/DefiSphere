/** Deterministic decorative QR-style block (not a real QR code). */
export function QrPlaceholder({ size = 180, seed = "defisphere" }: { size?: number; seed?: string }) {
    const cells = 21;
    let h = 0;
    for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
    const rand = (i: number) => {
        const x = Math.sin(h + i * 9301 + 49297) * 233280;
        return x - Math.floor(x);
    };
    const blocks = [];
    for (let y = 0; y < cells; y++) {
        for (let x = 0; x < cells; x++) {
            const corner =
                (x < 7 && y < 7) || (x >= cells - 7 && y < 7) || (x < 7 && y >= cells - 7);
            const on = corner ? (x === 0 || x === 6 || y === 0 || y === 6 || (x > 1 && x < 5 && y > 1 && y < 5)) : rand(y * cells + x) > 0.55;
            if (on) blocks.push(<rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill="currentColor" />);
        }
    }
    return (
        <div
            className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white p-3"
            style={{ width: size, height: size }}
        >
            <svg viewBox={`0 0 ${cells} ${cells}`} className="h-full w-full text-[#050816]">
                {blocks}
            </svg>
        </div>
    );
}