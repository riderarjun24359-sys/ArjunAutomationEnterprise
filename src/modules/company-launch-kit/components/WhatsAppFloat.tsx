import { MessageCircle } from "lucide-react";
import { COMPANY_PROFILE, WHATSAPP_DEFAULT_MESSAGE, whatsappLink } from "@/src/config/company-profile";

export function WhatsAppFloat() {
    const href = whatsappLink(WHATSAPP_DEFAULT_MESSAGE);
    if (!href) return null;

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Chat with ${COMPANY_PROFILE.tradingName} on WhatsApp`}
            className="group fixed bottom-6 right-6 z-40 hidden items-center gap-3 rounded-full bg-[#25D366] px-4 py-3 text-[#0b3d1f] shadow-lg transition-transform duration-200 hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 sm:flex"
        >
            <MessageCircle aria-hidden="true" className="h-5 w-5 shrink-0" />
            <span className="text-sm font-semibold">Chat on WhatsApp</span>
        </a>
    );
}
