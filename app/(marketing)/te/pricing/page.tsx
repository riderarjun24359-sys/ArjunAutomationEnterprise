import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { buildMetadata } from "@/src/lib/seo";
import { whatsappLink } from "@/src/config/company-profile";

export const metadata: Metadata = buildMetadata({
    title: "ధరలు ఎలా నిర్ణయిస్తాం",
    description: "ప్రతి సాఫ్ట్‌వేర్ ప్రాజెక్ట్ ప్రారంభానికి ముందు పని వివరాలు, రాతపూర్వక కోట్ ఇస్తాం.",
    path: "/te/pricing",
});

const whatsapp = whatsappLink("నమస్కారం. నా ప్రాజెక్ట్ గురించి మాట్లాడి రాతపూర్వక కోట్ కావాలి.");

export default function TeluguPricingPage() {
    return <div className="premium-container py-16 sm:py-20">
        <header className="max-w-3xl"><p className="text-sm font-semibold uppercase tracking-wider text-[var(--primary)]">ధరలు</p><h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">మీకు కావాల్సిన పనిని బట్టి ధర ఉంటుంది.</h1><p className="mt-5 text-lg leading-8">ముందుగా మీ అవసరాలు తెలుసుకుంటాం. పని ప్రారంభించే ముందు రాతపూర్వక కోట్ ఇస్తాం.</p></header>
        <section className="mt-10 grid gap-5 md:grid-cols-3">
            {[["1","మీ అవసరం చెప్పండి","మీ సాఫ్ట్‌వేర్ లేదా వెబ్‌సైట్ ఏం చేయాలో వివరించండి."],["2","రాతపూర్వక కోట్ పొందండి","ఏ పని చేస్తాం, ఎంత ఖర్చు అవుతుంది, కొనసాగించే ఖర్చులు ఏమైనా ఉంటే వివరిస్తాం."],["3","మీరు నిర్ణయం తీసుకోండి","పని వివరాలు, కోట్ చూసి అంగీకరించిన తర్వాతే ప్రారంభిస్తాం."]].map(([n,title,body])=><article key={n} className="rounded-2xl border border-[var(--border)] bg-white p-6"><p className="text-sm font-bold text-[var(--primary)]">{n}</p><h2 className="mt-3 text-xl font-bold">{title}</h2><p className="mt-3 leading-7">{body}</p></article>)}
        </section>
        <section className="mt-14 max-w-3xl"><h2 className="text-2xl font-bold">ధరను ఏవి నిర్ణయిస్తాయి?</h2><ul className="mt-5 list-disc space-y-3 pl-6 leading-7"><li>ఎంతమంది ఉపయోగిస్తారు, ఎన్ని మాడ్యూల్స్ కావాలి</li><li>ఇతర సేవలతో కలపాల్సిన అవసరం ఉందా</li><li>పాత రికార్డులను కొత్త సిస్టమ్‌లోకి మార్చాలా</li><li>ప్రారంభించిన తర్వాత ఎంత సహాయం కావాలి</li></ul><p className="mt-6 leading-7">పని ప్రారంభించే ముందు రాతపూర్వక కోట్ ఇస్తాం. డొమైన్, హోస్టింగ్, చెల్లింపు సేవలు, మెసేజ్ వినియోగం లేదా కొనసాగించే సహాయం ఖర్చులు వర్తిస్తే విడిగా వివరిస్తాం.</p></section>
        <div className="mt-10 flex flex-wrap gap-3"><Link href="/te/contact" className="inline-flex min-h-12 items-center rounded-xl bg-[var(--primary)] px-6 py-3 font-semibold text-white">మీ ప్రాజెక్ట్ గురించి మాట్లాడండి</Link>{whatsapp ? <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[var(--wa)] px-6 py-3 font-semibold text-white"><MessageCircle className="h-5 w-5"/>WhatsApp</a> : null}</div>
    </div>;
}
