import Link from "next/link";
import { ROUTES } from "@/src/constants/routes";
import { AuthForm } from "@/src/modules/auth/components/AuthForm";

interface AuthShellProps {
    mode: "sign-in" | "sign-up" | "forgot-password" | "reset-password";
    title: string;
    description: string;
}

export function AuthShell({ mode, title, description }: AuthShellProps) {
    return (
        <main className="min-h-screen bg-slate-950 px-6 py-16 text-slate-50">
            <div className="mx-auto flex max-w-6xl flex-col gap-12 lg:flex-row lg:items-center">
                <section className="max-w-xl space-y-6">
                    <div className="inline-flex rounded-full border border-white/10 bg-white/10 px-3 py-1 text-sm text-slate-200">
                        Enterprise authentication
                    </div>
                    <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
                    <p className="text-lg text-slate-300">{description}</p>
                    <div className="rounded-3xl border border-white/10 bg-white/10 p-6 text-sm text-slate-200 backdrop-blur">
                        <p className="font-medium">Security controls included</p>
                        <ul className="mt-3 space-y-2 text-slate-300">
                            <li>• Supabase-backed session handling</li>
                            <li>• Route guards and RBAC enforcement</li>
                            <li>• Protected access for privileged workspaces</li>
                        </ul>
                    </div>
                </section>

                <section className="w-full max-w-lg">
                    <AuthForm mode={mode} />
                    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-300">
                        {mode === "sign-in" ? (
                            <>
                                <Link href={ROUTES.auth.signUp} className="font-medium text-white hover:underline">Create an account</Link>
                                <Link href={ROUTES.auth.forgotPassword} className="hover:underline">Forgot password?</Link>
                            </>
                        ) : null}
                        {mode === "sign-up" ? <Link href={ROUTES.auth.signIn} className="font-medium text-white hover:underline">Back to sign in</Link> : null}
                        {mode === "forgot-password" ? <Link href={ROUTES.auth.signIn} className="font-medium text-white hover:underline">Back to sign in</Link> : null}
                        {mode === "reset-password" ? <Link href={ROUTES.auth.signIn} className="font-medium text-white hover:underline">Go to sign in</Link> : null}
                    </div>
                </section>
            </div>
        </main>
    );
}
