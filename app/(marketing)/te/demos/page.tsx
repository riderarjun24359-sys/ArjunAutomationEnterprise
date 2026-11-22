import type { Metadata } from "next";
import { BookOpen, ShoppingBasket, MessageCircle, ArrowUpRight } from "lucide-react";
import { buildMetadata } from "@/src/lib/seo";
import { whatsappLink } from "@/src/config/company-profile";

export const metadata: Metadata = buildMetadata({
    title: "డెమో ప్రాజెక్టులు",
    description: "సూపర్‌మార్కెట్ WhatsApp ఆర్డరింగ్ మరియు స్కూల్ మేనేజ్‌మెంట్ నమూనా ప్రాజెక్టులు చూడండి.",
    path: "/te/demos",
});

const supermarketUrl = process.env.NEXT_PUBLIC_DEMO_LINK_SUPERMARKET?.trim();
const schoolUrl = process.env.NEXT_PUBLIC_DEMO_LINK_SCHOOL?.trim();
const wa = whatsappLink("నమస్కారం. మీ డెమో ప్రాజెక్టులు చూడాలి.");

export default function TeluguDemosPage() {
    return <div className="premium-container py-16 sm:py-20"><header className="mx-auto max-w-3xl text-center"><p className="text-sm font-semibold text-indigo-700">డెమో ప్రాజెక్టులు</p><h1 className="mt-3 text-4xl font-bold text-[var(--premium-fg)] sm:text-5xl">మేము ఏమి తయారు చేయగలమో చూపించే నమూనాలు.</h1><p className="mt-5 text-lg leading-8 text-[var(--premium-fg-muted)]">ఇవి సాధ్యమైన విధానాన్ని చూపించడానికి మేము తయారు చేసిన డెమో ప్రాజెక్టులు. మీ కోసం మీ అవసరాలకు తగ్గట్టు తయారు చేస్తాం.</p></header>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
            <article className="overflow-hidden rounded-2xl border border-[var(--premium-border)]"><div className="flex min-h-52 items-center justify-center bg-indigo-50 text-indigo-700"><div className="rounded-2xl border border-indigo-100 bg-white p-8 text-center"><ShoppingBasket className="mx-auto h-12 w-12"/><p className="mt-3 font-semibold">ఆన్‌లైన్ ఆర్డర్ నమూనా</p><p className="mt-1 text-sm text-slate-500">చిత్రం కాదు, నమూనా వివరణ మాత్రమే</p></div></div><div className="p-6"><p className="text-xs font-semibold text-indigo-700">Demo project</p><h2 className="mt-2 text-2xl font-semibold text-[var(--premium-fg)]">Sri Sai Supermarket ఆర్డరింగ్ యాప్</h2><ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-[var(--premium-fg-muted)]"><li>వస్తువులు, కేటగిరీలు చూడటం</li><li>కావాల్సిన వస్తువులు కార్ట్‌లో వేయటం</li><li>WhatsApp ద్వారా ఆర్డర్ పంపటం</li></ul>{supermarketUrl ? <a href={supermarketUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-indigo-700 px-5 py-3 text-sm font-semibold text-white">డెమో ఓపెన్ చేయండి <ArrowUpRight className="h-4 w-4"/></a> : null}</div></article>
            <article className="overflow-hidden rounded-2xl border border-[var(--premium-border)]"><div className="flex min-h-52 items-center justify-center bg-indigo-50 text-indigo-700"><div className="rounded-2xl border border-indigo-100 bg-white p-8 text-center"><BookOpen className="mx-auto h-12 w-12"/><p className="mt-3 font-semibold">స్కూల్ వివరాల నమూనా</p><p className="mt-1 text-sm text-slate-500">చిత్రం కాదు, నమూనా వివరణ మాత్రమే</p></div></div><div className="p-6"><p className="text-xs font-semibold text-indigo-700">Demo project</p><h2 className="mt-2 text-2xl font-semibold text-[var(--premium-fg)]">స్కూల్ మేనేజ్‌మెంట్</h2><ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-[var(--premium-fg-muted)]"><li>విద్యార్థులు, ఫీజుల వివరాలు</li><li>హాజరు నమోదు, పేరెంట్స్ అప్‌డేట్స్</li><li>ఫలితాలు, హోంవర్క్, కార్యక్రమాలు</li></ul>{schoolUrl ? <a href={schoolUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-indigo-700 px-5 py-3 text-sm font-semibold text-white">డెమో ఓపెన్ చేయండి <ArrowUpRight className="h-4 w-4"/></a> : null}</div></article>
        </div>
        <div className="mt-12 text-center"><p className="text-base text-[var(--premium-fg-muted)]">మీ స్కూల్ లేదా వ్యాపారం కోసం డెమో చూడాలనుకుంటున్నారా?</p>{wa ? <a href={wa} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-semibold text-[#073b1e]"><MessageCircle className="h-5 w-5"/>ఉచిత డెమో పొందండి</a> : null}</div>
    </div>;
}
