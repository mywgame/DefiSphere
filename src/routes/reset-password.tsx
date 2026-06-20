import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabaseClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
    password: z.string().min(8, "Password must be at least 8 characters"),
});

export const Route = createFileRoute("/reset-password")({
    component: ResetPasswordPage,
});

function ResetPasswordPage() {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { isSubmitting } } = useForm({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: { password: string }) => {
        const { error } = await supabase.auth.updateUser({
            password: data.password,
        });

        if (error) {
            toast.error(error.message);
        } else {
            toast.success("Password updated successfully!");
            navigate({ to: "/login" });
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm space-y-4">
                <h2 className="text-2xl font-bold">Set new password</h2>
                <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input type="password" placeholder="New password" {...register("password")} className="pl-9" />
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? <Loader2 className="animate-spin" /> : "Update Password"}
                </Button>
            </form>
        </div>
    );
}