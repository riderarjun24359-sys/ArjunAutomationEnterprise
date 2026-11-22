"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { whatsappLink, WHATSAPP_DEFAULT_MESSAGE } from "@/src/config/company-profile";

export function WhatsAppFloat() {
    const [footerVisible, setFooterVisible] = useState(false);
    const href = whatsappLink(WHATSAPP_DEFAULT_MESSAGE);

    useEffect(() => {
        const footer = document.getElementById("site-footer");
        if (!footer) return;
        const observer = new IntersectionObserver(([entry]) => setFooterVisible(entry.isIntersecting), { threshold: 0.05 });
        observer.observe(footer);
        return () => observer.disconnect();
    }, []);

    if (!href || footerVisible) return null;

    return (
        <a href={href} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp" title="Chat on WhatsApp"
            className="fixed z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--wa)] text-white shadow-lg focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
            style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 1rem)", right: "calc(env(safe-area-inset-right, 0px) + 1rem)" }}>
            <MessageCircle className="h-6 w-6" aria-hidden="true"/>
        </a>
    );
}
