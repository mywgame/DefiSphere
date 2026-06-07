import { About } from "@/components/defi/About";
import { Faq } from "@/components/defi/Faq";
import { Features } from "@/components/defi/Features";
import { Footer } from "@/components/defi/Footer";
import { Hero } from "@/components/defi/Hero";
import { Navbar } from "@/components/defi/Navbar";
import { Roadmap } from "@/components/defi/Roadmap";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
    head: () => ({
        meta: [
            { title: "DefiSphere — Earn Rewards Through DeFi Participation" },
            { name: "description", content: "Stake assets, provide liquidity, refer users, participate in governance and earn DFX rewards on DefiSphere." },
            { property: "og:title", content: "DefiSphere — Earn Rewards Through DeFi Participation" },
            { property: "og:description", content: "The unified DeFi reward layer. Stake, provide liquidity, govern and refer to earn DFX." },
        ],
    }),
    component: Index,
});

function Index() {
    return (
        <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
            <div
                className="pointer-events-none fixed inset-0 -z-10"
                style={{
                    background:
                        "radial-gradient(1200px 600px at 80% -10%, rgba(120,90,255,0.25), transparent 60%), radial-gradient(900px 500px at -10% 30%, rgba(80,180,255,0.18), transparent 60%), #050816",
                }}
            />
            <Navbar />
            <main>
                <Hero />
                <Features />
                <About />
                <Roadmap />
                <Faq />
            </main>
            <Footer />
        </div>
    );
}
