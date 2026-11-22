import { MessageCircle, Phone } from "lucide-react";
import { COMPANY_PROFILE, WHATSAPP_DEFAULT_MESSAGE, whatsappLink } from "@/src/config/company-profile";

export function MobileBottomBar() {
    const whatsappHref = whatsappLink(WHATSAPP_DEFAULT_MESSAGE);
    const phoneHref = COMPANY_PROFILE.phoneE164 ? `tel:${COMPANY_PROFILE.phoneE164}` : "tel:+917337027357";

    return (
        <div className="fixed inset-x-0 bottom-0 z-[55] grid grid-cols-2 gap-2 border-t border-slate-200 bg-white/95 p-2 pb-[calc(.5rem+env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur sm:hidden">
            <a href={phoneHref} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-slate-900 px-3 text-sm font-semibold text-white">
                <Phone aria-hidden="true" className="h-4 w-4" />
                Call
            </a>
            <a href={whatsappHref ?? "https://wa.me/917337027357?text=Hi%2C%20I%20found%20Arjun%20Automation%20online.%20I%27d%20like%20to%20discuss%20automating%20operations%20for%20my%20business."} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#eaf7ef] px-3 text-sm font-semibold text-[#116b42]">
                <MessageCircle aria-hidden="true" className="h-4 w-4" />
                WhatsApp
            </a>
        </div>
    );
}
