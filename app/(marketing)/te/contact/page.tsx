import type { Metadata } from "next";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { buildMetadata } from "@/src/lib/seo";
import { COMPANY_PROFILE, whatsappLink } from "@/src/config/company-profile";
import { LocalContactForm } from "@/src/modules/company-launch-kit/components/LocalContactForm";

export const metadata: Metadata = buildMetadata({
    title: "సంప్రదించండి",
    description: "కస్టమ్ సాఫ్ట్‌వేర్, స్కూల్ మేనేజ్‌మెంట్ సాఫ్ట్‌వేర్ లేదా AI ఆటోమేషన్ గురించి మాతో మాట్లాడండి.",
    path: "/te/contact",
});

const whatsapp = whatsappLink("నమస్కారం. మీ సాఫ్ట్‌వేర్ లేదా ఆటోమేషన్ సేవల గురించి మాట్లాడాలి.");

export default function TeluguContactPage() {
    return (
        <div className="premium-container grid gap-12 py-16 sm:py-20 lg:grid-cols-[.9fr_1.1fr]">
            <section>
                <p className="text-sm font-semibold text-[var(--primary)]">సంప్రదించండి</p>
                <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">మీకు ఏ సహాయం కావాలో చెప్పండి.</h1>
                <p className="mt-5 text-lg leading-8">మీ స్కూల్ లేదా వ్యాపారంలో ఎక్కువ సమయం తీసుకుంటున్న పని ఏదో చెప్పండి. మీ అవసరాన్ని తెలుసుకుని ఎక్కడ మొదలుపెట్టాలో సూచిస్తాం.</p>
                <div className="mt-8 flex flex-col gap-4">
                    {whatsapp ? <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="flex min-h-12 items-center gap-3 rounded-xl bg-[var(--wa)] p-4 font-semibold text-white"><MessageCircle className="h-5 w-5"/>WhatsApp · +91 73370 27357</a> : null}
                    <a href="tel:+917337027357" className="flex min-h-12 items-center gap-3 rounded-xl border border-[var(--border-strong)] p-4 font-semibold text-[var(--ink)]"><Phone className="h-5 w-5 text-[var(--primary)]"/>కాల్ · +91 73370 27357</a>
                    <a href="mailto:sales@arjunautomations.com" className="flex min-h-12 items-center gap-3 rounded-xl border border-[var(--border-strong)] p-4 font-semibold text-[var(--ink)]"><Mail className="h-5 w-5 text-[var(--primary)]"/>sales@arjunautomations.com</a>
                </div>
                <p className="mt-8 text-base leading-7">ఆంధ్రప్రదేశ్, తెలంగాణ రాష్ట్రాల్లో సేవలు అందిస్తాం.</p>
                <p className="mt-3 text-sm text-[var(--muted)]">తెలుగు, ఇంగ్లీష్‌లో మాట్లాడవచ్చు.</p>
            </section>
            <section className="rounded-3xl border border-[var(--border)] bg-white p-6 sm:p-8">
                <h2 className="text-2xl font-bold">ఎంక్వైరీ పంపండి</h2>
                <p className="mt-2 text-sm leading-6 text-[var(--body)]">కొన్ని వివరాలు పంపండి. మీ ఎంక్వైరీ మా సేల్స్ ఇమెయిల్‌కు వస్తుంది.</p>
                <div className="mt-7"><LocalContactForm whatsappNumber={COMPANY_PROFILE.whatsappNumber} telugu/></div>
            </section>
        </div>
    );
}
