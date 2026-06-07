import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Eye, EyeOff, Hexagon, Loader2, Lock, Mail, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { mockSignIn, useSession } from "@/lib/session";

const schema = z.object({
    email: z.string().trim().min(1, "Email is required").email("Enter a valid email").max(255),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(128, "Password too long"),
    remember: z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;

export const Route = createFileRoute("/login")({
    head: () => ({
        meta: [
            { title: "Login — DefiSphere" },
            { name: "description", content: "Sign in to your DefiSphere account to stake, earn and govern." },
        ],
    }),
    component: LoginPage,
});

function LoginPage() {
    const navigate = useNavigate();
    const router = useRouter();
    const session = useSession();
    const [showPw, setShowPw] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { email: "", password: "", remember: true },
        mode: "onBlur",
    });

    useEffect(() => {
        if (session) navigate({ to: "/dashboard" });
    }, [session, navigate]);

    const onSubmit = async (values: FormValues) => {
        setServerError(null);
        try {
            await mockSignIn(values.email, values.password);
            router.invalidate();
            navigate({ to: "/dashboard" });
        } catch (e) {
            setServerError(e instanceof Error ? e.message : "Sign in failed. Try again.");
        }
    };

    const remember = watch("remember");

    return (
        <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
            <div
                className="pointer-events-none fixed inset-0 -z-10"
                style={{
                    background:
                        "radial-gradient(900px 500px at 80% 0%, rgba(120,90,255,0.28), transparent 60%), radial-gradient(800px 480px at 0% 80%, rgba(80,180,255,0.20), transparent 60%), #050816",
                }}
            />
            <div className="pointer-events-none fixed inset-0 -z-10 bg-grid opacity-40" />

            <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-10 md:py-16">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="grid w-full gap-10 lg:grid-cols-2 lg:gap-16"
                >
                    {/* Left: brand panel */}
                    <div className="hidden flex-col justify-between rounded-3xl glass-card p-10 lg:flex">
                        <Link to="/" className="flex items-center gap-2.5">
                            <span
                                className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg"
                                style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow-cyan)" }}
                            >
                                <Hexagon className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
                            </span>
                            <span className="font-display text-xl font-bold tracking-tight">
                                Defi<span className="text-gradient">Sphere</span>
                            </span>
                        </Link>

                        <div className="space-y-6">
                            <h1 className="font-display text-4xl font-bold leading-tight">
                                Welcome back to the <span className="text-gradient">on-chain</span> reward layer.
                            </h1>
                            <p className="max-w-md text-muted-foreground">
                                Sign in to manage your staking positions, claim DFX rewards, vote on proposals
                                and track your liquidity in real time.
                            </p>
                            <div className="grid gap-3 text-sm">
                                {[
                                    "Non-custodial sessions, end-to-end encrypted",
                                    "Real-time portfolio across 12+ chains",
                                    "Governance voting with delegated power",
                                ].map((t) => (
                                    <div key={t} className="flex items-center gap-3 text-foreground/80">
                                        <ShieldCheck className="h-4 w-4 text-[color:var(--neon-cyan)]" />
                                        {t}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <p className="text-xs text-muted-foreground">
                            © {new Date().getFullYear()} DefiSphere Labs. All rights reserved.
                        </p>
                    </div>

                    {/* Right: form */}
                    <div className="rounded-3xl glass-card p-7 md:p-10">
                        <Link to="/" className="mb-8 inline-flex items-center gap-2 lg:hidden">
                            <span
                                className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg"
                                style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow-cyan)" }}
                            >
                                <Hexagon className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
                            </span>
                            <span className="font-display text-lg font-bold">
                                Defi<span className="text-gradient">Sphere</span>
                            </span>
                        </Link>

                        <div className="mb-8">
                            <h2 className="font-display text-3xl font-bold tracking-tight">Sign in</h2>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Don't have an account?{" "}
                                <Link to="/login" className="font-medium text-[color:var(--neon-cyan)] hover:underline">
                                    Create one
                                </Link>
                            </p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                            {serverError && (
                                <div
                                    role="alert"
                                    className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive-foreground"
                                >
                                    {serverError}
                                </div>
                            )}

                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium text-foreground/90">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        autoComplete="email"
                                        placeholder="you@defisphere.io"
                                        aria-invalid={!!errors.email}
                                        className="h-11 border-white/10 bg-white/5 pl-9 text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-[color:var(--neon-cyan)]"
                                        {...register("email")}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-xs text-destructive">{errors.email.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label htmlFor="password" className="text-sm font-medium text-foreground/90">
                                        Password
                                    </label>
                                    <Link
                                        to="/login"
                                        className="text-xs font-medium text-muted-foreground hover:text-[color:var(--neon-cyan)]"
                                    >
                                        Forgot?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type={showPw ? "text" : "password"}
                                        autoComplete="current-password"
                                        placeholder="••••••••"
                                        aria-invalid={!!errors.password}
                                        className="h-11 border-white/10 bg-white/5 pl-9 pr-10 text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-[color:var(--neon-cyan)]"
                                        {...register("password")}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPw((v) => !v)}
                                        aria-label={showPw ? "Hide password" : "Show password"}
                                        className="absolute right-2 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-white/5 hover:text-foreground"
                                    >
                                        {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-xs text-destructive">{errors.password.message}</p>
                                )}
                            </div>

                            <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
                                <Checkbox
                                    checked={!!remember}
                                    onCheckedChange={(v) => setValue("remember", v === true)}
                                />
                                Keep me signed in for 7 days
                            </label>

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="relative h-11 w-full overflow-hidden rounded-lg border border-white/10 text-base font-semibold text-primary-foreground transition-shadow hover:shadow-[var(--shadow-glow-cyan)]"
                                style={{ background: "var(--gradient-primary)" }}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Signing in…
                                    </>
                                ) : (
                                    "Sign in"
                                )}
                            </Button>

                            <div className="relative py-2 text-center">
                                <span className="absolute inset-x-0 top-1/2 -z-0 h-px bg-white/10" />
                                <span className="relative bg-transparent px-3 text-xs uppercase tracking-wider text-muted-foreground">
                                    Secure session
                                </span>
                            </div>

                            <p className="text-center text-xs text-muted-foreground">
                                By signing in you agree to our{" "}
                                <a href="#" className="underline hover:text-foreground">Terms</a> and{" "}
                                <a href="#" className="underline hover:text-foreground">Privacy Policy</a>.
                            </p>
                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
