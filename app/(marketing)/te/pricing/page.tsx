import type { Metadata } from "next";
import { CheckCircle2, MinusCircle, MessageCircle } from "lucide-react";
import { buildMetadata } from "@/src/lib/seo";
import { whatsappLink } from "@/src/config/company-profile";

export const metadata: Metadata = buildMetadata({
    title: "ధరలు",
    description: "స్థానిక వ్యాపార వెబ్‌సైట్లు, స్కూల్ మేనేజ్‌మెంట్ సాఫ్ట్‌వేర్ మరియు ప్రత్యేక ప్రాజెక్టుల ధరల వివరాలు.",
    path: "/te/pricing",
});

function envList(key: string) { return (process.env[key] ?? "").split("|").map((v)=>v.trim()).filter(Boolean); }
const localPrice = process.env.NEXT_PUBLIC_LOCAL_STARTER_PRICE?.trim();
const localIncludes = envList("NEXT_PUBLIC_LOCAL_STARTER_INCLUDES");
const localExcludes = envList("NEXT_PUBLIC_LOCAL_STARTER_EXCLUDES");
const schoolPrice = process.env.NEXT_PUBLIC_SCHOOL_PACK_PRICE?.trim();
const schoolIncludes = envList("NEXT_PUBLIC_SCHOOL_PACK_INCLUDES");
const schoolExcludes = envList("NEXT_PUBLIC_SCHOOL_PACK_EXCLUDES");
const showLocal = Boolean(localPrice && localIncludes.length && localExcludes.length);
const showSchool = Boolean(schoolPrice && schoolIncludes.length && schoolExcludes.length);
const wa = whatsappLink("నమస్కారం. నా స్కూల్ లేదా వ్యాపారం కోసం ధరలు తెలుసుకోవాలి.");

function Plan({title,price,includes,excludes}:{title:string;price:string;includes:string[];excludes:string[]}) {
    return <article className="rounded-2xl border border-[var(--premium-border)] bg-white p-6"><h2 className="text-xl font-bold text-[var(--premium-fg)]">{title}</h2><p className="mt-3 text-2xl font-bold text-indigo-800">{price}</p><h3 className="mt-7 text-sm font-semibold text-[var(--premium-fg)]">ఇందులో ఉంటాయి</h3><ul className="mt-3 space-y-2">{includes.map(x=><li key={x} className="flex gap-2 text-sm leading-6 text-[var(--premium-fg-muted)]"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-indigo-600"/>{x}</li>)}</ul><h3 className="mt-6 text-sm font-semibold text-[var(--premium-fg)]">ఇందులో ఉండవు</h3><ul className="mt-3 space-y-2">{excludes.map(x=><li key={x} className="flex gap-2 text-sm leading-6 text-[var(--premium-fg-muted)]"><MinusCircle className="mt-1 h-4 w-4 shrink-0 text-slate-400"/>{x}</li>)}</ul></article>;
}

export default function TeluguPricingPage() {
    return <div className="premium-container py-16 sm:py-20"><header className="mx-auto max-w-3xl text-center"><p className="text-sm font-semibold text-indigo-700">ధరలు</p><h1 className="mt-3 text-4xl font-bold text-[var(--premium-fg)] sm:text-5xl">ధరలు, పని వివరాలు ముందుగానే స్పష్టంగా.</h1><p className="mt-5 text-lg leading-8 text-[var(--premium-fg-muted)]">మీకు ఏం కావాలో చెప్పండి. ఏ పని చేస్తాం, ఏవి అందులో ఉండవో ముందుగానే వివరిస్తాం.</p></header>
        <div className={showLocal && showSchool ? "mt-12 grid gap-5 lg:grid-cols-3" : "mt-12 grid gap-5 md:grid-cols-2"}>
            {showLocal ? <Plan title="స్థానిక వ్యాపారాల ప్రారంభ ప్యాక్" price={`₹${localPrice} నుంచి`} includes={localIncludes} excludes={localExcludes}/> : null}
            {showSchool ? <Plan title="స్కూల్ మేనేజ్‌మెంట్ ప్యాక్" price={schoolPrice!} includes={schoolIncludes} excludes={schoolExcludes}/> : null}
            <Plan title="ప్రత్యేక ప్రాజెక్ట్" price="మీ అవసరాలు తెలుసుకున్న తర్వాత కోట్." includes={["రాతపూర్వక కోట్‌లో అంగీకరించిన పని."]} excludes={["రాతపూర్వక కోట్‌లో లేని అదనపు పని."]}/>
        </div>
        {(!showLocal || !showSchool) ? <p className="mx-auto mt-8 max-w-2xl text-center text-sm leading-6 text-[var(--premium-fg-muted)]">స్థానిక వ్యాపార వెబ్‌సైట్ లేదా స్కూల్ సాఫ్ట్‌వేర్ ధర కోసం మమ్మల్ని సంప్రదించండి. పని ప్రారంభించే ముందు తుది ధర, అందులో ఉండే పనులన్నీ రాతపూర్వకంగా అంగీకరిస్తాం.</p> : <p className="mt-8 text-center text-sm text-[var(--premium-fg-muted)]">ఇవి ప్రారంభ ధరలు మాత్రమే. పని మొదలయ్యే ముందు తుది ధర రాతపూర్వకంగా అంగీకరిస్తాం.</p>}
        <div className="mt-10 text-center">{wa ? <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-semibold text-[#073b1e]"><MessageCircle className="h-5 w-5"/>ధర అడగండి</a> : null}</div>
    </div>;
}
