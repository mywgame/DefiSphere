import { PageHeader } from "@/components/dashboard/PageHeader";
import { useSession } from "@/lib/session";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/profile")({
    head: () => ({ meta: [{ title: "Profile — DefiSphere" }] }),
    component: ProfilePage,
});

function ProfilePage() {
    const session = useSession();
    const email = session?.email ?? "user@defisphere.io";

    return (
        <div className="space-y-6">
            <PageHeader title="My Profile" subtitle="Personal information and KYC status." />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="rounded-2xl glass-card p-6 text-center">
                    <div
                        className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl font-display text-3xl font-bold text-primary-foreground"
                        style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow-cyan)" }}
                    >
                        {email.charAt(0).toUpperCase()}
                    </div>
                    <p className="mt-3 font-semibold">{email}</p>
                    <p className="text-xs text-muted-foreground">Member since June 2026</p>
                    <div className="mt-4 flex justify-center gap-2">
                        <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-300">
                            Verified
                        </span>
                        <span className="rounded-full border border-[color:var(--neon-cyan)]/30 bg-[color:var(--neon-cyan)]/10 px-2 py-0.5 text-[11px] font-semibold text-[color:var(--neon-cyan)]">
                            Tier 2
                        </span>
                    </div>
                </div>

                <div className="lg:col-span-2 rounded-2xl glass-card p-6">
                    <p className="text-sm font-semibold">Account Details</p>
                    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                        <Field label="Full name" value="Alex Morgan" />
                        <Field label="Email" value={email} />
                        <Field label="Country" value="United Kingdom" />
                        <Field label="Phone" value="+44 7000 000 000" />
                        <Field label="Timezone" value="Europe / London" />
                        <Field label="Language" value="English" />
                    </div>
                    <div className="mt-6 flex flex-wrap gap-3">
                        <button
                            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-primary-foreground"
                            style={{ background: "var(--gradient-primary)" }}
                        >
                            Save changes
                        </button>
                        <button className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold hover:bg-white/[0.08]">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Field({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</p>
            <input
                defaultValue={value}
                className="mt-1 h-10 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm focus:border-[color:var(--neon-cyan)]/40 focus:outline-none"
            />
        </div>
    );
}
