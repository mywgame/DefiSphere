import { sessionStore } from "@/lib/session";
import { supabase } from "@/lib/supabaseClient"; // 🔥 Fix: Supabase import kiya backend logout ke liye
import { Link, useNavigate, useRouter, useRouterState } from "@tanstack/react-router"; // 🔥 Fix: Navigation state hooks add kiye
import {
    ArrowDownToLine,
    ArrowUpFromLine,
    Coins,
    Gift,
    LayoutDashboard,
    LogOut,
    Receipt,
    Settings,
    Shield,
    User,
    Users,
    Wallet,
    X
} from "lucide-react";
import { toast } from "sonner";

const items = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/wallet", label: "Wallet", icon: Wallet },
    { to: "/deposit", label: "Deposit", icon: ArrowDownToLine },
    { to: "/withdraw", label: "Withdraw", icon: ArrowUpFromLine },
    { to: "/staking", label: "Staking", icon: Coins },
    { to: "/rewards", label: "Rewards", icon: Gift },
    { to: "/referrals", label: "Referrals", icon: Users },
    { to: "/transactions", label: "Transactions", icon: Receipt },
    { to: "/profile", label: "Profile", icon: User },
    { to: "/security", label: "Security", icon: Shield },
    { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
    const pathname = useRouterState({ select: (s) => s.location.pathname });
    const navigate = useNavigate();
    const router = useRouter();

    // 🔥 Professional Fixed Logout Handler
    const handleLogout = async () => {
        try {
            // 1. Supabase backend session ko clear karo
            const { error } = await supabase.auth.signOut();
            if (error) throw error;

            // 2. Local session storage clean karo
            await sessionStore.clear();

            toast.success("Logged out successfully");

            // 3. Router state invalidate karo aur route change karo redirection loop todne ke liye
            router.invalidate();
            onClose();

            // 4. Clean window replace method safely login screen par throw karega
            window.location.replace("/login");
        } catch (error: any) {
            console.error("Sidebar logout clean failed:", error);
            toast.error(error.message || "Failed to log out cleanly");
        }
    };

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
                    } lg:static lg:z-0 lg:bg-transparent flex flex-col`}
            >
                {/* Header (Logo block) - Same Premium Design */}
                <div className="flex h-16 items-center justify-between px-5 flex-shrink-0">
                    <Link to="/" className="flex items-center gap-2.5 group" onClick={onClose}>
                        <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-gradient-to-br from-[#2F53FF] via-[#263DFF] to-[#8024FF] shadow-[0_4px_10px_rgba(38,61,255,0.25)] transition-transform duration-300 group-hover:scale-105">
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-white"
                            >
                                <path d="M12 3L2 21h20L12 3z" />
                            </svg>
                        </div>
                        <span className="font-sans text-[17px] font-extrabold tracking-tight text-white antialiased">
                            DeFi<span className="font-medium tracking-wide bg-gradient-to-r from-[#00A3FF] via-[#00D1FF] to-[#00F0FF] bg-clip-text text-transparent ml-[1px]">Sphere</span>
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

                {/* Nav section - Menu list with Logout right under Settings */}
                <nav className="px-3 py-2 flex-1 overflow-y-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                    <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
                        Menu
                    </p>
                    <ul className="space-y-1">
                        {items.map((it) => {
                            const active = pathname === it.to;
                            const Icon = it.icon;
                            return (
                                <li key={it.to}>
                                    <Link
                                        to={it.to}
                                        onClick={onClose}
                                        className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${active
                                            ? "bg-gradient-to-r from-[color:var(--neon-cyan)]/15 to-[color:var(--neon-purple)]/15 text-foreground"
                                            : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                                            }`}
                                    >
                                        <span
                                            className={`flex h-8 w-8 items-center justify-center rounded-lg border ${active
                                                ? "border-[color:var(--neon-cyan)]/40 bg-[color:var(--neon-cyan)]/10 text-[color:var(--neon-cyan)]"
                                                : "border-white/5 bg-white/[0.03] text-muted-foreground group-hover:text-foreground"
                                                }`}
                                        >
                                            <Icon className="h-4 w-4" />
                                        </span>
                                        <span className="font-medium">{it.label}</span>
                                        {active && (
                                            <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[color:var(--neon-cyan)] shadow-[0_0_10px_var(--neon-cyan)]" />
                                        )}
                                    </Link>
                                </li>
                            );
                        })}

                        {/* Logout Button inside the menu list exactly below settings */}
                        <li className="pt-1">
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition hover:bg-white/5 hover:text-foreground"
                            >
                                <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/5 bg-white/[0.03] text-muted-foreground group-hover:text-foreground">
                                    <LogOut className="h-4 w-4" />
                                </span>
                                <span className="font-medium">Logout</span>
                            </button>
                        </li>
                    </ul>
                </nav>

                {/* Bottom Card Area */}
                <div className="p-4 flex-shrink-0">
                    <div className="rounded-2xl border border-white/5 bg-gradient-to-br from-[color:var(--neon-purple)]/15 to-[color:var(--neon-cyan)]/10 p-4">
                        <div className="flex items-center gap-2">
                            <Gift className="h-4 w-4 text-[color:var(--neon-cyan)]" />
                            <p className="text-xs font-semibold text-white">Refer & earn 8%</p>
                        </div>
                        <p className="mt-1 text-[11px] leading-snug text-muted-foreground">
                            Invite friends and earn lifetime commissions on their stakes.
                        </p>
                        <Link
                            to="/referrals"
                            onClick={onClose}
                            className="mt-3 inline-flex w-full items-center justify-center rounded-lg bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-foreground transition hover:bg-white/15"
                        >
                            Get my link
                        </Link>
                    </div>
                </div>
            </aside>
        </>
    );
}