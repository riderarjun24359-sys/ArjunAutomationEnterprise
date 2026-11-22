import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { buildMetadata } from "@/src/lib/seo";
import { whatsappLink } from "@/src/config/company-profile";

export const metadata: Metadata = {
    ...buildMetadata({ title: "ధన్యవాదాలు", description: "మీ ఎంక్వైరీ Arjun Automation Enterprises కు పంపబడింది.", path: "/te/thank-you", noIndex: true }),
    robots: { index: false, follow: false },
};

const whatsapp = whatsappLink("నమస్కారం. వెబ్‌సైట్ ద్వారా ఎంక్వైరీ పంపాను.");

export default function TeluguThankYouPage() {
    return <div className="premium-container mx-auto max-w-2xl py-20 text-center sm:py-28">
        <CheckCircle2 className="mx-auto h-12 w-12 text-[var(--success)]"/>
        <h1 className="mt-6 text-4xl font-extrabold">ధన్యవాదాలు. మీ ఎంక్వైరీ పంపబడింది.</h1>
        <p className="mt-4 text-lg leading-8">మీ వివరాలు మాకు అందాయి. ఇంకా ఏదైనా చెప్పాలనుకుంటే నేరుగా కూడా సంప్రదించవచ్చు.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3"><Link href="/te" className="inline-flex min-h-12 items-center rounded-xl bg-[var(--primary)] px-6 py-3 font-semibold text-white">హోమ్‌కు వెళ్లండి</Link>{whatsapp ? <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[var(--wa)] px-6 py-3 font-semibold text-white"><MessageCircle className="h-5 w-5"/>WhatsApp</a> : null}</div>
    </div>;
}
