import { sessionStore } from "@/lib/session";
import { Link, useRouterState } from "@tanstack/react-router";
import {
    ArrowLeftRight,
    Coins,
    LayoutDashboard,
    LogOut,
    Settings as SettingsIcon,
    ShieldCheck,
    Triangle,
    Users,
    X,
} from "lucide-react";

const items = [
    { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true as boolean | undefined },
    { to: "/admin/users", label: "Users", icon: Users, exact: undefined as boolean | undefined },
    { to: "/admin/transactions", label: "Transactions", icon: ArrowLeftRight, exact: undefined as boolean | undefined },
    { to: "/admin/staking", label: "Staking & Rewards", icon: Coins, exact: undefined as boolean | undefined },
    { to: "/admin/settings", label: "Site Settings", icon: SettingsIcon, exact: undefined as boolean | undefined },
] as const;

export function AdminSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
    const pathname = useRouterState({ select: (s) => s.location.pathname });

    return (
        <>
            {open && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
                    onClick={onClose}
                />
            )}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-72 transform border-r border-white/5 bg-[#070914]/95 backdrop-blur-xl transition-transform duration-300 lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"
                    } lg:static lg:z-0 lg:bg-transparent`}
            >
                <div className="flex h-16 items-center justify-between px-5">
                    <Link to="/admin" className="flex items-center gap-2.5">
                        <span
                            className="relative inline-flex h-10 w-10 items-center justify-center rounded-[22%]"
                            style={{
                                background: "linear-gradient(135deg, #7c5cff 0%, #4f7cff 50%, #38bdf8 100%)",
                                boxShadow: "0 8px 24px -8px rgba(79,124,255,0.6)",
                            }}
                        >
                            <Triangle className="h-5 w-5 text-white" strokeWidth={2.25} fill="none" />
                        </span>
                        <span className="font-display text-lg font-bold tracking-tight">
                            Defi<span className="text-gradient">Sphere</span>
                        </span>
                    </Link>
                    <button
                        onClick={onClose}
                        className="rounded-md p-1.5 text-muted-foreground hover:bg-white/5 lg:hidden"
                        aria-label="Close menu"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <nav className="px-3 py-2">
                    <div className="mx-3 mb-3 flex items-center gap-2 rounded-lg border border-amber-400/30 bg-amber-400/10 px-2.5 py-1.5">
                        <ShieldCheck className="h-3.5 w-3.5 text-amber-300" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-amber-200">
                            Admin Console
                        </span>
                    </div>

                    <ul className="space-y-1">
                        {items.map((it) => {
                            const active = it.exact ? pathname === it.to : pathname.startsWith(it.to);
                            const Icon = it.icon;
                            return (
                                <li key={it.to}>
                                    <Link
                                        to={it.to}
                                        onClick={onClose}
                                        className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${active
                                                ? "bg-gradient-to-r from-amber-400/15 to-[color:var(--neon-purple)]/15 text-foreground"
                                                : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                                            }`}
                                    >
                                        <span
                                            className={`flex h-8 w-8 items-center justify-center rounded-lg border ${active
                                                    ? "border-amber-400/40 bg-amber-400/10 text-amber-300"
                                                    : "border-white/5 bg-white/[0.03] text-muted-foreground group-hover:text-foreground"
                                                }`}
                                        >
                                            <Icon className="h-4 w-4" />
                                        </span>
                                        <span className="font-medium">{it.label}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>

                    <div className="mt-6 space-y-1 px-1">
                        <Link
                            to="/dashboard"
                            onClick={onClose}
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition hover:bg-white/5 hover:text-foreground"
                        >
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/5 bg-white/[0.03]">
                                <LayoutDashboard className="h-4 w-4" />
                            </span>
                            <span className="font-medium">Exit to App</span>
                        </Link>
                        <button
                            onClick={() => {
                                sessionStore.clear();
                                window.location.href = "/login";
                            }}
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition hover:bg-white/5 hover:text-foreground"
                        >
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/5 bg-white/[0.03]">
                                <LogOut className="h-4 w-4" />
                            </span>
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                </nav>
            </aside>
        </>
    );
}
