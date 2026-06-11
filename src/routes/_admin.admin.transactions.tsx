import { adminStore, type AdminTx } from "@/lib/mock-admin";
import { createFileRoute } from "@tanstack/react-router";
import { Check, X } from "lucide-react";
import { useMemo, useState, useSyncExternalStore } from "react";
import { StatusPill } from "./_admin.admin";

export const Route = createFileRoute("/_admin/admin/transactions")({
    head: () => ({ meta: [{ title: "Transactions — Admin" }] }),
    component: AdminTxPage,
});

const filters = ["All", "Pending", "Approved", "Rejected", "Completed"] as const;

function AdminTxPage() {
    const txs = useSyncExternalStore(
        (fn) => adminStore.subscribe(fn),
        () => adminStore.getTxs(),
        () => adminStore.getTxs(),
    );
    const [f, setF] = useState<(typeof filters)[number]>("All");

    const list = useMemo(
        () => (f === "All" ? txs : txs.filter((t) => t.status === f)),
        [txs, f],
    );

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-display text-3xl font-bold">Transactions</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Approve or reject deposits and withdrawals.
                </p>
            </div>

            <div className="flex flex-wrap gap-2">
                {filters.map((opt) => {
                    const count = opt === "All" ? txs.length : txs.filter((t) => t.status === opt).length;
                    return (
                        <button
                            key={opt}
                            onClick={() => setF(opt)}
                            className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${f === opt
                                    ? "border-[color:var(--neon-cyan)]/50 bg-[color:var(--neon-cyan)]/10 text-[color:var(--neon-cyan)]"
                                    : "border-white/10 bg-white/[0.04] text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            {opt} <span className="ml-1 opacity-60">{count}</span>
                        </button>
                    );
                })}
            </div>

            <div className="overflow-hidden rounded-2xl glass-card">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-white/[0.02] text-left text-[10px] uppercase tracking-wider text-muted-foreground">
                            <tr>
                                <th className="px-4 py-3 font-medium">Date</th>
                                <th className="px-4 py-3 font-medium">User</th>
                                <th className="px-4 py-3 font-medium">Type</th>
                                <th className="px-4 py-3 font-medium">Amount</th>
                                <th className="px-4 py-3 font-medium">Hash</th>
                                <th className="px-4 py-3 font-medium">Status</th>
                                <th className="px-4 py-3 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {list.map((t) => (
                                <tr key={t.id} className="hover:bg-white/[0.02]">
                                    <td className="px-4 py-3 text-muted-foreground">{t.date}</td>
                                    <td className="px-4 py-3">{t.user}</td>
                                    <td className="px-4 py-3">{t.type}</td>
                                    <td className="px-4 py-3 font-semibold">
                                        {t.amount.toLocaleString()} {t.asset}
                                    </td>
                                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{t.hash}</td>
                                    <td className="px-4 py-3">
                                        <StatusPill status={t.status} />
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-1.5">
                                            <ActionBtn
                                                disabled={t.status !== "Pending"}
                                                tone="emerald"
                                                onClick={() => adminStore.setTxStatus(t.id, "Approved")}
                                            >
                                                <Check className="h-3 w-3" /> Approve
                                            </ActionBtn>
                                            <ActionBtn
                                                disabled={t.status !== "Pending"}
                                                tone="rose"
                                                onClick={() => adminStore.setTxStatus(t.id, "Rejected")}
                                            >
                                                <X className="h-3 w-3" /> Reject
                                            </ActionBtn>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {list.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                                        No {f.toLowerCase()} transactions
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function ActionBtn({
    disabled,
    tone,
    onClick,
    children,
}: {
    disabled?: boolean;
    tone: "emerald" | "rose";
    onClick: () => void;
    children: React.ReactNode;
}) {
    const toneCls =
        tone === "emerald"
            ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200 hover:bg-emerald-400/20"
            : "border-rose-400/30 bg-rose-400/10 text-rose-200 hover:bg-rose-400/20";
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition disabled:cursor-not-allowed disabled:opacity-30 ${toneCls}`}
        >
            {children}
        </button>
    );
}

// keep type referenced
export type _T = AdminTx;
