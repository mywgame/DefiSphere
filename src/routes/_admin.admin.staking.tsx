import { adminStore, type AdminPlan } from "@/lib/mock-admin";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Power, Save, Trash2 } from "lucide-react";
import { useState, useSyncExternalStore } from "react";

export const Route = createFileRoute("/_admin/admin/staking")({
    head: () => ({ meta: [{ title: "Staking — Admin" }] }),
    component: AdminStakingPage,
});

function AdminStakingPage() {
    const plans = useSyncExternalStore(
        (fn) => adminStore.subscribe(fn),
        () => adminStore.getPlans(),
        () => adminStore.getPlans(),
    );
    const [draft, setDraft] = useState({ name: "", dpy: 1, minStake: 100, lockDays: 30 });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!draft.name.trim()) return;
        adminStore.addPlan({ ...draft, active: true });
        setDraft({ name: "", dpy: 1, minStake: 100, lockDays: 30 });
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-display text-3xl font-bold">Staking & Rewards</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Configure staking plans, daily yield and lock-up periods.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                <form onSubmit={submit} className="rounded-2xl glass-card p-6 xl:col-span-1">
                    <h3 className="font-display text-lg font-semibold">Add new plan</h3>
                    <div className="mt-4 space-y-3">
                        <Field label="Plan name">
                            <input
                                value={draft.name}
                                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                                placeholder="Aurora Vault"
                                className="input"
                            />
                        </Field>
                        <div className="grid grid-cols-2 gap-3">
                            <Field label="DPY %">
                                <input
                                    type="number"
                                    step="0.01"
                                    value={draft.dpy}
                                    onChange={(e) => setDraft({ ...draft, dpy: parseFloat(e.target.value) || 0 })}
                                    className="input"
                                />
                            </Field>
                            <Field label="Lock days">
                                <input
                                    type="number"
                                    value={draft.lockDays}
                                    onChange={(e) =>
                                        setDraft({ ...draft, lockDays: parseInt(e.target.value) || 0 })
                                    }
                                    className="input"
                                />
                            </Field>
                        </div>
                        <Field label="Min stake (USDT)">
                            <input
                                type="number"
                                value={draft.minStake}
                                onChange={(e) =>
                                    setDraft({ ...draft, minStake: parseFloat(e.target.value) || 0 })
                                }
                                className="input"
                            />
                        </Field>
                        <button
                            type="submit"
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-primary-foreground"
                            style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow-cyan)" }}
                        >
                            <Plus className="h-4 w-4" /> Create plan
                        </button>
                    </div>
                    <style>{`.input{height:38px;width:100%;border-radius:10px;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.04);padding:0 12px;font-size:14px;color:hsl(var(--foreground));outline:none}.input:focus{border-color:rgba(56,189,248,0.5)}`}</style>
                </form>

                <div className="xl:col-span-2 space-y-4">
                    {plans.map((p) => (
                        <PlanRow key={p.id} plan={p} />
                    ))}
                </div>
            </div>
        </div>
    );
}

function PlanRow({ plan }: { plan: AdminPlan }) {
    const [edit, setEdit] = useState(plan);

    return (
        <div className="rounded-2xl glass-card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <p className="font-display text-lg font-semibold">{plan.name}</p>
                    <p className="text-xs text-muted-foreground">
                        {plan.active ? "Active · accepting stakes" : "Disabled"}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => adminStore.togglePlan(plan.id)}
                        className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold transition ${plan.active
                                ? "border-amber-400/30 bg-amber-400/10 text-amber-200 hover:bg-amber-400/20"
                                : "border-emerald-400/30 bg-emerald-400/10 text-emerald-200 hover:bg-emerald-400/20"
                            }`}
                    >
                        <Power className="h-3 w-3" /> {plan.active ? "Disable" : "Enable"}
                    </button>
                    <button
                        onClick={() => {
                            if (confirm(`Delete ${plan.name}?`)) adminStore.deletePlan(plan.id);
                        }}
                        className="inline-flex items-center gap-1 rounded-lg border border-rose-400/30 bg-rose-400/10 px-2.5 py-1.5 text-[11px] font-semibold text-rose-200 hover:bg-rose-400/20"
                    >
                        <Trash2 className="h-3 w-3" />
                    </button>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                <MiniField label="Name">
                    <input
                        value={edit.name}
                        onChange={(e) => setEdit({ ...edit, name: e.target.value })}
                        className="mini-input"
                    />
                </MiniField>
                <MiniField label="DPY %">
                    <input
                        type="number"
                        step="0.01"
                        value={edit.dpy}
                        onChange={(e) => setEdit({ ...edit, dpy: parseFloat(e.target.value) || 0 })}
                        className="mini-input"
                    />
                </MiniField>
                <MiniField label="Min stake">
                    <input
                        type="number"
                        value={edit.minStake}
                        onChange={(e) => setEdit({ ...edit, minStake: parseFloat(e.target.value) || 0 })}
                        className="mini-input"
                    />
                </MiniField>
                <MiniField label="Lock days">
                    <input
                        type="number"
                        value={edit.lockDays}
                        onChange={(e) => setEdit({ ...edit, lockDays: parseInt(e.target.value) || 0 })}
                        className="mini-input"
                    />
                </MiniField>
            </div>
            <div className="mt-4 flex justify-end">
                <button
                    onClick={() => adminStore.updatePlan(plan.id, edit)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[color:var(--neon-cyan)]/40 bg-[color:var(--neon-cyan)]/10 px-3 py-1.5 text-xs font-semibold text-[color:var(--neon-cyan)] hover:bg-[color:var(--neon-cyan)]/20"
                >
                    <Save className="h-3.5 w-3.5" /> Save changes
                </button>
            </div>
            <style>{`.mini-input{height:34px;width:100%;border-radius:8px;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.04);padding:0 10px;font-size:13px;color:hsl(var(--foreground));outline:none}.mini-input:focus{border-color:rgba(56,189,248,0.5)}`}</style>
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

function MiniField({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <label className="block">
            <span className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                {label}
            </span>
            {children}
        </label>
    );
}
