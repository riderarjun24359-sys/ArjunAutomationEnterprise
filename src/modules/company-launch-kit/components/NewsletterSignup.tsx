"use client";

import { useState } from "react";

export function NewsletterSignup() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!email.includes("@")) {
            setStatus("error");
            return;
        }
        setStatus("success");
        setEmail("");
    }

    return (
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-6">
            <h3 className="text-lg font-semibold text-indigo-950">Stay ahead on enterprise automation</h3>
            <p className="mt-1 text-sm text-indigo-700">
                Monthly insights on AI workers, industry OS packs, and platform best practices.
            </p>
            {status === "success" ? (
                <p role="status" className="mt-4 text-sm font-medium text-indigo-700">
                    Thank you for subscribing. Check your inbox for confirmation.
                </p>
            ) : (
                <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row" aria-label="Newsletter signup">
                    <label htmlFor="newsletter-email" className="sr-only">
                        Email address
                    </label>
                    <input
                        id="newsletter-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@company.com"
                        required
                        className="flex-1 rounded-lg border border-indigo-200 px-4 py-2.5 text-slate-900 focus:border-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-700/20"
                    />
                    <button
                        type="submit"
                        className="rounded-lg bg-indigo-700 px-5 py-2.5 font-medium text-white hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-700/20"
                    >
                        Subscribe
                    </button>
                </form>
            )}
            {status === "error" ? (
                <p role="alert" className="mt-2 text-sm text-red-600">
                    Please enter a valid email address.
                </p>
            ) : null}
        </div>
    );
}
