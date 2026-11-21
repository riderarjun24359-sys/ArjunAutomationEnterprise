"use client";

import { useState } from "react";
import { MessageCircle, Send } from "lucide-react";

type Props = { whatsappNumber: string };

export function LocalContactForm({ whatsappNumber }: Props) {
    const [status, setStatus] = useState<"idle" | "sending" | "success" | "partial" | "error">("idle");
    const [message, setMessage] = useState("");

    async function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setStatus("sending");
        setMessage("");
        const form = event.currentTarget;
        const data = new FormData(form);
        const name = String(data.get("name") ?? "").trim();
        const phone = String(data.get("phone") ?? "").trim();
        const businessType = String(data.get("businessType") ?? "");
        const enquiry = String(data.get("message") ?? "").trim();
        const honeypot = String(data.get("website") ?? "");

        if (!/^[6-9][0-9]{9}$/.test(phone)) {
            setStatus("error");
            setMessage("Enter a valid 10-digit Indian mobile number.");
            return;
        }
        if (honeypot) {
            setStatus("success");
            setMessage("Thank you. Your enquiry has been received.");
            form.reset();
            return;
        }

        const whatsappText = [
            "Hi, I saw your website. I would like to know more about your services.",
            "",
            `Name: ${name}`,
            `Phone: ${phone}`,
            `Business type: ${businessType}`,
            `Message: ${enquiry}`,
        ].join("\n");
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}`;
        window.open(whatsappUrl, "_blank", "noopener,noreferrer");

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, phone, businessType, message: enquiry, website: honeypot }),
            });
            const result = (await response.json()) as { success?: boolean; emailSent?: boolean };
            if (!response.ok || !result.success) {
                setStatus("partial");
                setMessage("WhatsApp opened with your details ready. Please press Send in WhatsApp. We could not send the email copy.");
                return;
            }
            if (result.emailSent) {
                setStatus("success");
                setMessage("WhatsApp opened with your details ready. Please press Send in WhatsApp. An email copy was also sent.");
            } else {
                setStatus("partial");
                setMessage("WhatsApp opened with your details ready. Please press Send in WhatsApp. Email delivery is not configured yet.");
            }
            form.reset();
        } catch {
            setStatus("partial");
            setMessage("WhatsApp opened with your details ready. Please press Send in WhatsApp. Email delivery could not be confirmed.");
        }
    }

    const fieldClass = "mt-2 min-h-12 w-full rounded-xl border border-[var(--premium-border)] bg-white px-4 py-3 text-base text-slate-900 outline-none focus-visible:ring-2 focus-visible:ring-indigo-600";
    return (
        <form onSubmit={submit} className="space-y-5" aria-label="Contact form">
            <div>
                <label htmlFor="contact-name" className="block text-sm font-semibold text-[var(--premium-fg)]">Your name</label>
                <input id="contact-name" name="name" autoComplete="name" required maxLength={120} className={fieldClass} />
            </div>
            <div>
                <label htmlFor="contact-phone" className="block text-sm font-semibold text-[var(--premium-fg)]">Phone number</label>
                <input id="contact-phone" name="phone" type="tel" inputMode="numeric" autoComplete="tel-national" required minLength={10} maxLength={10} pattern="[6-9][0-9]{9}" title="Enter a 10-digit Indian mobile number" className={fieldClass} placeholder="10-digit mobile number" />
            </div>
            <div>
                <label htmlFor="contact-business" className="block text-sm font-semibold text-[var(--premium-fg)]">Business type</label>
                <select id="contact-business" name="businessType" required defaultValue="" className={fieldClass}>
                    <option value="" disabled>Select your business type</option>
                    <option>School</option>
                    <option>College</option>
                    <option>Shop or Supermarket</option>
                    <option>Clinic</option>
                    <option>Other</option>
                </select>
            </div>
            <div>
                <label htmlFor="contact-message" className="block text-sm font-semibold text-[var(--premium-fg)]">Message</label>
                <textarea id="contact-message" name="message" required rows={4} maxLength={2000} className={fieldClass} placeholder="Tell us what you need help with." />
            </div>
            <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
                <label htmlFor="contact-website">Leave this field empty</label>
                <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
            </div>
            <button type="submit" disabled={status === "sending"} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-indigo-700 px-6 py-3 font-semibold text-white hover:bg-indigo-800 disabled:cursor-wait disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2">
                {status === "sending" ? "Preparing your message..." : <><MessageCircle className="h-5 w-5" />Send enquiry on WhatsApp</>}
            </button>
            {message ? <p role={status === "error" ? "alert" : "status"} className="text-sm leading-6 text-[var(--premium-fg-muted)]">{message}</p> : null}
        </form>
    );
}
