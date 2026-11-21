import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2, GraduationCap, MessageCircle, Phone, ShoppingBag, Globe2 } from "lucide-react";
import { buildMetadata } from "@/src/lib/seo";
import { COMPANY_PROFILE, HAS_PHONE, whatsappLink } from "@/src/config/company-profile";

export const metadata: Metadata = buildMetadata({
    title: "స్కూల్ సాఫ్ట్‌వేర్ మరియు WhatsApp ఆటోమేషన్",
    description: "ప్రకాశం జిల్లా మరియు హైదరాబాద్ స్కూల్స్, షాప్స్, క్లినిక్స్ కోసం ఫీజు రిమైండర్లు, అటెండెన్స్ అలర్ట్స్, ఆన్‌లైన్ ఆర్డర్లు మరియు స్కూల్ సాఫ్ట్‌వేర్.",
    path: "/te",
});

const wa = whatsappLink("నమస్కారం. మీ వెబ్‌సైట్ చూశాను. మీ సేవల గురించి తెలుసుకోవాలి.");
const schoolWa = whatsappLink("నమస్కారం. స్కూల్ మేనేజ్‌మెంట్ సాఫ్ట్‌వేర్ డెమో కావాలి.");
const founderName = process.env.NEXT_PUBLIC_FOUNDER_NAME?.trim();
const founderPhoto = process.env.NEXT_PUBLIC_FOUNDER_PHOTO?.trim();

const faqs = [
    ["టెక్నాలజీ గురించి నాకు తెలియాలా?", "అవసరం లేదు. మేమే సెటప్ చేసి, మీ సిబ్బందికి సులభమైన తెలుగులో లేదా ఇంగ్లీష్‌లో నేర్పిస్తాం."],
    ["ముందుగా డెమో చూడవచ్చా?", "అవును. మీరు నిర్ణయం తీసుకునే ముందు పనిచేసే డెమో చూపిస్తాం."],
    ["పని పూర్తి కావడానికి ఎంత సమయం పడుతుంది?", "మీ అవసరాన్ని బట్టి సమయం మారుతుంది. వివరాలు తెలుసుకున్న తర్వాత స్పష్టమైన తేదీ చెబుతాం."],
    ["ఏదైనా పనిచేయడం ఆగితే?", "WhatsApp లో మెసేజ్ చేయండి. పని దినాల్లో 24 గంటల్లోపు సమాధానం ఇస్తాం."],
    ["మా డేటా సురక్షితంగా ఉంటుందా?", "మీ సిస్టమ్ ఎలా ఏర్పాటు చేస్తున్నామో దాని ఆధారంగా వివరాలు మారుతాయి. ప్రారంభించే ముందు డేటా ఎక్కడ ఉంటుంది, ఎవరు చూడగలరు, బ్యాకప్ ఎలా ఉంటుందో వివరిస్తాం."],
    ["మీకు తెలుగు వచ్చా?", "అవును. మేము తెలుగులో, ఇంగ్లీష్‌లో మాట్లాడగలం."],
];

