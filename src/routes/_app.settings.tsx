import { PageHeader } from "@/components/dashboard/PageHeader";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/_app/settings")({
    head: () => ({ meta: [{ title: "Settings — DefiSphere" }] }),
    component: SettingsPage,
});

const toggles = [
    { key: "email_tx", label: "Email me on every transaction", on: true },
    { key: "email_reward", label: "Email me when rewards are claimable", on: true },
    { key: "push_security", label: "Push notifications for security events", on: true },
    { key: "marketing", label: "Product updates & marketing emails", on: false },
];

function SettingsPage() {
    const [state, setState] = useState(Object.fromEntries(toggles.map((t) => [t.key, t.on])));
    const [theme, setTheme] = useState("dark");
    const [currency, setCurrency] = useState("USD");

    return (
        <div className="space-y-6">
            <PageHeader title="Settings" subtitle="Preferences for notifications, display, and locale." />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="rounded-2xl glass-card p-6">
                    <p className="text-sm font-semibold">Notification Settings</p>
                    <ul className="mt-4 space-y-3">
                        {toggles.map((t) => (
                            <li key={t.key} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] p-3">
                                <span className="text-sm">{t.label}</span>
                                <button
                                    onClick={() => setState((s) => ({ ...s, [t.key]: !s[t.key] }))}
                                    className={`relative h-6 w-11 rounded-full transition ${state[t.key] ? "bg-[color:var(--neon-cyan)]/70" : "bg-white/10"}`}
                                >
                                    <span
                                        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${state[t.key] ? "left-5" : "left-0.5"}`}
                                    />
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="rounded-2xl glass-card p-6 space-y-5">
                    <div>
                        <p className="text-sm font-semibold">Display</p>
                        <div className="mt-3 flex gap-2">
                            {["dark", "midnight", "system"].map((m) => (
                                <button
                                    key={m}
                                    onClick={() => setTheme(m)}
                                    className={`rounded-xl border px-3 py-2 text-xs font-semibold capitalize ${theme === m ? "border-[color:var(--neon-cyan)]/50 bg-[color:var(--neon-cyan)]/10 text-[color:var(--neon-cyan)]" : "border-white/10 bg-white/[0.04] text-muted-foreground"
                                        }`}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-semibold">Display Currency</p>
                        <select
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            className="mt-2 h-10 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm focus:border-[color:var(--neon-cyan)]/40 focus:outline-none"
                        >
                            {["USD", "EUR", "GBP", "JPY", "AED"].map((c) => (
                                <option key={c} className="bg-[#0a0d1e]">{c}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <p className="text-sm font-semibold">Danger Zone</p>
                        <button className="mt-3 w-full rounded-xl border border-rose-400/30 bg-rose-400/10 py-2 text-sm font-semibold text-rose-200 hover:bg-rose-400/20">
                            Delete account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
