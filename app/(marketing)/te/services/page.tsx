import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle, FileText, School, CheckCircle2 } from "lucide-react";
import { buildMetadata } from "@/src/lib/seo";

export const metadata: Metadata = buildMetadata({
    title: "మా సేవలు",
    description: "స్కూల్స్, షాప్స్, క్లినిక్స్ మరియు పెరుగుతున్న వ్యాపారాల కోసం కస్టమ్ సాఫ్ట్‌వేర్, AI ఆటోమేషన్, బిజినెస్ సిస్టమ్స్.",
    path: "/te/services",
});

const sections = [
    { id: "automation", icon: MessageCircle, title: "AI ఆటోమేషన్", audience: "రోజూ ఒకే రకమైన ఆఫీస్ పనులు మళ్లీ మళ్లీ చేసే స్కూల్స్, షాప్స్, క్లినిక్స్, సర్వీస్ వ్యాపారాలు.", builds: ["అపాయింట్‌మెంట్, ఫీజు రిమైండర్లు","అనుమతుల కోసం రిక్వెస్ట్‌లు, అప్‌డేట్స్","వ్యాపార రికార్డుల నుంచి రెగ్యులర్ రిపోర్టులు","వేర్వేరు టూల్స్ మధ్య డేటా నమోదు","కస్టమర్ ఎంక్వైరీలకు ఫాలో-అప్స్","అవసరమైన చోట WhatsApp మెసేజ్‌లు"], needs: ["మీరు మళ్లీ మళ్లీ చేసే పనులకు ఉదాహరణలు","ప్రస్తుతం ఉపయోగిస్తున్న టూల్స్, రికార్డులు","ప్రతి పనిని ఎవరు చెక్ లేదా అప్రూవ్ చేస్తారు"], delivery: "ప్రస్తుతం పని ఎలా జరుగుతుందో తెలుసుకుని, పనిచేసే నమూనా చూపిస్తాం. చేయాల్సిన పనిని రాతపూర్వకంగా అంగీకరించిన తర్వాత తయారు చేసి, మీ టీమ్‌కు వివరిస్తాం." },
    { id: "software", icon: FileText, title: "కస్టమ్ సాఫ్ట్‌వేర్, వెబ్ యాప్స్", audience: "తమ పని విధానానికి తగ్గట్టు వెబ్‌సైట్, పోర్టల్ లేదా యాప్ కావాలనుకునే సంస్థలు.", builds: ["వ్యాపార వెబ్‌సైట్లు","కస్టమర్, సిబ్బంది పోర్టల్స్","ఆన్‌లైన్ ఫారాలు, ఎంక్వైరీ పేజీలు","బుకింగ్, రిక్వెస్ట్ పేజీలు","కస్టమర్ వివరాలు, బిల్లింగ్ పేజీలు","అవసరమైతే తెలుగు, ఇంగ్లీష్ పేజీలు"], needs: ["వెబ్‌సైట్ లేదా యాప్‌లో సందర్శకులు ఏం చేయాలి","ప్రతి పేజీలో ఏ సమాచారం చూపాలి","ఉపయోగించాల్సిన పాత ఫారాలు, షీట్లు, రికార్డులు"], delivery: "ముందుగా పేజీలు, ఫీచర్లు అంగీకరించి పనిచేసే నమూనా చూపిస్తాం. తర్వాత తయారు చేసి మీతో కలిసి చెక్ చేస్తాం." },
    { id: "systems", icon: School, title: "బిజినెస్ సిస్టమ్స్", audience: "స్కూల్స్, కాలేజీలు, రిటైలర్లు, సూపర్‌మార్కెట్లు, క్లినిక్స్, పెరుగుతున్న సర్వీస్ వ్యాపారాలు.", builds: ["స్కూల్, కాలేజ్ మేనేజ్‌మెంట్","విద్యార్థులు, పేరెంట్స్, సిబ్బంది వివరాలు","ఫీజులు, బిల్లులు, చెల్లింపు రికార్డులు","హాజరు, ఫలితాలు, ప్రకటనలు","కస్టమర్ వివరాలు, కొనుగోలు రికార్డులు","రోజువారీ పనుల కోసం బిజినెస్ పోర్టల్స్"], needs: ["ఈ సిస్టమ్‌ను ఉపయోగించే వ్యక్తులు","నిర్వహించాల్సిన రికార్డులు, పనులు","ముందుగా అవసరమైన మాడ్యూల్స్"], delivery: "మీతో కలిసి మాడ్యూల్స్ ప్లాన్ చేసి, పని పరిధిని రాతపూర్వకంగా అంగీకరిస్తాం. అంగీకరించిన భాగాలను తయారు చేసి, మీ టీమ్‌కు ఉపయోగించడం నేర్పిస్తాం." },
];

export default function TeluguServicesPage() {
    return <div className="premium-container py-16 sm:py-20"><header className="max-w-3xl"><p className="text-sm font-semibold uppercase tracking-wider text-[var(--primary)]">మా సేవలు</p><h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">మీ రోజువారీ పనులకు ఉపయోగపడే సాఫ్ట్‌వేర్.</h1><p className="mt-5 text-lg leading-8">మీ స్కూల్ లేదా వ్యాపారం ఎలా పనిచేస్తుందో తెలుసుకుని తయారు చేస్తాం. సులభమైన భాషలో వివరిస్తాం. పని ప్రారంభించే ముందు వివరాలు అంగీకరిస్తాం.</p></header>
        {sections.map(({id,icon:Icon,title,audience,builds,needs,delivery})=><section id={id} key={id} className="scroll-mt-24 border-b border-[var(--border)] py-14 sm:py-16"><div className="grid gap-9 lg:grid-cols-[.85fr_1.15fr]"><div><span className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--tint)] text-[var(--primary)]"><Icon className="h-6 w-6"/></span><h2 className="mt-5 text-3xl font-extrabold">{title}</h2><p className="mt-4 leading-7"><strong>ఎవరి కోసం:</strong> {audience}</p><p className="mt-5 leading-7"><strong>ఎలా తయారు చేస్తాం:</strong> {delivery}</p><Link href="/te/contact" className="mt-7 inline-flex min-h-12 items-center rounded-xl bg-[var(--primary)] px-6 py-3 font-semibold text-white">మీ ప్రాజెక్ట్ గురించి మాట్లాడండి</Link></div><div className="grid gap-7 sm:grid-cols-2"><div><h3 className="text-lg font-bold">మేము తయారు చేసేవి</h3><ul className="mt-4 space-y-3">{builds.map(item=><li key={item} className="flex gap-3 leading-7"><CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[var(--primary)]"/>{item}</li>)}</ul></div><div><h3 className="text-lg font-bold">మీ నుంచి మాకు కావాల్సినవి</h3><ul className="mt-4 list-disc space-y-3 pl-5 leading-7">{needs.map(item=><li key={item}>{item}</li>)}</ul></div></div></div></section>)}
    </div>;
}
