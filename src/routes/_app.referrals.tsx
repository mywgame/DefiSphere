import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { createFileRoute } from "@tanstack/react-router";
import { Copy, DollarSign, Gift, Users } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_app/referrals")({
    head: () => ({ meta: [{ title: "Referrals — DefiSphere" }] }),
    component: ReferralsPage,
});

const refRows = [
    { user: "alex.eth", joined: "2026-06-02", staked: 5000, earned: 142.5 },
    { user: "nova_22", joined: "2026-05-28", staked: 1500, earned: 38.6 },
    { user: "0xMila", joined: "2026-05-19", staked: 12500, earned: 412.1 },
    { user: "kane.btc", joined: "2026-05-08", staked: 800, earned: 22.4 },
];

function ReferralsPage() {
    const code = "DEFI-7Q3X-9KAP";
    const link = `https://defisphere.io/r/${code}`;
    const [copied, setCopied] = useState<string | null>(null);

    const copy = (val: string, key: string) => {
        navigator.clipboard.writeText(val);
        setCopied(key);
        setTimeout(() => setCopied(null), 1200);
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            <PageHeader title="Referrals" subtitle="Invite friends and earn lifetime commissions." />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <StatCard label="Total Referrals" value={24} unit="users" icon={Users} tone="cyan" />
                <StatCard index={1} label="Referral Earnings" value={1284.5} icon={DollarSign} tone="purple" />
                <StatCard index={2} label="Tier" value="Gold" unit="" icon={Gift} tone="pink" />
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {/* Referral link + code */}
                <div className="rounded-2xl glass-card p-4 sm:p-6">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">Referral Link</p>
                    <div className="mt-2 flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] p-2.5">
                        <span className="truncate text-sm font-mono">{link}</span>
                        <button
                            onClick={() => copy(link, "link")}
                            className="ml-auto inline-flex shrink-0 items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1.5 text-xs font-semibold hover:bg-white/15"
                        >
                            <Copy className="h-3 w-3" /> {copied === "link" ? "Copied" : "Copy"}
                        </button>
                    </div>

                    <p className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">Referral Code</p>
                    <div className="mt-2 flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] p-2.5">
                        <span className="text-base font-bold tracking-widest">{code}</span>
                        <button
                            onClick={() => copy(code, "code")}
                            className="ml-auto inline-flex items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1.5 text-xs font-semibold hover:bg-white/15"
                        >
                            <Copy className="h-3 w-3" /> {copied === "code" ? "Copied" : "Copy"}
                        </button>
                    </div>
                </div>

                {/* Commission tiers */}
                <div className="rounded-2xl glass-card p-4 sm:p-6">
                    <p className="text-sm font-semibold">Commission Tiers</p>
                    <ul className="mt-3 space-y-2">
                        {[
                            { tier: "Level 1 (direct)", pct: "8%" },
                            { tier: "Level 2", pct: "3%" },
                            { tier: "Level 3", pct: "1%" },
                        ].map((t) => (
                            <li key={t.tier} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] p-3 text-sm">
                                <span>{t.tier}</span>
                                <span className="font-semibold text-[color:var(--neon-cyan)]">{t.pct}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Referral Rewards */}
            <div className="rounded-2xl glass-card p-4 sm:p-6">
                <h3 className="font-display text-lg font-semibold">Referral Rewards</h3>

                {/* Mobile cards */}
                <div className="mt-4 space-y-3 sm:hidden">
                    {refRows.map((r) => (
                        <div key={r.user} className="rounded-xl border border-white/5 bg-white/[0.03] p-4">
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <p className="truncate font-medium">{r.user}</p>
                                    <p className="mt-0.5 text-xs text-muted-foreground">Joined {r.joined}</p>
                                </div>
                                <span className="shrink-0 text-sm font-semibold text-emerald-300">+{r.earned.toLocaleString()} USDT</span>
                            </div>
                            <div className="mt-2 text-xs text-muted-foreground">
                                Staked <span className="text-foreground">{r.staked.toLocaleString()} USDT</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Desktop table */}
                <div className="mt-4 hidden sm:block overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                                <th className="px-3 py-2 font-medium">User</th>
                                <th className="px-3 py-2 font-medium">Joined</th>
                                <th className="px-3 py-2 font-medium">Staked</th>
                                <th className="px-3 py-2 font-medium">Earned</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {refRows.map((r) => (
                                <tr key={r.user} className="hover:bg-white/[0.03]">
                                    <td className="px-3 py-3 font-medium">{r.user}</td>
                                    <td className="px-3 py-3 text-muted-foreground">{r.joined}</td>
                                    <td className="px-3 py-3">{r.staked.toLocaleString()} USDT</td>
                                    <td className="px-3 py-3 text-emerald-300">+{r.earned.toLocaleString()} USDT</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}