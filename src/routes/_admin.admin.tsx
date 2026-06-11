import { adminStore } from "@/lib/mock-admin";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeftRight, Coins, TrendingUp, Users } from "lucide-react";
import { useSyncExternalStore } from "react";

export const Route = createFileRoute("/_admin/admin")({
    head: () => ({ meta: [{ title: "Admin — DefiSphere" }] }),
    component: AdminOverview,
});

function useAdmin() {
    const subscribe = (fn: () => void) => adminStore.subscribe(fn);
    const users = useSyncExternalStore(subscribe, () => adminStore.getUsers(), () => adminStore.getUsers());
    const txs = useSyncExternalStore(subscribe, () => adminStore.getTxs(), () => adminStore.getTxs());
    const plans = useSyncExternalStore(subscribe, () => adminStore.getPlans(), () => adminStore.getPlans());
    return { users, txs, plans };
}

function StatCard({
    label,
    value,
    icon: Icon,
    to,
    tone,
}: {
    label: string;
    value: string;
    icon: typeof Users;
    to: string;
    tone: string;
}) {
    return (
        <Link
            to={to}
            className="group rounded-2xl border border-white/5 bg-white/[0.03] p-5 transition hover:border-white/15 hover:bg-white/[0.06]"
        >
            <div className="flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                    {label}
                </p>
                <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${tone}`}>
                    <Icon className="h-4 w-4" />
                </span>
            </div>
            <p className="mt-3 font-display text-2xl font-bold md:text-3xl">{value}</p>
            <p className="mt-1 text-xs text-muted-foreground group-hover:text-foreground">
                Manage →
            </p>
        </Link>
    );
}

function AdminOverview() {
    const { users, txs, plans } = useAdmin();
    const totalBalance = users.reduce((s, u) => s + u.balance, 0);
    const totalStaked = users.reduce((s, u) => s + u.staked, 0);
    const pending = txs.filter((t) => t.status === "Pending").length;
    const activePlans = plans.filter((p) => p.active).length;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-display text-3xl font-bold md:text-4xl">Admin Overview</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Operational snapshot of users, transactions and staking plans.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    label="Total Users"
                    value={users.length.toString()}
                    icon={Users}
                    to="/admin/users"
                    tone="border border-[color:var(--neon-cyan)]/30 bg-[color:var(--neon-cyan)]/10 text-[color:var(--neon-cyan)]"
                />
                <StatCard
                    label="Pending Tx"
                    value={pending.toString()}
                    icon={ArrowLeftRight}
                    to="/admin/transactions"
                    tone="border border-amber-400/30 bg-amber-400/10 text-amber-300"
                />
                <StatCard
                    label="Active Plans"
                    value={activePlans.toString()}
                    icon={Coins}
                    to="/admin/staking"
                    tone="border border-[color:var(--neon-purple)]/30 bg-[color:var(--neon-purple)]/10 text-[color:var(--neon-purple)]"
                />
                <StatCard
                    label="Total Staked"
                    value={`$${totalStaked.toLocaleString()}`}
                    icon={TrendingUp}
                    to="/admin/staking"
                    tone="border border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                />
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                <div className="rounded-2xl glass-card p-6 xl:col-span-2">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="font-display text-lg font-semibold">Latest Transactions</h3>
                        <Link to="/admin/transactions" className="text-xs text-[color:var(--neon-cyan)] hover:underline">
                            View all
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="text-left text-[10px] uppercase tracking-wider text-muted-foreground">
                                <tr>
                                    <th className="pb-2 pr-3 font-medium">User</th>
                                    <th className="pb-2 pr-3 font-medium">Type</th>
                                    <th className="pb-2 pr-3 font-medium">Amount</th>
                                    <th className="pb-2 pr-3 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {txs.slice(0, 6).map((t) => (
                                    <tr key={t.id}>
                                        <td className="py-2.5 pr-3 text-muted-foreground">{t.user}</td>
                                        <td className="py-2.5 pr-3">{t.type}</td>
                                        <td className="py-2.5 pr-3 font-semibold">
                                            {t.amount.toLocaleString()} {t.asset}
                                        </td>
                                        <td className="py-2.5 pr-3">
                                            <StatusPill status={t.status} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="rounded-2xl glass-card p-6">
                    <h3 className="font-display text-lg font-semibold">Treasury</h3>
                    <p className="mt-2 text-xs text-muted-foreground">
                        Aggregate balance across all user wallets.
                    </p>
                    <p className="mt-4 font-display text-3xl font-bold">
                        ${totalBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </p>
                    <div className="mt-4 space-y-2 text-sm">
                        <Row label="Total staked" value={`$${totalStaked.toLocaleString()}`} />
                        <Row label="Active users" value={users.filter((u) => u.status === "Active").length.toString()} />
                        <Row label="Suspended" value={users.filter((u) => u.status === "Suspended").length.toString()} />
                        <Row label="Pending KYC" value={users.filter((u) => u.kyc === "Pending").length.toString()} />
                    </div>
                </div>
            </div>
        </div>
    );
}

function Row({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between border-t border-white/5 pt-2">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-semibold">{value}</span>
        </div>
    );
}

export function StatusPill({ status }: { status: string }) {
    const map: Record<string, string> = {
        Pending: "border-amber-400/30 bg-amber-400/10 text-amber-300",
        Approved: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
        Completed: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
        Rejected: "border-rose-400/30 bg-rose-400/10 text-rose-300",
        Active: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
        Suspended: "border-rose-400/30 bg-rose-400/10 text-rose-300",
        Verified: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
    };
    const cls = map[status] ?? "border-white/10 bg-white/5 text-muted-foreground";
    return (
        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${cls}`}>
            {status}
        </span>
    );
}
