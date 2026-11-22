import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { MarketingLayout } from "@/src/modules/company-launch-kit/components/MarketingLayout";
import { whatsappLink, WHATSAPP_DEFAULT_MESSAGE } from "@/src/config/company-profile";

export default function NotFound() {
    const whatsapp = whatsappLink(WHATSAPP_DEFAULT_MESSAGE);
    return (
        <MarketingLayout>
            <main className="premium-container flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
                <p className="text-sm font-semibold tracking-wide text-[var(--dos-brand-primary)]">404</p>
                <h1 className="mt-4 text-4xl font-bold text-[var(--premium-fg)]">We could not find that page.</h1>
                <p className="mt-4 max-w-md text-base leading-7 text-[var(--premium-fg-muted)]">The link may have changed. Go back to the home page or message us and we will help you.</p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                    <Link href="/" className="inline-flex min-h-11 items-center rounded-full bg-[var(--dos-brand-primary)] px-6 py-3 font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dos-border-focus)]">Go to home</Link>
                    {whatsapp ? <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-semibold text-[#073b1e] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]"><MessageCircle className="h-4 w-4" />WhatsApp us</a> : null}
                </div>
            </main>
        </MarketingLayout>
    );
}
