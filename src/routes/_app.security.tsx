import { PageHeader } from "@/components/dashboard/PageHeader";
import { QrPlaceholder } from "@/components/dashboard/QrPlaceholder";
import { createFileRoute } from "@tanstack/react-router";
import { Copy, KeyRound, ShieldCheck, ShieldOff } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_app/security")({
    head: () => ({ meta: [{ title: "Security — DefiSphere" }] }),
    component: SecurityPage,
});

const secret = "JBSWY3DPEHPK3PXP-DEFI-SPHERE-2FA-9KAP";
const backupCodes = [
    "9F2E-44KA", "7DLM-92QC", "P3X1-VV82", "K0M2-7T1A",
    "B9NE-4LZ0", "C4FA-77QW", "QQ12-LPO0", "MX23-1HVB",
];

function SecurityPage() {
    const [enabled, setEnabled] = useState(false);
    const [copied, setCopied] = useState(false);

    return (
        <div className="space-y-6">
            <PageHeader
                title="Security"
                subtitle="Protect your account with two-factor authentication."
            />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 rounded-2xl glass-card p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <p className="text-sm font-semibold">Google Authenticator</p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Scan the QR code with Google Authenticator, Authy or 1Password.
                            </p>
                        </div>
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${enabled ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                                : "border-amber-400/30 bg-amber-400/10 text-amber-300"
                            }`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${enabled ? "bg-emerald-400" : "bg-amber-400"}`} />
                            {enabled ? "2FA Enabled" : "2FA Disabled"}
                        </span>
                    </div>

                    <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-[auto_1fr] md:items-center">
                        <QrPlaceholder size={180} seed={secret} />
                        <div>
                            <p className="text-xs uppercase tracking-wider text-muted-foreground">Manual setup key</p>
                            <div className="mt-2 flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] p-3">
                                <span className="break-all text-sm font-mono">{secret}</span>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(secret);
                                        setCopied(true);
                                        setTimeout(() => setCopied(false), 1200);
                                    }}
                                    className="ml-auto inline-flex shrink-0 items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1.5 text-xs font-semibold hover:bg-white/15"
                                >
                                    <Copy className="h-3 w-3" /> {copied ? "Copied" : "Copy"}
                                </button>
                            </div>

                            <p className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">Verification code</p>
                            <input
                                placeholder="123 456"
                                className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 text-base font-mono tracking-widest focus:border-[color:var(--neon-cyan)]/40 focus:outline-none"
                            />

                            <div className="mt-4 flex flex-wrap gap-3">
                                {enabled ? (
                                    <button
                                        onClick={() => setEnabled(false)}
                                        className="inline-flex items-center gap-2 rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-2 text-sm font-semibold text-rose-200 hover:bg-rose-400/20"
                                    >
                                        <ShieldOff className="h-4 w-4" /> Disable 2FA
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setEnabled(true)}
                                        className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-primary-foreground"
                                        style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow-cyan)" }}
                                    >
                                        <ShieldCheck className="h-4 w-4" /> Enable 2FA
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="rounded-2xl glass-card p-6">
                        <p className="text-sm font-semibold">Backup Recovery Codes</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Save these codes somewhere safe. Each can be used once if you lose your device.
                        </p>
                        <div className="mt-3 grid grid-cols-2 gap-2 font-mono text-xs">
                            {backupCodes.map((c) => (
                                <div key={c} className="rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1.5 text-center">
                                    {c}
                                </div>
                            ))}
                        </div>
                        <button className="mt-3 w-full rounded-xl border border-white/10 bg-white/[0.04] py-2 text-xs font-semibold hover:bg-white/[0.08]">
                            Regenerate codes
                        </button>
                    </div>

                    <div className="rounded-2xl glass-card p-6">
                        <div className="flex items-center gap-2">
                            <KeyRound className="h-4 w-4 text-[color:var(--neon-cyan)]" />
                            <p className="text-sm font-semibold">Change Password</p>
                        </div>
                        <div className="mt-4 space-y-3">
                            <input type="password" placeholder="Current password" className="h-10 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm focus:border-[color:var(--neon-cyan)]/40 focus:outline-none" />
                            <input type="password" placeholder="New password" className="h-10 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm focus:border-[color:var(--neon-cyan)]/40 focus:outline-none" />
                            <input type="password" placeholder="Confirm new password" className="h-10 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm focus:border-[color:var(--neon-cyan)]/40 focus:outline-none" />
                            <button
                                className="w-full rounded-xl px-4 py-2 text-sm font-semibold text-primary-foreground"
                                style={{ background: "var(--gradient-primary)" }}
                            >
                                Update password
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
