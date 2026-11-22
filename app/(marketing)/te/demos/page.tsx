import type { Metadata } from "next";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { buildMetadata } from "@/src/lib/seo";
import { whatsappLink } from "@/src/config/company-profile";

export const metadata: Metadata = buildMetadata({
    title: "డెమో ప్రాజెక్టులు",
    description: "Arjun Automation Enterprises తయారు చేసిన పనిచేసే డెమో ప్రాజెక్టులు చూడండి.",
    path: "/te/demos",
});

const supermarket = process.env.NEXT_PUBLIC_DEMO_LINK_SUPERMARKET?.trim();
const school = process.env.NEXT_PUBLIC_DEMO_LINK_SCHOOL?.trim();
const whatsapp = whatsappLink("నమస్కారం. పనిచేసే డెమో చూడాలి.");

export default function TeluguDemosPage() {
    const hasDemos = Boolean(supermarket || school);
    return <div className="premium-container py-16 sm:py-20">
        <header className="max-w-3xl"><p className="text-sm font-semibold uppercase tracking-wider text-[var(--primary)]">డెమో ప్రాజెక్టులు</p><h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">మేము ఏమి తయారు చేయగలమో చూడండి.</h1><p className="mt-5 text-lg leading-8">సాధ్యమైన విధానాన్ని చూపించడానికి తయారు చేసిన డెమోలు ఇవి. మీ అవసరాలకు తగ్గట్టు మీ సాఫ్ట్‌వేర్‌ను తయారు చేస్తాం.</p></header>
        {hasDemos ? <div className="mt-10 grid gap-5 md:grid-cols-2">
            {supermarket ? <article className="rounded-2xl border border-[var(--border)] bg-white p-7"><p className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">Demo project</p><h2 className="mt-3 text-2xl font-bold">Sri Sai Supermarket ఆర్డరింగ్ డెమో</h2><p className="mt-3 leading-7">సూపర్‌మార్కెట్ కోసం ఆన్‌లైన్ ఆర్డరింగ్ ఎలా పనిచేస్తుందో చూపించే డెమో.</p><a href={supermarket} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex min-h-11 items-center gap-2 font-semibold text-[var(--primary)]">డెమో ఓపెన్ చేయండి <ArrowUpRight className="h-4 w-4"/></a></article> : null}
            {school ? <article className="rounded-2xl border border-[var(--border)] bg-white p-7"><p className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">Demo project</p><h2 className="mt-3 text-2xl font-bold">స్కూల్ మేనేజ్‌మెంట్ డెమో</h2><p className="mt-3 leading-7">స్కూల్ వివరాలు, రోజువారీ పనులను ఒకేచోట ఎలా నిర్వహించవచ్చో చూపించే డెమో.</p><a href={school} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex min-h-11 items-center gap-2 font-semibold text-[var(--primary)]">డెమో ఓపెన్ చేయండి <ArrowUpRight className="h-4 w-4"/></a></article> : null}
        </div> : <div className="mt-10 rounded-2xl border border-[var(--border)] bg-[var(--surface-alt)] p-8"><h2 className="text-2xl font-bold">డెమోలు సిద్ధం చేస్తున్నాం.</h2><p className="mt-3 leading-7">మాకు మెసేజ్ చేయండి. పనిచేసే నమూనా చూపిస్తాం.</p>{whatsapp ? <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-xl bg-[var(--wa)] px-6 py-3 font-semibold text-white"><MessageCircle className="h-5 w-5"/>WhatsApp లో మాట్లాడండి</a> : null}</div>}
    </div>;
}
