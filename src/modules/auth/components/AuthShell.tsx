import Link from "next/link";
import { Suspense } from "react";
import { ROUTES } from "@/src/constants/routes";
import { AuthForm } from "@/src/modules/auth/components/AuthForm";
import { LoadingState } from "@/src/components/ui/LoadingState";
import { AuthLayout } from "./AuthLayout";

interface AuthShellProps {
    mode: "sign-in" | "sign-up" | "forgot-password" | "reset-password";
    title: string;
    description: string;
}

export function AuthShell({ mode, title, description }: AuthShellProps) {
    return (
        <AuthLayout>
            <div className="w-full max-w-md">
                <section className="mb-10 text-center">
                    <div className="mb-4 inline-flex items-center rounded-full border border-[var(--dos-border)] bg-[var(--dos-surface-elevated)] px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[var(--dos-text-secondary)]">
                        Arjun Automation OS
                    </div>
                    <h1 className="dos-text-h1 mb-3">{title}</h1>
                    <p className="dos-text-body text-[var(--dos-text-secondary)]">{description}</p>
                </section>

                <section className="os-panel p-8">
                    <Suspense fallback={<LoadingState label="Loading authentication form" />}>
                        <AuthForm mode={mode} />
                    </Suspense>
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-[var(--dos-text-secondary)]">
                        {mode === "sign-in" ? (
                            <>
                                <Link href={ROUTES.auth.signUp} className="font-medium text-[var(--dos-text-primary)] hover:text-[var(--dos-brand-primary)]">Create account</Link>
                                <Link href={ROUTES.auth.forgotPassword} className="hover:text-[var(--dos-brand-primary)]">Forgot password?</Link>
                            </>
                        ) : null}
                        {mode === "sign-up" ? (
                            <>
                                <Link href={ROUTES.auth.signIn} className="font-medium text-[var(--dos-text-primary)] hover:text-[var(--dos-brand-primary)]">Back to sign in</Link>
                            </>
                        ) : null}
                        {mode === "forgot-password" ? <Link href={ROUTES.auth.signIn} className="font-medium text-[var(--dos-text-primary)] hover:text-[var(--dos-brand-primary)]">Back to sign in</Link> : null}
                        {mode === "reset-password" ? <Link href={ROUTES.auth.signIn} className="font-medium text-[var(--dos-text-primary)] hover:text-[var(--dos-brand-primary)]">Go to sign in</Link> : null}
                    </div>
                </section>
            </div>
        </AuthLayout>
    );
}
