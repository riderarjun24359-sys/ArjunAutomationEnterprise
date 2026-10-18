import type { Metadata } from "next";
import Link from "next/link";
import { ROUTES } from "@/src/constants/routes";
import { MARKETING_ROUTES } from "@/src/modules/company-launch-kit/config/routes";
import { buildMetadata } from "@/src/lib/seo";

export const metadata: Metadata = buildMetadata({
    title: "Verify your email",
    description: "Confirm your email address to finish soft-launch account setup.",
    path: ROUTES.auth.verifyEmail,
    noIndex: true,
});

export default function VerifyEmailPage() {
    return (
        <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-6 py-16">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">Authentication</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-50">Verify your email</h1>
            <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                We sent a verification link to your inbox. Open the message and confirm your address to activate soft-launch access. If you already clicked the link in email, continue to welcome.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
                <Link href={ROUTES.auth.welcome} className="rounded-full bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white">
                    Continue to welcome
                </Link>
                <Link href={ROUTES.auth.signIn} className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold">
                    Back to sign in
                </Link>
                <Link href={MARKETING_ROUTES.help} className="rounded-full px-5 py-2.5 text-sm font-semibold underline">
                    Help Center
                </Link>
            </div>
        </main>
    );
}
