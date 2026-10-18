import { MessageCircle } from "lucide-react";
import {
    COMPANY_PROFILE,
    WHATSAPP_DEFAULT_MESSAGE,
    whatsappLink,
} from "@/src/config/company-profile";

/**
 * Floating WhatsApp enquiry button.
 *
 * WHY
 * ---
 * The target market for this business — Indian SMEs, coaching centres, clinics,
 * distributors — lives on WhatsApp, not email. An audit of all 46 marketing
 * pages found zero `wa.me` / `api.whatsapp` links, while the contact page asked
 * people to fill in a form and wait for an email reply.
 *
 * SAFETY
 * ------
 * The button renders nothing at all until a real phone number is configured in
 * `src/config/company-profile.ts` (via `NEXT_PUBLIC_COMPANY_PHONE`). We never
 * ship a placeholder number — a dead WhatsApp link is worse than no link,
 * because it silently loses the enquiry.
 *
 * Accessibility: the label is explicit, the target meets touch-size guidance,
 * and the control is keyboard reachable with a visible focus ring.
 */
export function WhatsAppFloat() {
    const href = whatsappLink(WHATSAPP_DEFAULT_MESSAGE);

    if (!href) return null;

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Chat with ${COMPANY_PROFILE.tradingName} on WhatsApp`}
            className="group fixed bottom-5 right-5 z-40 flex items-center gap-3 rounded-full bg-[#25D366] px-4 py-3 text-[#0b3d1f] shadow-[0_10px_30px_rgba(37,211,102,0.35)] transition-transform duration-200 hover:scale-[1.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--premium-bg, #0a0a0b)] sm:bottom-7 sm:right-7"
        >
            <MessageCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
            <span className="hidden text-sm font-semibold sm:inline">Chat on WhatsApp</span>
        </a>
    );
}
