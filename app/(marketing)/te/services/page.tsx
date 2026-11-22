import type { Metadata } from "next";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { buildMetadata } from "@/src/lib/seo";
import { whatsappLink } from "@/src/config/company-profile";

export const metadata: Metadata = buildMetadata({
    title: "మా సేవలు",
    description: "స్కూల్ మేనేజ్‌మెంట్ సాఫ్ట్‌వేర్, షాప్స్ మరియు క్లినిక్స్ కోసం WhatsApp ఆటోమేషన్, వ్యాపార వెబ్‌సైట్లు.",
    path: "/te/services",
});

const schoolWa = whatsappLink("నమస్కారం. స్కూల్ మేనేజ్‌మెంట్ సాఫ్ట్‌వేర్ గురించి మాట్లాడాలి.");
const shopWa = whatsappLink("నమస్కారం. మా షాప్ లేదా క్లినిక్ కోసం WhatsApp ఆటోమేషన్ కావాలి.");
const webWa = whatsappLink("నమస్కారం. మా వ్యాపారం కోసం వెబ్‌సైట్ కావాలి.");

function Section({ id, title, audience, items, needs, wa, button }: { id: string; title: string; audience: string; items: string[]; needs: string[]; wa: string | null; button: string }) {
    return <section id={id} className="scroll-mt-24 border-b border-[var(--premium-border)] py-14"><h2 className="text-3xl font-bold text-[var(--premium-fg)]">{title}</h2><p className="mt-4 text-base leading-7 text-[var(--premium-fg-muted)]"><strong className="text-[var(--premium-fg)]">ఎవరి కోసం:</strong> {audience}</p><div className="mt-7 grid gap-8 sm:grid-cols-2"><div><h3 className="text-lg font-semibold text-[var(--premium-fg)]">మీకు ఉపయోగాలు</h3><ul className="mt-4 space-y-3">{items.map((item)=><li key={item} className="flex gap-3 text-base leading-7 text-[var(--premium-fg-muted)]"><CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-indigo-600"/>{item}</li>)}</ul></div><div><h3 className="text-lg font-semibold text-[var(--premium-fg)]">మీ నుంచి మాకు కావాల్సినవి</h3><ul className="mt-4 list-disc space-y-3 pl-5 text-base leading-7 text-[var(--premium-fg-muted)]">{needs.map((item)=><li key={item}>{item}</li>)}</ul></div></div>{wa ? <a href={wa} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-semibold text-[#073b1e]"><MessageCircle className="h-5 w-5"/>{button}</a> : null}</section>;
}

export default function TeluguServicesPage() {
    return <div className="premium-container py-14 sm:py-20"><header className="max-w-3xl"><p className="text-sm font-semibold text-indigo-700">మా సేవలు</p><h1 className="mt-3 text-4xl font-bold text-[var(--premium-fg)] sm:text-5xl">రోజువారీ పనులు సులభం చేసే సాఫ్ట్‌వేర్.</h1><p className="mt-5 text-lg leading-8 text-[var(--premium-fg-muted)]">మీ స్కూల్ లేదా వ్యాపారం ఎలా పనిచేస్తుందో తెలుసుకుని, మీ అవసరానికి తగ్గట్టు తయారు చేస్తాం. ముందుగా డెమో చూసి తర్వాత నిర్ణయం తీసుకోవచ్చు.</p></header>
        <Section id="school" title="స్కూల్, కాలేజ్ మేనేజ్‌మెంట్" audience="విద్యార్థుల వివరాలు, ఫీజులు, హాజరు ఒకేచోట నిర్వహించాలనుకునే స్కూల్ యాజమాన్యం, ప్రిన్సిపల్స్, ఆఫీస్ సిబ్బంది." items={["విద్యార్థులు, పేరెంట్స్ వివరాలు ఒకేచోట ఉంచడం","ఫీజుల వివరాలు నమోదు చేసి పెండింగ్ ఫీజుల గురించి గుర్తు చేయడం","రోజువారీ హాజరు నమోదు చేసి పేరెంట్స్‌కు సమాచారం పంపడం","హోంవర్క్, అసైన్‌మెంట్లు, ఫలితాలు, రిపోర్ట్ కార్డులు పంచుకోవడం","పేరెంట్స్ అందరికీ స్కూల్ ప్రకటనలు పంపడం"]} needs={["క్లాసులు, విద్యార్థుల వివరాలు","ఫీజుల వివరాలు, చెల్లింపు విధానం","ప్రస్తుతం హాజరు ఎలా నమోదు చేస్తున్నారు","పేరెంట్స్‌కు ఏ సమాచారం పంపాలో వివరాలు"]} wa={schoolWa} button="ఉచిత స్కూల్ డెమో పొందండి"/>
        <Section id="whatsapp" title="షాప్స్, క్లినిక్స్ కోసం WhatsApp ఆటోమేషన్" audience="WhatsApp ద్వారా కస్టమర్లతో మాట్లాడే షాప్స్, సూపర్‌మార్కెట్లు, క్లినిక్స్." items={["WhatsApp లో ఆర్డర్లు తీసుకోవడం","అపాయింట్‌మెంట్లు బుక్ చేయడం","రిమైండర్లు పంపడం","ఆఫర్లను ఒకేసారి పంపడం","సాధారణ ప్రశ్నలకు సులభమైన సమాధానాలు పంపడం"]} needs={["మీ వ్యాపార సమయాలు","మీ వస్తువులు లేదా సేవలు, ధరలు","అవసరమైతే అపాయింట్‌మెంట్ సమయాలు","కస్టమర్లు తరచుగా అడిగే ప్రశ్నలు"]} wa={shopWa} button="WhatsApp గురించి మాట్లాడండి"/>
        <Section id="website" title="మీ వ్యాపారం కోసం వెబ్‌సైట్" audience="ఫోన్‌లో సులభంగా ఓపెన్ అయ్యే వెబ్‌సైట్ కావాలనుకునే స్థానిక వ్యాపారాలు." items={["మీ సేవలు, వస్తువులు, పని సమయాలు చూపించడం","కస్టమర్లు కాల్ లేదా WhatsApp చేయగలిగేలా ఏర్పాటు చేయడం","మీ ప్రాంతం, లొకేషన్ వివరాలు చూపించడం","కస్టమర్లు వివరాలు పంపే సులభమైన ఫారం","తెలుగు, ఇంగ్లీష్‌లో సమాచారం చూపించడం"]} needs={["వ్యాపారం పేరు, లోగో ఉంటే అది","ఫోటోలు, సేవల వివరాలు","ఫోన్ నంబర్, లొకేషన్","కస్టమర్లకు చూపించాల్సిన ధరలు, ఇతర వివరాలు"]} wa={webWa} button="వెబ్‌సైట్ గురించి మాట్లాడండి"/>
    </div>;
}
