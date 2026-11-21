import type { Metadata } from "next";
import Image from "next/image";
import { CheckCircle2, MessageCircle, Phone } from "lucide-react";
import { buildMetadata } from "@/src/lib/seo";
import { COMPANY_PROFILE, HAS_PHONE, whatsappLink, WHATSAPP_DEFAULT_MESSAGE } from "@/src/config/company-profile";

export const metadata: Metadata = buildMetadata({
    title: "మా గురించి",
    description: "Arjun Automation Enterprises ఎలా పని చేస్తుంది, స్థానిక స్కూల్స్ మరియు వ్యాపారాలకు ఎలా సహాయం చేస్తుంది.",
    path: "/te/about",
});

const founderName = process.env.NEXT_PUBLIC_FOUNDER_NAME?.trim();
const founderPhoto = process.env.NEXT_PUBLIC_FOUNDER_PHOTO?.trim();
const wa = whatsappLink(WHATSAPP_DEFAULT_MESSAGE);

export default function TeluguAboutPage() {
    return <div className="premium-container py-16 sm:py-20"><header className="max-w-3xl"><p className="text-sm font-semibold text-indigo-700">మా గురించి</p><h1 className="mt-3 text-4xl font-bold text-[var(--premium-fg)] sm:text-5xl">మీతో కలిసి పని చేసే ఒక వ్యక్తి.</h1><p className="mt-5 text-lg leading-8 text-[var(--premium-fg-muted)]">Arjun Automation Enterprises స్కూల్, కాలేజ్ మేనేజ్‌మెంట్ సాఫ్ట్‌వేర్, షాప్స్ మరియు క్లినిక్స్ కోసం WhatsApp ఆటోమేషన్, స్థానిక వ్యాపారాల కోసం వెబ్‌సైట్లు తయారు చేస్తుంది.</p></header>
        {founderName && founderPhoto ? <section className="mt-12 grid gap-8 rounded-3xl bg-indigo-950 p-8 text-white sm:grid-cols-[220px_1fr] sm:items-center"><Image src={founderPhoto} alt={`${founderName} ఫోటో`} width={220} height={240} className="h-60 w-full rounded-2xl object-cover sm:w-[220px]"/><div><h2 className="text-2xl font-bold">{founderName} పరిచయం</h2><p className="mt-5 text-base leading-7 text-indigo-50">నేను స్వయంగా నేర్చుకుని సాఫ్ట్‌వేర్ తయారు చేస్తున్నాను. నా చుట్టూ ఉన్నవారి నిజమైన సమస్యలకు పరిష్కారం చూపాలనే ఉద్దేశంతో సాఫ్ట్‌వేర్ నేర్చుకున్నాను. ఆధునిక AI టూల్స్ ఉపయోగిస్తాను. ప్రతి ప్రాజెక్ట్‌ను నేనే చూసుకుంటాను. అందుకే పని చేసే వ్యక్తితోనే మీరు నేరుగా మాట్లాడతారు.</p></div></section> : null}
        <section className="mt-16"><h2 className="text-3xl font-bold text-[var(--premium-fg)]">నేను ఎలా పని చేస్తాను</h2><div className="mt-7 grid gap-5 md:grid-cols-3">{[["ముందుగా డెమో చూపిస్తాను","మీరు నిర్ణయం తీసుకునే ముందు పనిచేసే నమూనా చూడవచ్చు."],["సులభమైన భాషలో వివరిస్తాను","పని వివరాలను తెలుగులో లేదా ఇంగ్లీష్‌లో చెబుతాను."],["WhatsApp లో సమాధానం ఇస్తాను","మీ ప్రాజెక్ట్ తయారు చేసే వ్యక్తినే నేరుగా సంప్రదించవచ్చు."]].map(([title,body])=><article key={title} className="rounded-2xl border border-[var(--premium-border)] p-6"><CheckCircle2 className="h-6 w-6 text-indigo-700"/><h3 className="mt-4 text-lg font-semibold text-[var(--premium-fg)]">{title}</h3><p className="mt-2 text-base leading-7 text-[var(--premium-fg-muted)]">{body}</p></article>)}</div></section>
        <section className="mt-14 rounded-2xl border border-[var(--premium-border)] p-7"><h2 className="text-2xl font-bold text-[var(--premium-fg)]">మేము సేవలు అందించే ప్రాంతాలు</h2><p className="mt-3 text-base leading-7 text-[var(--premium-fg-muted)]">గిద్దలూరు, మార్కాపురం, కంభం మరియు సమీప పట్టణాల్లో సేవలు అందిస్తాం. హైదరాబాద్ స్కూల్స్‌తో ఆన్‌లైన్‌లో పని చేయవచ్చు.</p></section>
        <section className="mt-10 flex flex-wrap gap-3">{wa ? <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-semibold text-[#073b1e]"><MessageCircle className="h-5 w-5"/>WhatsApp</a> : null}{HAS_PHONE ? <a href={`tel:${COMPANY_PROFILE.phoneE164}`} className="inline-flex min-h-12 items-center gap-2 rounded-full border border-[var(--premium-border)] px-6 py-3 font-semibold text-[var(--premium-fg)]"><Phone className="h-5 w-5"/>కాల్ చేయండి {COMPANY_PROFILE.phoneDisplay}</a> : null}</section>
    </div>;
}
