import { PageHeader } from "@/components/dashboard/PageHeader";
import { transactions } from "@/lib/mock-dashboard";
import { createFileRoute } from "@tanstack/react-router";
import { Filter, Search } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_app/transactions")({
    head: () => ({ meta: [{ title: "Transactions — DefiSphere" }] }),
    component: TransactionsPage,
});

const types = ["All", "Deposit", "Withdrawal", "Staking", "Unstaking", "Reward Claim", "Referral Bonus"] as const;

function TransactionsPage() {
    const [type, setType] = useState<(typeof types)[number]>("All");
    const [q, setQ] = useState("");

    const rows = transactions.filter(
        (t) =>
            (type === "All" || t.type === type) &&
            (q === "" || t.hash.includes(q) || t.type.toLowerCase().includes(q.toLowerCase())),
    );

    return (
        <div className="space-y-6">
            <PageHeader title="Transactions" subtitle="Full history of activity on your account." />

            <div className="flex flex-col gap-3">
                {/* Search */}
                <div className="relative w-full">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Search by type or hash"
                        className="h-10 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-9 pr-3 text-sm focus:border-[color:var(--neon-cyan)]/40 focus:outline-none"
                    />
                </div>

                {/* Filter chips — wrapping rows like v1 */}
                <div className="flex flex-wrap items-center gap-2">
                    <Filter className="h-4 w-4 shrink-0 text-muted-foreground" />
                    {types.map((t) => (
                        <button
                            key={t}
                            onClick={() => setType(t)}
                            className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${type === t
                                    ? "border-[color:var(--neon-cyan)]/50 bg-[color:var(--neon-cyan)]/10 text-[color:var(--neon-cyan)]"
                                    : "border-white/10 bg-white/[0.04] text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            {/* Mobile: cards — Desktop: table */}
            <div>
                {/* Mobile cards (hidden on md+) */}
                <div className="flex flex-col gap-3 md:hidden">
                    {rows.length === 0 ? (
                        <p className="py-10 text-center text-sm text-muted-foreground">No transactions match your filters.</p>
                    ) : (
                        rows.map((t) => (
                            <div key={t.id} className="rounded-2xl glass-card p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="font-semibold">{t.type}</p>
                                        <p className="mt-0.5 text-xs text-muted-foreground">{t.date}</p>
                                    </div>
                                    <div className="shrink-0 text-right">
                                        <p className="text-sm font-semibold">
                                            {t.amount.toLocaleString()} <span className="text-xs text-muted-foreground">{t.asset}</span>
                                        </p>
                                        <span className={`mt-1 inline-block rounded-full border px-2 py-0.5 text-[10px] font-semibold ${t.status === "Completed" ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                                                : t.status === "Pending" ? "border-amber-400/30 bg-amber-400/10 text-amber-300"
                                                    : "border-rose-400/30 bg-rose-400/10 text-rose-300"
                                            }`}>{t.status}</span>
                                    </div>
                                </div>
                                <p className="mt-2 font-mono text-[11px] text-[color:var(--neon-cyan)]">{t.hash}</p>
                            </div>
                        ))
                    )}
                </div>

                {/* Desktop table (hidden below md) */}
                <div className="hidden md:block rounded-2xl glass-card p-2 md:p-4">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[720px] text-sm">
                            <thead>
                                <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                                    <th className="px-3 py-3 font-medium">Type</th>
                                    <th className="px-3 py-3 font-medium">Amount</th>
                                    <th className="px-3 py-3 font-medium">Asset</th>
                                    <th className="px-3 py-3 font-medium">Status</th>
                                    <th className="px-3 py-3 font-medium">Date</th>
                                    <th className="px-3 py-3 font-medium">Tx Hash</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {rows.map((t) => (
                                    <tr key={t.id} className="hover:bg-white/[0.03]">
                                        <td className="px-3 py-3 font-medium">{t.type}</td>
                                        <td className="px-3 py-3">{t.amount.toLocaleString()}</td>
                                        <td className="px-3 py-3 text-muted-foreground">{t.asset}</td>
                                        <td className="px-3 py-3">
                                            <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${t.status === "Completed" ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                                                    : t.status === "Pending" ? "border-amber-400/30 bg-amber-400/10 text-amber-300"
                                                        : "border-rose-400/30 bg-rose-400/10 text-rose-300"
                                                }`}>{t.status}</span>
                                        </td>
                                        <td className="px-3 py-3 text-muted-foreground">{t.date}</td>
                                        <td className="px-3 py-3 font-mono text-[11px] text-[color:var(--neon-cyan)]">{t.hash}</td>
                                    </tr>
                                ))}
                                {rows.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-3 py-10 text-center text-sm text-muted-foreground">
                                            No transactions match your filters.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}