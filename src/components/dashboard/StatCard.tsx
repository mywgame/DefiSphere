import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";

export function StatCard({
    label,
    value,
    unit = "USDT",
    delta,
    icon: Icon,
    tone = "cyan",
    index = 0,
}: {
    label: string;
    value: string | number;
    unit?: string;
    delta?: number;
    icon: LucideIcon;
    tone?: "cyan" | "purple" | "pink" | "emerald";
    index?: number;
}) {
    const toneRing: Record<string, string> = {
        cyan: "from-[color:var(--neon-cyan)]/30 to-transparent",
        purple: "from-[color:var(--neon-purple)]/30 to-transparent",
        pink: "from-[color:var(--neon-pink)]/30 to-transparent",
        emerald: "from-emerald-400/30 to-transparent",
    };
    const toneIcon: Record<string, string> = {
        cyan: "text-[color:var(--neon-cyan)] border-[color:var(--neon-cyan)]/30 bg-[color:var(--neon-cyan)]/10",
        purple: "text-[color:var(--neon-purple)] border-[color:var(--neon-purple)]/30 bg-[color:var(--neon-purple)]/10",
        pink: "text-[color:var(--neon-pink)] border-[color:var(--neon-pink)]/30 bg-[color:var(--neon-pink)]/10",
        emerald: "text-emerald-300 border-emerald-400/30 bg-emerald-400/10",
    };
    const positive = (delta ?? 0) >= 0;

    return (
        <motion.div
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: index * 0.06 }}
            className="relative overflow-hidden rounded-2xl glass-card p-5"
        >
            <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br blur-2xl ${toneRing[tone]}`} />
            <div className="relative flex items-start justify-between">
                <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
                    <p className="mt-2 font-display text-2xl font-bold tracking-tight md:text-3xl">
                        {typeof value === "number" ? value.toLocaleString(undefined, { maximumFractionDigits: 2 }) : value}
                        <span className="ml-1 text-sm font-medium text-muted-foreground">{unit}</span>
                    </p>
                    {delta !== undefined && (
                        <p className={`mt-1.5 inline-flex items-center gap-1 text-xs font-medium ${positive ? "text-emerald-300" : "text-rose-300"}`}>
                            {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                            {positive ? "+" : ""}
                            {delta}% · 24h
                        </p>
                    )}
                </div>
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl border ${toneIcon[tone]}`}>
                    <Icon className="h-5 w-5" />
                </span>
            </div>
        </motion.div>
    );
}