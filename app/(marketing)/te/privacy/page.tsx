import type { Metadata } from "next";
import { buildMetadata } from "@/src/lib/seo";

export const metadata: Metadata = buildMetadata({ title: "గోప్యత", description: "వెబ్‌సైట్ ఎంక్వైరీ ఫారంలో మీరు పంపే వివరాలను ఎలా ఉపయోగిస్తామో తెలుసుకోండి.", path: "/te/privacy" });
const retentionPeriod = process.env.NEXT_PUBLIC_ENQUIRY_RETENTION?.trim();

export default function TeluguPrivacyPage() {
    return <article className="premium-container max-w-3xl py-16 sm:py-20">
        <h1 className="text-4xl font-extrabold">గోప్యత</h1><p className="mt-3 text-sm text-[var(--muted)]">చివరిగా నవీకరించిన తేదీ: 22 నవంబర్ 2026</p>
        <section className="mt-8 space-y-4 leading-7">
            <h2 className="text-2xl font-bold">మీరు పంపే వివరాలు</h2><p>వెబ్‌సైట్ ఎంక్వైరీ ఫారంలో మీ పేరు, ఫోన్ నంబర్, వ్యాపార రకం, సందేశం అడుగుతాం. ఇమెయిల్ ఇవ్వడం తప్పనిసరి కాదు. మీ ఎంక్వైరీ గురించి మిమ్మల్ని సంప్రదించడానికి మీ అంగీకారాన్ని కూడా నమోదు చేస్తాం.</p>
            <h2 className="text-2xl font-bold">మీ ఎంక్వైరీ ఎక్కడికి వెళ్తుంది?</h2><p>ఇమెయిల్ పంపే సేవను సెటప్ చేసి, మీ ఎంక్వైరీ పంపడం విజయవంతమైతే, వివరాలు sales@arjunautomations.com కు పంపబడతాయి. Arjun Automation Enterprises లో ఎంక్వైరీలకు సమాధానం ఇచ్చే వ్యక్తి వాటిని చూస్తారు. ఇమెయిల్ పంపడం విఫలమైతే, WhatsApp ద్వారా సంప్రదించే అవకాశం ఫారం చూపిస్తుంది.</p>
            <h2 className="text-2xl font-bold">వివరాలను ఎలా ఉపయోగిస్తాం?</h2><p>మీరు పంపిన ఎంక్వైరీ చదవడానికి, సమాధానం ఇవ్వడానికి, దాని గురించి మళ్లీ మాట్లాడడానికి మాత్రమే ఆ వివరాలను ఉపయోగిస్తాం. సంబంధం లేని ప్రచార సందేశాల కోసం ఈ ఫారాన్ని ఉపయోగించము.</p>
            <h2 className="text-2xl font-bold">దుర్వినియోగాన్ని అడ్డుకోవడం</h2><p>ఒకే నెట్‌వర్క్ చిరునామా నుంచి ఎక్కువసార్లు ఫారం పంపకుండా సర్వర్ ఆ చిరునామాను ప్రాసెస్ చేసి, ఒకవైపు హ్యాష్‌ను పరిమితి కీగా ఉపయోగిస్తుంది.</p>
            {retentionPeriod ? <section><h2 className="text-2xl font-bold">వివరాలను ఎంతకాలం ఉంచుతాం?</h2><p>{retentionPeriod}</p></section> : null}
            <h2 className="text-2xl font-bold">మీ అభ్యర్థన</h2><p>మీరు పంపిన ఎంక్వైరీ గురించి తెలుసుకోవడానికి, సరిచేయడానికి లేదా తొలగించమని అడగడానికి sales@arjunautomations.com కు ఇమెయిల్ చేయండి. ఆ ఎంక్వైరీలో ఉపయోగించిన ఫోన్ లేదా ఇమెయిల్ వివరాన్ని తెలియజేయండి.</p>
            <h2 className="text-2xl font-bold">సంప్రదించండి</h2><p>Arjun Automation Enterprises · sales@arjunautomations.com · +91 73370 27357</p>
        </section>
    </article>;
}
