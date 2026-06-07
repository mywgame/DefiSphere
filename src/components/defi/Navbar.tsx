import { sessionStore, useSession } from "@/lib/session";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Hexagon, LogOut, Menu } from "lucide-react";
import { useState } from "react";

const links = [
    { label: "Features", href: "#features" },
    { label: "About", href: "#about" },
    { label: "Roadmap", href: "#roadmap" },
    { label: "FAQ", href: "#faq" },
];

export function Navbar() {
    const [open, setOpen] = useState(false);
    const session = useSession();
    return (
        <motion.header
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-x-0 top-0 z-50"
        >
            <div className="mx-auto mt-4 flex max-w-7xl items-center justify-between rounded-2xl glass-card px-5 py-3 md:px-7 md:py-4">
                <Link to="/" className="flex items-center gap-2.5">
                    <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg"
                        style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow-cyan)" }}>
                        <Hexagon className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
                    </span>
                    <span className="font-display text-lg font-bold tracking-tight">
                        Defi<span className="text-gradient">Sphere</span>
                    </span>
                </Link>

                <nav className="hidden items-center gap-8 md:flex">
                    {links.map(l => (
                        <a key={l.href} href={l.href}
                            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                            {l.label}
                        </a>
                    ))}
                </nav>

                <div className="flex items-center gap-3">
                    {session ? (
                        <>
                            <Link
                                to="/dashboard"
                                className="hidden rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-foreground transition hover:border-[color:var(--neon-cyan)] hover:bg-white/10 sm:inline-block"
                            >
                                Dashboard
                            </Link>
                            <button
                                onClick={() => sessionStore.clear()}
                                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-2 text-sm font-medium text-foreground transition hover:border-[color:var(--neon-cyan)] hover:bg-white/10"
                                aria-label="Sign out"
                            >
                                <LogOut className="h-4 w-4" />
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="hidden rounded-full px-4 py-2 text-sm font-medium text-foreground/90 transition hover:text-foreground sm:inline-block"
                            >
                                Login
                            </Link>
                            <a
                                href="#whitepaper"
                                className="hidden rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-foreground transition hover:border-[color:var(--neon-cyan)] hover:bg-white/10 md:inline-block"
                            >
                                Whitepaper
                            </a>
                        </>
                    )}
                    <button
                        onClick={() => setOpen(v => !v)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 md:hidden"
                        aria-label="Menu"
                    >
                        <Menu className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {open && (
                <div className="mx-auto mt-2 max-w-7xl rounded-2xl glass-card p-4 md:hidden">
                    <div className="flex flex-col gap-3">
                        {links.map(l => (
                            <a key={l.href} href={l.href} onClick={() => setOpen(false)}
                                className="rounded-lg px-3 py-2 text-sm text-foreground/90 hover:bg-white/5">
                                {l.label}
                            </a>
                        ))}
                        {session ? (
                            <button
                                onClick={() => { sessionStore.clear(); setOpen(false); }}
                                className="rounded-lg px-3 py-2 text-left text-sm text-foreground/90 hover:bg-white/5"
                            >
                                Sign out ({session.email})
                            </button>
                        ) : (
                            <>
                                <Link to="/login" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm text-foreground/90 hover:bg-white/5">Login</Link>
                                <a href="#whitepaper" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm text-foreground/90 hover:bg-white/5">Whitepaper</a>
                            </>
                        )}
                    </div>
                </div>
            )}
        </motion.header>
    );
}