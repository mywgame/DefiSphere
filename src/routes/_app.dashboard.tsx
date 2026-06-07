import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { activeStake, packages, stats, transactions } from "@/lib/mock-dashboard";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
    ArrowDownToLine,
    ArrowUpFromLine,
    Coins,
    Gift,
    PiggyBank,
    Sparkles,
    TrendingUp,
    Unlock,
    Users,
    Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_app/dashboard")({
    head: () => ({ meta: [{ title: "Dashboard — DefiSphere" }] }),
    component: DashboardPage,
});

function fmtCountdown(s: number) {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

function DashboardPage() {
    const [remaining, setRemaining] = useState(activeStake.nextRewardInSec);
    useEffect(() => {
        const id = setInterval(() => setRemaining((s) => (s > 0 ? s - 1 : 0)), 1000);
        return () => clearInterval(id);
    }, []);

    const quick = [
        { to: "/deposit", label: "Deposit", icon: ArrowDownToLine, tone: "cyan" },
        { to: "/withdraw", label: "Withdraw", icon: ArrowUpFromLine, tone: "purple" },
        { to: "/staking", label: "Stake", icon: Coins, tone: "cyan" },
        { to: "/staking", label: "Unstake", icon: Unlock, tone: "purple" },
        { to: "/rewards", label: "Claim", icon: Sparkles, tone: "pink" },
        { to: "/referrals", label: "Referral", icon: Users, tone: "emerald" },
    ] as const;

    return (
        <div className="space-y-6">
            <PageHeader
                title="Welcome back"
                subtitle="Here's a snapshot of your staking activity and rewards."
                actions={
                    <Link
                        to="/staking"
                        className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-primary-foreground"
                        style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow-cyan)" }}
                    >
                        <Coins className="h-4 w-4" /> Stake more
                    </Link>
                }
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard index={0} label="Wallet Balance" value={stats.wallet} icon={Wallet} tone="cyan" delta={2.4} />
                <StatCard index={1} label="Withdrawable BALANCE" value={stats.withdrawable} icon={PiggyBank} tone="purple" delta={1.1} />
                <StatCard index={2} label="Pending Rewards" value={stats.pending} icon={Sparkles} tone="pink" delta={0.6} />
                <StatCard index={3} label="Total Earnings" value={stats.total} icon={TrendingUp} tone="emerald" delta={8.2} />
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                <motion.div
                    initial={{ y: 16, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="relative overflow-hidden rounded-2xl glass-card p-6 xl:col-span-2"
                >
                    <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[color:var(--neon-purple)]/20 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-[color:var(--neon-cyan)]/15 blur-3xl" />
                    <div className="relative">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                                    Active Package
                                </p>
                                <h2 className="mt-1 font-display text-2xl font-bold md:text-3xl">
                                    {activeStake.package}
                                </h2>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Earning rewards daily on your staked balance.
                                </p>
                            </div>
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_theme(colors.emerald.300)]" />
                                Earning
                            </span>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
                            <Kpi label="Amount Staked" value={`${activeStake.staked.toLocaleString()} USDT`} />
                            <Kpi label="Current DPY" value={`${activeStake.dpy}%`} />
                            <Kpi label="Next reward in" value={fmtCountdown(remaining)} mono />
                        </div>

                        <div className="mt-6">
                            <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                                <span>Reward cycle progress</span>
                                <span>{activeStake.progress}%</span>
                            </div>
                            <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/5">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${activeStake.progress}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className="h-full rounded-full"
                                    style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow-cyan)" }}
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex flex-wrap gap-3">
                            <button
                                className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-primary-foreground"
                                style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow-cyan)" }}
                            >
                                <Sparkles className="h-4 w-4" /> Claim Rewards
                            </button>
                            <Link
                                to="/staking"
                                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold hover:bg-white/[0.08]"
                            >
                                <Coins className="h-4 w-4" /> Stake More
                            </Link>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ y: 16, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    className="rounded-2xl glass-card p-6"
                >
                    <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                        Quick Actions
                    </p>
                    <div className="mt-4 grid grid-cols-3 gap-3">
                        {quick.map((q) => (
                            <Link
                                key={q.label}
                                to={q.to}
                                className="group flex flex-col items-center gap-2 rounded-xl border border-white/5 bg-white/[0.03] p-3 text-center transition hover:border-[color:var(--neon-cyan)]/30 hover:bg-white/[0.06]"
                            >
                                <span
                                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-foreground/90 group-hover:text-[color:var(--neon-cyan)]"
                                >
                                    <q.icon className="h-4 w-4" />
                                </span>
                                <span className="text-[11px] font-medium text-muted-foreground group-hover:text-foreground">
                                    {q.label}
                                </span>
                            </Link>
                        ))}
                    </div>

                    <div className="mt-5 rounded-xl border border-white/5 bg-gradient-to-br from-[color:var(--neon-cyan)]/10 to-[color:var(--neon-purple)]/10 p-4">
                        <div className="flex items-center gap-2">
                            <Gift className="h-4 w-4 text-[color:var(--neon-cyan)]" />
                            <p className="text-sm font-semibold">Bonus campaign</p>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Stake before Friday and get <span className="text-foreground">+0.25% DPY</span> for 30 days.
                        </p>
                    </div>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                <div className="xl:col-span-2 rounded-2xl glass-card p-6">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="font-display text-lg font-semibold">Active Packages</h3>
                        <Link to="/staking" className="text-xs text-[color:var(--neon-cyan)] hover:underline">
                            View all
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {packages.map((p) => (
                            <div key={p.id} className="rounded-xl border border-white/5 bg-white/[0.03] p-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="font-display text-base font-semibold">{p.name}</p>
                                        <p className="mt-0.5 text-xs text-muted-foreground">
                                            {p.start} → {p.expiry}
                                        </p>
                                    </div>
                                    <StatusBadge status={p.status} />
                                </div>
                                <div className="mt-4 grid grid-cols-2 gap-3">
                                    <Kpi small label="Staked" value={`${p.staked.toLocaleString()} USDT`} />
                                    <Kpi small label="DPY" value={`${p.dpy}%`} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-2xl glass-card p-6">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="font-display text-lg font-semibold">Recent Transactions</h3>
                        <Link to="/transactions" className="text-xs text-[color:var(--neon-cyan)] hover:underline">
                            View all
                        </Link>
                    </div>
                    <ul className="divide-y divide-white/5">
                        {transactions.slice(0, 5).map((t) => (
                            <li key={t.id} className="flex items-center justify-between py-3">
                                <div>
                                    <p className="text-sm font-medium">{t.type}</p>
                                    <p className="text-[11px] text-muted-foreground">{t.date}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold">
                                        {t.amount.toLocaleString()} {t.asset}
                                    </p>
                                    <p className={`text-[11px] ${t.status === "Completed" ? "text-emerald-300" : t.status === "Pending" ? "text-amber-300" : "text-rose-300"}`}>
                                        {t.status}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

function Kpi({ label, value, mono, small }: { label: string; value: string; mono?: boolean; small?: boolean }) {
    return (
        <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
            <p className={`mt-1 font-semibold ${small ? "text-sm" : "text-base md:text-lg"} ${mono ? "font-mono" : ""}`}>
                {value}
            </p>
        </div>
    );
}

function StatusBadge({ status }: { status: "Active" | "Locked" | "Ended" }) {
    const map = {
        Active: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
        Locked: "border-[color:var(--neon-cyan)]/30 bg-[color:var(--neon-cyan)]/10 text-[color:var(--neon-cyan)]",
        Ended: "border-white/10 bg-white/5 text-muted-foreground",
    };
    return (
        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${map[status]}`}>
            {status}
        </span>
    );
}
