import { PageHeader } from "@/components/dashboard/PageHeader";
import { packages } from "@/lib/mock-dashboard";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Coins, Lock, TrendingUp } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_app/staking")({
    head: () => ({ meta: [{ title: "Staking — DefiSphere" }] }),
    component: StakingPage,
});

const plans = [
    { name: "Nebula Stable", dpy: 0.62, lock: "30 days", min: 100, tone: "cyan" },
    { name: "Quantum Yield Pro", dpy: 1.42, lock: "180 days", min: 1000, tone: "purple" },
    { name: "Stellar Boost", dpy: 0.91, lock: "90 days", min: 500, tone: "pink" },
] as const;

function StakingPage() {
    const [amount, setAmount] = useState("");
    const [plan, setPlan] = useState<(typeof plans)[number]["name"]>(plans[1].name);

    return (
        <div className="space-y-4 sm:space-y-6">
            <PageHeader title="Staking" subtitle="Stake your assets and earn daily rewards." />

            {/* Plan cards — 1 col on mobile, 3 on md+ */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {plans.map((p) => (
                    <motion.button
                        key={p.name}
                        whileHover={{ y: -3 }}
                        onClick={() => setPlan(p.name)}
                        className={`relative overflow-hidden rounded-2xl glass-card p-4 text-left transition ${plan === p.name ? "ring-1 ring-[color:var(--neon-cyan)]/60" : ""
                            }`}
                    >
                        <div className={`absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[color:var(--neon-${p.tone})]/25 blur-2xl`} />
                        <div className="relative flex items-center justify-between sm:block">
                            <div>
                                <p className="font-display text-base font-semibold">{p.name}</p>
                                <p className="text-xs text-muted-foreground">Lock {p.lock} · Min {p.min} USDT</p>
                            </div>
                            <div className="flex items-end gap-1 sm:mt-4">
                                <span className="font-display text-2xl sm:text-3xl font-bold text-gradient">{p.dpy}%</span>
                                <span className="pb-0.5 text-xs text-muted-foreground">DPY</span>
                            </div>
                        </div>
                    </motion.button>
                ))}
            </div>

            {/* Stake form + APY chart */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className="lg:col-span-2 rounded-2xl glass-card p-4 sm:p-6">
                    <p className="text-sm font-semibold">Stake into {plan}</p>
                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                            <label className="text-xs uppercase tracking-wider text-muted-foreground">Amount</label>
                            <input
                                value={amount}
                                onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
                                placeholder="0.00"
                                className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm focus:border-[color:var(--neon-cyan)]/40 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-xs uppercase tracking-wider text-muted-foreground">Asset</label>
                            <select className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm focus:border-[color:var(--neon-cyan)]/40 focus:outline-none">
                                <option className="bg-[#0a0d1e]">USDT</option>
                                <option className="bg-[#0a0d1e]">DFX</option>
                            </select>
                        </div>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2">
                        <Estimate label="Daily" value={`${(Number(amount || 0) * 0.0142).toFixed(2)} USDT`} />
                        <Estimate label="Monthly" value={`${(Number(amount || 0) * 0.0142 * 30).toFixed(2)} USDT`} />
                        <Estimate label="Yearly" value={`${(Number(amount || 0) * 0.0142 * 365).toFixed(2)} USDT`} />
                    </div>
                    <div className="mt-4 flex gap-3">
                        <button
                            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-primary-foreground"
                            style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow-cyan)" }}
                        >
                            <Coins className="h-4 w-4" /> Stake now
                        </button>
                        <button className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold hover:bg-white/[0.08]">
                            <Lock className="h-4 w-4" /> Unstake
                        </button>
                    </div>
                </div>

                <div className="rounded-2xl glass-card p-4 sm:p-6">
                    <div className="mb-3 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-[color:var(--neon-cyan)]" />
                        <p className="text-sm font-semibold">Network APY trend</p>
                    </div>
                    <div className="flex h-36 items-end gap-1">
                        {[40, 55, 48, 62, 70, 58, 75, 80, 72, 88, 82, 95].map((v, i) => (
                            <div
                                key={i}
                                className="flex-1 rounded-t-sm"
                                style={{
                                    height: `${v}%`,
                                    background: "linear-gradient(180deg, var(--neon-cyan), var(--neon-purple))",
                                    opacity: 0.65 + (i / 24),
                                }}
                            />
                        ))}
                    </div>
                    <p className="mt-2 text-[11px] text-muted-foreground">Last 12 weeks · Avg DPY 1.28%</p>
                </div>
            </div>

            {/* Active Packages — table on desktop, cards on mobile */}
            <div className="rounded-2xl glass-card p-4 sm:p-6">
                <h3 className="font-display text-lg font-semibold">Active Packages</h3>

                {/* Mobile cards */}
                <div className="mt-4 flex flex-col gap-3 sm:hidden">
                    {packages.map((p) => (
                        <div key={p.id} className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-semibold">{p.name}</p>
                                <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${p.status === "Active"
                                        ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                                        : "border-[color:var(--neon-cyan)]/30 bg-[color:var(--neon-cyan)]/10 text-[color:var(--neon-cyan)]"
                                    }`}>{p.status}</span>
                            </div>
                            <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                                <div className="text-muted-foreground">Staked</div>
                                <div className="text-right">{p.staked.toLocaleString()} USDT</div>
                                <div className="text-muted-foreground">DPY</div>
                                <div className="text-right text-[color:var(--neon-cyan)]">{p.dpy}%</div>
                                <div className="text-muted-foreground">Start</div>
                                <div className="text-right text-muted-foreground">{p.start}</div>
                                <div className="text-muted-foreground">Expiry</div>
                                <div className="text-right text-muted-foreground">{p.expiry}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Desktop table */}
                <div className="mt-4 hidden overflow-x-auto sm:block">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                                <th className="px-3 py-2 font-medium">Package</th>
                                <th className="px-3 py-2 font-medium">Staked</th>
                                <th className="px-3 py-2 font-medium">DPY</th>
                                <th className="px-3 py-2 font-medium">Status</th>
                                <th className="px-3 py-2 font-medium">Start</th>
                                <th className="px-3 py-2 font-medium">Expiry</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {packages.map((p) => (
                                <tr key={p.id} className="hover:bg-white/[0.03]">
                                    <td className="px-3 py-3 font-medium">{p.name}</td>
                                    <td className="px-3 py-3">{p.staked.toLocaleString()} USDT</td>
                                    <td className="px-3 py-3 text-[color:var(--neon-cyan)]">{p.dpy}%</td>
                                    <td className="px-3 py-3">
                                        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${p.status === "Active"
                                                ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                                                : "border-[color:var(--neon-cyan)]/30 bg-[color:var(--neon-cyan)]/10 text-[color:var(--neon-cyan)]"
                                            }`}>{p.status}</span>
                                    </td>
                                    <td className="px-3 py-3 text-muted-foreground">{p.start}</td>
                                    <td className="px-3 py-3 text-muted-foreground">{p.expiry}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function Estimate({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-xl border border-white/5 bg-white/[0.03] p-2.5">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
            <p className="mt-1 truncate text-xs font-semibold sm:text-sm">{value}</p>
        </div>
    );
}