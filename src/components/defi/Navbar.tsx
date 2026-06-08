import { sessionStore, useSession } from "@/lib/session";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  FileText,
  Hexagon,
  Info,
  LogIn,
  LogOut,
  Map,
  Menu,
  Sparkles,
  X,
} from "lucide-react";
import { useState } from "react";

const links = [
  {
    label: "Features",
    href: "#features",
    icon: Sparkles,
    description: "Explore DFX earning tools",
  },
  { label: "About", href: "#about", icon: Info, description: "Learn how DefiSphere works" },
  { label: "Roadmap", href: "#roadmap", icon: Map, description: "See the launch milestones" },
  { label: "FAQ", href: "#faq", icon: BookOpen, description: "Quick answers and details" },
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
          <span
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg"
            style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow-cyan)" }}
          >
            <Hexagon className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">
            Defi<span className="text-gradient">Sphere</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
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
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 md:hidden"
            aria-label="Menu"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 top-0 z-[-1] bg-[#050816]/70 backdrop-blur-sm md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.aside
              className="absolute right-4 top-20 w-[min(21rem,calc(100vw-2rem))] overflow-hidden rounded-2xl glass-card"
              initial={{ opacity: 0, x: 28, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 28, scale: 0.98 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <div>
                  <p className="font-display text-sm font-semibold">Menu</p>
                  <p className="text-xs text-muted-foreground">Navigate DefiSphere</p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5 transition hover:border-[color:var(--neon-cyan)] hover:bg-white/10"
                  aria-label="Close menu"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-2 p-3">
                {links.map(({ icon: Icon, ...l }) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-foreground/90 transition hover:bg-white/8"
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white/8 text-[color:var(--neon-cyan)]">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold">{l.label}</span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {l.description}
                      </span>
                    </span>
                  </a>
                ))}
              </div>

              <div className="border-t border-white/10 p-3">
                {session ? (
                  <button
                    onClick={() => {
                      sessionStore.clear();
                      setOpen(false);
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-foreground/90 transition hover:bg-white/8"
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white/8 text-[color:var(--neon-cyan)]">
                      <LogOut className="h-4 w-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block">Sign out</span>
                      <span className="block truncate text-xs font-normal text-muted-foreground">
                        {session.email}
                      </span>
                    </span>
                  </button>
                ) : (
                  <div className="grid gap-2">
                    <Link
                      to="/login"
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:scale-[1.01]"
                      style={{
                        background: "var(--gradient-primary)",
                        boxShadow: "var(--shadow-glow-cyan)",
                      }}
                    >
                      <LogIn className="h-4 w-4" />
                      Login
                    </Link>
                    <a
                      href="#whitepaper"
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-foreground transition hover:border-[color:var(--neon-cyan)] hover:bg-white/10"
                    >
                      <FileText className="h-4 w-4" />
                      Whitepaper
                    </a>
                  </div>
                )}
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
