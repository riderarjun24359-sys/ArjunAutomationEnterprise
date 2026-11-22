import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { buildMetadata } from "@/src/lib/seo";
import { whatsappLink } from "@/src/config/company-profile";

export const metadata: Metadata = buildMetadata({
    title: "స్కూల్ సాఫ్ట్‌వేర్",
    description: "ఫీజులు, హాజరు, హోంవర్క్, విద్యార్థుల కార్యక్రమాలు, ఫలితాలు, పేరెంట్స్ అప్‌డేట్స్ కోసం స్కూల్ మేనేజ్‌మెంట్ సాఫ్ట్‌వేర్.",
    path: "/te/school-erp",
});

const whatsapp = whatsappLink("నమస్కారం. స్కూల్ సాఫ్ట్‌వేర్ డెమో కోరాలి.");
const demoVideo = process.env.NEXT_PUBLIC_SCHOOL_DEMO_VIDEO?.trim();
const modules = ["ఫీజుల వసూళ్లు, రిమైండర్లు","పేరెంట్స్‌కు హాజరు అలర్ట్స్","అసైన్‌మెంట్లు, హోంవర్క్","ప్రాజెక్టులు, సాంస్కృతిక కార్యక్రమాలు, క్రీడల వివరాలు","ఫలితాలు, రిపోర్ట్ కార్డులు","పేరెంట్స్‌కు ప్రకటనలు","అడ్మిన్, టీచర్లు, పేరెంట్స్‌కు వేర్వేరు లాగిన్లు"];
const steps = [["1","ముందుగా వింటాం","మీ స్కూల్‌లో విద్యార్థులు, ఫీజులు, రోజువారీ పనులు ఎలా నిర్వహిస్తున్నారో తెలుసుకుంటాం."],["2","డెమో చూపిస్తాం","పనిచేసే నమూనా చూపించి, మీ స్కూల్‌కు ఏ మార్పులు కావాలో తెలుసుకుంటాం."],["3","తయారు చేస్తాం","రాతపూర్వకంగా అంగీకరించిన ఫీచర్లనే తయారు చేస్తాం."],["4","ప్రారంభించి సహాయం చేస్తాం","మీ సిబ్బందికి నేర్పించి, ప్రారంభం తర్వాత WhatsApp లో అందుబాటులో ఉంటాం."]];

export default function TeluguSchoolSoftwarePage() {
    return <div className="premium-container py-16 sm:py-20">
        <header className="max-w-3xl"><p className="text-sm font-semibold uppercase tracking-wider text-[var(--primary)]">స్కూల్ సాఫ్ట్‌వేర్</p><h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">మీ స్కూల్‌కు తగ్గట్టు స్కూల్ మేనేజ్‌మెంట్ సాఫ్ట్‌వేర్.</h1><p className="mt-5 text-lg leading-8">స్కూల్ రోజువారీ పనులన్నీ ఒకేచోట ఉంచి, ముఖ్యమైన సమాచారం పేరెంట్స్‌కు పంపండి. మీ స్కూల్ పని విధానానికి తగ్గట్టు మాడ్యూల్స్ ప్లాన్ చేస్తాం.</p><p className="mt-4 font-semibold">మీ స్కూల్ అవసరాలకు తగ్గట్టు తయారు చేస్తాం.</p><Link href="/te/contact?type=school" className="mt-7 inline-flex min-h-12 items-center rounded-xl bg-[var(--primary)] px-6 py-3 font-semibold text-white">స్కూల్ డెమో కోరండి</Link></header>
        <section className="mt-16"><h2 className="text-3xl font-extrabold">మీ స్కూల్‌లో నిర్వహించగల పనులు</h2><div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{modules.map(item=><div key={item} className="flex gap-3 rounded-2xl border border-[var(--border)] bg-white p-5 leading-7"><CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[var(--primary)]"/>{item}</div>)}</div><p className="mt-5 text-sm text-[var(--muted)]">పని ప్రారంభించే ముందు మాడ్యూల్స్‌ను రాతపూర్వకంగా అంగీకరిస్తాం.</p></section>
        <section className="mt-16 bg-[var(--surface-alt)] py-12"><h2 className="text-3xl font-extrabold">మేము ఎలా ఏర్పాటు చేస్తాం</h2><ol className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{steps.map(([n,title,body])=><li key={n} className="rounded-2xl border border-[var(--border)] bg-white p-5"><p className="font-bold text-[var(--primary)]">{n}</p><h3 className="mt-3 text-lg font-bold">{title}</h3><p className="mt-2 text-sm leading-6">{body}</p></li>)}</ol></section>
        {demoVideo ? <section className="mt-16"><p className="text-xs font-semibold text-[var(--primary)]">Demo project</p><h2 className="mt-2 text-3xl font-extrabold">స్కూల్ సాఫ్ట్‌వేర్ డెమో</h2><video className="mt-6 w-full rounded-2xl border border-[var(--border)]" controls preload="none"><source src={demoVideo}/>మీ బ్రౌజర్ వీడియోను ప్లే చేయలేకపోతోంది.</video></section> : null}
        <section className="mt-16 rounded-2xl border border-[var(--border)] p-7"><h2 className="text-2xl font-extrabold">మీ స్కూల్‌కు ఇది ఎలా ఉపయోగపడుతుందో చూడాలా?</h2><p className="mt-3 leading-7">మీ స్కూల్ గురించి, నిర్వహించాల్సిన పనుల గురించి చెప్పండి. సరిపోయే డెమో గురించి మాట్లాడుకుందాం.</p><div className="mt-6 flex flex-wrap gap-3"><Link href="/te/contact?type=school" className="inline-flex min-h-12 items-center rounded-xl bg-[var(--primary)] px-6 py-3 font-semibold text-white">స్కూల్ డెమో కోరండి</Link>{whatsapp ? <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 font-semibold text-[var(--primary)]"><MessageCircle className="h-5 w-5"/>WhatsApp</a> : null}</div></section>
    </div>;
}
