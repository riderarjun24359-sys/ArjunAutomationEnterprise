"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { isSupabaseConfigured } from "@/src/lib/supabase-config";
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

const getAuthErrorMessage = (error: unknown): string => {
    if (!(error instanceof Error)) {
        return "An unexpected error occurred.";
    }

    const message = error.message.toLowerCase();

    if (message.includes("rate limit") || message.includes("over_email_send_rate_limit")) {
        return "Too many email requests. Please wait a minute before trying again.";
    }

    if (message.includes("email not confirmed")) {
        return "Please confirm your email address before signing in. Check your inbox for the confirmation link.";
    }

    return error.message;
};

const getQueryErrorMessage = (error: string | null): string | null => {
    if (error === "supabase_not_configured") {
        return "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.";
    }

    if (error === "auth_callback_failed") {
        return "Authentication callback failed. Please sign in again.";
    }

    return null;
};

export function AuthForm({ mode }: AuthFormProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [message, setMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const setAuth = useAuthStore((state) => state.setAuth);
    const supabaseReady = isSupabaseConfigured();
    const queryErrorMessage = useMemo(() => getQueryErrorMessage(searchParams.get("error")), [searchParams]);
    const displayedError = errorMessage ?? queryErrorMessage;

    const form = useForm<AuthFormValues>({
        resolver: zodResolver(mode === "sign-in" ? signInSchema : mode === "sign-up" ? signUpSchema : mode === "forgot-password" ? forgotPasswordSchema : resetPasswordSchema),
    });

    const { isSubmitting, errors } = form.formState;

    const onSubmit = useCallback(
        async (values: AuthFormValues) => {
            setMessage(null);
            setErrorMessage(null);

            try {
                if (mode === "sign-in") {
                    const input = values as SignInValues;
                    const result = await authService.signIn(input);
                    if (!result.user || !result.session) {
                        throw new Error("Sign in failed. Please check your credentials.");
                    }
                    setAuth(result.user, result.session);
                    router.push(searchParams.get("redirectTo") ?? ROUTES.dashboard);
                    router.refresh();
                } else if (mode === "sign-up") {
                    const input = values as SignUpValues;
                    const result = await authService.signUp(input);

                    if (result.requiresEmailConfirmation) {
                        setMessage("Account created. Check your email to confirm your address, then sign in.");
                        return;
                    }

                    if (result.user && result.session) {
                        setAuth(result.user, result.session);
                        router.push(ROUTES.dashboard);
                        router.refresh();
                        return;
                    }

                    setMessage("Account created successfully. You can now sign in.");
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
                setErrorMessage(getAuthErrorMessage(error));
            }
        },
        [mode, router, searchParams, setAuth],
    );

    const inputClasses = "w-full rounded-[var(--dos-radius-lg)] border border-[var(--dos-border)] bg-[var(--dos-surface-tertiary)] px-4 py-3 text-[var(--dos-text-primary)] focus:border-[var(--dos-border-focus)] focus:ring-1 focus:ring-[var(--dos-border-focus)] outline-none transition";
    const labelClasses = "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--dos-text-secondary)]";

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {!supabaseReady ? (
                <div className="rounded-2xl border border-[var(--dos-warning)] bg-[var(--dos-warning)]/10 p-4 text-sm text-[var(--dos-warning)]">
                    Supabase environment variables are missing.
                </div>
            ) : null}

            {message ? <div className="rounded-2xl border border-[var(--dos-success)] bg-[var(--dos-success)]/10 p-4 text-sm text-[var(--dos-success)]">{message}</div> : null}
            {displayedError ? <div className="rounded-2xl border border-[var(--dos-error)] bg-[var(--dos-error)]/10 p-4 text-sm text-[var(--dos-error)]">{displayedError}</div> : null}

            {mode === "sign-up" ? (
                <div>
                    <label className={labelClasses}>Full name</label>
                    <input {...form.register("fullName")} className={inputClasses} placeholder="Enter your full name" />
                    {"fullName" in errors && errors.fullName ? <p className="mt-1.5 text-xs text-[var(--dos-error)]">{String(errors.fullName.message)}</p> : null}
                </div>
            ) : null}

            <div>
                <label className={labelClasses}>Email</label>
                <input type="email" {...form.register("email")} className={inputClasses} placeholder="name@company.com" />
                {"email" in errors && errors.email ? <p className="mt-1.5 text-xs text-[var(--dos-error)]">{String(errors.email.message)}</p> : null}
            </div>

            {mode !== "forgot-password" ? (
                <div>
                    <label className={labelClasses}>Password</label>
                    <input type="password" {...form.register("password")} className={inputClasses} placeholder="••••••••" />
                    {"password" in errors && errors.password ? <p className="mt-1.5 text-xs text-[var(--dos-error)]">{String(errors.password.message)}</p> : null}
                </div>
            ) : null}

            <button
                type="submit"
                disabled={isSubmitting || !supabaseReady}
                aria-busy={isSubmitting}
                className="w-full rounded-[var(--dos-radius-lg)] bg-[var(--dos-text-primary)] px-4 py-3 font-semibold text-[var(--dos-surface)] transition hover:bg-[var(--dos-brand-primary)] disabled:cursor-not-allowed disabled:opacity-60"
            >
                {isSubmitting ? "Please wait..." : mode === "sign-in" ? "Sign in" : mode === "sign-up" ? "Create account" : mode === "forgot-password" ? "Send recovery email" : "Update password"}
            </button>
        </form>
    );
}
