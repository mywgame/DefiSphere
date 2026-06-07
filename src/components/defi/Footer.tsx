import { Code2, Hexagon, MessageCircle, Send } from "lucide-react";

export function Footer() {
    return (
        <footer className="relative border-t border-white/5 pt-16 pb-10">
            <div
                className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-px max-w-4xl"
                style={{ background: "linear-gradient(90deg, transparent, rgba(120,180,255,0.6), transparent)" }}
            />
            <div className="mx-auto max-w-7xl px-5 lg:px-8">
                <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center gap-2.5">
                            <span className="grid h-9 w-9 place-items-center rounded-lg" style={{ background: "var(--gradient-primary)" }}>
                                <Hexagon className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
                            </span>
                            <span className="font-display text-lg font-bold">Defi<span className="text-gradient">Sphere</span></span>
                        </div>
                        <p className="mt-4 max-w-xs text-sm text-muted-foreground">
                            The unified DeFi reward layer. Stake, provide liquidity, govern and refer — all in one place.
                        </p>
                        <div className="mt-5 flex gap-2">
                            {[Send, Code2, MessageCircle].map((Icon, i) => (
                                <a key={i} href="#"
                                    className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5 text-muted-foreground transition hover:border-[color:var(--neon-cyan)] hover:text-foreground">
                                    <Icon className="h-4 w-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {[
                        { h: "Protocol", l: ["Stake", "Liquidity", "Governance", "Referrals"] },
                        { h: "Resources", l: ["Whitepaper", "Docs", "Audits", "Bug Bounty"] },
                        { h: "Company", l: ["About", "Roadmap", "Blog", "Careers"] },
                    ].map(col => (
                        <div key={col.h}>
                            <div className="text-xs font-semibold uppercase tracking-wider text-foreground">{col.h}</div>
                            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
                                {col.l.map(i => (
                                    <li key={i}><a href="#" className="transition hover:text-foreground">{i}</a></li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/5 pt-6 text-xs text-muted-foreground md:flex-row">
                    <span>© 2026 DefiSphere Labs. All rights reserved.</span>
                    <span>Built on-chain · Audited by Trail of Bits & CertiK</span>
                </div>
            </div>
        </footer>
    );
}
