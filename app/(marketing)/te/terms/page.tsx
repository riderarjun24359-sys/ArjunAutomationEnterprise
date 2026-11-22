import type { Metadata } from "next";
import { buildMetadata } from "@/src/lib/seo";

export const metadata: Metadata = buildMetadata({
    title: "నిబంధనలు",
    description: "Arjun Automation Enterprises వెబ్‌సైట్ ఉపయోగం, సాఫ్ట్‌వేర్ ప్రాజెక్టుల గురించి నిబంధనలు.",
    path: "/te/terms",
});

export default function TeluguTermsPage() {
    return <article className="premium-container max-w-3xl py-16 sm:py-20">
        <h1 className="text-4xl font-extrabold">నిబంధనలు</h1><p className="mt-3 text-sm text-[var(--muted)]">చివరిగా నవీకరించిన తేదీ: 22 నవంబర్ 2026</p>
        <section className="mt-8 space-y-4 leading-7">
            <h2 className="text-2xl font-bold">వెబ్‌సైట్ సమాచారం</h2>
            <p>ఈ వెబ్‌సైట్‌లో Arjun Automation Enterprises అందించే కస్టమ్ సాఫ్ట్‌వేర్, AI ఆటోమేషన్, బిజినెస్ సిస్టమ్స్ గురించి సాధారణ సమాచారం ఉంటుంది. వెబ్‌సైట్‌లోని సమాచారం ఒక్కటే ప్రాజెక్ట్ ప్రతిపాదన కాదు.</p>
            <h2 className="text-2xl font-bold">పని పరిధి, చెల్లింపు</h2>
            <p>పని ప్రారంభించే ముందు ఏ ఫీచర్లు తయారు చేస్తాం, ధర, చెల్లింపు దశలు, పని పూర్తయ్యే ప్రణాళిక, కొనసాగించే ఖర్చులు ఏమైనా ఉంటే వాటిని రాతపూర్వకంగా అంగీకరించాలి. చర్చ లేదా డెమో చూపించడం మాత్రమే ప్రాజెక్ట్ ఒప్పందం కాదు.</p>
            <h2 className="text-2xl font-bold">మీరు ఇచ్చే వివరాలు</h2>
            <p>ప్రాజెక్ట్ కోసం మీరు పంపే టెక్స్ట్, ఫోటోలు, రికార్డులు మరియు ఇతర విషయాలను ఉపయోగించడానికి మీకు అనుమతి ఉందని మీరు నిర్ధారించాలి.</p>
            <h2 className="text-2xl font-bold">సంప్రదించండి</h2>
            <p>ఈ నిబంధనల గురించి సందేహాలుంటే sales@arjunautomations.com కు ఇమెయిల్ చేయండి లేదా +91 73370 27357 కు కాల్ చేయండి.</p>
        </section>
    </article>;
}
