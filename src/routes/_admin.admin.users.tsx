import { adminStore } from "@/lib/mock-admin";
import { createFileRoute } from "@tanstack/react-router";
import { Ban, CheckCircle2, Search, Trash2, UserCheck } from "lucide-react";
import { useState, useSyncExternalStore } from "react";
import { StatusPill } from "./_admin.admin";

export const Route = createFileRoute("/_admin/admin/users")({
    head: () => ({ meta: [{ title: "Users — Admin" }] }),
    component: AdminUsersPage,
});

function AdminUsersPage() {
    const users = useSyncExternalStore(
        (fn) => adminStore.subscribe(fn),
        () => adminStore.getUsers(),
        () => adminStore.getUsers(),
    );
    const [q, setQ] = useState("");

    const filtered = users.filter(
        (u) =>
            u.email.toLowerCase().includes(q.toLowerCase()) ||
            u.name.toLowerCase().includes(q.toLowerCase()),
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <h1 className="font-display text-3xl font-bold">Users</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {users.length} accounts · {users.filter((u) => u.status === "Active").length} active
                    </p>
                </div>
                <div className="relative w-full max-w-sm">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Search by name or email…"
                        className="h-10 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:border-[color:var(--neon-cyan)]/40 focus:outline-none"
                    />
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl glass-card">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-white/[0.02] text-left text-[10px] uppercase tracking-wider text-muted-foreground">
                            <tr>
                                <th className="px-4 py-3 font-medium">User</th>
                                <th className="px-4 py-3 font-medium">Joined</th>
                                <th className="px-4 py-3 font-medium">Balance</th>
                                <th className="px-4 py-3 font-medium">Staked</th>
                                <th className="px-4 py-3 font-medium">KYC</th>
                                <th className="px-4 py-3 font-medium">Status</th>
                                <th className="px-4 py-3 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filtered.map((u) => (
                                <tr key={u.id} className="hover:bg-white/[0.02]">
                                    <td className="px-4 py-3">
                                        <p className="font-semibold">{u.name}</p>
                                        <p className="text-xs text-muted-foreground">{u.email}</p>
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">{u.joined}</td>
                                    <td className="px-4 py-3 font-mono">${u.balance.toLocaleString()}</td>
                                    <td className="px-4 py-3 font-mono">${u.staked.toLocaleString()}</td>
                                    <td className="px-4 py-3">
                                        <select
                                            value={u.kyc}
                                            onChange={(e) => adminStore.setKyc(u.id, e.target.value as typeof u.kyc)}
                                            className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-xs focus:border-[color:var(--neon-cyan)]/40 focus:outline-none"
                                        >
                                            <option>Verified</option>
                                            <option>Pending</option>
                                            <option>Rejected</option>
                                        </select>
                                    </td>
                                    <td className="px-4 py-3">
                                        <StatusPill status={u.status} />
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-1.5">
                                            {u.status === "Active" ? (
                                                <button
                                                    onClick={() => adminStore.setUserStatus(u.id, "Suspended")}
                                                    className="inline-flex items-center gap-1 rounded-lg border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 text-[11px] font-semibold text-amber-200 hover:bg-amber-400/20"
                                                >
                                                    <Ban className="h-3 w-3" /> Suspend
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => adminStore.setUserStatus(u.id, "Active")}
                                                    className="inline-flex items-center gap-1 rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-200 hover:bg-emerald-400/20"
                                                >
                                                    <UserCheck className="h-3 w-3" /> Activate
                                                </button>
                                            )}
                                            <button
                                                onClick={() => {
                                                    if (confirm(`Delete ${u.email}?`)) adminStore.deleteUser(u.id);
                                                }}
                                                className="inline-flex items-center gap-1 rounded-lg border border-rose-400/30 bg-rose-400/10 px-2.5 py-1 text-[11px] font-semibold text-rose-200 hover:bg-rose-400/20"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                                        No users match "{q}"
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <p className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
                Changes are saved to in-memory mock store. Connect Lovable Cloud to persist.
            </p>
        </div>
    );
}
