import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Coins, Droplets, Shield, Users, Vote, Zap } from "lucide-react";

const items: { icon: LucideIcon; title: string; desc: string }[] = [
    { icon: Coins, title: "Flexible Staking", desc: "Single-asset and locked vaults with auto-compounding DFX rewards and up to 22% APY." },
    { icon: Droplets, title: "Liquidity Pools", desc: "Provide DFX pairs across 7 chains. Earn swap fees plus boosted emissions." },
    { icon: Vote, title: "On-chain Governance", desc: "Propose, vote, and execute. Every DFX holder shapes treasury and protocol parameters." },
    { icon: Users, title: "Referral Earnings", desc: "Multi-tier referral program with on-chain attribution and instant DFX payouts." },
    { icon: Shield, title: "Audited & Insured", desc: "Smart contracts audited by Trail of Bits and CertiK. Optional Nexus cover for vaults." },
    { icon: Zap, title: "Gasless Claims", desc: "Sponsored transactions for claims and migrations across L2s — zero friction." },
];

export function Features() {
    return (
        <section id="features" className="relative py-24 md:py-32">
            <div className="mx-auto max-w-7xl px-5 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <div className="inline-flex rounded-full glass-card px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                        Features
                    </div>
                    <h2 className="mt-4 font-display text-3xl font-bold leading-tight md:text-5xl">
                        Every way to <span className="text-gradient">earn DFX</span>, in one protocol
                    </h2>
                    <p className="mt-4 text-muted-foreground">
                        DefiSphere unifies staking, liquidity, governance and referrals into a single dashboard with verifiable on-chain rewards.
                    </p>
                </div>

                <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((f, i) => (
                        <motion.div
                            key={f.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-80px" }}
                            transition={{ duration: 0.5, delay: i * 0.06 }}
                            whileHover={{ y: -4 }}
                            className="group relative overflow-hidden rounded-2xl glass-card p-6"
                        >
                            <div
                                className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                                style={{ background: "radial-gradient(circle, rgba(120,180,255,0.35), transparent 70%)" }}
                            />
                            <div
                                className="grid h-12 w-12 place-items-center rounded-xl"
                                style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow-cyan)" }}
                            >
                                <f.icon className="h-5 w-5 text-primary-foreground" />
                            </div>
                            <h3 className="mt-5 font-display text-lg font-semibold">{f.title}</h3>
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
