"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/src/services/auth.service";
import { useAuthStore } from "@/src/store/auth.store";
import { ROUTES } from "@/src/constants/routes";

const signInSchema = z.object({
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

const signUpSchema = z.object({
    fullName: z.string().min(2, "Full name is required"),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

const forgotPasswordSchema = z.object({
    email: z.string().email("Please enter a valid email"),
});

const resetPasswordSchema = z.object({
    password: z.string().min(8, "Password must be at least 8 characters"),
});

type SignInValues = z.infer<typeof signInSchema>;
type SignUpValues = z.infer<typeof signUpSchema>;
type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

interface AuthFormProps {
    mode: "sign-in" | "sign-up" | "forgot-password" | "reset-password";
}

type AuthFormValues = SignInValues | SignUpValues | ForgotPasswordValues | ResetPasswordValues;

export function AuthForm({ mode }: AuthFormProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const setAuth = useAuthStore((state) => state.setAuth);

    const form = useForm<AuthFormValues>({
        resolver: zodResolver(mode === "sign-in" ? signInSchema : mode === "sign-up" ? signUpSchema : mode === "forgot-password" ? forgotPasswordSchema : resetPasswordSchema),
    });

    const errors = form.formState.errors;

    const onSubmit = async (values: AuthFormValues) => {
        setIsSubmitting(true);
        setMessage(null);

        try {
            if (mode === "sign-in") {
                const input = values as SignInValues;
                const result = await authService.signIn(input);
                setAuth(result.user, result.session);
                router.push(searchParams.get("redirectTo") ?? ROUTES.dashboard);
            } else if (mode === "sign-up") {
                const input = values as SignUpValues;
                const result = await authService.signUp(input);
                setAuth(result.user, result.session);
                router.push(ROUTES.dashboard);
            } else if (mode === "forgot-password") {
                const input = values as ForgotPasswordValues;
                await authService.forgotPassword(input);
                setMessage("A recovery email has been sent. Please check your inbox.");
            } else {
                const input = values as ResetPasswordValues;
                await authService.resetPassword({ password: input.password });
                setMessage("Your password has been updated successfully.");
                router.push(ROUTES.auth.signIn);
            }
        } catch (error) {
            setMessage(error instanceof Error ? error.message : "An unexpected error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            {message ? <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{message}</div> : null}

            {mode === "sign-up" ? (
                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Full name</label>
                    <input {...form.register("fullName")} className="w-full rounded-2xl border border-slate-300 px-4 py-3" />
                    {"fullName" in errors && errors.fullName ? <p className="mt-2 text-sm text-red-600">{String(errors.fullName.message)}</p> : null}
                </div>
            ) : null}

            <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Email</label>
                <input type="email" {...form.register("email")} className="w-full rounded-2xl border border-slate-300 px-4 py-3" />
                {"email" in errors && errors.email ? <p className="mt-2 text-sm text-red-600">{String(errors.email.message)}</p> : null}
            </div>

            {mode !== "forgot-password" ? (
                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Password</label>
                    <input type="password" {...form.register("password")} className="w-full rounded-2xl border border-slate-300 px-4 py-3" />
                    {"password" in errors && errors.password ? <p className="mt-2 text-sm text-red-600">{String(errors.password.message)}</p> : null}
                </div>
            ) : null}

            <button type="submit" disabled={isSubmitting} className="w-full rounded-2xl bg-slate-950 px-4 py-3 font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-950">
                {isSubmitting ? "Please wait..." : mode === "sign-in" ? "Sign in" : mode === "sign-up" ? "Create account" : mode === "forgot-password" ? "Send recovery email" : "Update password"}
            </button>
        </form>
    );
}
