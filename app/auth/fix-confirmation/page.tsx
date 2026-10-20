"use client";

import Link from "next/link";
import { useState } from "react";
import { ROUTES } from "@/src/constants/routes";

/**
 * Rescue page — completes email confirmation for customers whose confirmation
 * email pointed at localhost (dashboard Site URL left on the dev default).
 *
 * Handles both Supabase flows:
 * - PKCE (`code` param): the browser redirects to our own /auth/callback with
 *   the code — the PKCE verifier the customer's browser stored during signup
 *   completes the session exchange client-side.
 * - Legacy (`token` / `token_hash`): the server route replays the verify call
 *   with the redirect forced to our domain.
 */

export default function FixConfirmationPage() {
    const [link, setLink] = useState("");
    const [status, setStatus] = useState<"idle" | "working" | "ok" | "error">("idle");
    const [message, setMessage] = useState<string | null>(null);

    const run = async () => {
        setStatus("working");
        setMessage(null);
        const raw = link.trim();
        if (!raw) {
            setStatus("error");
            setMessage("Full link paste chesi retry cheyandi.");
            return;
        }

        let parsed: URL | null = null;
        try { parsed = new URL(raw); } catch { /* handled below */ }

        const code = parsed?.searchParams.get("code");
        if (code) {
            // PKCE: hand the code to our own callback (verifier lives in this
            // browser from signup) — never the localhost URL from the email.
            window.location.href = `${ROUTES.auth.callback}?code=${encodeURIComponent(code)}`;
            return;
        }

        try {
            const res = await fetch("/api/auth/confirm-manual", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ link: raw }),
            });
            const body = (await res.json()) as { ok?: boolean; error?: string };
            if (res.ok && body.ok) {
                setStatus("ok");
                setMessage("Email confirmed ✅ — ippudu Sign in cheyandi. Link lo redirect localhost ki andi lekapothe ivala fix chesipoyindhi.");
                return;
            }
            setStatus("error");
            setMessage(body.error ?? "Confirm fail. Malli Resend link adagandi.");
        } catch {
            setStatus("error");
            setMessage("Network error. Malli try cheyandi.");
        }
    };

    return (
        <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6 py-16">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">Authentication · rescue</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-50">Email confirmation fix</h1>
            <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                Mi confirmation email lo link <code>localhost</code> ki velli &apos;site can&apos;t be reached&apos;
                anukunta? Means site ki velle URL local anukunta. Adi site true link ki sati-cheysI, email confirm lo mobile
                browser access thruwww — site nundi direct check cheyyali.
            </p>
            <textarea
                value={link}
                onChange={(e) => setLink(e.target.value)}
                rows={4}
                placeholder="http://localhost:3000/... or https://...supabase.co/auth/v1/verify?... — poorti link paste cheyandi"
                className="mt-6 w-full rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-900 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
            <button
                onClick={run}
                disabled={status === "working"}
                className="mt-4 w-full rounded-full bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-60"
                aria-busy={status === "working"}
            >
                {status === "working" ? "Confirm chestunnam..." : "Email confirm chey ✅"}
            </button>
            {message ? (
                <div className={"mt-6 rounded-2xl border p-4 text-sm " + (status === "ok" ? "border-green-300 bg-green-50 text-green-700" : "border-orange-300 bg-orange-50 text-orange-700")}>
                    {message}
                </div>
            ) : null}
            {status === "ok" ? (
                <Link href={ROUTES.auth.signIn} className="mt-4 rounded-full bg-slate-900 px-5 py-2.5 text-center text-sm font-semibold text-white">
                    Sign in chey →
                </Link>
            ) : null}
            <div className="mt-8 flex flex-wrap gap-3 text-sm">
                <Link href={ROUTES.auth.verifyEmail} className="underline text-slate-600 dark:text-slate-300">
                    Verify email page
                </Link>
                <Link href={ROUTES.auth.signIn} className="underline text-slate-600 dark:text-slate-300">
                    Sign in
                </Link>
            </div>
        </main>
    );
}
