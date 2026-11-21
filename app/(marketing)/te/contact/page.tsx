import type { Metadata } from "next";
import { MessageCircle, Phone } from "lucide-react";
import { buildMetadata } from "@/src/lib/seo";
import { COMPANY_PROFILE, HAS_PHONE, whatsappLink } from "@/src/config/company-profile";
import { LocalContactForm } from "@/src/modules/company-launch-kit/components/LocalContactForm";

export const metadata: Metadata = buildMetadata({
    title: "సంప్రదించండి",
    description: "స్కూల్ మేనేజ్‌మెంట్ సాఫ్ట్‌వేర్, WhatsApp ఆటోమేషన్ లేదా వెబ్‌సైట్ గురించి మాతో మాట్లాడండి.",
    path: "/te/contact",
});

const whatsapp = whatsappLink("నమస్కారం. మీ సేవల గురించి తెలుసుకోవాలి.");

export default function TeluguContactPage() {
    return (
        <div className="premium-container grid gap-12 py-16 sm:py-20 lg:grid-cols-[.9fr_1.1fr]">
            <section>
                <p className="text-sm font-semibold text-indigo-700">సంప్రదించండి</p>
                <h1 className="mt-3 text-4xl font-bold tracking-tight text-[var(--premium-fg)] sm:text-5xl">మీకు ఏ సహాయం కావాలో చెప్పండి.</h1>
                <p className="mt-5 text-lg leading-8 text-[var(--premium-fg-muted)]">మీ స్కూల్ లేదా వ్యాపారంలో ఎక్కువ సమయం తీసుకుంటున్న పని ఏదో చెప్పండి. మీ అవసరానికి సరిపోయే డెమో చూపిస్తాం.</p>
                <div className="mt-8 space-y-4">
                    {HAS_PHONE ? <a href={`tel:${COMPANY_PROFILE.phoneE164}`} className="flex min-h-12 items-center gap-3 rounded-xl border border-[var(--premium-border)] p-4 font-semibold text-[var(--premium-fg)]"><Phone className="h-5 w-5 text-indigo-700" />కాల్ చేయండి {COMPANY_PROFILE.phoneDisplay}</a> : null}
                    {whatsapp ? <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="flex min-h-12 items-center gap-3 rounded-xl bg-[#25D366] p-4 font-semibold text-[#073b1e]"><MessageCircle className="h-5 w-5" />WhatsApp లో మాట్లాడండి</a> : null}
                </div>
                <p className="mt-8 text-base leading-7 text-[var(--premium-fg-muted)]">గిద్దలూరు, మార్కాపురం, కంభం మరియు సమీప పట్టణాల్లో సేవలు అందిస్తాం. హైదరాబాద్ స్కూల్స్‌తో ఆన్‌లైన్‌లో పని చేయవచ్చు.</p>
                <p className="mt-4 text-sm text-[var(--premium-fg-muted)]">పని దినాల్లో 24 గంటల్లోపు సమాధానం ఇస్తాం.</p>
            </section>
            <section className="rounded-3xl border border-[var(--premium-border)] bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-2xl font-bold text-[var(--premium-fg)]">మీ వివరాలు పంపండి</h2>
                <p className="mt-2 text-sm leading-6 text-[var(--premium-fg-muted)]">వివరాలు నింపండి. మీ మెసేజ్ సిద్ధంగా WhatsApp తెరుచుకుంటుంది.</p>
                {COMPANY_PROFILE.whatsappNumber ? <div className="mt-7"><LocalContactForm whatsappNumber={COMPANY_PROFILE.whatsappNumber} telugu /></div> : null}
            </section>
        </div>
    );
}
