import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const bullets = [
    "Non-custodial — your keys, your DFX, always",
    "Cross-chain rewards bridged in a single click",
    "Open-source contracts with public audits",
    "Community treasury governed by DFX holders",
];

export function About() {
    return (
        <section id="about" className="relative py-24 md:py-32">
            <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-5 lg:grid-cols-2 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex rounded-full glass-card px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                        About Us
                    </div>
                    <h2 className="mt-4 font-display text-3xl font-bold leading-tight md:text-5xl">
                        A protocol built by <span className="text-gradient">DeFi natives</span>, owned by you
                    </h2>
                    <p className="mt-5 text-muted-foreground">
                        DefiSphere was founded in 2023 by a team of former smart-contract engineers from
                        Uniswap, Lido and Curve. Our mission is simple: make on-chain participation effortless
                        and economically meaningful for anyone, anywhere.
                    </p>
                    <ul className="mt-7 space-y-3">
                        {bullets.map(b => (
                            <li key={b} className="flex items-start gap-3 text-sm">
                                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[color:var(--neon-cyan)]" />
                                <span className="text-foreground/90">{b}</span>
                            </li>
                        ))}
                    </ul>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="grid grid-cols-2 gap-4"
                >
                    {[
                        { v: "$184M+", l: "Total Value Locked" },
                        { v: "62,400", l: "Active Wallets" },
                        { v: "1.2M", l: "DFX Distributed" },
                        { v: "99.98%", l: "Uptime since launch" },
                    ].map((s, i) => (
                        <motion.div
                            key={s.l}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="rounded-2xl glass-card p-6"
                        >
                            <div className="font-display text-3xl font-bold md:text-4xl text-gradient">{s.v}</div>
                            <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{s.l}</div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}