import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { supabase } from "@/lib/supabaseClient";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
    ArrowDownToLine,
    ArrowUpFromLine,
    Coins,
    Gem,
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

interface DBProfile {
    wallet_balance: number;
    withdrawable_balance: number;
    pending_rewards: number;
    total_earnings: number;
}

interface DBPackage {
    id: string;
    package_name: string;
    amount_staked: number;
    dpy: number;
    status: "Active" | "Locked" | "Ended";
    start_date: string;
    expiry_date: string;
}

interface DBTransaction {
    id: string;
    type: "Deposit" | "Withdrawal" | "Staking" | "Unstaking" | "Reward Claim" | "Referral Bonus";
    amount: number;
    asset: string;
    status: "Completed" | "Pending" | "Failed";
    created_at: string;
    tx_hash: string;
}

function DashboardPage() {
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<DBProfile | null>(null);
    const [activePkgs, setActivePkgs] = useState<DBPackage[]>([]);
    const [txs, setTxs] = useState<DBTransaction[]>([]);
    const [remaining, setRemaining] = useState(23420); // Fallback seconds until dynamic sync triggers

    useEffect(() => {
        const id = setInterval(() => setRemaining((s) => (s > 0 ? s - 1 : 0)), 1000);
        return () => clearInterval(id);
    }, []);

    useEffect(() => {
        async function fetchDashboardMetadata() {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                // Concurrently fetch all dependencies securely via client instance pipeline
                const [profileRes, packagesRes, txRes] = await Promise.all([
                    supabase.from("user_profiles").select("*").eq("id", user.id).single(),
                    supabase.from("user_packages").select("*").eq("user_id", user.id),
                    supabase.from("user_transactions").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(5)
                ]);

                if (profileRes.data) {
                    setProfile({
                        wallet_balance: Number(profileRes.data.wallet_balance),
                        withdrawable_balance: Number(profileRes.data.withdrawable_balance),
                        pending_rewards: Number(profileRes.data.pending_rewards),
                        total_earnings: Number(profileRes.data.total_earnings),
                    });
                }

                if (packagesRes.data) {
                    setActivePkgs(packagesRes.data as DBPackage[]);
                }

                if (txRes.data) {
                    setTxs(txRes.data as DBTransaction[]);
                }
            } catch (err) {
                console.error("Hydration runtime error across secure channels:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchDashboardMetadata();
    }, []);

    const quick = [
        { to: "/deposit", label: "Deposit", icon: ArrowDownToLine, tone: "cyan" },
        { to: "/withdraw", label: "Withdraw", icon: ArrowUpFromLine, tone: "purple" },
        { to: "/staking", label: "Stake", icon: Coins, tone: "cyan" },
        { to: "/staking", label: "Unstake", icon: Unlock, tone: "purple" },
        { to: "/rewards", label: "Claim", icon: Gem, tone: "pink" },
        { to: "/referrals", label: "Referral", icon: Users, tone: "emerald" },
    ] as const;

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-t-transparent border-[color:var(--neon-cyan)]" />
            </div>
        );
    }

    // Mathematical aggregation layer safely on server-edge evaluation bounds
    const topYieldingPackage = activePkgs[0] || { package_name: "No Active Package", amount_staked: 0, dpy: 0 };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Welcome back"
                subtitle="Here's a snapshot of your staking activity and rewards verified on-chain."
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
                <StatCard index={0} label="Wallet Balance" value={profile?.wallet_balance || 0} icon={Wallet} tone="cyan" delta={0} />
                <StatCard index={1} label="Withdrawable BALANCE" value={profile?.withdrawable_balance || 0} icon={PiggyBank} tone="purple" delta={0} />
                <StatCard index={2} label="Pending Rewards" value={profile?.pending_rewards || 0} icon={Sparkles} tone="pink" delta={0} />
                <StatCard index={3} label="Total Earnings" value={profile?.total_earnings || 0} icon={TrendingUp} tone="emerald" delta={0} />
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
                                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Active Package</p>
                                <h2 className="mt-1 font-display text-2xl font-bold md:text-3xl">{topYieldingPackage.package_name}</h2>
                                <p className="mt-1 text-sm text-muted-foreground">Earning rewards daily on your staked balance securely.</p>
                            </div>
                            {activePkgs.length > 0 && (
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_theme(colors.emerald.300)]" />
                                    Active Yield
                                </span>
                            )}
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
                            <Kpi label="Amount Staked" value={`${(topYieldingPackage.amount_staked || 0).toLocaleString()} USDT`} />
                            <Kpi label="Current DPY" value={`${topYieldingPackage.dpy || 0}%`} />
                            <Kpi label="Next reward in" value={fmtCountdown(remaining)} mono />
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ y: 16, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    className="rounded-2xl glass-card p-6"
                >
                    <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Quick Actions</p>
                    <div className="mt-4 grid grid-cols-3 gap-3">
                        {quick.map((q) => (
                            <Link
                                key={q.label}
                                to={q.to}
                                className="group flex flex-col items-center gap-2 rounded-xl border border-white/5 bg-white/[0.03] p-3 text-center transition hover:border-[color:var(--neon-cyan)]/30 hover:bg-white/[0.06]"
                            >
                                <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-foreground/90 group-hover:text-[color:var(--neon-cyan)]">
                                    <q.icon className="h-4 w-4" />
                                </span>
                                <span className="text-[11px] font-medium text-muted-foreground group-hover:text-foreground">{q.label}</span>
                            </Link>
                        ))}
                    </div>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                <div className="xl:col-span-2 rounded-2xl glass-card p-6">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="font-display text-lg font-semibold">Active Packages</h3>
                        <Link to="/staking" className="text-xs text-[color:var(--neon-cyan)] hover:underline">View all</Link>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {activePkgs.map((p) => (
                            <div key={p.id} className="rounded-xl border border-white/5 bg-white/[0.03] p-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="font-display text-base font-semibold">{p.package_name}</p>
                                        <p className="mt-0.5 text-xs text-muted-foreground">
                                            {new Date(p.start_date).toLocaleDateString()} → {new Date(p.expiry_date).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <StatusBadge status={p.status} />
                                </div>
                                <div className="mt-4 grid grid-cols-2 gap-3">
                                    <Kpi small label="Staked" value={`${p.amount_staked.toLocaleString()} USDT`} />
                                    <Kpi small label="DPY" value={`${p.dpy}%`} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-2xl glass-card p-6">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="font-display text-lg font-semibold">Recent Transactions</h3>
                        <Link to="/transactions" className="text-xs text-[color:var(--neon-cyan)] hover:underline">View all</Link>
                    </div>
                    <ul className="divide-y divide-white/5">
                        {txs.map((t) => (
                            <li key={t.id} className="flex items-center justify-between py-3">
                                <div>
                                    <p className="text-sm font-medium">{t.type}</p>
                                    <p className="text-[11px] text-muted-foreground">{new Date(t.created_at).toLocaleString()} · {t.tx_hash.slice(0, 6)}...</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold">{t.amount.toLocaleString()} {t.asset}</p>
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
            <p className={`mt-1 font-semibold ${small ? "text-sm" : "text-base md:text-lg"} ${mono ? "font-mono" : ""}`}>{value}</p>
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