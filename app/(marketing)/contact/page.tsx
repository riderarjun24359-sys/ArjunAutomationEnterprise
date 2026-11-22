import type { Metadata } from "next";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { buildMetadata } from "@/src/lib/seo";
import { COMPANY_PROFILE, whatsappLink } from "@/src/config/company-profile";
import { LocalContactForm } from "@/src/modules/company-launch-kit/components/LocalContactForm";

export const metadata: Metadata = buildMetadata({
    title: "Contact",
    description: "Contact Arjun Automation Enterprises about custom software, school management software or AI automation.",
    path: "/contact",
});

const whatsapp = whatsappLink("Hi, I would like to discuss a software or automation project.");

export default function ContactPage() {
    return (
        <div className="premium-container grid gap-12 py-16 sm:py-20 lg:grid-cols-[.9fr_1.1fr]">
            <section>
                <p className="text-sm font-semibold text-[var(--primary)]">Contact</p>
                <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">Tell us what you need help with.</h1>
                <p className="mt-5 text-lg leading-8">Tell us what takes time in your school or business. We will understand your needs and suggest where to start.</p>
                <div className="mt-8 flex flex-col gap-4">
                    {whatsapp ? <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="flex min-h-12 items-center gap-3 rounded-xl bg-[var(--wa)] p-4 font-semibold text-white"><MessageCircle className="h-5 w-5"/>WhatsApp · +91 73370 27357</a> : null}
                    <a href="tel:+917337027357" className="flex min-h-12 items-center gap-3 rounded-xl border border-[var(--border-strong)] p-4 font-semibold text-[var(--ink)]"><Phone className="h-5 w-5 text-[var(--primary)]"/>Call · +91 73370 27357</a>
                    <a href="mailto:sales@arjunautomations.com" className="flex min-h-12 items-center gap-3 rounded-xl border border-[var(--border-strong)] p-4 font-semibold text-[var(--ink)]"><Mail className="h-5 w-5 text-[var(--primary)]"/>sales@arjunautomations.com</a>
                </div>
                <p className="mt-8 text-base leading-7">Serving Andhra Pradesh and Telangana.</p>
                <p className="mt-3 text-sm text-[var(--muted)]">We speak Telugu and English.</p>
            </section>
            <section className="rounded-3xl border border-[var(--border)] bg-white p-6 sm:p-8" aria-labelledby="contact-form-heading">
                <h2 id="contact-form-heading" className="text-2xl font-bold">Send an enquiry</h2>
                <p className="mt-2 text-sm leading-6 text-[var(--body)]">Share a few details. Your enquiry will be sent to our sales email.</p>
                <div className="mt-7"><LocalContactForm whatsappNumber={COMPANY_PROFILE.whatsappNumber}/></div>
            </section>
        </div>
    );
}
