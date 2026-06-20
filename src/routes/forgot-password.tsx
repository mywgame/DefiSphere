import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Loader2, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// 🔥 Connected strictly to your actual live Supabase config path
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

const schema = z.object({
    email: z.string().trim().min(1, "Email is required").email("Enter a valid email").max(255),
});
type FormValues = z.infer<typeof schema>;

export const Route = createFileRoute("/forgot-password")({
    head: () => ({
        meta: [
            { title: "Forgot password — DefiSphere" },
            { name: "description", content: "Reset your DefiSphere account password." },
        ],
    }),
    component: ForgotPage,
});

function ForgotPage() {
    const [serverError, setServerError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { email: "" },
        mode: "onBlur",
    });

    const onSubmit = async ({ email }: FormValues) => {
        setServerError(null);
        setSuccessMsg(null);

        // Smooth dynamic environment redirect URL for password resets
        const redirectTo =
            typeof window !== "undefined" ? `${window.location.origin}/reset-password` : undefined;

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });

            if (error) {
                setServerError(error.message);
                toast.error(error.message);
                return;
            }

            const successText = "If an account exists for that email, a reset link has been sent.";
            setSuccessMsg(successText);
            toast.success("Reset link dispatched successfully!");

        } catch (e: any) {
            console.error("Forgot password system failure:", e);
            setServerError("An error occurred. Please try again later.");
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
            {/* Universal Premium Gradients from Lovable Core Theme */}
            <div
                className="pointer-events-none fixed inset-0 -z-10"
                style={{
                    background:
                        "radial-gradient(900px 500px at 80% 0%, rgba(120,90,255,0.28), transparent 60%), radial-gradient(800px 480px at 0% 80%, rgba(80,180,255,0.20), transparent 60%), #050816",
                }}
            />
            <div className="pointer-events-none fixed inset-0 -z-10 bg-grid opacity-40" />

            <div className="mx-auto flex min-h-screen max-w-2xl items-center justify-center px-4 py-10 md:py-16">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="w-full rounded-3xl glass-card p-7 md:p-10"
                >
                    {/* Brand Logo - Fixed to match Sidebar Delta Logo & Typography Exactly */}
                    <Link to="/" className="mb-8 inline-flex items-center gap-2.5 group">
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
                        <h2 className="font-display text-3xl font-bold tracking-tight">Forgot password</h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Enter your email and we'll send you a reset link.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {/* Status Feedback Blocks */}
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

                        {/* Email Field Layout */}
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

                        {/* Glowing Action Button */}
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="relative h-11 w-full overflow-hidden rounded-lg border border-white/10 text-base font-semibold text-primary-foreground transition-shadow hover:shadow-[var(--shadow-glow-cyan)] flex items-center justify-center"
                            style={{ background: "var(--gradient-primary)" }}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    Sending…
                                </>
                            ) : (
                                "Send reset link"
                            )}
                        </Button>

                        <p className="text-center text-xs text-muted-foreground pt-1">
                            Remembered it?{" "}
                            <Link to="/login" className="font-medium text-[color:var(--neon-cyan)] hover:underline">
                                Back to sign in
                            </Link>
                        </p>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}