import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, MessageCircle, ArrowRight } from "lucide-react";
import { buildMetadata } from "@/src/lib/seo";
import { whatsappLink } from "@/src/config/company-profile";

export const metadata: Metadata = buildMetadata({
    title: "స్కూల్ మేనేజ్‌మెంట్ సాఫ్ట్‌వేర్",
    description: "ఫీజులు, హాజరు, హోంవర్క్, విద్యార్థుల కార్యక్రమాలు, ఫలితాలు మరియు పేరెంట్స్ అప్‌డేట్స్ కోసం స్కూల్ సాఫ్ట్‌వేర్.",
    path: "/te/school-erp",
});

const wa = whatsappLink("నమస్కారం. స్కూల్ మేనేజ్‌మెంట్ సాఫ్ట్‌వేర్ డెమో కావాలి.");
const demoVideo = process.env.NEXT_PUBLIC_SCHOOL_DEMO_VIDEO?.trim();
const modules = ["ఫీజులు, రిమైండర్లు","పేరెంట్స్‌కు అటెండెన్స్ అలర్ట్స్","అసైన్‌మెంట్లు, హోంవర్క్","సైన్స్ ప్రాజెక్టులు, సాంస్కృతిక కార్యక్రమాలు, క్రీడల కోసం విద్యార్థుల యాక్టివిటీ వివరాలు","ఫలితాలు, రిపోర్ట్ కార్డులు","పేరెంట్స్‌కు ప్రకటనలు","అడ్మిన్, టీచర్లు, పేరెంట్స్‌కు వేర్వేరు లాగిన్లు"];
const steps = [["1","ముందుగా వింటాం","మీ స్కూల్‌లో విద్యార్థులు, ఫీజులు, రోజువారీ పనులు ఎలా నిర్వహిస్తున్నారో తెలుసుకుంటాం."],["2","డెమో చూపిస్తాం","పనిచేసే నమూనా చూపించి, మీ స్కూల్‌కు ఏ మార్పులు కావాలో తెలుసుకుంటాం."],["3","తయారు చేస్తాం","ముందుగా అంగీకరించిన పనినే తయారు చేస్తాం."],["4","ప్రారంభించి సహాయం చేస్తాం","మీ సిబ్బందికి నేర్పించి, ప్రారంభం తర్వాత WhatsApp లో సహాయం చేస్తాం."]];

export default function TeluguSchoolSoftwarePage() {
    return <div className="premium-container py-14 sm:py-20">
        <header className="max-w-3xl"><p className="text-sm font-semibold text-indigo-700">స్కూల్స్, కాలేజీల కోసం</p><h1 className="mt-3 text-4xl font-bold tracking-tight text-[var(--premium-fg)] sm:text-5xl">పేరెంట్స్, టీచర్లు, ప్రిన్సిపల్స్ సులభంగా ఉపయోగించగల స్కూల్ మేనేజ్‌మెంట్ సాఫ్ట్‌వేర్</h1><p className="mt-5 text-lg leading-8 text-[var(--premium-fg-muted)]">స్కూల్ రోజువారీ పనులన్నీ ఒకేచోట ఉంచి, ముఖ్యమైన సమాచారం పేరెంట్స్‌కు పంపండి. మీ స్కూల్ పని విధానానికి తగ్గట్టు ఏర్పాటు చేస్తాం.</p>{wa ? <a href={wa} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-semibold text-[#073b1e]"><MessageCircle className="h-5 w-5"/>ఉచిత స్కూల్ డెమో పొందండి</a> : null}</header>
        <section className="mt-16"><h2 className="text-3xl font-bold text-[var(--premium-fg)]">మీ స్కూల్‌లో నిర్వహించగల పనులు</h2><div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{modules.map((item)=><div key={item} className="flex gap-3 rounded-2xl border border-[var(--premium-border)] p-5 text-base leading-7 text-[var(--premium-fg-muted)]"><CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-indigo-600"/>{item}</div>)}</div></section>
        <section className="mt-16 rounded-3xl bg-indigo-950 p-8 text-white sm:p-10"><h2 className="text-3xl font-bold">మేము ఎలా ఏర్పాటు చేస్తాం</h2><ol className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{steps.map(([n,t,b])=><li key={n} className="rounded-2xl border border-white/15 bg-white/5 p-5"><span className="font-bold text-indigo-200">{n}</span><h3 className="mt-3 text-lg font-semibold">{t}</h3><p className="mt-2 text-sm leading-6 text-indigo-100">{b}</p></li>)}</ol></section>
        {demoVideo ? <section className="mt-16"><p className="text-xs font-semibold text-indigo-700">Demo project</p><h2 className="mt-2 text-3xl font-bold text-[var(--premium-fg)]">స్కూల్ మేనేజ్‌మెంట్ డెమో</h2><video className="mt-6 w-full rounded-2xl border border-[var(--premium-border)]" controls preload="none"><source src={demoVideo}/>మీ బ్రౌజర్ వీడియోను ప్లే చేయలేకపోతోంది.</video></section> : null}
        <section className="mt-16 flex flex-col gap-5 rounded-2xl border border-[var(--premium-border)] p-7 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-2xl font-bold text-[var(--premium-fg)]">మీ స్కూల్ అవసరాలను బట్టి ధర ఉంటుంది.</h2><p className="mt-2 text-base text-[var(--premium-fg-muted)]">ప్లాన్లు, ధరల వివరాలు చూడండి.</p></div><Link href="/te/pricing" className="inline-flex min-h-11 items-center gap-2 font-semibold text-indigo-700">ధరలు చూడండి <ArrowRight className="h-4 w-4"/></Link></section>
    </div>;
}
