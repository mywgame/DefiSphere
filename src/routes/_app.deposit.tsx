import { PageHeader } from "@/components/dashboard/PageHeader";
import { QrPlaceholder } from "@/components/dashboard/QrPlaceholder";
import { depositAddress, networks, transactions } from "@/lib/mock-dashboard";
import { createFileRoute } from "@tanstack/react-router";
import { Copy, Info } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_app/deposit")({
    head: () => ({ meta: [{ title: "Deposit — DefiSphere" }] }),
    component: DepositPage,
});

function DepositPage() {
    const [net, setNet] = useState(networks[0].id);
    const [copied, setCopied] = useState(false);
    const selected = networks.find((n) => n.id === net)!;
    const deposits = transactions.filter((t) => t.type === "Deposit");

    return (
        <div className="space-y-6">
            <PageHeader title="Deposit" subtitle="Add funds to your DefiSphere wallet." />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 rounded-2xl glass-card p-6">
                    <p className="text-sm font-semibold">Select Network</p>
                    <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
                        {networks.map((n) => (
                            <button
                                key={n.id}
                                onClick={() => setNet(n.id)}
                                className={`rounded-xl border p-3 text-left transition ${net === n.id
                                        ? "border-[color:var(--neon-cyan)]/50 bg-[color:var(--neon-cyan)]/10"
                                        : "border-white/5 bg-white/[0.03] hover:bg-white/[0.06]"
                                    }`}
                            >
                                <p className="text-sm font-semibold">{n.label}</p>
                                <p className="mt-1 text-[11px] text-muted-foreground">Fee {n.fee}</p>
                            </button>
                        ))}
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-[auto_1fr] md:items-center">
                        <QrPlaceholder size={180} seed={depositAddress + net} />
                        <div>
                            <p className="text-xs uppercase tracking-wider text-muted-foreground">Wallet address</p>
                            <div className="mt-2 flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] p-3">
                                <span className="break-all text-sm font-mono">{depositAddress}</span>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(depositAddress);
                                        setCopied(true);
                                        setTimeout(() => setCopied(false), 1200);
                                    }}
                                    className="ml-auto inline-flex shrink-0 items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1.5 text-xs font-semibold hover:bg-white/15"
                                >
                                    <Copy className="h-3 w-3" /> {copied ? "Copied" : "Copy"}
                                </button>
                            </div>
                            <p className="mt-3 text-xs text-muted-foreground">
                                Minimum deposit: <span className="text-foreground">{selected.min}</span>
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 rounded-xl border border-amber-400/20 bg-amber-400/5 p-4">
                        <div className="flex items-start gap-2">
                            <Info className="mt-0.5 h-4 w-4 text-amber-300" />
                            <div className="text-xs text-amber-100/90">
                                <p className="font-semibold">Deposit Instructions</p>
                                <ul className="mt-1 list-disc space-y-0.5 pl-4 text-amber-100/70">
                                    <li>Only send <b>USDT</b> on the <b>{selected.label}</b> network to this address.</li>
                                    <li>Deposits below the minimum will not be credited and cannot be recovered.</li>
                                    <li>Funds are credited after 1 network confirmation (~2–10 minutes).</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl glass-card p-6">
                    <p className="text-sm font-semibold">Recent Deposits</p>
                    <ul className="mt-3 divide-y divide-white/5">
                        {(deposits.length ? deposits : transactions.slice(0, 3)).map((t) => (
                            <li key={t.id} className="flex items-center justify-between py-3">
                                <div>
                                    <p className="text-sm font-medium">{t.amount.toLocaleString()} {t.asset}</p>
                                    <p className="text-[11px] text-muted-foreground">{t.date}</p>
                                </div>
                                <span className={`text-[11px] ${t.status === "Completed" ? "text-emerald-300" : "text-amber-300"}`}>{t.status}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
