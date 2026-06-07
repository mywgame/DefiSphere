import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopNav } from "@/components/dashboard/TopNav";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/_app")({
    component: AppLayout,
});

function AppLayout() {
    const [open, setOpen] = useState(false);
    return (
        <div className="relative min-h-screen bg-[#050816] text-foreground">
            <div className="pointer-events-none fixed inset-0 -z-10 bg-grid opacity-40" />
            <div
                className="pointer-events-none fixed inset-0 -z-10"
                style={{ background: "var(--gradient-hero)" }}
            />
            <div className="mx-auto flex max-w-[1600px]">
                <Sidebar open={open} onClose={() => setOpen(false)} />
                <div className="flex min-h-screen flex-1 flex-col lg:pl-0">
                    <TopNav onMenu={() => setOpen(true)} />
                    <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
}
