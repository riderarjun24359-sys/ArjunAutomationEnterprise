import type { Metadata } from "next";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { buildMetadata } from "@/src/lib/seo";
import { whatsappLink } from "@/src/config/company-profile";

export const metadata: Metadata = buildMetadata({
    title: "ధరలు",
    description: "వ్యాపార వెబ్‌సైట్ల ప్రారంభ ధరలు. స్కూల్ సాఫ్ట్‌వేర్, ఆటోమేషన్ ప్రాజెక్టులకు అవసరాన్ని బట్టి కోట్.",
    path: "/te/pricing",
});

const wa = whatsappLink("నమస్కారం. వెబ్‌సైట్ లేదా సాఫ్ట్‌వేర్ ప్రాజెక్ట్ కోసం వివరాలు, రాతపూర్వక కోట్ కావాలి.");

const plans = [
    {
        name: "స్టార్టర్ వెబ్‌సైట్",
        price: "₹25,000",
        description: "ఆన్‌లైన్‌లో ప్రొఫెషనల్‌గా కనిపించాలనుకునే చిన్న వ్యాపారాల కోసం.",
        points: ["మొబైల్‌కు సరిపోయే వ్యాపార వెబ్‌సైట్", "ప్రధాన వ్యాపార వివరాలు, సేవల పేజీలు", "WhatsApp ద్వారా సంప్రదించే అవకాశం", "పని ప్రారంభించే ముందు స్పష్టమైన స్కోప్"],
    },
    {
        name: "గ్రోత్ వెబ్‌సైట్",
        price: "₹45,000",
        description: "ఎక్కువ పేజీలు, వివరమైన కస్టమర్ ప్రయాణం అవసరమైన వ్యాపారాల కోసం.",
        points: ["విస్తృతమైన మల్టీ-పేజ్ వెబ్‌సైట్", "వివరమైన సేవలు, ఎంక్వైరీ విభాగాలు", "మొబైల్‌కు సరిపోయే డిజైన్, స్పష్టమైన నావిగేషన్", "పని ప్రారంభించే ముందు స్పష్టమైన స్కోప్"],
        featured: true,
    },
    {
        name: "కస్టమ్ సాఫ్ట్‌వేర్",
        price: "ప్రత్యేక కోట్",
        description: "స్కూల్ మేనేజ్‌మెంట్, డ్యాష్‌బోర్డులు, వర్క్‌ఫ్లో ఆటోమేషన్, ప్రత్యేక సిస్టమ్‌ల కోసం.",
        points: ["అవసరాల చర్చ, డెమో", "రాతపూర్వక ఫీచర్ లిస్ట్, డెలివరీ స్కోప్", "సరిపోయినప్పుడు ఒకేసారి లేదా నెలవారీ మోడల్", "థర్డ్-పార్టీ, కొనసాగింపు ఖర్చుల వివరాలు ముందుగానే"],
    },
];

export default function TeluguPricingPage() {
    return (
        <div className="premium-container py-16 sm:py-20">
            <header className="mx-auto max-w-3xl text-center">
                <p className="text-sm font-semibold text-indigo-300">ధరలు</p>
                <h1 className="mt-3 text-4xl font-bold tracking-tight text-[var(--premium-fg)] sm:text-5xl">మాట్లాడే ముందే ప్రారంభ ధర తెలుసుకోండి.</h1>
                <p className="mt-5 text-lg leading-8 text-[var(--premium-fg-muted)]">ఇవి వెబ్‌సైట్ ప్రాజెక్టుల ప్రారంభ ధరలు. పని ప్రారంభించే ముందు పూర్తి స్కోప్, తుది ధర రాతపూర్వకంగా ఇస్తాం.</p>
            </header>
            <div className="mt-12 grid gap-5 lg:grid-cols-3">
                {plans.map((plan) => (
                    <article key={plan.name} className={`flex flex-col rounded-2xl border p-6 ${plan.featured ? "border-blue-400 bg-[var(--premium-bg-elevated)] shadow-[var(--premium-accent-glow)]" : "border-[var(--premium-border)] bg-[var(--premium-bg-secondary)]"}`}>
                        {plan.featured ? <p className="text-xs font-bold uppercase tracking-wider text-violet-300">ఎదుగుతున్న వ్యాపారాల కోసం</p> : null}
                        <h2 className="mt-2 text-xl font-bold text-[var(--premium-fg)]">{plan.name}</h2>
                        <p className="mt-4 text-3xl font-bold text-blue-300">{plan.price}</p>
                        <p className="mt-3 min-h-14 text-sm leading-6 text-[var(--premium-fg-muted)]">{plan.description}</p>
                        <ul className="mt-6 flex-1 space-y-3">
                            {plan.points.map((point) => <li key={point} className="flex gap-3 text-sm leading-6 text-[var(--premium-fg-muted)]"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-blue-300" />{point}</li>)}
                        </ul>
                        {wa ? <a href={wa} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-[#073b1e]"><MessageCircle className="h-4 w-4" />ఈ ప్లాన్ గురించి మాట్లాడండి</a> : null}
                    </article>
                ))}
            </div>
            <p className="mx-auto mt-8 max-w-3xl text-center text-sm leading-6 text-[var(--premium-fg-muted)]">డొమైన్, హోస్టింగ్, చెల్లింపు థర్డ్-పార్టీ సేవలు, WhatsApp/API వినియోగం, కొనసాగింపు మెయింటెనెన్స్ అవసరాన్ని బట్టి వేరుగా కోట్ చేస్తాం. తుది పనులు, మినహాయింపులు, టైమ్‌లైన్, చెల్లింపు దశలు రాతపూర్వకంగా నిర్ధారిస్తాం.</p>
            <div className="mt-10 text-center">{wa ? <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-[var(--premium-border)] px-6 py-3 font-semibold text-[var(--premium-fg)]">ప్రాజెక్ట్ కోట్ పొందండి <MessageCircle className="h-4 w-4" /></a> : null}</div>
        </div>
    );
}