export default function TeluguHomePage() {
    return (
        <>
            <section className="bg-[var(--premium-bg)]">
                <div className="premium-container grid gap-10 py-16 sm:py-20 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
                    <div>
                        <p className="inline-flex rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-800">స్కూల్స్, షాప్స్, క్లినిక్స్ కోసం సాఫ్ట్‌వేర్ మరియు WhatsApp ఆటోమేషన్</p>
                        <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-[var(--premium-fg)] sm:text-5xl">పేరెంట్స్, కస్టమర్ల వెనుక పరుగులు ఆపండి. WhatsApp చూసుకుంటుంది.</h1>
                        <p className="mt-6 text-lg leading-8 text-[var(--premium-fg-muted)]">ఫీజు రిమైండర్లు, అటెండెన్స్ అలర్ట్స్, ఆర్డర్లు, ఎంక్వైరీలు ఆటోమేటిక్‌గా వెళ్తాయి. మీరు మీ స్కూల్ లేదా షాప్ ఎదుగుదలపై దృష్టి పెట్టండి.</p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            {wa ? <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-semibold text-[#073b1e]"><MessageCircle className="h-5 w-5" />WhatsApp లో మాట్లాడండి</a> : null}
                            <Link href="/te/demos" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-[var(--premium-border)] px-6 py-3 font-semibold text-[var(--premium-fg)]">డెమోలు చూడండి <ArrowRight className="h-4 w-4" /></Link>
                        </div>
                        <div className="mt-8 flex flex-wrap gap-5 text-sm font-medium text-[var(--premium-fg-muted)]"><span>తెలుగు, ఇంగ్లీష్ మద్దతు</span><span>WhatsApp ఆధారంగా</span><span>ముందుగా డెమో చూడండి</span></div>
                    </div>
                    <div className="rounded-3xl border border-indigo-100 bg-indigo-50 p-6 sm:p-8">
                        <div className="rounded-2xl bg-white p-5 shadow-sm"><p className="font-semibold text-slate-900">WhatsApp మెసేజ్ ఉదాహరణ</p><div className="mt-5 rounded-2xl rounded-tl-sm bg-emerald-50 p-4 text-sm leading-7 text-emerald-950">నమస్కారం! మీ స్కూల్ ఫీజు చెల్లింపు తేదీ దగ్గరపడుతోంది. ఏదైనా సహాయం కావాలంటే స్కూల్ ఆఫీస్‌ను సంప్రదించండి.</div><p className="mt-4 text-xs text-slate-500">ఇది ఉదాహరణ మెసేజ్ మాత్రమే. నిజమైన కస్టమర్ సంభాషణ కాదు.</p></div>
                    </div>
                </div>
            </section>

            <section className="border-y border-[var(--premium-border)] bg-[var(--premium-bg-secondary)]"><div className="premium-container py-10"><div className="grid gap-4 text-base leading-7 text-[var(--premium-fg-muted)] md:grid-cols-3"><p>ఫీజుల కోసం ఒక్కో పేరెంట్‌కు ఫోన్ చేయడం.</p><p>WhatsApp ఆర్డర్లు మిస్ అవడం.</p><p>అపాయింట్‌మెంట్లు, ఎంక్వైరీలు నోట్‌బుక్స్‌లో రాయడం.</p></div><p className="mt-6 text-lg font-semibold text-[var(--premium-fg)]">ఇలాంటి పనులు మీకు తెలియకుండానే సులభంగా జరిగేలా మేము సిస్టమ్‌లు తయారు చేస్తాం.</p></div></section>

            <section className="premium-container py-16"><p className="text-sm font-semibold text-indigo-700">మా సేవలు</p><h2 className="mt-3 text-3xl font-bold text-[var(--premium-fg)]">మీ రోజువారీ పనులకు ఉపయోగపడే సాఫ్ట్‌వేర్.</h2><div className="mt-8 grid gap-5 md:grid-cols-3">
                <article className="rounded-2xl border border-[var(--premium-border)] p-6"><GraduationCap className="h-8 w-8 text-indigo-700" /><h3 className="mt-4 text-xl font-semibold">స్కూల్, కాలేజ్ మేనేజ్‌మెంట్</h3><p className="mt-3 text-base leading-7 text-[var(--premium-fg-muted)]">ఫీజులు, హాజరు, ఫలితాలు, పేరెంట్స్‌కు సమాచారం — అన్నీ ఒకేచోట. పేరెంట్స్‌కు WhatsApp మెసేజ్‌లు ఆటోమేటిక్‌గా వెళ్తాయి.</p><Link href="/te/services#school" className="mt-5 inline-flex min-h-11 items-center gap-2 font-semibold text-indigo-700">మరింత తెలుసుకోండి <ArrowRight className="h-4 w-4" /></Link></article>
                <article className="rounded-2xl border border-[var(--premium-border)] p-6"><ShoppingBag className="h-8 w-8 text-indigo-700" /><h3 className="mt-4 text-xl font-semibold">షాప్స్, క్లినిక్స్ కోసం WhatsApp ఆటోమేషన్</h3><p className="mt-3 text-base leading-7 text-[var(--premium-fg-muted)]">WhatsApp లో ఆర్డర్లు, అపాయింట్‌మెంట్లు తీసుకోండి. ప్రతి మెసేజ్‌ను మీరే టైప్ చేయకుండా రిమైండర్లు, ఆఫర్లు పంపండి.</p><Link href="/te/services#whatsapp" className="mt-5 inline-flex min-h-11 items-center gap-2 font-semibold text-indigo-700">మరింత తెలుసుకోండి <ArrowRight className="h-4 w-4" /></Link></article>
                <article className="rounded-2xl border border-[var(--premium-border)] p-6"><Globe2 className="h-8 w-8 text-indigo-700" /><h3 className="mt-4 text-xl font-semibold">మీ వ్యాపారం కోసం వెబ్‌సైట్</h3><p className="mt-3 text-base leading-7 text-[var(--premium-fg-muted)]">తెలుగు, ఇంగ్లీష్‌లో వేగంగా ఓపెన్ అయ్యే వెబ్‌సైట్. కస్టమర్లు WhatsApp లో మిమ్మల్ని సంప్రదించగలరు.</p><Link href="/te/services#website" className="mt-5 inline-flex min-h-11 items-center gap-2 font-semibold text-indigo-700">మరింత తెలుసుకోండి <ArrowRight className="h-4 w-4" /></Link></article>
            </div></section>

            <section className="bg-indigo-950 text-white"><div className="premium-container py-16"><h2 className="text-3xl font-bold">మీ స్కూల్ పనులన్నీ ఒకేచోట నిర్వహించండి</h2><ul className="mt-7 grid gap-4 sm:grid-cols-2">{["ఫీజుల వివరాలు, రిమైండర్లు","రోజువారీ హాజరు, పేరెంట్స్‌కు WhatsApp అలర్ట్","అసైన్‌మెంట్లు, హోంవర్క్","సైన్స్ ప్రాజెక్టులు, కార్యక్రమాలు, సాంస్కృతిక మరియు క్రీడా కార్యకలాపాలు","ఫలితాలు, రిపోర్ట్ కార్డులు","పేరెంట్స్ అందరికీ ప్రకటనలు","అడ్మిన్, టీచర్లు, పేరెంట్స్‌కు వేర్వేరు లాగిన్లు"].map((item) => <li key={item} className="flex gap-3 text-base leading-7 text-indigo-50"><CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-emerald-300" />{item}</li>)}</ul><p className="mt-7 text-lg font-medium">మీ స్కూల్‌కు ఏం కావాలో చెప్పండి. మీ అవసరానికి తగ్గట్టు తయారు చేస్తాం.</p>{schoolWa ? <a href={schoolWa} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-semibold text-[#073b1e]"><MessageCircle className="h-5 w-5" />స్కూల్ డெమో ఉచితంగా పొందండి</a> : null}</div></section>

            <section className="premium-container py-16"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-semibold text-indigo-700">డెమో ప్రాజెక్టులు</p><h2 className="mt-3 text-3xl font-bold text-[var(--premium-fg)]">మేము తయారు చేసిన నమూనాలు</h2></div><Link href="/te/demos" className="font-semibold text-indigo-700">అన్ని డెమోలు చూడండి</Link></div><div className="mt-8 grid gap-5 md:grid-cols-2"><article className="rounded-2xl border border-[var(--premium-border)] p-6"><p className="text-xs font-semibold text-indigo-700">Demo project</p><h3 className="mt-3 text-xl font-semibold">Sri Sai Supermarket - WhatsApp ఆన్‌లైన్ ఆర్డర్లు</h3><p className="mt-3 text-base leading-7 text-[var(--premium-fg-muted)]">వస్తువులు చూడటం, కార్ట్‌లో వేయటం, WhatsApp ద్వారా ఆర్డర్ పంపటం.</p></article><article className="rounded-2xl border border-[var(--premium-border)] p-6"><p className="text-xs font-semibold text-indigo-700">Demo project</p><h3 className="mt-3 text-xl font-semibold">స్కూల్ మేనేజ్‌మెంట్ డెమో</h3><p className="mt-3 text-base leading-7 text-[var(--premium-fg-muted)]">విద్యార్థుల వివరాలు, ఫీజులు, హాజరు, పేరెంట్స్ అప్‌డేట్స్.</p></article></div></section>

            <section className="bg-[var(--premium-bg-secondary)]"><div className="premium-container py-16"><h2 className="text-3xl font-bold text-[var(--premium-fg)]">మేము ఎలా పని చేస్తాం</h2><ol className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{[["1","ముందుగా వింటాం","మీకు ఏ పని ఇబ్బంది పెడుతుందో అర్థం చేసుకుంటాం."],["2","డెమో చూపిస్తాం","నిర్ణయం తీసుకునే ముందు పనిచేసే నమూనా చూపిస్తాం."],["3","తయారు చేస్తాం","మీకు అవసరమైన పనినే తయారు చేస్తాం."],["4","ప్రారంభించి సహాయం చేస్తాం","మీ సిబ్బందికి నేర్పించి, ప్రారంభం తర్వాత WhatsApp లో సహాయం చేస్తాం."]].map(([n,t,b])=><li key={n} className="rounded-2xl border border-[var(--premium-border)] bg-white p-6"><span className="font-bold text-indigo-700">{n}</span><h3 className="mt-3 text-lg font-semibold text-[var(--premium-fg)]">{t}</h3><p className="mt-2 text-base leading-7 text-[var(--premium-fg-muted)]">{b}</p></li>)}</ol></div></section>

            {founderName && founderPhoto ? <section className="premium-container py-16"><div className="grid gap-7 rounded-3xl bg-indigo-950 p-8 text-white sm:grid-cols-[200px_1fr] sm:items-center"><Image src={founderPhoto} alt={`${founderName} ఫోటో`} width={200} height={220} className="h-56 w-full rounded-2xl object-cover sm:w-[200px]" /><div><h2 className="text-2xl font-bold">{founderName} పరిచయం</h2><p className="mt-4 text-base leading-7 text-indigo-50">నేను స్వయంగా నేర్చుకుని సాఫ్ట్‌వేర్ తయారు చేస్తున్నాను. నా చుట్టూ ఉన్నవారి నిజమైన సమస్యలకు పరిష్కారం చూపాలనే ఉద్దేశంతో సాఫ్ట్‌వేర్ నేర్చుకున్నాను. ఆధునిక AI టూల్స్ ఉపయోగిస్తాను. ప్రతి ప్రాజెక్ట్‌ను నేనే చూసుకుంటాను. అందుకే పని చేసే వ్యక్తితోనే మీరు నేరుగా మాట్లాడతారు.</p></div></div></section> : null}

            <section className="premium-container py-12"><h2 className="text-2xl font-bold text-[var(--premium-fg)]">మేము సేవలు అందించే ప్రాంతాలు</h2><p className="mt-3 text-base leading-7 text-[var(--premium-fg-muted)]">గిద్దలూరు, మార్కాపురం, కంభం మరియు సమీప పట్టణాల్లో సేవలు అందిస్తాం. హైదరాబాద్‌లోని స్కూల్స్‌తో ఆన్‌లైన్‌లో పని చేయవచ్చు.</p></section>

            <section id="faq" className="premium-container py-16"><h2 className="text-3xl font-bold text-[var(--premium-fg)]">సాధారణ ప్రశ్నలు</h2><div className="mt-7 divide-y divide-[var(--premium-border)] border-y border-[var(--premium-border)]">{faqs.map(([q,a])=><details key={q} className="py-5"><summary className="cursor-pointer text-lg font-semibold text-[var(--premium-fg)]">{q}</summary><p className="mt-3 text-base leading-7 text-[var(--premium-fg-muted)]">{a}</p></details>)}</div></section>

            <section className="bg-indigo-950 text-white"><div className="premium-container flex flex-col gap-6 py-14 sm:flex-row sm:items-center sm:justify-between"><h2 className="max-w-2xl text-3xl font-bold">మీ సమయాన్ని ఎక్కువగా తీసుకుంటున్న పని ఏదో చెప్పండి. దాన్ని ఎలా సులభం చేయాలో చూపిస్తాం.</h2><div className="flex flex-wrap gap-3">{wa ? <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 font-semibold text-[#073b1e]"><MessageCircle className="h-5 w-5" />WhatsApp</a> : null}{HAS_PHONE ? <a href={`tel:${COMPANY_PROFILE.phoneE164}`} className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/30 px-5 py-3 font-semibold text-white"><Phone className="h-5 w-5" />కాల్ చేయండి</a> : null}</div></div></section>
        </>
    );
}
