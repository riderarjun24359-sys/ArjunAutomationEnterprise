import type { Metadata } from "next";
import Image from "next/image";
import { MessageCircle, Phone, CheckCircle2 } from "lucide-react";
import { buildMetadata } from "@/src/lib/seo";
import { COMPANY_PROFILE, HAS_PHONE, whatsappLink, WHATSAPP_DEFAULT_MESSAGE } from "@/src/config/company-profile";

export const metadata: Metadata = buildMetadata({
    title: "About",
    description: "Meet the founder of Arjun Automation Enterprises and learn how we work with schools and local businesses.",
    path: "/about",
});

const founderName = process.env.NEXT_PUBLIC_FOUNDER_NAME?.trim();
const founderPhoto = process.env.NEXT_PUBLIC_FOUNDER_PHOTO?.trim();
const whatsapp = whatsappLink(WHATSAPP_DEFAULT_MESSAGE);

export default function AboutPage() {
    return (
        <div className="premium-container py-16 sm:py-20">
            <header className="max-w-3xl">
                <p className="text-sm font-semibold text-indigo-700">About</p>
                <h1 className="mt-3 text-4xl font-bold tracking-tight text-[var(--premium-fg)] sm:text-5xl">A real person, doing the work with you.</h1>
                <p className="mt-5 text-lg leading-8 text-[var(--premium-fg-muted)]">Arjun Automation Enterprises builds school and college management software, WhatsApp automation for shops and clinics, and websites for local businesses.</p>
            </header>

            {founderName && founderPhoto ? (
                <section className="mt-12 grid gap-8 rounded-3xl bg-indigo-950 p-8 text-white sm:p-10 md:grid-cols-[240px_1fr] md:items-center">
                    <Image src={founderPhoto} alt={`Photo of ${founderName}`} width={240} height={260} className="h-64 w-full rounded-2xl object-cover md:w-[240px]" />
                    <div><p className="text-sm font-semibold text-indigo-200">Meet the founder</p><h2 className="mt-2 text-3xl font-bold">{founderName}</h2><p className="mt-5 text-base leading-7 text-indigo-50">I am a self-taught builder. I learned to create software because I wanted to solve real problems for people around me. I use modern AI tools and I personally handle every project, so you always talk to the person doing the work.</p></div>
                </section>
            ) : null}

            <section className="mt-16" aria-labelledby="how-i-work-heading">
                <h2 id="how-i-work-heading" className="text-3xl font-bold text-[var(--premium-fg)]">How I work</h2>
                <div className="mt-7 grid gap-5 md:grid-cols-3">
                    {[
                        ["I show a demo first", "You can see a working sample before you decide."],
                        ["I explain in simple language", "I explain the work in simple Telugu or English."],
                        ["I reply on WhatsApp", "You can contact the person building your project directly."],
                    ].map(([title, body]) => <article key={title} className="rounded-2xl border border-[var(--premium-border)] p-6"><CheckCircle2 className="h-6 w-6 text-indigo-700" /><h3 className="mt-4 text-lg font-semibold text-[var(--premium-fg)]">{title}</h3><p className="mt-2 text-base leading-7 text-[var(--premium-fg-muted)]">{body}</p></article>)}
                </div>
            </section>

            <section className="mt-14 rounded-2xl border border-[var(--premium-border)] p-7">
                <h2 className="text-2xl font-bold text-[var(--premium-fg)]">Where we work</h2>
                <p className="mt-3 text-base leading-7 text-[var(--premium-fg-muted)]">Serving Giddalur, Markapuram, Cumbum and nearby towns. Schools in Hyderabad can work with us online.</p>
            </section>

            <section className="mt-10 flex flex-wrap gap-3">
                {whatsapp ? <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-semibold text-[#073b1e]"><MessageCircle className="h-5 w-5" />WhatsApp</a> : null}
                {HAS_PHONE ? <a href={`tel:${COMPANY_PROFILE.phoneE164}`} className="inline-flex min-h-12 items-center gap-2 rounded-full border border-[var(--premium-border)] px-6 py-3 font-semibold text-[var(--premium-fg)]"><Phone className="h-5 w-5" />Call {COMPANY_PROFILE.phoneDisplay}</a> : null}
            </section>
        </div>
    );
}
