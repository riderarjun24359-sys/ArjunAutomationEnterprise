import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { MarketingLayout } from "@/src/modules/company-launch-kit/components/MarketingLayout";
import { whatsappLink, WHATSAPP_DEFAULT_MESSAGE } from "@/src/config/company-profile";

export default function NotFound() {
    const whatsapp = whatsappLink(WHATSAPP_DEFAULT_MESSAGE);
    return <MarketingLayout><main className="premium-container flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
        <p className="text-sm font-semibold tracking-wide text-[var(--primary)]">404</p>
        <h1 className="mt-4 text-4xl font-extrabold">We could not find that page.</h1>
        <p className="mt-4 max-w-md text-base leading-7">The link may have changed. Go back to the home page or contact us and we will help you.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/" className="inline-flex min-h-12 items-center rounded-xl bg-[var(--primary)] px-6 py-3 font-semibold text-white">Go to home</Link>
            <Link href="/contact" className="inline-flex min-h-12 items-center rounded-xl border border-[var(--border-strong)] px-6 py-3 font-semibold text-[var(--ink)]">Contact</Link>
            {whatsapp ? <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[var(--wa)] px-6 py-3 font-semibold text-white"><MessageCircle className="h-5 w-5"/>WhatsApp</a> : null}
        </div>
    </main></MarketingLayout>;
}
