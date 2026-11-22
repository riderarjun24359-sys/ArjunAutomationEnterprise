import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { buildMetadata } from "@/src/lib/seo";

export const metadata: Metadata = buildMetadata({
    title: "మా గురించి",
    description: "Arjun Automation Enterprises స్కూల్స్, కాలేజీలు మరియు పెరుగుతున్న వ్యాపారాలతో ఎలా పని చేస్తుందో తెలుసుకోండి.",
    path: "/te/about",
});

const founderName = process.env.NEXT_PUBLIC_FOUNDER_NAME?.trim();
const founderPhoto = process.env.NEXT_PUBLIC_FOUNDER_PHOTO?.trim();
const founderStory = process.env.NEXT_PUBLIC_FOUNDER_STORY?.trim();

export default function TeluguAboutPage() {
    const founderVisible = Boolean(founderName && founderPhoto && founderStory);
    return <div className="premium-container py-16 sm:py-20">
        <header className="max-w-3xl"><p className="text-sm font-semibold uppercase tracking-wider text-[var(--primary)]">మా గురించి</p><h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">మీతో కలిసి పని చేసే ఒక వ్యక్తి.</h1><p className="mt-5 text-lg leading-8">Arjun Automation Enterprises ఒకే వ్యవస్థాపకుడు నిర్వహించే సంస్థ. ఆంధ్రప్రదేశ్, తెలంగాణలోని సంస్థల కోసం కస్టమ్ సాఫ్ట్‌వేర్, AI ఆటోమేషన్, బిజినెస్ సిస్టమ్స్ తయారు చేస్తుంది.</p></header>
        {founderVisible ? <section className="mt-12 grid gap-8 rounded-2xl border border-[var(--border)] p-7 sm:grid-cols-[220px_1fr] sm:items-center"><Image src={founderPhoto!} alt={`${founderName} ఫోటో`} width={220} height={240} className="h-60 w-full rounded-2xl object-cover sm:w-[220px]"/><div><p className="text-sm font-semibold text-[var(--primary)]">వ్యవస్థాపకుడి పరిచయం</p><h2 className="mt-2 text-3xl font-extrabold">{founderName}</h2><p className="mt-4 leading-7">{founderStory}</p></div></section> : null}
        <section className="mt-16"><h2 className="text-3xl font-extrabold">నేను ఎలా పని చేస్తాను</h2><div className="mt-7 grid gap-5 md:grid-cols-3">{[["ముందుగా డెమో చూపిస్తాను","మీరు నిర్ణయం తీసుకునే ముందు పనిచేసే నమూనా చూడవచ్చు."],["సులభమైన భాషలో వివరిస్తాను","పని వివరాలను తెలుగులో లేదా ఇంగ్లీష్‌లో చెబుతాను."],["WhatsApp లో అందుబాటులో ఉంటాను","మీ ప్రాజెక్ట్ తయారు చేసే వ్యక్తినే నేరుగా సంప్రదించవచ్చు."]].map(([title,body])=><article key={title} className="rounded-2xl border border-[var(--border)] p-6"><CheckCircle2 className="h-6 w-6 text-[var(--primary)]"/><h3 className="mt-4 text-lg font-bold">{title}</h3><p className="mt-2 leading-7">{body}</p></article>)}</div></section>
        <section className="mt-14 rounded-2xl bg-[var(--surface-alt)] p-7"><h2 className="text-2xl font-extrabold">మేము సేవలు అందించే ప్రాంతం</h2><p className="mt-3 leading-7">ఆంధ్రప్రదేశ్, తెలంగాణ రాష్ట్రాల్లో సేవలు అందిస్తాం.</p></section>
        <Link href="/te/contact" className="mt-9 inline-flex min-h-12 items-center rounded-xl bg-[var(--primary)] px-6 py-3 font-semibold text-white">మీ ప్రాజెక్ట్ గురించి మాట్లాడండి</Link>
    </div>;
}
