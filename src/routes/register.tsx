import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, Lock, Mail, Smartphone, User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Supabase aur Notifications
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

// 🔥 Schema Validation with Name and Mobile Number
const schema = z.object({
    fullName: z.string().trim().min(2, "Full Name must be at least 2 characters").max(100),
    email: z.string().trim().min(1, "Email is required").email("Enter a valid email").max(255),
    mobileNumber: z.string().trim().min(10, "Enter a valid 10-digit mobile number").max(15),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(128, "Password too long"),
});

type FormValues = z.infer<typeof schema>;

export const Route = createFileRoute("/register")({
    component: SignupComponent,
});

function SignupComponent() {
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            fullName: "",
            email: "",
            mobileNumber: "",
            password: "",
        },
    });

    // 🔥 Professional Supabase Signup Handler with Metadata
    const onSubmit = async (data: FormValues) => {
        setIsSubmitting(true);
        try {
            const { data: authData, error } = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
                options: {
                    // 🌟 Storing User Details securely inside Supabase Auth Metadata
                    data: {
                        full_name: data.fullName,
                        mobile_number: data.mobileNumber,
                    },
                },
            });

            if (error) throw error;

            toast.success("Account created successfully! Please check your email for verification.");
            navigate({ to: "/login" });
        } catch (error: any) {
            console.error("Signup failed:", error);
            toast.error(error.message || "Failed to create account");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center bg-[#050816] px-4 py-12 text-foreground overflow-x-hidden">
            <div className="pointer-events-none fixed inset-0 -z-10 bg-grid opacity-20" />

            <div className="w-full max-w-md space-y-6 z-10">
                {/* Logo Section - Matching exactly with Sidebar style */}
                <div className="flex flex-col items-center justify-center gap-3 text-center">
                    <Link to="/" className="flex items-center gap-2.5 group">
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
                            DeFi<span className="font-medium tracking-wide bg-gradient-to-r from-[#00A3FF] via-[#00D1FF] to-[#00F0FF] bg-clip-text text-transparent ml-[1px]">Sphere</span>
                        </span>
                    </Link>
                    <p className="text-sm text-muted-foreground mt-1">Create your secure Web3 account</p>
                </div>

                {/* Form Container */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="rounded-3xl border border-white/5 bg-[#070914]/80 p-6 shadow-2xl backdrop-blur-xl sm:p-8"
                >
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                        {/* 1. Full Name Input */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/90">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
                                <Input
                                    type="text"
                                    placeholder="John Doe"
                                    className={`pl-10 h-11 rounded-xl bg-white/[0.02] border-white/5 focus:border-[#2F53FF] focus:bg-white/[0.04] text-sm text-foreground transition-all ${errors.fullName ? "border-destructive/50" : ""}`}
                                    {...register("fullName")}
                                />
                            </div>
                            {errors.fullName && <p className="text-xs font-medium text-destructive">{errors.fullName.message}</p>}
                        </div>

                        {/* 2. Email Input */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/90">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
                                <Input
                                    type="email"
                                    placeholder="name@domain.com"
                                    className={`pl-10 h-11 rounded-xl bg-white/[0.02] border-white/5 focus:border-[#2F53FF] focus:bg-white/[0.04] text-sm text-foreground transition-all ${errors.email ? "border-destructive/50" : ""}`}
                                    {...register("email")}
                                />
                            </div>
                            {errors.email && <p className="text-xs font-medium text-destructive">{errors.email.message}</p>}
                        </div>

                        {/* 3. Mobile Number Input */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/90">Mobile Number</label>
                            <div className="relative">
                                <Smartphone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
                                <Input
                                    type="tel"
                                    placeholder="9876543210"
                                    className={`pl-10 h-11 rounded-xl bg-white/[0.02] border-white/5 focus:border-[#2F53FF] focus:bg-white/[0.04] text-sm text-foreground transition-all ${errors.mobileNumber ? "border-destructive/50" : ""}`}
                                    {...register("mobileNumber")}
                                />
                            </div>
                            {errors.mobileNumber && <p className="text-xs font-medium text-destructive">{errors.mobileNumber.message}</p>}
                        </div>

                        {/* 4. Password Input */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/90">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className={`pl-10 pr-10 h-11 rounded-xl bg-white/[0.02] border-white/5 focus:border-[#2F53FF] focus:bg-white/[0.04] text-sm text-foreground transition-all ${errors.password ? "border-destructive/50" : ""}`}
                                    {...register("password")}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground/60 hover:bg-white/5"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {errors.password && <p className="text-xs font-medium text-destructive">{errors.password.message}</p>}
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="mt-2 h-11 w-full rounded-xl font-semibold text-white shadow-[0_4px_15px_rgba(38,61,255,0.35)] transition-all duration-300 hover:scale-[1.01]"
                            style={{ background: "var(--gradient-primary)" }}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating Account…
                                </>
                            ) : (
                                "Sign up"
                            )}
                        </Button>

                        <p className="text-center text-xs text-muted-foreground pt-2">
                            Already have an account?{" "}
                            <Link to="/login" className="font-semibold text-foreground underline hover:text-[#00A3FF]">
                                Sign in
                            </Link>
                        </p>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}