import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, Lock, Mail, ShieldCheck, User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// 🔥 Supabase client config strictly connected 
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

// 🔥 Strict Validation Schema with Full Name & Password Matching
const schema = z
    .object({
        fullName: z.string().trim().min(2, "Full Name must be at least 2 characters").max(100),
        email: z.string().trim().min(1, "Email is required").email("Enter a valid email").max(255),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .max(128, "Password too long"),
        confirm: z.string().min(8, "Please confirm your password"),
    })
    .refine((v) => v.password === v.confirm, {
        path: ["confirm"],
        message: "Passwords do not match",
    });

type FormValues = z.infer<typeof schema>;

export const Route = createFileRoute("/register")({
    head: () => ({
        meta: [
            { title: "Create account — DefiSphere" },
            { name: "description", content: "Create your DefiSphere account to stake, earn and govern." },
        ],
    }),
    component: RegisterPage,
});

function RegisterPage() {
    const navigate = useNavigate();
    const [showPw, setShowPw] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { fullName: "", email: "", password: "", confirm: "" },
        mode: "onBlur",
    });

    // 🔥 Fixed Form Submission linked directly to Supabase client
    const onSubmit = async (values: FormValues) => {
        setServerError(null);
        setSuccessMsg(null);

        try {
            const { data: authData, error } = await supabase.auth.signUp({
                email: values.email,
                password: values.password,
                options: {
                    data: {
                        full_name: values.fullName, // Storing name inside Supabase Meta
                    },
                },
            });

            if (error) throw error;

            // Setting local state layout for premium feedback message
            setSuccessMsg("Account created! Check your inbox to confirm your email, then sign in.");
            toast.success("Account created successfully!");

            // Smooth redirection delay
            setTimeout(() => {
                navigate({ to: "/login" });
            }, 3000);

        } catch (e: any) {
            console.error("Signup core error:", e);
            const errorText = e?.message || "Sign up failed. Please try again.";
            setServerError(errorText);
            toast.error(errorText);
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
            {/* Background Gradients from Lovable premium design */}
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
                    {/* LEFT PANEL - Premium Sidebar Delta Brand Box */}
                    <div className="hidden flex-col justify-between rounded-3xl glass-card p-10 lg:flex">
                        <Link to="/" className="flex items-center gap-2.5 group">
                            {/* Actual Delta Logo */}
                            <div className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-gradient-to-br from-[#2F53FF] via-[#263DFF] to-[#8024FF] shadow-[0_4px_12px_rgba(38,61,255,0.3)]">
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-white"
                                >
                                    <path d="M12 3L2 21h20L12 3z" />
                                </svg>
                            </div>
                            <span className="font-sans text-[22px] font-extrabold tracking-tight text-white antialiased">
                                Defi<span className="font-medium tracking-wide bg-gradient-to-r from-[#00A3FF] via-[#00D1FF] to-[#00F0FF] bg-clip-text text-transparent ml-[1px]">Sphere</span>
                            </span>
                        </Link>

                        <div className="space-y-6">
                            <h1 className="font-display text-4xl font-bold leading-tight">
                                Join the <span className="text-gradient">on-chain</span> reward layer.
                            </h1>
                            <p className="max-w-md text-muted-foreground">
                                Create an account to stake assets, claim DFX rewards and track liquidity across chains.
                            </p>
                            <div className="grid gap-3 text-sm">
                                {[
                                    "Non-custodial sessions",
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

                    {/* RIGHT PANEL - Unified Upgraded Form */}
                    <div className="rounded-3xl glass-card p-7 md:p-10">
                        {/* Mobile View Logo */}
                        <Link to="/" className="mb-8 inline-flex items-center gap-2 lg:hidden">
                            <div className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-gradient-to-br from-[#2F53FF] via-[#263DFF] to-[#8024FF] shadow-[0_4px_12px_rgba(38,61,255,0.3)]">
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-white"
                                >
                                    <path d="M12 3L2 21h20L12 3z" />
                                </svg>
                            </div>
                            <span className="font-sans text-[22px] font-extrabold tracking-tight text-white antialiased">
                                Defi<span className="font-medium tracking-wide bg-gradient-to-r from-[#00A3FF] via-[#00D1FF] to-[#00F0FF] bg-clip-text text-transparent ml-[1px]">Sphere</span>
                            </span>
                        </Link>

                        <div className="mb-8">
                            <h2 className="font-display text-3xl font-bold tracking-tight">Create account</h2>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Already have one?{" "}
                                <Link to="/login" className="font-medium text-[color:var(--neon-cyan)] hover:underline">
                                    Sign in
                                </Link>
                            </p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            {/* Server Alert Blocks inside UI layout */}
                            {serverError && (
                                <div role="alert" className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive-foreground animate-in fade-in duration-200">
                                    {serverError}
                                </div>
                            )}
                            {successMsg && (
                                <div role="status" className="rounded-lg border border-[color:var(--neon-cyan)]/40 bg-[color:var(--neon-cyan)]/10 px-3 py-2 text-sm text-foreground animate-in fade-in duration-200">
                                    {successMsg}
                                </div>
                            )}

                            {/* 1. Full Name Input */}
                            <div className="space-y-2">
                                <label htmlFor="fullName" className="text-sm font-medium text-foreground/90">Full Name</label>
                                <div className="relative">
                                    <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="fullName"
                                        type="text"
                                        placeholder="Alok Kumar"
                                        aria-invalid={!!errors.fullName}
                                        className="h-11 border-white/10 bg-white/5 pl-9 text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-[color:var(--neon-cyan)]"
                                        {...register("fullName")}
                                    />
                                </div>
                                {errors.fullName && <p className="text-xs text-destructive mt-1">{errors.fullName.message}</p>}
                            </div>

                            {/* 2. Email Input */}
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium text-foreground/90">Email</label>
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
                                {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
                            </div>

                            {/* 3. Password Input */}
                            <div className="space-y-2">
                                <label htmlFor="password" className="text-sm font-medium text-foreground/90">Password</label>
                                <div className="relative">
                                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type={showPw ? "text" : "password"}
                                        autoComplete="new-password"
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
                                {errors.password && <p className="text-xs text-destructive mt-1">{errors.password.message}</p>}
                            </div>

                            {/* 4. Confirm Password Input */}
                            <div className="space-y-2">
                                <label htmlFor="confirm" className="text-sm font-medium text-foreground/90">Confirm password</label>
                                <div className="relative">
                                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="confirm"
                                        type={showPw ? "text" : "password"}
                                        autoComplete="new-password"
                                        placeholder="••••••••"
                                        aria-invalid={!!errors.confirm}
                                        className="h-11 border-white/10 bg-white/5 pl-9 pr-10 text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-[color:var(--neon-cyan)]"
                                        {...register("confirm")}
                                    />
                                </div>
                                {errors.confirm && <p className="text-xs text-destructive mt-1">{errors.confirm.message}</p>}
                            </div>

                            {/* Action Submit Button */}
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="relative h-11 w-full overflow-hidden rounded-lg border border-white/10 text-base font-semibold text-primary-foreground transition-shadow hover:shadow-[var(--shadow-glow-cyan)] flex items-center justify-center"
                                style={{ background: "var(--gradient-primary)" }}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                        Creating account…
                                    </>
                                ) : (
                                    "Create account"
                                )}
                            </Button>

                            <p className="text-center text-xs text-muted-foreground pt-1">
                                By creating an account you agree to our{" "}
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