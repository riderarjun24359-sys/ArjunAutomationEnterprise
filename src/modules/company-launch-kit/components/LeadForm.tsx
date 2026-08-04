"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MARKETING_ROUTES } from "@/src/modules/company-launch-kit/config/routes";

export interface LeadFormProps {
    source: string;
    submitLabel?: string;
    compact?: boolean;
}

export function LeadForm({ source, submitLabel = "Get in Touch", compact = false }: LeadFormProps) {
    const router = useRouter();
    const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setStatus("loading");
        setErrorMessage("");

        const form = e.currentTarget;
        const formData = new FormData(form);
        const payload = {
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            company: formData.get("company") as string,
            phone: formData.get("phone") as string,
            message: formData.get("message") as string,
            source,
        };

        try {
            const res = await fetch("/api/launch-kit/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = (await res.json()) as { success?: boolean; error?: string };
            if (!res.ok || !data.success) {
                setStatus("error");
                setErrorMessage(data.error ?? "Something went wrong. Please try again.");
                return;
            }
            router.push(MARKETING_ROUTES.thankYou);
        } catch {
            setStatus("error");
            setErrorMessage("Network error. Please try again.");
        }
    }

    const inputClass =
        "w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-700/20";

    return (
        <form onSubmit={handleSubmit} className={compact ? "space-y-3" : "space-y-4"} aria-label="Contact form">
            <div className={compact ? "grid gap-3 sm:grid-cols-2" : "grid gap-4 sm:grid-cols-2"}>
                <div>
                    <label htmlFor={`name-${source}`} className="mb-1 block text-sm font-medium text-slate-700">
                        Full Name <span aria-hidden="true">*</span>
                    </label>
                    <input
                        id={`name-${source}`}
                        name="name"
                        type="text"
                        required
                        autoComplete="name"
                        className={inputClass}
                        aria-required="true"
                    />
                </div>
                <div>
                    <label htmlFor={`email-${source}`} className="mb-1 block text-sm font-medium text-slate-700">
                        Work Email <span aria-hidden="true">*</span>
                    </label>
                    <input
                        id={`email-${source}`}
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        className={inputClass}
                        aria-required="true"
                    />
                </div>
            </div>
            <div className={compact ? "grid gap-3 sm:grid-cols-2" : "grid gap-4 sm:grid-cols-2"}>
                <div>
                    <label htmlFor={`company-${source}`} className="mb-1 block text-sm font-medium text-slate-700">
                        Company
                    </label>
                    <input id={`company-${source}`} name="company" type="text" autoComplete="organization" className={inputClass} />
                </div>
                <div>
                    <label htmlFor={`phone-${source}`} className="mb-1 block text-sm font-medium text-slate-700">
                        Phone
                    </label>
                    <input id={`phone-${source}`} name="phone" type="tel" autoComplete="tel" className={inputClass} />
                </div>
            </div>
            {!compact ? (
                <div>
                    <label htmlFor={`message-${source}`} className="mb-1 block text-sm font-medium text-slate-700">
                        How can we help?
                    </label>
                    <textarea
                        id={`message-${source}`}
                        name="message"
                        rows={4}
                        className={inputClass}
                        placeholder="Tell us about your automation goals..."
                    />
                </div>
            ) : null}
            {errorMessage ? (
                <p role="alert" className="text-sm text-red-600">
                    {errorMessage}
                </p>
            ) : null}
            <button
                type="submit"
                disabled={status === "loading"}
                className="w-full rounded-lg bg-indigo-700 px-6 py-3 font-medium text-white transition hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-700/20 disabled:opacity-60 sm:w-auto"
            >
                {status === "loading" ? "Sending..." : submitLabel}
            </button>
        </form>
    );
}
