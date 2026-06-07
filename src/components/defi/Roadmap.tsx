import { motion } from "framer-motion";

const phases = [
    { q: "Q1 2025", title: "Genesis Launch", points: ["Mainnet deployment", "DFX token genesis", "Single-asset staking"], done: true },
    { q: "Q2 2025", title: "Liquidity Expansion", points: ["7-chain LP routing", "Boosted vaults", "Gauge voting"], done: true },
    { q: "Q3 2025", title: "Governance v2", points: ["Quadratic voting", "Delegation markets", "Treasury automation"], done: false, active: true },
    { q: "Q4 2025", title: "Mobile + Referrals 2.0", points: ["Native iOS / Android", "Tiered referral rewards", "Social proof attestations"], done: false },
    { q: "Q1 2026", title: "Real-World Assets", points: ["Tokenized treasuries", "RWA-backed vaults", "Institutional onboarding"], done: false },
];

export function Roadmap() {
    return (
        <section id="roadmap" className="relative py-24 md:py-32">
            <div className="mx-auto max-w-7xl px-5 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <div className="inline-flex rounded-full glass-card px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                        Roadmap
                    </div>
                    <h2 className="mt-4 font-display text-3xl font-bold leading-tight md:text-5xl">
                        The road to a <span className="text-gradient">fully on-chain</span> reward economy
                    </h2>
                </div>

                <div className="relative mt-16">
                    <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-transparent via-white/15 to-transparent md:left-1/2" />
                    <div className="space-y-10">
                        {phases.map((p, i) => (
                            <motion.div
                                key={p.q}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-80px" }}
                                transition={{ duration: 0.5 }}
                                className={`relative grid grid-cols-1 gap-4 md:grid-cols-2 ${i % 2 ? "md:[&>div:first-child]:order-2" : ""}`}
                            >
                                <div className={`pl-12 md:pl-0 ${i % 2 ? "md:pl-12" : "md:pr-12 md:text-right"}`}>
                                    <div className="inline-flex rounded-full glass-card px-3 py-1 text-xs font-medium text-[color:var(--neon-cyan)]">
                                        {p.q}
                                    </div>
                                    <h3 className="mt-3 font-display text-2xl font-semibold">{p.title}</h3>
                                    <ul className={`mt-3 space-y-1 text-sm text-muted-foreground ${i % 2 ? "" : "md:ml-auto"}`}>
                                        {p.points.map(pt => <li key={pt}>· {pt}</li>)}
                                    </ul>
                                </div>
                                <div />
                                <span
                                    className="absolute left-4 top-2 grid h-6 w-6 -translate-x-1/2 place-items-center rounded-full md:left-1/2"
                                    style={{
                                        background: p.done
                                            ? "var(--gradient-primary)"
                                            : p.active
                                                ? "radial-gradient(circle, #b08bff, #6a3bff)"
                                                : "rgba(255,255,255,0.08)",
                                        boxShadow: p.done || p.active ? "var(--shadow-glow-cyan)" : "none",
                                    }}
                                >
                                    <span className="h-2 w-2 rounded-full bg-white" />
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
