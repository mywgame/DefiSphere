import { sessionStore, useSession } from "@/lib/session";
import { Link } from "@tanstack/react-router";
import { Bell, ChevronDown, KeyRound, LogOut, Menu, Search, Shield, User, Wallet } from "lucide-react";
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

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-white/5 bg-[#050816]/80 px-4 backdrop-blur-xl md:px-6">
            <button
                onClick={onMenu}
                className="rounded-lg border border-white/10 bg-white/5 p-2 text-muted-foreground hover:text-foreground lg:hidden"
                aria-label="Open menu"
            >
                <Menu className="h-4 w-4" />
            </button>

            <div className="relative hidden flex-1 max-w-md md:block">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                    placeholder="Search transactions, packages…"
                    className="h-10 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-[color:var(--neon-cyan)]/40 focus:outline-none"
                />
            </div>

            <div ref={wrapRef} className="ml-auto flex items-center gap-2 md:gap-3">
                <div className="relative">
                    <button
                        onClick={() => {
                            setOpenNotif((v) => !v);
                            setOpenMenu(false);
                        }}
                        className="relative rounded-xl border border-white/10 bg-white/[0.04] p-2.5 text-muted-foreground hover:text-foreground"
                        aria-label="Notifications"
                    >
                        <Bell className="h-4 w-4" />
                        <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[color:var(--neon-pink)] shadow-[0_0_8px_var(--neon-pink)]" />
                    </button>
                    {openNotif && (
                        <div className="absolute right-0 mt-2 w-80 overflow-hidden rounded-2xl border border-white/10 bg-[#0a0d1e]/95 p-2 shadow-2xl backdrop-blur-xl">
                            <p className="px-3 pb-2 pt-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Notifications
                            </p>
                            {[
                                { t: "Reward credited", d: "+184.22 DFX claimed", time: "2m ago" },
                                { t: "Deposit confirmed", d: "5,000 USDT received", time: "1h ago" },
                                { t: "New referral", d: "alex.eth joined via your link", time: "3h ago" },
                            ].map((n) => (
                                <div key={n.t} className="rounded-lg p-3 hover:bg-white/5">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium">{n.t}</p>
                                        <span className="text-[10px] text-muted-foreground">{n.time}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">{n.d}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="relative">
                    <button
                        onClick={() => {
                            setOpenMenu((v) => !v);
                            setOpenNotif(false);
                        }}
                        className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] p-1 pr-2 hover:bg-white/[0.07]"
                    >
                        <span
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold text-primary-foreground"
                            style={{ background: "var(--gradient-primary)" }}
                        >
                            {initial}
                        </span>
                        <span className="hidden text-left sm:block">
                            <span className="block text-xs font-semibold leading-tight">My account</span>
                            <span className="block max-w-[140px] truncate text-[10px] text-muted-foreground">
                                {email}
                            </span>
                        </span>
                        <ChevronDown className="hidden h-3.5 w-3.5 text-muted-foreground sm:block" />
                    </button>
                    {openMenu && (
                        <div className="absolute right-0 mt-2 w-64 overflow-hidden rounded-2xl border border-white/10 bg-[#0a0d1e]/95 p-2 shadow-2xl backdrop-blur-xl">
                            <div className="border-b border-white/5 px-3 py-3">
                                <p className="truncate text-sm font-semibold">{email}</p>
                                <p className="text-[11px] text-muted-foreground">Verified · Tier 2</p>
                            </div>
                            {[
                                { to: "/profile", label: "My Profile", icon: User },
                                { to: "/security", label: "Authenticator (2FA)", icon: Shield },
                                { to: "/security", label: "Change Password", icon: KeyRound },
                                { to: "/wallet", label: "Connected Wallets", icon: Wallet },
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
                            <button
                                onClick={() => {
                                    sessionStore.clear();
                                    window.location.href = "/login";
                                }}
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