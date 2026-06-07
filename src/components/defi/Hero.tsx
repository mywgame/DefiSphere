import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Coins, Droplets, FileText, Users, Vote } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { BlockchainSphere } from "./BlockchainSphere";
import { ParticleField } from "./ParticleField";

function StatChip({ icon, label, value, accent }: { icon: ReactNode; label: string; value: string; accent: string }) {
    return (
        <div className="flex items-center gap-3 rounded-xl glass-card px-3.5 py-2.5">
            <span
                className="grid h-9 w-9 place-items-center rounded-lg"
                style={{ background: accent, boxShadow: `0 0 22px ${accent}` }}
            >
                {icon}
            </span>
            <div className="leading-tight">
                <div className="font-display text-base font-semibold">{value}</div>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
            </div>
        </div>
    );
}

export function Hero() {
    const mx = useMotionValue(0);
    const my = useMotionValue(0);
    const sx = useSpring(mx, { stiffness: 60, damping: 14 });
    const sy = useSpring(my, { stiffness: 60, damping: 14 });
    const tx = useTransform(sx, v => v * 18);
    const ty = useTransform(sy, v => v * 18);
    const txN = useTransform(sx, v => v * -10);
    const tyN = useTransform(sy, v => v * -10);

    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            const x = e.clientX / window.innerWidth - 0.5;
            const y = e.clientY / window.innerHeight - 0.5;
            mx.set(x); my.set(y);
        };
        window.addEventListener("mousemove", onMove);
        return () => window.removeEventListener("mousemove", onMove);
    }, [mx, my]);

    return (
        <section className="relative overflow-hidden pt-32 pb-24 md:pt-40 md:pb-32">
            {/* background layers */}
            <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />
            <div
                className="pointer-events-none absolute inset-0"
                style={{ background: "var(--gradient-hero)" }}
            />
            <div className="pointer-events-none absolute inset-0 opacity-60">
                <ParticleField />
            </div>

            <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-5 lg:grid-cols-[1.05fr_1fr] lg:gap-8 lg:px-8">
                {/* left */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                >
                    <div className="inline-flex items-center gap-2 rounded-full glass-card px-3 py-1.5 text-xs">
                        <span className="relative inline-flex h-2 w-2">
                            <span className="absolute inset-0 animate-ping rounded-full bg-[color:var(--neon-cyan)] opacity-75" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-[color:var(--neon-cyan)]" />
                        </span>
                        <span className="text-muted-foreground">DFX Mainnet · Live</span>
                    </div>

                    <h1 className="mt-6 font-display text-5xl font-extrabold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
                        Earn Rewards <br />
                        Through <span className="text-gradient">DeFi</span> <br />
                        Participation
                    </h1>

                    <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                        Stake assets, provide liquidity, refer users, participate in governance
                        and earn <span className="text-foreground">DFX</span> rewards across a unified on-chain ecosystem.
                    </p>

                    <div className="mt-8 flex flex-wrap items-center gap-3">
                        <a
                            href="#login"
                            className="group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform duration-200 hover:scale-[1.03]"
                            style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow-cyan)" }}
                        >
                            Login
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </a>
                        <a
                            href="#whitepaper"
                            className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-foreground backdrop-blur transition hover:border-[color:var(--neon-cyan)] hover:bg-white/10"
                        >
                            <FileText className="h-4 w-4" />
                            View Whitepaper
                        </a>
                    </div>

                    <div className="mt-10 grid grid-cols-2 gap-3 sm:max-w-lg sm:grid-cols-4">
                        <div className="rounded-xl glass-card px-4 py-3">
                            <div className="font-display text-xl font-bold">$184M+</div>
                            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">TVL</div>
                        </div>
                        <div className="rounded-xl glass-card px-4 py-3">
                            <div className="font-display text-xl font-bold">62K</div>
                            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Stakers</div>
                        </div>
                        <div className="rounded-xl glass-card px-4 py-3">
                            <div className="font-display text-xl font-bold">18.4%</div>
                            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Avg APY</div>
                        </div>
                        <div className="rounded-xl glass-card px-4 py-3">
                            <div className="font-display text-xl font-bold">7</div>
                            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Chains</div>
                        </div>
                    </div>
                </motion.div>

                {/* right visual */}
                <div className="relative mx-auto flex h-[520px] w-full max-w-[560px] items-center justify-center">
                    <motion.div style={{ x: tx, y: ty }} className="relative">
                        <BlockchainSphere size={440} />
                    </motion.div>

                    {/* floating cards */}
                    <motion.div
                        style={{ x: txN, y: tyN }}
                        className="absolute -left-2 top-6 w-[230px] rounded-2xl glass-card p-4 animate-float"
                    >
                        <div className="flex items-center justify-between">
                            <StatChip
                                icon={<Coins className="h-4 w-4 text-primary-foreground" />}
                                label="Staking"
                                value="14.2% APY"
                                accent="linear-gradient(135deg,#7ad7ff,#4aa8ff)"
                            />
                        </div>
                        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                            <div className="h-full w-3/4 rounded-full" style={{ background: "var(--gradient-primary)" }} />
                        </div>
                        <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
                            <span>Staked 12,480 DFX</span>
                            <span>+248 today</span>
                        </div>
                    </motion.div>

                    <motion.div
                        style={{ x: tx, y: ty }}
                        className="absolute -right-2 top-24 w-[240px] rounded-2xl glass-card p-4 animate-float"
                        transition={{ delay: 0.3 }}
                    >
                        <StatChip
                            icon={<Droplets className="h-4 w-4 text-primary-foreground" />}
                            label="Liquidity Pool"
                            value="DFX / ETH"
                            accent="linear-gradient(135deg,#b08bff,#6a3bff)"
                        />
                        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                            <div className="rounded-lg bg-white/5 py-1.5">
                                <div className="text-xs font-semibold">$2.4M</div>
                                <div className="text-[10px] text-muted-foreground">TVL</div>
                            </div>
                            <div className="rounded-lg bg-white/5 py-1.5">
                                <div className="text-xs font-semibold">22.8%</div>
                                <div className="text-[10px] text-muted-foreground">APR</div>
                            </div>
                            <div className="rounded-lg bg-white/5 py-1.5">
                                <div className="text-xs font-semibold">1.4x</div>
                                <div className="text-[10px] text-muted-foreground">Boost</div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        style={{ x: txN, y: ty }}
                        className="absolute bottom-8 left-2 w-[230px] rounded-2xl glass-card p-4 animate-float"
                    >
                        <StatChip
                            icon={<Vote className="h-4 w-4 text-primary-foreground" />}
                            label="Governance"
                            value="Proposal #042"
                            accent="linear-gradient(135deg,#7ad7ff,#b08bff)"
                        />
                        <div className="mt-3 space-y-1.5 text-[11px]">
                            <div className="flex justify-between"><span>For</span><span className="text-[color:var(--neon-cyan)]">68%</span></div>
                            <div className="h-1 overflow-hidden rounded-full bg-white/5">
                                <div className="h-full rounded-full bg-[color:var(--neon-cyan)]" style={{ width: "68%" }} />
                            </div>
                            <div className="flex justify-between"><span>Against</span><span className="text-[color:var(--neon-purple)]">32%</span></div>
                            <div className="h-1 overflow-hidden rounded-full bg-white/5">
                                <div className="h-full rounded-full bg-[color:var(--neon-purple)]" style={{ width: "32%" }} />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        style={{ x: tx, y: tyN }}
                        className="absolute -right-2 bottom-10 w-[220px] rounded-2xl glass-card p-4 animate-float"
                    >
                        <StatChip
                            icon={<Users className="h-4 w-4 text-primary-foreground" />}
                            label="Referrals"
                            value="+842 DFX"
                            accent="linear-gradient(135deg,#ff7ad0,#b08bff)"
                        />
                        <div className="mt-3 flex -space-x-2">
                            {["#7ad7ff", "#b08bff", "#ff7ad0", "#4aa8ff"].map((c, i) => (
                                <span key={i} className="h-7 w-7 rounded-full border-2 border-[#0a0f23]" style={{ background: c }} />
                            ))}
                            <span className="grid h-7 w-7 place-items-center rounded-full border-2 border-[#0a0f23] bg-white/10 text-[10px] font-semibold">
                                +28
                            </span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
