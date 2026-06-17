import { sessionStore, useSession } from "@/lib/session";
import { Link } from "@tanstack/react-router";
import { Bell, ChevronDown, LogOut, Menu, Search, User, Wallet } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function TopNav({ onMenu }: { onMenu: () => void }) {
    const session = useSession();
    const [openMenu, setOpenMenu] = useState(false);
    const [openNotif, setOpenNotif] = useState(false);
    const wrapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const onClick = (e: MouseEvent) => {
            if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
                setOpenMenu(false);
                setOpenNotif(false);
            }
        };
        document.addEventListener("mousedown", onClick);
        return () => document.removeEventListener("mousedown", onClick);
    }, []);

    const email = session?.email ?? "user@defisphere.io";
    const initial = email.charAt(0).toUpperCase();

    // Professional Clean Trigger
    const handleLogout = async () => {
        try {
            setOpenMenu(false);
            await sessionStore.clear();
        } catch (error) {
            console.error("TopNav logout failed:", error);
        }
    };

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-white/5 bg-[#050816]/80 px-4 backdrop-blur-xl md:px-6">
            <button
                onClick={onMenu}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-white/5 hover:text-foreground lg:hidden"
            >
                <Menu className="h-5 w-5" />
            </button>

            <div className="relative flex-1 max-w-md hidden md:block">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                    placeholder="Search transactions, stakes..."
                    className="h-9 w-full rounded-xl border border-white/5 bg-white/[0.03] pl-9 pr-4 text-xs focus:border-[color:var(--neon-cyan)]/30 focus:outline-none placeholder:text-muted-foreground/50"
                />
            </div>

            <div className="ml-auto flex items-center gap-4" ref={wrapRef}>
                {/* Notifications */}
                <div className="relative">
                    <button
                        onClick={() => {
                            setOpenNotif(!openNotif);
                            setOpenMenu(false);
                        }}
                        className="relative rounded-xl border border-white/5 bg-white/[0.03] p-2.5 text-muted-foreground hover:text-foreground"
                    >
                        <Bell className="h-4 w-4" />
                        <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-[color:var(--neon-cyan)] shadow-[0_0_6px_var(--neon-cyan)]" />
                    </button>

                    {openNotif && (
                        <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-white/5 bg-[#0b0f24] p-4 shadow-xl backdrop-blur-xl">
                            <div className="flex items-center justify-between border-b border-white/5 pb-2">
                                <p className="text-xs font-semibold text-foreground">Notifications</p>
                                <button className="text-[10px] text-[color:var(--neon-cyan)] hover:underline">
                                    Mark all read
                                </button>
                            </div>
                            <div className="mt-3 space-y-3">
                                <div className="rounded-xl bg-white/[0.02] p-2.5 text-left transition hover:bg-white/[0.04]">
                                    <p className="text-xs font-medium text-foreground">Staking Reward Received</p>
                                    <p className="mt-0.5 text-[10px] text-muted-foreground leading-normal">
                                        You earned +14.22 DFX from Quantum Yield Pro package.
                                    </p>
                                    <p className="mt-1 text-[9px] text-muted-foreground/60">2 hours ago</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* User Dropdown Profile Menu */}
                <div className="relative">
                    <button
                        onClick={() => {
                            setOpenMenu(!openMenu);
                            setOpenNotif(false);
                        }}
                        className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/[0.03] p-1.5 pr-2.5 transition hover:bg-white/[0.06]"
                    >
                        <div
                            className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold text-primary-foreground"
                            style={{ background: "var(--gradient-primary)" }}
                        >
                            {initial}
                        </div>
                        <span className="hidden text-xs font-medium text-foreground/90 sm:block max-w-[100px] truncate">
                            {email}
                        </span>
                        <ChevronDown className="h-3 w-3 text-muted-foreground" />
                    </button>

                    {openMenu && (
                        <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-white/5 bg-[#0b0f24] p-1.5 shadow-xl backdrop-blur-xl animate-in fade-in slide-in-from-top-1">
                            {[
                                { to: "/profile", label: "My Profile", icon: User },
                                { to: "/wallet", label: "Wallet Overview", icon: Wallet },
                                { to: "/settings", label: "Notification Settings", icon: Bell },
                            ].map((it) => (
                                <Link
                                    key={it.label}
                                    to={it.to}
                                    onClick={() => setOpenMenu(false)}
                                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground/90 hover:bg-white/5"
                                >
                                    <it.icon className="h-4 w-4 text-muted-foreground" />
                                    {it.label}
                                </Link>
                            ))}

                            {/* Professional Clean Logout Button */}
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="mt-1 flex w-full items-center gap-2 rounded-lg border-t border-white/5 px-3 py-2 pt-2 text-sm text-foreground/90 hover:bg-white/5"
                            >
                                <LogOut className="h-4 w-4 text-muted-foreground" />
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}