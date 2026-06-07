import { PageHeader } from "@/components/dashboard/PageHeader";
import { QrPlaceholder } from "@/components/dashboard/QrPlaceholder";
import { depositAddress, networks, stats, transactions } from "@/lib/mock-dashboard";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowDownToLine, ArrowUpFromLine, Copy, Wallet } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_app/wallet")({
    head: () => ({ meta: [{ title: "Wallet — DefiSphere" }] }),
    component: WalletPage,
});

function WalletPage() {
    const deposits = transactions.filter((t) => t.type === "Deposit");
    const withdrawals = transactions.filter((t) => t.type === "Withdrawal");
    const [copied, setCopied] = useState(false);

    return (
        <div className="space-y-6">
            <PageHeader title="Wallet" subtitle="Manage your balances, deposits and withdrawals." />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 rounded-2xl glass-card p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                                Total Balance
                            </p>
                            <p className="mt-2 font-display text-4xl font-bold tracking-tight">
                                {stats.wallet.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                <span className="ml-2 text-base font-medium text-muted-foreground">USDT</span>
                            </p>
                            <p className="mt-1 text-xs text-emerald-300">+2.4% · last 24h</p>
                        </div>
                        <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-[color:var(--neon-cyan)]/30 bg-[color:var(--neon-cyan)]/10 text-[color:var(--neon-cyan)]">
                            <Wallet className="h-5 w-5" />
                        </span>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {[
                            { l: "USDT", v: stats.wallet },
                            { l: "DFX", v: 4820.12 },
                            { l: "ETH", v: 1.842 },
                            { l: "BTC", v: 0.072 },
                        ].map((a) => (
                            <div key={a.l} className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
                                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{a.l}</p>
                                <p className="mt-1 font-semibold">{a.v.toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-2xl glass-card p-6">
                    <p className="text-sm font-semibold">Deposit Address</p>
                    <p className="text-xs text-muted-foreground">Default network: Tron (TRC20)</p>
                    <div className="mt-4 flex flex-col items-center gap-3">
                        <QrPlaceholder size={160} seed={depositAddress} />
                        <div className="flex w-full items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] p-2">
                            <span className="truncate text-xs font-mono text-muted-foreground">{depositAddress}</span>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(depositAddress);
                                    setCopied(true);
                                    setTimeout(() => setCopied(false), 1200);
                                }}
                                className="ml-auto inline-flex items-center gap-1 rounded-lg bg-white/10 px-2 py-1 text-[11px] font-semibold hover:bg-white/15"
                            >
                                <Copy className="h-3 w-3" /> {copied ? "Copied" : "Copy"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="rounded-2xl glass-card p-6">
                <p className="text-sm font-semibold">Supported Networks</p>
                <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
                    {networks.map((n) => (
                        <div key={n.id} className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
                            <p className="text-sm font-semibold">{n.label}</p>
                            <p className="mt-1 text-[11px] text-muted-foreground">Fee {n.fee} · Min {n.min}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <HistoryCard
                    title="Deposit History"
                    icon={<ArrowDownToLine className="h-4 w-4 text-emerald-300" />}
                    rows={deposits.length ? deposits : transactions.slice(0, 3)}
                />
                <HistoryCard
                    title="Withdrawal History"
                    icon={<ArrowUpFromLine className="h-4 w-4 text-[color:var(--neon-purple)]" />}
                    rows={withdrawals.length ? withdrawals : transactions.slice(3, 6)}
                />
            </div>
        </div>
    );
}

function HistoryCard({
    title,
    icon,
    rows,
}: {
    title: string;
    icon: React.ReactNode;
    rows: typeof transactions;
}) {
    return (
        <div className="rounded-2xl glass-card p-6">
            <div className="mb-3 flex items-center gap-2">
                {icon}
                <p className="text-sm font-semibold">{title}</p>
            </div>
            <ul className="divide-y divide-white/5">
                {rows.map((t) => (
                    <li key={t.id} className="flex items-center justify-between py-3">
                        <div>
                            <p className="text-sm font-medium">{t.type}</p>
                            <p className="text-[11px] text-muted-foreground">{t.date} · {t.hash}</p>
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
    );
}
