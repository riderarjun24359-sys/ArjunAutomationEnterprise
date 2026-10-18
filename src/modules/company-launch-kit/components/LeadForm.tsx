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
            consent: formData.get("consent") === "on",
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
        "w-full rounded-lg border border-[var(--premium-border)] px-4 py-2.5 text-[var(--premium-fg)] placeholder:text-[var(--premium-fg-muted)] focus:border-[var(--dos-brand-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--dos-brand-primary)]/20";

    const labelClass = "mb-1 block text-sm font-medium text-[var(--premium-fg-muted)]";

    return (
        <form onSubmit={handleSubmit} className={compact ? "space-y-3" : "space-y-4"} aria-label="Contact form">
            <div className={compact ? "grid gap-3 sm:grid-cols-2" : "grid gap-4 sm:grid-cols-2"}>
                <div>
                    <label htmlFor={`name-${source}`} className={labelClass}>
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
                    <label htmlFor={`email-${source}`} className={labelClass}>
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
                    <label htmlFor={`company-${source}`} className={labelClass}>
                        Company
                    </label>
                    <input id={`company-${source}`} name="company" type="text" autoComplete="organization" className={inputClass} />
                </div>
                <div>
                    <label htmlFor={`phone-${source}`} className={labelClass}>
                        Phone
                    </label>
                    <input id={`phone-${source}`} name="phone" type="tel" autoComplete="tel" className={inputClass} />
                </div>
            </div>
            {!compact ? (
                <div>
                    <label htmlFor={`message-${source}`} className={labelClass}>
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
                <p role="alert" className="text-sm text-[var(--dos-error)]">
                    {errorMessage}
                </p>
            ) : null}
            <div className="flex items-start gap-2">
                <input
                    id={`consent-${source}`}
                    name="consent"
                    type="checkbox"
                    required
                    aria-required="true"
                    className="mt-1 h-4 w-4 rounded border-[var(--premium-border)]"
                />
                <label htmlFor={`consent-${source}`} className="text-sm text-[var(--premium-fg-muted)]">
                    <span className="text-[var(--dos-brand-primary)]">*</span> I agree to the storage and use of my
                    details for contact about my enquiry, as described in the{" "}
                    <a href={MARKETING_ROUTES.privacy} className="underline hover:text-[var(--dos-brand-primary)]">
                        privacy notice
                    </a>
                    .
                </label>
            </div>
            <button
                type="submit"
                disabled={status === "loading"}
                className="w-full rounded-lg bg-[var(--dos-brand-primary)] px-6 py-3 font-medium text-white transition hover:bg-[var(--dos-brand-primary-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--dos-brand-primary)]/20 disabled:opacity-60 sm:w-auto"
            >
                {status === "loading" ? "Sending..." : submitLabel}
            </button>
        </form>
    );
}