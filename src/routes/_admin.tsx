import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { useSession } from "@/lib/session";
import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_admin")({
    component: AdminLayout,
});

function AdminLayout() {
    const session = useSession();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        // Wait one tick for session hydration
        const t = setTimeout(() => setChecked(true), 50);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        if (!checked) return;
        if (!session) {
            navigate({ to: "/login" });
        }
    }, [checked, session, navigate]);

    if (!checked) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#050816] text-muted-foreground">
                Loading admin…
            </div>
        );
    }

    if (session && session.role !== "admin") {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#050816] p-6">
                <div className="max-w-md rounded-2xl border border-amber-400/30 bg-amber-400/5 p-8 text-center">
                    <ShieldAlert className="mx-auto h-10 w-10 text-amber-300" />
                    <h1 className="mt-4 font-display text-2xl font-bold">Access denied</h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        You need an admin account to view this page. Sign in with an email
                        starting with <span className="font-mono text-foreground">admin</span> (mock auth).
                    </p>
                    <button
                        onClick={() => navigate({ to: "/dashboard" })}
                        className="mt-5 inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold hover:bg-white/[0.08]"
                    >
                        Back to dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-[#050816] text-foreground">
            <div className="pointer-events-none fixed inset-0 -z-10 bg-grid opacity-40" />
            <div
                className="pointer-events-none fixed inset-0 -z-10"
                style={{ background: "var(--gradient-hero)" }}
            />
            <div className="mx-auto flex max-w-[1600px]">
                <AdminSidebar open={open} onClose={() => setOpen(false)} />
                <div className="flex min-h-screen flex-1 flex-col">
                    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-white/5 bg-[#050816]/80 px-4 backdrop-blur-xl md:px-6">
                        <button
                            onClick={() => setOpen(true)}
                            className="rounded-lg border border-white/10 bg-white/5 p-2 text-muted-foreground hover:text-foreground lg:hidden"
                            aria-label="Open menu"
                        >
                            ≡
                        </button>
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-200">
                                <ShieldAlert className="h-3 w-3" /> Admin
                            </span>
                            <span className="hidden text-sm text-muted-foreground sm:block">
                                Signed in as <span className="text-foreground">{session?.email}</span>
                            </span>
                        </div>
                    </header>
                    <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
}
