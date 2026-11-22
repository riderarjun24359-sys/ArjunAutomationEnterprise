import type { Metadata } from "next";
import { MessageCircle, Phone } from "lucide-react";
import { buildMetadata } from "@/src/lib/seo";
import { COMPANY_PROFILE, HAS_PHONE, whatsappLink } from "@/src/config/company-profile";
import { LocalContactForm } from "@/src/modules/company-launch-kit/components/LocalContactForm";

export const metadata: Metadata = buildMetadata({
    title: "Contact",
    description: "Contact Arjun Automation Enterprises about school management software, WhatsApp automation or a business website.",
    path: "/contact",
});

const whatsapp = whatsappLink("Hi, I saw your website. I want to know more about your services.");

export default function ContactPage() {
    return (
        <div className="premium-container grid gap-12 py-16 sm:py-20 lg:grid-cols-[.9fr_1.1fr]">
            <section>
                <p className="text-sm font-semibold text-indigo-700">Contact</p>
                <h1 className="mt-3 text-4xl font-bold tracking-tight text-[var(--premium-fg)] sm:text-5xl">Tell us what you need help with.</h1>
                <p className="mt-5 text-lg leading-8 text-[var(--premium-fg-muted)]">Tell us what takes time in your school or business. We will understand your needs and show you a suitable demo.</p>
                <div className="mt-8 space-y-4">
                    {HAS_PHONE ? <a href={`tel:${COMPANY_PROFILE.phoneE164}`} className="flex min-h-12 items-center gap-3 rounded-xl border border-[var(--premium-border)] p-4 font-semibold text-[var(--premium-fg)]"><Phone className="h-5 w-5 text-indigo-700" />Call {COMPANY_PROFILE.phoneDisplay}</a> : null}
                    {whatsapp ? <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="flex min-h-12 items-center gap-3 rounded-xl bg-[#25D366] p-4 font-semibold text-[#073b1e]"><MessageCircle className="h-5 w-5" />Chat on WhatsApp</a> : null}
                </div>
                <p className="mt-8 text-base leading-7 text-[var(--premium-fg-muted)]">Serving Giddalur, Markapuram, Cumbum and nearby towns. Schools in Hyderabad can work with us online.</p>
                <p className="mt-4 text-sm text-[var(--premium-fg-muted)]">We reply within 24 hours on working days.</p>
            </section>
            <section className="rounded-3xl border border-[var(--premium-border)] bg-white p-6 shadow-sm sm:p-8" aria-labelledby="contact-form-heading">
                <h2 id="contact-form-heading" className="text-2xl font-bold text-[var(--premium-fg)]">Send an enquiry</h2>
                <p className="mt-2 text-sm leading-6 text-[var(--premium-fg-muted)]">Fill in these details. WhatsApp will open with your message ready to send.</p>
                {COMPANY_PROFILE.whatsappNumber ? <div className="mt-7"><LocalContactForm whatsappNumber={COMPANY_PROFILE.whatsappNumber} /></div> : <p className="mt-6 text-sm text-[var(--premium-fg-muted)]">Please call us to discuss your requirement.</p>}
            </section>
        </div>
    );
}
