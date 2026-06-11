import { adminStore } from "@/lib/mock-admin";
import { createFileRoute } from "@tanstack/react-router";
import { Save } from "lucide-react";
import { useEffect, useState, useSyncExternalStore } from "react";

export const Route = createFileRoute("/_admin/admin/settings")({
    head: () => ({ meta: [{ title: "Settings — Admin" }] }),
    component: AdminSettingsPage,
});

function AdminSettingsPage() {
    const settings = useSyncExternalStore(
        (fn) => adminStore.subscribe(fn),
        () => adminStore.getSettings(),
        () => adminStore.getSettings(),
    );
    const [form, setForm] = useState(settings);
    const [saved, setSaved] = useState(false);

    useEffect(() => setForm(settings), [settings]);

    const save = (e: React.FormEvent) => {
        e.preventDefault();
        adminStore.updateSettings(form);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-display text-3xl font-bold">Site Settings</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Control global toggles, branding and announcements.
                </p>
            </div>

            <form onSubmit={save} className="space-y-6">
                <div className="rounded-2xl glass-card p-6">
                    <h3 className="font-display text-lg font-semibold">Branding</h3>
                    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                        <Field label="Site name">
                            <input
                                value={form.siteName}
                                onChange={(e) => setForm({ ...form, siteName: e.target.value })}
                                className="ss-input"
                            />
                        </Field>
                        <Field label="Support email">
                            <input
                                type="email"
                                value={form.supportEmail}
                                onChange={(e) => setForm({ ...form, supportEmail: e.target.value })}
                                className="ss-input"
                            />
                        </Field>
                    </div>
                </div>

                <div className="rounded-2xl glass-card p-6">
                    <h3 className="font-display text-lg font-semibold">Feature toggles</h3>
                    <div className="mt-4 space-y-3">
                        <Toggle
                            label="Deposits enabled"
                            desc="Allow users to deposit funds"
                            checked={form.depositsEnabled}
                            onChange={(v) => setForm({ ...form, depositsEnabled: v })}
                        />
                        <Toggle
                            label="Withdrawals enabled"
                            desc="Allow withdrawal requests"
                            checked={form.withdrawalsEnabled}
                            onChange={(v) => setForm({ ...form, withdrawalsEnabled: v })}
                        />
                        <Toggle
                            label="Signups open"
                            desc="Permit new account registration"
                            checked={form.signupsEnabled}
                            onChange={(v) => setForm({ ...form, signupsEnabled: v })}
                        />
                        <Toggle
                            label="Maintenance mode"
                            desc="Show maintenance page to non-admin users"
                            checked={form.maintenanceMode}
                            onChange={(v) => setForm({ ...form, maintenanceMode: v })}
                        />
                    </div>
                </div>

                <div className="rounded-2xl glass-card p-6">
                    <h3 className="font-display text-lg font-semibold">Rewards</h3>
                    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                        <Field label="Referral commission (%)">
                            <input
                                type="number"
                                step="0.1"
                                value={form.referralPct}
                                onChange={(e) =>
                                    setForm({ ...form, referralPct: parseFloat(e.target.value) || 0 })
                                }
                                className="ss-input"
                            />
                        </Field>
                    </div>
                </div>

                <div className="rounded-2xl glass-card p-6">
                    <h3 className="font-display text-lg font-semibold">Announcement banner</h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                        Displayed on the user dashboard. Leave empty to hide.
                    </p>
                    <textarea
                        value={form.announcement}
                        onChange={(e) => setForm({ ...form, announcement: e.target.value })}
                        rows={3}
                        className="ss-input mt-3 !h-auto py-2"
                        placeholder="Stake before Friday and get +0.25% DPY for 30 days."
                    />
                </div>

                <div className="sticky bottom-0 flex items-center justify-between rounded-2xl border border-white/10 bg-[#070914]/90 p-4 backdrop-blur-xl">
                    <span className={`text-sm ${saved ? "text-emerald-300" : "text-muted-foreground"}`}>
                        {saved ? "✓ Settings saved" : "Unsaved changes are not persisted until you click Save."}
                    </span>
                    <button
                        type="submit"
                        className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-primary-foreground"
                        style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow-cyan)" }}
                    >
                        <Save className="h-4 w-4" /> Save settings
                    </button>
                </div>
            </form>
            <style>{`.ss-input{height:40px;width:100%;border-radius:10px;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.04);padding:0 12px;font-size:14px;color:hsl(var(--foreground));outline:none}.ss-input:focus{border-color:rgba(56,189,248,0.5)}textarea.ss-input{padding:8px 12px}`}</style>
        </div>
    );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
            {children}
        </label>
    );
}

function Toggle({
    label,
    desc,
    checked,
    onChange,
}: {
    label: string;
    desc: string;
    checked: boolean;
    onChange: (v: boolean) => void;
}) {
    return (
        <label className="flex cursor-pointer items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-3">
            <div>
                <p className="text-sm font-semibold">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
            <button
                type="button"
                onClick={() => onChange(!checked)}
                className={`relative h-6 w-11 rounded-full transition ${checked ? "bg-emerald-400/80" : "bg-white/10"
                    }`}
            >
                <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${checked ? "left-[22px]" : "left-0.5"
                        }`}
                />
            </button>
        </label>
    );
}
