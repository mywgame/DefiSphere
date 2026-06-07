import { PageHeader } from "@/components/dashboard/PageHeader";
import { networks, stats, transactions } from "@/lib/mock-dashboard";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpFromLine } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_app/withdraw")({
    head: () => ({ meta: [{ title: "Withdraw — DefiSphere" }] }),
    component: WithdrawPage,
});

function WithdrawPage() {
    const [amount, setAmount] = useState("");
    const [address, setAddress] = useState("");
    const [net, setNet] = useState(networks[0].id);
    const [submitted, setSubmitted] = useState<string | null>(null);
    const available = stats.withdrawable;
    const withdrawals = transactions.filter((t) => t.type === "Withdrawal");

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!address || !amount) return;
        setSubmitted(`Withdrawal of ${amount} USDT to ${address.slice(0, 6)}… submitted.`);
        setAmount("");
        setAddress("");
    };

    return (
        <div className="space-y-6">
            <PageHeader title="Withdraw" subtitle="Send funds from your DefiSphere wallet." />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <form onSubmit={onSubmit} className="lg:col-span-2 rounded-2xl glass-card p-6 space-y-4">
                    <div>
                        <label className="text-xs uppercase tracking-wider text-muted-foreground">Network</label>
                        <select
                            value={net}
                            onChange={(e) => setNet(e.target.value)}
                            className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm focus:border-[color:var(--neon-cyan)]/40 focus:outline-none"
                        >
                            {networks.map((n) => (
                                <option key={n.id} value={n.id} className="bg-[#0a0d1e]">
                                    {n.label} — fee {n.fee}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-xs uppercase tracking-wider text-muted-foreground">Destination wallet address</label>
                        <input
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Enter wallet address"
                            className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm font-mono focus:border-[color:var(--neon-cyan)]/40 focus:outline-none"
                        />
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label className="text-xs uppercase tracking-wider text-muted-foreground">Amount (USDT)</label>
                            <button type="button" onClick={() => setAmount(String(available))} className="text-[11px] font-semibold text-[color:var(--neon-cyan)] hover:underline">
                                Max {available.toLocaleString()}
                            </button>
                        </div>
                        <input
                            value={amount}
                            onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
                            placeholder="0.00"
                            className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm focus:border-[color:var(--neon-cyan)]/40 focus:outline-none"
                        />
                        <p className="mt-2 text-[11px] text-muted-foreground">
                            Available balance: <span className="text-foreground">{available.toLocaleString()} USDT</span>
                        </p>
                    </div>

                    {submitted && (
                        <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-3 text-xs text-emerald-200">
                            {submitted}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-primary-foreground"
                        style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow-cyan)" }}
                    >
                        <ArrowUpFromLine className="h-4 w-4" /> Confirm Withdrawal
                    </button>
                </form>

                <div className="rounded-2xl glass-card p-6">
                    <p className="text-sm font-semibold">Withdrawal History</p>
                    <ul className="mt-3 divide-y divide-white/5">
                        {(withdrawals.length ? withdrawals : transactions.slice(3, 6)).map((t) => (
                            <li key={t.id} className="flex items-center justify-between py-3">
                                <div>
                                    <p className="text-sm font-medium">{t.amount.toLocaleString()} {t.asset}</p>
                                    <p className="text-[11px] text-muted-foreground">{t.date}</p>
                                </div>
                                <span className={`text-[11px] ${t.status === "Completed" ? "text-emerald-300" : "text-amber-300"}`}>
                                    {t.status}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
